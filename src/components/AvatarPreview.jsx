import { useMemo } from "react";

// Map of itemId to emoji for all avatar items
const ITEM_EMOJIS = {
    face1: "😊", face2: "😎", face3: "😉", face4: "🤩", face5: "👻", face6: "👽",
    hair1: "💇", hair2: "👑", hair3: "🤠", hair4: "🎩", hair5: "⛑️", hair6: "🧙",
    eyes1: "👀", eyes2: "🤓", eyes3: "🕶️", eyes4: "🧐", eyes5: "🤖", eyes6: "🔮",
    outfit1: "👕", outfit2: "🤵", outfit3: "🦸", outfit4: "🥷", outfit5: "🧑‍🚀", outfit6: "🐉",
    frame1: "⬜", frame2: "🟫", frame3: "⬛", frame4: "🟡", frame5: "💎", frame6: "🌈",
    badge1: "⭐", badge2: "🔥", badge3: "⚡", badge4: "🏆", badge5: "💠", badge6: "♾️",
};

const FRAME_COLORS = {
    frame1: "border-base-300",
    frame2: "border-amber-700",
    frame3: "border-gray-500",
    frame4: "border-yellow-400",
    frame5: "border-cyan-400",
    frame6: "border-transparent bg-gradient-to-r from-red-500 via-yellow-500 to-blue-500 bg-clip-border",
};

const FRAME_SHADOWS = {
    frame1: "",
    frame2: "shadow-md",
    frame3: "shadow-lg shadow-gray-500/30",
    frame4: "shadow-lg shadow-yellow-400/40",
    frame5: "shadow-xl shadow-cyan-400/50",
    frame6: "shadow-xl shadow-purple-500/50",
};

const AvatarPreview = ({ avatar, size = "lg", className = "" }) => {
    const av = avatar || {
        face: "face1", hair: "hair1", eyes: "eyes1",
        outfit: "outfit1", frame: "frame1", badge: "badge1",
    };

    const sizeClasses = {
        sm: "w-14 h-14 text-sm",
        md: "w-20 h-20 text-lg",
        lg: "w-32 h-32 text-3xl",
        xl: "w-44 h-44 text-5xl",
    };

    const badgeSizes = {
        sm: "text-xs -top-1 -right-1 w-5 h-5",
        md: "text-sm -top-1 -right-1 w-6 h-6",
        lg: "text-lg -top-2 -right-2 w-8 h-8",
        xl: "text-2xl -top-2 -right-2 w-10 h-10",
    };

    const frameClass = FRAME_COLORS[av.frame] || FRAME_COLORS.frame1;
    const shadowClass = FRAME_SHADOWS[av.frame] || "";

    return (
        <div className={`relative inline-block ${className}`}>
            <div
                className={`
                    ${sizeClasses[size]}
                    rounded-full border-4 ${frameClass} ${shadowClass}
                    bg-base-200 flex items-center justify-center
                    relative overflow-hidden
                `}
            >
                {/* Layered emojis inside the circle */}
                <div className="flex flex-col items-center leading-tight">
                    <span className="leading-none">{ITEM_EMOJIS[av.hair] || "💇"}</span>
                    <span className="leading-none">{ITEM_EMOJIS[av.face] || "😊"}</span>
                    <span className="leading-none" style={{ fontSize: "0.65em" }}>
                        {ITEM_EMOJIS[av.eyes] || "👀"} {ITEM_EMOJIS[av.outfit] || "👕"}
                    </span>
                </div>
            </div>
            {/* Badge floating */}
            <span
                className={`
                    absolute ${badgeSizes[size]}
                    flex items-center justify-center
                    bg-base-100 rounded-full border-2 border-base-300 shadow
                `}
            >
                {ITEM_EMOJIS[av.badge] || "⭐"}
            </span>
        </div>
    );
};

export { ITEM_EMOJIS };
export default AvatarPreview;
