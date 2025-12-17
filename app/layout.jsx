import "./globals.css";
import Link from "next/link";
export const metadata = {
  title: "Historic Fires Near Me",
  description: "Explore historical newspaper locations over time"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en-AU">
      <body className="bg-surface-50 text-brand-dark">
        <div className="flex flex-col min-h-screen">
  <Header />
  <AlertBar />
  <main className="flex-1">{children}</main>
</div>

      </body>
    </html>
  );
}

function Header() {
  return (
    <header className="bg-brand-dark text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-6 w-6 rounded bg-brand-red" aria-hidden />
          <span className="font-semibold tracking-wide">Historic Fires Near Me</span>
        </div>
        <nav className="hidden md:flex items-center gap-6 text-sm/none">
          <Link className="opacity-90 hover:opacity-100" href="/">
            Map
          </Link>
          <Link className="opacity-90 hover:opacity-100" href="/about">
            About
          </Link>
          <Link className="opacity-90 hover:opacity-100" href="/data">
            Data
          </Link>
        </nav>
      </div>
    </header>
  );
}


function AlertBar() {
  return (
    <div className="bg-surface-0 border-b border-surface-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-2 text-sm flex items-center gap-2">
        <span className="inline-flex items-center rounded-full bg-brand-red text-white px-2 py-0.5 text-[11px] font-semibold">BETA</span>
        <p>Historical newspaper reports visualised by location and date. Click points for article details.</p>
      </div>
    </div>
  );
}

function Footer() {
  return (
    <footer className="border-t border-surface-border bg-surface-0">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 text-sm text-gray-600">
        Built with MapLibre and deck.gl. Data from Trove.
      </div>
    </footer>
  );
}
