# Project Export

## Project Statistics

- Total files: 9

## Folder Structure

```
src
  components
    workout
      TabNavigation.jsx
      Header.jsx
      tabs
        MyWorkoutsTab.jsx
        HistoryTab.jsx
        CreateWorkoutTab.jsx
        ActiveWorkoutTab.jsx
      modals
        QuickChatModal.jsx
        ExerciseSelectionModal.jsx
  pages
    WorkoutPage.jsx

```

### src/components/workout/TabNavigation.jsx

```jsx
// src/components/workout/TabNavigation.jsx
import React from 'react';

const TabNavigation = ({ currentTab, setCurrentTab, activeWorkout }) => {
  return (
    <div className="flex border-b border-gray-200">
      <button
        className={`flex-1 py-4 px-6 font-medium transition-colors ${
          currentTab === "my-workouts" ? "text-[#4A90E2] border-b-2 border-[#4A90E2]" : "text-gray-600 hover:bg-gray-50"
        }`}
        onClick={() => setCurrentTab("my-workouts")}
      >
        My Workouts
      </button>
      <button
        className={`flex-1 py-4 px-6 font-medium transition-colors ${
          currentTab === "create" ? "text-[#4A90E2] border-b-2 border-[#4A90E2]" : "text-gray-600 hover:bg-gray-50"
        }`}
        onClick={() => setCurrentTab("create")}
      >
        Create Workout
      </button>
      <button
        className={`flex-1 py-4 px-6 font-medium transition-colors ${
          currentTab === "history" ? "text-[#4A90E2] border-b-2 border-[#4A90E2]" : "text-gray-600 hover:bg-gray-50"
        }`}
        onClick={() => setCurrentTab("history")}
      >
        History
      </button>
      {activeWorkout && (
        <button
          className={`flex-1 py-4 px-6 font-medium transition-colors ${
            currentTab === "active" ? "text-[#4A90E2] border-b-2 border-[#4A90E2]" : "text-red-500 hover:bg-red-50"
          }`}
          onClick={() => setCurrentTab("active")}
        >
          Active Workout
        </button>
      )}
    </div>
  );
};

export default TabNavigation;
```

### src/components/workout/Header.jsx

```jsx
// src/components/workout/Header.jsx
import React from 'react';
import { Dumbbell, MessageSquare } from 'lucide-react';

const Header = ({ userProfile, setShowChatModal, weightUnit, setWeightUnit }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="bg-[#E8F4FF] p-3 rounded-full">
            <Dumbbell className="w-8 h-8 text-[#4A90E2]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Workout Tracker</h1>
            <p className="text-gray-600">Hey {userProfile?.name}, let's crush your fitness goals!</p>
          </div>
          <div className="flex items-center">
            <span className={`px-3 py-1 rounded-l-lg ${weightUnit === 'lbs' ? 'bg-[#4A90E2] text-white' : 'bg-gray-200 text-gray-700'}`}
                  onClick={() => setWeightUnit('lbs')}
                  style={{cursor: 'pointer'}}>
              lbs
            </span>
            <span className={`px-3 py-1 rounded-r-lg ${weightUnit === 'kg' ? 'bg-[#4A90E2] text-white' : 'bg-gray-200 text-gray-700'}`}
                  onClick={() => setWeightUnit('kg')}
                  style={{cursor: 'pointer'}}>
              kg
            </span>
          </div>
        </div>
        
        <button
          onClick={() => setShowChatModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#4A90E2] text-white rounded-lg hover:bg-[#357ABD] transition-colors"
        >
          <MessageSquare className="w-5 h-5" />
          Ask Max
        </button>
      </div>
    </div>
  );
};

export default Header;
```

### src/components/workout/tabs/MyWorkoutsTab.jsx

```jsx
// src/components/workout/tabs/MyWorkoutsTab.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Dumbbell, Plus, Play, Trash2 } from 'lucide-react';

const MyWorkoutsTab = ({ workouts, handleStartWorkout, handleDeleteWorkout, setCurrentTab, handleQuickStartWorkout }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">Your Workout Plans</h2>
        <div className="flex gap-2">
          <button
            onClick={handleQuickStartWorkout}
            className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            <Play className="w-5 h-5" />
            Quick Start
          </button>
          <button
            onClick={() => setCurrentTab("create")}
            className="flex items-center gap-2 px-4 py-2 bg-[#E8F4FF] text-[#4A90E2] rounded-lg hover:bg-[#D1E8FF] transition-colors"
          >
            <Plus className="w-5 h-5" />
            New Plan
          </button>
        </div>
      </div>

      {workouts.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600 mb-4">You haven't created any workout plans yet.</p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <button
              onClick={handleQuickStartWorkout}
              className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              Quick Start Workout
            </button>
            <button
              onClick={() => setCurrentTab("create")}
              className="px-6 py-3 bg-[#4A90E2] text-white rounded-lg hover:bg-[#357ABD] transition-colors"
            >
              Create a Workout Plan
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {workouts.map(workout => (
            <motion.div
              key={workout.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="p-5 border-b border-gray-100">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-semibold text-gray-800">{workout.name}</h3>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => handleDeleteWorkout(workout.id)}
                      className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mt-1">
                  {workout.exercises.length} exercise{workout.exercises.length !== 1 ? 's' : ''}
                </p>
                {workout.description && (
                  <p className="text-gray-500 text-sm mt-2">{workout.description}</p>
                )}
              </div>
              
              <div className="p-4 bg-gray-50">
                <div className="mb-3">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Exercises:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {workout.exercises.slice(0, 3).map((exercise, index) => (
                      <li key={index}>{exercise.name} ({exercise.sets.length} sets)</li>
                    ))}
                    {workout.exercises.length > 3 && (
                      <li className="text-gray-500">+{workout.exercises.length - 3} more...</li>
                    )}
                  </ul>
                </div>
                
                <button
                  onClick={() => handleStartWorkout(workout)}
                  className="w-full mt-2 py-2 bg-[#4A90E2] text-white rounded-lg hover:bg-[#357ABD] transition-colors flex items-center justify-center gap-2"
                >
                  <Play className="w-4 h-4" />
                  Start Workout
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default MyWorkoutsTab;
```

### src/components/workout/tabs/HistoryTab.jsx

```jsx
// src/components/workout/tabs/HistoryTab.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock } from 'lucide-react';

const HistoryTab = ({ workoutHistory, formatTime, weightUnit, setCurrentTab, workouts }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">Workout History</h2>
      </div>

      {workoutHistory.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">You haven't completed any workouts yet.</p>
          {workouts.length > 0 && (
            <button
              onClick={() => setCurrentTab("my-workouts")}
              className="px-6 py-3 bg-[#4A90E2] text-white rounded-lg hover:bg-[#357ABD] transition-colors"
            >
              Start a Workout
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {workoutHistory.map((workout, index) => {
            const startDate = new Date(workout.startTime);
            const endDate = new Date(workout.endTime);
            return (
              <div key={index} className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{workout.name}</h3>
                    <p className="text-sm text-gray-600">
                      {startDate.toLocaleDateString()} at {startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 bg-[#E8F4FF] px-3 py-1 rounded-full">
                    <Clock className="w-4 h-4 text-[#4A90E2]" />
                    <span className="text-sm font-medium text-[#4A90E2]">
                      {formatTime(workout.duration)}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  {workout.exercises.map((exercise, exerciseIndex) => {
                    const completedSets = exercise.sets.filter(set => set.completed).length;
                    return (
                      <div key={exerciseIndex} className="border-t border-gray-100 pt-3">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium text-gray-800">{exercise.name}</span>
                          <span className="text-sm text-gray-600">
                            {completedSets}/{exercise.sets.length} sets completed
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-4 gap-2 text-sm">
                          {exercise.sets.map((set, setIndex) => (
                            <div 
                              key={setIndex} 
                              className={`p-2 rounded text-center ${
                                set.completed 
                                  ? 'bg-green-50 text-green-700' 
                                  : 'bg-gray-50 text-gray-500'
                              }`}
                            >
                              {set.completed ? set.actualWeight : set.weight}{weightUnit} × {set.completed ? set.actualReps : set.reps}
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
};

export default HistoryTab;
```

### src/components/workout/tabs/CreateWorkoutTab.jsx

```jsx
// src/components/workout/tabs/CreateWorkoutTab.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Plus, X, Dumbbell, Save } from 'lucide-react';

const CreateWorkoutTab = ({ 
  newWorkout, 
  setNewWorkout, 
  handleSaveWorkout, 
  handleRemoveExercise,
  handleAddSet, 
  handleRemoveSet, 
  handleSetChange,
  setShowExerciseModal,
  setCurrentTab,
  weightUnit
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">Create New Workout</h2>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Workout Name</label>
          <input
            type="text"
            value={newWorkout.name}
            onChange={(e) => setNewWorkout(prev => ({ ...prev, name: e.target.value }))}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A90E2] focus:border-transparent"
            placeholder="My Awesome Workout"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
          <textarea
            value={newWorkout.description}
            onChange={(e) => setNewWorkout(prev => ({ ...prev, description: e.target.value }))}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A90E2] focus:border-transparent"
            placeholder="Notes about this workout..."
            rows={2}
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700">Exercises</label>
            <button
              onClick={() => setShowExerciseModal(true)}
              className="flex items-center gap-1 text-sm text-[#4A90E2] hover:text-[#357ABD] transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Exercise
            </button>
          </div>

          {newWorkout.exercises.length === 0 ? (
            <div 
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => setShowExerciseModal(true)}
            >
              <Dumbbell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">No exercises added yet</p>
              <p className="text-sm text-gray-500">Click to add exercises to your workout</p>
            </div>
          ) : (
            <div className="space-y-4">
              {newWorkout.exercises.map((exercise, exerciseIndex) => (
                <div key={exerciseIndex} className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="flex justify-between items-center p-4 bg-gray-50 border-b border-gray-200">
                    <h3 className="font-medium text-gray-800">{exercise.name}</h3>
                    <button 
                      onClick={() => handleRemoveExercise(exerciseIndex)}
                      className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="p-4">
                    <div className="mb-4">
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="text-left text-gray-600">
                              <th className="pb-3">Set</th>
                              <th className="pb-3">Weight</th>
                              <th className="pb-3">Reps</th>
                              <th className="pb-3">Type</th>
                              <th className="pb-3"></th>
                            </tr>
                          </thead>
                          <tbody>
                            {exercise.sets.map((set, setIndex) => (
                              <tr key={setIndex}>
                                <td className="py-3">{setIndex + 1}</td>
                                <td className="py-3">
                                  <div className="flex items-center">
                                    <input
                                      type="number"
                                      min="0"
                                      value={set.weight}
                                      onChange={(e) => handleSetChange(exerciseIndex, setIndex, 'weight', parseFloat(e.target.value) || 0)}
                                      className="w-16 p-2 border border-gray-300 rounded"
                                    />
                                    <span className="ml-1 text-gray-500 text-xs">{weightUnit}</span>
                                  </div>
                                </td>
                                <td className="py-3">
                                  <div className="flex items-center">
                                    <input
                                      type="number"
                                      min="1"
                                      max="99"
                                      value={set.reps}
                                      onChange={(e) => handleSetChange(exerciseIndex, setIndex, 'reps', parseInt(e.target.value, 10) || 1)}
                                      className="w-16 p-2 border border-gray-300 rounded"
                                    />
                                    <span className="ml-1 text-gray-500 text-xs">reps</span>
                                  </div>
                                </td>
                                <td className="py-3">
                                  <select
                                    value={set.type}
                                    onChange={(e) => handleSetChange(exerciseIndex, setIndex, 'type', e.target.value)}
                                    className="p-2 border border-gray-300 rounded"
                                  >
                                    <option value="normal">Normal</option>
                                    <option value="warm-up">Warm-up</option>
                                    <option value="drop">Drop Set</option>
                                  </select>
                                </td>
                                <td className="py-3">
                                  <button 
                                    onClick={() => handleRemoveSet(exerciseIndex, setIndex)}
                                    className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <button
                        onClick={() => handleAddSet(exerciseIndex)}
                        className="flex items-center gap-1 text-sm text-[#4A90E2] hover:text-[#357ABD] transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        Add Set
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button
            onClick={() => {
              setNewWorkout({
                name: "",
                exercises: [],
                description: ""
              });
              setCurrentTab("my-workouts");
            }}
            className="px-6 py-3 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveWorkout}
            className="flex items-center gap-2 px-6 py-3 bg-[#4A90E2] text-white rounded-lg hover:bg-[#357ABD] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!newWorkout.name || newWorkout.exercises.length === 0}
          >
            <Save className="w-5 h-5" />
            Save Workout
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default CreateWorkoutTab;
```

### src/components/workout/tabs/ActiveWorkoutTab.jsx

```jsx
// src/components/workout/tabs/ActiveWorkoutTab.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Pause, Play, CheckCircle, RotateCcw, Plus, Save } from 'lucide-react';

const ActiveWorkoutTab = ({ 
  activeWorkout, 
  setActiveWorkout,
  stopwatchRunning, 
  setStopwatchRunning, 
  elapsedTime, 
  formatTime, 
  handleSetCompleted, 
  handleCancelWorkout, 
  handleCompleteWorkout,
  handleAddExerciseToActiveWorkout,
  handleAddSetToActiveWorkout,
  setShowExerciseModal,
  handleSaveActiveWorkout,
  weightUnit
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-semibold text-gray-800">{activeWorkout.name}</h2>
            <input
              type="text"
              value={activeWorkout.name}
              onChange={(e) => setActiveWorkout(prev => ({ ...prev, name: e.target.value }))}
              className="bg-transparent border-b border-gray-300 focus:border-[#4A90E2] focus:outline-none px-2 py-1 text-xl font-semibold"
              placeholder="Name your workout"
            />
          </div>
          <p className="text-sm text-gray-600">Workout in progress</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-[#E8F4FF] px-4 py-2 rounded-lg">
            <Clock className="w-5 h-5 text-[#4A90E2]" />
            <span className="font-mono font-medium text-[#4A90E2]">
              {formatTime(elapsedTime)}
            </span>
          </div>
          
          <button
            onClick={() => setStopwatchRunning(!stopwatchRunning)}
            className={`p-2 rounded-full ${
              stopwatchRunning 
                ? 'bg-amber-50 text-amber-600 hover:bg-amber-100' 
                : 'bg-green-50 text-green-600 hover:bg-green-100'
            } transition-colors`}
          >
            {stopwatchRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Add Exercise button when no exercises */}
      {activeWorkout.exercises.length === 0 ? (
        <div 
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={() => setShowExerciseModal(true)}
        >
          <Plus className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-2">No exercises added yet</p>
          <p className="text-sm text-gray-500">Click to add exercises to your workout</p>
        </div>
      ) : (
        <div className="space-y-6">
          {activeWorkout.exercises.map((exercise, exerciseIndex) => {
            const completedSets = exercise.sets.filter(set => set.completed).length;
            return (
              <div key={exerciseIndex} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                <div className="flex justify-between items-center p-4 bg-gray-50 border-b border-gray-200">
                  <h3 className="font-medium text-gray-800">{exercise.name}</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">
                      {completedSets}/{exercise.sets.length} sets completed
                    </span>
                  </div>
                </div>
                
                <div className="p-4">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-gray-600">
                        <th className="pb-3">Set</th>
                        <th className="pb-3">Weight</th>
                        <th className="pb-3">Reps</th>
                        <th className="pb-3">Actual</th>
                        <th className="pb-3"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {exercise.sets.map((set, setIndex) => (
                        <tr key={setIndex} className={set.completed ? 'bg-green-50' : ''}>
                          <td className="py-3">{setIndex + 1} {set.type !== 'normal' && `(${set.type})`}</td>
                          <td className="py-3">
                            <div className="flex items-center">
                              <input
                                type="number"
                                min="0"
                                value={set.actualWeight}
                                onChange={(e) => {
                                  const newActiveWorkout = { ...activeWorkout };
                                  newActiveWorkout.exercises[exerciseIndex].sets[setIndex].actualWeight = e.target.value;
                                  setActiveWorkout(newActiveWorkout);
                                }}
                                className={`w-20 p-2 border rounded ${
                                  set.completed ? 'border-green-300 bg-green-50' : 'border-gray-300'
                                }`}
                                disabled={set.completed}
                              />
                              <span className="ml-1 text-gray-500 text-xs">{weightUnit}</span>
                            </div>
                          </td>
                          <td className="py-3">{set.reps}</td>
                          <td className="py-3">
                            <input
                              type="number"
                              min="0"
                              max={99}
                              value={set.actualReps || ''}
                              onChange={(e) => {
                                const newActiveWorkout = { ...activeWorkout };
                                newActiveWorkout.exercises[exerciseIndex].sets[setIndex].actualReps = e.target.value;
                                setActiveWorkout(newActiveWorkout);
                              }}
                              className={`w-20 p-2 border rounded ${
                                set.completed ? 'border-green-300 bg-green-50' : 'border-gray-300'
                              }`}
                              placeholder={set.reps}
                              disabled={set.completed}
                            />
                          </td>
                          <td className="py-3">
                            {set.completed ? (
                              <button
                                onClick={() => handleSetCompleted(exerciseIndex, setIndex, false, 0, set.weight)}
                                className="p-2 text-green-600 hover:text-green-700 transition-colors"
                              >
                                <RotateCcw className="w-5 h-5" />
                              </button>
                            ) : (
                              <button
                                onClick={() => handleSetCompleted(exerciseIndex, setIndex, true, set.actualReps || set.reps, set.actualWeight)}
                                className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                              >
                                <CheckCircle className="w-5 h-5" />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  
                  <div className="flex justify-end mt-4">
                    <button
                      onClick={() => handleAddSetToActiveWorkout(exerciseIndex)}
                      className="flex items-center gap-1 text-sm text-[#4A90E2] hover:text-[#357ABD] transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      Add Set
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Exercise Button */}
      <div className="flex justify-center">
        <button
          onClick={() => setShowExerciseModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#E8F4FF] text-[#4A90E2] rounded-lg hover:bg-[#D1E8FF] transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Exercise
        </button>
      </div>

      <div className="flex justify-between pt-4">
        <button
          onClick={handleCancelWorkout}
          className="px-6 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          Cancel Workout
        </button>
        <div className="flex gap-2">
          <button
            onClick={handleSaveActiveWorkout}
            className="flex items-center gap-2 px-6 py-3 bg-[#E8F4FF] text-[#4A90E2] rounded-lg hover:bg-[#D1E8FF] transition-colors"
          >
            <Save className="w-5 h-5" />
            Save as Template
          </button>
          <button
            onClick={handleCompleteWorkout}
            className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <CheckCircle className="w-5 h-5" />
            Complete Workout
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ActiveWorkoutTab;
```

### src/components/workout/modals/QuickChatModal.jsx

```jsx
// src/components/workout/modals/QuickChatModal.jsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, ChevronDown, Clock, Info, X } from 'lucide-react';

const QuickChatModal = ({ 
  showChatModal, 
  setShowChatModal, 
  workoutSelectOpen, 
  setWorkoutSelectOpen, 
  selectedWorkoutForChat, 
  setSelectedWorkoutForChat, 
  quickMessage, 
  setQuickMessage, 
  handleChatWithMax, 
  activeWorkout, 
  workoutHistory, 
  formatTime, 
  elapsedTime 
}) => {
  return (
    <AnimatePresence>
      {showChatModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        >
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.95 }}
            className="bg-white rounded-2xl overflow-hidden shadow-xl max-w-lg w-full"
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <MessageSquare className="w-6 h-6 text-[#4A90E2]" />
                <h3 className="text-xl font-semibold text-gray-800">Ask Max</h3>
              </div>
              
              {/* Workout Selection */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Share a workout (optional):
                </label>
                <div className="relative">
                  <button
                    onClick={() => setWorkoutSelectOpen(!workoutSelectOpen)}
                    className="w-full p-3 text-left border border-gray-300 rounded-lg flex justify-between items-center hover:border-[#4A90E2] transition-colors"
                  >
                    <span className="text-gray-700">
                      {selectedWorkoutForChat ? selectedWorkoutForChat.name : 'Select a workout'}
                    </span>
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  </button>
                  
                  {/* Workout Dropdown */}
                  <AnimatePresence>
                    {workoutSelectOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto"
                      >
                        <div className="p-2">
                          <button
                            className="w-full p-2 text-left hover:bg-gray-50 rounded-md text-gray-500 text-sm"
                            onClick={() => {
                              setSelectedWorkoutForChat(null);
                              setWorkoutSelectOpen(false);
                            }}
                          >
                            No workout
                          </button>
                          
                          {/* Active Workout Option */}
                          {activeWorkout && (
                            <button
                              className="w-full p-2 text-left hover:bg-gray-50 rounded-md flex items-center justify-between"
                              onClick={() => {
                                setSelectedWorkoutForChat(activeWorkout);
                                setWorkoutSelectOpen(false);
                              }}
                            >
                              <div>
                              <div className="font-medium text-gray-800">{activeWorkout.name}</div>
                                <div className="text-xs text-green-600">Current Workout</div>
                              </div>
                              <div className="text-xs text-gray-500">
                                {formatTime(elapsedTime)}
                              </div>
                            </button>
                          )}
                          
                          {/* History Options */}
                          <div className="text-xs text-gray-500 mt-2 mb-1 px-2">History</div>
                          {workoutHistory.length === 0 ? (
                            <div className="text-sm text-gray-500 p-2">No workout history</div>
                          ) : (
                            workoutHistory.map((workout, index) => {
                              const startDate = new Date(workout.startTime);
                              return (
                                <button
                                  key={index}
                                  className="w-full p-2 text-left hover:bg-gray-50 rounded-md flex items-center justify-between"
                                  onClick={() => {
                                    setSelectedWorkoutForChat(workout);
                                    setWorkoutSelectOpen(false);
                                  }}
                                >
                                  <div>
                                    <div className="font-medium text-gray-800">{workout.name}</div>
                                    <div className="text-xs text-gray-500">
                                      {startDate.toLocaleDateString()} at {startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    {formatTime(workout.duration)}
                                  </div>
                                </button>
                              );
                            })
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                
                {/* Preview Selected Workout */}
                <AnimatePresence>
                  {selectedWorkoutForChat && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-2 border border-gray-200 rounded-lg overflow-hidden"
                    >
                      <div className="bg-gray-50 p-3 border-b border-gray-200 flex justify-between items-center">
                        <div className="font-medium text-gray-800">{selectedWorkoutForChat.name}</div>
                        <button
                          onClick={() => setSelectedWorkoutForChat(null)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="p-3 text-sm">
                        <div className="text-gray-500 flex items-center gap-2 mb-2">
                          <Clock className="w-4 h-4" />
                          <span>{formatTime(selectedWorkoutForChat.duration)}</span>
                        </div>
                        <div className="space-y-1">
                          {selectedWorkoutForChat.exercises.map((exercise, i) => {
                            const completedSets = exercise.sets.filter(set => set.completed).length;
                            return (
                              <div key={i} className="text-gray-700">
                                {exercise.name} ({completedSets}/{exercise.sets.length} sets)
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              <textarea
                value={quickMessage}
                onChange={(e) => setQuickMessage(e.target.value)}
                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A90E2] focus:border-transparent h-32"
                placeholder={selectedWorkoutForChat 
                  ? "Ask about this workout..." 
                  : "Ask a question about your workout or fitness journey..."}
              />
              
              <div className="mt-4 text-sm text-gray-600">
                <span className="flex items-center gap-2">
                  <Info className="w-4 h-4" />
                  Quick questions Max can help with:
                </span>
                <ul className="ml-6 mt-2 list-disc space-y-1">
                  <li>How can I improve my {selectedWorkoutForChat ? selectedWorkoutForChat.name : "workout"} routine?</li>
                  <li>What's the right form for {selectedWorkoutForChat && selectedWorkoutForChat.exercises.length > 0 
                    ? selectedWorkoutForChat.exercises[0].name 
                    : "bench press"}?</li>
                  <li>How can I progress with this routine?</li>
                </ul>
              </div>
            </div>
            
            <div className="p-6 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowChatModal(false);
                  setSelectedWorkoutForChat(null);
                  setQuickMessage("");
                }}
                className="px-6 py-3 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleChatWithMax}
                className="px-6 py-3 bg-[#4A90E2] text-white rounded-lg hover:bg-[#357ABD] transition-colors"
                disabled={!quickMessage.trim() && !selectedWorkoutForChat}
              >
                Chat with Max
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default QuickChatModal;
```

### src/components/workout/modals/ExerciseSelectionModal.jsx

```jsx
// src/components/workout/modals/ExerciseSelectionModal.jsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Dumbbell } from 'lucide-react';

const ExerciseSelectionModal = ({ 
  showExerciseModal, 
  setShowExerciseModal, 
  selectedCategory, 
  setSelectedCategory, 
  handleAddExercise, 
  EXERCISE_DATABASE 
}) => {
  return (
    <AnimatePresence>
      {showExerciseModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        >
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.95 }}
            className="bg-white rounded-2xl overflow-hidden shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col"
          >
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-xl font-semibold text-gray-800">Add Exercise</h3>
              <button
                onClick={() => setShowExerciseModal(false)}
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 border-b border-gray-200">
              <div className="flex flex-wrap gap-2">
                {Object.keys(EXERCISE_DATABASE).map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category === selectedCategory ? null : category)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      category === selectedCategory
                        ? 'bg-[#4A90E2] text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-4">
                {selectedCategory ? (
                  EXERCISE_DATABASE[selectedCategory].map((exercise, index) => (
                    <div
                      key={index}
                      className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => handleAddExercise(exercise)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold text-gray-800">{exercise.name}</h4>
                          <p className="text-sm text-gray-600 mt-1">
                            Target: {exercise.muscleGroups.join(', ')}
                          </p>
                        </div>
                        <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                          {exercise.difficulty}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs px-2 py-1 bg-[#E8F4FF] text-[#4A90E2] rounded-full">
                          {exercise.equipment.join(', ')}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-600">Select a muscle group to view exercises</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ExerciseSelectionModal;
```

### src/pages/WorkoutPage.jsx

```jsx
// In src/pages/WorkoutPage.jsx, adjust imports to:
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/workout/Header';
import TabNavigation from '../components/workout/TabNavigation';
import MyWorkoutsTab from '../components/workout/tabs/MyWorkoutsTab';
import CreateWorkoutTab from '../components/workout/tabs/CreateWorkoutTab';
import HistoryTab from '../components/workout/tabs/HistoryTab';
import ActiveWorkoutTab from '../components/workout/tabs/ActiveWorkoutTab.jsx';
import ExerciseSelectionModal from '../components/workout/modals/ExerciseSelectionModal';
import QuickChatModal from '../components/workout/modals/QuickChatModal';

// Import the exercise database
import { EXERCISE_DATABASE } from '../data/exercises';

const WorkoutPage = () => {
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState(null);
  const [workouts, setWorkouts] = useState([]);
  const [activeWorkout, setActiveWorkout] = useState(null);
  const [workoutHistory, setWorkoutHistory] = useState([]);
  const [currentTab, setCurrentTab] = useState("my-workouts");
  const [stopwatchRunning, setStopwatchRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const stopwatchInterval = useRef(null);
  const [showExerciseModal, setShowExerciseModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showChatModal, setShowChatModal] = useState(false);
  const [quickMessage, setQuickMessage] = useState("");
  const [selectedWorkoutForChat, setSelectedWorkoutForChat] = useState(null);
  const [workoutSelectOpen, setWorkoutSelectOpen] = useState(false);
  const [weightUnit, setWeightUnit] = useState('lbs');
  const [isAddingSet, setIsAddingSet] = useState(false);

  // New workout form state
  const [newWorkout, setNewWorkout] = useState({
    name: "",
    exercises: [],
    description: ""
  });

  // Load user profile and workouts from localStorage
  useEffect(() => {
    const storedProfile = localStorage.getItem('userProfile');
    if (storedProfile) {
      setUserProfile(JSON.parse(storedProfile));
    }

    const storedWorkouts = localStorage.getItem(`workouts_${JSON.parse(storedProfile)?.id}`);
    if (storedWorkouts) {
      setWorkouts(JSON.parse(storedWorkouts));
    }

    const storedHistory = localStorage.getItem(`workout_history_${JSON.parse(storedProfile)?.id}`);
    if (storedHistory) {
      setWorkoutHistory(JSON.parse(storedHistory));
    }
  }, []);

  // Save workouts when they change
  useEffect(() => {
    if (userProfile && workouts.length > 0) {
      localStorage.setItem(`workouts_${userProfile.id}`, JSON.stringify(workouts));
    }
  }, [workouts, userProfile]);

  // Save workout history when it changes
  useEffect(() => {
    if (userProfile && workoutHistory.length > 0) {
      localStorage.setItem(`workout_history_${userProfile.id}`, JSON.stringify(workoutHistory));
    }
  }, [workoutHistory, userProfile]);

  // Stopwatch functionality
  useEffect(() => {
    if (stopwatchRunning) {
      stopwatchInterval.current = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(stopwatchInterval.current);
    }

    return () => clearInterval(stopwatchInterval.current);
  }, [stopwatchRunning]);

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Format workout data to a readable string for Max
  const formatWorkoutForAI = (workout) => {
    if (!workout) return "";
    
    const startDate = new Date(workout.startTime);
    let formattedData = `Workout: ${workout.name}\n`;
    formattedData += `Date: ${startDate.toLocaleDateString()} at ${startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}\n`;
    formattedData += `Duration: ${formatTime(workout.duration)}\n\n`;
    
    workout.exercises.forEach((exercise, index) => {
      const completedSets = exercise.sets.filter(set => set.completed).length;
      formattedData += `Exercise ${index + 1}: ${exercise.name} (${completedSets}/${exercise.sets.length} sets completed)\n`;
      
      exercise.sets.forEach((set, setIndex) => {
        const setType = set.type !== 'normal' ? ` (${set.type})` : '';
        if (set.completed) {
          formattedData += `  Set ${setIndex + 1}${setType}: ${set.actualWeight}${weightUnit} × ${set.actualReps} reps\n`;
        } else {
          formattedData += `  Set ${setIndex + 1}${setType}: ${set.weight}${weightUnit} × ${set.reps} reps (not completed)\n`;
        }
      });
      formattedData += '\n';
    });
    
    return formattedData;
  };

  // Quick Start Workout functionality
  const handleQuickStartWorkout = () => {
    // Create an empty workout with today's date
    const today = new Date();
    const formattedDate = today.toLocaleDateString();
    
    const emptyWorkout = {
      id: Date.now().toString(),
      name: `Workout - ${formattedDate}`,
      exercises: [],
      description: "",
      startTime: today.toISOString(),
      isCompleted: false
    };
    
    // Set as active workout and start timer
    setActiveWorkout(emptyWorkout);
    setCurrentTab("active");
    setStopwatchRunning(true);
    setElapsedTime(0);
  };

  const handleStartWorkout = (workout) => {
    // Create a copy with additional tracking fields
    const workoutWithTracking = {
      ...workout,
      exercises: workout.exercises.map(exercise => ({
        ...exercise,
        sets: exercise.sets.map(set => ({
          ...set,
          completed: false,
          actualReps: 0,
          actualWeight: set.weight
        }))
      })),
      startTime: new Date().toISOString(),
      isCompleted: false
    };
    
    setActiveWorkout(workoutWithTracking);
    setCurrentTab("active");
    setStopwatchRunning(true);
    setElapsedTime(0);
  };

  const handleCompleteWorkout = () => {
    // Create a history entry
    const completedWorkout = {
      ...activeWorkout,
      endTime: new Date().toISOString(),
      duration: elapsedTime,
      isCompleted: true
    };
    
    setWorkoutHistory(prev => [completedWorkout, ...prev]);
    setActiveWorkout(null);
    setStopwatchRunning(false);
    setCurrentTab("my-workouts");
  };

  const handleCancelWorkout = () => {
    if (confirm("Are you sure you want to cancel this workout? Progress will not be saved.")) {
      setActiveWorkout(null);
      setStopwatchRunning(false);
      setCurrentTab("my-workouts");
    }
  };

  const handleSetCompleted = (exerciseIndex, setIndex, completed, actualReps, actualWeight) => {
    setActiveWorkout(prev => {
      const newWorkout = { ...prev };
      newWorkout.exercises[exerciseIndex].sets[setIndex].completed = completed;
      newWorkout.exercises[exerciseIndex].sets[setIndex].actualReps = actualReps;
      newWorkout.exercises[exerciseIndex].sets[setIndex].actualWeight = actualWeight;
      return newWorkout;
    });
  };

  const handleAddExercise = (exercise) => {
    setNewWorkout(prev => ({
      ...prev,
      exercises: [...prev.exercises, {
        name: exercise.name,
        sets: [{ reps: 10, weight: 0, type: 'normal' }],
        notes: "",
        equipment: exercise.equipment,
        muscleGroups: exercise.muscleGroups
      }]
    }));
    setShowExerciseModal(false);
  };

  const handleAddExerciseToActiveWorkout = (exercise) => {
    setActiveWorkout(prev => {
      if (!prev) return prev;
      
      return {
        ...prev,
        exercises: [...prev.exercises, {
          name: exercise.name,
          sets: [{ 
            reps: 10, 
            weight: 0, 
            type: 'normal',
            completed: false,
            actualReps: 0,
            actualWeight: 0
          }],
          notes: "",
          equipment: exercise.equipment,
          muscleGroups: exercise.muscleGroups
        }]
      };
    });
    setShowExerciseModal(false);
  };

  const handleRemoveExercise = (index) => {
    setNewWorkout(prev => ({
      ...prev,
      exercises: prev.exercises.filter((_, i) => i !== index)
    }));
  };

  const handleAddSet = (exerciseIndex) => {
    if (isAddingSet) return; // Prevent multiple rapid clicks
    
    setIsAddingSet(true);
    
    setNewWorkout(prev => {
      const newExercises = [...prev.exercises];
      const lastSet = newExercises[exerciseIndex].sets[newExercises[exerciseIndex].sets.length - 1];
      newExercises[exerciseIndex].sets.push({
        reps: lastSet.reps,
        weight: lastSet.weight,
        type: lastSet.type
      });
      return { ...prev, exercises: newExercises };
    });
    
    // Reset the flag after a short delay
    setTimeout(() => {
      setIsAddingSet(false);
    }, 300);
  };

  const handleAddSetToActiveWorkout = (exerciseIndex) => {
    if (isAddingSet) return; 
    
    setIsAddingSet(true);
    
    setActiveWorkout(prev => {
      const newExercises = [...prev.exercises];
      const lastSet = newExercises[exerciseIndex].sets[newExercises[exerciseIndex].sets.length - 1];
      newExercises[exerciseIndex].sets.push({
        reps: lastSet.reps,
        weight: lastSet.weight,
        type: lastSet.type,
        completed: false,
        actualReps: 0,
        actualWeight: lastSet.weight
      });
      return { ...prev, exercises: newExercises };
    });
    
    setTimeout(() => {
      setIsAddingSet(false);
    }, 300);
  };

  const handleRemoveSet = (exerciseIndex, setIndex) => {
    setNewWorkout(prev => {
      const newExercises = [...prev.exercises];
      if (newExercises[exerciseIndex].sets.length > 1) {
        newExercises[exerciseIndex].sets = newExercises[exerciseIndex].sets.filter((_, i) => i !== setIndex);
      }
      return { ...prev, exercises: newExercises };
    });
  };

  const handleSetChange = (exerciseIndex, setIndex, field, value) => {
    setNewWorkout(prev => {
      const newExercises = [...prev.exercises];
      newExercises[exerciseIndex].sets[setIndex][field] = value;
      return { ...prev, exercises: newExercises };
    });
  };

  const handleSaveWorkout = () => {
    if (!newWorkout.name.trim()) {
      alert("Please give your workout a name");
      return;
    }
  
    if (newWorkout.exercises.length === 0) {
      alert("Please add at least one exercise to your workout");
      return;
    }
  
    const workoutToSave = {
      ...newWorkout,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
  
    // First update state
    const updatedWorkouts = [...workouts, workoutToSave];
    setWorkouts(updatedWorkouts);
    
    // Save to localStorage immediately to avoid race conditions
    if (userProfile) {
      localStorage.setItem(`workouts_${userProfile.id}`, JSON.stringify(updatedWorkouts));
    }
    
    // Reset form and switch tabs
    setNewWorkout({
      name: "",
      exercises: [],
      description: ""
    });
    setCurrentTab("my-workouts");
  };

  const handleSaveActiveWorkout = () => {
    if (!activeWorkout) return;
    
    // Create a template version of the active workout
    const workoutToSave = {
      name: activeWorkout.name,
      exercises: activeWorkout.exercises.map(exercise => ({
        name: exercise.name,
        sets: exercise.sets.map(set => ({
          reps: set.actualReps || set.reps,
          weight: set.actualWeight || set.weight,
          type: set.type
        })),
        notes: exercise.notes,
        equipment: exercise.equipment,
        muscleGroups: exercise.muscleGroups
      })),
      description: activeWorkout.description,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
  
    const updatedWorkouts = [...workouts, workoutToSave];
    setWorkouts(updatedWorkouts);
    
    // Save to localStorage
    if (userProfile) {
      localStorage.setItem(`workouts_${userProfile.id}`, JSON.stringify(updatedWorkouts));
    }
    
    // Show confirmation to user
    alert("Workout saved to your templates!");
  };

  const handleDeleteWorkout = (workoutId) => {
    if (confirm("Are you sure you want to delete this workout?")) {
      setWorkouts(prev => prev.filter(workout => workout.id !== workoutId));
    }
  };

  const handleChatWithMax = () => {
    // Prepare data to pass to the chat screen
    const chatData = {
      message: quickMessage.trim(),
      workout: selectedWorkoutForChat ? {
        name: selectedWorkoutForChat.name,
        date: new Date(selectedWorkoutForChat.startTime).toLocaleDateString(),
        time: new Date(selectedWorkoutForChat.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        duration: formatTime(selectedWorkoutForChat.duration),
        exercises: selectedWorkoutForChat.exercises.map(ex => ({
          name: ex.name,
          sets: ex.sets.length,
          completed: ex.sets.filter(set => set.completed).length
        }))
      } : null,
      workoutDetails: selectedWorkoutForChat ? formatWorkoutForAI(selectedWorkoutForChat) : ""
    };
    
    // Navigate to chat with this data
    navigate('/chat', { state: chatData });
    
    // Reset the modal state
    setShowChatModal(false);
    setSelectedWorkoutForChat(null);
    setQuickMessage("");
  };

  // If no profile exists, show redirect to profile creation
  if (!userProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#E6F3FF] to-[#D1E9FF] py-12 px-4 flex items-center justify-center">
        {/* Profile creation prompt component would go here */}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#E6F3FF] to-[#D1E9FF]">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <Header 
          userProfile={userProfile}
          setShowChatModal={setShowChatModal}
          weightUnit={weightUnit}
          setWeightUnit={setWeightUnit}
        />

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
          <TabNavigation 
            currentTab={currentTab}
            setCurrentTab={setCurrentTab}
            activeWorkout={activeWorkout}
          />

          {/* Tab Content */}
          <div className="p-6">
            {currentTab === "my-workouts" && (
              <MyWorkoutsTab 
                workouts={workouts}
                handleStartWorkout={handleStartWorkout}
                handleDeleteWorkout={handleDeleteWorkout}
                setCurrentTab={setCurrentTab}
                handleQuickStartWorkout={handleQuickStartWorkout}
              />
            )}

            {currentTab === "create" && (
              <CreateWorkoutTab 
                newWorkout={newWorkout}
                setNewWorkout={setNewWorkout}
                handleSaveWorkout={handleSaveWorkout}
                handleRemoveExercise={handleRemoveExercise}
                handleAddSet={handleAddSet}
                handleRemoveSet={handleRemoveSet}
                handleSetChange={handleSetChange}
                setShowExerciseModal={setShowExerciseModal}
                setCurrentTab={setCurrentTab}
                weightUnit={weightUnit}
              />
            )}

            {currentTab === "history" && (
              <HistoryTab 
                workoutHistory={workoutHistory}
                formatTime={formatTime}
                weightUnit={weightUnit}
                setCurrentTab={setCurrentTab}
                workouts={workouts}
              />
            )}

            {currentTab === "active" && activeWorkout && (
              <ActiveWorkoutTab 
                activeWorkout={activeWorkout}
                setActiveWorkout={setActiveWorkout}
                stopwatchRunning={stopwatchRunning}
                setStopwatchRunning={setStopwatchRunning}
                elapsedTime={elapsedTime}
                formatTime={formatTime}
                handleSetCompleted={handleSetCompleted}
                handleCancelWorkout={handleCancelWorkout}
                handleCompleteWorkout={handleCompleteWorkout}
                handleAddExerciseToActiveWorkout={handleAddExerciseToActiveWorkout}
                handleAddSetToActiveWorkout={handleAddSetToActiveWorkout}
                setShowExerciseModal={setShowExerciseModal}
                handleSaveActiveWorkout={handleSaveActiveWorkout}
                weightUnit={weightUnit}
              />
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <ExerciseSelectionModal 
        showExerciseModal={showExerciseModal}
        setShowExerciseModal={setShowExerciseModal}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        handleAddExercise={activeWorkout ? handleAddExerciseToActiveWorkout : handleAddExercise}
        EXERCISE_DATABASE={EXERCISE_DATABASE}
      />

      <QuickChatModal 
        showChatModal={showChatModal}
        setShowChatModal={setShowChatModal}
        workoutSelectOpen={workoutSelectOpen}
        setWorkoutSelectOpen={setWorkoutSelectOpen}
        selectedWorkoutForChat={selectedWorkoutForChat}
        setSelectedWorkoutForChat={setSelectedWorkoutForChat}
        quickMessage={quickMessage}
        setQuickMessage={setQuickMessage}
        handleChatWithMax={handleChatWithMax}
        activeWorkout={activeWorkout}
        workoutHistory={workoutHistory}
        formatTime={formatTime}
        elapsedTime={elapsedTime}
      />
    </div>
  );
};

export default WorkoutPage;
```
