import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "../lib/simpleRouter";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { submitTyping } from "../lib/api";
import { ArrowLeft, RotateCcw, Trophy, Frown, Timer, Keyboard, Settings, Send } from "lucide-react";
import AchievementPopup from "../components/AchievementPopup";

const SENTENCES_EASY = [
    "The cat sat on the mat.",
    "I love to play games.",
    "The sun is very bright today.",
    "Birds fly high in the sky.",
    "She runs fast every morning.",
];

const SENTENCES_MEDIUM = [
    "The quick brown fox jumps over the lazy dog near the riverbank.",
    "A journey of a thousand miles begins with a single step forward.",
    "She sells seashells by the seashore on a sunny afternoon.",
    "Every moment is a fresh beginning if you choose to see it.",
    "Technology is best when it brings people together in harmony.",
];

const SENTENCES_HARD = [
    "Innovation distinguishes between a leader and a follower, and those who dare to think differently ultimately change the world.",
    "In the middle of every difficulty lies a hidden opportunity for extraordinary growth and unprecedented transformation.",
    "The boundaries of our imagination are often the only real limitations we face in achieving remarkable success and meaningful progress.",
    "Perseverance combined with strategic patience ultimately enables individuals to overcome seemingly insurmountable challenges throughout their journey.",
    "Creativity requires the courage to let go of established certainties and embrace the beautiful uncertainty of unexplored possibilities.",
];

const SENTENCE_MAP = { easy: SENTENCES_EASY, medium: SENTENCES_MEDIUM, hard: SENTENCES_HARD };

const DIFFICULTIES = [
    { id: "easy", label: "Easy", desc: "Short sentences", color: "btn-success" },
    { id: "medium", label: "Medium", desc: "Medium-length sentences", color: "btn-warning" },
    { id: "hard", label: "Hard", desc: "Long complex sentences", color: "btn-error" },
];

const TypingTestPage = () => {
    const [difficulty, setDifficulty] = useState(null);
    const [sentence, setSentence] = useState("");
    const [userInput, setUserInput] = useState("");
    const [started, setStarted] = useState(false);
    const [finished, setFinished] = useState(false);
    const [startTime, setStartTime] = useState(null);
    const [userWPM, setUserWPM] = useState(0);
    const [botWPM, setBotWPM] = useState(0);
    const [result, setResult] = useState(null);
    const [pointsEarned, setPointsEarned] = useState(0);
    const [achievements, setAchievements] = useState([]);
    const [timeElapsed, setTimeElapsed] = useState(0);
    const inputRef = useRef(null);
    const timerRef = useRef(null);
    const queryClient = useQueryClient();

    const pickSentence = useCallback((diff) => {
        const pool = SENTENCE_MAP[diff || "medium"];
        setSentence(pool[Math.floor(Math.random() * pool.length)]);
    }, []);

    useEffect(() => {
        if (started && !finished) {
            timerRef.current = setInterval(() => setTimeElapsed((t) => t + 1), 1000);
        }
        return () => clearInterval(timerRef.current);
    }, [started, finished]);

    const mutation = useMutation({
        mutationFn: submitTyping,
        onSuccess: (data) => {
            setBotWPM(data.botWPM);
            setResult(data.result);
            setPointsEarned(data.pointsEarned);
            if (data.newAchievements?.length) setAchievements(data.newAchievements);
            queryClient.invalidateQueries({ queryKey: ["arcadeProfile"] });
        },
    });

    const finishGame = useCallback(() => {
        if (finished || !started) return;
        clearInterval(timerRef.current);
        setFinished(true);
        const elapsed = (Date.now() - startTime) / 1000 / 60;
        // Count correctly typed words
        const sentenceWords = sentence.split(" ");
        const inputWords = userInput.split(" ");
        let correctWords = 0;
        for (let i = 0; i < Math.min(sentenceWords.length, inputWords.length); i++) {
            if (sentenceWords[i] === inputWords[i]) correctWords++;
        }
        const wpm = Math.max(1, Math.round(correctWords / elapsed));
        setUserWPM(wpm);
        mutation.mutate(wpm);
    }, [finished, started, startTime, sentence, userInput, mutation]);

    const handleInputChange = (e) => {
        const val = e.target.value;
        if (!started) { setStarted(true); setStartTime(Date.now()); }
        setUserInput(val);
        // Auto-submit on exact match
        if (val === sentence) finishGame();
    };

    const handleSubmit = () => {
        if (started && !finished && userInput.length > 0) finishGame();
    };

    const resetGame = () => {
        pickSentence(difficulty);
        setUserInput(""); setStarted(false); setFinished(false); setStartTime(null);
        setUserWPM(0); setBotWPM(0); setResult(null); setPointsEarned(0);
        setAchievements([]); setTimeElapsed(0);
        setTimeout(() => inputRef.current?.focus(), 100);
    };

    const getCharClass = (i) => {
        if (i >= userInput.length) return "text-base-content/30";
        if (userInput[i] === sentence[i]) return "text-success";
        return "text-error bg-error/20 rounded";
    };

    // Difficulty selection
    if (!difficulty) {
        return (
            <div className="min-h-screen bg-base-100 p-4 lg:p-8 flex flex-col items-center">
                <div className="w-full max-w-2xl">
                    <div className="flex items-center gap-4 mb-8">
                        <Link to="/arcade" className="btn btn-ghost btn-circle"><ArrowLeft className="w-5 h-5" /></Link>
                        <h1 className="text-3xl font-extrabold flex items-center gap-2"><Keyboard className="w-8 h-8 text-primary" /> Typing Speed Test</h1>
                    </div>
                    <p className="text-base-content/60 mb-8 text-center text-lg">Select difficulty level</p>
                    <div className="flex flex-col gap-4 max-w-sm mx-auto">
                        {DIFFICULTIES.map((d) => (
                            <button key={d.id} onClick={() => { setDifficulty(d.id); pickSentence(d.id); }}
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
            <div className="w-full max-w-2xl">
                <div className="flex items-center gap-4 mb-8">
                    <Link to="/arcade" className="btn btn-ghost btn-circle"><ArrowLeft className="w-5 h-5" /></Link>
                    <h1 className="text-3xl font-extrabold flex items-center gap-2"><Keyboard className="w-8 h-8 text-primary" /> Typing Speed Test</h1>
                    <span className="badge badge-outline ml-auto capitalize">{difficulty}</span>
                </div>

                {started && !finished && (
                    <div className="text-center mb-4">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-base-200 border border-base-300">
                            <Timer className="w-4 h-4 text-warning" />
                            <span className="font-mono font-bold text-lg">{timeElapsed}s</span>
                        </div>
                    </div>
                )}

                <div className="bg-base-200 rounded-2xl p-6 mb-6 border border-base-300 font-mono text-lg leading-relaxed tracking-wide">
                    {sentence.split("").map((char, i) => (
                        <span key={i} className={`${getCharClass(i)} transition-colors`}>{char}</span>
                    ))}
                </div>

                {!finished && (
                    <div className="space-y-3">
                        <textarea ref={inputRef} value={userInput} onChange={handleInputChange} autoFocus
                            placeholder="Start typing here..."
                            className="textarea textarea-bordered w-full h-24 font-mono text-lg resize-none focus:textarea-primary" />
                        {started && (
                            <button onClick={handleSubmit} className="btn btn-primary w-full gap-2">
                                <Send className="w-4 h-4" /> Submit Answer
                            </button>
                        )}
                    </div>
                )}

                {!started && <p className="text-center text-base-content/50 mt-4">Start typing to begin the race! ⌨️</p>}

                {finished && result && (
                    <div className="text-center space-y-6 animate-fade-in mt-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-base-200 rounded-2xl p-4 border border-base-300">
                                <p className="text-sm text-base-content/50 mb-1">Your WPM</p>
                                <p className="text-4xl font-extrabold text-primary">{userWPM}</p>
                            </div>
                            <div className="bg-base-200 rounded-2xl p-4 border border-base-300">
                                <p className="text-sm text-base-content/50 mb-1">Bot WPM</p>
                                <p className="text-4xl font-extrabold text-error">{botWPM}</p>
                            </div>
                        </div>
                        <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-2xl text-lg font-bold ${result === "win" ? "bg-success/20 text-success" : "bg-error/20 text-error"}`}>
                            {result === "win" ? <><Trophy className="w-6 h-6" /> You Beat the Bot!</> : <><Frown className="w-6 h-6" /> Bot was faster!</>}
                        </div>
                        {pointsEarned > 0 && <p className="text-primary font-bold text-xl">+{pointsEarned} points!</p>}
                        <div className="flex gap-3 justify-center">
                            <button onClick={resetGame} className="btn btn-primary gap-2"><RotateCcw className="w-4 h-4" /> Try Again</button>
                            <button onClick={() => { resetGame(); setDifficulty(null); }} className="btn btn-ghost gap-2"><Settings className="w-4 h-4" /> Change Difficulty</button>
                        </div>
                    </div>
                )}
            </div>
            <AchievementPopup achievements={achievements} onClose={() => setAchievements([])} />
        </div>
    );
};

export default TypingTestPage;
