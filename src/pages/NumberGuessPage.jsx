import { useState, useCallback } from "react";
import { Link } from "../lib/simpleRouter";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { submitNumberGuess } from "../lib/api";
import { ArrowLeft, RotateCcw, Trophy, Frown, Settings, ArrowUp, ArrowDown, Check } from "lucide-react";
import AchievementPopup from "../components/AchievementPopup";

const DIFFICULTIES = [
    { id: "easy", label: "Easy", desc: "Guess 1–50", color: "btn-success", max: 50 },
    { id: "medium", label: "Medium", desc: "Guess 1–100", color: "btn-warning", max: 100 },
    { id: "hard", label: "Hard", desc: "Guess 1–200", color: "btn-error", max: 200 },
];

const NumberGuessPage = () => {
    const [difficulty, setDifficulty] = useState(null);
    const [maxNum, setMaxNum] = useState(100);
    const [secretNumber, setSecretNumber] = useState(null);
    const [guess, setGuess] = useState("");
    const [attempts, setAttempts] = useState(0);
    const [hint, setHint] = useState(null);
    const [gameOver, setGameOver] = useState(false);
    const [won, setWon] = useState(false);
    const [pointsEarned, setPointsEarned] = useState(0);
    const [achievements, setAchievements] = useState([]);
    const [history, setHistory] = useState([]);
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: ({ attempts, won }) => submitNumberGuess(attempts, won),
        onSuccess: (data) => {
            setPointsEarned(data.pointsEarned);
            if (data.newAchievements?.length) setAchievements(data.newAchievements);
            queryClient.invalidateQueries({ queryKey: ["arcadeProfile"] });
        },
    });

    const startGame = (diff) => {
        const d = DIFFICULTIES.find((x) => x.id === diff);
        setDifficulty(diff);
        setMaxNum(d.max);
        setSecretNumber(Math.floor(Math.random() * d.max) + 1);
        setGuess("");
        setAttempts(0);
        setHint(null);
        setGameOver(false);
        setWon(false);
        setPointsEarned(0);
        setAchievements([]);
        setHistory([]);
    };

    const handleGuess = () => {
        const num = parseInt(guess);
        if (isNaN(num) || num < 1 || num > maxNum) return;

        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        setGuess("");

        if (num === secretNumber) {
            setWon(true);
            setGameOver(true);
            setHint("correct");
            setHistory((h) => [...h, { num, result: "correct" }]);
            mutation.mutate({ attempts: newAttempts, won: true });
        } else if (newAttempts >= 10) {
            setGameOver(true);
            setHint(num < secretNumber ? "low" : "high");
            setHistory((h) => [...h, { num, result: num < secretNumber ? "low" : "high" }]);
            mutation.mutate({ attempts: newAttempts, won: false });
        } else {
            const newHint = num < secretNumber ? "low" : "high";
            setHint(newHint);
            setHistory((h) => [...h, { num, result: newHint }]);
        }
    };

    const resetGame = () => startGame(difficulty);

    // Difficulty selection
    if (!difficulty) {
        return (
            <div className="min-h-screen bg-base-100 p-4 lg:p-8 flex flex-col items-center">
                <div className="w-full max-w-lg">
                    <div className="flex items-center gap-4 mb-8">
                        <Link to="/arcade" className="btn btn-ghost btn-circle"><ArrowLeft className="w-5 h-5" /></Link>
                        <h1 className="text-3xl font-extrabold">🔢 Number Guessing</h1>
                    </div>
                    <p className="text-base-content/60 mb-8 text-center text-lg">Select difficulty level</p>
                    <div className="flex flex-col gap-4 max-w-sm mx-auto">
                        {DIFFICULTIES.map((d) => (
                            <button key={d.id} onClick={() => startGame(d.id)}
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
                    <h1 className="text-3xl font-extrabold">🔢 Number Guessing</h1>
                    <span className="badge badge-outline ml-auto capitalize">{difficulty}</span>
                </div>

                {/* Attempts counter */}
                <div className="flex justify-between items-center mb-6 px-2">
                    <p className="text-base-content/60">Guess a number between <span className="font-bold text-primary">1</span> and <span className="font-bold text-primary">{maxNum}</span></p>
                    <div className="badge badge-lg badge-primary">{attempts}/10</div>
                </div>

                {/* Input */}
                {!gameOver && (
                    <div className="flex gap-3 mb-6">
                        <input type="number" value={guess} onChange={(e) => setGuess(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleGuess()}
                            min={1} max={maxNum} placeholder="Your guess..."
                            className="input input-bordered input-primary flex-1 text-center text-xl font-bold" autoFocus />
                        <button onClick={handleGuess} disabled={!guess} className="btn btn-primary">Guess!</button>
                    </div>
                )}

                {/* Hint */}
                {hint && !gameOver && (
                    <div className={`text-center mb-6 animate-fade-in`}>
                        <div className={`inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-lg font-bold ${hint === "low" ? "bg-info/20 text-info" : "bg-warning/20 text-warning"}`}>
                            {hint === "low" && <><ArrowUp className="w-5 h-5" /> Too Low! Go higher</>}
                            {hint === "high" && <><ArrowDown className="w-5 h-5" /> Too High! Go lower</>}
                        </div>
                    </div>
                )}

                {/* History */}
                {history.length > 0 && (
                    <div className="mb-6">
                        <p className="text-sm text-base-content/50 mb-2">Guess history:</p>
                        <div className="flex flex-wrap gap-2">
                            {history.map((h, i) => (
                                <div key={i} className={`badge badge-lg ${h.result === "correct" ? "badge-success" : h.result === "low" ? "badge-info" : "badge-warning"}`}>
                                    {h.num} {h.result === "correct" ? "✓" : h.result === "low" ? "↑" : "↓"}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Result */}
                {gameOver && (
                    <div className="text-center space-y-4 animate-fade-in">
                        <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-2xl text-lg font-bold ${won ? "bg-success/20 text-success" : "bg-error/20 text-error"}`}>
                            {won ? <><Trophy className="w-6 h-6" /> You Got It in {attempts} tries!</> : <><Frown className="w-6 h-6" /> Out of attempts! It was {secretNumber}</>}
                        </div>
                        {pointsEarned > 0 && <p className="text-primary font-bold text-xl">+{pointsEarned} points!</p>}
                        <div className="flex gap-3 justify-center">
                            <button onClick={resetGame} className="btn btn-primary gap-2"><RotateCcw className="w-4 h-4" /> Play Again</button>
                            <button onClick={() => { setDifficulty(null); }} className="btn btn-ghost gap-2"><Settings className="w-4 h-4" /> Change Difficulty</button>
                        </div>
                    </div>
                )}
            </div>
            <AchievementPopup achievements={achievements} onClose={() => setAchievements([])} />
        </div>
    );
};

export default NumberGuessPage;
