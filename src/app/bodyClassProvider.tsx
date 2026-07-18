"use client";

import "./globals.css"
import { usePathname } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
      <ToastContainer
      position="bottom-right"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      pauseOnHover
      draggable
      theme="colored"
      />
    </body>
  );
}