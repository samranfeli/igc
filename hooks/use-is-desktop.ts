import { useEffect, useState } from "react";

export const useIsDesktop = () => {

  type State = "mobile" | "desktop" | "initializing";

  const [state, setState] = useState<State>("initializing");

  useEffect(() => {
    const check = () => setState(window.innerWidth >= 1024 ? "desktop" : "mobile");
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const isDesktop = state === "desktop";
  const initializing = state === "initializing";

  return {initializing, isDesktop};
};