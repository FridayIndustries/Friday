import React, { useEffect, useRef } from 'react';
import { Globe, X } from 'lucide-react';

const BrowserWindow = ({ imageSrc, logs, onClose, socket }) => {
    const [input, setInput] = React.useState('');
    const logsEndRef = useRef(null);

    // Auto-scroll logs to bottom
    useEffect(() => {
        if (logsEndRef.current) {
            logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [logs]);

    const handleSend = () => {
        if (!input.trim()) return;
        if (socket) {
            socket.emit('prompt_web_agent', { prompt: input });
            // Optionally add a local log
            // But usually backend sends logs back.
        }
        setInput('');
    };

    const getDataUri = (b64) => {
        if (!b64) return null;
        // PNG base64 often starts with "iVB" (iVBORw0...), JPEG often starts with "/9j/"
        if (b64.startsWith('iVB') || b64.startsWith('iVBOR')) return `data:image/png;base64,${b64}`;
        if (b64.startsWith('/9j/')) return `data:image/jpeg;base64,${b64}`;
        // Fallback to png
        return `data:image/png;base64,${b64}`;
    };

    const imgSrc = getDataUri(imageSrc);

    return (
        <div className="w-full h-full relative group bg-[#111] rounded-lg overflow-hidden flex flex-col border border-gray-800">
            {/* Header Bar - Drag Handle */}
            <div data-drag-handle className="h-8 friday-panel flex items-center justify-between px-3 shrink-0 cursor-grab active:cursor-grabbing">
                <div className="flex items-center gap-3 text-xs font-mono">
                    <Globe size={14} className="neon-accent" />
                    <div className="flex flex-col leading-none">
                        <span className="text-xs neon-accent">F.R.I.D.A.Y — Web</span>
                        <span className="text-[10px] text-gray-400">Browser Stream</span>
                    </div>
                </div>
                <button onClick={onClose} className="hover:bg-red-500/20 text-gray-400 hover:text-red-400 p-1 rounded transition-colors">
                    <X size={14} />
                </button>
            </div>

            {/* Browser Content */}
            <div className="flex-1 relative bg-black flex items-center justify-center overflow-hidden">
                {imgSrc ? (
                    <img
                        src={imgSrc}
                        alt="Browser View"
                        className="max-w-full max-h-full object-contain"
                    />
                ) : (
                    <div className="flex flex-col items-center gap-2">
                        <div className="text-gray-600 text-xs font-mono animate-pulse">Waiting for browser stream...</div>
                    </div>
                )}
            </div>

            {/* Input Bar */}
            <div className="h-10 bg-[#161616] border-t border-gray-800 flex items-center px-2 gap-2">
                <span className="text-cyan-500 font-mono text-xs">{'>'}</span>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Enter command for Web Agent..."
                    className="flex-1 bg-transparent border-none outline-none text-gray-300 text-xs font-mono placeholder-gray-600"
                />
            </div>

            {/* Logs Overlay (Bottom) */}
            <div className="h-24 bg-black/90 backdrop-blur border-t border-gray-800 p-2 font-mono text-[10px] overflow-y-auto text-green-500/80">
                {logs.map((log, i) => (
                    <div key={i} className="mb-1 border-l-2 border-cyan-900 pl-1 break-words">
                        <span className="opacity-50 mr-2">[{new Date().toLocaleTimeString().split(' ')[0]}]</span>
                        {log}
                    </div>
                ))}
                <div ref={logsEndRef} />
            </div>
        </div>
    );
};

export default BrowserWindow;
