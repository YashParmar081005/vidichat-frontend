import { Video } from "lucide-react";
import { Link } from "react-router";

const Logo = ({ className = "", size = "normal", showText = true }) => {
    const isSmall = size === "small";

    return (
        <Link
            to="/"
            className={`flex items-center gap-2.5 transition-opacity hover:opacity-80 ${className}`}
        >
            <div className={`flex items-center justify-center rounded-xl bg-primary/10 ${isSmall ? "p-1.5" : "p-2"}`}>
                <Video className={`text-primary ${isSmall ? "h-5 w-5" : "h-8 w-8"}`} />
            </div>
            {showText && (
                <span className={`bg-gradient-to-r from-primary to-secondary bg-clip-text font-mono font-bold tracking-wider text-transparent ${isSmall ? "text-lg" : "text-2xl"}`}>
                    VidiChat
                </span>
            )}
        </Link>
    );
};

export default Logo;
