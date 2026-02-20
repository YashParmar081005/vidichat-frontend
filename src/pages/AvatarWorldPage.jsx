import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAvatarItems, getMyAvatar, unlockAvatarItem, equipAvatarItem } from "../lib/api";
import { ArrowLeft, Lock, Check, Coins, Sparkles } from "lucide-react";
import toast from "react-hot-toast";

const AvatarWorldPage = () => {
    const queryClient = useQueryClient();

    const { data: items = [], isLoading: loadingItems } = useQuery({
        queryKey: ["avatarItems"],
        queryFn: getAvatarItems,
    });

    const { data: myAvatar, isLoading: loadingAvatar } = useQuery({
        queryKey: ["myAvatar"],
        queryFn: getMyAvatar,
    });

    const unlockMutation = useMutation({
        mutationFn: (itemId) => unlockAvatarItem(itemId),
        onSuccess: (data) => {
            toast.success(`Unlocked! −${data.pointsSpent} points`);
            queryClient.invalidateQueries({ queryKey: ["myAvatar"] });
            queryClient.invalidateQueries({ queryKey: ["arcadeProfile"] });
            queryClient.invalidateQueries({ queryKey: ["authUser"] });
        },
        onError: (err) => toast.error(err.response?.data?.message || "Failed to unlock"),
    });

    const equipMutation = useMutation({
        mutationFn: (itemId) => equipAvatarItem(itemId),
        onSuccess: () => {
            toast.success("Avatar equipped!");
            queryClient.invalidateQueries({ queryKey: ["myAvatar"] });
            queryClient.invalidateQueries({ queryKey: ["authUser"] });
        },
        onError: (err) => toast.error(err.response?.data?.message || "Failed to equip"),
    });

    const unlocked = myAvatar?.unlockedAvatars || [];
    const selectedAvatar = myAvatar?.selectedAvatar || "avatar1";
    const points = myAvatar?.points ?? 0;

    const selectedItem = items.find((i) => i.itemId === selectedAvatar);

    const isLoading = loadingItems || loadingAvatar;

    return (
        <div className="min-h-screen bg-base-100 p-4 lg:p-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <Link to="/" className="btn btn-ghost btn-circle">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div className="flex-1">
                        <h1 className="text-2xl sm:text-3xl font-bold">Avatar World</h1>
                        <p className="text-base-content/60 mt-0.5">Unlock & equip avatars using your arcade points</p>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30">
                        <Coins className="w-5 h-5 text-primary" />
                        <span className="font-bold text-primary text-lg">{points}</span>
                        <span className="text-xs text-base-content/50">pts</span>
                    </div>
                </div>

                {isLoading ? (
                    <div className="flex justify-center py-20">
                        <span className="loading loading-spinner loading-lg text-primary" />
                    </div>
                ) : (
                    <>
                        {/* Current Avatar */}
                        <div className="bg-base-200 rounded-2xl p-6 border border-base-300 mb-8 flex flex-col sm:flex-row items-center gap-6">
                            <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-primary shadow-xl shadow-primary/20 bg-white flex-shrink-0">
                                <img
                                    src={selectedItem?.image}
                                    alt="Current Avatar"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="text-center sm:text-left">
                                <p className="text-base-content/50 text-sm">Currently Equipped</p>
                                <p className="text-2xl font-extrabold">{selectedItem?.name || "Starter"}</p>
                                <p className="text-base-content/50 text-sm mt-1">
                                    {unlocked.length}/{items.length} avatars unlocked
                                </p>
                            </div>
                        </div>

                        {/* Avatar Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                            {items.map((item) => {
                                const isUnlocked = unlocked.includes(item.itemId);
                                const isEquipped = selectedAvatar === item.itemId;
                                const canAfford = points >= item.price;

                                return (
                                    <div
                                        key={item.itemId}
                                        className={`
                                            bg-base-200 rounded-2xl p-4 border-2 transition-all duration-300
                                            hover:shadow-lg hover:-translate-y-1
                                            ${isEquipped
                                                ? "border-primary shadow-lg shadow-primary/20"
                                                : isUnlocked
                                                    ? "border-success/40"
                                                    : "border-base-300"
                                            }
                                        `}
                                    >
                                        {/* Avatar Image */}
                                        <div className={`relative mb-3 ${!isUnlocked ? "opacity-40 grayscale" : ""}`}>
                                            <div className="w-full aspect-square rounded-xl overflow-hidden bg-white border border-base-300">
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            {!isUnlocked && (
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <Lock className="w-8 h-8 text-base-content/60" />
                                                </div>
                                            )}
                                        </div>

                                        {/* Name */}
                                        <p className="font-bold text-sm text-center mb-1">{item.name}</p>

                                        {/* Price tag */}
                                        {!isUnlocked && item.price > 0 && (
                                            <p className="text-xs text-center text-base-content/50 mb-2">
                                                {item.price} pts
                                            </p>
                                        )}

                                        {/* Action Button */}
                                        <div className="text-center mt-2">
                                            {isEquipped ? (
                                                <div className="badge badge-primary gap-1 badge-sm">
                                                    <Check className="w-3 h-3" /> Equipped
                                                </div>
                                            ) : isUnlocked ? (
                                                <button
                                                    onClick={() => equipMutation.mutate(item.itemId)}
                                                    disabled={equipMutation.isPending}
                                                    className="btn btn-xs btn-outline btn-primary gap-1 w-full"
                                                >
                                                    <Sparkles className="w-3 h-3" /> Use
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => unlockMutation.mutate(item.itemId)}
                                                    disabled={unlockMutation.isPending || !canAfford}
                                                    className={`btn btn-xs gap-1 w-full ${canAfford ? "btn-warning" : "btn-ghost opacity-50"}`}
                                                    title={!canAfford ? `Need ${item.price} pts` : ""}
                                                >
                                                    <Coins className="w-3 h-3" />
                                                    Buy · {item.price}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default AvatarWorldPage;
