export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Côté gauche — visuel */}
      <div className="hidden lg:flex bg-black items-center justify-center">
        <div className="text-white text-center space-y-4 p-12">
          <h1 className="text-5xl font-bold tracking-tight">LUXE</h1>
          <p className="text-zinc-400 text-lg">
            L&apos;élégance à portée de main
          </p>
        </div>
      </div>

      {/* Côté droit — formulaire */}
      <div className="flex items-center justify-center p-8">{children}</div>
    </div>
  );
}
