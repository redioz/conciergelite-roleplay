export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      {/* Logo */}
      <div className="flex items-center gap-2 mb-8">
        <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center">
          <span className="text-gold font-bold text-lg">C</span>
        </div>
        <h1 className="text-xl font-bold tracking-wide">
          <span className="text-text-primary">CONCIERGE</span>
          <span className="text-gold">LITE</span>
        </h1>
      </div>
      {/* Glass card */}
      <div className="w-full max-w-md glass rounded-3xl p-8">{children}</div>
      {/* Footer */}
      <p className="mt-6 text-xs text-text-muted">Simulateur Roleplay IA</p>
    </div>
  );
}
