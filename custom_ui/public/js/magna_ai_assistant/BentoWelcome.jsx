// magna_ai_assistant/BentoWelcome.jsx
import React from 'react';
import { motion } from 'framer-motion';

// Premium Lucide-React SVG Asset components tuned for ERP Workflows
const UsersIcon = ({ strokeColor }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={strokeColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
);

const TrendingUpIcon = ({ strokeColor }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={strokeColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/>
        <polyline points="16 7 22 7 22 13"/>
    </svg>
);

const BuildingIcon = ({ strokeColor }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={strokeColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <rect width="16" height="20" x="4" y="2" rx="2" ry="2"/>
        <path d="M9 22v-4h6v4"/>
        <path d="M8 6h.01"/>
        <path d="M16 6h.01"/>
        <path d="M12 6h.01"/>
        <path d="M12 10h.01"/>
        <path d="M12 14h.01"/>
        <path d="M16 10h.01"/>
        <path d="M16 14h.01"/>
        <path d="M8 10h.01"/>
        <path d="M8 14h.01"/>
    </svg>
);

const ShoppingBagIcon = ({ strokeColor }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={strokeColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/>
        <path d="M3 6h18"/>
        <path d="M16 10a4 4 0 0 1-8 0"/>
    </svg>
);

export default function BentoWelcome({ onCardClick }) {
    const cards = [
        { 
            title: "Get All Employee Data", 
            desc: "View headcount, department distributions, designation details, and active directory.", 
            icon: (color) => <UsersIcon strokeColor={color} />,
            theme: {
                accent: "#0ea5e9", // Sky Blue
                border: "rgba(14, 165, 233, 0.25)",
                hoverBorder: "#0ea5e9",
                glow: "rgba(14, 165, 233, 0.25)",
                iconBg: "rgba(14, 165, 233, 0.15)"
            }
        },
        { 
            title: "Check Total Leads & Pipeline", 
            desc: "Analyze conversion rates, prospective deal values, and lead status metrics.", 
            icon: (color) => <TrendingUpIcon strokeColor={color} />,
            theme: {
                accent: "#a855f7", // Violet
                border: "rgba(168, 85, 247, 0.25)",
                hoverBorder: "#a855f7",
                glow: "rgba(168, 85, 247, 0.25)",
                iconBg: "rgba(168, 85, 247, 0.15)"
            }
        },
        { 
            title: "About Customers & Accounts", 
            desc: "Explore customer profiles, active contracts, account histories, and billing status.", 
            icon: (color) => <BuildingIcon strokeColor={color} />,
            theme: {
                accent: "#10b981", // Emerald
                border: "rgba(16, 185, 129, 0.25)",
                hoverBorder: "#10b981",
                glow: "rgba(16, 185, 129, 0.25)",
                iconBg: "rgba(16, 185, 129, 0.15)"
            }
        },
        { 
            title: "Check Purchase Orders", 
            desc: "Track supplier orders, pending approvals, vendor payments, and inventory status.", 
            icon: (color) => <ShoppingBagIcon strokeColor={color} />,
            theme: {
                accent: "#f97316", // Orange
                border: "rgba(249, 115, 22, 0.25)",
                hoverBorder: "#f97316",
                glow: "rgba(249, 115, 22, 0.25)",
                iconBg: "rgba(249, 115, 22, 0.15)"
            }
        }
    ];

    return (
        <motion.div 
            initial="hidden" 
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
            style={{
                display: 'grid', 
                gridTemplateColumns: 'repeat(2, 1fr)', 
                gap: '16px',
                width: '100%', 
                maxWidth: '620px', 
                margin: '0 auto',
                padding: '4px',
                boxSizing: 'border-box'
            }}
        >
            {cards.map((card, idx) => (
                <motion.div
                    key={idx}
                    variants={{ 
                        hidden: { opacity: 0, y: 16 }, 
                        visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 22 } } 
                    }}
                    whileHover={{ 
                        y: -5,
                        scale: 1.02,
                        borderColor: card.theme.hoverBorder,
                        boxShadow: `0 16px 32px -6px ${card.theme.glow}`
                    }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onCardClick(card.title)}
                    className="magna-glass-card"
                    style={{
                        border: `1px solid ${card.theme.border}`,
                        borderRadius: '16px', 
                        padding: '16px 18px', 
                        cursor: 'pointer',
                        textAlign: 'left', 
                        display: 'flex', 
                        flexDirection: 'column',
                        justifyContent: 'space-between', 
                        height: '130px', 
                        boxSizing: 'border-box',
                        position: 'relative',
                        overflow: 'hidden',
                        backdropFilter: 'blur(20px) saturate(140%)',
                        boxShadow: '0 4px 20px -6px rgba(0, 0, 0, 0.05)',
                        transition: 'border-color 0.25s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.25s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}
                >
                    {/* SMOOTH CONTINUOUS PULSING RADIAL GLOW */}
                    <motion.div 
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.15, 0.28, 0.15]
                        }}
                        transition={{
                            duration: 4 + idx, // Staggered speeds so loops feel natural
                            repeat: Infinity,
                            ease: 'easeInOut'
                        }}
                        style={{
                            position: 'absolute',
                            top: '-20px',
                            right: '-20px',
                            width: '90px',
                            height: '90px',
                            borderRadius: '50%',
                            background: card.theme.accent,
                            filter: 'blur(22px)',
                            pointerEvents: 'none',
                            zIndex: 1
                        }}
                    />

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px', zIndex: 2 }}>
                        <h3 style={{ 
                            fontSize: '13.5px', 
                            fontWeight: '650', 
                            color: 'var(--text-color, #0f172a)',
                            margin: 0, 
                            letterSpacing: '-0.2px',
                            lineHeight: '1.4',
                            flex: 1
                        }}>
                            {card.title}
                        </h3>
                        
                        {/* Dynamic Icon Container */}
                        <motion.div 
                            whileHover={{ scale: 1.08 }}
                            style={{ 
                                backgroundColor: card.theme.iconBg, 
                                border: `1px solid ${card.theme.border}`,
                                boxShadow: `0 2px 6px -1px rgba(0, 0, 0, 0.05)`,
                                width: '28px', 
                                height: '28px', 
                                borderRadius: '8px',
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center', 
                                flexShrink: 0,
                                transition: 'transform 0.2s ease'
                            }}
                        >
                            {card.icon(card.theme.accent)}
                        </motion.div>
                    </div>

                    <p style={{ 
                        fontSize: '11px', 
                        color: 'var(--text-muted, #475569)',
                        lineHeight: '1.5', 
                        margin: 0, 
                        fontWeight: '450',
                        overflow: 'hidden',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        zIndex: 2
                    }}>
                        {card.desc}
                    </p>
                </motion.div>
            ))}
        </motion.div>
    );
}