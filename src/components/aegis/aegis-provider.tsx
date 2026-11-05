import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { seedData, STORAGE_KEY, type AegisData } from "@/lib/aegis-data";

type AegisContextValue = {
  data: AegisData;
  ready: boolean;
  synced: boolean;
  updateData: (update: (current: AegisData) => AegisData) => void;
};

const AegisContext = createContext<AegisContextValue | null>(null);

export function AegisProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState(seedData);
  const [ready, setReady] = useState(false);
  const [synced, setSynced] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) setData({ ...seedData, ...JSON.parse(saved) as Partial<AegisData> });
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data, ready]);

  useEffect(() => {
    if (!synced) return;
    const timer = window.setTimeout(() => setSynced(false), 1800);
    return () => window.clearTimeout(timer);
  }, [synced]);

  const updateData = useCallback((update: (current: AegisData) => AegisData) => {
    setData((current) => update(current));
    setSynced(true);
  }, []);

  const value = useMemo(() => ({ data, ready, synced, updateData }), [data, ready, synced, updateData]);
  return <AegisContext.Provider value={value}>{children}</AegisContext.Provider>;
}

export function useAegis() {
  const value = useContext(AegisContext);
  if (!value) throw new Error("useAegis must be used inside AegisProvider");
  return value;
}