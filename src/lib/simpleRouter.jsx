import React, { createContext, useContext, useEffect, useState } from "react";

export const RouterContext = createContext({ path: "/", params: {}, pattern: "/" });

export function navigate(to) {
  if (typeof window === "undefined") return;
  if (to === window.location.pathname) return;
  history.pushState({}, "", to);
  window.dispatchEvent(new PopStateEvent("popstate"));
}

export function Link({ to, children, onClick, ...props }) {
  const handle = (e) => {
    if (onClick) onClick(e);
    if (!e.defaultPrevented) {
      e.preventDefault();
      navigate(to);
    }
  };
  return (
    <a href={to} onClick={handle} {...props}>
      {children}
    </a>
  );
}

export function useNavigate() {
  return navigate;
}

export function useLocation() {
  const [path, setPath] = useState(() => (typeof window !== "undefined" ? window.location.pathname : "/"));
  useEffect(() => {
    const onPop = () => setPath(window.location.pathname);
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);
  return { pathname: path };
}

export function useParams() {
  const ctx = useContext(RouterContext);
  return ctx?.params || {};
}

export function Navigate({ to }) {
  useEffect(() => {
    navigate(to);
  }, [to]);
  return null;
}

export default {
  RouterContext,
  navigate,
  Link,
  useNavigate,
  useLocation,
  useParams,
  Navigate,
};
