
import "./page-transition.css";

export default function PageTemplate({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="page-transition">{children}</div>;
}
