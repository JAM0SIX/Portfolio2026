import { Sora } from "next/font/google";
import Sidebar from "./components/Sidebar";
import LocalClock from "./components/LocalClock";
import "./globals.css";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata = {
  title: "Harry Spawforth",
  description: "Designer · London. Case studies, experiments, and writing.",
};

// Inline boot script: read the stored theme and write it to <html> before
// React hydrates, so there's no light/dark flash on first paint.
const themeBootScript = `(function(){try{var t=localStorage.getItem('harrys-theme');if(t!=='onyx'&&t!=='paper')t='paper';document.documentElement.dataset.theme=t;}catch(e){document.documentElement.dataset.theme='paper';}})();`;

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="paper" className={sora.variable}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootScript }} />
      </head>
      <body>
        <div className="shell">
          <Sidebar />
          {children}
        </div>
        <LocalClock />
      </body>
    </html>
  );
}
