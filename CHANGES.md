# Recent Changes

## Workspace refactor
- Moved workout artifacts into the `ArtifactPanelContext`, allowing drafts to live independently of conversation messages.
- Added helpers to upsert, select, mark, and delete artifacts directly from the context.
- Synced artifacts back into persisted conversations for local storage compatibility.

## Workout Artifact Panel
- Rebuilt the panel UI around the new context data and added slide-in/out animations.
- Introduced manual toggle controls, fallback handling when the active conversation has no workouts, and an empty-state view.
- Collapsed the validation controls once a workout is saved, replacing them with a confirmation banner.
- Removed navigation away from the chat flow; all actions stay inside the workspace.

## Chat Assistant updates
- Simplified `processAiResponse` to interact with the artifact store and open the panel automatically when new drafts arrive.
- Added workspace toggles and counters in the chat header so users can open the workspace at will and see the number of drafts.
- Updated local storage hydration to seed the artifact context when conversations are loaded.
