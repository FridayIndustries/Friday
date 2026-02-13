import React, { useEffect, useRef } from 'react';

const ChatModule = ({
    messages,
    inputValue,
    setInputValue,
    handleSend,
    isModularMode,
    activeDragElement,
    position,
    width = 672, // default max-w-2xl
    height,
    onMouseDown
}) => {
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    return (
        <div
            id="chat"
            onMouseDown={onMouseDown}
            className={`absolute px-6 py-4 pointer-events-auto transition-all duration-200 friday-panel rounded-2xl
            ${isModularMode ? (activeDragElement === 'chat' ? 'ring-2 ring-green-500' : 'ring-1 ring-yellow-500/30') : ''}
        `}
            style={{
                left: position.x,
                top: position.y,
                transform: 'translate(-50%, 0)', // Aligned top-center
                width: width,
                height: height
            }}
        >
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 pointer-events-none mix-blend-overlay"></div>

            <div
                className="flex flex-col gap-3 overflow-y-auto mb-4 scrollbar-hide mask-image-gradient relative z-10"
                style={{ height: height ? `calc(${height}px - 70px)` : '15rem' }}
            >
                {messages.slice(-10).map((msg, i) => (
                    <div key={i} className="text-sm border-l-2" style={{borderColor: 'rgba(255,138,26,0.18)'}}>
                        <div className="flex items-center gap-2 pl-3 py-1">
                            <span className="text-[11px] font-mono opacity-60">[{msg.time}]</span>
                            <span className="font-bold neon-accent">{msg.sender}</span>
                        </div>
                        <div className="text-gray-300 mt-1 leading-relaxed pl-3 pr-2">{msg.text}</div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            <div className="flex gap-2 relative z-10 absolute bottom-4 left-6 right-6">
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleSend}
                    placeholder="INITIALIZE COMMAND..."
                    className="flex-1 btn-option rounded-lg p-3 text-sm backdrop-blur-sm"
                />
            </div>
            {isModularMode && <div className={`absolute -top-6 left-0 text-xs font-bold tracking-widest ${activeDragElement === 'chat' ? 'text-green-500' : 'text-yellow-500/50'}`}>CHAT MODULE</div>}
        </div>
    );
};

export default ChatModule;
