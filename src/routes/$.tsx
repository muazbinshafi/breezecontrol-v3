import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

// Catch-all route: renders the same App which uses BrowserRouter internally
// to handle all client-side routing word-for-word from the original project.
export const Route = createFileRoute("/$")({
  component: AppHost,
  ssr: false,
});

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
