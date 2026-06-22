import localFont from "next/font/local";
import Sidebar from "./components/Sidebar";
import LocalClock from "./components/LocalClock";
import CursorDotField from "./components/CursorDotField";
import EntryProvider from "./components/EntryProvider";
import EntryOverlay from "./components/EntryOverlay";
import Footer from "@/components/Footer/Footer";
import "./globals.css";

/* JetBrains Mono — the portfolio's single typeface, self-hosted from
   the static TTFs in ./fonts. Exposed as --font-jetbrains and wired to
   --font-sans in design-system.css so every surface picks it up. */
const jetbrainsMono = localFont({
  variable: "--font-jetbrains",
  display: "swap",
  src: [
    { path: "./fonts/JetBrainsMono-Light.ttf", weight: "300", style: "normal" },
    { path: "./fonts/JetBrainsMono-LightItalic.ttf", weight: "300", style: "italic" },
    { path: "./fonts/JetBrainsMono-Regular.ttf", weight: "400", style: "normal" },
    { path: "./fonts/JetBrainsMono-Italic.ttf", weight: "400", style: "italic" },
    { path: "./fonts/JetBrainsMono-Medium.ttf", weight: "500", style: "normal" },
    { path: "./fonts/JetBrainsMono-MediumItalic.ttf", weight: "500", style: "italic" },
    { path: "./fonts/JetBrainsMono-SemiBold.ttf", weight: "600", style: "normal" },
    { path: "./fonts/JetBrainsMono-SemiBoldItalic.ttf", weight: "600", style: "italic" },
    { path: "./fonts/JetBrainsMono-Bold.ttf", weight: "700", style: "normal" },
    { path: "./fonts/JetBrainsMono-BoldItalic.ttf", weight: "700", style: "italic" },
    { path: "./fonts/JetBrainsMono-ExtraBold.ttf", weight: "800", style: "normal" },
    { path: "./fonts/JetBrainsMono-ExtraBoldItalic.ttf", weight: "800", style: "italic" },
  ],
});

export const metadata = {
  title: "Harry Spawforth",
  description: "Designer · London. Case studies, experiments, and writing.",
};

// Inline boot script: read the stored theme and write it to <html> before
// React hydrates, so there's no light/dark flash on first paint.
const themeBootScript = `(function(){try{var t=localStorage.getItem('harrys-theme');if(t!=='onyx'&&t!=='paper')t='paper';document.documentElement.dataset.theme=t;var s=location.search;var embed=s.indexOf('embed=1')!==-1;var hero=s.indexOf('hero=1')!==-1;if(embed)document.documentElement.dataset.embed='1';if(hero)document.documentElement.dataset.hero='1';if(location.pathname==='/'&&!embed&&!hero&&!sessionStorage.getItem('harrys-entered'))document.documentElement.dataset.entering='1';}catch(e){document.documentElement.dataset.theme='paper';}})();`;

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      data-theme="paper"
      className={jetbrainsMono.variable}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootScript }} />
      </head>
      <body>
        <EntryProvider>
          <div className="shell">
            <Sidebar />
            <div className="shell__main">
              <CursorDotField />
              {children}
              <Footer />
            </div>
          </div>
          <LocalClock />
          <EntryOverlay />
        </EntryProvider>
      </body>
    </html>
  );
}
