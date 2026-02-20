import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { submitMemory } from "../lib/api";
import { ArrowLeft, RotateCcw, Trophy, Frown, Settings, Timer } from "lucide-react";
import AchievementPopup from "../components/AchievementPopup";

const EMOJIS = ["🍎", "🍕", "🎸", "🚀", "🌟", "🎯", "🦋", "🔥", "💎", "🎩", "🌈", "🍀"];

const DIFFICULTIES = [
    { id: "easy", label: "Easy", desc: "3×2 grid (6 cards)", color: "btn-success", pairs: 3, cols: 3 },
    { id: "medium", label: "Medium", desc: "4×3 grid (12 cards)", color: "btn-warning", pairs: 6, cols: 4 },
    { id: "hard", label: "Hard", desc: "4×4 grid (16 cards)", color: "btn-error", pairs: 8, cols: 4 },
];

function shuffleArray(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

const MemoryGamePage = () => {
    const [difficulty, setDifficulty] = useState(null);
    const [config, setConfig] = useState(null);
    const [cards, setCards] = useState([]);
    const [flipped, setFlipped] = useState([]);
    const [matched, setMatched] = useState([]);
    const [moves, setMoves] = useState(0);
    const [startTime, setStartTime] = useState(null);
    const [timeElapsed, setTimeElapsed] = useState(0);
    const [finished, setFinished] = useState(false);
    const [gameResult, setGameResult] = useState(null);
    const [botTime, setBotTime] = useState(0);
    const [pointsEarned, setPointsEarned] = useState(0);
    const [achievements, setAchievements] = useState([]);
    const [lockBoard, setLockBoard] = useState(false);
    const timerRef = useRef(null);
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: (data) => submitMemory(data),
        onSuccess: (data) => {
            setBotTime(data.botTime);
            setGameResult(data.result);
            setPointsEarned(data.pointsEarned);
            if (data.newAchievements?.length) setAchievements(data.newAchievements);
            queryClient.invalidateQueries({ queryKey: ["arcadeProfile"] });
        },
    });

    const startGame = useCallback((diff) => {
        const cfg = DIFFICULTIES.find((d) => d.id === diff);
        const selectedEmojis = EMOJIS.slice(0, cfg.pairs);
        const deck = shuffleArray([...selectedEmojis, ...selectedEmojis]);
        setConfig(cfg);
        setCards(deck.map((emoji, i) => ({ id: i, emoji, flipped: false, matched: false })));
        setFlipped([]);
        setMatched([]);
        setMoves(0);
        setFinished(false);
        setGameResult(null);
        setBotTime(0);
        setPointsEarned(0);
        setAchievements([]);
        setTimeElapsed(0);
        setStartTime(Date.now());
        setLockBoard(false);
    }, []);

    useEffect(() => {
        if (startTime && !finished) {
            timerRef.current = setInterval(() => {
                setTimeElapsed(Math.floor((Date.now() - startTime) / 1000));
            }, 1000);
        }
        return () => clearInterval(timerRef.current);
    }, [startTime, finished]);

    const handleCardClick = (index) => {
        if (lockBoard || finished) return;
        if (flipped.includes(index) || matched.includes(index)) return;

        const newFlipped = [...flipped, index];
        setFlipped(newFlipped);

        if (newFlipped.length === 2) {
            setMoves((m) => m + 1);
            setLockBoard(true);

            const [first, second] = newFlipped;
            if (cards[first].emoji === cards[second].emoji) {
                const newMatched = [...matched, first, second];
                setMatched(newMatched);
                setFlipped([]);
                setLockBoard(false);

                // Check if all matched
                if (newMatched.length === cards.length) {
                    clearInterval(timerRef.current);
                    setFinished(true);
                    const completionTime = Math.floor((Date.now() - startTime) / 1000);
                    setTimeElapsed(completionTime);
                    mutation.mutate({ completionTime, difficulty });
                }
            } else {
                setTimeout(() => {
                    setFlipped([]);
                    setLockBoard(false);
                }, 800);
            }
        }
    };

    const isCardVisible = (index) => flipped.includes(index) || matched.includes(index);

    // Difficulty selection
    if (!difficulty) {
        return (
            <div className="min-h-screen bg-base-100 p-4 lg:p-8 flex flex-col items-center">
                <div className="w-full max-w-lg">
                    <div className="flex items-center gap-4 mb-8">
                        <Link to="/arcade" className="btn btn-ghost btn-circle"><ArrowLeft className="w-5 h-5" /></Link>
                        <h1 className="text-3xl font-extrabold">🃏 Memory Cards</h1>
                    </div>
                    <p className="text-base-content/60 mb-8 text-center text-lg">Select difficulty level</p>
                    <div className="flex flex-col gap-4 max-w-sm mx-auto">
                        {DIFFICULTIES.map((d) => (
                            <button key={d.id} onClick={() => { setDifficulty(d.id); startGame(d.id); }}
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
                    <h1 className="text-3xl font-extrabold">🃏 Memory Cards</h1>
                    <span className="badge badge-outline ml-auto capitalize">{difficulty}</span>
                </div>

                {/* Stats bar */}
                <div className="flex justify-center gap-6 mb-6">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-base-200 border border-base-300">
                        <Timer className="w-4 h-4 text-warning" />
                        <span className="font-mono font-bold">{timeElapsed}s</span>
                    </div>
                    <div className="px-4 py-2 rounded-full bg-base-200 border border-base-300">
                        <span className="font-bold text-sm">Moves: {moves}</span>
                    </div>
                    <div className="px-4 py-2 rounded-full bg-base-200 border border-base-300">
                        <span className="font-bold text-sm">{matched.length / 2}/{config?.pairs} pairs</span>
                    </div>
                </div>

                {/* Card Grid */}
                {!finished && config && (
                    <div className={`grid gap-3 mx-auto mb-6`}
                        style={{ gridTemplateColumns: `repeat(${config.cols}, 1fr)`, maxWidth: config.cols * 84 }}>
                        {cards.map((card, i) => (
                            <button key={i} onClick={() => handleCardClick(i)}
                                className={`
                                    aspect-square rounded-xl text-3xl font-bold flex items-center justify-center
                                    transition-all duration-300 transform
                                    ${isCardVisible(i)
                                        ? matched.includes(i)
                                            ? "bg-success/20 border-2 border-success scale-95"
                                            : "bg-primary/20 border-2 border-primary"
                                        : "bg-base-200 border-2 border-base-300 hover:border-primary hover:scale-105 cursor-pointer"
                                    }
                                `}
                                disabled={lockBoard || isCardVisible(i)}>
                                <span className={`transition-opacity duration-200 ${isCardVisible(i) ? "opacity-100" : "opacity-0"}`}>
                                    {card.emoji}
                                </span>
                                {!isCardVisible(i) && <span className="absolute text-2xl">❓</span>}
                            </button>
                        ))}
                    </div>
                )}

                {/* Result */}
                {finished && (
                    <div className="text-center space-y-4 animate-fade-in">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-base-200 rounded-2xl p-4 border border-base-300">
                                <p className="text-sm text-base-content/50 mb-1">Your Time</p>
                                <p className="text-3xl font-extrabold text-primary">{timeElapsed}s</p>
                                <p className="text-xs mt-1">{moves} moves</p>
                            </div>
                            <div className="bg-base-200 rounded-2xl p-4 border border-base-300">
                                <p className="text-sm text-base-content/50 mb-1">Bot Time</p>
                                <p className="text-3xl font-extrabold text-error">{botTime}s</p>
                            </div>
                        </div>

                        <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-2xl text-lg font-bold ${gameResult === "win" ? "bg-success/20 text-success" : "bg-error/20 text-error"}`}>
                            {gameResult === "win" ? <><Trophy className="w-6 h-6" /> You Won!</> : <><Frown className="w-6 h-6" /> Bot was faster!</>}
                        </div>
                        {pointsEarned > 0 && <p className="text-primary font-bold text-xl">+{pointsEarned} points!</p>}
                        <div className="flex gap-3 justify-center">
                            <button onClick={() => startGame(difficulty)} className="btn btn-primary gap-2"><RotateCcw className="w-4 h-4" /> Play Again</button>
                            <button onClick={() => setDifficulty(null)} className="btn btn-ghost gap-2"><Settings className="w-4 h-4" /> Change Difficulty</button>
                        </div>
                    </div>
                )}
            </div>
            <AchievementPopup achievements={achievements} onClose={() => setAchievements([])} />
        </div>
    );
};

export default MemoryGamePage;
