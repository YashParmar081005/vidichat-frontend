import { useState, useEffect } from "react";
import { User, Camera } from "lucide-react";
import { DEFAULT_AVATAR } from "../constants";

const Avatar = ({ src, alt = "Avatar", size = "normal", className = "" }) => {
    const [imageSrc, setImageSrc] = useState(src || DEFAULT_AVATAR);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        setLoading(true);
        setError(false);

        if (!src) {
            setImageSrc(DEFAULT_AVATAR);
            setLoading(false);
            return;
        }

        const img = new Image();
        img.src = src;
        img.onload = () => {
            setImageSrc(src);
            setLoading(false);
        };
        img.onerror = () => {
            setImageSrc(DEFAULT_AVATAR);
            setError(true);
            setLoading(false);
        };
    }, [src]);

    // Size mapping
    const sizeClasses = {
        tiny: "size-8",     // 32px
        small: "size-10",   // 40px
        normal: "size-12",  // 48px
        large: "size-16",   // 64px
        xl: "size-32",      // 128px
    };

    const currentSize = sizeClasses[size] || "size-10";

    return (
        <div className={`relative ${currentSize} rounded-full overflow-hidden bg-base-300 ring-2 ring-base-200 ${className}`}>
            {/* SKELETON LOADER */}
            {loading && (
                <div className="absolute inset-0 bg-base-300 animate-pulse flex items-center justify-center">
                    <User className="w-1/2 h-1/2 text-base-content/20" />
                </div>
            )}

            {/* IMAGE */}
            <img
                src={imageSrc}
                alt={alt}
                className={`
                w-full h-full object-cover transition-opacity duration-300 
                ${loading ? "opacity-0" : "opacity-100"}
            `}
                loading="lazy"
            />
        </div>
    );
};

export default Avatar;
