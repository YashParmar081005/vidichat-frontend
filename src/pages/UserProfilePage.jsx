import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { getUserProfile, getUserFriendsById } from "../lib/api";
import { Mail, MapPin, Calendar, Languages } from "lucide-react";
import FriendCard from "../components/FriendCard";
import NoFriendsFound from "../components/NoFriendsFound";

const UserProfilePage = () => {
    const { id } = useParams();

    const { data: user, isLoading: loadingUser } = useQuery({
        queryKey: ["userProfile", id],
        queryFn: () => getUserProfile(id),
    });

    const { data: friends = [], isLoading: loadingFriends } = useQuery({
        queryKey: ["userFriends", id],
        queryFn: () => getUserFriendsById(id),
    });

    if (loadingUser) {
        return (
            <div className="h-screen flex items-center justify-center">
                <span className="loading loading-spinner loading-lg text-primary" />
            </div>
        );
    }

    if (!user) {
        return (
            <div className="h-screen flex items-center justify-center">
                <p className="text-xl">User not found</p>
            </div>
        );
    }

    return (
        <div className="pt-6 pb-20 px-4 w-full">
            <div className="max-w-5xl mx-auto flex flex-col lg:flex-row gap-8">

                {/* Left Side - Profile Info */}
                <div className="flex-1 space-y-6">
                    <div className="bg-base-200 rounded-2xl p-8 shadow-sm border border-base-300">
                        <div className="text-center mb-6">
                            <div className="avatar mb-4">
                                <div className="w-32 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                                    <img src={user.profilePic || "/avatar.png"} alt="Profile" className="object-cover" />
                                </div>
                            </div>
                            <h1 className="text-3xl font-bold">{user.fullName}</h1>
                            {user.bio && <p className="mt-2 text-base-content/70 italic text-lg">"{user.bio}"</p>}
                        </div>

                        <div className="divider"></div>

                        <div className="space-y-4">
                            {user.location && (
                                <div className="flex items-center gap-3 p-3 bg-base-100 rounded-lg border border-base-content/5">
                                    <MapPin className="w-5 h-5 text-primary" />
                                    <span>{user.location}</span>
                                </div>
                            )}

                            <div className="flex items-center gap-3 p-3 bg-base-100 rounded-lg border border-base-content/5">
                                <Mail className="w-5 h-5 text-primary" />
                                <span>{user.email}</span>
                            </div>

                            <div className="flex items-center gap-3 p-3 bg-base-100 rounded-lg border border-base-content/5">
                                <Calendar className="w-5 h-5 text-primary" />
                                <span>Joined {user.createdAt?.split("T")[0]}</span>
                            </div>

                            {(user.nativeLanguage || user.learningLanguage) && (
                                <div className="flex flex-col gap-2 mt-4 p-3 bg-base-100 rounded-lg border border-base-content/5">
                                    <div className="flex items-center gap-2 text-primary font-medium mb-1">
                                        <Languages className="w-5 h-5" /> Languages
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {user.nativeLanguage && (
                                            <div className="badge badge-secondary badge-lg">
                                                Native: {user.nativeLanguage}
                                            </div>
                                        )}
                                        {user.learningLanguage && (
                                            <div className="badge badge-primary badge-lg">
                                                Learning: {user.learningLanguage}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Side - Friends Section */}
                <div className="lg:w-96 space-y-6">
                    <div className="bg-base-200 rounded-2xl p-6 shadow-sm border border-base-300 h-full">
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
export default UserProfilePage;
