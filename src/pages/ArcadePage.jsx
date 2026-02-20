import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getArcadeProfile } from "../lib/api";
import {
    Gamepad2, Trophy, Target, Keyboard, RotateCw,
    Star, Sword, Award, Hash, Calculator, Zap, LayoutGrid
} from "lucide-react";

const GAMES = [
    {
        id: "tictactoe",
        title: "Tic Tac Toe",
        description: "Challenge the AI in a classic 3×3 grid battle with adjustable difficulty.",
        icon: Target,
        color: "from-blue-500 to-cyan-400",
        bg: "bg-blue-500/10",
        link: "/arcade/tictactoe",
        points: "+3 win · +2 draw · +1 lose",
    },
    {
        id: "rps",
        title: "Rock Paper Scissors",
        description: "Quick-fire rounds against the bot. Pick your weapon and test your luck!",
        icon: Sword,
        color: "from-red-500 to-orange-400",
        bg: "bg-red-500/10",
        link: "/arcade/rps",
        points: "+2 win · +1 lose",
    },
    {
        id: "typing",
        title: "Typing Speed Test",
        description: "Race against a simulated bot. Type fast and accurately to win!",
        icon: Keyboard,
        color: "from-green-500 to-emerald-400",
        bg: "bg-green-500/10",
        link: "/arcade/typing",
        points: "+4 win · +2 lose",
    },
    {
        id: "numberguess",
        title: "Number Guessing",
        description: "Guess the secret number in 10 tries! Get hints to guide you.",
        icon: Hash,
        color: "from-violet-500 to-purple-400",
        bg: "bg-violet-500/10",
        link: "/arcade/numberguess",
        points: "+5 (1–2 tries) · +2 (7–10)",
    },
    {
        id: "math",
        title: "Math Battle",
        description: "Solve math problems faster than the bot to earn points!",
        icon: Calculator,
        color: "from-amber-500 to-yellow-400",
        bg: "bg-amber-500/10",
        link: "/arcade/math",
        points: "+4 win · +2 lose",
    },
    {
        id: "reaction",
        title: "Reaction Speed",
        description: "Test your reflexes! Click when the screen turns green.",
        icon: Zap,
        color: "from-pink-500 to-rose-400",
        bg: "bg-pink-500/10",
        link: "/arcade/reaction",
        points: "+5 (<200ms) · +2 (>400ms)",
    },
    {
        id: "memory",
        title: "Memory Cards",
        description: "Flip and match pairs of cards faster than the bot!",
        icon: LayoutGrid,
        color: "from-teal-500 to-cyan-400",
        bg: "bg-teal-500/10",
        link: "/arcade/memory",
        points: "+6 win · +3 lose",
    },
    {
        id: "spin",
        title: "Daily Spin Wheel",
        description: "Spin once daily for bonus points. Lady luck awaits!",
        icon: RotateCw,
        color: "from-purple-500 to-pink-400",
        bg: "bg-purple-500/10",
        link: "/arcade/spin",
        points: "1–5 pts daily",
    },
];

const ArcadePage = () => {
    const { data: profile, isLoading } = useQuery({
        queryKey: ["arcadeProfile"],
        queryFn: getArcadeProfile,
    });

    return (
        <div className="min-h-screen bg-base-100 p-4 lg:p-8">
            {/* Header */}
            <div className="max-w-6xl mx-auto mb-10">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold">
                            Arcade
                        </h1>
                        <p className="text-base-content/60 mt-1">Play solo games, earn points, climb the leaderboard.</p>
                    </div>

                    {!isLoading && profile && (
                        <div className="stats stats-horizontal shadow bg-base-200 border border-base-300">
                            <div className="stat px-4 py-2">
                                <div className="stat-title text-xs">Points</div>
                                <div className="stat-value text-primary text-xl">{profile.points}</div>
                            </div>
                            <div className="stat px-4 py-2">
                                <div className="stat-title text-xs">Wins</div>
                                <div className="stat-value text-success text-xl">{profile.wins}</div>
                            </div>
                            <div className="stat px-4 py-2">
                                <div className="stat-title text-xs">Games</div>
                                <div className="stat-value text-info text-xl">{profile.totalGames}</div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Game Cards */}
            <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {GAMES.map((game) => (
                    <Link
                        key={game.id}
                        to={game.link}
                        className="group card bg-base-200 border border-base-300 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
                    >
                        <div className="card-body items-center text-center">
                            <div className={`p-4 rounded-2xl ${game.bg} group-hover:scale-110 transition-transform duration-300`}>
                                <game.icon className="w-10 h-10 text-primary" />
                            </div>
                            <h3 className="card-title text-lg mt-2">{game.title}</h3>
                            <p className="text-sm text-base-content/60 leading-relaxed">{game.description}</p>
                            <div className="badge badge-ghost badge-sm mt-2">{game.points}</div>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Quick Links */}
            <div className="max-w-6xl mx-auto flex flex-wrap gap-4 justify-center">
                <Link to="/leaderboard" className="btn btn-outline btn-primary gap-2">
                    <Trophy className="w-5 h-5" /> Leaderboard
                </Link>
                <Link to="/profile" className="btn btn-outline gap-2">
                    <Award className="w-5 h-5" /> My Achievements
                </Link>
            </div>
        </div>
    );
};

export default ArcadePage;
