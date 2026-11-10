import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { defaultConfig, mergeConfig, STORAGE_KEY, type PropConfig } from "@/lib/prop-store";

type Ctx = { config: PropConfig; ready: boolean; update: (fn: (c: PropConfig) => PropConfig) => void; reset: () => void };
const StoreContext = createContext<Ctx | null>(null);

export function PropStoreProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<PropConfig>(defaultConfig);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setConfig(mergeConfig(JSON.parse(saved) as Partial<PropConfig>));
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    } catch {
      /* storage full (large favicon) */
    }
    document.title = config.appName;
    const root = document.documentElement;
    root.style.setProperty("--primary", config.look.accent);
    root.style.setProperty("--term-text", config.look.terminalText);
    root.dataset["effects"] = config.look.effects ? "on" : "off";
    let link = document.querySelector<HTMLLinkElement>("link[rel='icon']");
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.head.appendChild(link);
    }
    link.removeAttribute("type");
    link.href = config.favicon ?? "/favicon.png";
  }, [config, ready]);

  const update = useCallback((fn: (c: PropConfig) => PropConfig) => setConfig((c) => fn(c)), []);
  const reset = useCallback(() => setConfig(defaultConfig), []);

  return <StoreContext.Provider value={{ config, ready, update, reset }}>{children}</StoreContext.Provider>;
}

export function usePropStore() {
  const v = useContext(StoreContext);
  if (!v) throw new Error("usePropStore outside provider");
  return v;
}
