import HomePage from "./pages/HomePage.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import NotificationsPage from "./pages/NotificationsPage.jsx";
import CallPage from "./pages/CallPage.jsx";
import ChatPage from "./pages/ChatPage.jsx";
import OnboardingPage from "./pages/OnboardingPage.jsx";

import { Toaster } from "react-hot-toast";

import PageLoader from "./components/PageLoader.jsx";
import useAuthUser from "./hooks/useAuthUser.js";
import Layout from "./components/Layout.jsx";
import { useThemeStore } from "./store/useThemeStore.js";
import LandingPage from "./pages/LandingPage.jsx";
import FriendsPage from "./pages/FriendsPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import UserProfilePage from "./pages/UserProfilePage.jsx";
import ArcadePage from "./pages/ArcadePage.jsx";
import TicTacToePage from "./pages/TicTacToePage.jsx";
import RockPaperScissorsPage from "./pages/RockPaperScissorsPage.jsx";
import TypingTestPage from "./pages/TypingTestPage.jsx";
import SpinWheelPage from "./pages/SpinWheelPage.jsx";
import LeaderboardPage from "./pages/LeaderboardPage.jsx";
import NumberGuessPage from "./pages/NumberGuessPage.jsx";
import MathBattlePage from "./pages/MathBattlePage.jsx";
import ReactionTestPage from "./pages/ReactionTestPage.jsx";
import MemoryGamePage from "./pages/MemoryGamePage.jsx";
import AvatarWorldPage from "./pages/AvatarWorldPage.jsx";
import { RouterContext, Navigate } from "./lib/simpleRouter";

// simple pattern matcher: '/users/:id' -> { id }
const matchPath = (pattern, path) => {
  const trim = (s) => s.replace(/^\/|\/$/g, "");
  const pParts = trim(pattern).split("/").filter(Boolean);
  const tParts = trim(path).split("/").filter(Boolean);
  if (pParts.length !== tParts.length) {
    if (pattern === "/" && (path === "/" || path === "")) return {};
    return null;
  }
  const params = {};
  for (let i = 0; i < pParts.length; i++) {
    const pp = pParts[i];
    const tp = tParts[i];
    if (pp.startsWith(":")) params[pp.slice(1)] = decodeURIComponent(tp);
    else if (pp !== tp) return null;
  }
  return params;
};

const App = () => {
  const { isLoading, authUser } = useAuthUser();
  const { theme } = useThemeStore();

  const isAuthenticated = Boolean(authUser);
  const isOnboarded = authUser?.isOnboarded;

  const [path, setPath] = useState(typeof window !== "undefined" ? window.location.pathname : "/");
  useEffect(() => {
    const onPop = () => setPath(window.location.pathname);
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  if (isLoading) return <PageLoader />;

  const routes = [
    {
      pattern: "/",
      element: () => (isAuthenticated && isOnboarded ? <Layout showSidebar={true}><HomePage /></Layout> : <LandingPage />),
    },
    {
      pattern: "/profile",
      element: () => (isAuthenticated && isOnboarded ? <Layout showSidebar={true}><ProfilePage /></Layout> : <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />),
    },
    {
      pattern: "/profile/:id",
      element: (params) => (isAuthenticated && isOnboarded ? <Layout showSidebar={true}><UserProfilePage params={params} /></Layout> : <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />),
    },
    {
      pattern: "/friends",
      element: () => (isAuthenticated && isOnboarded ? <Layout showSidebar={true}><FriendsPage /></Layout> : <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />),
    },
    { pattern: "/signup", element: () => (!isAuthenticated ? <SignUpPage /> : <Navigate to={isOnboarded ? "/" : "/onboarding"} />) },
    { pattern: "/login", element: () => (!isAuthenticated ? <LoginPage /> : <Navigate to={isOnboarded ? "/" : "/onboarding"} />) },
    { pattern: "/notifications", element: () => (isAuthenticated && isOnboarded ? <Layout showSidebar={true}><NotificationsPage /></Layout> : <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />) },
    { pattern: "/call/:id", element: (params) => (isAuthenticated && isOnboarded ? <CallPage params={params} /> : <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />) },
    { pattern: "/chat/:id", element: (params) => (isAuthenticated && isOnboarded ? <Layout showSidebar={false}><ChatPage params={params} /></Layout> : <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />) },
    { pattern: "/arcade", element: () => (isAuthenticated && isOnboarded ? <Layout showSidebar={true}><ArcadePage /></Layout> : <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />) },
    { pattern: "/arcade/tictactoe", element: () => (isAuthenticated && isOnboarded ? <Layout showSidebar={true}><TicTacToePage /></Layout> : <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />) },
    { pattern: "/arcade/rps", element: () => (isAuthenticated && isOnboarded ? <Layout showSidebar={true}><RockPaperScissorsPage /></Layout> : <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />) },
    { pattern: "/arcade/typing", element: () => (isAuthenticated && isOnboarded ? <Layout showSidebar={true}><TypingTestPage /></Layout> : <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />) },
    { pattern: "/arcade/spin", element: () => (isAuthenticated && isOnboarded ? <Layout showSidebar={true}><SpinWheelPage /></Layout> : <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />) },
    { pattern: "/arcade/numberguess", element: () => (isAuthenticated && isOnboarded ? <Layout showSidebar={true}><NumberGuessPage /></Layout> : <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />) },
    { pattern: "/arcade/math", element: () => (isAuthenticated && isOnboarded ? <Layout showSidebar={true}><MathBattlePage /></Layout> : <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />) },
    { pattern: "/arcade/reaction", element: () => (isAuthenticated && isOnboarded ? <Layout showSidebar={true}><ReactionTestPage /></Layout> : <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />) },
    { pattern: "/arcade/memory", element: () => (isAuthenticated && isOnboarded ? <Layout showSidebar={true}><MemoryGamePage /></Layout> : <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />) },
    { pattern: "/leaderboard", element: () => (isAuthenticated && isOnboarded ? <Layout showSidebar={true}><LeaderboardPage /></Layout> : <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />) },
    { pattern: "/avatar", element: () => (isAuthenticated && isOnboarded ? <Layout showSidebar={true}><AvatarWorldPage /></Layout> : <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />) },
    { pattern: "/onboarding", element: () => (isAuthenticated ? (!isOnboarded ? <OnboardingPage /> : <Navigate to="/" />) : <Navigate to="/login" />) },
  ];

  let active = null;
  let activeParams = {};
  for (const r of routes) {
    const params = matchPath(r.pattern, path);
    if (params !== null) {
      active = r;
      activeParams = params || {};
      break;
    }
  }

  const content = active ? active.element(activeParams) : <LandingPage />;

  return (
    <div className="h-screen bg-base-100 transition-colors duration-200 overflow-hidden" data-theme={theme}>
      <RouterContext.Provider value={{ path, params: activeParams, pattern: active?.pattern || "/" }}>
        {content}
        <Toaster />
      </RouterContext.Provider>
    </div>
  );
};
export default App;
