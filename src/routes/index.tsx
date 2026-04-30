import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/")({
  component: AppHost,
  ssr: false,
});

export const Route_ = Route; // type helper

function AppHost() {
  const [App, setApp] = useState<React.ComponentType | null>(null);

  useEffect(() => {
    let cancelled = false;
    import("@/App").then((mod) => {
      if (!cancelled) setApp(() => mod.default);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!App) return null;
  return <App />;
}
