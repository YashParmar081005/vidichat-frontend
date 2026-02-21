import { useState, useCallback } from "react";
import { Link } from "../lib/simpleRouter";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { submitTicTacToe } from "../lib/api";
import { ArrowLeft, RotateCcw, Trophy, Frown, Minus, Settings } from "lucide-react";
import AchievementPopup from "../components/AchievementPopup";

// ---- Board helpers ----
function getAvailable(board) {
    return board.map((v, i) => (v === null ? i : null)).filter((v) => v !== null);
}

function checkWinner(board) {
    const lines = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6],
    ];
    for (const [a, b, c] of lines) {
        if (board[a] && board[a] === board[b] && board[a] === board[c]) return board[a];
    }
    return null;
}

// ---- Minimax (Hard) ----
function minimax(board, isMax) {
    const w = checkWinner(board);
    if (w === "O") return 10;
    if (w === "X") return -10;
    if (getAvailable(board).length === 0) return 0;

    if (isMax) {
        let best = -Infinity;
        for (const i of getAvailable(board)) { board[i] = "O"; best = Math.max(best, minimax(board, false)); board[i] = null; }
        return best;
    } else {
        let best = Infinity;
        for (const i of getAvailable(board)) { board[i] = "X"; best = Math.min(best, minimax(board, true)); board[i] = null; }
        return best;
    }
}

function getMinimaxMove(board) {
    let bestScore = -Infinity, move = null;
    for (const i of getAvailable(board)) {
        board[i] = "O";
        const score = minimax(board, false);
        board[i] = null;
        if (score > bestScore) { bestScore = score; move = i; }
    }
    return move;
}

// ---- Difficulty-based bot move ----
function getBotMove(board, difficulty) {
    const available = getAvailable(board);
    if (available.length === 0) return null;

    if (difficulty === "easy") {
        // Random move
        return available[Math.floor(Math.random() * available.length)];
    }
    if (difficulty === "medium") {
        // 50% optimal, 50% random
        if (Math.random() < 0.5) return getMinimaxMove([...board]);
        return available[Math.floor(Math.random() * available.length)];
    }
    // Hard — full minimax
    return getMinimaxMove([...board]);
}

const DIFFICULTIES = [
    { id: "easy", label: "Easy", desc: "Bot picks randomly", color: "btn-success" },
    { id: "medium", label: "Medium", desc: "Bot plays smart 50%", color: "btn-warning" },
    { id: "hard", label: "Hard", desc: "Unbeatable Minimax", color: "btn-error" },
];

const TicTacToePage = () => {
    const [difficulty, setDifficulty] = useState(null);
    const [board, setBoard] = useState(Array(9).fill(null));
    const [gameOver, setGameOver] = useState(false);
    const [result, setResult] = useState(null);
    const [achievements, setAchievements] = useState([]);
    const [pointsEarned, setPointsEarned] = useState(0);
    const [thinking, setThinking] = useState(false);
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: submitTicTacToe,
        onSuccess: (data) => {
            setPointsEarned(data.pointsEarned);
            if (data.newAchievements?.length) setAchievements(data.newAchievements);
            queryClient.invalidateQueries({ queryKey: ["arcadeProfile"] });
        },
    });

    const handleCellClick = useCallback(
        (index) => {
            if (board[index] || gameOver || thinking) return;
            const newBoard = [...board];
            newBoard[index] = "X";

            const winner = checkWinner(newBoard);
            if (winner === "X") {
                setBoard(newBoard); setResult("win"); setGameOver(true); mutation.mutate("win"); return;
            }
            if (getAvailable(newBoard).length === 0) {
                setBoard(newBoard); setResult("draw"); setGameOver(true); mutation.mutate("draw"); return;
            }

            setThinking(true);
            setBoard(newBoard);

            setTimeout(() => {
                const botIdx = getBotMove([...newBoard], difficulty);
                if (botIdx !== null) {
                    newBoard[botIdx] = "O";
                    setBoard([...newBoard]);
                    const bw = checkWinner(newBoard);
                    if (bw === "O") { setResult("lose"); setGameOver(true); mutation.mutate("lose"); }
                    else if (getAvailable(newBoard).length === 0) { setResult("draw"); setGameOver(true); mutation.mutate("draw"); }
                }
                setThinking(false);
            }, 400);
        },
        [board, gameOver, thinking, mutation, difficulty]
    );

    const resetGame = () => {
        setBoard(Array(9).fill(null)); setGameOver(false); setResult(null);
        setPointsEarned(0); setAchievements([]);
    };

    const getCellStyle = (v) => v === "X" ? "text-primary font-black text-3xl" : v === "O" ? "text-error font-black text-3xl" : "";

    // Difficulty selection screen
    if (!difficulty) {
        return (
            <div className="min-h-screen bg-base-100 p-4 lg:p-8 flex flex-col items-center">
                <div className="w-full max-w-lg">
                    <div className="flex items-center gap-4 mb-8">
                        <Link to="/arcade" className="btn btn-ghost btn-circle"><ArrowLeft className="w-5 h-5" /></Link>
                        <h1 className="text-3xl font-extrabold">Tic Tac Toe</h1>
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
                    <h1 className="text-3xl font-extrabold">Tic Tac Toe</h1>
                    <span className="badge badge-outline ml-auto capitalize">{difficulty}</span>
                </div>

                <p className="text-base-content/60 mb-6 text-center">
                    You are <span className="text-primary font-bold">X</span>. Bot is <span className="text-error font-bold">O</span>.
                </p>

                <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto mb-8">
                    {board.map((cell, i) => (
                        <button key={i} onClick={() => handleCellClick(i)} disabled={cell || gameOver || thinking}
                            className={`aspect-square rounded-xl border-2 border-base-300 bg-base-200 flex items-center justify-center text-4xl font-extrabold hover:bg-base-300 transition-all duration-200 active:scale-95 disabled:cursor-default disabled:hover:bg-base-200 ${getCellStyle(cell)}`}>
                            {cell}
                        </button>
                    ))}
                </div>

                {thinking && (
                    <div className="text-center mb-4">
                        <span className="loading loading-dots loading-md text-error"></span>
                        <p className="text-sm text-base-content/50 mt-1">Bot is thinking...</p>
                    </div>
                )}

                {gameOver && (
                    <div className="text-center space-y-4 animate-fade-in">
                        <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-2xl text-lg font-bold ${result === "win" ? "bg-success/20 text-success" : ""} ${result === "lose" ? "bg-error/20 text-error" : ""} ${result === "draw" ? "bg-warning/20 text-warning" : ""}`}>
                            {result === "win" && <><Trophy className="w-6 h-6" /> You Won!</>}
                            {result === "lose" && <><Frown className="w-6 h-6" /> You Lost!</>}
                            {result === "draw" && <><Minus className="w-6 h-6" /> Draw!</>}
                        </div>
                        {pointsEarned > 0 && <p className="text-primary font-bold text-xl">+{pointsEarned} points!</p>}
                        <div className="flex gap-3 justify-center">
                            <button onClick={resetGame} className="btn btn-primary gap-2"><RotateCcw className="w-4 h-4" /> Play Again</button>
                            <button onClick={() => { resetGame(); setDifficulty(null); }} className="btn btn-ghost gap-2"><Settings className="w-4 h-4" /> Change Difficulty</button>
                        </div>
                    </div>
                )}
            </div>
            <AchievementPopup achievements={achievements} onClose={() => setAchievements([])} />
        </div>
    );
};

export default TicTacToePage;
