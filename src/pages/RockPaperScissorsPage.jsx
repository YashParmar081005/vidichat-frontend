import { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { submitRPS } from "../lib/api";
import { ArrowLeft, RotateCcw, Trophy, Frown, Minus, Settings } from "lucide-react";
import AchievementPopup from "../components/AchievementPopup";

const CHOICES = [
    { id: "rock", emoji: "🪨", label: "Rock" },
    { id: "paper", emoji: "📄", label: "Paper" },
    { id: "scissors", emoji: "✂️", label: "Scissors" },
];

const DIFFICULTIES = [
    { id: "easy", label: "Easy", desc: "Bot picks randomly", color: "btn-success" },
    { id: "medium", label: "Medium", desc: "Bot uses some strategy", color: "btn-warning" },
    { id: "hard", label: "Hard", desc: "Bot counter-picks often", color: "btn-error" },
];

const RockPaperScissorsPage = () => {
    const [difficulty, setDifficulty] = useState(null);
    const [playerChoice, setPlayerChoice] = useState(null);
    const [botChoice, setBotChoice] = useState(null);
    const [result, setResult] = useState(null);
    const [pointsEarned, setPointsEarned] = useState(0);
    const [achievements, setAchievements] = useState([]);
    const [revealing, setRevealing] = useState(false);
    const [score, setScore] = useState({ player: 0, bot: 0, draws: 0 });
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: submitRPS,
        onSuccess: (data) => {
            setTimeout(() => {
                setBotChoice(data.botChoice);
                setResult(data.result);
                setPointsEarned(data.pointsEarned || 0);
                if (data.newAchievements?.length) setAchievements(data.newAchievements);
                setRevealing(false);
                setScore((s) => ({
                    player: s.player + (data.result === "win" ? 1 : 0),
                    bot: s.bot + (data.result === "lose" ? 1 : 0),
                    draws: s.draws + (data.result === "draw" ? 1 : 0),
                }));
                queryClient.invalidateQueries({ queryKey: ["arcadeProfile"] });
            }, 1000);
        },
    });

    const handleChoice = (choice) => {
        setPlayerChoice(choice);
        setBotChoice(null);
        setResult(null);
        setPointsEarned(0);
        setRevealing(true);
        mutation.mutate(choice);
    };

    const playAgain = () => {
        setPlayerChoice(null);
        setBotChoice(null);
        setResult(null);
        setPointsEarned(0);
        setAchievements([]);
    };

    const getChoiceEmoji = (id) => CHOICES.find((c) => c.id === id)?.emoji || "❓";

    // Difficulty selection
    if (!difficulty) {
        return (
            <div className="min-h-screen bg-base-100 p-4 lg:p-8 flex flex-col items-center">
                <div className="w-full max-w-lg">
                    <div className="flex items-center gap-4 mb-8">
                        <Link to="/arcade" className="btn btn-ghost btn-circle"><ArrowLeft className="w-5 h-5" /></Link>
                        <h1 className="text-3xl font-extrabold">Rock Paper Scissors</h1>
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
                <div className="flex items-center gap-4 mb-6">
                    <Link to="/arcade" className="btn btn-ghost btn-circle"><ArrowLeft className="w-5 h-5" /></Link>
                    <h1 className="text-3xl font-extrabold">Rock Paper Scissors</h1>
                    <span className="badge badge-outline ml-auto capitalize">{difficulty}</span>
                </div>

                {/* Score bar */}
                <div className="flex justify-center gap-6 mb-6 text-center">
                    <div><p className="text-xs text-base-content/50">You</p><p className="text-2xl font-extrabold text-success">{score.player}</p></div>
                    <div><p className="text-xs text-base-content/50">Draw</p><p className="text-2xl font-extrabold text-warning">{score.draws}</p></div>
                    <div><p className="text-xs text-base-content/50">Bot</p><p className="text-2xl font-extrabold text-error">{score.bot}</p></div>
                </div>

                {!playerChoice ? (
                    <>
                        <p className="text-base-content/60 mb-8 text-center text-lg">Choose your weapon!</p>
                        <div className="flex justify-center gap-6">
                            {CHOICES.map((c) => (
                                <button key={c.id} onClick={() => handleChoice(c.id)}
                                    className="flex flex-col items-center gap-2 p-6 rounded-2xl bg-base-200 border-2 border-base-300 hover:border-primary hover:bg-base-300 hover:scale-110 active:scale-95 transition-all duration-200">
                                    <span className="text-5xl">{c.emoji}</span>
                                    <span className="text-sm font-bold">{c.label}</span>
                                </button>
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="text-center space-y-8">
                        <div className="flex items-center justify-center gap-8">
                            <div className="flex flex-col items-center gap-2">
                                <span className="text-6xl animate-bounce">{getChoiceEmoji(playerChoice)}</span>
                                <span className="text-sm font-bold text-primary">You</span>
                            </div>
                            <span className="text-3xl font-black text-base-content/30">VS</span>
                            <div className="flex flex-col items-center gap-2">
                                {revealing ? (
                                    <span className="text-6xl animate-spin">❓</span>
                                ) : (
                                    <span className="text-6xl animate-bounce">{getChoiceEmoji(botChoice)}</span>
                                )}
                                <span className="text-sm font-bold text-error">Bot</span>
                            </div>
                        </div>

                        {result && !revealing && (
                            <div className="space-y-4 animate-fade-in">
                                <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-2xl text-lg font-bold ${result === "win" ? "bg-success/20 text-success" : ""} ${result === "lose" ? "bg-error/20 text-error" : ""} ${result === "draw" ? "bg-warning/20 text-warning" : ""}`}>
                                    {result === "win" && <><Trophy className="w-6 h-6" /> You Won!</>}
                                    {result === "lose" && <><Frown className="w-6 h-6" /> You Lost!</>}
                                    {result === "draw" && <><Minus className="w-6 h-6" /> Draw!</>}
                                </div>
                                {pointsEarned > 0 && <p className="text-primary font-bold text-xl">+{pointsEarned} points!</p>}
                                <div className="flex gap-3 justify-center">
                                    <button onClick={playAgain} className="btn btn-primary gap-2"><RotateCcw className="w-4 h-4" /> Play Again</button>
                                    <button onClick={() => { playAgain(); setDifficulty(null); setScore({ player: 0, bot: 0, draws: 0 }); }} className="btn btn-ghost gap-2"><Settings className="w-4 h-4" /> Change Difficulty</button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
            <AchievementPopup achievements={achievements} onClose={() => setAchievements([])} />
        </div>
    );
};

export default RockPaperScissorsPage;
