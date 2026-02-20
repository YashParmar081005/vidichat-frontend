import { useState } from "react";
import useAuthUser from "../hooks/useAuthUser";
import { Camera, Mail, MapPin, User, Gamepad2, Star, Award } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { getUserFriends, getArcadeProfile, getAvatarItems, getMyAvatar } from "../lib/api";
import FriendCard from "../components/FriendCard";
import NoFriendsFound from "../components/NoFriendsFound";
import Avatar from "../components/Avatar";
import { Link } from "react-router-dom";

const ACHIEVEMENT_INFO = {
    first_win: { name: "First Win", desc: "Won your first game", icon: "🏆" },
    "10_wins": { name: "10 Wins", desc: "Won 10 games", icon: "🔟" },
    "50_wins": { name: "50 Wins", desc: "Won 50 games", icon: "🌟" },
    "100_games": { name: "Century", desc: "Played 100 games", icon: "💯" },
};

const ProfilePage = () => {
    const { authUser } = useAuthUser();
    const [formData, setFormData] = useState({
        fullName: authUser?.fullName || "",
        email: authUser?.email || "",
        bio: authUser?.bio || "",
        location: authUser?.location || "",
        learningLanguage: authUser?.learningLanguage || "",
        nativeLanguage: authUser?.nativeLanguage || "",
    });

    const queryClient = useQueryClient();

    const { data: friends = [], isLoading: loadingFriends } = useQuery({
        queryKey: ["friends"],
        queryFn: getUserFriends,
    });

    const { data: arcadeProfile } = useQuery({
        queryKey: ["arcadeProfile"],
        queryFn: getArcadeProfile,
    });

    const { data: avatarItems = [] } = useQuery({
        queryKey: ["avatarItems"],
        queryFn: getAvatarItems,
    });

    const { data: myAvatar } = useQuery({
        queryKey: ["myAvatar"],
        queryFn: getMyAvatar,
    });

    const { mutate: updateProfile, isPending } = useMutation({
        mutationFn: async (data) => {
            const res = await axiosInstance.put("/auth/update-profile", data);
            return res.data;
        },
        onSuccess: () => {
            toast.success("Profile updated successfully");
            queryClient.invalidateQueries({ queryKey: ["authUser"] });
        },
        onError: (error) => {
            toast.error(error.response.data.message || "Failed to update profile");
        },
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        updateProfile(formData);
    };

    const achievements = authUser?.achievements || [];
    const selectedAvatarItem = avatarItems.find((i) => i.itemId === myAvatar?.selectedAvatar);

    return (
        <div className="pt-6 pb-20 px-4 w-full">
            <div className="max-w-5xl mx-auto flex flex-col lg:flex-row gap-8">

                {/* Left Side - Profile Info */}
                <div className="flex-1 space-y-6">
                    <div className="bg-base-200 rounded-2xl p-6 shadow-sm border border-base-300">
                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-bold">Profile</h1>
                            <p className="mt-1 text-base-content/60">Manage your personal information</p>
                        </div>

                        {/* Avatar Upload */}
                        <div className="flex flex-col items-center gap-4 mb-8">
                            <div className="relative group">
                                <div className="avatar">
                                    <Avatar src={authUser?.profilePic} size="xl" className="ring ring-primary ring-offset-base-100 ring-offset-4" />
                                </div>
                                <label
                                    htmlFor="avatar-upload"
                                    className={`
                                      absolute bottom-0 right-0 
                                      bg-primary text-primary-content hover:bg-primary-focus
                                      p-2.5 rounded-full cursor-pointer 
                                      shadow-lg transition-all duration-200
                                      hover:scale-110 active:scale-95
                                      ${isPending ? "animate-pulse pointer-events-none" : ""}
                                    `}
                                >
                                    <Camera className="w-5 h-5" />
                                    <input
                                        type="file"
                                        id="avatar-upload"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={async (e) => {
                                            const file = e.target.files[0];
                                            if (!file) return;

                                            const reader = new FileReader();
                                            reader.readAsDataURL(file);

                                            reader.onload = async () => {
                                                const base64Image = reader.result;
                                                try {
                                                    await axiosInstance.put("/auth/update-profile", { profilePic: base64Image });
                                                    queryClient.invalidateQueries({ queryKey: ["authUser"] });
                                                    toast.success("Profile picture updated successfully");
                                                } catch (error) {
                                                    toast.error("Failed to update profile picture");
                                                }
                                            };
                                        }}
                                        disabled={isPending}
                                    />
                                </label>
                            </div>
                            <p className="text-sm text-base-content/60">
                                {isPending ? "Updating..." : "Tap the camera to update"}
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text flex items-center gap-2 font-medium">
                                        <User className="w-4 h-4" /> Full Name
                                    </span>
                                </label>
                                <input
                                    type="text"
                                    className="input input-bordered w-full focus:input-primary bg-base-100"
                                    value={formData.fullName}
                                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                    placeholder="Your full name"
                                />
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text flex items-center gap-2 font-medium">
                                        <Mail className="w-4 h-4" /> Email
                                    </span>
                                </label>
                                <input
                                    type="email"
                                    className="input input-bordered w-full bg-base-100 opacity-70 cursor-not-allowed"
                                    value={formData.email}
                                    disabled
                                />
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text flex items-center gap-2 font-medium">
                                        <MapPin className="w-4 h-4" /> Location
                                    </span>
                                </label>
                                <input
                                    type="text"
                                    className="input input-bordered w-full focus:input-primary bg-base-100"
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    placeholder="e.g. New York, USA"
                                />
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-medium">Bio</span>
                                </label>
                                <textarea
                                    className="textarea textarea-bordered h-24 focus:textarea-primary bg-base-100 resize-none text-base"
                                    value={formData.bio}
                                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                    placeholder="Tell us a little about yourself..."
                                />
                            </div>

                            <div className="bg-base-100/50 rounded-lg p-4 mt-4 border border-base-content/5">
                                <div className="flex items-center justify-between py-2 border-b border-base-content/10">
                                    <span className="text-sm text-base-content/70">Member Since</span>
                                    <span className="text-sm font-medium">{authUser.createdAt?.split("T")[0]}</span>
                                </div>
                                <div className="flex items-center justify-between py-2">
                                    <span className="text-sm text-base-content/70">Status</span>
                                    <span className="text-sm font-medium text-success">Active</span>
                                </div>
                            </div>

                            <button type="submit" className="btn btn-primary w-full mt-4 text-lg" disabled={isPending}>
                                {isPending ? <span className="loading loading-dots" /> : "Save Changes"}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Right Side */}
                <div className="lg:w-96 space-y-6">

                    {/* Avatar Preview */}
                    {selectedAvatarItem && (
                        <div className="bg-base-200 rounded-2xl p-6 shadow-sm border border-base-300">
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                🧑‍🚀 My Avatar
                            </h2>
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-primary shadow-lg bg-white flex-shrink-0">
                                    <img src={selectedAvatarItem.image} alt={selectedAvatarItem.name} className="w-full h-full object-cover" />
                                </div>
                                <div>
                                    <p className="font-extrabold text-lg">{selectedAvatarItem.name}</p>
                                    <p className="text-sm text-base-content/50">{myAvatar?.unlockedAvatars?.length || 1} / {avatarItems.length} unlocked</p>
                                </div>
                            </div>
                            <Link to="/avatar" className="btn btn-outline btn-primary btn-sm w-full">
                                Customize Avatar
                            </Link>
                        </div>
                    )}

                    {/* Arcade Stats */}
                    {arcadeProfile && (
                        <div className="bg-base-200 rounded-2xl p-6 shadow-sm border border-base-300">
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <Gamepad2 className="w-5 h-5 text-primary" /> Arcade Stats
                            </h2>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-base-100 rounded-xl p-3 text-center border border-base-content/5">
                                    <p className="text-2xl font-extrabold text-primary">{arcadeProfile.points}</p>
                                    <p className="text-xs text-base-content/50">Points</p>
                                </div>
                                <div className="bg-base-100 rounded-xl p-3 text-center border border-base-content/5">
                                    <p className="text-2xl font-extrabold text-success">{arcadeProfile.wins}</p>
                                    <p className="text-xs text-base-content/50">Wins</p>
                                </div>
                                <div className="bg-base-100 rounded-xl p-3 text-center border border-base-content/5">
                                    <p className="text-2xl font-extrabold text-error">{arcadeProfile.losses}</p>
                                    <p className="text-xs text-base-content/50">Losses</p>
                                </div>
                                <div className="bg-base-100 rounded-xl p-3 text-center border border-base-content/5">
                                    <p className="text-2xl font-extrabold text-info">{arcadeProfile.totalGames}</p>
                                    <p className="text-xs text-base-content/50">Total Games</p>
                                </div>
                            </div>
                            {arcadeProfile.totalGames > 0 && (
                                <div className="mt-3">
                                    <div className="flex justify-between text-xs text-base-content/50 mb-1">
                                        <span>Win Rate</span>
                                        <span>{Math.round((arcadeProfile.wins / arcadeProfile.totalGames) * 100)}%</span>
                                    </div>
                                    <progress
                                        className="progress progress-primary w-full"
                                        value={arcadeProfile.wins}
                                        max={arcadeProfile.totalGames}
                                    />
                                </div>
                            )}
                        </div>
                    )}

                    {/* Achievements */}
                    <div className="bg-base-200 rounded-2xl p-6 shadow-sm border border-base-300">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <Award className="w-5 h-5 text-warning" /> Achievements
                        </h2>
                        {achievements.length === 0 ? (
                            <p className="text-sm text-base-content/50 text-center py-4">
                                No achievements yet. Start playing to earn some! 🎮
                            </p>
                        ) : (
                            <div className="space-y-2">
                                {achievements.map((achId) => {
                                    const info = ACHIEVEMENT_INFO[achId] || { name: achId, desc: "", icon: "🎖️" };
                                    return (
                                        <div key={achId} className="flex items-center gap-3 bg-base-100 rounded-xl p-3 border border-base-content/5">
                                            <span className="text-2xl">{info.icon}</span>
                                            <div>
                                                <p className="font-bold text-sm">{info.name}</p>
                                                <p className="text-xs text-base-content/50">{info.desc}</p>
                                            </div>
                                            <Star className="w-4 h-4 text-warning ml-auto" />
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {/* Locked achievements */}
                        {Object.entries(ACHIEVEMENT_INFO)
                            .filter(([id]) => !achievements.includes(id))
                            .map(([id, info]) => (
                                <div key={id} className="flex items-center gap-3 bg-base-100/50 rounded-xl p-3 border border-base-content/5 mt-2 opacity-40">
                                    <span className="text-2xl grayscale">{info.icon}</span>
                                    <div>
                                        <p className="font-bold text-sm">{info.name}</p>
                                        <p className="text-xs text-base-content/50">{info.desc}</p>
                                    </div>
                                    <span className="text-xs ml-auto">🔒</span>
                                </div>
                            ))}
                    </div>

                    {/* Friends */}
                    <div className="bg-base-200 rounded-2xl p-6 shadow-sm border border-base-300">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <span className="badge badge-primary badge-lg">{friends.length}</span> Friends
                        </h2>

                        {loadingFriends ? (
                            <div className="flex justify-center py-12">
                                <span className="loading loading-spinner loading-lg text-primary" />
                            </div>
                        ) : friends.length === 0 ? (
                            <div className="h-40 flex items-center justify-center">
                                <NoFriendsFound />
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-3 overflow-y-auto pr-2 custom-scrollbar flex-1">
                                {friends.map((friend) => (
                                    <FriendCard key={friend._id} friend={friend} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};
export default ProfilePage;
