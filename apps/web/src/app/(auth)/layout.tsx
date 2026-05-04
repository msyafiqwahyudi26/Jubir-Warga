export default function AuthLayout({ children }: { children: React.ReactNode }) {
  // SiteHeader + SiteFooter di-render dari root layout. Auth layout cuma center form.
  return (
    <div className="flex-1 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
}
