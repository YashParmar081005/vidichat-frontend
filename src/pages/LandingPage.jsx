import { useState } from "react";
import { Link } from "react-router-dom";
import { useThemeStore } from "../store/useThemeStore";
import { MessageSquare, Video, Zap, Shield, Users, Palette, Gamepad2, Trophy, UserCircle, Globe, ArrowRight } from "lucide-react";
import Logo from "../components/Logo";

const LandingPage = () => {
    const { theme, setTheme } = useThemeStore();
    const [scrolled, setScrolled] = useState(false);

    const handleScroll = (e) => {
        const offset = e.target.scrollTop;
        if (offset > 50) {
            setScrolled(true);
        } else {
            setScrolled(false);
        }
    };

    const themes = [
        "light", "dark", "cupcake", "bumblebee", "emerald", "corporate", "synthwave", "retro", "cyberpunk", "valentine", "halloween", "garden", "forest", "aqua", "lofi", "pastel", "fantasy", "wireframe", "black", "luxury", "dracula", "cmyk", "autumn", "business", "acid", "lemonade", "night", "coffee", "winter", "dim", "nord", "sunset",
    ];

    return (
        <div
            onScroll={handleScroll}
            className="h-full overflow-y-auto bg-base-100 transition-colors duration-200"
        >
            {/* Navbar */}
            <nav className={`navbar px-4 lg:px-12 sticky top-0 z-50 transition-all duration-300 ${scrolled ? "bg-base-100/80 backdrop-blur-md shadow-sm border-b border-base-content/10" : "bg-transparent border-transparent"}`}>
                <div className="flex-1">
                    <Logo />
                </div>
                <div className="flex-none gap-4">
                    <Link to="/login" className="btn btn-ghost hover:bg-primary/10 transition-colors">Login</Link>
                    <Link to="/signup" className="btn btn-primary shadow-lg hover:shadow-primary/50 transition-all">Sign Up</Link>
                </div>
            </nav>

            {/* Hero Section */}
            <header className="hero min-h-[85vh] bg-base-200 relative overflow-hidden">
                {/* Animated Background Blobs */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-0 -left-4 w-72 h-72 bg-primary/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
                    <div className="absolute top-0 -right-4 w-72 h-72 bg-secondary/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
                    <div className="absolute -bottom-8 left-20 w-72 h-72 bg-accent/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
                </div>

                <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none" />

                <div className="hero-content text-center relative z-10 max-w-4xl">
                    <div className="max-w-2xl">
                        <div className="inline-block p-2 px-4 rounded-full bg-base-100 border border-base-content/10 mb-6 animate-bounce shadow-sm">
                            <span className="text-primary font-bold">New:</span> Arcade Games & Avatar World
                        </div>
                        <h1 className="hero-title text-5xl lg:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-accent leading-tight mb-6 drop-shadow-sm">
                            Connect via Video <br /> & Chat Instantly 
                        </h1>
                        <p className="hero-subtitle py-6 text-xl text-base-content/80 max-w-lg mx-auto leading-relaxed">
                            Video calls, real-time chat, arcade games, and unlockable avatars — all in one place.
                            Practice languages, earn points, and climb the leaderboard.
                        </p>
                        <div className="flex justify-center gap-4 mt-4">
                            <Link to="/signup" className="hero-btn btn btn-primary btn-lg shadow-xl hover:shadow-primary/50 hover:scale-105 transition-all duration-300">
                                Get Started <Zap className="w-5 h-5" />
                            </Link>
                            <a href="#features" className="hero-btn btn btn-outline btn-lg hover:bg-base-content hover:text-base-100 transition-all duration-300">
                                See Features
                            </a>
                        </div>
                    </div>
                </div>

                {/* Floating Icons Background Animation */}
                <div className="absolute top-20 left-10 animate-float opacity-20 pointer-events-none hidden lg:block">
                    <MessageSquare className="w-24 h-24 text-primary rotate-12" />
                </div>
                <div className="absolute bottom-32 right-10 animate-float animation-delay-2000 opacity-20 pointer-events-none hidden lg:block">
                    <Video className="w-32 h-32 text-secondary -rotate-12" />
                </div>
                <div className="absolute top-40 right-20 animate-float animation-delay-4000 opacity-10 pointer-events-none hidden lg:block">
                    <Users className="w-16 h-16 text-accent rotate-45" />
                </div>
            </header>

            {/* Features Section */}
            <section id="features" className="features-section py-24 px-4 bg-base-100">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold mb-4">Everything You Need</h2>
                        <p className="text-base-content/60 text-lg">More than just video calls — it's a full social experience.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            { icon: Video, title: "HD Video Calls", desc: "Crystal-clear 1-on-1 video calls with low latency. Connect with friends across the world in real time.", color: "text-blue-500", bg: "bg-blue-500/10" },
                            { icon: MessageSquare, title: "Real-Time Chat", desc: "Send messages instantly while on a call or anytime. Stay connected with your friends beyond video.", color: "text-green-500", bg: "bg-green-500/10" },
                            { icon: Gamepad2, title: "Arcade Games", desc: "Play Tic Tac Toe, Rock Paper Scissors, Typing Racer, Number Guess, Memory Match, and more. Earn points with every game!", color: "text-purple-500", bg: "bg-purple-500/10" },
                            { icon: UserCircle, title: "Avatar World", desc: "Unlock and equip unique avatars using the points you earn. 15 collectible characters to choose from.", color: "text-pink-500", bg: "bg-pink-500/10" },
                            { icon: Trophy, title: "Leaderboard", desc: "Compete with other players for the top spot. Track your wins, points, and overall ranking.", color: "text-yellow-500", bg: "bg-yellow-500/10" },
                            { icon: Globe, title: "Language Practice", desc: "Set your native and learning languages to match with partners who can help you practice conversationally.", color: "text-teal-500", bg: "bg-teal-500/10" },
                        ].map((feature, idx) => (
                            <div key={idx} className="feature-card card bg-base-200/50 backdrop-blur-sm border border-base-content/5 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                                <div className="card-body">
                                    <div className={`p-3 rounded-xl w-fit mb-3 ${feature.bg} group-hover:scale-110 transition-transform duration-300`}>
                                        <feature.icon className={`w-6 h-6 ${feature.color}`} />
                                    </div>
                                    <h3 className="card-title text-lg">{feature.title}</h3>
                                    <p className="text-base-content/60 text-sm leading-relaxed">{feature.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-24 px-4 bg-base-200">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold mb-4">How It Works</h2>
                        <p className="text-base-content/60 text-lg">Get started in three simple steps.</p>
                    </div>

                    <div className="flex flex-col md:flex-row items-center gap-6 md:gap-4">
                        {[
                            { step: "1", title: "Sign Up", desc: "Create your account and set your language preferences in seconds." },
                            { step: "2", title: "Find Friends", desc: "Browse users, send friend requests, and build your connections." },
                            { step: "3", title: "Start Chatting", desc: "Video call, play games together, and earn points to unlock avatars." },
                        ].map((item, idx) => (
                            <div key={idx} className="flex-1 flex flex-col items-center text-center">
                                <div className="w-14 h-14 rounded-full bg-primary text-primary-content flex items-center justify-center text-2xl font-extrabold mb-4 shadow-lg shadow-primary/30">
                                    {item.step}
                                </div>
                                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                                <p className="text-base-content/60 text-sm max-w-xs">{item.desc}</p>
                                {idx < 2 && (
                                    <ArrowRight className="w-6 h-6 text-base-content/20 mt-4 rotate-90 md:rotate-0 hidden md:block" />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-4 bg-base-100">
                <div className="max-w-3xl mx-auto text-center">
                    <h2 className="text-3xl lg:text-4xl font-bold mb-4">Ready to Jump In?</h2>
                    <p className="text-base-content/60 text-lg mb-8">
                        Join VidiChat today — connect with friends, play games, earn points, and make your profile uniquely yours.
                    </p>
                    <Link to="/signup" className="btn btn-primary btn-lg shadow-xl hover:shadow-primary/50 hover:scale-105 transition-all duration-300">
                        Create Free Account <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>
            </section>

            {/* Theme Showcase Section */}
            <section id="themes" className="theme-section py-24 px-4 bg-base-200 relative">
                <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none" />

                <div className="max-w-6xl mx-auto relative z-10">
                    <div className="text-center mb-16">
                        <div className="inline-block p-2 px-4 rounded-full bg-primary/10 text-primary font-medium mb-4">
                            30+ Themes Available
                        </div>
                        <h2 className="text-4xl font-bold mb-4">Customize Your Vibe</h2>
                        <p className="text-base-content/60 text-lg">Click on any theme to preview it instantly.</p>
                    </div>

                    <div className="theme-grid grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {themes.map((t) => (
                            <button
                                key={t}
                                className={`
                                    group flex flex-col gap-2 p-2 rounded-xl transition-all duration-300
                                    ${theme === t ? "bg-primary/10 ring-2 ring-primary scale-105 shadow-lg" : "hover:bg-base-100 hover:scale-105 hover:shadow-md"}
                                `}
                                onClick={() => setTheme(t)}
                            >
                                <div className="w-full h-24 rounded-lg overflow-hidden border border-base-content/10 relative shadow-sm group-hover:shadow-md transition-all" data-theme={t}>
                                    <div className="absolute inset-0 grid grid-cols-4 grid-rows-3 gap-0.5 p-1 bg-base-100">
                                        <div className="col-span-4 bg-base-200" />
                                        <div className="col-span-1 row-span-2 bg-base-300" />
                                        <div className="col-span-3 bg-base-100 p-1">
                                            <div className="w-full h-2 bg-primary rounded-full opacity-80" />
                                        </div>
                                        <div className="col-span-3 bg-base-100 p-1">
                                            <div className="w-1/2 h-2 bg-secondary rounded-full opacity-80" />
                                        </div>
                                    </div>
                                </div>
                                <span className="text-sm font-medium capitalize text-center w-full truncate opacity-80 group-hover:opacity-100">
                                    {t}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer footer-center p-10 bg-base-300 text-base-content">
                <aside>
                    <Video className="w-10 h-10 text-primary mb-2" />
                    <p className="font-bold text-lg">
                        VidiChat Inc. <br />
                        <span className="font-normal text-sm opacity-70">Connecting the world, one view at a time.</span>
                    </p>
                    <p>Copyright © {new Date().getFullYear()} - All right reserved</p>
                </aside>
            </footer>
        </div>
    );
};

export default LandingPage;
