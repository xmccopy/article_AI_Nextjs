'use client'

import TopBar from "../components/sidebar/TopBar";
import SideBar from "../components/sidebar/SideBar";
import { FiAlignJustify } from "react-icons/fi";
import { useState, useRef, useEffect } from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [showSidebar, setShowSidebar] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const toggleSidebar = () => {
    setShowSidebar(prev => !prev);
  }

  const closeSidebar = () => {
    setShowSidebar(false);
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        closeSidebar();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[url(/images/bg.png)] bg-cover bg-center bg-fixed">
      <div ref={sidebarRef}>
        <SideBar showSidebar={showSidebar} onClose={closeSidebar} />
      </div>
      <div className="xl:ml-[300px]">
        <TopBar/>
        <button
          ref={buttonRef}
          onClick={toggleSidebar}
          className="fixed top-4 right-4 xl:hidden z-50"
        >
          <FiAlignJustify size={30} />
        </button>
        {children}
      </div>
    </div>
  );
}
