import { useState, useEffect, useRef } from "react";
import { Outlet } from "react-router-dom";
import { IconRail } from "./IconRail";
import { TopNav } from "./TopNav";
import { Sidebar } from "./Sidebar";
import { cn } from "../../lib/utils";

/**
 * Authenticated app shell:
 *  - floating icon-only rail on the left (desktop, lg+)
 *  - labelled slide-in/slide-out drawer on mobile with smooth animation
 *  - floating top nav (brand + centered link pill + actions)
 *  - airy, scrollable content region
 */
export function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  // mounted = sidebar DOM is present; closing = play slide-out before unmounting
  const [mounted, setMounted] = useState(false);
  const [closing, setClosing] = useState(false);
  const closeTimer = useRef(null);

  useEffect(() => {
    if (mobileOpen) {
      // Cancel any pending unmount before re-opening
      clearTimeout(closeTimer.current);
      setClosing(false);
      setMounted(true);
    } else if (mounted) {
      // Play exit animation, then unmount
      setClosing(true);
      closeTimer.current = setTimeout(() => {
        setMounted(false);
        setClosing(false);
      }, 260); // slightly longer than slideout (250ms)
    }
    return () => clearTimeout(closeTimer.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mobileOpen]);

  const close = () => setMobileOpen(false);

  return (
    <div className="flex h-screen overflow-hidden bg-canvas">
      {/* Desktop icon rail */}
      <div className="hidden shrink-0 pl-3 lg:flex">
        <IconRail />
      </div>

      {/* Mobile sidebar drawer — stays mounted during close so exit animation plays */}
      {mounted && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className={cn(
              "absolute inset-0 bg-ink/40 backdrop-blur-sm transition-opacity duration-250",
              closing ? "animate-fade-out" : "animate-fade-in"
            )}
            onClick={close}
          />
          {/* Slide panel */}
          <div
            className={cn(
              "absolute left-0 top-0 h-full",
              closing ? "animate-slideout" : "animate-slidein"
            )}
          >
            <Sidebar onNavigate={close} />
          </div>
        </div>
      )}

      {/* Main column */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar — pb-4 adds the space below the logo/nav */}
        <div className="px-4 pt-4 pb-4 md:px-6 md:pt-5 md:pb-5">
          <TopNav onMenuClick={() => setMobileOpen(true)} />
        </div>

        <main className="flex-1 overflow-y-auto px-4 py-2 md:px-6">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
