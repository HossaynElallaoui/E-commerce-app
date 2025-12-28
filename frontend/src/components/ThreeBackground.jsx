import React from 'react';

const ThreeBackground = () => {
    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: -1,
            background: 'radial-gradient(circle at 50% 50%, #0d0d0e 0%, #050505 100%)',
            pointerEvents: 'none',
            overflow: 'hidden'
        }}>
            {/* Elegant Golden Particles */}
            {[...Array(60)].map((_, i) => (
                <div
                    key={i}
                    style={{
                        position: 'absolute',
                        width: Math.random() < 0.1 ? '3px' : '1.5px',
                        height: Math.random() < 0.1 ? '3px' : '1.5px',
                        background: i % 3 === 0 ? '#d4af37' : '#fff',
                        borderRadius: '50%',
                        top: `${Math.random() * 100}%`,
                        left: `${Math.random() * 100}%`,
                        opacity: 0.1 + Math.random() * 0.4,
                        boxShadow: i % 10 === 0 ? '0 0 10px #d4af37' : 'none',
                        animation: `float ${10 + Math.random() * 20}s infinite linear`
                    }}
                />
            ))}
            <style>
                {`
                @keyframes float {
                    0% { transform: translateY(0) translateX(0) scale(1); }
                    33% { transform: translateY(-30px) translateX(20px) scale(1.1); }
                    66% { transform: translateY(-10px) translateX(-20px) scale(0.9); }
                    100% { transform: translateY(0) translateX(0) scale(1); }
                }
                `}
            </style>
        </div>
    );
};

export default ThreeBackground;
