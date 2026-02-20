import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { submitMath } from "../lib/api";
import { ArrowLeft, RotateCcw, Trophy, Frown, Settings, Timer, Zap } from "lucide-react";
import AchievementPopup from "../components/AchievementPopup";

const DIFFICULTIES = [
    { id: "easy", label: "Easy", desc: "Addition & Subtraction", color: "btn-success" },
    { id: "medium", label: "Medium", desc: "+, −, × operations", color: "btn-warning" },
    { id: "hard", label: "Hard", desc: "+, −, ×, ÷ operations", color: "btn-error" },
];

function generateQuestion(difficulty) {
    const ops = difficulty === "easy" ? ["+", "-"] : difficulty === "medium" ? ["+", "-", "×"] : ["+", "-", "×", "÷"];
    const op = ops[Math.floor(Math.random() * ops.length)];
    let a, b, answer;
    switch (op) {
        case "+": a = Math.floor(Math.random() * 50) + 1; b = Math.floor(Math.random() * 50) + 1; answer = a + b; break;
        case "-": a = Math.floor(Math.random() * 50) + 10; b = Math.floor(Math.random() * a) + 1; answer = a - b; break;
        case "×": a = Math.floor(Math.random() * 12) + 1; b = Math.floor(Math.random() * 12) + 1; answer = a * b; break;
        case "÷": b = Math.floor(Math.random() * 10) + 2; answer = Math.floor(Math.random() * 10) + 1; a = b * answer; break;
    }
    return { question: `${a} ${op} ${b}`, answer };
}

const MathBattlePage = () => {
    const [difficulty, setDifficulty] = useState(null);
    const [question, setQuestion] = useState(null);
    const [userAnswer, setUserAnswer] = useState("");
    const [startTime, setStartTime] = useState(null);
    const [timeElapsed, setTimeElapsed] = useState(0);
    const [finished, setFinished] = useState(false);
    const [gameResult, setGameResult] = useState(null);
    const [botTime, setBotTime] = useState(0);
    const [answerTime, setAnswerTime] = useState(0);
    const [isCorrect, setIsCorrect] = useState(false);
    const [pointsEarned, setPointsEarned] = useState(0);
    const [achievements, setAchievements] = useState([]);
    const [round, setRound] = useState(0);
    const timerRef = useRef(null);
    const inputRef = useRef(null);
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: (data) => submitMath(data),
        onSuccess: (data) => {
            setBotTime(data.botTime);
            setIsCorrect(data.isCorrect);
            setGameResult(data.result);
            setPointsEarned(data.pointsEarned);
            if (data.newAchievements?.length) setAchievements(data.newAchievements);
            queryClient.invalidateQueries({ queryKey: ["arcadeProfile"] });
        },
    });

    const startRound = useCallback((diff) => {
        const q = generateQuestion(diff || difficulty);
        setQuestion(q);
        setUserAnswer("");
        setFinished(false);
        setGameResult(null);
        setBotTime(0);
        setAnswerTime(0);
        setIsCorrect(false);
        setPointsEarned(0);
        setAchievements([]);
        setTimeElapsed(0);
        setStartTime(Date.now());
        setRound((r) => r + 1);
        setTimeout(() => inputRef.current?.focus(), 100);
    }, [difficulty]);

    useEffect(() => {
        if (startTime && !finished) {
            timerRef.current = setInterval(() => {
                setTimeElapsed(+((Date.now() - startTime) / 1000).toFixed(1));
            }, 100);
        }
        return () => clearInterval(timerRef.current);
    }, [startTime, finished]);

    const handleSubmit = () => {
        if (finished || !userAnswer) return;
        clearInterval(timerRef.current);
        setFinished(true);
        const elapsed = +((Date.now() - startTime) / 1000).toFixed(2);
        setAnswerTime(elapsed);

        mutation.mutate({
            userAnswer: parseInt(userAnswer),
            correctAnswer: question.answer,
            answerTime: elapsed,
            difficulty,
        });
    };

    // Difficulty selection
    if (!difficulty) {
        return (
            <div className="min-h-screen bg-base-100 p-4 lg:p-8 flex flex-col items-center">
                <div className="w-full max-w-lg">
                    <div className="flex items-center gap-4 mb-8">
                        <Link to="/arcade" className="btn btn-ghost btn-circle"><ArrowLeft className="w-5 h-5" /></Link>
                        <h1 className="text-3xl font-extrabold">🧮 Math Battle</h1>
                    </div>
                    <p className="text-base-content/60 mb-8 text-center text-lg">Select difficulty level</p>
                    <div className="flex flex-col gap-4 max-w-sm mx-auto">
                        {DIFFICULTIES.map((d) => (
                            <button key={d.id} onClick={() => { setDifficulty(d.id); startRound(d.id); }}
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
                    <h1 className="text-3xl font-extrabold">🧮 Math Battle</h1>
                    <span className="badge badge-outline ml-auto capitalize">{difficulty}</span>
                </div>

                {/* Timer */}
                {!finished && (
                    <div className="text-center mb-6">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-base-200 border border-base-300">
                            <Timer className="w-4 h-4 text-warning" />
                            <span className="font-mono font-bold text-2xl">{timeElapsed}s</span>
                        </div>
                    </div>
                )}

                {/* Question */}
                {question && (
                    <div className="bg-base-200 rounded-2xl p-8 mb-6 border border-base-300 text-center">
                        <p className="text-5xl font-extrabold tracking-wider">{question.question} = ?</p>
                    </div>
                )}

                {/* Input */}
                {!finished && (
                    <div className="flex gap-3 mb-6">
                        <input ref={inputRef} type="number" value={userAnswer}
                            onChange={(e) => setUserAnswer(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                            placeholder="Your answer..."
                            className="input input-bordered input-primary flex-1 text-center text-xl font-bold" autoFocus />
                        <button onClick={handleSubmit} disabled={!userAnswer} className="btn btn-primary gap-2">
                            <Zap className="w-5 h-5" /> Submit
                        </button>
                    </div>
                )}

                {/* Result */}
                {finished && gameResult && (
                    <div className="text-center space-y-4 animate-fade-in">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-base-200 rounded-2xl p-4 border border-base-300">
                                <p className="text-sm text-base-content/50 mb-1">Your Time</p>
                                <p className="text-3xl font-extrabold text-primary">{answerTime}s</p>
                                <p className="text-xs mt-1">{isCorrect ? "✅ Correct" : `❌ Wrong (answer: ${question.answer})`}</p>
                            </div>
                            <div className="bg-base-200 rounded-2xl p-4 border border-base-300">
                                <p className="text-sm text-base-content/50 mb-1">Bot Time</p>
                                <p className="text-3xl font-extrabold text-error">{botTime}s</p>
                                <p className="text-xs mt-1">✅ Always correct</p>
                            </div>
                        </div>

                        <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-2xl text-lg font-bold ${gameResult === "win" ? "bg-success/20 text-success" : "bg-error/20 text-error"}`}>
                            {gameResult === "win" ? <><Trophy className="w-6 h-6" /> You Won!</> : <><Frown className="w-6 h-6" /> Bot was better!</>}
                        </div>
                        {pointsEarned > 0 && <p className="text-primary font-bold text-xl">+{pointsEarned} points!</p>}
                        <div className="flex gap-3 justify-center">
                            <button onClick={() => startRound(difficulty)} className="btn btn-primary gap-2"><RotateCcw className="w-4 h-4" /> Next Round</button>
                            <button onClick={() => setDifficulty(null)} className="btn btn-ghost gap-2"><Settings className="w-4 h-4" /> Change Difficulty</button>
                        </div>
                    </div>
                )}
            </div>
            <AchievementPopup achievements={achievements} onClose={() => setAchievements([])} />
        </div>
    );
};

export default MathBattlePage;
