import React from 'react';

const ConfirmationPopup = ({ request, onConfirm, onDeny }) => {
    if (!request) return null;

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="relative w-full max-w-lg p-8 friday-panel rounded-3xl transform transition-all scale-100">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none mix-blend-overlay rounded-3xl"></div>

                {/* Header with Icon */}
                <div className="flex items-center gap-4 mb-6 relative z-10">
                    <div className="p-3 rounded-full bg-black/20 border border-orange-600/20 text-orange-300 shadow-[0_0_18px_rgba(255,138,0,0.22)]">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                    </div>
                    <div>
                        <h2 className="text-xl font-bold neon-accent tracking-wider font-mono drop-shadow-sm">
                            AUTHORIZATION REQUIRED
                        </h2>
                        <p className="text-xs text-orange-300 font-mono tracking-widest uppercase">
                            AI Logic Core Request
                        </p>
                    </div>
                </div>

                {/* Content */}
                <div className="mb-8 space-y-4 relative z-10">
                    <p className="text-gray-300 leading-relaxed text-sm">
                        The system is requesting permission to execute an autonomous function. Please review the parameters below.
                    </p>

                    <div className="space-y-2">
                        <div className="bg-black/20 rounded-xl overflow-hidden border border-orange-900/12">
                            <div className="px-4 py-2 border-b border-orange-900/10 flex justify-between items-center bg-black/10">
                                <span className="text-xs neon-accent font-bold uppercase tracking-wider">Function</span>
                                <span className="text-xs text-white/50 font-mono">system.call</span>
                            </div>
                            <div className="p-4">
                                <div className="text-white font-mono text-lg font-medium">{request.tool}</div>
                            </div>
                        </div>

                        <div className="bg-black/10 rounded-xl overflow-hidden border border-orange-900/8">
                            <div className="px-4 py-2 border-b border-orange-900/10 flex justify-between items-center bg-black/6">
                                <span className="text-xs neon-accent font-bold uppercase tracking-wider">Parameters</span>
                                <span className="text-xs text-white/50 font-mono">json.payload</span>
                            </div>
                            <div className="p-4 bg-black/6">
                                <pre className="text-xs text-gray-300 font-mono overflow-x-auto whitespace-pre-wrap leading-relaxed">
                                    {JSON.stringify(request.args, null, 2)}
                                </pre>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-4 relative z-10">
                    <button onClick={onDeny} className="flex-1 px-4 py-3.5 rounded-xl btn-option text-red-400">Deny Request</button>
                    <button onClick={onConfirm} className="flex-1 px-4 py-3.5 rounded-xl btn-option neon-accent font-bold">Authorize Execution</button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationPopup;
