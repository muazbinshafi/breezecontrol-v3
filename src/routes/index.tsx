import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

// TanStack Router is pinned to "/" via memory history (see src/router.tsx).
// All actual URL routing is delegated to react-router-dom's BrowserRouter
// inside <App />. This component is just a client-only mount point.
export const Route = createFileRoute("/")({
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
