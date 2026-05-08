import { Link } from 'react-router-dom';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-white/5 px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <span className="text-2xl font-black tracking-tight text-white group-hover:text-accent-gold transition-colors">
            껄껄껄
          </span>
          <span className="text-xs text-white/30 font-mono mt-1">Ggeol</span>
        </Link>
        <nav className="flex items-center gap-4 text-sm text-white/50">
          <span>이때 샀다면...</span>
        </nav>
      </header>

      <main className="flex-1 container mx-auto max-w-5xl px-4 py-10">
        {children}
      </main>

      <footer className="border-t border-white/5 px-6 py-4 text-center text-white/20 text-xs">
        껄껄껄 — 투자는 과거를 돌아보며 배웁니다. (투자 권유 아님)
      </footer>
    </div>
  );
}
