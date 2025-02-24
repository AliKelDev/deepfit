import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChefHat, 
  Save, 
  AlertCircle, 
  MessageSquare, 
  Plus, 
  Edit, 
  Trash2, 
  UserCircle,
  Camera,
  X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const COOKING_LEVELS = [
  { level: "Beginner", value: "1", description: "Just starting out. Can make basic dishes like sandwiches and pasta." },
  { level: "Novice", value: "2", description: "Comfortable with simple recipes. Can follow basic cooking instructions." },
  { level: "Intermediate", value: "3", description: "Can cook multiple dishes at once. Understands basic cooking techniques." },
  { level: "Advanced Intermediate", value: "4", description: "Confident with complex recipes. Good understanding of flavors and timing." },
  { level: "Advanced", value: "5", description: "Skilled home cook. Can improvise recipes and handle complex techniques." },
  { level: "Semi-Professional", value: "6", description: "Near professional level. Deep understanding of cooking principles and techniques." },
  { level: "Professional", value: "7", description: "Professional level skills. Expert in multiple cuisines and advanced techniques." }
];

const KITCHEN_APPLIANCES = [
  { name: "Oven", icon: "🔥", category: "Essential" },
  { name: "Stovetop", icon: "🍳", category: "Essential" },
  { name: "Microwave", icon: "📻", category: "Essential" },
  { name: "Air Fryer", icon: "🌪️", category: "Modern" },
  { name: "Slow Cooker", icon: "🍲", category: "Modern" },
  { name: "Food Processor", icon: "🔄", category: "Modern" },
  { name: "Blender", icon: "🥤", category: "Modern" },
  { name: "Stand Mixer", icon: "🥣", category: "Baking" },
  { name: "Hand Mixer", icon: "🔄", category: "Baking" },
  { name: "Rice Cooker", icon: "🍚", category: "Specialty" },
  { name: "Pressure Cooker", icon: "♨️", category: "Specialty" },
  { name: "Grill", icon: "🔥", category: "Outdoor" },
  { name: "Deep Fryer", icon: "🍟", category: "Specialty" },
  { name: "Toaster", icon: "🍞", category: "Essential" },
  { name: "Coffee Maker", icon: "☕", category: "Beverage" },
  { name: "Electric Kettle", icon: "🫖", category: "Beverage" }
];

const DIETARY_RESTRICTIONS = [
  "Vegetarian", "Vegan", "Gluten-Free", "Dairy-Free", "Nut-Free",
  "Halal", "Kosher", "Pescatarian", "Low-Carb", "Keto",
  "No Shellfish", "No Pork"
];

const DEFAULT_AVATAR = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Ccircle cx='20' cy='20' r='20' fill='%23B87333'/%3E%3Cpath d='M20 21C23.3137 21 26 18.3137 26 15C26 11.6863 23.3137 9 20 9C16.6863 9 14 11.6863 14 15C14 18.3137 16.6863 21 20 21ZM20 23C14.4772 23 10 27.4772 10 33H30C30 27.4772 25.5228 23 20 23Z' fill='white'/%3E%3C/svg%3E";

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
  
  const [formData, setFormData] = useState({
    id: null,
    name: "",
    age: "",
    dietaryRestrictions: [],
    otherRestrictions: "",
    cookingLevel: "",
    appliances: [],
    description: "",
    profileImage: DEFAULT_AVATAR,
    profileThumbnail: DEFAULT_AVATAR
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
      localStorage.setItem('userProfile', JSON.stringify(
        profiles.find(p => p.id === activeProfileId)
      ));
    }
  }, [activeProfileId, profiles]);

  const handleCreateProfile = () => {
    setFormData({
      id: null,
      name: "",
      age: "",
      dietaryRestrictions: [],
      otherRestrictions: "",
      cookingLevel: "",
      appliances: [],
      description: "",
      profileImage: DEFAULT_AVATAR,
      profileThumbnail: DEFAULT_AVATAR
    });
    setPreviewImage(null);
    setEditingProfile(null);
    setShowProfileForm(true);
  };

  const handleEditProfile = (profile) => {
    setFormData(profile);
    setPreviewImage(profile.profileImage);
    setEditingProfile(profile);
    setShowProfileForm(true);
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

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!formData.name || !formData.age || !formData.cookingLevel) {
      setError("Please fill in all required fields (name, age, and cooking level)");
      return;
    }

    const profileId = formData.id || Date.now().toString();
    const newProfile = { ...formData, id: profileId };

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

  const handleDietaryChange = (restriction) => {
    setFormData(prev => ({
      ...prev,
      dietaryRestrictions: prev.dietaryRestrictions.includes(restriction)
        ? prev.dietaryRestrictions.filter(r => r !== restriction)
        : [...prev.dietaryRestrictions, restriction]
    }));
  };

  const handleApplianceToggle = (appliance) => {
    setFormData(prev => ({
      ...prev,
      appliances: prev.appliances.includes(appliance)
        ? prev.appliances.filter(a => a !== appliance)
        : [...prev.appliances, appliance]
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
        <div className={`${sizeClasses[size]} rounded-full overflow-hidden bg-gray-100 border-2 border-[#B87333]`}>
          <img
            src={src || DEFAULT_AVATAR}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>
        {editable && (
          <button
            type="button" // Add this to prevent form submission
            onClick={(e) => {
              e.preventDefault(); // Add this to prevent any event bubbling
              fileInputRef.current?.click();
            }}
            className="absolute bottom-0 right-0 p-1.5 bg-[#B87333] rounded-full text-white hover:bg-[#A66323] transition-colors"
          >
            <Camera className="w-4 h-4" />
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFF5EB] to-[#FFF0E0] py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Profiles List */}
        {!showProfileForm && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-xl overflow-hidden"
          >
            <div className="bg-[#B87333] p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <UserCircle className="w-8 h-8" />
                  <h1 className="text-2xl font-bold">Chef Profiles</h1>
                </div>
                <button
                  onClick={handleCreateProfile}
                  className="flex items-center gap-2 px-4 py-2 bg-white text-[#B87333] rounded-lg hover:bg-[#FFF5EB] transition-colors"
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
                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#B87333] text-white rounded-lg hover:bg-[#A66323] transition-colors"
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
                          ? 'border-[#B87333] bg-[#FFF5EB]'
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
                                <span className="px-2 py-1 text-xs bg-[#B87333] text-white rounded-full">
                                  Active
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mt-1">
                              {COOKING_LEVELS.find(level => level.value === profile.cookingLevel)?.level} Chef
                              • Age {profile.age}
                            </p>
                            {profile.dietaryRestrictions.length > 0 && (
                              <p className="text-sm text-gray-500 mt-1">
                                Dietary: {profile.dietaryRestrictions.join(', ')}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleSelectProfile(profile.id)}
                            className={`p-2 rounded-lg transition-colors ${
                              profile.id === activeProfileId
                                ? 'text-[#B87333] bg-white'
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
                    className="flex items-center gap-2 px-6 py-3 bg-[#B87333] text-white rounded-lg hover:bg-[#A66323] transition-colors"
                  >
                    <MessageSquare className="w-5 h-5" />
                    Chat with Auguste
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
            <div className="bg-[#B87333] p-6 text-white">
              <div className="flex items-center gap-4">
                <ChefHat className="w-8 h-8" />
                <h1 className="text-2xl font-bold">
                  {editingProfile ? 'Edit Profile' : 'Create New Profile'}
                </h1>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-8">
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
                      className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B87333] focus:border-transparent"
                      placeholder="Enter your name"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Age</label>
                    <input
                      type="number"
                      value={formData.age}
                      onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
                      className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B87333] focus:border-transparent"
                      placeholder="Enter your age"
                      min="1"
                      max="120"
                    />
                  </div>
                </div>
              </div>

              {/* Cooking Level Section */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-800">Cooking Experience</h2>
                <div className="relative">
                  <select
                    value={formData.cookingLevel}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, cookingLevel: e.target.value }));
                      setSelectedLevel(COOKING_LEVELS.find(level => level.value === e.target.value));
                      setShowLevelDescription(true);
                    }}
                    onBlur={() => setShowLevelDescription(false)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B87333] focus:border-transparent appearance-none cursor-pointer"
                  >
                    <option value="">Select your cooking level</option>
                    {COOKING_LEVELS.map((level) => (
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

              {/* Dietary Restrictions Section */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-800">Dietary Restrictions</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {DIETARY_RESTRICTIONS.map((restriction) => (
                    <motion.div
                      key={restriction}
                      whileTap={{ scale: 0.95 }}
                    >
                      <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                          type="checkbox"
                          checked={formData.dietaryRestrictions.includes(restriction)}
                          onChange={() => handleDietaryChange(restriction)}
                          className="w-4 h-4 text-[#B87333] border-gray-300 rounded focus:ring-[#B87333]"
                        />
                        <span className="ml-2 text-sm">{restriction}</span>
                      </label>
                    </motion.div>
                  ))}
                </div>
                <div className="mt-4">
                  <label className="text-sm font-medium text-gray-700">Other Restrictions</label>
                  <input
                    type="text"
                    value={formData.otherRestrictions}
                    onChange={(e) => setFormData(prev => ({ ...prev, otherRestrictions: e.target.value }))}
                    className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B87333] focus:border-transparent"
                    placeholder="Enter any other dietary restrictions..."
                  />
                </div>
              </div>

              {/* Kitchen Appliances Section */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-800">Kitchen Appliances</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {KITCHEN_APPLIANCES.map((appliance) => (
                    <motion.button
                      key={appliance.name}
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleApplianceToggle(appliance.name)}
                      className={`p-4 rounded-lg border ${
                        formData.appliances.includes(appliance.name)
                          ? 'border-[#B87333] bg-[#FFF5EB]'
                          : 'border-gray-200 hover:bg-gray-50'
                      } transition-colors duration-200`}
                    >
                      <div className="text-2xl mb-2">{appliance.icon}</div>
                      <div className="text-sm font-medium">{appliance.name}</div>
                      <div className="text-xs text-gray-500">{appliance.category}</div>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Personal Description Section */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-800">About You</h2>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B87333] focus:border-transparent h-32"
                  placeholder="Tell us about yourself, your cooking journey, favorite cuisines..."
                />
              </div>

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
                  className="flex items-center gap-2 px-6 py-3 bg-[#B87333] text-white rounded-lg hover:bg-[#A66323] transition-colors"
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