import { useEffect, useState } from "react";

/**
 * Detects when a newer build has been deployed while this tab stayed open.
 *
 * The build writes its stamp into both the app bundle (__BUILD_STAMP__) and a
 * tiny /version.json. We re-fetch version.json (never cached) on an interval
 * and whenever the tab regains focus; if its stamp differs from the one this
 * tab was built with, a newer deploy is live and we surface an Update banner.
 *
 * We never auto-reload — a non-technical user could be mid-entry — we just show
 * a one-click "Update" button. In dev there is no /version.json, so the fetch
 * fails quietly and the banner never appears.
 */
export function useVersionCheck(intervalMs = 60_000): boolean {
  const [updateAvailable, setUpdateAvailable] = useState(false);

  useEffect(() => {
    let active = true;

    async function check() {
      try {
        const res = await fetch(`/version.json?t=${Date.now()}`, {
          cache: "no-store",
        });
        if (!res.ok) return;
        const data = (await res.json()) as { build?: string };
        if (active && data.build && data.build !== __BUILD_STAMP__) {
          setUpdateAvailable(true);
        }
      } catch {
        // Offline or version.json missing (e.g. dev) — ignore.
      }
    }

    check();
    const id = setInterval(check, intervalMs);
    const onFocus = () => check();
    window.addEventListener("focus", onFocus);

    return () => {
      active = false;
      clearInterval(id);
      window.removeEventListener("focus", onFocus);
    };
  }, [intervalMs]);

  return updateAvailable;
}
