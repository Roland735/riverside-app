

const Loading = () => {
    return (
        <div className="flex justify-center items-center h-32 w-full ">
            <div className="loader">
                <div className="dot1"></div>
                <div className="dot2"></div>
                <div className="dot3"></div>
            </div>

            <style jsx>{`
                .loader {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 1rem;
                }

                .dot1, .dot2, .dot3 {
                    width: 1.5rem;
                    height: 1.5rem;
                    background-color: #dc2626; /* Tailwind's blue-600 */
                    border-radius: 50%;
                    animation: bounce 1.4s infinite ease-in-out both;
                }

                .dot2 {
                    animation-delay: -0.32s;
                }

                .dot3 {
                    animation-delay: -0.16s;
                }

                @keyframes bounce {
                    0%, 80%, 100% {
                        transform: scale(0);
                    }
                    40% {
                        transform: scale(1);
                    }
                }
            `}</style>
        </div>
    );
};

export default Loading;
