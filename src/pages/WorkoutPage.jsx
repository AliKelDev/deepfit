// src/pages/WorkoutPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Dumbbell } from 'lucide-react';
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-8 shadow-xl max-w-md w-full text-center"
        >
          <div className="w-20 h-20 bg-[#E8F4FF] rounded-full mx-auto flex items-center justify-center mb-6">
            <Dumbbell className="w-12 h-12 text-[#4A90E2]" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Create Your Profile</h1>
          <p className="text-gray-600 mb-6">
            Before you can start training, you need to create an athlete profile. This helps Max personalize your workouts.
          </p>
          <button
            onClick={() => navigate('/profile')}
            className="px-6 py-3 bg-[#4A90E2] text-white rounded-lg font-medium hover:bg-[#357ABD] transition-colors shadow-md mx-auto"
          >
            Create Profile
          </button>
        </motion.div>
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
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6 w-full">
          <TabNavigation 
            currentTab={currentTab}
            setCurrentTab={setCurrentTab}
            activeWorkout={activeWorkout}
          />

          {/* Tab Content */}
          <div className="p-4 sm:p-6 w-full flex">
            <div className="w-full">
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