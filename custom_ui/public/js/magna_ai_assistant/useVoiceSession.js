/**
 * useVoiceSession.js — WebRTC Direct-to-OpenAI voice hook
 *
 * Status: 'idle' | 'connecting' | 'active' | 'tool_calling' | 'error'
 *
 * Usage:
 *   const { status, transcript, start, stop, mute } = useVoiceSession({
 *     sessionId, userId, apiBase, onMessage, onError
 *   });
 */

import { useCallback, useEffect, useRef, useState } from 'react';

const OPENAI_REALTIME_URL = 'https://api.openai.com/v1/realtime';

export function useVoiceSession({ sessionId, userId, apiBase, onMessage, onError }) {
  const [status, setStatus] = useState('idle');
  const [transcript, setTranscript] = useState('');

  const peerRef = useRef(null);
  const dataChannelRef = useRef(null);
  const audioElRef = useRef(null);
  const micStreamRef = useRef(null);
  const sessionConfigRef = useRef(null);

  const sendEvent = useCallback((event) => {
    const dc = dataChannelRef.current;
    if (dc && dc.readyState === 'open') dc.send(JSON.stringify(event));
  }, []);

  const handleError = useCallback((msg, err) => {
    console.error('[useVoiceSession]', msg, err);
    setStatus('error');
    onError?.(msg, err);
  }, [onError]);

  const executeTool = useCallback(async (callId, toolName, args) => {
    setStatus('tool_calling');
    try {
      const resp = await fetch(`${apiBase}/api/voice/session/${sessionId}/tool`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tool_name: toolName, args, call_id: callId }),
      });
      const data = await resp.json();
      sendEvent({ type: 'conversation.item.create', item: { type: 'function_call_output', call_id: callId, output: data.result ?? 'No result.' } });
    } catch (err) {
      sendEvent({ type: 'conversation.item.create', item: { type: 'function_call_output', call_id: callId, output: `Tool failed: ${err.message}` } });
    } finally {
      sendEvent({ type: 'response.create' });
      setStatus('active');
    }
  }, [apiBase, sessionId, sendEvent]);

  const handleMsg = useCallback((event) => {
    let msg; try { msg = JSON.parse(event.data); } catch { return; }
    if (msg.type === 'session.created') {
      const cfg = sessionConfigRef.current;
      if (cfg) { sendEvent(cfg.session_update); (cfg.conversation_history ?? []).forEach(i => sendEvent(i)); }
      setStatus('active');
    } else if (msg.type === 'response.audio_transcript.delta') {
      setTranscript(p => p + (msg.delta ?? ''));
    } else if (msg.type === 'response.audio_transcript.done') {
      setTranscript(''); onMessage?.(msg.transcript ?? '');
    } else if (msg.type === 'response.function_call_arguments.done') {
      let args = {}; try { args = JSON.parse(msg.arguments ?? '{}'); } catch {}
      executeTool(msg.call_id, msg.name, args);
    } else if (msg.type === 'input_audio_buffer.speech_started') {
      setTranscript('');
    } else if (msg.type === 'error') {
      handleError(`OpenAI: ${msg.error?.message}`, msg.error);
    }
  }, [sendEvent, executeTool, handleError, onMessage]);

  const start = useCallback(async () => {
    if (status !== 'idle' && status !== 'error') return;
    setStatus('connecting'); setTranscript('');
    try {
      const t = await (await fetch(`${apiBase}/api/voice/session/start`, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ session_id: sessionId, user_id: userId }) })).json();
      const cfg = await (await fetch(`${apiBase}/api/voice/session/${sessionId}/config`)).json();
      sessionConfigRef.current = cfg;
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      micStreamRef.current = stream;
      const pc = new RTCPeerConnection(); peerRef.current = pc;
      const el = document.createElement('audio'); el.autoplay = true; audioElRef.current = el;
      pc.ontrack = e => { if (e.track.kind === 'audio') el.srcObject = e.streams[0]; };
      stream.getAudioTracks().forEach(tr => pc.addTrack(tr, stream));
      const dc = pc.createDataChannel('oai-events'); dataChannelRef.current = dc;
      dc.onmessage = handleMsg;
      dc.onclose = () => setStatus(s => s !== 'idle' ? 'idle' : s);
      const offer = await pc.createOffer(); await pc.setLocalDescription(offer);
      const sdp = await (await fetch(`${OPENAI_REALTIME_URL}?model=gpt-4o-realtime-preview-2024-12-17`, {
        method: 'POST', headers: { 'Authorization': `Bearer ${t.ephemeral_token}`, 'Content-Type': 'application/sdp' }, body: offer.sdp
      })).text();
      await pc.setRemoteDescription({ type: 'answer', sdp });
    } catch (err) { handleError('Failed to start voice session', err); }
  }, [status, apiBase, sessionId, userId, handleMsg, handleError]);

  const mute = useCallback((v = true) => {
    micStreamRef.current?.getAudioTracks().forEach(t => { t.enabled = !v; });
  }, []);

  const stop = useCallback(async () => {
    dataChannelRef.current?.close(); peerRef.current?.close();
    micStreamRef.current?.getTracks().forEach(t => t.stop());
    if (audioElRef.current) audioElRef.current.srcObject = null;
    dataChannelRef.current = null; peerRef.current = null; micStreamRef.current = null;
    try { await fetch(`${apiBase}/api/voice/session/${sessionId}`, { method: 'DELETE' }); } catch {}
    setStatus('idle'); setTranscript('');
  }, [apiBase, sessionId]);

  useEffect(() => () => { stop(); }, [stop]);
  return { status, transcript, start, stop, mute };
}
