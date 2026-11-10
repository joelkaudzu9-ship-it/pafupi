"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";

function PathnameKey({ onPathname }: { onPathname: (p: string) => void }) {
  const pathname = usePathname();
  useEffect(() => {
    onPathname(pathname);
  }, [pathname, onPathname]);
  return null;
}

export default function PageTransition({ children }: { children: ReactNode }) {
  const [pathname, setPathname] = useState<string>("/");

  return (
    <>
      <PathnameKey onPathname={setPathname} />
      <div key={pathname} className="page-transition">
        {children}
      </div>
    </>
  );
}