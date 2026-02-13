import React from 'react';
import { Mic, MicOff, Settings, Power, Video, VideoOff, Hand, Lightbulb, Printer, Globe, Box } from 'lucide-react';

const ToolsModule = ({
    isConnected,
    isMuted,
    isVideoOn,
    isHandTrackingEnabled,
    showSettings,
    onTogglePower,
    onToggleMute,
    onToggleVideo,
    onToggleSettings,

    onToggleHand,
    onToggleKasa,
    showKasaWindow,
    onTogglePrinter,
    showPrinterWindow,
    onToggleCad,
    showCadWindow,
    onToggleBrowser,
    showBrowserWindow,
    activeDragElement,

    position,
    onMouseDown
}) => {
    return (
        <div
            id="tools"
            onMouseDown={onMouseDown}
            className={`absolute px-4 py-3 transition-all duration-200 friday-panel rounded-full`}
            style={{
                left: position.x,
                top: position.y,
                transform: 'translate(-50%, -50%)',
                pointerEvents: 'auto'
            }}
        >
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 pointer-events-none mix-blend-overlay rounded-full"></div>

            <div className="flex justify-center gap-4 relative z-10">
                {/* Power Button */}
                <button onClick={onTogglePower} className="p-3 rounded-full btn-option">
                    <Power size={22} className="neon-accent" />
                </button>

                {/* Mute Button */}
                <button onClick={onToggleMute} disabled={!isConnected} className="p-3 rounded-full btn-option">
                    {isMuted ? <MicOff size={20} className="text-red-400" /> : <Mic size={20} className="neon-accent" />}
                </button>

                {/* Video Button */}
                <button onClick={onToggleVideo} className="p-3 rounded-full btn-option">
                    {isVideoOn ? <Video size={20} className="neon-accent" /> : <VideoOff size={20} className="text-gray-400" />}
                </button>

                {/* Settings Button */}
                <button onClick={onToggleSettings} className="p-3 rounded-full btn-option">
                    <Settings size={20} className="neon-accent" />
                </button>

                {/* Hand Tracking Toggle */}
                <button onClick={onToggleHand} className="p-3 rounded-full btn-option">
                    <Hand size={20} className="neon-accent" />
                </button>

                {/* Kasa Light Control */}
                <button onClick={onToggleKasa} className="p-3 rounded-full btn-option">
                    <Lightbulb size={20} className="neon-accent" />
                </button>

                {/* 3D Printer Control */}
                <button onClick={onTogglePrinter} className="p-3 rounded-full btn-option">
                    <Printer size={20} className="neon-accent" />
                </button>

                {/* CAD Agent Toggle */}
                <button onClick={onToggleCad} className="p-3 rounded-full btn-option">
                    <Box size={20} className="neon-accent" />
                </button>

                {/* Web Agent Toggle */}
                <button onClick={onToggleBrowser} className="p-3 rounded-full btn-option">
                    <Globe size={20} className="neon-accent" />
                </button>
            </div>
        </div>
    );
};

export default ToolsModule;
