"use client";

import "./globals.css"
import { usePathname } from "next/navigation";

export default function BodyClassProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isLanding = pathname === "/" || pathname === "/login" || pathname === "/register" || pathname==="/auth-verification";

  return (
    <body className={isLanding ? "landingPageBody" : "generalBody"}>
      {children}
    </body>
  );
}