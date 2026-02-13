import React, { useEffect, useRef, useState } from 'react';
import { Mic, X } from 'lucide-react';

const HologramSphere = ({ socket, onClose }) => {
    const [listening, setListening] = useState(false);
    const [supported, setSupported] = useState(false);
    const [lastResult, setLastResult] = useState('');
    const recognitionRef = useRef(null);

    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            setSupported(false);
            return;
        }
        setSupported(true);
        const r = new SpeechRecognition();
        r.continuous = false;
        r.interimResults = false;
        r.lang = 'fr-FR';

        r.onresult = (ev) => {
            const text = Array.from(ev.results).map(r => r[0].transcript).join(' ');
            setLastResult(text);
            if (socket && socket.emit) socket.emit('hologram_voice', { text });
            // stop listening UI
            setListening(false);
        };

        r.onend = () => {
            setListening(false);
        };

        r.onerror = () => setListening(false);

        recognitionRef.current = r;
        return () => {
            try { recognitionRef.current && recognitionRef.current.stop(); } catch { }
            recognitionRef.current = null;
        };
    }, [socket]);

    const startListening = async () => {
        if (!recognitionRef.current) return;
        try {
            await navigator.mediaDevices.getUserMedia({ audio: true });
            recognitionRef.current.start();
            setListening(true);
            setLastResult('');
        } catch (err) {
            console.error('Mic permission error', err);
            setListening(false);
        }
    };

    const stopListening = () => {
        try { recognitionRef.current && recognitionRef.current.stop(); } catch { }
        setListening(false);
    };

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

            <div className="relative w-[520px] max-w-full p-6 rounded-3xl friday-panel border border-orange-900/8 shadow-[0_0_40px_rgba(255,138,0,0.16)]">
                <button onClick={onClose} className="absolute top-3 right-3 p-1.5 rounded hover:bg-black/10">
                    <X size={18} />
                </button>

                <div className="flex flex-col items-center gap-4">
                    <div className="relative w-64 h-64 flex items-center justify-center">
                        <div className={`hologram-orb ${listening ? 'listening' : ''}`} />
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="text-xs neon-accent tracking-widest">Holographic Interface</div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => (listening ? stopListening() : startListening())}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${listening ? 'bg-red-600 text-white' : 'bg-black/10 text-orange-300'}`}
                        >
                            <Mic size={16} />
                            {listening ? 'Listening...' : 'Speak (voice only)'}
                        </button>

                        <div className="text-xs text-gray-300">{supported ? '' : 'Speech recognition not supported in this browser.'}</div>
                    </div>

                    <div className="w-full mt-2 text-sm text-gray-200 bg-black/10 p-2 rounded text-left h-12 overflow-auto">
                        {lastResult ? <span className="text-orange-300">"{lastResult}"</span> : <span className="text-gray-400">Awaiting speech input...</span>}
                    </div>
                </div>

                <style>{`
                    .hologram-orb{ width:256px;height:256px;border-radius:9999px;position:relative;background:conic-gradient(rgba(255,138,0,0.06), rgba(255,138,0,0.02));box-shadow:0 0 40px rgba(255,138,0,0.06) inset, 0 0 40px rgba(255,138,0,0.06);overflow:hidden;}
                    .hologram-orb::before{content:'';position:absolute;inset:0;border-radius:9999px;background:radial-gradient(circle at 40% 30%, rgba(255,180,90,0.12), transparent 25%), radial-gradient(circle at 70% 70%, rgba(255,90,0,0.06), transparent 30%);mix-blend-mode:screen;}
                    .hologram-orb::after{content:'';position:absolute;inset:0;border-radius:9999px;box-shadow:0 0 80px rgba(255,138,0,0.18);animation:rotateOrb 6s linear infinite;opacity:0.95}
                    .hologram-orb.listening::after{box-shadow:0 0 120px rgba(255,138,0,0.36);filter:blur(2px);}
                    @keyframes rotateOrb{ from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
                `}</style>
            </div>
        </div>
    );
};

export default HologramSphere;
