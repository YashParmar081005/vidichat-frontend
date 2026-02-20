import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { getLeaderboard } from "../lib/api";
import { ArrowLeft, Trophy, Medal, Crown } from "lucide-react";
import useAuthUser from "../hooks/useAuthUser";
import Avatar from "../components/Avatar";

const LeaderboardPage = () => {
    const { authUser } = useAuthUser();
    const { data: users, isLoading } = useQuery({
        queryKey: ["leaderboard"],
        queryFn: getLeaderboard,
    });

    const getRankIcon = (rank) => {
        if (rank === 1) return <Crown className="w-5 h-5 text-yellow-400" />;
        if (rank === 2) return <Medal className="w-5 h-5 text-gray-400" />;
        if (rank === 3) return <Medal className="w-5 h-5 text-amber-700" />;
        return <span className="text-sm font-bold text-base-content/50">#{rank}</span>;
    };

    return (
        <div className="min-h-screen bg-base-100 p-4 lg:p-8">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <Link to="/arcade" className="btn btn-ghost btn-circle">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <h1 className="text-2xl sm:text-3xl font-bold">
                        Leaderboard
                    </h1>
                </div>

                {isLoading ? (
                    <div className="flex justify-center py-20">
                        <span className="loading loading-spinner loading-lg text-primary"></span>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {/* Top 3 Cards */}
                        {users?.slice(0, 3).length > 0 && (
                            <div className="grid grid-cols-3 gap-4 mb-8">
                                {[1, 0, 2].map((rank) => {
                                    const user = users?.[rank];
                                    if (!user) return <div key={rank} />;
                                    const isMe = user._id === authUser?._id;
                                    return (
                                        <div
                                            key={user._id}
                                            className={`
                        flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all
                        ${rank === 0 ? "bg-yellow-500/10 border-yellow-500/30 order-2 scale-105" : ""}
                        ${rank === 1 ? "bg-gray-300/10 border-gray-300/30 order-1 mt-4" : ""}
                        ${rank === 2 ? "bg-amber-700/10 border-amber-700/30 order-3 mt-6" : ""}
                        ${isMe ? "ring-2 ring-primary" : ""}
                      `}
                                        >
                                            <div className="text-2xl">{getRankIcon(rank + 1)}</div>
                                            <Avatar src={user.profilePic} size="small" />
                                            <p className="font-bold text-sm truncate max-w-full">{user.fullName}</p>
                                            <p className="text-primary font-extrabold text-lg">{user.points}</p>
                                            <div className="flex gap-2 text-xs text-base-content/50">
                                                <span>{user.wins}W</span>
                                                <span>·</span>
                                                <span>{user.totalGames}G</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {/* Rest of list */}
                        <div className="overflow-x-auto">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th className="w-16">Rank</th>
                                        <th>Player</th>
                                        <th className="text-right">Points</th>
                                        <th className="text-right hidden sm:table-cell">Wins</th>
                                        <th className="text-right hidden sm:table-cell">Games</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users?.slice(3).map((user, i) => {
                                        const rank = i + 4;
                                        const isMe = user._id === authUser?._id;
                                        return (
                                            <tr
                                                key={user._id}
                                                className={`hover ${isMe ? "bg-primary/5 font-bold" : ""}`}
                                            >
                                                <td>{getRankIcon(rank)}</td>
                                                <td>
                                                    <div className="flex items-center gap-3">
                                                        <Avatar src={user.profilePic} size="small" />
                                                        <span className="truncate max-w-[150px]">{user.fullName}</span>
                                                        {isMe && <span className="badge badge-primary badge-sm">You</span>}
                                                    </div>
                                                </td>
                                                <td className="text-right text-primary font-bold">{user.points}</td>
                                                <td className="text-right hidden sm:table-cell">{user.wins}</td>
                                                <td className="text-right hidden sm:table-cell">{user.totalGames}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {(!users || users.length === 0) && (
                            <div className="text-center py-12 text-base-content/40">
                                <Trophy className="w-16 h-16 mx-auto mb-4 opacity-30" />
                                <p className="text-lg">No players yet. Be the first!</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default LeaderboardPage;
