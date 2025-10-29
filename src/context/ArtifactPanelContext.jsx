import React, { createContext, useContext, useMemo, useState, useCallback } from 'react';

const ArtifactPanelContext = createContext(null);

const createEmptyConversationArtifacts = (conversationId) => ({
  conversationId,
  artifacts: [],
  activeArtifactId: null,
  createdAt: Date.now(),
  updatedAt: Date.now(),
});

export const ArtifactPanelProvider = ({ children }) => {
  const [conversationArtifacts, setConversationArtifacts] = useState({});
  const [panelState, setPanelState] = useState({
    isOpen: false,
    conversationId: null,
    extras: {},
    updatedAt: Date.now(),
  });

  const getConversationEntry = useCallback((conversationId, draft) => {
    if (!conversationId) {
      return null;
    }

    return draft[conversationId] || createEmptyConversationArtifacts(conversationId);
  }, []);

  const setConversationEntry = useCallback((conversationId, updater) => {
    if (!conversationId) {
      return null;
    }

    let updatedEntry = null;

    setConversationArtifacts(prev => {
      const baseEntry = getConversationEntry(conversationId, prev);
      if (!baseEntry) {
        return prev;
      }

      updatedEntry = updater(baseEntry);
      if (!updatedEntry) {
        return prev;
      }

      return {
        ...prev,
        [conversationId]: {
          ...updatedEntry,
          conversationId,
          updatedAt: Date.now(),
        }
      };
    });

    return updatedEntry;
  }, [getConversationEntry]);

  const upsertArtifact = useCallback((conversationId, artifact) => {
    if (!conversationId || !artifact) {
      return null;
    }

    let storedArtifact = null;

    const entry = setConversationEntry(conversationId, (current) => {
      const artifacts = Array.isArray(current.artifacts) ? [...current.artifacts] : [];
      const targetId = artifact.id || artifact.payload?.id;

      const existingIndex = artifacts.findIndex((item) => item?.id === targetId);

      if (existingIndex !== -1) {
        const previous = artifacts[existingIndex];
        storedArtifact = {
          ...previous,
          ...artifact,
          payload: {
            ...previous?.payload,
            ...artifact?.payload,
            id: previous?.payload?.id || targetId,
          },
          updatedAt: Date.now(),
          version: (previous?.version || 1) + 1,
        };
        artifacts[existingIndex] = storedArtifact;
      } else {
        storedArtifact = {
          ...artifact,
          id: targetId,
          status: artifact.status || 'draft',
          source: artifact.source || 'assistant',
          createdAt: Date.now(),
          updatedAt: Date.now(),
          version: artifact.version || 1,
        };
        artifacts.push(storedArtifact);
      }

      return {
        ...current,
        artifacts,
        activeArtifactId: storedArtifact?.id || current.activeArtifactId,
      };
    });

    return entry && storedArtifact ? { entry, artifact: storedArtifact } : null;
  }, [setConversationEntry]);

  const removeArtifact = useCallback((conversationId, artifactId) => {
    if (!conversationId || !artifactId) {
      return null;
    }

    let removedArtifact = null;

    const entry = setConversationEntry(conversationId, (current) => {
      const artifacts = Array.isArray(current.artifacts) ? current.artifacts : [];
      const filtered = artifacts.filter((artifact) => {
        const retain = artifact?.id !== artifactId;
        if (!retain && !removedArtifact) {
          removedArtifact = artifact;
        }
        return retain;
      });

      return {
        ...current,
        artifacts: filtered,
        activeArtifactId: current.activeArtifactId === artifactId
          ? filtered[filtered.length - 1]?.id || null
          : current.activeArtifactId,
      };
    });

    return entry && removedArtifact ? { entry, artifact: removedArtifact } : null;
  }, [setConversationEntry]);

  const selectArtifact = useCallback((conversationId, artifactId) => {
    if (!conversationId) {
      return null;
    }

    return setConversationEntry(conversationId, (current) => {
      if (current.activeArtifactId === artifactId) {
        return current;
      }

      return {
        ...current,
        activeArtifactId: artifactId,
      };
    });
  }, [setConversationEntry]);

  const markArtifact = useCallback((conversationId, artifactId, changes = {}) => {
    if (!conversationId || !artifactId) {
      return null;
    }

    let updatedArtifact = null;

    const entry = setConversationEntry(conversationId, (current) => {
      const artifacts = Array.isArray(current.artifacts) ? [...current.artifacts] : [];
      const index = artifacts.findIndex((item) => item?.id === artifactId);

      if (index === -1) {
        return current;
      }

      const nextArtifact = {
        ...artifacts[index],
        ...changes,
        payload: {
          ...artifacts[index]?.payload,
          ...changes?.payload,
        },
        updatedAt: Date.now(),
      };

      artifacts[index] = nextArtifact;
      updatedArtifact = nextArtifact;

      return {
        ...current,
        artifacts,
      };
    });

    return entry && updatedArtifact ? { entry, artifact: updatedArtifact } : null;
  }, [setConversationEntry]);

  const openArtifactPanel = useCallback((conversationId, extras = {}) => {
    if (!conversationId) {
      return;
    }

    setPanelState({
      isOpen: true,
      conversationId,
      extras,
      updatedAt: Date.now(),
    });
  }, []);

  const updatePanelPayload = useCallback((conversationId, overrides = {}) => {
    if (!conversationId) {
      return;
    }

    setPanelState((prev) => {
      if (prev.conversationId !== conversationId && !overrides.force) {
        return prev;
      }

      return {
        isOpen: overrides?.hasOwnProperty('isOpen') ? overrides.isOpen : prev.isOpen,
        conversationId,
        extras: overrides.hasOwnProperty('extras') ? overrides.extras : prev.extras,
        updatedAt: Date.now(),
      };
    });
  }, []);

  const closeArtifactPanel = useCallback(() => {
    setPanelState((prev) => ({
      ...prev,
      isOpen: false,
      updatedAt: Date.now(),
    }));
  }, []);

  const resetArtifacts = useCallback(() => {
    setConversationArtifacts({});
    setPanelState({ isOpen: false, conversationId: null, extras: {}, updatedAt: Date.now() });
  }, []);

  const clearConversationArtifacts = useCallback((conversationId) => {
    if (!conversationId) {
      return;
    }

    setConversationArtifacts(prev => {
      if (!prev[conversationId]) {
        return prev;
      }

      const next = { ...prev };
      delete next[conversationId];
      return next;
    });

    setPanelState((prev) => {
      if (prev.conversationId !== conversationId) {
        return prev;
      }

      return {
        isOpen: false,
        conversationId: null,
        extras: {},
        updatedAt: Date.now(),
      };
    });
  }, []);

  const value = useMemo(() => ({
    conversationArtifacts,
    panelState,
    getConversationEntry,
    upsertArtifact,
    removeArtifact,
    selectArtifact,
    markArtifact,
    openArtifactPanel,
    updatePanelPayload,
    closeArtifactPanel,
    resetArtifacts,
    clearConversationArtifacts,
  }), [
    conversationArtifacts,
    panelState,
    getConversationEntry,
    upsertArtifact,
    removeArtifact,
    selectArtifact,
    markArtifact,
    openArtifactPanel,
    updatePanelPayload,
    closeArtifactPanel,
    resetArtifacts,
    clearConversationArtifacts,
  ]);

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
