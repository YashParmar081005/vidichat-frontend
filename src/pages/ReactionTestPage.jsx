import { useState, useRef, useCallback } from "react";
import { Link } from "react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { submitReaction } from "../lib/api";
import { ArrowLeft, RotateCcw, Trophy, Frown, Settings, Zap } from "lucide-react";
import AchievementPopup from "../components/AchievementPopup";

const DIFFICULTIES = [
    { id: "easy", label: "Easy", desc: "Bot reacts 300–400ms", color: "btn-success" },
    { id: "medium", label: "Medium", desc: "Bot reacts 200–350ms", color: "btn-warning" },
    { id: "hard", label: "Hard", desc: "Bot reacts 150–250ms", color: "btn-error" },
];

const ReactionTestPage = () => {
    const [difficulty, setDifficulty] = useState(null);
    const [phase, setPhase] = useState("idle"); // idle | waiting | ready | clicked | tooEarly | result
    const [reactionTime, setReactionTime] = useState(0);
    const [botReactionTime, setBotReactionTime] = useState(0);
    const [gameResult, setGameResult] = useState(null);
    const [pointsEarned, setPointsEarned] = useState(0);
    const [achievements, setAchievements] = useState([]);
    const readyTimeRef = useRef(null);
    const timeoutRef = useRef(null);
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: (data) => submitReaction(data),
        onSuccess: (data) => {
            setBotReactionTime(data.botReactionTime);
            setGameResult(data.result);
            setPointsEarned(data.pointsEarned);
            if (data.newAchievements?.length) setAchievements(data.newAchievements);
            setPhase("result");
            queryClient.invalidateQueries({ queryKey: ["arcadeProfile"] });
        },
    });

    const startGame = useCallback(() => {
        setPhase("waiting");
        setReactionTime(0);
        setBotReactionTime(0);
        setGameResult(null);
        setPointsEarned(0);
        setAchievements([]);

        const delay = Math.floor(Math.random() * 3001) + 2000; // 2–5 seconds
        timeoutRef.current = setTimeout(() => {
            readyTimeRef.current = Date.now();
            setPhase("ready");
        }, delay);
    }, []);

    const handleClick = () => {
        if (phase === "waiting") {
            // Clicked too early
            clearTimeout(timeoutRef.current);
            setPhase("tooEarly");
        } else if (phase === "ready") {
            const rt = Date.now() - readyTimeRef.current;
            setReactionTime(rt);
            setPhase("clicked");
            mutation.mutate({ reactionTime: rt, difficulty });
        }
    };

    const getBoxStyle = () => {
        switch (phase) {
            case "waiting": return "bg-red-500 cursor-pointer";
            case "ready": return "bg-green-500 cursor-pointer";
            case "tooEarly": return "bg-yellow-500";
            case "clicked": return "bg-blue-500";
            case "result": return "bg-base-200";
            default: return "bg-base-200";
        }
    };

    const getBoxText = () => {
        switch (phase) {
            case "idle": return "Click Start to begin!";
            case "waiting": return "Wait for green...";
            case "ready": return "CLICK NOW!";
            case "tooEarly": return "Too early! 😅";
            case "clicked": return "Calculating...";
            case "result": return "";
            default: return "";
        }
    };

    // Difficulty selection
    if (!difficulty) {
        return (
            <div className="min-h-screen bg-base-100 p-4 lg:p-8 flex flex-col items-center">
                <div className="w-full max-w-lg">
                    <div className="flex items-center gap-4 mb-8">
                        <Link to="/arcade" className="btn btn-ghost btn-circle"><ArrowLeft className="w-5 h-5" /></Link>
                        <h1 className="text-3xl font-extrabold">⚡ Reaction Speed Test</h1>
                    </div>
                    <p className="text-base-content/60 mb-8 text-center text-lg">Select difficulty level</p>
                    <div className="flex flex-col gap-4 max-w-sm mx-auto">
                        {DIFFICULTIES.map((d) => (
                            <button key={d.id} onClick={() => setDifficulty(d.id)}
                                className={`btn ${d.color} btn-lg justify-start gap-4`}>
                                <Settings className="w-5 h-5" />
                                <div className="text-left">
                                    <div className="font-bold">{d.label}</div>
                                    <div className="text-xs opacity-70">{d.desc}</div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-base-100 p-4 lg:p-8 flex flex-col items-center">
            <div className="w-full max-w-lg">
                <div className="flex items-center gap-4 mb-8">
                    <Link to="/arcade" className="btn btn-ghost btn-circle"><ArrowLeft className="w-5 h-5" /></Link>
                    <h1 className="text-3xl font-extrabold">⚡ Reaction Speed Test</h1>
                    <span className="badge badge-outline ml-auto capitalize">{difficulty}</span>
                </div>

                {/* Reaction Box */}
                {phase !== "result" && (
                    <div
                        onClick={(phase === "waiting" || phase === "ready") ? handleClick : undefined}
                        className={`
                            w-full h-64 rounded-2xl flex items-center justify-center mb-6
                            text-white text-2xl font-extrabold select-none transition-colors duration-200
                            ${getBoxStyle()}
                        `}
                    >
                        {getBoxText()}
                    </div>
                )}

                {/* Start / Try Again buttons */}
                {phase === "idle" && (
                    <button onClick={startGame} className="btn btn-primary btn-lg w-full gap-2">
                        <Zap className="w-5 h-5" /> Start
                    </button>
                )}

                {phase === "tooEarly" && (
                    <div className="text-center space-y-4">
                        <p className="text-warning font-bold text-lg">You clicked before the screen turned green!</p>
                        <button onClick={startGame} className="btn btn-primary gap-2"><RotateCcw className="w-4 h-4" /> Try Again</button>
                    </div>
                )}

                {/* Result */}
                {phase === "result" && (
                    <div className="text-center space-y-4 animate-fade-in">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-base-200 rounded-2xl p-4 border border-base-300">
                                <p className="text-sm text-base-content/50 mb-1">Your Time</p>
                                <p className="text-4xl font-extrabold text-primary">{reactionTime}ms</p>
                            </div>
                            <div className="bg-base-200 rounded-2xl p-4 border border-base-300">
                                <p className="text-sm text-base-content/50 mb-1">Bot Time</p>
                                <p className="text-4xl font-extrabold text-error">{botReactionTime}ms</p>
                            </div>
                        </div>

                        <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-2xl text-lg font-bold ${gameResult === "win" ? "bg-success/20 text-success" : "bg-error/20 text-error"}`}>
                            {gameResult === "win" ? <><Trophy className="w-6 h-6" /> Lightning Fast!</> : <><Frown className="w-6 h-6" /> Bot was faster!</>}
                        </div>
                        {pointsEarned > 0 && <p className="text-primary font-bold text-xl">+{pointsEarned} points!</p>}
                        <div className="flex gap-3 justify-center">
                            <button onClick={startGame} className="btn btn-primary gap-2"><RotateCcw className="w-4 h-4" /> Try Again</button>
                            <button onClick={() => { setDifficulty(null); setPhase("idle"); }} className="btn btn-ghost gap-2"><Settings className="w-4 h-4" /> Change Difficulty</button>
                        </div>
                    </div>
                )}
            </div>
            <AchievementPopup achievements={achievements} onClose={() => setAchievements([])} />
        </div>
    );
};

export default ReactionTestPage;
