import { useEffect, useRef } from "react";
import type { Estimate } from "@/types";
import { saveEstimate } from "@/lib/storage";

const DEBOUNCE_MS = 1000;

/**
 * Auto-save an estimate to localStorage with debouncing.
 * Saves 1 second after the last change.
 */
export function useAutoSave(estimate: Estimate, enabled: boolean = true) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    // Skip the initial render to avoid saving the default state
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (!enabled) return;

    // Clear any existing timer
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    // Set a new debounced save
    timerRef.current = setTimeout(() => {
      saveEstimate(estimate);
    }, DEBOUNCE_MS);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [estimate, enabled]);
}
