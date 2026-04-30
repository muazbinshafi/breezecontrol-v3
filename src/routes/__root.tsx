import { Outlet, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";

import appCss from "../styles.css?url";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      {
        name: "viewport",
        content:
          "width=device-width, initial-scale=1.0, viewport-fit=cover, maximum-scale=1",
      },
      { name: "mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-status-bar-style", content: "black-translucent" },
      { name: "apple-mobile-web-app-title", content: "BreezeControl" },
      { name: "theme-color", content: "#fff7ed" },
      { name: "color-scheme", content: "light dark" },
      { name: "format-detection", content: "telephone=no" },
      {
        title: "BreezeControl — Touch-free gesture control for the web",
      },
      {
        name: "description",
        content:
          "Control any website with a wave of your hand. Pinch, point and gesture in front of your camera — no install required.",
      },
      { property: "og:type", content: "website" },
      {
        property: "og:title",
        content: "BreezeControl — Touch-free gesture control for the web",
      },
      {
        property: "og:description",
        content:
          "Control any website with a wave of your hand. Pinch, point and gesture in front of your camera — no install required.",
      },
      { name: "twitter:card", content: "summary_large_image" },
      {
        name: "twitter:title",
        content: "BreezeControl — Touch-free gesture control for the web",
      },
      {
        name: "twitter:description",
        content:
          "Control any website with a wave of your hand. Pinch, point and gesture in front of your camera — no install required.",
      },
      { title: "Lovable App" },
      { property: "og:title", content: "Lovable App" },
      { name: "twitter:title", content: "Lovable App" },
      { name: "description", content: "Live Word Deploy: Installs dependencies and deploys content word by word in real-time." },
      { property: "og:description", content: "Live Word Deploy: Installs dependencies and deploys content word by word in real-time." },
      { name: "twitter:description", content: "Live Word Deploy: Installs dependencies and deploys content word by word in real-time." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/036558f9-d137-4987-9412-cb4ed8836ad2/id-preview-5ade9692--c485883a-4871-4fc3-bb12-8cb95aa9ed9b.lovable.app-1777532530438.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/036558f9-d137-4987-9412-cb4ed8836ad2/id-preview-5ade9692--c485883a-4871-4fc3-bb12-8cb95aa9ed9b.lovable.app-1777532530438.png" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
      { rel: "icon", type: "image/png", sizes: "32x32", href: "/favicon-32.png" },
      { rel: "apple-touch-icon", sizes: "180x180", href: "/apple-touch-icon.png" },
      { rel: "manifest", href: "/manifest.webmanifest" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return <Outlet />;
}
