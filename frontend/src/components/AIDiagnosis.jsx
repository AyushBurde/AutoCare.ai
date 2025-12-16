import React from 'react';

const AIDiagnosis = ({ aiData, loading }) => {
    // If loading, show skeleton
    if (loading) {
        return (
            <div className="mt-6 bg-slate-900/50 border border-slate-700/50 rounded-xl overflow-hidden shadow-2xl backdrop-blur-sm animate-pulse">
                <div className="bg-slate-900/80 px-6 py-4 flex items-center justify-between border-b border-slate-700/50">
                    <div className="h-6 w-32 bg-slate-700/50 rounded"></div>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="h-32 bg-slate-800/50 rounded-lg"></div>
                    <div className="h-32 bg-slate-800/50 rounded-lg"></div>
                </div>
            </div>
        );
    }

    // If no data yet, don't show anything
    if (!aiData) return null;

    // Attempt to parse the JSON string from Gemini (if it comes as a string)
    // Note: Your backend might send a stringified JSON, so we parse it here.
    let parsedData = aiData;
    try {
        // 1. If it's a string, we might need to clean it first
        if (typeof aiData === 'string') {
            let cleanData = aiData.trim();
            // Remove markdown code blocks if present
            if (cleanData.includes('```')) {
                cleanData = cleanData.replace(/```json/g, '').replace(/```/g, '');
            }
            parsedData = JSON.parse(cleanData);
        }
    } catch (e) {
        console.error("AI Data is not JSON", e);
        // Fallback if parsing fails
        return (
            <div className="mt-6 bg-slate-900 border border-slate-700 rounded-xl p-4 text-white">
                <h3 className="text-lg font-bold mb-2">Analysis Result</h3>
                <p className="whitespace-pre-wrap text-sm text-slate-300">{typeof aiData === 'string' ? aiData : JSON.stringify(aiData, null, 2)}</p>
            </div>
        );
    }

    return (
        <div className="mt-6 bg-slate-900/50 border border-slate-700/50 rounded-xl overflow-hidden shadow-2xl backdrop-blur-sm">
            {/* Header with GenAI Sparkle Icon */}
            <div className="bg-slate-900/80 px-6 py-4 flex items-center justify-between border-b border-slate-700/50">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    ✨ AI Mechanic Diagnosis
                </h3>
                <span className="bg-cyan-900/30 text-cyan-200 text-xs px-2 py-1 rounded-full border border-cyan-700/50">
                    Powered by Gemini 1.5
                </span>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* LEFT SIDE: For the Car Owner (Mr. Sharma) */}
                <div className="bg-slate-800/30 p-4 rounded-lg border border-slate-700/50">
                    <h4 className="text-cyan-400 text-xs uppercase font-bold mb-2 tracking-wider">
                        Customer Explanation
                    </h4>
                    <p className="text-slate-200 text-sm leading-relaxed">
                        "{parsedData.customer_explanation}"
                    </p>

                    <div className="mt-4 pt-4 border-t border-slate-700/50">
                        <span className="text-slate-400 text-xs">Estimated Repair Cost:</span>
                        <p className="text-xl font-bold text-emerald-400">{parsedData.estimated_cost}</p>
                    </div>
                </div>

                {/* RIGHT SIDE: For the Mechanic (Technical) */}
                <div className="bg-red-900/10 p-4 rounded-lg border border-red-900/30">
                    <h4 className="text-red-400 text-xs uppercase font-bold mb-2 tracking-wider">
                        Root Cause Analysis (RCA)
                    </h4>
                    <p className="text-slate-300 text-sm font-mono leading-relaxed">
                        {parsedData.root_cause}
                    </p>

                    <div className="mt-4 flex items-center gap-2">
                        <button
                            onClick={() => window.open(`https://www.google.com/search?q=buy+honda+city+${"Cooling Pump"}&tbm=shop`, '_blank')}
                            className="text-xs bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded transition flex items-center gap-1"
                        >
                            🛒 Order Parts
                        </button>
                        <button className="text-xs border border-slate-500 text-slate-400 px-3 py-1.5 rounded hover:bg-slate-800 transition">
                            Download PDF
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AIDiagnosis;
