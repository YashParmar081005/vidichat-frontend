import { useEffect } from "react";
import { Award } from "lucide-react";

const ACHIEVEMENT_NAMES = {
    first_win: "🏆 First Win!",
    "10_wins": "🔥 10 Wins!",
    "50_games": "🎮 50 Games Played!",
    "100_points": "⭐ 100 Points!",
    "500_points": "💎 500 Points!",
};

const AchievementPopup = ({ achievements = [], onClose }) => {
    useEffect(() => {
        if (achievements.length > 0) {
            const timer = setTimeout(() => {
                onClose();
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [achievements, onClose]);

    if (achievements.length === 0) return null;

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 animate-slide-up">
            {achievements.map((ach) => (
                <div
                    key={ach}
                    className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/30 shadow-2xl backdrop-blur-md"
                >
                    <Award className="w-6 h-6 text-primary shrink-0" />
                    <div>
                        <p className="text-xs text-base-content/50 uppercase tracking-wider">Achievement Unlocked!</p>
                        <p className="font-bold">{ACHIEVEMENT_NAMES[ach] || ach}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default AchievementPopup;
