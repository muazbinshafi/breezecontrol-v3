import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import jsPDF from "jspdf";
import {
  Hand,
  Download,
  BookOpen,
  Sparkles,
  Settings2,
  Server,
  Hammer,
  PlayCircle,
  ShieldCheck,
  ListTree,
  ArrowLeft,
} from "lucide-react";

type Section = {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  blocks: Array<
    | { type: "p"; text: string }
    | { type: "h3"; text: string }
    | { type: "ul"; items: string[] }
    | { type: "ol"; items: string[] }
    | { type: "code"; text: string }
  >;
};

const SECTIONS: Section[] = [
  {
    id: "introduction",
    title: "1. Introduction",
    icon: BookOpen,
    blocks: [
      {
        type: "p",
        text: "BreezeControl is a touchless, hand-gesture control system that turns your webcam into a real input device for the web, desktop, and mobile. It uses Google MediaPipe Hand Landmarker (running on-device via WebAssembly + WebGL) to track 21 landmarks per hand at up to 60 FPS, then maps those landmarks into smooth cursor motion, clicks, scrolls, drawing strokes, and customizable shortcuts.",
      },
      {
        type: "p",
        text: "The project is privacy-first: video frames never leave your device. All inference happens locally in the browser. An optional native bridge (Python + HID) lets the same gestures drive your real OS cursor on Windows, macOS, and Linux.",
      },
      {
        type: "h3",
        text: "Who is this for?",
      },
      {
        type: "ul",
        items: [
          "Accessibility users who cannot use a traditional mouse/keyboard.",
          "Presenters who want to control slides from across the room.",
          "Designers and educators wanting to draw or annotate in mid-air.",
          "Developers exploring computer-vision UX and HID prototypes.",
        ],
      },
    ],
  },
  {
    id: "features",
    title: "2. Features",
    icon: Sparkles,
    blocks: [
      {
        type: "ul",
        items: [
          "60 FPS on-device hand tracking (MediaPipe Tasks Vision, WebGL accelerated).",
          "Dual-hand detection with role locking (pointer hand vs. modifier hand).",
          "Pinch-to-click, pinch-and-hold for drag, two-finger scroll, open-palm release.",
          "Paint Mode: pinch-to-draw with color/size toolbar and PDF/PNG export.",
          "Customizable Gesture Profiles stored locally and synced to the cloud when signed in.",
          "Live calibration wizard with one-Euro filter smoothing for jitter-free motion.",
          "Telemetry & Performance HUD: FPS, latency, confidence, and quality badge.",
          "Cross-platform OS Bridge (Python + HID) for real cursor control on Windows / macOS / Linux.",
          "Installable PWA — works offline, installs to phone or desktop home screen.",
          "Theme system (Sunrise Breeze, dark mode, accent colors).",
          "Authentication, account page, and per-user cloud profile sync.",
        ],
      },
    ],
  },
  {
    id: "installation",
    title: "3. Installation",
    icon: Hammer,
    blocks: [
      {
        type: "h3",
        text: "Option A — Use the hosted web app (zero install)",
      },
      {
        type: "ol",
        items: [
          "Open the app in Chrome, Edge, or any Chromium-based browser.",
          "Click START CAMERA on the /demo page and grant webcam permission.",
          "Optionally click the install icon in the address bar to install as a PWA.",
        ],
      },
      {
        type: "h3",
        text: "Option B — Run locally for development",
      },
      { type: "code", text: "git clone <your-repo-url>\ncd breezecontrol\nbun install\nbun run dev" },
      {
        type: "p",
        text: "The dev server starts on http://localhost:5173 (or the port shown in the terminal).",
      },
      {
        type: "h3",
        text: "Option C — Install the OS Bridge (real cursor control)",
      },
      {
        type: "ol",
        items: [
          "Visit /bridge in the app and pick your operating system.",
          "Download omnipoint_bridge.py and requirements.txt from /public/bridge-assets.",
          "Run: python -m pip install -r requirements.txt",
          "Run: python omnipoint_bridge.py",
          "Return to /demo — the Bridge Status Banner should turn green (CONNECTED).",
        ],
      },
    ],
  },
  {
    id: "usage",
    title: "4. How to Use",
    icon: PlayCircle,
    blocks: [
      {
        type: "h3",
        text: "Quick start (60 seconds)",
      },
      {
        type: "ol",
        items: [
          "Open /demo and click START CAMERA.",
          "Hold one hand 30–60 cm from the camera with your palm facing the lens.",
          "Move your index finger — the on-screen cursor follows it.",
          "Pinch thumb + index together to click. Hold the pinch to drag.",
          "Open palm and pull away to release the cursor.",
          "Click the gear icon (top toolbar) to open Gesture Customization.",
        ],
      },
      {
        type: "h3",
        text: "Gesture reference",
      },
      {
        type: "ul",
        items: [
          "Index point → cursor move",
          "Pinch (thumb + index) → click / drag start",
          "Pinch + drag → drawing stroke (in Paint Mode)",
          "Two-finger swipe → scroll",
          "Open palm → release / cancel",
          "Fist → toggle pause",
        ],
      },
      {
        type: "h3",
        text: "Dual-hand mode",
      },
      {
        type: "p",
        text: "BreezeControl detects up to two hands simultaneously. By default the first detected hand becomes the POINTER (controls the cursor) and the second becomes the MODIFIER (holds shift/ctrl-style augmentations). Use the Hand Role Lock toggle in the toolbar to pin a specific hand to a specific role.",
      },
    ],
  },
  {
    id: "customization",
    title: "5. Gesture Customization",
    icon: Settings2,
    blocks: [
      {
        type: "p",
        text: "Open /demo, start the camera, and click the gear icon to launch the Gesture Settings Panel. From there you can:",
      },
      {
        type: "ul",
        items: [
          "Adjust pinch sensitivity (distance threshold) and confidence floor.",
          "Tune the One-Euro filter (min cutoff and beta) to balance smoothness vs. lag.",
          "Re-bind gestures to actions: click, right-click, scroll, paint, custom shortcut.",
          "Save named profiles (e.g. 'Presentation', 'Drawing', 'Accessibility').",
          "Export / import profile JSON to share with other devices.",
          "Sync profiles to the cloud when signed in via the Account page.",
        ],
      },
    ],
  },
  {
    id: "architecture",
    title: "6. Architecture",
    icon: ListTree,
    blocks: [
      {
        type: "ul",
        items: [
          "Frontend: React 19 + TanStack Start + Vite 7 + Tailwind v4.",
          "Vision: @mediapipe/tasks-vision (WASM + WebGL) running entirely in the browser.",
          "State: lightweight stores under src/lib/omnipoint (GestureEngine, BrowserCursor, PaintStore, TelemetryStore).",
          "Smoothing: One-Euro filter for cursor jitter reduction.",
          "Bridge: Local Python WebSocket server that converts gesture events into HID mouse/keyboard commands.",
          "Backend: Lovable Cloud (Postgres + Auth + Storage) for user accounts and profile sync.",
          "PWA: service worker + manifest for offline use and install.",
        ],
      },
    ],
  },
  {
    id: "privacy",
    title: "7. Privacy & Security",
    icon: ShieldCheck,
    blocks: [
      {
        type: "ul",
        items: [
          "Webcam frames are processed 100% on-device. No video is uploaded.",
          "Only your saved profile metadata (names, sliders, bindings) is synced to the cloud.",
          "Authentication uses email/password with secure session tokens.",
          "Row-Level Security ensures each user can only read/write their own profiles.",
          "The OS Bridge listens only on localhost and requires explicit launch.",
        ],
      },
    ],
  },
  {
    id: "bridge",
    title: "8. OS Bridge",
    icon: Server,
    blocks: [
      {
        type: "p",
        text: "The OS Bridge is an optional companion script that lets BreezeControl move your real OS cursor, click, scroll, and send keystrokes — not just the in-browser cursor.",
      },
      {
        type: "ol",
        items: [
          "Install Python 3.10+ and pip.",
          "Download omnipoint_bridge.py and requirements.txt from /bridge.",
          "pip install -r requirements.txt",
          "python omnipoint_bridge.py — leave it running in a terminal.",
          "Open /demo. The Bridge Status Banner should show CONNECTED.",
          "Move your hand — your real cursor now follows it.",
        ],
      },
      {
        type: "p",
        text: "On macOS, grant Accessibility permission to your terminal. On Linux/Wayland, X11 fallback may be required.",
      },
    ],
  },
  {
    id: "troubleshooting",
    title: "9. Troubleshooting",
    icon: ShieldCheck,
    blocks: [
      {
        type: "ul",
        items: [
          "Camera black screen → check OS camera permission and that no other app holds the device.",
          "Cursor jittery → raise One-Euro min cutoff or lower beta in Gesture Settings.",
          "Pinch not registering → recalibrate via the Calibration Wizard; ensure good lighting.",
          "Bridge says DISCONNECTED → confirm the Python script is running and firewall allows localhost.",
          "Both hands detected but only one works → toggle Hand Role Lock in the toolbar.",
          "Low FPS → close heavy tabs; the engine adapts model complexity automatically.",
        ],
      },
    ],
  },
  {
    id: "credits",
    title: "10. Credits & License",
    icon: BookOpen,
    blocks: [
      {
        type: "p",
        text: "Built with React, TanStack Start, MediaPipe Tasks Vision, Tailwind CSS, and Lovable Cloud. Released under the MIT License — free for personal and commercial use with attribution.",
      },
    ],
  },
];

const Docs = () => {
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    document.title = "Documentation — BreezeControl";
  }, []);

  const plainText = useMemo(() => {
    return SECTIONS.map((s) => {
      const lines: string[] = [s.title, ""];
      for (const b of s.blocks) {
        if (b.type === "p") lines.push(b.text, "");
        else if (b.type === "h3") lines.push(b.text, "");
        else if (b.type === "ul") {
          for (const i of b.items) lines.push("• " + i);
          lines.push("");
        } else if (b.type === "ol") {
          b.items.forEach((i, idx) => lines.push(`${idx + 1}. ${i}`));
          lines.push("");
        } else if (b.type === "code") {
          lines.push(b.text, "");
        }
      }
      return lines.join("\n");
    }).join("\n");
  }, []);

  const handleDownload = async () => {
    try {
      setDownloading(true);
      const doc = new jsPDF({ unit: "pt", format: "a4" });
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 48;
      const maxWidth = pageWidth - margin * 2;
      let y = margin;

      const ensureSpace = (needed: number) => {
        if (y + needed > pageHeight - margin) {
          doc.addPage();
          y = margin;
        }
      };

      const writeWrapped = (text: string, fontSize: number, lineGap = 4, indent = 0) => {
        doc.setFontSize(fontSize);
        const lines = doc.splitTextToSize(text, maxWidth - indent);
        for (const line of lines) {
          ensureSpace(fontSize + lineGap);
          doc.text(line, margin + indent, y);
          y += fontSize + lineGap;
        }
      };

      // Cover
      doc.setFont("helvetica", "bold");
      doc.setFontSize(28);
      doc.text("BreezeControl", margin, y + 20);
      y += 50;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(14);
      doc.text("Complete Documentation", margin, y);
      y += 24;
      doc.setFontSize(10);
      doc.setTextColor(120);
      doc.text(
        "Touchless gesture control for web, desktop & mobile.",
        margin,
        y,
      );
      y += 30;
      doc.setTextColor(0);

      // TOC
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      ensureSpace(24);
      doc.text("Table of Contents", margin, y);
      y += 18;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      for (const s of SECTIONS) {
        ensureSpace(16);
        doc.text(s.title, margin + 12, y);
        y += 14;
      }
      y += 10;

      // Sections
      for (const s of SECTIONS) {
        doc.addPage();
        y = margin;
        doc.setFont("helvetica", "bold");
        doc.setFontSize(18);
        ensureSpace(24);
        doc.text(s.title, margin, y);
        y += 24;

        for (const b of s.blocks) {
          if (b.type === "p") {
            doc.setFont("helvetica", "normal");
            writeWrapped(b.text, 11, 4);
            y += 6;
          } else if (b.type === "h3") {
            doc.setFont("helvetica", "bold");
            writeWrapped(b.text, 13, 4);
            y += 4;
          } else if (b.type === "ul") {
            doc.setFont("helvetica", "normal");
            for (const item of b.items) {
              writeWrapped("• " + item, 11, 4, 8);
            }
            y += 6;
          } else if (b.type === "ol") {
            doc.setFont("helvetica", "normal");
            b.items.forEach((item, i) => {
              writeWrapped(`${i + 1}. ${item}`, 11, 4, 8);
            });
            y += 6;
          } else if (b.type === "code") {
            doc.setFont("courier", "normal");
            writeWrapped(b.text, 10, 3, 8);
            doc.setFont("helvetica", "normal");
            y += 6;
          }
        }
      }

      // Footer page numbers
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(150);
        doc.text(
          `BreezeControl Documentation — Page ${i} / ${pageCount}`,
          pageWidth / 2,
          pageHeight - 20,
          { align: "center" },
        );
      }

      doc.save("BreezeControl-Documentation.pdf");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl flex items-center justify-between px-6 h-16">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="relative w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center shadow-md">
              <Hand className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
            <span className="font-display text-[15px]">BreezeControl</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-foreground">Home</Link>
            <Link to="/guide" className="hover:text-foreground">Guide</Link>
            <Link to="/demo" className="hover:text-foreground">Demo</Link>
            <Link to="/docs" className="text-foreground font-medium">Docs</Link>
          </nav>
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="inline-flex items-center gap-2 rounded-lg bg-primary text-primary-foreground px-4 h-9 text-sm font-medium hover:opacity-90 disabled:opacity-60"
          >
            <Download className="w-4 h-4" />
            {downloading ? "Generating…" : "Download PDF"}
          </button>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-10">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="w-4 h-4" /> Back to home
        </Link>
        <h1 className="font-display text-4xl md:text-5xl tracking-tight">
          Complete Documentation
        </h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Everything you need to install, use, customize, and extend BreezeControl —
          from your first hand wave to running the native OS bridge. Read it live below
          or grab the PDF for offline use.
        </p>

        <div className="mt-10 grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-10">
          {/* TOC */}
          <aside className="lg:sticky lg:top-24 self-start">
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">
              Contents
            </p>
            <ul className="space-y-1.5 text-sm">
              {SECTIONS.map((s) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className="block rounded-md px-2.5 py-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                  >
                    {s.title}
                  </a>
                </li>
              ))}
            </ul>
          </aside>

          {/* Live preview */}
          <article className="prose prose-neutral dark:prose-invert max-w-none">
            <div className="rounded-2xl border border-border bg-card/50 p-6 md:p-10 space-y-12">
              {SECTIONS.map((s) => {
                const Icon = s.icon;
                return (
                  <section key={s.id} id={s.id} className="scroll-mt-24">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                        <Icon className="w-5 h-5" />
                      </div>
                      <h2 className="font-display text-2xl m-0">{s.title}</h2>
                    </div>
                    <div className="space-y-4 text-[15px] leading-relaxed text-foreground/90">
                      {s.blocks.map((b, i) => {
                        if (b.type === "p")
                          return <p key={i} className="m-0">{b.text}</p>;
                        if (b.type === "h3")
                          return (
                            <h3 key={i} className="font-display text-lg mt-2 mb-1">
                              {b.text}
                            </h3>
                          );
                        if (b.type === "ul")
                          return (
                            <ul key={i} className="list-disc pl-5 space-y-1.5 m-0">
                              {b.items.map((it, j) => (
                                <li key={j}>{it}</li>
                              ))}
                            </ul>
                          );
                        if (b.type === "ol")
                          return (
                            <ol key={i} className="list-decimal pl-5 space-y-1.5 m-0">
                              {b.items.map((it, j) => (
                                <li key={j}>{it}</li>
                              ))}
                            </ol>
                          );
                        if (b.type === "code")
                          return (
                            <pre
                              key={i}
                              className="m-0 rounded-lg bg-muted/60 border border-border p-4 text-xs font-mono overflow-x-auto"
                            >
                              {b.text}
                            </pre>
                          );
                        return null;
                      })}
                    </div>
                  </section>
                );
              })}
            </div>

            <p className="mt-6 text-xs text-muted-foreground">
              {plainText.length.toLocaleString()} characters · auto-generated PDF mirrors this content.
            </p>
          </article>
        </div>
      </section>
    </main>
  );
};

export default Docs;
