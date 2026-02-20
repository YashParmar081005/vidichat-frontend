import { useState } from "react";
import { Link } from "react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { spinWheel } from "../lib/api";
import { ArrowLeft, Gift, Sparkles } from "lucide-react";
import AchievementPopup from "../components/AchievementPopup";

const WHEEL_SEGMENTS = [1, 2, 3, 4, 5, 1, 2, 1, 2, 1];
const COLORS = [
    "#6366f1", "#ec4899", "#f59e0b", "#10b981",
    "#3b82f6", "#8b5cf6", "#ef4444", "#14b8a6",
    "#f97316", "#06b6d4",
];

const SpinWheelPage = () => {
    const [spinning, setSpinning] = useState(false);
    const [result, setResult] = useState(null);
    const [pointsEarned, setPointsEarned] = useState(0);
    const [achievements, setAchievements] = useState([]);
    const [error, setError] = useState(null);
    const [rotation, setRotation] = useState(0);
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: spinWheel,
        onSuccess: (data) => {
            setPointsEarned(data.pointsEarned);
            if (data.newAchievements?.length) setAchievements(data.newAchievements);

            const segIndex = WHEEL_SEGMENTS.indexOf(data.pointsEarned);
            const segAngle = 360 / WHEEL_SEGMENTS.length;
            const targetAngle = segIndex * segAngle + segAngle / 2;
            const totalRotation = 360 * 5 + (360 - targetAngle);

            setRotation((prev) => prev + totalRotation);

            setTimeout(() => {
                setSpinning(false);
                setResult(data.pointsEarned);
                queryClient.invalidateQueries({ queryKey: ["arcadeProfile"] });
            }, 4000);
        },
        onError: (err) => {
            setSpinning(false);
            setError(err.response?.data?.message || "Failed to spin!");
        },
    });

    const handleSpin = () => {
        setError(null);
        setResult(null);
        setSpinning(true);
        mutation.mutate();
    };

    return (
        <div className="min-h-screen bg-base-100 p-4 lg:p-8 flex flex-col items-center">
            <div className="w-full max-w-lg">
                <div className="flex items-center gap-4 mb-8">
                    <Link to="/arcade" className="btn btn-ghost btn-circle"><ArrowLeft className="w-5 h-5" /></Link>
                    <h1 className="text-3xl font-extrabold flex items-center gap-2"><Gift className="w-8 h-8 text-primary" /> Daily Spin Wheel</h1>
                </div>
                <p className="text-base-content/60 text-center mb-8">Spin once per day for bonus points (1–5)!</p>

                <div className="flex flex-col items-center gap-8">
                    <div className="relative">
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10 text-3xl">🔻</div>
                        <svg viewBox="0 0 300 300" className="w-72 h-72 drop-shadow-2xl"
                            style={{ transform: `rotate(${rotation}deg)`, transition: spinning ? "transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)" : "none" }}>
                            {WHEEL_SEGMENTS.map((val, i) => {
                                const angle = (360 / WHEEL_SEGMENTS.length) * i;
                                const nextAngle = (360 / WHEEL_SEGMENTS.length) * (i + 1);
                                const startRad = ((angle - 90) * Math.PI) / 180;
                                const endRad = ((nextAngle - 90) * Math.PI) / 180;
                                const x1 = 150 + 140 * Math.cos(startRad);
                                const y1 = 150 + 140 * Math.sin(startRad);
                                const x2 = 150 + 140 * Math.cos(endRad);
                                const y2 = 150 + 140 * Math.sin(endRad);
                                const midRad = (((angle + nextAngle) / 2 - 90) * Math.PI) / 180;
                                const textX = 150 + 95 * Math.cos(midRad);
                                const textY = 150 + 95 * Math.sin(midRad);
                                const textAngle = (angle + nextAngle) / 2;

                                return (
                                    <g key={i}>
                                        <path d={`M150,150 L${x1},${y1} A140,140 0 0,1 ${x2},${y2} Z`} fill={COLORS[i]} stroke="#1f2937" strokeWidth="1" />
                                        <text x={textX} y={textY} textAnchor="middle" dominantBaseline="central" fill="white" fontWeight="bold" fontSize="18"
                                            transform={`rotate(${textAngle}, ${textX}, ${textY})`}>+{val}</text>
                                    </g>
                                );
                            })}
                            <circle cx="150" cy="150" r="20" fill="#1f2937" stroke="#374151" strokeWidth="2" />
                        </svg>
                    </div>

                    <button onClick={handleSpin} disabled={spinning}
                        className="btn btn-primary btn-lg gap-2 shadow-xl hover:shadow-primary/50 transition-all">
                        {spinning ? <><span className="loading loading-spinner loading-sm"></span> Spinning...</> : <><Sparkles className="w-5 h-5" /> Spin the Wheel!</>}
                    </button>

                    {error && <div className="alert alert-warning max-w-sm"><span>{error}</span></div>}

                    {result && !spinning && (
                        <div className="text-center space-y-3 animate-fade-in">
                            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-success/20 text-success text-lg font-bold">
                                <Gift className="w-6 h-6" /> You won +{result} points!
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <AchievementPopup achievements={achievements} onClose={() => setAchievements([])} />
        </div>
    );
};

export default SpinWheelPage;
