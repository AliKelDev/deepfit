import React, { createContext, useContext, useMemo, useState, useCallback } from 'react';

const ArtifactPanelContext = createContext(null);

export const ArtifactPanelProvider = ({ children }) => {
  const [artifactState, setArtifactState] = useState(null);

  const openArtifact = useCallback((type, payload) => {
    setArtifactState({
      type,
      payload,
      isOpen: true,
      updatedAt: Date.now(),
    });
  }, []);

  const updateArtifact = useCallback((payload) => {
    setArtifactState((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        payload,
        updatedAt: Date.now(),
      };
    });
  }, []);

  const closeArtifact = useCallback(() => {
    setArtifactState((prev) => (prev ? { ...prev, isOpen: false } : prev));
  }, []);

  const resetArtifact = useCallback(() => {
    setArtifactState(null);
  }, []);

  const value = useMemo(() => ({
    artifactState,
    openArtifact,
    updateArtifact,
    closeArtifact,
    resetArtifact,
  }), [artifactState, openArtifact, updateArtifact, closeArtifact, resetArtifact]);

  return (
    <ArtifactPanelContext.Provider value={value}>
      {children}
    </ArtifactPanelContext.Provider>
  );
};

export const useArtifactPanel = () => {
  const context = useContext(ArtifactPanelContext);
  if (!context) {
    throw new Error('useArtifactPanel must be used within an ArtifactPanelProvider');
  }
  return context;
};
