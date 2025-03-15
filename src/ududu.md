# Project Export

## Project Statistics

- Total files: 19

## Folder Structure

```
src
  WorkoutContext.jsx
  ProfileCreation.jsx
  main.jsx
  homepage.jsx
  pages
    WorkoutPage.jsx
    ProgressPage.jsx
  data
    exercises.js
  components
    NavigationMenu.jsx
    MobileAppInstallBanner.jsx
    workout
      TabNavigation.jsx
      Header.jsx
      tabs
        MyWorkoutsTab.jsx
        ActiveWorkoutTab.jsx
        CreateWorkoutTab.jsx
        HistoryTab.jsx
      modals
        ExerciseSelectionModal.jsx
        EditHistoryModal.jsx
        CustomExerciseModal.jsx
    progress
      ProgressDataContent.jsx

```

### src/WorkoutContext.jsx

```jsx
import React, { createContext, useState, useEffect, useContext } from 'react';

// Create context
const WorkoutContext = createContext();

// Custom hook to use the workout context
export const useWorkout = () => {
  const context = useContext(WorkoutContext);
  if (!context) {
    throw new Error('useWorkout must be used within a WorkoutProvider');
  }
  return context;
};

// Provider component
export const WorkoutProvider = ({ children }) => {
  const [workouts, setWorkouts] = useState([]);
  const [workoutHistory, setWorkoutHistory] = useState([]);
  const [activeWorkout, setActiveWorkout] = useState(null);
  const [userProfile, setUserProfile] = useState(null);

  // Load data from localStorage on initial render
  useEffect(() => {
    const storedProfile = localStorage.getItem('userProfile');
    if (storedProfile) {
      setUserProfile(JSON.parse(storedProfile));
    }
    
    // Only load workouts if a profile exists
    if (storedProfile) {
      const profileId = JSON.parse(storedProfile).id;
      
      const storedWorkouts = localStorage.getItem(`workouts_${profileId}`);
      if (storedWorkouts) {
        setWorkouts(JSON.parse(storedWorkouts));
      }
      
      const storedHistory = localStorage.getItem(`workout_history_${profileId}`);
      if (storedHistory) {
        setWorkoutHistory(JSON.parse(storedHistory));
      }
      
      const storedActiveWorkout = localStorage.getItem(`active_workout_${profileId}`);
      if (storedActiveWorkout) {
        setActiveWorkout(JSON.parse(storedActiveWorkout));
      }
    }
  }, []);

  // Listen for profile changes
  useEffect(() => {
    const handleProfileChange = () => {
      const storedProfile = localStorage.getItem('userProfile');
      if (storedProfile) {
        setUserProfile(JSON.parse(storedProfile));
      } else {
        setUserProfile(null);
      }
    };

    window.addEventListener('storage', handleProfileChange);
    return () => window.removeEventListener('storage', handleProfileChange);
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

  // Save active workout when it changes
  useEffect(() => {
    if (userProfile) {
      if (activeWorkout) {
        localStorage.setItem(`active_workout_${userProfile.id}`, JSON.stringify(activeWorkout));
      } else {
        localStorage.removeItem(`active_workout_${userProfile.id}`);
      }
    }
  }, [activeWorkout, userProfile]);

  // Create a new workout
  const createWorkout = (workout) => {
    const newWorkout = {
      ...workout,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    
    setWorkouts(prev => [...prev, newWorkout]);
    return newWorkout;
  };

  // Update an existing workout
  const updateWorkout = (id, updatedData) => {
    setWorkouts(prev => 
      prev.map(workout => workout.id === id ? { ...workout, ...updatedData } : workout)
    );
  };

  // Delete a workout
  const deleteWorkout = (id) => {
    setWorkouts(prev => prev.filter(workout => workout.id !== id));
  };

  // Start a workout session
  const startWorkout = (workoutId) => {
    const workout = workouts.find(w => w.id === workoutId);
    if (!workout) return null;
    
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
    return workoutWithTracking;
  };

  // Complete a workout session
  const completeWorkout = () => {
    if (!activeWorkout) return;
    
    const completedWorkout = {
      ...activeWorkout,
      endTime: new Date().toISOString(),
      duration: (new Date() - new Date(activeWorkout.startTime)) / 1000,
      isCompleted: true
    };
    
    setWorkoutHistory(prev => [completedWorkout, ...prev]);
    setActiveWorkout(null);
    
    return completedWorkout;
  };

  // Update set data during an active workout
  const updateWorkoutSet = (exerciseIndex, setIndex, data) => {
    if (!activeWorkout) return;
    
    setActiveWorkout(prev => {
      const updatedWorkout = { ...prev };
      const updatedSet = { 
        ...updatedWorkout.exercises[exerciseIndex].sets[setIndex],
        ...data
      };
      
      updatedWorkout.exercises[exerciseIndex].sets[setIndex] = updatedSet;
      return updatedWorkout;
    });
  };

  return (
    <WorkoutContext.Provider
      value={{
        workouts,
        workoutHistory,
        activeWorkout,
        userProfile,
        createWorkout,
        updateWorkout,
        deleteWorkout,
        startWorkout,
        completeWorkout,
        updateWorkoutSet,
        setActiveWorkout
      }}
    >
      {children}
    </WorkoutContext.Provider>
  );
};
```

### src/ProfileCreation.jsx

```jsx
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Dumbbell, 
  Save, 
  AlertCircle, 
  MessageSquare, 
  Plus, 
  Edit, 
  Trash2, 
  UserCircle,
  Camera,
  X,
  BarChart2,
  Ruler,
  Scale,
  Percent,
  ChevronRight,
  Calendar,
  LineChart,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FITNESS_LEVELS = [
  { level: "Beginner", value: "1", description: "Just starting your fitness journey. Learning basic exercises and form." },
  { level: "Novice", value: "2", description: "Familiar with basic exercises. Building consistency in workouts." },
  { level: "Intermediate", value: "3", description: "Regular workout routine. Good form on compound exercises." },
  { level: "Advanced Intermediate", value: "4", description: "Solid strength base. Experienced with various training methods." },
  { level: "Advanced", value: "5", description: "Extensive training experience. Strong technical proficiency." },
  { level: "Semi-Professional", value: "6", description: "Near professional level. Deep understanding of training principles." },
  { level: "Professional Athlete", value: "7", description: "Professional level athlete. Expert in sports performance." }
];

const AVAILABLE_EQUIPMENT = [
  { name: "Dumbbells", icon: "🏋️", category: "Free Weights" },
  { name: "Barbell", icon: "🏋️‍♂️", category: "Free Weights" },
  { name: "Kettlebell", icon: "💪", category: "Free Weights" },
  { name: "Resistance Bands", icon: "🎽", category: "Accessories" },
  { name: "Yoga Mat", icon: "🧘‍♂️", category: "Basics" },
  { name: "Pull-up Bar", icon: "🔝", category: "Bodyweight" },
  { name: "Bench", icon: "💺", category: "Equipment" },
  { name: "Squat Rack", icon: "🏋️‍♀️", category: "Equipment" },
  { name: "Treadmill", icon: "🏃‍♂️", category: "Cardio" },
  { name: "Exercise Bike", icon: "🚲", category: "Cardio" },
  { name: "Rowing Machine", icon: "🚣‍♂️", category: "Cardio" },
  { name: "Jump Rope", icon: "⭕", category: "Cardio" },
  { name: "Foam Roller", icon: "🔄", category: "Recovery" },
  { name: "Medicine Ball", icon: "⚪", category: "Functional" },
  { name: "TRX/Suspension", icon: "🪢", category: "Functional" },
  { name: "Box/Platform", icon: "📦", category: "Plyometrics" }
];

const PHYSICAL_LIMITATIONS = [
  "Lower Back Issues", "Knee Problems", "Shoulder Injury", "Limited Mobility",
  "Joint Pain", "Arthritis", "Recent Surgery", "Cardiovascular Condition",
  "Balance Issues", "Limited Flexibility", "Wrist Problems", "Hip Issues"
];

const HEIGHT_UNITS = ["cm", "ft/in"];
const WEIGHT_UNITS = ["kg", "lbs"];

const DEFAULT_AVATAR = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Ccircle cx='20' cy='20' r='20' fill='%234A90E2'/%3E%3Cpath d='M20 21C23.3137 21 26 18.3137 26 15C26 11.6863 23.3137 9 20 9C16.6863 9 14 11.6863 14 15C14 18.3137 16.6863 21 20 21ZM20 23C14.4772 23 10 27.4772 10 33H30C30 27.4772 25.5228 23 20 23Z' fill='white'/%3E%3C/svg%3E";

// Image processing utilities
const createThumbnail = (imageUrl, maxWidth = 100, maxHeight = 100) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = imageUrl;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }

      canvas.width = width;
      canvas.height = height;

      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/jpeg', 0.7));
    };
  });
};

// Helper function to convert height between units
const convertHeight = (value, fromUnit, toUnit) => {
  if (fromUnit === toUnit) return value;
  
  if (fromUnit === "cm" && toUnit === "ft/in") {
    const totalInches = value / 2.54;
    const feet = Math.floor(totalInches / 12);
    const inches = Math.round(totalInches % 12);
    return { feet, inches };
  }
  
  if (fromUnit === "ft/in" && toUnit === "cm") {
    return Math.round((value.feet * 12 + value.inches) * 2.54);
  }
  
  return value;
};

// Helper function to convert weight between units
const convertWeight = (value, fromUnit, toUnit) => {
  if (fromUnit === toUnit) return value;
  
  if (fromUnit === "kg" && toUnit === "lbs") {
    return Math.round(value * 2.20462);
  }
  
  if (fromUnit === "lbs" && toUnit === "kg") {
    return Math.round(value / 2.20462 * 10) / 10;
  }
  
  return value;
};

// Simple trend visualization component
const MeasurementTrend = ({ history, label, color = '#4A90E2' }) => {
  if (!history || history.length < 2) return null;
  
  const sortedHistory = [...history].sort((a, b) => new Date(a.date) - new Date(b.date));
  const maxValue = Math.max(...sortedHistory.map(entry => parseFloat(entry.value)));
  const minValue = Math.min(...sortedHistory.map(entry => parseFloat(entry.value)));
  const range = maxValue - minValue;
  const padding = range * 0.1; // 10% padding
  
  const getY = (value) => {
    // Normalize to 0-100 range for percentage height
    if (range === 0) return 50; // If all values are the same
    return 100 - ((value - minValue + padding/2) / (range + padding) * 100);
  };
  
  const points = sortedHistory.map((entry, index) => {
    const x = (index / (sortedHistory.length - 1)) * 100;
    const y = getY(parseFloat(entry.value));
    return `${x},${y}`;
  }).join(' ');
  
  return (
    <div className="mt-2">
      <div className="text-sm font-medium text-gray-700 mb-1">{label} Trend</div>
      <div className="relative h-16 w-full bg-gray-50 border border-gray-100 rounded overflow-hidden">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full">
          <polyline
            points={points}
            fill="none"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <div className="absolute bottom-1 right-2 text-xs text-gray-500">
          {sortedHistory.length} entries
        </div>
      </div>
    </div>
  );
};

const ProfileManager = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  const [profiles, setProfiles] = useState([]);
  const [activeProfileId, setActiveProfileId] = useState(null);
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [profileToDelete, setProfileToDelete] = useState(null);
  const [editingProfile, setEditingProfile] = useState(null);
  const [imageError, setImageError] = useState("");
  const [activeFormTab, setActiveFormTab] = useState("basic");
  
  // Temporary values for measurements
  const [tempWeight, setTempWeight] = useState("");
  const [tempBodyFat, setTempBodyFat] = useState("");
  const [tempMeasurements, setTempMeasurements] = useState({
    chest: "",
    waist: "",
    hips: "",
    thighs: "",
    arms: ""
  });
  
  // States for showing/hiding measurement history sections
  const [showWeightHistory, setShowWeightHistory] = useState(false);
  const [showBodyFatHistory, setShowBodyFatHistory] = useState(false);
  const [showMeasurementHistory, setShowMeasurementHistory] = useState({
    chest: false,
    waist: false,
    hips: false,
    thighs: false,
    arms: false
  });
  
  const [formData, setFormData] = useState({
    id: null,
    name: "",
    age: "",
    physicalLimitations: [],
    otherLimitations: "",
    fitnessLevel: "",
    equipment: [],
    description: "",
    profileImage: DEFAULT_AVATAR,
    profileThumbnail: DEFAULT_AVATAR,
    // Height and weight fields
    heightUnit: "cm",
    height: "",
    heightFeet: "",
    heightInches: "",
    weightUnit: "kg",
    weight: "",
    // Body composition fields
    bodyFat: "",
    bodyFatHistory: [],
    bodyMeasurements: {
      chest: "",
      waist: "",
      hips: "",
      thighs: "",
      arms: ""
    },
    measurementHistory: {
      chest: [],
      waist: [],
      hips: [],
      thighs: [],
      arms: []
    },
    weightHistory: []
  });

  const [showLevelDescription, setShowLevelDescription] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [error, setError] = useState("");
  const [previewImage, setPreviewImage] = useState(null);

  // Load saved profiles on mount
  useEffect(() => {
    const savedProfiles = localStorage.getItem('userProfiles');
    const savedActiveId = localStorage.getItem('activeProfileId');
    if (savedProfiles) {
      setProfiles(JSON.parse(savedProfiles));
      if (savedActiveId) {
        setActiveProfileId(savedActiveId);
      }
    }
  }, []);

  // Save profiles whenever they change
  useEffect(() => {
    if (profiles.length > 0) {
      localStorage.setItem('userProfiles', JSON.stringify(profiles));
    }
  }, [profiles]);

  // Save active profile whenever it changes
  useEffect(() => {
    if (activeProfileId) {
      localStorage.setItem('activeProfileId', activeProfileId);
      const activeProfile = profiles.find(p => p.id === activeProfileId);
      if (activeProfile) {
        localStorage.setItem('userProfile', JSON.stringify(activeProfile));
      }
    }
  }, [activeProfileId, profiles]);

  // Set temporary values when editing a profile
  useEffect(() => {
    if (editingProfile) {
      setTempWeight(editingProfile.weight || "");
      setTempBodyFat(editingProfile.bodyFat || "");
      
      // Initialize temp measurements
      const measurements = editingProfile.bodyMeasurements || {
        chest: "",
        waist: "",
        hips: "",
        thighs: "",
        arms: ""
      };
      
      setTempMeasurements({
        chest: measurements.chest || "",
        waist: measurements.waist || "",
        hips: measurements.hips || "",
        thighs: measurements.thighs || "",
        arms: measurements.arms || ""
      });
    } else {
      setTempWeight("");
      setTempBodyFat("");
      setTempMeasurements({
        chest: "",
        waist: "",
        hips: "",
        thighs: "",
        arms: ""
      });
    }
  }, [editingProfile]);

  const handleCreateProfile = () => {
    setFormData({
      id: null,
      name: "",
      age: "",
      physicalLimitations: [],
      otherLimitations: "",
      fitnessLevel: "",
      equipment: [],
      description: "",
      profileImage: DEFAULT_AVATAR,
      profileThumbnail: DEFAULT_AVATAR,
      heightUnit: "cm",
      height: "",
      heightFeet: "",
      heightInches: "",
      weightUnit: "kg",
      weight: "",
      bodyFat: "",
      bodyFatHistory: [],
      bodyMeasurements: {
        chest: "",
        waist: "",
        hips: "",
        thighs: "",
        arms: ""
      },
      measurementHistory: {
        chest: [],
        waist: [],
        hips: [],
        thighs: [],
        arms: []
      },
      weightHistory: []
    });
    
    // Reset temporary values
    setTempWeight("");
    setTempBodyFat("");
    setTempMeasurements({
      chest: "",
      waist: "",
      hips: "",
      thighs: "",
      arms: ""
    });
    
    setPreviewImage(null);
    setEditingProfile(null);
    setShowProfileForm(true);
    setActiveFormTab("basic");
  };

  const handleEditProfile = (profile) => {
    // Initialize body composition data with defaults if they don't exist
    const bodyCompData = {
      heightUnit: "cm",
      height: "",
      heightFeet: "",
      heightInches: "",
      weightUnit: "kg",
      weight: "",
      bodyFat: "",
      bodyFatHistory: [],
      bodyMeasurements: {
        chest: "",
        waist: "",
        hips: "",
        thighs: "",
        arms: ""
      },
      measurementHistory: {
        chest: [],
        waist: [],
        hips: [],
        thighs: [],
        arms: []
      },
      weightHistory: []
    };

    // Merge the existing profile with default body comp data
    const enhancedProfile = {
      ...profile,
      physicalLimitations: profile.physicalLimitations || [],
      equipment: profile.equipment || [],
      ...bodyCompData,
      // Override with any existing body comp data from the profile
      ...(profile.heightUnit && { heightUnit: profile.heightUnit }),
      ...(profile.height && { height: profile.height }),
      ...(profile.heightFeet && { heightFeet: profile.heightFeet }),
      ...(profile.heightInches && { heightInches: profile.heightInches }),
      ...(profile.weightUnit && { weightUnit: profile.weightUnit }),
      ...(profile.weight && { weight: profile.weight }),
      ...(profile.bodyFat && { bodyFat: profile.bodyFat }),
      ...(profile.bodyFatHistory && { bodyFatHistory: profile.bodyFatHistory || [] }),
      ...(profile.bodyMeasurements && { bodyMeasurements: profile.bodyMeasurements }),
      ...(profile.measurementHistory && { measurementHistory: profile.measurementHistory || {
        chest: [],
        waist: [],
        hips: [],
        thighs: [],
        arms: []
      }}),
      ...(profile.weightHistory && { weightHistory: profile.weightHistory || [] })
    };

    setFormData(enhancedProfile);
    setPreviewImage(profile.profileImage);
    setEditingProfile(profile);
    setShowProfileForm(true);
    setActiveFormTab("basic");
  };

  const handleDeleteProfile = (profile) => {
    setProfileToDelete(profile);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteProfile = () => {
    setProfiles(prev => prev.filter(p => p.id !== profileToDelete.id));
    if (activeProfileId === profileToDelete.id) {
      setActiveProfileId(null);
      localStorage.removeItem('userProfile');
    }
    setShowDeleteConfirm(false);
    setProfileToDelete(null);
  };

  const handleImageSelect = async (e) => {
    const file = e.target.files[0];
    setImageError("");
    
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setImageError("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      setImageError("Image size should be less than 5MB");
      return;
    }

    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const fullImage = e.target.result;
        const thumbnail = await createThumbnail(fullImage);
        
        setFormData(prev => ({
          ...prev,
          profileImage: fullImage,
          profileThumbnail: thumbnail
        }));
        
        setPreviewImage(fullImage);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      setImageError("Error processing image");
      console.error("Image processing error:", error);
    }
  };

  // Weight input and save functions
  const handleWeightInputChange = (value) => {
    setTempWeight(value);
  };
  
  const saveWeightToHistory = () => {
    if (!tempWeight || isNaN(parseFloat(tempWeight))) return;
    
    // Create a new weight history entry
    const newWeightEntry = {
      date: new Date().toISOString(),
      value: parseFloat(tempWeight) || 0,
      unit: formData.weightUnit
    };
    
    setFormData(prev => ({
      ...prev,
      weight: tempWeight,
      weightHistory: [...(prev.weightHistory || []), newWeightEntry]
    }));
  };

  // Body fat input and save functions
  const handleBodyFatInputChange = (value) => {
    setTempBodyFat(value);
  };
  
  const saveBodyFatToHistory = () => {
    if (!tempBodyFat || isNaN(parseFloat(tempBodyFat))) return;
    
    // Create a new body fat history entry
    const newBodyFatEntry = {
      date: new Date().toISOString(),
      value: parseFloat(tempBodyFat) || 0,
      unit: "%"
    };
    
    setFormData(prev => ({
      ...prev,
      bodyFat: tempBodyFat,
      bodyFatHistory: [...(prev.bodyFatHistory || []), newBodyFatEntry]
    }));
  };

  // Measurement input and save functions
  const handleMeasurementInputChange = (key, value) => {
    setTempMeasurements(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  const saveMeasurementToHistory = (key) => {
    if (!tempMeasurements[key] || isNaN(parseFloat(tempMeasurements[key]))) return;
    
    // Create a new measurement history entry
    const newMeasurementEntry = {
      date: new Date().toISOString(),
      value: parseFloat(tempMeasurements[key]) || 0,
      unit: "cm"
    };
    
    setFormData(prev => {
      // Update the current measurement value
      const updatedMeasurements = {
        ...prev.bodyMeasurements,
        [key]: tempMeasurements[key]
      };
      
      // Update the measurement history
      const updatedHistory = {
        ...prev.measurementHistory,
        [key]: [...(prev.measurementHistory[key] || []), newMeasurementEntry]
      };
      
      return {
        ...prev,
        bodyMeasurements: updatedMeasurements,
        measurementHistory: updatedHistory
      };
    });
  };

  const toggleHistoryVisibility = (type, key = null) => {
    if (type === 'weight') {
      setShowWeightHistory(prev => !prev);
    } else if (type === 'bodyFat') {
      setShowBodyFatHistory(prev => !prev);
    } else if (type === 'measurement' && key) {
      setShowMeasurementHistory(prev => ({
        ...prev,
        [key]: !prev[key]
      }));
    }
  };

  const handleWeightUnitChange = (unit) => {
    // Convert existing temp weight to the new unit
    if (tempWeight) {
      const currentWeight = parseFloat(tempWeight);
      const convertedWeight = convertWeight(currentWeight, formData.weightUnit, unit);
      
      setTempWeight(convertedWeight.toString());
      
      // Also convert the saved weight in formData
      if (formData.weight) {
        const savedWeight = parseFloat(formData.weight);
        const convertedSavedWeight = convertWeight(savedWeight, formData.weightUnit, unit);
        
        setFormData(prev => ({
          ...prev,
          weightUnit: unit,
          weight: convertedSavedWeight.toString()
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          weightUnit: unit
        }));
      }
      
      // Convert all weight history entries to the new unit
      if (formData.weightHistory && formData.weightHistory.length > 0) {
        const updatedHistory = formData.weightHistory.map(entry => {
          if (entry.unit === formData.weightUnit) {
            const convertedValue = convertWeight(entry.value, entry.unit, unit);
            return { ...entry, value: convertedValue, unit };
          }
          return entry;
        });
        
        setFormData(prev => ({
          ...prev,
          weightHistory: updatedHistory
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        weightUnit: unit
      }));
    }
  };

  const handleHeightUnitChange = (unit) => {
    // Convert existing height to the new unit if needed
    let updatedHeight = {};
    
    if (unit === "cm" && formData.heightUnit === "ft/in") {
      const feet = parseFloat(formData.heightFeet) || 0;
      const inches = parseFloat(formData.heightInches) || 0;
      const heightCm = convertHeight({ feet, inches }, "ft/in", "cm");
      updatedHeight = { height: heightCm.toString(), heightFeet: "", heightInches: "" };
    } 
    else if (unit === "ft/in" && formData.heightUnit === "cm") {
      const cm = parseFloat(formData.height) || 0;
      const { feet, inches } = convertHeight(cm, "cm", "ft/in");
      updatedHeight = { height: "", heightFeet: feet.toString(), heightInches: inches.toString() };
    }
    
    setFormData(prev => ({
      ...prev,
      heightUnit: unit,
      ...updatedHeight
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!formData.name || !formData.age || !formData.fitnessLevel) {
      setError("Please fill in all required fields (name, age, and fitness level)");
      return;
    }

    // Process height data based on the selected unit
    let finalHeightData = {};
    if (formData.heightUnit === "cm") {
      finalHeightData = {
        heightUnit: "cm",
        height: formData.height,
      };
    } else {
      finalHeightData = {
        heightUnit: "ft/in",
        heightFeet: formData.heightFeet,
        heightInches: formData.heightInches,
      };
    }

    const profileId = formData.id || Date.now().toString();
    const newProfile = { 
      ...formData, 
      ...finalHeightData,
      id: profileId,
      physicalLimitations: formData.physicalLimitations || [],
      equipment: formData.equipment || [],
      weightHistory: formData.weightHistory || [],
      bodyFatHistory: formData.bodyFatHistory || [],
      measurementHistory: formData.measurementHistory || {
        chest: [],
        waist: [],
        hips: [],
        thighs: [],
        arms: []
      }
    };

    setProfiles(prev => {
      const updatedProfiles = editingProfile
        ? prev.map(p => p.id === profileId ? newProfile : p)
        : [...prev, newProfile];
      return updatedProfiles;
    });

    setShowProfileForm(false);
    if (!activeProfileId) {
      setActiveProfileId(profileId);
    }
  };

  const handleSelectProfile = (profileId) => {
    setActiveProfileId(profileId);
  };

  const handleStartChat = () => {
    navigate('/chat');
  };

  const handleLimitationsChange = (limitation) => {
    setFormData(prev => ({
      ...prev,
      physicalLimitations: prev.physicalLimitations && prev.physicalLimitations.includes(limitation)
        ? prev.physicalLimitations.filter(r => r !== limitation)
        : [...(prev.physicalLimitations || []), limitation]
    }));
  };

  const handleEquipmentToggle = (equipment) => {
    setFormData(prev => ({
      ...prev,
      equipment: prev.equipment && prev.equipment.includes(equipment)
        ? prev.equipment.filter(a => a !== equipment)
        : [...(prev.equipment || []), equipment]
    }));
  };

  const renderHistoryEntries = (history, unit = "") => {
    if (!history || history.length === 0) {
      return <div className="text-sm text-gray-500 italic">No history entries yet</div>;
    }
    
    const sortedHistory = [...history].sort((a, b) => new Date(b.date) - new Date(a.date));
    
    return (
      <div className="max-h-32 overflow-y-auto mt-1">
        {sortedHistory.map((entry, index) => (
          <div key={index} className="text-sm text-gray-600 flex justify-between border-b border-gray-100 py-1">
            <span>{new Date(entry.date).toLocaleDateString()}</span>
            <span>{entry.value} {entry.unit || unit}</span>
          </div>
        ))}
      </div>
    );
  };

  const ProfileImage = ({ src, size = "large", editable = false }) => {
    const sizeClasses = {
      small: "w-10 h-10",
      medium: "w-16 h-16",
      large: "w-24 h-24"
    };

    return (
      <div className="relative inline-block">
        <div className={`${sizeClasses[size]} rounded-full overflow-hidden bg-gray-100 border-2 border-[#4A90E2]`}>
          <img
            src={src || DEFAULT_AVATAR}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>
        {editable && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              fileInputRef.current?.click();
            }}
            className="absolute bottom-0 right-0 p-1.5 bg-[#4A90E2] rounded-full text-white hover:bg-[#357ABD] transition-colors"
          >
            <Camera className="w-4 h-4" />
          </button>
        )}
      </div>
    );
  };

  // Measurement Input with History component
  const MeasurementInputWithHistory = ({ 
    label, 
    icon, 
    tempValue, 
    onTempChange, 
    onSave, 
    history, 
    unit = "cm", 
    showHistory, 
    onToggleHistory 
  }) => {
    return (
      <div className="space-y-2">
        <h3 className="font-medium text-gray-800 flex items-center gap-2">
          {icon}
          {label}
        </h3>
        
        <div className="flex gap-2 items-start">
          <div className="relative flex-1">
            <input
              type="number"
              value={tempValue}
              onChange={(e) => onTempChange(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A90E2] focus:border-transparent"
              placeholder={`${label} measurement`}
              min="0"
              step="0.1"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-gray-500">{unit}</span>
            </div>
          </div>
          <button
            type="button"
            onClick={onSave}
            className="px-4 py-3 bg-[#4A90E2] text-white rounded-lg hover:bg-[#357ABD] transition-colors flex items-center"
            disabled={!tempValue}
          >
            <Save className="w-5 h-5" />
          </button>
        </div>
        
        {history && history.length > 0 && (
          <div>
            <button
              type="button"
              onClick={onToggleHistory}
              className="flex items-center gap-2 text-sm text-[#4A90E2] font-medium mt-1"
            >
              {showHistory ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              {showHistory ? "Hide History" : "Show History"} ({history.length} entries)
            </button>
            
            {showHistory && (
              <div className="mt-2 bg-gray-50 p-2 rounded-lg">
                {renderHistoryEntries(history, unit)}
                <MeasurementTrend history={history} label={label} />
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#E8F4FF] to-[#D1E8FF] py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Profiles List */}
        {!showProfileForm && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-xl overflow-hidden"
          >
            <div className="bg-[#4A90E2] p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <UserCircle className="w-8 h-8" />
                  <h1 className="text-2xl font-bold">Athlete Profiles</h1>
                </div>
                <button
                  onClick={handleCreateProfile}
                  className="flex items-center gap-2 px-4 py-2 bg-white text-[#4A90E2] rounded-lg hover:bg-[#E8F4FF] transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  New Profile
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              {profiles.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-600 mb-4">No profiles created yet</p>
                  <button
                    onClick={handleCreateProfile}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#4A90E2] text-white rounded-lg hover:bg-[#357ABD] transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                    Create Your First Profile
                  </button>
                </div>
              ) : (
                <div className="grid gap-4">
                  {profiles.map((profile) => (
                    <div
                      key={profile.id}
                      className={`p-4 rounded-lg border ${
                        profile.id === activeProfileId
                          ? 'border-[#4A90E2] bg-[#E8F4FF]'
                          : 'border-gray-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <ProfileImage src={profile.profileThumbnail} size="medium" />
                          <div>
                            <div className="flex items-center gap-3">
                              <h3 className="text-lg font-semibold text-gray-800">
                                {profile.name}
                              </h3>
                              {profile.id === activeProfileId && (
                                <span className="px-2 py-1 text-xs bg-[#4A90E2] text-white rounded-full">
                                  Active
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mt-1">
                              {FITNESS_LEVELS.find(level => level.value === profile.fitnessLevel)?.level} Athlete
                              • Age {profile.age}
                              {profile.weight && ` • ${profile.weight} ${profile.weightUnit || 'kg'}`}
                            </p>
                            {profile.physicalLimitations && profile.physicalLimitations.length > 0 && (
                              <p className="text-sm text-gray-500 mt-1">
                                Limitations: {profile.physicalLimitations.join(', ')}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleSelectProfile(profile.id)}
                            className={`p-2 rounded-lg transition-colors ${
                              profile.id === activeProfileId
                                ? 'text-[#4A90E2] bg-white'
                                : 'text-gray-600 hover:bg-gray-100'
                            }`}
                          >
                            {profile.id === activeProfileId ? 'Selected' : 'Select'}
                          </button>
                          <button
                            onClick={() => handleEditProfile(profile)}
                            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            <Edit className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDeleteProfile(profile)}
                            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeProfileId && (
                <div className="flex justify-center mt-6">
                  <button
                    onClick={handleStartChat}
                    className="flex items-center gap-2 px-6 py-3 bg-[#4A90E2] text-white rounded-lg hover:bg-[#357ABD] transition-colors"
                  >
                    <MessageSquare className="w-5 h-5" />
                    Chat with Max
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Profile Form */}
        {showProfileForm && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-xl overflow-hidden"
          >
            <div className="bg-[#4A90E2] p-6 text-white">
              <div className="flex items-center gap-4">
                <Dumbbell className="w-8 h-8" />
                <h1 className="text-2xl font-bold">
                  {editingProfile ? 'Edit Profile' : 'Create New Profile'}
                </h1>
              </div>
            </div>

            {/* Form Tabs */}
            <div className="flex border-b border-gray-200">
              <button
                className={`flex-1 py-4 px-6 font-medium transition-colors ${
                  activeFormTab === "basic" ? "text-[#4A90E2] border-b-2 border-[#4A90E2]" : "text-gray-600 hover:bg-gray-50"
                }`}
                onClick={() => setActiveFormTab("basic")}
              >
                Basic Info
              </button>
              <button
                className={`flex-1 py-4 px-6 font-medium transition-colors ${
                  activeFormTab === "bodyComp" ? "text-[#4A90E2] border-b-2 border-[#4A90E2]" : "text-gray-600 hover:bg-gray-50"
                }`}
                onClick={() => setActiveFormTab("bodyComp")}
              >
                Body Composition
              </button>
              <button
                className={`flex-1 py-4 px-6 font-medium transition-colors ${
                  activeFormTab === "equipment" ? "text-[#4A90E2] border-b-2 border-[#4A90E2]" : "text-gray-600 hover:bg-gray-50"
                }`}
                onClick={() => setActiveFormTab("equipment")}
              >
                Equipment
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-8">
              {/* Basic Info Tab */}
              {activeFormTab === "basic" && (
                <div className="space-y-8">
                  {/* Profile Picture Section */}
                  <div className="flex flex-col items-center space-y-4">
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      onChange={handleImageSelect}
                      className="hidden"
                    />
                    
                    <ProfileImage 
                      src={previewImage || formData.profileImage} 
                      size="large"
                      editable={true}
                    />
                    
                    {imageError && (
                      <p className="text-red-500 text-sm">{imageError}</p>
                    )}
                    
                    <p className="text-sm text-gray-500">
                      Click the camera icon to upload a profile picture
                    </p>
                  </div>

                  {/* Basic Info Section */}
                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold text-gray-800">Basic Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Name</label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                          className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A90E2] focus:border-transparent"
                          placeholder="Enter your name"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Age</label>
                        <input
                          type="number"
                          value={formData.age}
                          onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
                          className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A90E2] focus:border-transparent"
                          placeholder="Enter your age"
                          min="1"
                          max="120"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Fitness Level Section */}
                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold text-gray-800">Fitness Experience</h2>
                    <div className="relative">
                      <select
                        value={formData.fitnessLevel}
                        onChange={(e) => {
                          setFormData(prev => ({ ...prev, fitnessLevel: e.target.value }));
                          setSelectedLevel(FITNESS_LEVELS.find(level => level.value === e.target.value));
                          setShowLevelDescription(true);
                        }}
                        onBlur={() => setShowLevelDescription(false)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A90E2] focus:border-transparent appearance-none cursor-pointer"
                      >
                        <option value="">Select your fitness level</option>
                        {FITNESS_LEVELS.map((level) => (
                          <option key={level.value} value={level.value}>
                            {level.level}
                          </option>
                        ))}
                      </select>
                      
                      <AnimatePresence>
                        {showLevelDescription && selectedLevel && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute mt-2 p-4 bg-white border border-gray-200 rounded-lg shadow-lg z-10 w-full"
                          >
                            <p className="text-sm text-gray-600">{selectedLevel.description}</p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
    
                  {/* Physical Limitations Section */}
                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold text-gray-800">Physical Limitations</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                      {PHYSICAL_LIMITATIONS.map((limitation) => (
                        <motion.div
                          key={limitation}
                          whileTap={{ scale: 0.95 }}
                        >
                          <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                            <input
                              type="checkbox"
                              checked={formData.physicalLimitations && formData.physicalLimitations.includes(limitation)}
                              onChange={() => handleLimitationsChange(limitation)}
                              className="w-4 h-4 text-[#4A90E2] border-gray-300 rounded focus:ring-[#4A90E2]"
                            />
                            <span className="ml-2 text-sm">{limitation}</span>
                          </label>
                        </motion.div>
                      ))}
                    </div>
                    <div className="mt-4">
                      <label className="text-sm font-medium text-gray-700">Other Limitations</label>
                      <input
                        type="text"
                        value={formData.otherLimitations || ""}
                        onChange={(e) => setFormData(prev => ({ ...prev, otherLimitations: e.target.value }))}
                        className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A90E2] focus:border-transparent"
                        placeholder="Enter any other physical limitations..."
                      />
                    </div>
                  </div>
    
                  {/* Personal Description Section */}
                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold text-gray-800">About You</h2>
                    <textarea
                      value={formData.description || ""}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A90E2] focus:border-transparent h-32"
                      placeholder="Tell us about your fitness journey, goals, favorite sports..."
                    />
                  </div>
                </div>
              )}
    
              {/* Body Composition Tab */}
              {activeFormTab === "bodyComp" && (
                <div className="space-y-8">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-800">Body Composition</h2>
                    <div className="text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Save className="w-4 h-4" /> Save to track history
                      </span>
                    </div>
                  </div>
    
                  {/* Height & Weight Section */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Height */}
                    <div className="space-y-4">
                      <h3 className="font-medium text-gray-800 flex items-center gap-2">
                        <Ruler className="w-5 h-5 text-[#4A90E2]" />
                        Height
                      </h3>
                      
                      <div className="flex items-center gap-3 mb-3">
                        <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                          <button
                            type="button"
                            onClick={() => handleHeightUnitChange("cm")}
                            className={`px-3 py-2 text-sm font-medium ${
                              formData.heightUnit === "cm" 
                                ? "bg-[#4A90E2] text-white" 
                                : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                            }`}
                          >
                            cm
                          </button>
                          <button
                            type="button"
                            onClick={() => handleHeightUnitChange("ft/in")}
                            className={`px-3 py-2 text-sm font-medium ${
                              formData.heightUnit === "ft/in" 
                                ? "bg-[#4A90E2] text-white" 
                                : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                            }`}
                          >
                            ft/in
                          </button>
                        </div>
                      </div>
                      
                      {formData.heightUnit === "cm" ? (
                        <div className="relative">
                          <input
                            type="number"
                            value={formData.height}
                            onChange={(e) => setFormData(prev => ({ ...prev, height: e.target.value }))}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A90E2] focus:border-transparent"
                            placeholder="Height in centimeters"
                            min="0"
                          />
                          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <span className="text-gray-500">cm</span>
                          </div>
                        </div>
                      ) : (
                        <div className="flex gap-2 items-center">
                          <div className="relative flex-1">
                            <input
                              type="number"
                              value={formData.heightFeet}
                              onChange={(e) => setFormData(prev => ({ ...prev, heightFeet: e.target.value }))}
                              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A90E2] focus:border-transparent"
                              placeholder="Feet"
                              min="0"
                            />
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                              <span className="text-gray-500">ft</span>
                            </div>
                          </div>
                          <div className="relative flex-1">
                            <input
                              type="number"
                              value={formData.heightInches}
                              onChange={(e) => setFormData(prev => ({ ...prev, heightInches: e.target.value }))}
                              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A90E2] focus:border-transparent"
                              placeholder="Inches"
                              min="0"
                              max="11"
                            />
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                              <span className="text-gray-500">in</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Weight with History */}
                    <div className="space-y-4">
                      <h3 className="font-medium text-gray-800 flex items-center gap-2">
                        <Scale className="w-5 h-5 text-[#4A90E2]" />
                        Weight
                      </h3>
                      
                      <div className="flex items-center gap-3 mb-3">
                        <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                          <button
                            type="button"
                            onClick={() => handleWeightUnitChange("kg")}
                            className={`px-3 py-2 text-sm font-medium ${
                              formData.weightUnit === "kg" 
                                ? "bg-[#4A90E2] text-white" 
                                : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                            }`}
                          >
                            kg
                          </button>
                          <button
                            type="button"
                            onClick={() => handleWeightUnitChange("lbs")}
                            className={`px-3 py-2 text-sm font-medium ${
                              formData.weightUnit === "lbs" 
                                ? "bg-[#4A90E2] text-white" 
                                : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                            }`}
                          >
                            lbs
                          </button>
                        </div>
                      </div>
                      
                      {/* Weight Input with Save Button */}
                      <div className="flex gap-2 items-start">
                        <div className="relative flex-1">
                          <input
                            type="number"
                            value={tempWeight}
                            onChange={(e) => handleWeightInputChange(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A90E2] focus:border-transparent"
                            placeholder={`Weight in ${formData.weightUnit}`}
                            min="0"
                            step="0.1"
                          />
                          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <span className="text-gray-500">{formData.weightUnit}</span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={saveWeightToHistory}
                          className="px-4 py-3 bg-[#4A90E2] text-white rounded-lg hover:bg-[#357ABD] transition-colors flex items-center"
                          disabled={!tempWeight}
                        >
                          <Save className="w-5 h-5" />
                        </button>
                      </div>
                      
                      {/* Weight History */}
                      {formData.weightHistory && formData.weightHistory.length > 0 && (
                        <div className="mt-2">
                          <button
                            type="button"
                            onClick={() => toggleHistoryVisibility('weight')}
                            className="flex items-center gap-2 text-sm text-[#4A90E2] font-medium"
                          >
                            {showWeightHistory ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            {showWeightHistory ? "Hide Weight History" : "Show Weight History"} ({formData.weightHistory.length} entries)
                          </button>
                          
                          {showWeightHistory && (
                            <div className="mt-2 bg-gray-50 p-2 rounded-lg">
                              {renderHistoryEntries(formData.weightHistory)}
                              <MeasurementTrend history={formData.weightHistory} label="Weight" />
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
    
                  {/* Body Fat & Measurements */}
                  <div className="space-y-6">
                    <h3 className="font-medium text-gray-800 flex items-center gap-2">
                      <Percent className="w-5 h-5 text-[#4A90E2]" />
                      Body Fat
                    </h3>
                    
                    {/* Body Fat Input with History */}
                    <div className="flex gap-2 items-start">
                      <div className="relative flex-1">
                        <input
                          type="number"
                          value={tempBodyFat}
                          onChange={(e) => handleBodyFatInputChange(e.target.value)}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A90E2] focus:border-transparent"
                          placeholder="Enter body fat percentage"
                          min="0"
                          max="100"
                          step="0.1"
                        />
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                          <span className="text-gray-500">%</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={saveBodyFatToHistory}
                        className="px-4 py-3 bg-[#4A90E2] text-white rounded-lg hover:bg-[#357ABD] transition-colors flex items-center"
                        disabled={!tempBodyFat}
                      >
                        <Save className="w-5 h-5" />
                      </button>
                    </div>
                    
                    {/* Body Fat History */}
                    {formData.bodyFatHistory && formData.bodyFatHistory.length > 0 && (
                      <div>
                        <button
                          type="button"
                          onClick={() => toggleHistoryVisibility('bodyFat')}
                          className="flex items-center gap-2 text-sm text-[#4A90E2] font-medium"
                        >
                          {showBodyFatHistory ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          {showBodyFatHistory ? "Hide Body Fat History" : "Show Body Fat History"} ({formData.bodyFatHistory.length} entries)
                        </button>
                        
                        {showBodyFatHistory && (
                          <div className="mt-2 bg-gray-50 p-2 rounded-lg">
                            {renderHistoryEntries(formData.bodyFatHistory, "%")}
                            <MeasurementTrend history={formData.bodyFatHistory} label="Body Fat" />
                          </div>
                        )}
                      </div>
                    )}
                    
                    {/* Measurements with History */}
                    <div className="mt-6">
                      <h3 className="font-medium text-gray-800 flex items-center gap-2 mb-4">
                        <Ruler className="w-5 h-5 text-[#4A90E2]" />
                        Body Measurements
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Chest Measurement */}
                        <MeasurementInputWithHistory
                          label="Chest"
                          icon={<Ruler className="w-4 h-4 text-[#4A90E2]" />}
                          tempValue={tempMeasurements.chest}
                          onTempChange={(value) => handleMeasurementInputChange('chest', value)}
                          onSave={() => saveMeasurementToHistory('chest')}
                          history={formData.measurementHistory.chest}
                          unit="cm"
                          showHistory={showMeasurementHistory.chest}
                          onToggleHistory={() => toggleHistoryVisibility('measurement', 'chest')}
                        />
                        
                        {/* Waist Measurement */}
                        <MeasurementInputWithHistory
                          label="Waist"
                          icon={<Ruler className="w-4 h-4 text-[#4A90E2]" />}
                          tempValue={tempMeasurements.waist}
                          onTempChange={(value) => handleMeasurementInputChange('waist', value)}
                          onSave={() => saveMeasurementToHistory('waist')}
                          history={formData.measurementHistory.waist}
                          unit="cm"
                          showHistory={showMeasurementHistory.waist}
                          onToggleHistory={() => toggleHistoryVisibility('measurement', 'waist')}
                        />
                        
                        {/* Hips Measurement */}
                        <MeasurementInputWithHistory
                          label="Hips"
                          icon={<Ruler className="w-4 h-4 text-[#4A90E2]" />}
                          tempValue={tempMeasurements.hips}
                          onTempChange={(value) => handleMeasurementInputChange('hips', value)}
                          onSave={() => saveMeasurementToHistory('hips')}
                          history={formData.measurementHistory.hips}
                          unit="cm"
                          showHistory={showMeasurementHistory.hips}
                          onToggleHistory={() => toggleHistoryVisibility('measurement', 'hips')}
                        />
                        
                        {/* Thighs Measurement */}
                        <MeasurementInputWithHistory
                          label="Thighs"
                          icon={<Ruler className="w-4 h-4 text-[#4A90E2]" />}
                          tempValue={tempMeasurements.thighs}
                          onTempChange={(value) => handleMeasurementInputChange('thighs', value)}
                          onSave={() => saveMeasurementToHistory('thighs')}
                          history={formData.measurementHistory.thighs}
                          unit="cm"
                          showHistory={showMeasurementHistory.thighs}
                          onToggleHistory={() => toggleHistoryVisibility('measurement', 'thighs')}
                        />
                        
                        {/* Arms Measurement */}
                        <MeasurementInputWithHistory
                          label="Arms"
                          icon={<Ruler className="w-4 h-4 text-[#4A90E2]" />}
                          tempValue={tempMeasurements.arms}
                          onTempChange={(value) => handleMeasurementInputChange('arms', value)}
                          onSave={() => saveMeasurementToHistory('arms')}
                          history={formData.measurementHistory.arms}
                          unit="cm"
                          showHistory={showMeasurementHistory.arms}
                          onToggleHistory={() => toggleHistoryVisibility('measurement', 'arms')}
                        />
                      </div>
                    </div>
                  </div>
    
                  {/* Tracking Stats Section */}
                  <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
                    <h3 className="text-blue-800 font-medium flex items-center gap-2">
                      <LineChart className="w-5 h-5" />
                      Tracking Progress
                    </h3>
                    <p className="text-blue-700 text-sm mt-1">
                      All body measurements are now tracked over time. Click the save button next to each measurement to record a new entry.
                      View your progress by expanding the history sections for each measurement.
                    </p>
                  </div>
                </div>
              )}
    
              {/* Equipment Tab */}
              {activeFormTab === "equipment" && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-800">Available Equipment</h2>
                  <p className="text-gray-600">
                    Select the equipment you have access to for your workouts. This helps Max create appropriate workout plans.
                  </p>
    
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {AVAILABLE_EQUIPMENT.map((equipment) => (
                      <motion.button
                        key={equipment.name}
                        type="button"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleEquipmentToggle(equipment.name)}
                        className={`p-4 rounded-lg border ${
                          formData.equipment && formData.equipment.includes(equipment.name)
                            ? 'border-[#4A90E2] bg-[#E8F4FF]'
                            : 'border-gray-200 hover:bg-gray-50'
                        } transition-colors duration-200`}
                      >
                        <div className="text-2xl mb-2">{equipment.icon}</div>
                        <div className="text-sm font-medium">{equipment.name}</div>
                        <div className="text-xs text-gray-500">{equipment.category}</div>
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}
    
              {/* Error Message */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center gap-2 p-4 bg-red-50 text-red-600 rounded-lg"
                  >
                    <AlertCircle className="w-5 h-5" />
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>
    
              {/* Action Buttons */}
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setShowProfileForm(false)}
                  className="px-6 py-3 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-3 bg-[#4A90E2] text-white rounded-lg hover:bg-[#357ABD] transition-colors"
                >
                  <Save className="w-5 h-5" />
                  {editingProfile ? 'Update Profile' : 'Save Profile'}
                </button>
              </div>
            </form>
          </motion.div>
        )}
    
        {/* Delete Confirmation Modal */}
        <AnimatePresence>
          {showDeleteConfirm && (
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
                className="bg-white rounded-lg p-6 max-w-sm w-full"
              >
                <h3 className="text-lg font-semibold mb-2">Delete Profile</h3>
                <p className="text-gray-600 mb-4">
                  Are you sure you want to delete the profile for {profileToDelete?.name}? This action cannot be undone.
                </p>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDeleteProfile}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ProfileManager;
```

### src/main.jsx

```jsx
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import Homepage from './homepage';
import AIChatAssistant from './AIChatAssistant';
import ProfileCreation from './ProfileCreation';
import NavigationMenu from './components/NavigationMenu';
import WorkoutPage from './pages/WorkoutPage';
import ProgressPage from './pages/ProgressPage';
import { WorkoutProvider } from './WorkoutContext';
import MobileAppInstallBanner from './components/MobileAppInstallBanner';

// Meta tag component for SEO
const PageTitle = () => {
  const location = useLocation();
  
  // Define page-specific meta information
  const getPageMeta = () => {
    const path = location.pathname;
    
    const baseMeta = {
      title: "Max AI Coach - Personal AI Fitness Trainer | Jordan Montée (AlikelDev)",
      description: "Transform your fitness journey with Max AI Coach. Get personalized workouts, form analysis, and expert guidance tailored to your fitness level.",
      keywords: "AI fitness coach, personal trainer, workout tracker, strength training"
    };
    
    switch (path) {
      case '/':
        return {
          ...baseMeta,
          title: "Max AI Coach - AI-Powered Fitness Training | Alikearn Studio",
          description: "Your personal AI fitness trainer for customized workouts, form analysis, and progress tracking. Transform your fitness journey today.",
          keywords: "AI fitness coach, personal trainer, workout planner, fitness app"
        };
      case '/chat':
        return {
          ...baseMeta,
          title: "Chat with Max - AI Fitness Advice | Max AI Coach",
          description: "Get real-time fitness advice, form guidance, and personalized workout help from Max, your AI fitness coach.",
          keywords: "AI fitness advice, workout guidance, exercise form, fitness help"
        };
      case '/workout':
        return {
          ...baseMeta,
          title: "Workout Tracker & Planner | Max AI Coach",
          description: "Create, track, and optimize your workout routines with intelligent exercise tracking and form guidance.",
          keywords: "workout tracker, fitness planner, strength training log, exercise tracker"
        };
      case '/profile':
        return {
          ...baseMeta,
          title: "Athlete Profile Setup | Max AI Coach",
          description: "Customize your fitness profile for personalized workout recommendations based on your goals and equipment.",
          keywords: "fitness profile, athlete settings, workout personalization"
        };
      case '/progress':
        return {
          ...baseMeta,
          title: "Fitness Progress Analytics | Max AI Coach",
          description: "Track your fitness journey with detailed analytics, progress charts, and body composition tracking.",
          keywords: "fitness analytics, workout progress, strength gains, body composition"
        };
      default:
        return baseMeta;
    }
  };
  
  const meta = getPageMeta();
  
  // Generate structured data for current page
  const getStructuredData = () => {
    const baseData = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": meta.title,
      "description": meta.description
    };
    
    if (location.pathname === '/') {
      return JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "Max AI Coach",
        "applicationCategory": "HealthApplication",
        "operatingSystem": "Web",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        },
        "description": "AI personal trainer providing personalized workouts and form analysis"
      });
    }
    
    return JSON.stringify(baseData);
  };
  
  return (
    <Helmet>
      <title>{meta.title}</title>
      <meta name="description" content={meta.description} />
      <meta name="keywords" content={meta.keywords} />
      <meta property="og:title" content={meta.title} />
      <meta property="og:description" content={meta.description} />
      <meta property="og:url" content={`https://deepfit-alikearn.com${location.pathname}`} />
      <link rel="canonical" href={`https://deepfit-alikearn.com${location.pathname}`} />
      <script type="application/ld+json">{getStructuredData()}</script>
    </Helmet>
  );
};

// Register service worker
const registerServiceWorker = () => {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
      try {
        const registration = await navigator.serviceWorker.register('/service-worker.js');
        console.log('ServiceWorker registration successful with scope: ', registration.scope);
        
        // Request notification permission
        if ('Notification' in window) {
          Notification.requestPermission();
        }
        
        // Register for periodic sync if available
        if ('periodicSync' in registration) {
          try {
            await registration.periodicSync.register('sync-workouts', {
              minInterval: 24 * 60 * 60 * 1000 // Once a day
            });
            console.log('Periodic sync registered');
          } catch (error) {
            console.error('Periodic sync registration failed:', error);
          }
        }
      } catch (error) {
        console.error('ServiceWorker registration failed:', error);
      }
    });
  }
};

const App = () => {
  useEffect(() => {
    // Register service worker
    registerServiceWorker();
    
    // Track page views for analytics
    const trackPageView = () => {
      const pageViews = JSON.parse(localStorage.getItem('max_coach_page_views') || '{}');
      const path = window.location.pathname;
      
      pageViews[path] = (pageViews[path] || 0) + 1;
      localStorage.setItem('max_coach_page_views', JSON.stringify(pageViews));
      
      // Here you would normally send to an analytics service
      console.log('Page view:', path);
    };
    
    // Track initial page view
    trackPageView();
    
    // Set up page view tracking
    const originalPushState = history.pushState;
    history.pushState = function() {
      originalPushState.apply(this, arguments);
      trackPageView();
    };
    
    return () => {
      // Restore original history.pushState
      history.pushState = originalPushState;
    };
  }, []);

  return (
    <HelmetProvider>
      <BrowserRouter>
        <WorkoutProvider>
          <div className="flex flex-col min-h-screen">
            <PageTitle />
            <NavigationMenu />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Homepage />} />
                <Route path="/chat" element={
                  <div className="container mx-auto px-4 py-8 max-w-4xl">
                    <AIChatAssistant />
                  </div>
                } />
                <Route path="/workout" element={<WorkoutPage />} />
                <Route path="/profile" element={<ProfileCreation />} />
                <Route path="/progress" element={<ProgressPage />} />
                <Route path="*" element={
                  <div className="container mx-auto px-4 py-8 text-center">
                    <h1 className="text-2xl font-bold text-gray-800 mb-4">Page Not Found</h1>
                    <p className="text-gray-600 mb-6">The page you're looking for doesn't exist or has been moved.</p>
                    <a href="/" className="px-6 py-3 bg-[#4A90E2] text-white rounded-lg hover:bg-[#357ABD] transition-colors">
                      Return Home
                    </a>
                  </div>
                } />
              </Routes>
            </main>
            <MobileAppInstallBanner />
            <footer className="py-6 bg-[#D1E8FF] mt-auto">
              <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto">
                  <div className="flex flex-col md:flex-row justify-between items-center mb-4">
                    <p className="text-sm text-gray-700 mb-4 md:mb-0">
                      <strong>Max AI Coach</strong> - Your personal AI fitness trainer developed by 
                      <a href="https://github.com/AliKelDev" className="text-[#4A90E2] hover:underline ml-1">Jordan Montée (AlikelDev)</a>
                    </p>
                    <div className="flex space-x-4">
                      <a href="https://deep-chef.netlify.app/" className="text-sm text-[#4A90E2] hover:underline">DeepChef</a>
                      <a href="https://pixelle3-alikearn.com/" className="text-sm text-[#4A90E2] hover:underline">Pixelle3</a>
                      <a href="https://linkforge-alikeldev.netlify.app/" className="text-sm text-[#4A90E2] hover:underline">LinkForge</a>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 text-center md:text-left">
                    Max AI Coach offers personalized workout plans, strength training guidance, progress tracking and analytics, 
                    form analysis, and body composition monitoring for fitness enthusiasts of all levels.
                  </p>
                  <p className="text-xs text-gray-500 mt-4 text-center">
                    © 2023-2025 Alikearn Studio. All rights reserved.
                  </p>
                </div>
              </div>
            </footer>
          </div>
        </WorkoutProvider>
      </BrowserRouter>
    </HelmetProvider>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

### src/homepage.jsx

```jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Dumbbell, 
  MessageSquare, 
  ArrowRight, 
  UserCircle, 
  Activity, 
  BarChart2, 
  TrendingUp, 
  Calendar,
  Award,
  Shield,
  Zap,
  Clock
} from 'lucide-react';

const Homepage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#E6F3FF] to-[#D1E9FF]">
      {/* Hero Section */}
      <section aria-labelledby="hero-heading" className="container mx-auto px-4 pt-16 pb-24">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6" aria-hidden="true">
            <Dumbbell className="w-20 h-20 text-[#2B6CB0]" />
          </div>
          <h1 id="hero-heading" className="text-4xl md:text-6xl font-bold mb-6 text-gray-800">
            Meet Max, Your AI Fitness Coach
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Your personal AI fitness trainer for tracking workouts, measuring progress, and achieving your fitness goals with personalized guidance.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {/* Chat with Max Card */}
          <Link to="/chat" className="group" aria-labelledby="chat-heading">
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-[#BEE3F8] hover:border-[#2B6CB0] h-full">
              <div className="flex items-center gap-4 mb-4">
                <MessageSquare className="w-8 h-8 text-[#2B6CB0]" aria-hidden="true" />
                <h2 id="chat-heading" className="text-2xl font-semibold text-gray-800">Chat with Max</h2>
              </div>
              <p className="text-gray-600 mb-6">
                Get personalized advice, form guidance, and expert fitness tips from your AI sports coach trained on exercise science.
              </p>
              <div className="flex items-center text-[#2B6CB0] group-hover:translate-x-2 transition-transform">
                <span className="font-medium">Start Chatting</span>
                <ArrowRight className="w-5 h-5 ml-2" aria-hidden="true" />
              </div>
            </div>
          </Link>

          {/* Workout Tracker Card */}
          <Link to="/workout" className="group" aria-labelledby="workout-heading">
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-[#BEE3F8] hover:border-[#2B6CB0] h-full relative overflow-hidden">
              <div className="flex items-center gap-4 mb-4">
                <Dumbbell className="w-8 h-8 text-[#2B6CB0]" aria-hidden="true" />
                <h2 id="workout-heading" className="text-2xl font-semibold text-gray-800">Workout Tracker</h2>
              </div>
              <p className="text-gray-600 mb-6">
                Create and track custom workout routines, log your sets and reps, and monitor your strength gains over time with our intelligent tracker.
              </p>
              <div className="flex items-center text-[#2B6CB0] group-hover:translate-x-2 transition-transform">
                <span className="font-medium">Start Training</span>
                <ArrowRight className="w-5 h-5 ml-2" aria-hidden="true" />
              </div>
            </div>
          </Link>

          {/* Progress Analytics Card - NEW */}
          <Link to="/progress" className="group" aria-labelledby="progress-heading">
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-[#2B6CB0] hover:border-[#2B6CB0] h-full relative overflow-hidden">
              {/* New badge */}
              <div className="absolute top-0 right-0">
                <div className="bg-[#2B6CB0] text-white text-xs font-bold px-3 py-1 transform rotate-0 translate-x-2 -translate-y-0">
                  NEW
                </div>
              </div>
              
              <div className="flex items-center gap-4 mb-4">
                <Activity className="w-8 h-8 text-[#2B6CB0]" aria-hidden="true" />
                <h2 id="progress-heading" className="text-2xl font-semibold text-gray-800">Progress Analytics</h2>
              </div>
              <p className="text-gray-600 mb-6">
                Visualize strength gains, track personal records, and analyze workout consistency with detailed charts and body composition tracking.
              </p>
              <div className="flex items-center text-[#2B6CB0] group-hover:translate-x-2 transition-transform">
                <span className="font-medium">View Analytics</span>
                <ArrowRight className="w-5 h-5 ml-2" aria-hidden="true" />
              </div>
            </div>
          </Link>

          {/* Profile Creation Card */}
          <Link to="/profile" className="group" aria-labelledby="profile-heading">
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-[#BEE3F8] hover:border-[#2B6CB0] h-full">
              <div className="flex items-center gap-4 mb-4">
                <UserCircle className="w-8 h-8 text-[#2B6CB0]" aria-hidden="true" />
                <h2 id="profile-heading" className="text-2xl font-semibold text-gray-800">Athlete Profile</h2>
              </div>
              <p className="text-gray-600 mb-6">
                Customize your fitness profile with physical capabilities, equipment access, and body measurements for workouts tailored to your specific needs.
              </p>
              <div className="flex items-center text-[#2B6CB0] group-hover:translate-x-2 transition-transform">
                <span className="font-medium">Personalize Experience</span>
                <ArrowRight className="w-5 h-5 ml-2" aria-hidden="true" />
              </div>
            </div>
          </Link>
        </div>

        {/* Analytics Showcase Section */}
        <section aria-labelledby="analytics-heading" className="mt-20 max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 id="analytics-heading" className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Track Your Fitness Journey</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our comprehensive analytics dashboard helps you visualize progress, identify improvement opportunities, and stay motivated with data-driven insights.
            </p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-[#BEE3F8]">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center">
                <div className="bg-indigo-100 p-4 rounded-full mb-4" aria-hidden="true">
                  <BarChart2 className="w-10 h-10 text-indigo-600" />
                </div>
                <h3 className="font-bold text-lg mb-2">Visual Progress Tracking</h3>
                <p className="text-gray-600">Track how your strength improves over time with intuitive charts and exercise-specific progress reports.</p>
              </div>
              
              <div className="flex flex-col items-center text-center">
                <div className="bg-amber-100 p-4 rounded-full mb-4" aria-hidden="true">
                  <Award className="w-10 h-10 text-amber-600" />
                </div>
                <h3 className="font-bold text-lg mb-2">Personal Records</h3>
                <p className="text-gray-600">Celebrate achievements with automatic personal record tracking for every exercise you perform.</p>
              </div>
              
              <div className="flex flex-col items-center text-center">
                <div className="bg-green-100 p-4 rounded-full mb-4" aria-hidden="true">
                  <TrendingUp className="w-10 h-10 text-green-600" />
                </div>
                <h3 className="font-bold text-lg mb-2">Body Composition</h3>
                <p className="text-gray-600">Monitor weight, body fat percentage, and measurements to track physical changes beyond just strength.</p>
              </div>
            </div>
            
            <div className="mt-10 text-center">
              <Link to="/progress" className="inline-flex items-center gap-2 px-6 py-3 bg-[#4A90E2] text-white rounded-lg hover:bg-[#357ABD] transition-colors shadow-md">
                Explore Analytics
                <ArrowRight className="w-5 h-5" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section aria-labelledby="benefits-heading" className="mt-24">
          <h2 id="benefits-heading" className="sr-only">Max AI Coach Benefits</h2>
          <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto text-center">
            <div className="p-6">
              <Calendar className="w-8 h-8 text-[#4A90E2] mx-auto mb-3" aria-hidden="true" />
              <h3 className="font-semibold text-lg mb-2 text-gray-800">Workout Planning</h3>
              <p className="text-gray-600">Create custom workout routines with exercises tailored to your equipment and fitness level.</p>
            </div>
            <div className="p-6">
              <MessageSquare className="w-8 h-8 text-[#4A90E2] mx-auto mb-3" aria-hidden="true" />
              <h3 className="font-semibold text-lg mb-2 text-gray-800">Form Guidance</h3>
              <p className="text-gray-600">Get expert advice on proper exercise form to maximize results and prevent injuries.</p>
            </div>
            <div className="p-6">
              <Activity className="w-8 h-8 text-[#4A90E2] mx-auto mb-3" aria-hidden="true" />
              <h3 className="font-semibold text-lg mb-2 text-gray-800">Progress Tracking</h3>
              <p className="text-gray-600">Monitor your strength gains, body composition, and workout consistency over time.</p>
            </div>
            <div className="p-6">
              <UserCircle className="w-8 h-8 text-[#4A90E2] mx-auto mb-3" aria-hidden="true" />
              <h3 className="font-semibold text-lg mb-2 text-gray-800">Personalization</h3>
              <p className="text-gray-600">Receive workouts based on your unique profile, equipment access, and fitness goals.</p>
            </div>
          </div>
        </section>

        {/* Additional Features Section */}
        <section aria-labelledby="features-heading" className="mt-20 max-w-6xl mx-auto bg-white rounded-2xl shadow-lg p-8 border border-[#BEE3F8]">
          <h2 id="features-heading" className="text-2xl font-bold text-gray-800 mb-8 text-center">Powered by Advanced AI Technology</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex flex-col">
              <div className="flex items-center gap-3 mb-3">
                <Shield className="w-6 h-6 text-[#4A90E2]" aria-hidden="true" />
                <h3 className="font-semibold text-lg text-gray-800">Privacy-Focused</h3>
              </div>
              <p className="text-gray-600">Your fitness data stays on your device with local storage, ensuring your personal information remains private.</p>
            </div>
            
            <div className="flex flex-col">
              <div className="flex items-center gap-3 mb-3">
                <Zap className="w-6 h-6 text-[#4A90E2]" aria-hidden="true" />
                <h3 className="font-semibold text-lg text-gray-800">Offline Capability</h3>
              </div>
              <p className="text-gray-600">Track workouts even without internet connection. Your data syncs automatically when you're back online.</p>
            </div>
            
            <div className="flex flex-col">
              <div className="flex items-center gap-3 mb-3">
                <Clock className="w-6 h-6 text-[#4A90E2]" aria-hidden="true" />
                <h3 className="font-semibold text-lg text-gray-800">Real-time Feedback</h3>
              </div>
              <p className="text-gray-600">Get immediate guidance on your training with our AI-powered coach that evolves with your fitness level.</p>
            </div>
          </div>
          
          <div className="mt-10 text-center">
            <Link to="/profile" className="inline-flex items-center gap-2 px-6 py-3 bg-[#4A90E2] text-white rounded-lg hover:bg-[#357ABD] transition-colors shadow-md">
              Get Started Today
              <ArrowRight className="w-5 h-5" aria-hidden="true" />
            </Link>
          </div>
        </section>

        {/* By AlikelDev Section */}
        <section aria-labelledby="creator-heading" className="mt-24 max-w-6xl mx-auto text-center">
          <h2 id="creator-heading" className="sr-only">About the Creator</h2>
          <p className="text-lg text-gray-700">
            Developed by <a href="https://github.com/AliKelDev" className="text-[#4A90E2] font-semibold hover:underline">Jordan Montée (AlikelDev)</a>
          </p>
          <p className="text-sm text-gray-600 mt-2">
            Part of the Alikearn Studio AI assistant family alongside 
            <a href="https://deep-chef.netlify.app/" className="text-[#4A90E2] ml-1 hover:underline">DeepChef</a>, 
            <a href="https://pixelle3-alikearn.com/" className="text-[#4A90E2] ml-1 hover:underline">Pixelle3</a>, and
            <a href="https://linkforge-alikeldev.netlify.app/" className="text-[#4A90E2] ml-1 hover:underline">LinkForge</a>
          </p>
        </section>
      </section>
    </div>
  );
};

export default Homepage;
```

### src/pages/WorkoutPage.jsx

```jsx
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
  
  // Updated timer implementation
  const [stopwatchRunning, setStopwatchRunning] = useState(false);
  const [workoutStartTime, setWorkoutStartTime] = useState(null);
  const [pausedTime, setPausedTime] = useState(0); // Store accumulated time when paused
  const [displayTime, setDisplayTime] = useState(0);
  const timerInterval = useRef(null);
  
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
    
    // Load active workout and timer state
    const profileId = JSON.parse(storedProfile)?.id;
    if (profileId) {
      const storedActiveWorkout = localStorage.getItem(`active_workout_${profileId}`);
      if (storedActiveWorkout) {
        setActiveWorkout(JSON.parse(storedActiveWorkout));
        
        // Restore timer state
        const storedStartTime = localStorage.getItem(`workout_start_time_${profileId}`);
        const storedPausedTime = localStorage.getItem(`workout_paused_time_${profileId}`);
        const storedTimerRunning = localStorage.getItem(`workout_timer_running_${profileId}`);
        
        if (storedStartTime && storedTimerRunning === 'true') {
          setWorkoutStartTime(parseInt(storedStartTime, 10));
          setPausedTime(parseInt(storedPausedTime || '0', 10));
          setStopwatchRunning(true);
          setCurrentTab("active");
        } else if (storedPausedTime) {
          setPausedTime(parseInt(storedPausedTime, 10));
          setDisplayTime(parseInt(storedPausedTime, 10));
          setCurrentTab("active");
        }
      }
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
  
  // Save active workout when it changes
  useEffect(() => {
    if (userProfile && activeWorkout) {
      localStorage.setItem(`active_workout_${userProfile.id}`, JSON.stringify(activeWorkout));
    } else if (userProfile) {
      localStorage.removeItem(`active_workout_${userProfile.id}`);
    }
  }, [activeWorkout, userProfile]);
  
  // Save timer state
  useEffect(() => {
    if (!userProfile) return;
    
    if (workoutStartTime) {
      localStorage.setItem(`workout_start_time_${userProfile.id}`, workoutStartTime.toString());
    } else {
      localStorage.removeItem(`workout_start_time_${userProfile.id}`);
    }
    
    localStorage.setItem(`workout_paused_time_${userProfile.id}`, pausedTime.toString());
    localStorage.setItem(`workout_timer_running_${userProfile.id}`, stopwatchRunning.toString());
  }, [workoutStartTime, pausedTime, stopwatchRunning, userProfile]);

  // Updated timer logic using timestamps
  useEffect(() => {
    if (stopwatchRunning && workoutStartTime) {
      // Update the display time immediately
      const updateTimer = () => {
        const now = Date.now();
        const elapsed = Math.floor((now - workoutStartTime) / 1000) + pausedTime;
        setDisplayTime(elapsed);
      };
      
      // Initial update
      updateTimer();
      
      // Then set up the interval to update the display
      timerInterval.current = setInterval(updateTimer, 1000);
    } else {
      clearInterval(timerInterval.current);
    }

    return () => clearInterval(timerInterval.current);
  }, [stopwatchRunning, workoutStartTime, pausedTime]);

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

  // Toggle timer
  const toggleStopwatch = () => {
    if (stopwatchRunning) {
      // Pause: store accumulated time
      const currentElapsed = Math.floor((Date.now() - workoutStartTime) / 1000) + pausedTime;
      setPausedTime(currentElapsed);
      setDisplayTime(currentElapsed);
      setWorkoutStartTime(null);
      setStopwatchRunning(false);
    } else {
      // Resume: start a new reference time, keeping the accumulated paused time
      setWorkoutStartTime(Date.now());
      setStopwatchRunning(true);
    }
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
    
    // Reset and start the timer
    setPausedTime(0);
    setWorkoutStartTime(Date.now());
    setStopwatchRunning(true);
    
    // Set as active workout
    setActiveWorkout(emptyWorkout);
    setCurrentTab("active");
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
    
    // Reset and start the timer
    setPausedTime(0);
    setWorkoutStartTime(Date.now());
    setStopwatchRunning(true);
    
    setActiveWorkout(workoutWithTracking);
    setCurrentTab("active");
  };

  const handleCompleteWorkout = () => {
    if (!activeWorkout) return;
    
    // Calculate total duration
    const totalDuration = stopwatchRunning
      ? Math.floor((Date.now() - workoutStartTime) / 1000) + pausedTime
      : pausedTime;
    
    // Create a history entry
    const completedWorkout = {
      ...activeWorkout,
      endTime: new Date().toISOString(),
      duration: totalDuration,
      isCompleted: true
    };
    
    setWorkoutHistory(prev => [completedWorkout, ...prev]);
    setActiveWorkout(null);
    setStopwatchRunning(false);
    setWorkoutStartTime(null);
    setPausedTime(0);
    setDisplayTime(0);
    setCurrentTab("my-workouts");
    
    // Clean up localStorage timer values
    if (userProfile) {
      localStorage.removeItem(`workout_start_time_${userProfile.id}`);
      localStorage.removeItem(`workout_paused_time_${userProfile.id}`);
      localStorage.removeItem(`workout_timer_running_${userProfile.id}`);
    }
  };

  const handleCancelWorkout = () => {
    if (confirm("Are you sure you want to cancel this workout? Progress will not be saved.")) {
      setActiveWorkout(null);
      setStopwatchRunning(false);
      setWorkoutStartTime(null);
      setPausedTime(0);
      setDisplayTime(0);
      setCurrentTab("my-workouts");
      
      // Clean up localStorage timer values
      if (userProfile) {
        localStorage.removeItem(`workout_start_time_${userProfile.id}`);
        localStorage.removeItem(`workout_paused_time_${userProfile.id}`);
        localStorage.removeItem(`workout_timer_running_${userProfile.id}`);
      }
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
                  setStopwatchRunning={toggleStopwatch} // Use the new toggle function
                  elapsedTime={displayTime} // Use the new display time
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
        elapsedTime={displayTime} // Use the new display time
      />
    </div>
  );
};

export default WorkoutPage;
```

### src/pages/ProgressPage.jsx

```jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Activity,
  BarChart2,
  Calendar,
  Dumbbell,
  LineChart,
  TrendingUp,
  Clock,
  Award,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  Filter,
  Calendar as CalendarIcon,
  Zap,
  Clock as ClockIcon,
  Target,
  Users,
  AlertTriangle,
  Ruler,
  Scale,
  Percent,
  MessageSquare
} from 'lucide-react';

// Measurement trend component
const MeasurementTrend = ({ history, label, color = '#4A90E2' }) => {
  if (!history || history.length < 2) return null;
  
  const sortedHistory = [...history].sort((a, b) => new Date(a.date) - new Date(b.date));
  const maxValue = Math.max(...sortedHistory.map(entry => parseFloat(entry.value)));
  const minValue = Math.min(...sortedHistory.map(entry => parseFloat(entry.value)));
  const range = maxValue - minValue;
  const padding = range * 0.1; // 10% padding
  
  const getY = (value) => {
    // Normalize to 0-100 range for percentage height
    if (range === 0) return 50; // If all values are the same
    return 100 - ((value - minValue + padding/2) / (range + padding) * 100);
  };
  
  const points = sortedHistory.map((entry, index) => {
    const x = (index / (sortedHistory.length - 1)) * 100;
    const y = getY(parseFloat(entry.value));
    return `${x},${y}`;
  }).join(' ');
  
  return (
    <div className="mt-2">
      <div className="text-sm font-medium text-gray-700 mb-1">{label} Trend</div>
      <div className="relative h-16 w-full bg-gray-50 border border-gray-100 rounded overflow-hidden">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full">
          <polyline
            points={points}
            fill="none"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <div className="absolute bottom-1 right-2 text-xs text-gray-500">
          {sortedHistory.length} entries
        </div>
      </div>
    </div>
  );
};

const ProgressPage = () => {
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState(null);
  const [workoutHistory, setWorkoutHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('all'); // all, month, week
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [uniqueExercises, setUniqueExercises] = useState([]);
  const [muscleGroupData, setMuscleGroupData] = useState([]);
  const [personalRecords, setPersonalRecords] = useState([]);
  const [weeklyWorkouts, setWeeklyWorkouts] = useState([]);
  const [showTimeFilter, setShowTimeFilter] = useState(false);
  
  // Body Composition states
  const [showWeightHistory, setShowWeightHistory] = useState(false);
  const [showBodyFatHistory, setShowBodyFatHistory] = useState(false);
  const [showMeasurementHistory, setShowMeasurementHistory] = useState({
    chest: false,
    waist: false,
    hips: false,
    thighs: false,
    arms: false
  });

  // Function to share progress data with Max
  const handleShareWithMax = () => {
    // Collect data based on active tab
    let progressData = {
      type: 'progress',
      tab: activeTab,
      timeRange: timeRange,
      stats: getWorkoutStats(),
      title: `${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Progress`
    };
    
    // Add tab-specific data
    if (activeTab === 'overview') {
      progressData.muscleGroupData = muscleGroupData;
      progressData.weeklyWorkouts = weeklyWorkouts;
    } 
    else if (activeTab === 'exercises') {
      progressData.selectedExercise = selectedExercise;
      progressData.exerciseProgressData = getExerciseProgressData();
    }
    else if (activeTab === 'records') {
      progressData.personalRecords = personalRecords;
    }
    else if (activeTab === 'bodyComp') {
      progressData.bodyMeasurements = userProfile?.bodyMeasurements;
      progressData.weightHistory = userProfile?.weightHistory;
      progressData.bodyFatHistory = userProfile?.bodyFatHistory;
      progressData.measurementHistory = userProfile?.measurementHistory;
    }
    
    // Navigate to chat with the data
    navigate('/chat', { 
      state: { 
        progressShared: true,
        message: `I'd like to discuss my ${activeTab} progress data.`,
        progressData: progressData
      } 
    });
  };

  // Load user profile and workout history on component mount
  useEffect(() => {
    const storedProfile = localStorage.getItem('userProfile');
    if (storedProfile) {
      const profile = JSON.parse(storedProfile);
      setUserProfile(profile);

      const storedHistory = localStorage.getItem(`workout_history_${profile.id}`);
      if (storedHistory) {
        const history = JSON.parse(storedHistory);
        setWorkoutHistory(history);
        processWorkoutData(history);
      }
    }
    setLoading(false);
  }, []);

  // Process workout data to extract analytics
  const processWorkoutData = (history) => {
    if (!history || history.length === 0) return;

    // Extract unique exercises
    const exercises = new Set();
    history.forEach(workout => {
      workout.exercises.forEach(exercise => {
        exercises.add(exercise.name);
      });
    });
    setUniqueExercises(Array.from(exercises));
    
    // If no exercise is selected, select the first one
    if (!selectedExercise && exercises.size > 0) {
      setSelectedExercise(Array.from(exercises)[0]);
    }

    // Calculate muscle group focus
    const muscleGroups = {};
    history.forEach(workout => {
      workout.exercises.forEach(exercise => {
        const muscleTargets = exercise.muscleGroups || ['Uncategorized'];
        muscleTargets.forEach(muscle => {
          muscleGroups[muscle] = (muscleGroups[muscle] || 0) + 1;
        });
      });
    });

    const muscleGroupArray = Object.entries(muscleGroups).map(([name, count]) => ({
      name,
      count
    })).sort((a, b) => b.count - a.count);
    
    setMuscleGroupData(muscleGroupArray);

    // Calculate personal records
    const records = [];
    const exerciseMaxes = {};

    history.forEach(workout => {
      workout.exercises.forEach(exercise => {
        exercise.sets.forEach(set => {
          if (set.completed) {
            const weight = parseFloat(set.actualWeight);
            if (!isNaN(weight) && weight > 0) {
              if (!exerciseMaxes[exercise.name] || weight > exerciseMaxes[exercise.name]) {
                exerciseMaxes[exercise.name] = weight;
                records.push({
                  exercise: exercise.name,
                  weight,
                  date: new Date(workout.startTime).toLocaleDateString(),
                  reps: set.actualReps
                });
              }
            }
          }
        });
      });
    });

    // Keep only the highest weight for each exercise
    const uniqueRecords = Object.values(
      records.reduce((acc, record) => {
        if (!acc[record.exercise] || record.weight > acc[record.exercise].weight) {
          acc[record.exercise] = record;
        }
        return acc;
      }, {})
    ).sort((a, b) => b.weight - a.weight);

    setPersonalRecords(uniqueRecords);

    // Calculate weekly workout frequency
    const now = new Date();
    const oneWeek = 7 * 24 * 60 * 60 * 1000;
    const fourWeeksAgo = new Date(now.getTime() - (4 * oneWeek));
    
    const weeks = [];
    for (let i = 0; i < 4; i++) {
      const weekStart = new Date(fourWeeksAgo.getTime() + (i * oneWeek));
      const weekEnd = new Date(weekStart.getTime() + oneWeek);
      
      const weekWorkouts = history.filter(workout => {
        const workoutDate = new Date(workout.startTime);
        return workoutDate >= weekStart && workoutDate < weekEnd;
      });
      
      weeks.push({
        week: `Week ${i + 1}`,
        count: weekWorkouts.length,
        totalDuration: weekWorkouts.reduce((acc, workout) => acc + workout.duration, 0)
      });
    }
    
    setWeeklyWorkouts(weeks);
  };

  // Filter workout history based on selected time range
  const getFilteredHistory = () => {
    if (timeRange === 'all') return workoutHistory;
    
    const now = new Date();
    let cutoffDate;
    
    if (timeRange === 'month') {
      cutoffDate = new Date(now);
      cutoffDate.setMonth(now.getMonth() - 1);
    } else if (timeRange === 'week') {
      cutoffDate = new Date(now);
      cutoffDate.setDate(now.getDate() - 7);
    }
    
    return workoutHistory.filter(workout => new Date(workout.startTime) >= cutoffDate);
  };

  // Get exercise progress data for charts
  const getExerciseProgressData = () => {
    if (!selectedExercise) return [];
    
    const filteredHistory = getFilteredHistory();
    const progressData = [];
    
    filteredHistory.forEach(workout => {
      workout.exercises.forEach(exercise => {
        if (exercise.name === selectedExercise) {
          // Find the heaviest completed set
          let maxWeight = 0;
          let volume = 0;
          
          exercise.sets.forEach(set => {
            if (set.completed) {
              const weight = parseFloat(set.actualWeight);
              const reps = parseInt(set.actualReps);
              
              if (!isNaN(weight) && !isNaN(reps)) {
                if (weight > maxWeight) maxWeight = weight;
                volume += weight * reps;
              }
            }
          });
          
          if (maxWeight > 0) {
            progressData.push({
              date: new Date(workout.startTime).toLocaleDateString(),
              timestamp: new Date(workout.startTime).getTime(),
              weight: maxWeight,
              volume: volume
            });
          }
        }
      });
    });
    
    // Sort by date
    return progressData.sort((a, b) => a.timestamp - b.timestamp);
  };

  // Format time from seconds to HH:MM:SS
  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate workout statistics
  const getWorkoutStats = () => {
    const filteredHistory = getFilteredHistory();
    
    if (filteredHistory.length === 0) {
      return {
        totalWorkouts: 0,
        avgDuration: 0,
        totalDuration: 0,
        completionRate: 0,
        mostFrequentExercise: 'N/A'
      };
    }
    
    const totalWorkouts = filteredHistory.length;
    const totalDuration = filteredHistory.reduce((acc, workout) => acc + workout.duration, 0);
    const avgDuration = totalDuration / totalWorkouts;
    
    // Calculate set completion rate
    let completedSets = 0;
    let totalSets = 0;
    
    filteredHistory.forEach(workout => {
      workout.exercises.forEach(exercise => {
        exercise.sets.forEach(set => {
          totalSets++;
          if (set.completed) completedSets++;
        });
      });
    });
    
    const completionRate = totalSets > 0 ? (completedSets / totalSets) * 100 : 0;
    
    // Find most frequent exercise
    const exerciseCounts = {};
    filteredHistory.forEach(workout => {
      workout.exercises.forEach(exercise => {
        exerciseCounts[exercise.name] = (exerciseCounts[exercise.name] || 0) + 1;
      });
    });
    
    let mostFrequentExercise = 'N/A';
    let maxCount = 0;
    
    Object.entries(exerciseCounts).forEach(([exercise, count]) => {
      if (count > maxCount) {
        maxCount = count;
        mostFrequentExercise = exercise;
      }
    });
    
    return {
      totalWorkouts,
      avgDuration,
      totalDuration,
      completionRate,
      mostFrequentExercise
    };
  };

  // Toggle history visibility for body composition sections
  const toggleHistoryVisibility = (type, key = null) => {
    if (type === 'weight') {
      setShowWeightHistory(prev => !prev);
    } else if (type === 'bodyFat') {
      setShowBodyFatHistory(prev => !prev);
    } else if (type === 'measurement' && key) {
      setShowMeasurementHistory(prev => ({
        ...prev,
        [key]: !prev[key]
      }));
    }
  };

  // Format history entries for display
  const renderHistoryEntries = (history, unit = "") => {
    if (!history || history.length === 0) {
      return <div className="text-sm text-gray-500 italic">No history entries yet</div>;
    }
    
    const sortedHistory = [...history].sort((a, b) => new Date(b.date) - new Date(a.date));
    
    return (
      <div className="max-h-32 overflow-y-auto mt-1">
        {sortedHistory.map((entry, index) => (
          <div key={index} className="text-sm text-gray-600 flex justify-between border-b border-gray-100 py-1">
            <span>{new Date(entry.date).toLocaleDateString()}</span>
            <span>{entry.value} {entry.unit || unit}</span>
          </div>
        ))}
      </div>
    );
  };

  // Format height for display
  const formatHeight = (profile) => {
    if (!profile) return 'Not set';
    
    if (profile.heightUnit === 'cm' && profile.height) {
      return `${profile.height} cm`;
    } else if (profile.heightUnit === 'ft/in' && profile.heightFeet) {
      return `${profile.heightFeet}' ${profile.heightInches || 0}"`;
    }
    
    return 'Not set';
  };

  // If no user profile exists, show redirect to profile creation
  if (!userProfile && !loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#E6F3FF] to-[#D1E9FF] py-12 px-4 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-8 shadow-xl max-w-md w-full text-center"
        >
          <div className="w-20 h-20 bg-[#E8F4FF] rounded-full mx-auto flex items-center justify-center mb-6">
            <Activity className="w-12 h-12 text-[#4A90E2]" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Create Your Profile</h1>
          <p className="text-gray-600 mb-6">
            Before you can track your progress, you need to create an athlete profile. This helps us personalize your analytics.
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

  // If no workout history, show message to start tracking
  if (workoutHistory.length === 0 && !loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#E6F3FF] to-[#D1E9FF] py-12 px-4 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-8 shadow-xl max-w-md w-full text-center"
        >
          <div className="w-20 h-20 bg-[#E8F4FF] rounded-full mx-auto flex items-center justify-center mb-6">
            <Calendar className="w-12 h-12 text-[#4A90E2]" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">No Workout Data Yet</h1>
          <p className="text-gray-600 mb-6">
            Complete your first workout to start tracking your progress. Your analytics will appear here after you've logged some training sessions.
          </p>
          <button
            onClick={() => navigate('/workout')}
            className="px-6 py-3 bg-[#4A90E2] text-white rounded-lg font-medium hover:bg-[#357ABD] transition-colors shadow-md mx-auto"
          >
            Start Tracking Workouts
          </button>
        </motion.div>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#E6F3FF] to-[#D1E9FF] py-12 px-4 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#4A90E2] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#4A90E2] font-medium">Loading your progress data...</p>
        </div>
      </div>
    );
  }

  // Main stats from workout data
  const stats = getWorkoutStats();
  const exerciseProgressData = getExerciseProgressData();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#E6F3FF] to-[#D1E9FF] py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-6"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-[#E8F4FF] p-3 rounded-full">
                <Activity className="w-8 h-8 text-[#4A90E2]" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Progress Analytics</h1>
                <p className="text-gray-600">Track your fitness journey, {userProfile?.name}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Time filter button */}
              <div className="relative">
                <button
                  onClick={() => setShowTimeFilter(!showTimeFilter)}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Filter className="w-4 h-4" />
                  {timeRange === 'all' ? 'All Time' : timeRange === 'month' ? 'Last Month' : 'Last Week'}
                  <ChevronDown className="w-4 h-4" />
                </button>
                
                <AnimatePresence>
                  {showTimeFilter && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-10"
                    >
                      <button
                        onClick={() => {
                          setTimeRange('all');
                          setShowTimeFilter(false);
                        }}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors"
                      >
                        All Time
                      </button>
                      <button
                        onClick={() => {
                          setTimeRange('month');
                          setShowTimeFilter(false);
                        }}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors"
                      >
                        Last Month
                      </button>
                      <button
                        onClick={() => {
                          setTimeRange('week');
                          setShowTimeFilter(false);
                        }}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors"
                      >
                        Last Week
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              {/* Share with Max button */}
              <button
                onClick={handleShareWithMax}
                className="flex items-center gap-2 px-4 py-2 bg-[#4A90E2] text-white rounded-lg hover:bg-[#357ABD] transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                Share with Max
              </button>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
          <div className="flex flex-wrap border-b border-gray-200">
            <button
              className={`flex-1 py-4 px-3 sm:px-6 font-medium transition-colors text-sm sm:text-base ${
                activeTab === 'overview' ? "text-[#4A90E2] border-b-2 border-[#4A90E2]" : "text-gray-600 hover:bg-gray-50"
              }`}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>
            <button
              className={`flex-1 py-4 px-3 sm:px-6 font-medium transition-colors text-sm sm:text-base ${
                activeTab === 'exercises' ? "text-[#4A90E2] border-b-2 border-[#4A90E2]" : "text-gray-600 hover:bg-gray-50"
              }`}
              onClick={() => setActiveTab('exercises')}
            >
              Exercise Progress
            </button>
            <button
              className={`flex-1 py-4 px-3 sm:px-6 font-medium transition-colors text-sm sm:text-base ${
                activeTab === 'records' ? "text-[#4A90E2] border-b-2 border-[#4A90E2]" : "text-gray-600 hover:bg-gray-50"
              }`}
              onClick={() => setActiveTab('records')}
            >
              Personal Records
            </button>
            <button
              className={`flex-1 py-4 px-3 sm:px-6 font-medium transition-colors text-sm sm:text-base ${
                activeTab === 'bodyComp' ? "text-[#4A90E2] border-b-2 border-[#4A90E2]" : "text-gray-600 hover:bg-gray-50"
              }`}
              onClick={() => setActiveTab('bodyComp')}
            >
              Body Composition
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                {/* Key Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="bg-indigo-100 p-2 rounded-lg">
                        <Calendar className="w-5 h-5 text-indigo-600" />
                      </div>
                      <span className="text-gray-600 text-sm">Total Workouts</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-800">
                      {stats.totalWorkouts}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {timeRange === 'all' ? 'All time' : timeRange === 'month' ? 'Last 30 days' : 'Last 7 days'}
                    </div>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="bg-green-100 p-2 rounded-lg">
                        <ClockIcon className="w-5 h-5 text-green-600" />
                      </div>
                      <span className="text-gray-600 text-sm">Avg. Workout Time</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-800">
                      {formatTime(stats.avgDuration)}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Total: {formatTime(stats.totalDuration)}
                    </div>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="bg-amber-100 p-2 rounded-lg">
                        <Target className="w-5 h-5 text-amber-600" />
                      </div>
                      <span className="text-gray-600 text-sm">Completion Rate</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-800">
                      {stats.completionRate.toFixed(1)}%
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Sets completed vs. planned
                    </div>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="bg-red-100 p-2 rounded-lg">
                        <Dumbbell className="w-5 h-5 text-red-600" />
                      </div>
                      <span className="text-gray-600 text-sm">Top Exercise</span>
                    </div>
                    <div className="text-lg font-bold text-gray-800 truncate">
                      {stats.mostFrequentExercise}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Most frequently performed
                    </div>
                  </motion.div>
                </div>

                {/* Weekly Progress Chart */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm"
                >
                  <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <BarChart2 className="w-5 h-5 text-[#4A90E2]" />
                    Weekly Workout Frequency
                  </h2>
                  
                  <div className="h-64 mt-6">
                    {weeklyWorkouts.length > 0 ? (
                      <div className="flex h-full items-end space-x-4">
                        {weeklyWorkouts.map((week, index) => (
                          <div key={index} className="flex-1 flex flex-col items-center">
                            <div className="w-full flex justify-center mb-2">
                              <div
                                className="bg-[#4A90E2] rounded-t-lg"
                                style={{
                                  height: `${Math.max(20, (week.count / 7) * 100)}%`,
                                  width: '60%',
                                  minHeight: '20px'
                                }}
                              ></div>
                            </div>
                            <div className="text-xs text-gray-600">{week.week}</div>
                            <div className="text-sm font-semibold">{week.count}</div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <p className="text-gray-500">No weekly data available</p>
                      </div>
                    )}
                  </div>
                </motion.div>

                {/* Muscle Group Focus */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm"
                >
                  <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <Users className="w-5 h-5 text-[#4A90E2]" />
                    Muscle Group Focus
                  </h2>
                  
                  {muscleGroupData.length > 0 ? (
                    <div className="space-y-4">
                      {muscleGroupData.slice(0, 5).map((group, index) => (
                        <div key={index}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="font-medium text-gray-700">{group.name}</span>
                            <span className="text-gray-600">{group.count} exercises</span>
                          </div>
                          <div className="w-full bg-gray-100 rounded-full h-2.5">
                            <div
                              className="bg-[#4A90E2] h-2.5 rounded-full"
                              style={{ width: `${(group.count / muscleGroupData[0].count) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No muscle group data available</p>
                    </div>
                  )}
                </motion.div>
              </motion.div>
            )}

            {/* Exercise Progress Tab */}
            {activeTab === 'exercises' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                {/* Exercise Selector */}
                <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                  <h2 className="text-lg font-semibold text-gray-800 mb-4">Select Exercise</h2>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {uniqueExercises.map((exercise, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedExercise(exercise)}
                        className={`p-3 rounded-lg text-sm font-medium transition-colors ${
                          selectedExercise === exercise
                            ? 'bg-[#4A90E2] text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {exercise}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Progress Chart */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm"
                >
                  <h2 className="text-lg font-semibold text-gray-800 mb-2">Weight Progress</h2>
                  <p className="text-gray-500 text-sm mb-6">
                    {selectedExercise ? `Tracking max weight for ${selectedExercise}` : 'Select an exercise to see progress'}
                  </p>
                  
                  <div className="h-64">
                    {exerciseProgressData.length > 0 ? (
                      <div className="h-full">
                        {/* Simplified chart visualization */}
                        <div className="flex h-full items-end space-x-2">
                          {exerciseProgressData.map((data, index) => (
                            <div key={index} className="flex-1 flex flex-col items-center group relative">
                              <div 
                                className="w-full flex justify-center mb-2 relative"
                                style={{ height: '100%' }}
                              >
                                <div
                                  className="bg-[#4A90E2] rounded-t-lg w-4/5"
                                  style={{
                                    height: `${(data.weight / Math.max(...exerciseProgressData.map(d => d.weight))) * 100}%`,
                                    minHeight: '20px'
                                  }}
                                ></div>
                                
                                {/* Tooltip */}
                                <div className="opacity-0 group-hover:opacity-100 absolute bottom-full mb-2 bg-gray-800 text-white py-1 px-2 rounded text-xs whitespace-nowrap transition-opacity">
                                  {data.weight} lbs on {data.date}
                                </div>
                              </div>
                              <div className="text-xs text-gray-500 truncate w-full text-center">
                                {data.date.split('/').slice(0, 2).join('/')}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <p className="text-gray-500">
                          {selectedExercise 
                            ? `No progress data available for ${selectedExercise}` 
                            : 'Select an exercise to view progress'}
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>

                {/* Volume Progress */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm"
                >
                  <h2 className="text-lg font-semibold text-gray-800 mb-2">Volume Progress</h2>
                  <p className="text-gray-500 text-sm mb-6">
                    Total volume (weight × reps) over time
                  </p>
                  
                  <div className="h-64">
                    {exerciseProgressData.length > 0 ? (
                      <div className="h-full">
                        {/* Simplified volume chart visualization */}
                        <div className="flex h-full items-end space-x-2">
                          {exerciseProgressData.map((data, index) => (
                            <div key={index} className="flex-1 flex flex-col items-center group relative">
                              <div 
                                className="w-full flex justify-center mb-2 relative"
                                style={{ height: '100%' }}
                              >
                                <div
                                  className="bg-green-500 rounded-t-lg w-4/5"
                                  style={{
                                    height: `${(data.volume / Math.max(...exerciseProgressData.map(d => d.volume))) * 100}%`,
                                    minHeight: '20px'
                                  }}
                                ></div>
                                
                                {/* Tooltip */}
                                <div className="opacity-0 group-hover:opacity-100 absolute bottom-full mb-2 bg-gray-800 text-white py-1 px-2 rounded text-xs whitespace-nowrap transition-opacity">
                                  Volume: {data.volume} on {data.date}
                                </div>
                              </div>
                              <div className="text-xs text-gray-500 truncate w-full text-center">
                                {data.date.split('/').slice(0, 2).join('/')}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <p className="text-gray-500">
                          {selectedExercise 
                            ? `No volume data available for ${selectedExercise}` 
                            : 'Select an exercise to view volume progress'}
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>

                {/* Suggestions */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm"
                >
                  <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-[#4A90E2]" />
                    Improvement Suggestions
                  </h2>
                  
                  {selectedExercise && exerciseProgressData.length > 0 ? (
                    <div className="space-y-3">
                      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
                        <h3 className="text-blue-800 font-medium">Progressive Overload</h3>
                        <p className="text-blue-700 text-sm mt-1">
                          Try increasing weight by 5-10% or adding 1-2 more reps to your {selectedExercise} to keep making progress.
                        </p>
                      </div>
                      
                      <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-r-lg">
                        <h3 className="text-green-800 font-medium">Training Frequency</h3>
                        <p className="text-green-700 text-sm mt-1">
                          Consider training {selectedExercise} 2-3 times per week with sufficient recovery for optimal strength gains.
                        </p>
                      </div>
                      
                      <div className="bg-purple-50 border-l-4 border-purple-400 p-4 rounded-r-lg">
                        <h3 className="text-purple-800 font-medium">Technique Focus</h3>
                        <p className="text-purple-700 text-sm mt-1">
                          As weights increase, ensure your {selectedExercise} form remains strict for safety and effectiveness.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 text-gray-600">
                      <AlertTriangle className="w-5 h-5 text-amber-500" />
                      <p>More data needed for personalized suggestions</p>
                    </div>
                  )}
                </motion.div>
              </motion.div>
            )}

            {/* Personal Records Tab */}
            {activeTab === 'records' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Award className="w-6 h-6 text-[#4A90E2]" />
                  Your Personal Records
                </h2>
                
                {personalRecords.length > 0 ? (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {personalRecords.map((record, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-gray-800 truncate" title={record.exercise}>
                              {record.exercise}
                            </h3>
                            <p className="text-gray-500 text-sm mt-1">
                              {record.date}
                            </p>
                          </div>
                          <div className="bg-amber-100 text-amber-800 font-bold px-3 py-1 rounded-full text-sm">
                            PR
                          </div>
                        </div>
                        
                        <div className="mt-4 flex items-end gap-2">
                          <span className="text-2xl font-bold text-gray-800">{record.weight}</span>
                          <span className="text-gray-600 mb-0.5">lbs</span>
                          <span className="text-gray-500 text-sm ml-auto">
                            {record.reps} reps
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <Award className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">No personal records yet</p>
                    <p className="text-gray-500 text-sm max-w-md mx-auto">
                      Complete more workouts with challenging weights to establish your personal records.
                    </p>
                  </div>
                )}
              </motion.div>
            )}

            {/* Body Composition Tab */}
            {activeTab === 'bodyComp' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Ruler className="w-6 h-6 text-[#4A90E2]" />
                  Body Composition Tracking
                </h2>

                {/* Basic stats cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="bg-blue-100 p-2 rounded-lg">
                        <Ruler className="w-5 h-5 text-blue-600" />
                      </div>
                      <span className="text-gray-600 text-sm">Height</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-800">
                      {formatHeight(userProfile)}
                    </div>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="bg-green-100 p-2 rounded-lg">
                        <Scale className="w-5 h-5 text-green-600" />
                      </div>
                      <span className="text-gray-600 text-sm">Current Weight</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-800">
                      {userProfile?.weight ? `${userProfile.weight} ${userProfile.weightUnit || 'kg'}` : 'Not set'}
                    </div>
                    {userProfile?.weightHistory && userProfile.weightHistory.length > 0 && (
                      <div 
                        onClick={() => toggleHistoryVisibility('weight')}
                        className="text-xs text-[#4A90E2] mt-1 cursor-pointer flex items-center"
                      >
                        {showWeightHistory ? <ChevronUp className="w-3 h-3 mr-1" /> : <ChevronDown className="w-3 h-3 mr-1" />}
                        {userProfile.weightHistory.length} entries
                      </div>
                    )}
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="bg-purple-100 p-2 rounded-lg">
                        <Percent className="w-5 h-5 text-purple-600" />
                      </div>
                      <span className="text-gray-600 text-sm">Body Fat</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-800">
                      {userProfile?.bodyFat ? `${userProfile.bodyFat}%` : 'Not set'}
                    </div>
                    {userProfile?.bodyFatHistory && userProfile.bodyFatHistory.length > 0 && (
                      <div 
                        onClick={() => toggleHistoryVisibility('bodyFat')}
                        className="text-xs text-[#4A90E2] mt-1 cursor-pointer flex items-center"
                      >
                        {showBodyFatHistory ? <ChevronUp className="w-3 h-3 mr-1" /> : <ChevronDown className="w-3 h-3 mr-1" />}
                        {userProfile.bodyFatHistory.length} entries
                      </div>
                    )}
                  </motion.div>
                </div>

                {/* Weight History */}
                {userProfile?.weightHistory && userProfile.weightHistory.length > 0 && showWeightHistory && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm"
                  >
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      <Scale className="w-5 h-5 text-[#4A90E2]" />
                      Weight History
                    </h3>
                    
                    {/* Weight History Trend */}
                    <MeasurementTrend 
                      history={userProfile.weightHistory} 
                      label="Weight" 
                      color="#22c55e" 
                    />
                    
                    {/* Weight History Table */}
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">History Entries</h4>
                      <div className="bg-gray-50 rounded-lg p-3">
                        {renderHistoryEntries(userProfile.weightHistory, userProfile.weightUnit)}
                      </div>
                    </div>
                  </motion.div>
                )}
                
                {/* Body Fat History */}
                {userProfile?.bodyFatHistory && userProfile.bodyFatHistory.length > 0 && showBodyFatHistory && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm"
                  >
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      <Percent className="w-5 h-5 text-[#4A90E2]" />
                      Body Fat History
                    </h3>
                    
                    {/* Body Fat History Trend */}
                    <MeasurementTrend 
                      history={userProfile.bodyFatHistory} 
                      label="Body Fat" 
                      color="#a855f7" 
                    />
                    
                    {/* Body Fat History Table */}
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">History Entries</h4>
                      <div className="bg-gray-50 rounded-lg p-3">
                        {renderHistoryEntries(userProfile.bodyFatHistory, "%")}
                      </div>
                    </div>
                  </motion.div>
                )}
                
                {/* Body Measurements Section */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm"
                >
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <Ruler className="w-5 h-5 text-[#4A90E2]" />
                    Body Measurements
                  </h3>
                  
                  {userProfile?.bodyMeasurements ? (
                    <div className="space-y-8">
                      {/* Measurements Cards */}
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {['chest', 'waist', 'hips', 'thighs', 'arms'].map((part) => (
                          <div key={part} className="bg-gray-50 rounded-lg p-4">
                            <h4 className="text-sm font-medium text-gray-700 capitalize mb-1">{part}</h4>
                            <div className="text-xl font-bold text-gray-800">
                              {userProfile.bodyMeasurements[part] ? `${userProfile.bodyMeasurements[part]} cm` : '-'}
                            </div>
                            {userProfile.measurementHistory && 
                             userProfile.measurementHistory[part] && 
                             userProfile.measurementHistory[part].length > 0 && (
                              <div 
                                onClick={() => toggleHistoryVisibility('measurement', part)}
                                className="text-xs text-[#4A90E2] mt-1 cursor-pointer flex items-center"
                              >
                                {showMeasurementHistory[part] ? 
                                  <ChevronUp className="w-3 h-3 mr-1" /> : 
                                  <ChevronDown className="w-3 h-3 mr-1" />
                                }
                                History
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                      
                      {/* Measurement History Sections */}
                      {['chest', 'waist', 'hips', 'thighs', 'arms'].map((part) => (
                        userProfile.measurementHistory && 
                        userProfile.measurementHistory[part] && 
                        userProfile.measurementHistory[part].length > 0 &&
                        showMeasurementHistory[part] && (
                          <div key={`history-${part}`} className="border-t border-gray-200 pt-4">
                            <h4 className="text-md font-medium text-gray-800 capitalize mb-3 flex items-center gap-2">
                              <div className="w-2 h-2 bg-[#4A90E2] rounded-full"></div>
                              {part} Measurement History
                            </h4>
                            
                            {/* Measurement Trend */}
                            <MeasurementTrend 
                              history={userProfile.measurementHistory[part]} 
                              label={part.charAt(0).toUpperCase() + part.slice(1)} 
                              color="#4A90E2" 
                            />
                            
                            {/* Measurement History Table */}
                            <div className="mt-3 bg-gray-50 rounded-lg p-3">
                              {renderHistoryEntries(userProfile.measurementHistory[part], "cm")}
                            </div>
                          </div>
                        )
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No body measurement data available</p>
                      <button
                        onClick={() => navigate('/profile')}
                        className="mt-4 px-4 py-2 bg-[#4A90E2] text-white rounded-lg text-sm"
                      >
                        Add Measurements
                      </button>
                    </div>
                  )}
                </motion.div>
                
                {/* Composition Improvements */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm"
                >
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-[#4A90E2]" />
                    Body Composition Insights
                  </h3>
                  
                  {(userProfile?.weightHistory?.length > 1 || 
                    userProfile?.bodyFatHistory?.length > 1 || 
                    Object.values(userProfile?.measurementHistory || {}).some(arr => arr.length > 1)) ? (
                    <div className="space-y-4">
                      {/* Show insights based on available data */}
                      {userProfile?.weightHistory?.length > 1 && (
                        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
                          <h4 className="text-blue-800 font-medium">Weight Trend</h4>
                          <p className="text-blue-700 text-sm mt-1">
                            {userProfile.weightHistory[userProfile.weightHistory.length - 1].value > 
                             userProfile.weightHistory[0].value ? 
                              "You've been gaining weight over time. If this aligns with your goals, keep it up!" : 
                              "You've been losing weight over time. If this aligns with your goals, you're on the right track!"}
                          </p>
                        </div>
                      )}
                      
                      {userProfile?.bodyFatHistory?.length > 1 && (
                        <div className="bg-purple-50 border-l-4 border-purple-400 p-4 rounded-r-lg">
                          <h4 className="text-purple-800 font-medium">Body Composition Changes</h4>
                          <p className="text-purple-700 text-sm mt-1">
                            {userProfile.bodyFatHistory[userProfile.bodyFatHistory.length - 1].value < 
                             userProfile.bodyFatHistory[0].value ? 
                              "Your body fat percentage is decreasing. Great progress on improving your body composition!" : 
                              "Your body fat percentage is increasing. Consider adjusting your nutrition and training if fat loss is a goal."}
                          </p>
                        </div>
                      )}
                      
                      {userProfile?.measurementHistory?.waist?.length > 1 && (
                        <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-r-lg">
                          <h4 className="text-green-800 font-medium">Waist Measurement</h4>
                          <p className="text-green-700 text-sm mt-1">
                            {userProfile.measurementHistory.waist[userProfile.measurementHistory.waist.length - 1].value < 
                             userProfile.measurementHistory.waist[0].value ? 
                              "Your waist measurement is decreasing, which is often a good indicator of fat loss." : 
                              "Your waist measurement is increasing. This could be related to your current training and nutrition approach."}
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 text-gray-600">
                      <AlertTriangle className="w-5 h-5 text-amber-500" />
                      <p>More measurements needed for personalized insights</p>
                    </div>
                  )}
                  
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <h4 className="text-md font-medium text-gray-800 mb-3">Recommendations</h4>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2 text-sm text-gray-600">
                        <ChevronRight className="w-4 h-4 text-[#4A90E2] mt-0.5 flex-shrink-0" />
                        <span>Track your measurements consistently (every 2-4 weeks) for the most accurate progress tracking</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm text-gray-600">
                        <ChevronRight className="w-4 h-4 text-[#4A90E2] mt-0.5 flex-shrink-0" />
                        <span>Take measurements at the same time of day, preferably in the morning before eating</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm text-gray-600">
                        <ChevronRight className="w-4 h-4 text-[#4A90E2] mt-0.5 flex-shrink-0" />
                        <span>Remember that body composition changes may be more meaningful than scale weight alone</span>
                      </li>
                    </ul>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressPage;
```

### src/data/exercises.js

```js
// src/data/exercises.js 
export const EXERCISE_DATABASE = {
    "Chest": [
      { name: "Bench Press", equipment: ["Barbell", "Bench"], muscleGroups: ["Chest", "Triceps", "Shoulders"], difficulty: "Intermediate" },
      { name: "Push-ups", equipment: ["Bodyweight"], muscleGroups: ["Chest", "Triceps", "Shoulders"], difficulty: "Beginner" },
      { name: "Dumbbell Flyes", equipment: ["Dumbbells", "Bench"], muscleGroups: ["Chest"], difficulty: "Intermediate" },
      { name: "Chest Dips", equipment: ["Dip Bars"], muscleGroups: ["Chest", "Triceps"], difficulty: "Intermediate" },
      { name: "Cable Crossovers", equipment: ["Cable Machine"], muscleGroups: ["Chest"], difficulty: "Intermediate" }
    ],
    "Back": [
      { name: "Pull-ups", equipment: ["Pull-up Bar"], muscleGroups: ["Back", "Biceps"], difficulty: "Intermediate" },
      { name: "Deadlift", equipment: ["Barbell"], muscleGroups: ["Back", "Hamstrings", "Glutes"], difficulty: "Advanced" },
      { name: "Bent Over Rows", equipment: ["Barbell", "Dumbbells"], muscleGroups: ["Back", "Biceps"], difficulty: "Intermediate" },
      { name: "Lat Pulldowns", equipment: ["Cable Machine"], muscleGroups: ["Back", "Biceps"], difficulty: "Beginner" },
      { name: "T-Bar Rows", equipment: ["T-Bar"], muscleGroups: ["Back"], difficulty: "Intermediate" }
    ],
    "Legs": [
      { name: "Squats", equipment: ["Barbell", "Squat Rack"], muscleGroups: ["Quadriceps", "Glutes", "Hamstrings"], difficulty: "Intermediate" },
      { name: "Lunges", equipment: ["Bodyweight", "Dumbbells"], muscleGroups: ["Quadriceps", "Glutes", "Hamstrings"], difficulty: "Beginner" },
      { name: "Leg Press", equipment: ["Leg Press Machine"], muscleGroups: ["Quadriceps", "Glutes", "Hamstrings"], difficulty: "Beginner" },
      { name: "Romanian Deadlift", equipment: ["Barbell", "Dumbbells"], muscleGroups: ["Hamstrings", "Glutes", "Lower Back"], difficulty: "Intermediate" },
      { name: "Calf Raises", equipment: ["Machine", "Bodyweight"], muscleGroups: ["Calves"], difficulty: "Beginner" }
    ],
    "Shoulders": [
      { name: "Overhead Press", equipment: ["Barbell", "Dumbbells"], muscleGroups: ["Shoulders", "Triceps"], difficulty: "Intermediate" },
      { name: "Lateral Raises", equipment: ["Dumbbells"], muscleGroups: ["Shoulders"], difficulty: "Beginner" },
      { name: "Face Pulls", equipment: ["Cable Machine"], muscleGroups: ["Rear Deltoids", "Upper Back"], difficulty: "Intermediate" },
      { name: "Arnold Press", equipment: ["Dumbbells"], muscleGroups: ["Shoulders"], difficulty: "Intermediate" },
      { name: "Upright Rows", equipment: ["Barbell", "Dumbbells"], muscleGroups: ["Shoulders", "Traps"], difficulty: "Intermediate" }
    ],
    "Arms": [
      { name: "Bicep Curls", equipment: ["Dumbbells", "Barbell"], muscleGroups: ["Biceps"], difficulty: "Beginner" },
      { name: "Tricep Dips", equipment: ["Bodyweight", "Dip Bars"], muscleGroups: ["Triceps"], difficulty: "Intermediate" },
      { name: "Skull Crushers", equipment: ["Barbell", "Dumbbells"], muscleGroups: ["Triceps"], difficulty: "Intermediate" },
      { name: "Hammer Curls", equipment: ["Dumbbells"], muscleGroups: ["Biceps", "Forearms"], difficulty: "Beginner" },
      { name: "Cable Pushdowns", equipment: ["Cable Machine"], muscleGroups: ["Triceps"], difficulty: "Beginner" }
    ],
    "Core": [
      { name: "Plank", equipment: ["Bodyweight"], muscleGroups: ["Abs", "Core"], difficulty: "Beginner" },
      { name: "Russian Twists", equipment: ["Bodyweight", "Medicine Ball"], muscleGroups: ["Abs", "Obliques"], difficulty: "Beginner" },
      { name: "Hanging Leg Raises", equipment: ["Pull-up Bar"], muscleGroups: ["Abs", "Hip Flexors"], difficulty: "Intermediate" },
      { name: "Cable Crunches", equipment: ["Cable Machine"], muscleGroups: ["Abs"], difficulty: "Intermediate" },
      { name: "Ab Wheel Rollouts", equipment: ["Ab Wheel"], muscleGroups: ["Abs", "Core"], difficulty: "Advanced" }
    ],
    "Cardio": [
      { name: "Running", equipment: ["None", "Treadmill"], muscleGroups: ["Full Body"], difficulty: "Beginner to Advanced" },
      { name: "Cycling", equipment: ["Bicycle", "Exercise Bike"], muscleGroups: ["Legs", "Core"], difficulty: "Beginner to Advanced" },
      { name: "Jump Rope", equipment: ["Jump Rope"], muscleGroups: ["Full Body"], difficulty: "Beginner to Advanced" },
      { name: "High Knees", equipment: ["Bodyweight"], muscleGroups: ["Legs", "Core"], difficulty: "Beginner" },
      { name: "Burpees", equipment: ["Bodyweight"], muscleGroups: ["Full Body"], difficulty: "Intermediate" }
    ]
  };
```

### src/components/NavigationMenu.jsx

```jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Home, MessageSquare, Dumbbell, UserCircle, Activity } from 'lucide-react';

const NavigationMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Close menu when user navigates or presses escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const menuItems = [
    { path: '/', label: 'Home', icon: Home, description: 'Return to homepage' },
    { path: '/chat', label: 'Max Chat', icon: MessageSquare, description: 'Chat with your AI fitness coach' },
    { path: '/workout', label: 'Start Training', icon: Dumbbell, description: 'Create and track workouts', isNew: true },
    { path: '/profile', label: 'Athlete Profile', icon: UserCircle, description: 'Manage your personal profile' },
    { path: '/progress', label: 'Track Progress', icon: Activity, description: 'View your fitness analytics and progress' },
  ];

  const handleNavigate = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  return (
    <nav className="fixed top-4 right-4 z-50" aria-label="Main Navigation">
      {/* Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-all border border-[#BEE3F8] text-[#4A90E2] hover:bg-[#E8F4FF]"
        whileTap={{ scale: 0.95 }}
        aria-expanded={isOpen}
        aria-controls="navigation-menu"
        aria-label={isOpen ? "Close menu" : "Open menu"}
      >
        {isOpen ? <X className="w-6 h-6" aria-hidden="true" /> : <Menu className="w-6 h-6" aria-hidden="true" />}
      </motion.button>

      {/* Menu Items */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-20"
              onClick={() => setIsOpen(false)}
              aria-hidden="true"
            />

            {/* Menu */}
            <motion.div
              id="navigation-menu"
              role="menu"
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              className="absolute top-14 right-0 bg-white rounded-lg shadow-xl border border-[#BEE3F8] overflow-hidden min-w-[200px]"
            >
              {menuItems.map((item, index) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                
                return (
                  <motion.button
                    key={item.path}
                    onClick={() => handleNavigate(item.path)}
                    className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-[#E8F4FF] transition-colors ${
                      index !== menuItems.length - 1 ? 'border-b border-[#BEE3F8]' : ''
                    } ${isActive ? 'bg-[#E8F4FF] text-[#4A90E2]' : 'text-gray-700'}`}
                    whileHover={{ x: 4 }}
                    role="menuitem"
                    aria-current={isActive ? "page" : undefined}
                    aria-label={`${item.label} - ${item.description}`}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? 'text-[#4A90E2]' : 'text-gray-500'}`} aria-hidden="true" />
                    <span className="font-medium">{item.label}</span>
                    {item.isNew && (
                      <span 
                        className="ml-auto text-xs px-2 py-1 bg-[#4A90E2] text-white rounded-full"
                        aria-label="New feature"
                      >
                        New
                      </span>
                    )}
                  </motion.button>
                );
              })}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default NavigationMenu;
```

### src/components/MobileAppInstallBanner.jsx

```jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, ChevronRight, Dumbbell, Activity, UserCircle } from 'lucide-react';

const MobileAppInstallBanner = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [installSource, setInstallSource] = useState('auto'); // 'auto' or 'manual'
  
  useEffect(() => {
    // Check if user is on mobile
    const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    // Check if the app is already installed (in standalone mode or PWA)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                         window.navigator.standalone || 
                         document.referrer.includes('android-app://');
    
    // Only show banner if on mobile and not already installed
    if (isMobile && !isStandalone) {
      // Check for returning users (more aggressive promotion)
      const isReturningUser = localStorage.getItem('max_coach_visited');
      const lastPrompt = localStorage.getItem('max_coach_last_prompt');
      const currentDate = new Date().toISOString().split('T')[0];
      
      // Set as visited
      localStorage.setItem('max_coach_visited', 'true');
      
      // Wait before showing the banner (shorter time for returning users)
      const timer = setTimeout(() => {
        setShowBanner(true);
        setInstallSource('auto');
        localStorage.setItem('max_coach_last_prompt', currentDate);
      }, isReturningUser && lastPrompt !== currentDate ? 1500 : 3000);
      
      return () => clearTimeout(timer);
    }
    
    // Listen for beforeinstallprompt event to capture the deferred prompt
    const handleBeforeInstallPrompt = (e) => {
      // Prevent Chrome 76+ from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later
      setDeferredPrompt(e);
      // Show the banner
      setShowBanner(true);
      setInstallSource('browser');
    };
    
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);
  
  // Handle the install action
  const handleInstallClick = async () => {
    if (deferredPrompt) {
      // Show the install prompt
      deferredPrompt.prompt();
      
      // Wait for the user to respond to the prompt
      const { outcome } = await deferredPrompt.userChoice;
      
      // We've used the prompt, and can't use it again, discard it
      setDeferredPrompt(null);
      
      // Analytics
      const installAction = {
        outcome,
        source: installSource,
        timestamp: new Date().toISOString()
      };
      
      // Save install attempt data locally
      const attempts = JSON.parse(localStorage.getItem('max_coach_install_attempts') || '[]');
      attempts.push(installAction);
      localStorage.setItem('max_coach_install_attempts', JSON.stringify(attempts));
      
      if (outcome === 'accepted') {
        setShowBanner(false);
      }
    } else {
      // Fallback for browsers that don't support beforeinstallprompt
      setShowBanner(false);
      // If iOS, show a hint how to add to home screen
      const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
      if (isIOS) {
        alert("To install Max AI Coach on your iOS device: tap the share icon at the bottom of your screen, then 'Add to Home Screen'. You'll get full-screen experience and offline access to your workout data.");
      }
    }
  };
  
  if (!showBanner) return null;
  
  return (
    <AnimatePresence>
      <motion.div 
        initial={{ y: 100, opacity: 0 }} 
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-0 left-0 right-0 bg-white shadow-lg rounded-t-xl z-50"
        role="alert"
        aria-labelledby="install-banner-title"
      >
        <div className="p-4 flex items-center">
          <div className="mr-4">
            <div className="bg-[#4A90E2] text-white p-2 rounded-full">
              <Download className="w-6 h-6" aria-hidden="true" />
            </div>
          </div>
          
          <div className="flex-1">
            <h3 id="install-banner-title" className="font-semibold text-gray-800">Install Max AI Coach</h3>
            <p className="text-sm text-gray-600">Add to home screen for offline access, workout tracking, and progress analytics</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setShowBanner(false)} 
              className="p-2 text-gray-400 hover:text-gray-600"
              aria-label="Dismiss installation prompt"
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </button>
            
            <button 
              onClick={handleInstallClick}
              className="bg-[#4A90E2] text-white px-4 py-2 rounded-lg flex items-center gap-1"
              aria-label="Install Max AI Coach as a home screen app"
            >
              Install <ChevronRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>
        
        <div className="px-4 pb-3 flex justify-between text-xs text-gray-500 border-t border-gray-100 pt-2">
          <div className="flex items-center">
            <Dumbbell className="w-3 h-3 mr-1" aria-hidden="true" />
            <span>Workout tracking</span>
          </div>
          <div className="flex items-center">
            <Activity className="w-3 h-3 mr-1" aria-hidden="true" />
            <span>Progress analytics</span>
          </div>
          <div className="flex items-center">
            <UserCircle className="w-3 h-3 mr-1" aria-hidden="true" />
            <span>Offline access</span>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default MobileAppInstallBanner;
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
// src/components/workout/tabs/MyWorkoutsTab.jsx (updated version)
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <h2 className="text-xl font-semibold text-gray-800">Your Workout Plans</h2>
        <div className="flex gap-3 w-full sm:w-auto">
          <button
            onClick={handleQuickStartWorkout}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 bg-[#4A90E2] text-white rounded-lg hover:bg-[#357ABD] transition-colors"
          >
            <Play className="w-5 h-5" />
            Quick Start
          </button>
          <button
            onClick={() => setCurrentTab("create")}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 bg-[#E8F4FF] text-[#4A90E2] rounded-lg hover:bg-[#D1E8FF] transition-colors"
          >
            <Plus className="w-5 h-5" />
            New Plan
          </button>
        </div>
      </div>

      {workouts.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600 mb-4">You haven't created any workout plans yet.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={handleQuickStartWorkout}
              className="px-6 py-3 bg-[#4A90E2] text-white rounded-lg hover:bg-[#357ABD] transition-colors"
            >
              Quick Start Workout
            </button>
            <button
              onClick={() => setCurrentTab("create")}
              className="px-6 py-3 bg-[#E8F4FF] text-[#4A90E2] rounded-lg hover:bg-[#D1E8FF] transition-colors"
            >
              Create a Workout Plan
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {workouts.map(workout => (
            <motion.div
              key={workout.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="p-4 border-b border-gray-100">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-semibold text-gray-800">{workout.name}</h3>
                  <button 
                    onClick={() => handleDeleteWorkout(workout.id)}
                    className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
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
      className="space-y-6 w-full"
    >
      {/* Workout title and timer section */}
      <div className="flex flex-col sm:flex-row justify-between w-full gap-4">
        <div className="w-full sm:w-auto">
          <input
            type="text"
            value={activeWorkout.name}
            onChange={(e) => setActiveWorkout(prev => ({ ...prev, name: e.target.value }))}
            className="bg-transparent border-b border-gray-300 focus:border-[#4A90E2] focus:outline-none px-2 py-1 text-xl font-semibold w-full sm:w-auto"
            placeholder="Name your workout"
          />
          <p className="text-sm text-gray-600 mt-1">Workout in progress</p>
        </div>
        
        <div className="flex items-center gap-4 self-end sm:self-auto">
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

      {/* No exercises state */}
      {activeWorkout.exercises.length === 0 ? (
        <div 
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:bg-gray-50 transition-colors w-full"
          onClick={() => setShowExerciseModal(true)}
        >
          <Plus className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-2">No exercises added yet</p>
          <p className="text-sm text-gray-500">Click to add exercises to your workout</p>
        </div>
      ) : (
        <div className="space-y-4 w-full">
          {activeWorkout.exercises.map((exercise, exerciseIndex) => {
            const completedSets = exercise.sets.filter(set => set.completed).length;
            return (
              <div key={exerciseIndex} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm w-full">
                <div className="flex justify-between items-center p-4 bg-gray-50 border-b border-gray-200">
                  <h3 className="font-medium text-gray-800">{exercise.name}</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">
                      {completedSets}/{exercise.sets.length} sets completed
                    </span>
                  </div>
                </div>
                
                <div className="p-4 overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-gray-600">
                        <th className="pb-3 pr-4 whitespace-nowrap">Set</th>
                        <th className="pb-3 pr-4 whitespace-nowrap">Weight</th>
                        <th className="pb-3 pr-4 whitespace-nowrap">Reps</th>
                        <th className="pb-3 pr-4 whitespace-nowrap">Actual</th>
                        <th className="pb-3"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {exercise.sets.map((set, setIndex) => (
                        <tr key={setIndex} className={set.completed ? 'bg-green-50' : ''}>
                          <td className="py-3 pr-4 whitespace-nowrap">{setIndex + 1} {set.type !== 'normal' && `(${set.type})`}</td>
                          <td className="py-3 pr-4">
                            <div className="flex items-center">
                              <input
                                type="number"
                                min="0"
                                value={set.actualWeight}
                                onChange={(e) => {
                                  const newActiveWorkout = { ...activeWorkout };
                                  newActiveWorkout.exercises[exerciseIndex].sets[setIndex].actualWeight = parseFloat(e.target.value) || 0;
                                  setActiveWorkout(newActiveWorkout);
                                }}
                                className={`w-16 p-2 border rounded ${
                                  set.completed ? 'border-green-300 bg-green-50' : 'border-gray-300'
                                }`}
                                disabled={set.completed}
                                placeholder="0"
                              />
                              <span className="ml-1 text-gray-500 text-xs">{weightUnit}</span>
                            </div>
                          </td>
                          <td className="py-3 pr-4 whitespace-nowrap">{set.reps || 0}</td>
                          <td className="py-3 pr-4">
                            <input
                              type="number"
                              min="0"
                              max={99}
                              value={set.actualReps || ''}
                              onChange={(e) => {
                                const newActiveWorkout = { ...activeWorkout };
                                newActiveWorkout.exercises[exerciseIndex].sets[setIndex].actualReps = parseInt(e.target.value, 10) || 0;
                                setActiveWorkout(newActiveWorkout);
                              }}
                              className={`w-16 p-2 border rounded ${
                                set.completed ? 'border-green-300 bg-green-50' : 'border-gray-300'
                              }`}
                              placeholder="0"
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
                                onClick={() => handleSetCompleted(exerciseIndex, setIndex, true, set.actualReps || 0, set.actualWeight)}
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
      <div className="flex justify-center w-full">
        <button
          onClick={() => setShowExerciseModal(true)}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-[#E8F4FF] text-[#4A90E2] rounded-lg hover:bg-[#D1E8FF] transition-colors w-full sm:w-auto"
        >
          <Plus className="w-5 h-5" />
          Add Exercise
        </button>
      </div>

      {/* Footer Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
        <button
          onClick={handleSaveActiveWorkout}
          className="flex items-center justify-center gap-2 px-6 py-3 sm:py-4 bg-[#E8F4FF] text-[#4A90E2] rounded-lg hover:bg-[#D1E8FF] transition-colors order-2 sm:order-1"
        >
          <Save className="w-5 h-5" />
          Save as Template
        </button>
        
        <button
          onClick={handleCompleteWorkout}
          className="flex items-center justify-center gap-2 px-6 py-3 sm:py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors order-1 sm:order-2"
        >
          <CheckCircle className="w-5 h-5" />
          Complete Workout
        </button>
      </div>
      
      <button
        onClick={handleCancelWorkout}
        className="px-6 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors w-full"
      >
        Cancel Workout
      </button>
    </motion.div>
  );
};

export default ActiveWorkoutTab;
```

### src/components/workout/tabs/CreateWorkoutTab.jsx

```jsx
// src/components/workout/tabs/CreateWorkoutTab.jsx (updated version)
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
                    <div className="mb-4 overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="text-left text-gray-600">
                            <th className="pb-3 pr-2">Set</th>
                            <th className="pb-3 pr-2">Weight</th>
                            <th className="pb-3 pr-2">Reps</th>
                            <th className="pb-3 pr-2">Type</th>
                            <th className="pb-3"></th>
                          </tr>
                        </thead>
                        <tbody>
                          {exercise.sets.map((set, setIndex) => (
                            <tr key={setIndex}>
                              <td className="py-3 pr-2">{setIndex + 1}</td>
                              <td className="py-3 pr-2">
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
                              <td className="py-3 pr-2">
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
                              <td className="py-3 pr-2">
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

        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
          <button
            onClick={() => {
              setNewWorkout({
                name: "",
                exercises: [],
                description: ""
              });
              setCurrentTab("my-workouts");
            }}
            className="px-6 py-3 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors order-2 sm:order-1"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveWorkout}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-[#4A90E2] text-white rounded-lg hover:bg-[#357ABD] transition-colors disabled:opacity-50 disabled:cursor-not-allowed order-1 sm:order-2"
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

### src/components/workout/tabs/HistoryTab.jsx

```jsx
// src/components/workout/tabs/HistoryTab.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Edit } from 'lucide-react';

const HistoryTab = ({ 
  workoutHistory, 
  formatTime, 
  weightUnit, 
  setCurrentTab, 
  workouts, 
  handleEditWorkout 
}) => {
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
              <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 sm:p-5 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{workout.name}</h3>
                    <p className="text-sm text-gray-600">
                      {startDate.toLocaleDateString()} at {startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 bg-[#E8F4FF] px-3 py-1 rounded-full">
                      <Clock className="w-4 h-4 text-[#4A90E2]" />
                      <span className="text-sm font-medium text-[#4A90E2]">
                        {formatTime(workout.duration)}
                      </span>
                    </div>
                    {/* Edit Button */}
                    <button
                      onClick={() => handleEditWorkout(workout, index)}
                      className="flex items-center gap-1 px-3 py-1 bg-[#E8F4FF] text-[#4A90E2] rounded-full hover:bg-[#D1E8FF] transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </button>
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
                        
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm">
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

### src/components/workout/modals/ExerciseSelectionModal.jsx

```jsx
// src/components/workout/modals/ExerciseSelectionModal.jsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Dumbbell, Plus } from 'lucide-react';

const ExerciseSelectionModal = ({ 
  showExerciseModal, 
  setShowExerciseModal, 
  selectedCategory, 
  setSelectedCategory, 
  handleAddExercise, 
  EXERCISE_DATABASE,
  setShowCustomExerciseModal
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
                {/* Custom Exercise Button */}
                <button
                  onClick={() => {
                    setShowExerciseModal(false);
                    setShowCustomExerciseModal(true);
                  }}
                  className="px-4 py-2 rounded-full text-sm font-medium transition-colors bg-[#E8F4FF] text-[#4A90E2] hover:bg-[#D1E8FF] flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" />
                  Create Custom
                </button>

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

### src/components/workout/modals/EditHistoryModal.jsx

```jsx
// src/components/workout/modals/EditHistoryModal.jsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Save } from 'lucide-react';

const EditHistoryModal = ({ 
  showEditModal, 
  setShowEditModal, 
  editingWorkout,
  setEditingWorkout,
  saveEditedWorkout,
  weightUnit
}) => {
  if (!editingWorkout) return null;
  
  return (
    <AnimatePresence>
      {showEditModal && (
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
              <h3 className="text-xl font-semibold text-gray-800">Edit Workout History</h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 flex-1 overflow-y-auto">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Workout Name</label>
                <input
                  type="text"
                  value={editingWorkout.name}
                  onChange={(e) => setEditingWorkout({...editingWorkout, name: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A90E2] focus:border-transparent"
                />
              </div>
              
              <div className="space-y-6">
                {editingWorkout.exercises.map((exercise, exerciseIndex) => (
                  <div key={exerciseIndex} className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="p-4 bg-gray-50 border-b border-gray-200">
                      <h4 className="font-medium text-gray-800">{exercise.name}</h4>
                    </div>
                    <div className="p-4">
                      <table className="w-full">
                        <thead>
                          <tr className="text-left text-gray-600 text-sm">
                            <th className="pb-2">Set</th>
                            <th className="pb-2">Weight ({weightUnit})</th>
                            <th className="pb-2">Reps</th>
                          </tr>
                        </thead>
                        <tbody>
                          {exercise.sets.map((set, setIndex) => (
                            <tr key={setIndex}>
                              <td className="py-2">{setIndex + 1}</td>
                              <td className="py-2">
                                <input
                                  type="number"
                                  min="0"
                                  value={set.actualWeight || set.weight}
                                  onChange={(e) => {
                                    const updatedExercises = [...editingWorkout.exercises];
                                    updatedExercises[exerciseIndex].sets[setIndex].actualWeight = parseFloat(e.target.value) || 0;
                                    setEditingWorkout({...editingWorkout, exercises: updatedExercises});
                                  }}
                                  className="w-16 p-2 border border-gray-300 rounded"
                                />
                              </td>
                              <td className="py-2">
                                <input
                                  type="number"
                                  min="0"
                                  max="99"
                                  value={set.actualReps || set.reps}
                                  onChange={(e) => {
                                    const updatedExercises = [...editingWorkout.exercises];
                                    updatedExercises[exerciseIndex].sets[setIndex].actualReps = parseInt(e.target.value, 10) || 0;
                                    setEditingWorkout({...editingWorkout, exercises: updatedExercises});
                                  }}
                                  className="w-16 p-2 border border-gray-300 rounded"
                                />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      
                      <button
                        onClick={() => {
                          const updatedExercises = [...editingWorkout.exercises];
                          updatedExercises[exerciseIndex].sets.push({
                            weight: 0,
                            reps: 0,
                            type: "normal",
                            completed: true,
                            actualReps: 0,
                            actualWeight: 0
                          });
                          setEditingWorkout({...editingWorkout, exercises: updatedExercises});
                        }}
                        className="flex items-center gap-1 mt-3 text-sm text-[#4A90E2] hover:text-[#357ABD] transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        Add Set
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-6 py-3 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  saveEditedWorkout();
                  setShowEditModal(false);
                }}
                className="px-6 py-3 bg-[#4A90E2] text-white rounded-lg hover:bg-[#357ABD] transition-colors flex items-center gap-2"
              >
                <Save className="w-5 h-5" />
                Save Changes
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EditHistoryModal;
```

### src/components/workout/modals/CustomExerciseModal.jsx

```jsx
// src/components/workout/modals/CustomExerciseModal.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Plus } from 'lucide-react';

const CustomExerciseModal = ({ 
  showCustomExerciseModal, 
  setShowCustomExerciseModal,
  addCustomExercise
}) => {
  const [newExercise, setNewExercise] = useState({
    name: '',
    equipment: [''],
    muscleGroups: [''],
    difficulty: 'Beginner'
  });
  
  const difficultyOptions = ['Beginner', 'Intermediate', 'Advanced'];
  
  const handleAddEquipment = () => {
    setNewExercise({
      ...newExercise,
      equipment: [...newExercise.equipment, '']
    });
  };
  
  const handleRemoveEquipment = (index) => {
    const updatedEquipment = [...newExercise.equipment];
    updatedEquipment.splice(index, 1);
    setNewExercise({
      ...newExercise,
      equipment: updatedEquipment
    });
  };
  
  const handleEquipmentChange = (index, value) => {
    const updatedEquipment = [...newExercise.equipment];
    updatedEquipment[index] = value;
    setNewExercise({
      ...newExercise,
      equipment: updatedEquipment
    });
  };
  
  const handleAddMuscleGroup = () => {
    setNewExercise({
      ...newExercise,
      muscleGroups: [...newExercise.muscleGroups, '']
    });
  };
  
  const handleRemoveMuscleGroup = (index) => {
    const updatedMuscleGroups = [...newExercise.muscleGroups];
    updatedMuscleGroups.splice(index, 1);
    setNewExercise({
      ...newExercise,
      muscleGroups: updatedMuscleGroups
    });
  };
  
  const handleMuscleGroupChange = (index, value) => {
    const updatedMuscleGroups = [...newExercise.muscleGroups];
    updatedMuscleGroups[index] = value;
    setNewExercise({
      ...newExercise,
      muscleGroups: updatedMuscleGroups
    });
  };
  
  const handleSave = () => {
    // Filter out empty fields
    const cleanedExercise = {
      ...newExercise,
      equipment: newExercise.equipment.filter(item => item.trim()),
      muscleGroups: newExercise.muscleGroups.filter(item => item.trim())
    };
    
    if (cleanedExercise.name.trim() && 
        cleanedExercise.equipment.length > 0 && 
        cleanedExercise.muscleGroups.length > 0) {
      addCustomExercise(cleanedExercise);
      setShowCustomExerciseModal(false);
      // Reset form
      setNewExercise({
        name: '',
        equipment: [''],
        muscleGroups: [''],
        difficulty: 'Beginner'
      });
    }
  };
  
  return (
    <AnimatePresence>
      {showCustomExerciseModal && (
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
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-xl font-semibold text-gray-800">Create Custom Exercise</h3>
              <button
                onClick={() => setShowCustomExerciseModal(false)}
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Exercise Name</label>
                <input
                  type="text"
                  value={newExercise.name}
                  onChange={(e) => setNewExercise({...newExercise, name: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A90E2] focus:border-transparent"
                  placeholder="e.g., Cable Hamstring Curl"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Equipment</label>
                {newExercise.equipment.map((item, index) => (
                  <div key={`equipment-${index}`} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => handleEquipmentChange(index, e.target.value)}
                      className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A90E2] focus:border-transparent"
                      placeholder="e.g., Cable Machine"
                    />
                    {newExercise.equipment.length > 1 && (
                      <button
                        onClick={() => handleRemoveEquipment(index)}
                        className="p-3 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={handleAddEquipment}
                  className="flex items-center gap-1 text-sm text-[#4A90E2] hover:text-[#357ABD] transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Equipment
                </button>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Muscle Groups</label>
                {newExercise.muscleGroups.map((item, index) => (
                  <div key={`muscle-${index}`} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => handleMuscleGroupChange(index, e.target.value)}
                      className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A90E2] focus:border-transparent"
                      placeholder="e.g., Hamstrings"
                    />
                    {newExercise.muscleGroups.length > 1 && (
                      <button
                        onClick={() => handleRemoveMuscleGroup(index)}
                        className="p-3 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={handleAddMuscleGroup}
                  className="flex items-center gap-1 text-sm text-[#4A90E2] hover:text-[#357ABD] transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Muscle Group
                </button>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
                <div className="flex gap-2">
                  {difficultyOptions.map((option) => (
                    <button
                      key={option}
                      onClick={() => setNewExercise({...newExercise, difficulty: option})}
                      className={`flex-1 p-3 rounded-lg border ${
                        newExercise.difficulty === option
                          ? 'bg-[#E8F4FF] border-[#4A90E2] text-[#4A90E2]'
                          : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setShowCustomExerciseModal(false)}
                className="px-6 py-3 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-3 bg-[#4A90E2] text-white rounded-lg hover:bg-[#357ABD] transition-colors flex items-center gap-2"
                disabled={!newExercise.name.trim()}
              >
                <Check className="w-5 h-5" />
                Create Exercise
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CustomExerciseModal;
```

### src/components/progress/ProgressDataContent.jsx

```jsx
// src/components/progress/ProgressDataContent.jsx
import React from 'react';
import { Activity, Award, BarChart2, Scale, Ruler, Percent } from 'lucide-react';

const ProgressDataContent = ({ data }) => {
  if (!data) return null;
  
  // Helper to format time
  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Common section - Stats
  const renderStats = () => {
    const stats = data.stats;
    if (!stats) return null;
    
    return (
      <div className="mb-4">
        <h4 className="font-medium text-gray-700 mb-2">Stats</h4>
        <div className="grid grid-cols-2 gap-2">
          <div className="text-gray-700">Total Workouts: <span className="font-medium">{stats.totalWorkouts}</span></div>
          <div className="text-gray-700">Avg Duration: <span className="font-medium">{formatTime(stats.avgDuration)}</span></div>
          <div className="text-gray-700">Completion Rate: <span className="font-medium">{stats.completionRate.toFixed(1)}%</span></div>
          <div className="text-gray-700">Top Exercise: <span className="font-medium">{stats.mostFrequentExercise}</span></div>
        </div>
      </div>
    );
  };
  
  if (data.tab === 'overview') {
    return (
      <div>
        {renderStats()}
        
        {data.muscleGroupData && data.muscleGroupData.length > 0 && (
          <div className="mb-4">
            <h4 className="font-medium text-gray-700 mb-2">Top Muscle Groups</h4>
            <div className="space-y-2">
              {data.muscleGroupData.slice(0, 3).map((group, index) => (
                <div key={index} className="flex justify-between">
                  <span className="text-gray-700">{group.name}</span>
                  <span className="text-gray-700">{group.count} exercises</span>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {data.weeklyWorkouts && data.weeklyWorkouts.length > 0 && (
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Weekly Frequency</h4>
            <div className="space-y-1">
              {data.weeklyWorkouts.map((week, index) => (
                <div key={index} className="flex justify-between">
                  <span className="text-gray-700">{week.week}</span>
                  <span className="text-gray-700">{week.count} workouts</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }
  
  if (data.tab === 'exercises' && data.selectedExercise) {
    return (
      <div>
        <h4 className="font-medium text-gray-700 mb-2">Exercise Progress: {data.selectedExercise}</h4>
        {data.exerciseProgressData && data.exerciseProgressData.length > 0 ? (
          <div className="space-y-2">
            {data.exerciseProgressData.slice(-3).map((entry, index) => (
              <div key={index} className="flex justify-between">
                <span className="text-gray-700">{entry.date}</span>
                <span className="text-gray-700">{entry.weight} lbs</span>
              </div>
            ))}
            <div className="text-gray-700 text-xs italic mt-1">
              Showing last 3 of {data.exerciseProgressData.length} entries
            </div>
          </div>
        ) : (
          <div className="text-gray-700">No progress data available</div>
        )}
      </div>
    );
  }
  
  if (data.tab === 'records') {
    return (
      <div>
        <h4 className="font-medium text-gray-700 mb-2">Top Personal Records</h4>
        {data.personalRecords && data.personalRecords.length > 0 ? (
          <div className="space-y-2">
            {data.personalRecords.slice(0, 3).map((record, index) => (
              <div key={index} className="flex justify-between">
                <span className="text-gray-700">{record.exercise}</span>
                <span className="text-gray-700">{record.weight} lbs × {record.reps}</span>
              </div>
            ))}
            <div className="text-gray-700 text-xs italic mt-1">
              Showing top 3 of {data.personalRecords.length} records
            </div>
          </div>
        ) : (
          <div className="text-gray-700">No personal records available</div>
        )}
      </div>
    );
  }
  
  if (data.tab === 'bodyComp') {
    return (
      <div>
        <h4 className="font-medium text-gray-700 mb-2">Body Composition</h4>
        <div className="space-y-3">
          {data.weightHistory && data.weightHistory.length > 0 && (
            <div>
              <div className="text-gray-700">Current Weight: {data.weightHistory[data.weightHistory.length - 1].value} {data.weightHistory[data.weightHistory.length - 1].unit}</div>
              <div className="text-gray-700 text-xs">From {data.weightHistory.length} measurements</div>
            </div>
          )}
          
          {data.bodyFatHistory && data.bodyFatHistory.length > 0 && (
            <div>
              <div className="text-gray-700">Current Body Fat: {data.bodyFatHistory[data.bodyFatHistory.length - 1].value}%</div>
              <div className="text-gray-700 text-xs">From {data.bodyFatHistory.length} measurements</div>
            </div>
          )}
          
          {data.bodyMeasurements && Object.keys(data.bodyMeasurements).some(key => data.bodyMeasurements[key]) && (
            <div>
              <div className="text-gray-700">Key Measurements:</div>
              <div className="grid grid-cols-2 gap-1 mt-1">
                {Object.entries(data.bodyMeasurements)
                  .filter(([_, value]) => value)
                  .map(([key, value]) => (
                    <div key={key} className="text-gray-700 text-sm capitalize">
                      {key}: {value} cm
                    </div>
                  ))
                }
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
  
  return <div className="text-gray-700">Progress data shared</div>;
};

export default ProgressDataContent;
```
