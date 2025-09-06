import React from 'react';

const AnimatedBackground: React.FC = () => {
    return (
        <>
            <style>
            {`
                .celestial-background {
                    position: fixed;
                    width: 100vw;
                    height: 100vh;
                    top: 0;
                    left: 0;
                    background: #111827; /* bg-brand-gray-900 */
                    overflow: hidden;
                    z-index: 0;
                }

                .gradient-blob {
                    position: absolute;
                    width: 50vmax;
                    height: 50vmax;
                    background-image: radial-gradient(circle at center, rgba(59, 130, 246, 0.5), rgba(59, 130, 246, 0));
                    border-radius: 50%;
                    filter: blur(100px);
                    animation: move 20s infinite alternate;
                }

                .blob-1 {
                    top: -20%;
                    left: -20%;
                    animation-duration: 25s;
                }

                .blob-2 {
                    bottom: -20%;
                    right: -20%;
                    background-image: radial-gradient(circle at center, rgba(139, 92, 246, 0.4), rgba(139, 92, 246, 0));
                    animation-duration: 20s;
                    animation-delay: -10s;
                }
                
                .blob-3 {
                    bottom: 20%;
                    left: 10%;
                     background-image: radial-gradient(circle at center, rgba(34, 197, 94, 0.3), rgba(34, 197, 94, 0));
                    animation-duration: 30s;
                    animation-delay: -5s;
                }

                @keyframes move {
                    from {
                        transform: translate(0, 0) scale(1);
                    }
                    to {
                        transform: translate(10vw, 20vh) scale(1.2);
                    }
                }
            `}
            </style>
            <div className="celestial-background">
                <div className="gradient-blob blob-1"></div>
                <div className="gradient-blob blob-2"></div>
                <div className="gradient-blob blob-3"></div>
            </div>
        </>
    );
};

export default AnimatedBackground;