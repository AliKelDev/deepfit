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
  Calendar
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
  
  // Add a temporary weight state to hold the input value before saving
  const [tempWeight, setTempWeight] = useState("");
  
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
    // New body composition fields
    heightUnit: "cm",
    height: "",
    heightFeet: "",
    heightInches: "",
    weightUnit: "kg",
    weight: "",
    bodyFat: "",
    bodyMeasurements: {
      chest: "",
      waist: "",
      hips: "",
      thighs: "",
      arms: ""
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

  // Set tempWeight when editing a profile
  useEffect(() => {
    if (editingProfile && editingProfile.weight) {
      setTempWeight(editingProfile.weight);
    } else {
      setTempWeight("");
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
      bodyMeasurements: {
        chest: "",
        waist: "",
        hips: "",
        thighs: "",
        arms: ""
      },
      weightHistory: []
    });
    setTempWeight("");
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
      bodyMeasurements: {
        chest: "",
        waist: "",
        hips: "",
        thighs: "",
        arms: ""
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
      ...(profile.bodyMeasurements && { bodyMeasurements: profile.bodyMeasurements }),
      ...(profile.weightHistory && { weightHistory: profile.weightHistory || [] })
    };

    setFormData(enhancedProfile);
    setTempWeight(enhancedProfile.weight || "");
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

  // Update the weight input handler to only update the temporary state
  const handleWeightInputChange = (value) => {
    setTempWeight(value);
  };

  // Create a new function to save the weight to history
  const saveWeightToHistory = () => {
    if (!tempWeight || isNaN(parseFloat(tempWeight))) return;
    
    // Create a new weight history entry
    const newWeightEntry = {
      date: new Date().toISOString(),
      weight: parseFloat(tempWeight) || 0,
      unit: formData.weightUnit
    };
    
    setFormData(prev => ({
      ...prev,
      weight: tempWeight,
      weightHistory: [...(prev.weightHistory || []), newWeightEntry]
    }));
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
    } else {
      setFormData(prev => ({
        ...prev,
        weightUnit: unit
      }));
    }
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

  const handleBodyMeasurementChange = (key, value) => {
    setFormData(prev => ({
      ...prev,
      bodyMeasurements: {
        ...prev.bodyMeasurements,
        [key]: value
      }
    }));
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
                          All measurements are optional
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
                        
                        {/* Weight */}
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
                          
                          {/* Updated Weight Input with Save Button */}
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
                            <div className="mt-4">
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Calendar className="w-4 h-4" />
                                <span>Weight History:</span>
                              </div>
                              <div className="mt-1 max-h-24 overflow-y-auto">
                                {formData.weightHistory.slice().reverse().map((entry, index) => (
                                  <div key={index} className="text-sm text-gray-600 flex justify-between border-b border-gray-100 py-1">
                                    <span>{new Date(entry.date).toLocaleDateString()}</span>
                                    <span>{entry.weight} {entry.unit}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
    
                      {/* Body Fat & Measurements */}
                      <div className="space-y-4">
                        <h3 className="font-medium text-gray-800 flex items-center gap-2">
                          <Percent className="w-5 h-5 text-[#4A90E2]" />
                          Body Fat & Measurements
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Body Fat */}
                          <div className="relative">
                            <label className="text-sm font-medium text-gray-700">Body Fat Percentage</label>
                            <input
                              type="number"
                              value={formData.bodyFat}
                              onChange={(e) => setFormData(prev => ({ ...prev, bodyFat: e.target.value }))}
                              className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A90E2] focus:border-transparent"
                              placeholder="Enter body fat percentage"
                              min="0"
                              max="100"
                            />
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none mt-1">
                              <span className="text-gray-500">%</span>
                            </div>
                          </div>
                          
                          {/* Chest Measurement */}
                          <div className="relative">
                            <label className="text-sm font-medium text-gray-700">Chest</label>
                            <input
                              type="number"
                              value={formData.bodyMeasurements.chest}
                              onChange={(e) => handleBodyMeasurementChange('chest', e.target.value)}
                              className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A90E2] focus:border-transparent"
                              placeholder="Chest measurement"
                              min="0"
                              step="0.1"
                            />
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none mt-1">
                              <span className="text-gray-500">cm</span>
                            </div>
                          </div>
                          
                          {/* Waist Measurement */}
                          <div className="relative">
                            <label className="text-sm font-medium text-gray-700">Waist</label>
                            <input
                              type="number"
                              value={formData.bodyMeasurements.waist}
                              onChange={(e) => handleBodyMeasurementChange('waist', e.target.value)}
                              className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A90E2] focus:border-transparent"
                              placeholder="Waist measurement"
                              min="0"
                              step="0.1"
                            />
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none mt-1">
                              <span className="text-gray-500">cm</span>
                            </div>
                          </div>
                          
                          {/* Hips Measurement */}
                          <div className="relative">
                            <label className="text-sm font-medium text-gray-700">Hips</label>
                            <input
                              type="number"
                              value={formData.bodyMeasurements.hips}
                              onChange={(e) => handleBodyMeasurementChange('hips', e.target.value)}
                              className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A90E2] focus:border-transparent"
                              placeholder="Hips measurement"
                              min="0"
                              step="0.1"
                            />
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none mt-1">
                              <span className="text-gray-500">cm</span>
                            </div>
                          </div>
                          
                          {/* Thighs Measurement */}
                          <div className="relative">
                            <label className="text-sm font-medium text-gray-700">Thighs</label>
                            <input
                              type="number"
                              value={formData.bodyMeasurements.thighs}
                              onChange={(e) => handleBodyMeasurementChange('thighs', e.target.value)}
                              className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A90E2] focus:border-transparent"
                              placeholder="Thighs measurement"
                              min="0"
                              step="0.1"
                            />
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none mt-1">
                              <span className="text-gray-500">cm</span>
                            </div>
                          </div>
                          
                          {/* Arms Measurement */}
                          <div className="relative">
                            <label className="text-sm font-medium text-gray-700">Arms</label>
                            <input
                              type="number"
                              value={formData.bodyMeasurements.arms}
                              onChange={(e) => handleBodyMeasurementChange('arms', e.target.value)}
                              className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A90E2] focus:border-transparent"
                              placeholder="Arms measurement"
                              min="0"
                              step="0.1"
                            />
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none mt-1">
                              <span className="text-gray-500">cm</span>
                            </div>
                          </div>
                        </div>
                      </div>
    
                      {/* Tracking Stats Section */}
                      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
                        <h3 className="text-blue-800 font-medium flex items-center gap-2">
                          <BarChart2 className="w-5 h-5" />
                          Tracking Progress
                        </h3>
                        <p className="text-blue-700 text-sm mt-1">
                          Your weight changes will be tracked when you save them using the save button.
                          Regular updates to your measurements will help track your fitness journey more accurately.
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