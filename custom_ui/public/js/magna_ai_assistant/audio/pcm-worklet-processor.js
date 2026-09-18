// pcm-worklet-processor.js
// Runs on the audio render thread (off the main thread, unlike a
// ScriptProcessorNode) -- captures mic input, downsamples it to the
// fixed rate OpenAI's Realtime API expects regardless of what rate the
// browser's AudioContext actually granted (most hardware defaults to
// 44100/48000Hz, never exactly 24000), converts to PCM16LE, and posts
// each ~50ms chunk back to the main thread as a transferable buffer.

const TARGET_SAMPLE_RATE = 24000;
const CHUNK_MS = 50;

class PCMWorkletProcessor extends AudioWorkletProcessor {
    constructor() {
        super();
        this._inputSampleRate = sampleRate; // global in AudioWorkletGlobalScope
        this._ratio = this._inputSampleRate / TARGET_SAMPLE_RATE;
        this._chunkSize = Math.round(TARGET_SAMPLE_RATE * (CHUNK_MS / 1000));
        this._buffer = [];
        this._resamplePos = 0;
    }

    // Linear-interpolation downsample from the context's native rate to
    // TARGET_SAMPLE_RATE, appending Int16 samples into this._buffer.
    _resampleAndBuffer(channelData) {
        const inLen = channelData.length;
        let pos = this._resamplePos;
        while (pos < inLen - 1) {
            const idx = Math.floor(pos);
            const frac = pos - idx;
            const sample = channelData[idx] * (1 - frac) + channelData[idx + 1] * frac;
            const clamped = Math.max(-1, Math.min(1, sample));
            this._buffer.push(clamped < 0 ? clamped * 0x8000 : clamped * 0x7fff);
            pos += this._ratio;
        }
        this._resamplePos = pos - inLen;
    }

    process(inputs) {
        const input = inputs[0];
        if (!input || !input[0]) return true;
        this._resampleAndBuffer(input[0]);

        while (this._buffer.length >= this._chunkSize) {
            const chunkSamples = this._buffer.splice(0, this._chunkSize);
            const int16 = new Int16Array(chunkSamples.length);
            for (let i = 0; i < chunkSamples.length; i++) int16[i] = chunkSamples[i];
            this.port.postMessage(int16.buffer, [int16.buffer]);
        }
        return true;
    }
}

registerProcessor('pcm-worklet-processor', PCMWorkletProcessor);
