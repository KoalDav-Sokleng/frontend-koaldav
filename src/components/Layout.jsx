import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { X } from "lucide-react";
import SideBar from "./SideBar";
import TopMenu from "./TopMenu";
import { NotificationProvider } from "../features/notification/hooks/NotificationProvider";

export default function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
<<<<<<< HEAD
  const hideTopMenu = location.pathname.startsWith("/habit");

  return (
<<<<<<< HEAD
    <NotificationProvider>
      <div className="w-full h-screen flex overflow-hidden bg-gray-50">
        {/* Desktop sidebar */}
        <div className="hidden lg:block lg:w-[260px] xl:w-[280px] shrink-0 h-screen">
          <SideBar />
        </div>

        {/* Mobile drawer */}
        {mobileOpen && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => setMobileOpen(false)}
            />
            <div className="absolute inset-y-0 left-0 w-[80%] max-w-[300px] h-full shadow-xl">
              <div className="flex justify-end p-3 bg-[#F4F2FF]">
                <button
                  onClick={() => setMobileOpen(false)}
                  aria-label="Close menu"
                  className="p-1 rounded-lg hover:bg-white/60"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>
              <SideBar onNavigate={() => setMobileOpen(false)} />
=======
    <div className="w-full h-screen flex overflow-hidden bg-gray-50 dark:bg-[#101016] transition-colors">
=======

  const isFinance = location.pathname.startsWith("/finance");

  return (
    <div className="w-full h-screen flex overflow-hidden bg-gray-50 dark:bg-[#0D0D12] text-gray-900 dark:text-gray-100 transition-colors">
>>>>>>> 7a463c620f9e3ac26408504e5418a29b68b13b05
      {/* Desktop sidebar */}
      <div className="hidden lg:block lg:w-[260px] xl:w-[280px] shrink-0 h-screen">
        <SideBar />
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-[80%] max-w-[300px] h-full shadow-xl">
<<<<<<< HEAD
            <div className="flex justify-end p-3 bg-[#F4F2FF] dark:bg-[#0F0F14]">
              <button
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
                className="p-1 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-white/60 dark:hover:bg-[#1A1A22]"
=======
            <div className="flex justify-end p-3 bg-[#F4F2FF] dark:bg-[#1A1A22] transition-colors">
              <button
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
                className="p-1 rounded-lg hover:bg-white/60 dark:hover:bg-white/10 text-gray-600 dark:text-gray-300"
>>>>>>> 7a463c620f9e3ac26408504e5418a29b68b13b05
              >
                <X className="w-5 h-5" />
              </button>
>>>>>>> 3e774fa7fa5d7cc7799619471e44fd340f51f839
            </div>
          </div>
        )}
        <div className="flex flex-1 flex-col min-w-0 h-screen">
          <TopMenu onMenuClick={() => setMobileOpen(true)} />
          <div className="flex-1 overflow-y-auto">
            <Outlet />
          </div>
        </div>
<<<<<<< HEAD
=======
      )}

      <div className="flex flex-1 flex-col min-w-0 h-screen">
<<<<<<< HEAD
        {!hideTopMenu && <TopMenu onMenuClick={() => setMobileOpen(true)} />}
        <div className="flex-1 overflow-y-auto">
          <Outlet context={{ onOpenMobileMenu: () => setMobileOpen(true) }} />
=======
        {!isFinance && <TopMenu onMenuClick={() => setMobileOpen(true)} />}
        <div className="flex-1 overflow-y-auto min-h-0">
          <Outlet context={{ onMenuClick: () => setMobileOpen(true) }} />
>>>>>>> 7a463c620f9e3ac26408504e5418a29b68b13b05
        </div>
>>>>>>> 3e774fa7fa5d7cc7799619471e44fd340f51f839
      </div>
    </NotificationProvider>
  );
}
