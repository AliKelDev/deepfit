import React from 'react';
import { X, Dumbbell, Folder } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import WorkoutPreview from '../WorkoutPreview';
import { useArtifactPanel } from '../../context/ArtifactPanelContext';
import { useWorkout } from '../../WorkoutContext';

const WorkoutArtifactPanel = () => {
  const { artifactState, closeArtifact, resetArtifact } = useArtifactPanel();
  const { workouts } = useWorkout();
  const navigate = useNavigate();

  console.log('[WorkoutArtifactPanel] state snapshot:', artifactState);

  if (!artifactState || artifactState.type !== 'workout_draft' || !artifactState.isOpen) {
    return null;
  }

  const { payload } = artifactState;

  const handleClose = () => {
    closeArtifact();
    resetArtifact();
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black/30 z-40"
        onClick={handleClose}
        aria-hidden="true"
      />
      <aside
        className="fixed right-0 top-0 h-full w-full max-w-md bg-white border-l border-[#B8D8F8] shadow-2xl z-50 flex flex-col"
        role="complementary"
        aria-label="Workout builder panel"
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#B8D8F8] bg-[#E8F4FF]">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center border border-[#B8D8F8]">
              <Dumbbell className="w-5 h-5 text-[#4A90E2]" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">Max is drafting a workout</p>
              <p className="text-xs text-gray-600">Review the plan, then save or request tweaks.</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-full text-[#4A90E2] hover:bg-white"
            aria-label="Close workout panel"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          <WorkoutPreview
            workoutData={payload}
            onAction={handleClose}
          />

          <div className="border border-[#E0EEFF] rounded-xl bg-[#F5FAFF] p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Folder className="w-4 h-4 text-[#4A90E2]" />
                <h3 className="text-sm font-semibold text-gray-800">Saved workouts</h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  handleClose();
                  navigate('/workout');
                }}
                className="text-xs font-medium text-[#4A90E2] hover:underline"
              >
                Manage
              </button>
            </div>

            {workouts.length === 0 ? (
              <p className="text-xs text-gray-600">
                Saved plans will appear here once you approve your first workout.
              </p>
            ) : (
              <ul className="space-y-2">
                {workouts.slice(0, 3).map((workout) => (
                  <li
                    key={workout.id}
                    className="flex items-center justify-between bg-white border border-[#DCE9FB] rounded-lg px-3 py-2"
                  >
                    <span className="text-xs font-medium text-gray-800 truncate pr-2">
                      {workout.name || 'Untitled workout'}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        handleClose();
                        navigate('/workout');
                      }}
                      className="text-xs text-[#4A90E2] hover:underline"
                    >
                      View
                    </button>
                  </li>
                ))}
                {workouts.length > 3 && (
                  <li className="text-xs text-[#4A90E2] font-medium">
                    …and {workouts.length - 3} more. Head to the workout page for the full list.
                  </li>
                )}
              </ul>
            )}
          </div>
        </div>

        <div className="px-4 py-3 border-t border-[#B8D8F8] bg-[#F5FAFF] text-xs text-gray-600">
          {payload?.description ? (
            <p className="leading-relaxed">
              Draft note: {payload.description}
            </p>
          ) : (
            <p>Review the workout draft above and let Max know if anything needs to change.</p>
          )}
        </div>
      </aside>
    </>
  );
};

export default WorkoutArtifactPanel;
