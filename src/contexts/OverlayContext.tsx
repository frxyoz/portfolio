'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface OverlayContextType {
  overlayOpen: boolean;
  openOverlay: () => void;
  closeOverlay: () => void;
}

const OverlayContext = createContext<OverlayContextType>({
  overlayOpen: false,
  openOverlay: () => {},
  closeOverlay: () => {},
});

export function OverlayProvider({ children }: { children: ReactNode }) {
  const [overlayOpen, setOverlayOpen] = useState(false);
  const openOverlay  = useCallback(() => setOverlayOpen(true),  []);
  const closeOverlay = useCallback(() => setOverlayOpen(false), []);
  return (
    <OverlayContext.Provider value={{ overlayOpen, openOverlay, closeOverlay }}>
      {children}
    </OverlayContext.Provider>
  );
}

export function useOverlay() {
  return useContext(OverlayContext);
}
