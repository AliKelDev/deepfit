import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Loader2, X, Send, ImagePlus, XCircle, Plus, Menu,
  Trash2, MessageSquare, UserCircle, Dumbbell, ArrowRight, Camera,
  Clock, ChevronRight, AlertCircle
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const DEFAULT_AVATAR = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Ccircle cx='20' cy='20' r='20' fill='%234A90E2'/%3E%3Cpath d='M20 21C23.3137 21 26 18.3137 26 15C26 11.6863 23.3137 9 20 9C16.6863 9 14 11.6863 14 15C14 18.3137 16.6863 21 20 21ZM20 23C14.4772 23 10 27.4772 10 33H30C30 27.4772 25.5228 23 20 23Z' fill='white'/%3E%3C/svg%3E";

const thinkingMessages = [
  "Analyzing your workout needs...",
  "Planning your next move...",
  "Checking training protocols...",
  "Preparing your response...",
  "Getting your fitness plan ready..."
];

// Function to resize and compress image before storage
const resizeImage = (file, maxWidth = 800, maxHeight = 600, quality = 0.7) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        // Calculate new dimensions
        let width = img.width;
        let height = img.height;
        
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }
        
        // Create canvas and resize
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convert to base64 with compression
        const base64 = canvas.toDataURL('image/jpeg', quality);
        resolve(base64);
      };
    };
  });
};

const ProfilePicture = ({ src, size = "medium", className = "" }) => {
  const sizeClasses = {
    small: "w-8 h-8",
    medium: "w-10 h-10",
    large: "w-12 h-12"
  };

  return (
    <div className={`${sizeClasses[size]} rounded-full overflow-hidden border-2 border-[#4A90E2] ${className}`}>
      <img
        src={src || DEFAULT_AVATAR}
        alt="Profile"
        className="w-full h-full object-cover"
      />
    </div>
  );
};

const NoProfileScreen = ({ onNavigateToProfile }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex items-center justify-center bg-gradient-to-b from-[#E8F4FF] to-[#D1E8FF] p-4"
    >
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="max-w-lg w-full bg-white rounded-2xl p-8 shadow-xl text-center"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-6"
        >
          <div className="w-20 h-20 bg-[#E8F4FF] rounded-full mx-auto flex items-center justify-center">
            <UserCircle className="w-12 h-12 text-[#4A90E2]" />
          </div>
        </motion.div>

        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-2xl font-bold text-gray-800 mb-4"
        >
          Welcome to Max
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-gray-600 mb-8"
        >
          Before we start your fitness journey, let's create your athlete profile to personalize your experience.
        </motion.p>

        <motion.button
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onNavigateToProfile}
          className="bg-[#4A90E2] text-white px-8 py-3 rounded-lg font-medium hover:bg-[#357ABD] transition-colors shadow-md flex items-center justify-center gap-2 mx-auto"
        >
          Create Your Profile
          <ArrowRight className="w-5 h-5" />
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

const WelcomeScreen = ({ onStartConversation }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex items-center justify-center bg-gradient-to-b from-[#E8F4FF] to-[#D1E8FF] p-4"
    >
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="max-w-lg w-full bg-white rounded-2xl p-8 shadow-xl text-center"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-6"
        >
          <div className="w-20 h-20 bg-[#E8F4FF] rounded-full mx-auto flex items-center justify-center">
            <Dumbbell className="w-12 h-12 text-[#4A90E2]" />
          </div>
        </motion.div>

        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-2xl font-bold text-gray-800 mb-4"
        >
          Welcome to Your Fitness Journey
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-gray-600 mb-8"
        >
          I'm Max, your personal AI fitness coach. Let me help you discover workout routines, learn proper techniques, and achieve your fitness goals.
        </motion.p>

        <motion.button
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onStartConversation}
          className="bg-[#4A90E2] text-white px-8 py-3 rounded-lg font-medium hover:bg-[#357ABD] transition-colors shadow-md"
        >
          Start Training Together
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

const AIChatAssistant = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const fileInputRef = useRef(null);

  // For receiving workout messages from workout page
  const [initialMessage, setInitialMessage] = useState('');

  // Profile-specific states
  const [hasProfile, setHasProfile] = useState(false);
  const [activeProfile, setActiveProfile] = useState(null);
  const [profileConversations, setProfileConversations] = useState({});
  const [activeConversationId, setActiveConversationId] = useState(null);

  // UI states
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [conversationToDelete, setConversationToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentMessage, setCurrentMessage] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [imageAnalysis, setImageAnalysis] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [canSend, setCanSend] = useState(false);
  const [isFirstTime, setIsFirstTime] = useState(true);
  const [expandedWorkouts, setExpandedWorkouts] = useState({});
  
  // New state for notification/toast
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const notificationTimeoutRef = useRef(null);

  const lastRequestTime = useRef(0);
  const REQUEST_COOLDOWN = 2000;
  const messagesEndRef = useRef(null);

  // Check for message from workout page
  useEffect(() => {
    if (location.state?.message || location.state?.workout) {
      let message = location.state.message || '';
      
      // If there's workout data, format it for display
      if (location.state.workout) {
        setInitialMessage(`${message}\n\n[Workout: ${location.state.workout.name}]\n${location.state.workoutDetails}`);
      } else {
        setInitialMessage(message);
      }
    }
  }, [location.state]);

  // Set the input field when initialMessage changes
  useEffect(() => {
    if (initialMessage) {
      setCurrentMessage(initialMessage);
      setInitialMessage(''); // Clear it after using it
    }
  }, [initialMessage]);

  // Update canSend state based on current message content - strictly require text
  useEffect(() => {
    // Only enable sending if there's text content
    setCanSend(currentMessage.trim().length > 0 && !isLoading);
  }, [currentMessage, isLoading]);

  const handleNavigateToProfile = () => {
    navigate('/profile');
  };

  // Show notification/toast function
  const showToast = (message, duration = 3000) => {
    setNotificationMessage(message);
    setShowNotification(true);
    
    // Clear any existing timeout
    if (notificationTimeoutRef.current) {
      clearTimeout(notificationTimeoutRef.current);
    }
    
    // Set timeout to hide notification
    notificationTimeoutRef.current = setTimeout(() => {
      setShowNotification(false);
    }, duration);
  };

  // Load profile and check if first time
  useEffect(() => {
    const userProfile = localStorage.getItem('userProfile');
    if (!userProfile) {
      setHasProfile(false);
      return;
    }

    setHasProfile(true);
    const profile = JSON.parse(userProfile);
    setActiveProfile(profile);

    const hasStarted = localStorage.getItem(`profile_${profile.id}_hasStarted`);
    setIsFirstTime(!hasStarted);

    if (hasStarted) {
      // Load profile-specific conversations
      const profileChats = localStorage.getItem(`profile_${profile.id}_conversations`);
      if (profileChats) {
        const chats = JSON.parse(profileChats);
        setProfileConversations(chats);

        // Set active conversation
        const lastActiveId = localStorage.getItem(`profile_${profile.id}_activeConversation`);
        if (lastActiveId && chats[lastActiveId]) {
          setActiveConversationId(lastActiveId);
        } else if (Object.keys(chats).length > 0) {
          setActiveConversationId(Object.keys(chats)[0]);
        }
      }
    }
  }, []);

  // Save conversations when they change
  useEffect(() => {
    if (activeProfile && Object.keys(profileConversations).length > 0) {
      localStorage.setItem(
        `profile_${activeProfile.id}_conversations`,
        JSON.stringify(profileConversations)
      );
      if (activeConversationId) {
        localStorage.setItem(
          `profile_${activeProfile.id}_activeConversation`,
          activeConversationId
        );
      }
    }
  }, [profileConversations, activeConversationId, activeProfile]);

  // Scroll to bottom effect
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [profileConversations]);

  // Clean up notification timeout on unmount
  useEffect(() => {
    return () => {
      if (notificationTimeoutRef.current) {
        clearTimeout(notificationTimeoutRef.current);
      }
    };
  }, []);

  const handleStartFirstConversation = () => {
    if (activeProfile) {
      localStorage.setItem(`profile_${activeProfile.id}_hasStarted`, 'true');
      setIsFirstTime(false);
      createNewConversation();
    }
  };

  const createNewConversation = () => {
    const newId = `conv-${Date.now()}`;
    const welcomeMessage = `**Hey ${activeProfile?.name}!** Ready to crush your fitness goals? What can I help you with today?`;

    const newConversation = {
      id: newId,
      title: 'New Conversation',
      messages: [{
        id: 'welcome',
        type: 'ai',
        content: welcomeMessage
      }],
      createdAt: Date.now(),
      lastUpdated: Date.now()
    };

    setProfileConversations(prev => ({
      ...prev,
      [newId]: newConversation
    }));
    setActiveConversationId(newId);
    setIsSidebarOpen(false);
  };

  const handleImageSelect = async (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setIsAnalyzing(true);
      
      // Create temporary preview URL for immediate display
const tempUrl = URL.createObjectURL(file);
setPreviewUrl(tempUrl);

// Once we have the base64 image, update the preview to use it instead
// This ensures what you see in preview is exactly what will be stored
const base64Image = await resizeImage(file);
setSelectedImage({ file, base64: base64Image });
setPreviewUrl(base64Image); // Update preview to use the base64 image
      
      try {
        // Compress and convert to base64 for storage
        const base64Image = await resizeImage(file);
        setSelectedImage({ file, base64: base64Image });
        
        // Analyze the image
        const reader = new FileReader();
        reader.onloadend = async () => {
          const base64String = reader.result.split(',')[1];
          try {
            const response = await fetch('/.netlify/functions/moondream-analysis', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ imageBase64: base64String })
            });

            if (!response.ok) throw new Error('Image analysis failed');

            const data = await response.json();
            setImageAnalysis(data.caption);
          } catch (error) {
            console.error('Error analyzing image:', error);
            setImageAnalysis('Failed to analyze image');
          } finally {
            setIsAnalyzing(false);
          }
        };
        reader.readAsDataURL(file);
      } catch (error) {
        console.error('Error processing image:', error);
        setIsAnalyzing(false);
      }
    }
  };

  const clearSelectedImage = () => {
    setSelectedImage(null);
    setPreviewUrl('');
    setImageAnalysis('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSendMessage = async () => {
    // Check if message is empty (no text)
    if (!currentMessage.trim()) {
      // Show toast notification if trying to send without text
      showToast(selectedImage 
        ? "Please add a message to send along with your image" 
        : "Please type a message before sending");
      return;
    }
    
    if (isLoading || !activeConversationId) return;

    const now = Date.now();
    if (now - lastRequestTime.current < REQUEST_COOLDOWN) {
      console.warn("Please wait before sending another message.");
      return;
    }
    lastRequestTime.current = now;
    setIsLoading(true);

    // Create user message with base64 image if present
    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: currentMessage,
      imageUrl: selectedImage?.base64 || null, // Store base64 image for persistence
      pendingResponse: true
    };

    // Update conversation with user message
    setProfileConversations(prev => ({
      ...prev,
      [activeConversationId]: {
        ...prev[activeConversationId],
        messages: [...prev[activeConversationId].messages, userMessage],
        lastUpdated: Date.now()
      }
    }));

    setCurrentMessage('');

    if (selectedImage) {
      clearSelectedImage();
    }

    try {
      const response = await fetch('/.netlify/functions/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...profileConversations[activeConversationId].messages, userMessage],
          imageAnalysis: imageAnalysis,
          userProfile: activeProfile
        })
      });

      if (!response.ok) throw new Error('Chat request failed');

      const data = await response.json();
      const aiResponse = `${data.content}\n\n_— Max_`;
      // Update conversation with AI response
      setProfileConversations(prev => ({
        ...prev,
        [activeConversationId]: {
          ...prev[activeConversationId],
          messages: [...prev[activeConversationId].messages, {
            id: Date.now() + 1,
            type: 'ai',
            content: aiResponse
          }],
          lastUpdated: Date.now()
        }
      }));
    } catch (error) {
      console.error('Error sending message:', error);
      // Add error message to conversation
      setProfileConversations(prev => ({
        ...prev,
        [activeConversationId]: {
          ...prev[activeConversationId],
          messages: [...prev[activeConversationId].messages, {
            id: Date.now(),
            type: 'ai',
            content: "⚠️ Whoa there! I'm having trouble connecting. Let's try again later!",
            isError: true
          }],
          lastUpdated: Date.now()
        }
      }));
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        setCanSend(currentMessage.trim().length > 0);  // Re-enable send button if text is present
      }, REQUEST_COOLDOWN);
    }
  };

  const generateThinkingMessage = () =>
    thinkingMessages[Math.floor(Math.random() * thinkingMessages.length)];

  return (
    <AnimatePresence>
      {!hasProfile ? (
        <NoProfileScreen onNavigateToProfile={handleNavigateToProfile} />
      ) : isFirstTime ? (
        <WelcomeScreen onStartConversation={handleStartFirstConversation} />
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 flex bg-gradient-to-b from-[#E8F4FF] to-[#D1E8FF]"
        >
          {/* Sidebar with profile info and conversations */}
          <AnimatePresence>
            {(isSidebarOpen || window.innerWidth >= 1024) && (
              <motion.div
                initial={{ x: -300 }}
                animate={{ x: 0 }}
                exit={{ x: -300 }}
                transition={{ type: "spring", damping: 20 }}
                className="fixed left-0 top-0 bottom-0 w-72 bg-white border-r border-[#B8D8F8] flex flex-col z-30 lg:relative lg:translate-x-0"
              >
                {/* Profile Info */}
                {activeProfile && (
                  <div className="p-4 border-b border-[#B8D8F8] bg-[#E8F4FF]">
                    <div className="flex items-center gap-3">
                      <ProfilePicture
                        src={activeProfile.profileThumbnail}
                        size="medium"
                      />
                      <div className="flex-1 min-w-0">
                        <h2 className="font-semibold text-gray-800 truncate">
                          {activeProfile.name}
                        </h2>
                        <p className="text-sm text-gray-600">
                          Level {activeProfile.cookingLevel} Athlete
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Conversations List */}
                <div className="flex-1 overflow-y-auto">
                  {Object.values(profileConversations)
                    .sort((a, b) => b.lastUpdated - a.lastUpdated)
                    .map(conversation => (
                      <div
                        key={conversation.id}
                        className={`p-3 border-b border-[#B8D8F8] cursor-pointer hover:bg-[#E8F4FF] flex items-center justify-between transition-colors ${
                          conversation.id === activeConversationId ? 'bg-[#D1E8FF]' : ''
                        }`}
                        onClick={() => {
                          setActiveConversationId(conversation.id);
                          setIsSidebarOpen(false);
                        }}
                      >
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <MessageSquare className="w-5 h-5 text-[#4A90E2] flex-shrink-0" />
                          <div className="truncate">
                            <div className="font-medium text-gray-800 truncate">
                              {conversation.title}
                            </div>
                            <div className="text-sm text-gray-600 truncate">
                              {conversation.messages[conversation.messages.length - 1]?.content.slice(0, 30)}...
                            </div>
                          </div>
                        </div>
                        {conversation.id !== 'welcome' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setConversationToDelete(conversation.id);
                              setShowDeleteModal(true);
                            }}
                            className="p-1 hover:bg-[#D1E8FF] rounded transition-colors"
                          >
                            <Trash2 className="w-4 h-4 text-[#4A90E2]" />
                          </button>
                        )}
                      </div>
                    ))}
                </div>

                {/* New Conversation Button */}
                <div className="p-4 border-t border-[#B8D8F8]">
                  <button
                    onClick={createNewConversation}
                    className="w-full flex items-center justify-center gap-2 p-2 bg-[#4A90E2] text-white rounded-lg hover:bg-[#357ABD] transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                    New Conversation
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col relative">
            {/* Chat Header */}
            <div className="flex items-center justify-between p-4 border-b border-[#B8D8F8] bg-white">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  className="p-2 hover:bg-[#E8F4FF] rounded-lg transition-colors"
                >
                  <Menu className="w-5 h-5 text-[#4A90E2]" />
                </button>
                <span className="text-[#4A90E2] text-xl">💪</span>
                <h3 className="font-semibold text-gray-800">Max - Your Personal Coach</h3>
              </div>
            </div>

            {/* Toast Notification */}
            <AnimatePresence>
              {showNotification && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="absolute top-16 left-1/2 transform -translate-x-1/2 bg-[#FFF4CC] border border-[#FFD666] px-4 py-2 rounded-lg shadow-md z-50 flex items-center gap-2"
                >
                  <AlertCircle className="w-5 h-5 text-[#F59E0B]" />
                  <span className="text-[#B45309] text-sm">{notificationMessage}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Mobile Overlay Background with Button */}
            <AnimatePresence>
              {isSidebarOpen && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden flex"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  {/* Right side button area */}
                  <div className="ml-72 flex-1 flex items-center justify-center">
                    <button
                      onClick={() => setIsSidebarOpen(false)}
                      className="bg-white bg-opacity-20 hover:bg-opacity-30 transition-all duration-200 rounded-lg py-2 px-4 flex items-center gap-2 text-sm"
                    >
                      <X className="w-4 h-4 text-white" />
                      <span className="text-white font-medium">Close</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {activeConversationId &&
                profileConversations[activeConversationId]?.messages.map((message) => {
                  // Check if message might contain workout data
                  let messageContent = message.content;
                  let workoutData = null;
                  
                  if (message.workoutShared && typeof message.content === 'string') {
                    try {
                      const parsedContent = JSON.parse(message.content);
                      if (parsedContent.workoutData && parsedContent.text) {
                        workoutData = parsedContent.workoutData;
                        messageContent = parsedContent.text || "";
                      }
                    } catch (e) {
                      // Not JSON or not in the expected format, use as is
                      console.log("Error parsing workout data", e);
                    }
                  }
                  
                  return (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-2xl p-4 rounded-xl ${
                        message.type === 'user'
                          ? 'bg-white border border-[#B8D8F8] ml-12'
                          : 'bg-[#E8F4FF] border border-[#B8D8F8] mr-12'
                      } ${message.isError ? 'bg-red-50 border border-red-200' : ''}`}>
                        <div className="flex items-center gap-2 mb-2">
                          {message.type === 'ai' ? (
                            <span className="text-[#4A90E2] text-lg">💪</span>
                          ) : (
                            <ProfilePicture
                              src={activeProfile?.profileThumbnail}
                              size="small"
                              className="ml-auto order-2"
                            />
                          )}
                          <span className={`text-sm font-medium text-gray-800 ${
                            message.type === 'user' ? 'order-1' : ''
                          }`}>
                            {message.type === 'user' ? activeProfile?.name || 'You' : 'Max'}
                          </span>
                        </div>
                        
                        {/* Render image if present - now using base64 string directly */}
                        {message.type === 'user' && message.imageUrl && (
                          <div className="mb-3">
                            <img
                              src={message.imageUrl}
                              alt="User uploaded"
                              className="max-h-48 w-auto rounded-lg object-cover shadow-md"
                            />
                          </div>
                        )}
                        
                        {/* Render workout data if present */}
                        {workoutData && (
                          <div className="mb-3">
                            <div 
                              className="bg-[#E8F4FF] border border-[#B8D8F8] rounded-lg overflow-hidden cursor-pointer"
                              onClick={() => setExpandedWorkouts(prev => ({
                                ...prev,
                                [workoutData.id]: !prev[workoutData.id]
                              }))}
                            >
                              <div className="p-3 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <Dumbbell className="w-4 h-4 text-[#4A90E2]" />
                                  <span className="font-medium text-[#4A90E2]">
                                    {workoutData.name} workout shared
                                  </span>
                                </div>
                                <ChevronRight className={`w-5 h-5 text-[#4A90E2] transition-transform ${
                                  expandedWorkouts[workoutData.id] ? 'rotate-90' : ''
                                }`} />
                              </div>
                              
                              {/* Expandable workout details */}
                              <AnimatePresence>
                                {expandedWorkouts[workoutData.id] && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="border-t border-[#B8D8F8]"
                                  >
                                    <div className="p-3 text-sm">
                                      <div className="flex items-center justify-between mb-2">
                                        <div className="text-gray-700">
                                          {workoutData.date} at {workoutData.time}
                                        </div>
                                        <div className="flex items-center gap-1 text-gray-600">
                                          <Clock className="w-3.5 h-3.5" />
                                          <span>{workoutData.duration}</span>
                                        </div>
                                      </div>
                                      
                                      <div className="space-y-1">
                                        {workoutData.exercises.map((ex, i) => (
                                          <div key={i} className="flex items-center justify-between">
                                            <span className="text-gray-700">{ex.name}</span>
                                            <span className="text-gray-600 text-xs">
                                              {ex.completed}/{ex.sets} sets
                                            </span>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          </div>
                        )}
                        
                        {/* Regular message content */}
                        <div className={`whitespace-pre-wrap ${message.isError ? 'text-red-600' : 'text-gray-700'}`}>
                          {messageContent.split(/(\*\*.*?\*\*)/g).map((part, index) =>
                            part.startsWith('**') && part.endsWith('**') ? (
                              <strong key={index} className="font-semibold text-[#4A90E2]">{part.slice(2, -2)}</strong>
                            ) : (
                              <span key={index}>{part}</span>
                            )
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}

              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-2 text-gray-600 p-4"
                >
                  <Loader2 className="w-5 h-5 animate-spin text-[#4A90E2]" />
                  <span>{generateThinkingMessage()}</span>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area with Image Preview */}
            <div className="border-t border-[#B8D8F8] p-4 bg-white">
              {previewUrl && (
                <AnimatePresence>
                  <motion.div
                    className="mb-4"
                    initial={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="relative inline-block">
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="h-24 w-auto rounded-lg object-cover shadow-md"
                      />
                      <button
                        onClick={clearSelectedImage}
                        className="absolute -top-2 -right-2 bg-white rounded-full shadow-md hover:bg-[#E8F4FF] transition-colors"
                      >
                        <XCircle className="w-5 h-5 text-[#4A90E2]" />
                      </button>
                    </div>
                    {isAnalyzing && (
                      <div className="mt-2 text-sm text-gray-600 flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin text-[#4A90E2]" />
                        Analyzing image...
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              )}

              <div className="flex gap-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  ref={fileInputRef}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="p-3 bg-[#E8F4FF] rounded-lg text-[#4A90E2] hover:bg-[#D1E8FF] transition-colors"
                >
                  <ImagePlus className="w-5 h-5" />
                </button>

                <textarea
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  placeholder={
                    selectedImage 
                      ? "Add a message to send with your image..." 
                      : "Ask Max about workouts or share a fitness question..."
                  }
                  className="flex-1 p-3 border border-[#B8D8F8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A90E2] resize-none h-12"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                />

                <motion.button
                  onClick={handleSendMessage}
                  className={`p-3 rounded-lg text-white shadow-md transition-colors ${
                    canSend && !isLoading
                      ? 'bg-[#4A90E2] hover:bg-[#357ABD] cursor-pointer' 
                      : 'bg-gray-400 cursor-not-allowed'
                  }`}
                  whileTap={canSend && !isLoading ? { scale: 0.95 } : {}}
                >
                  <Send className="w-5 h-5" />
                </motion.button>
              </div>
            </div>
          </div>

          {/* Delete Confirmation Modal */}
          <AnimatePresence>
            {showDeleteModal && (
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
                  <h3 className="text-lg font-semibold mb-2">Delete Conversation</h3>
                  <p className="text-gray-600 mb-4">
                    Are you sure you want to delete this conversation? This action cannot be undone.
                  </p>
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => setShowDeleteModal(false)}
                      className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        setProfileConversations(prev => {
                          const newConversations = { ...prev };
                          delete newConversations[conversationToDelete];

                          // If we're deleting the active conversation, switch to another one
                          if (conversationToDelete === activeConversationId) {
                            const remainingIds = Object.keys(newConversations);
                            if (remainingIds.length > 0) {
                              setActiveConversationId(remainingIds[0]);
                            } else {
                              createNewConversation();
                            }
                          }

                          return newConversations;
                        });
                        setShowDeleteModal(false);
                        setConversationToDelete(null);
                      }}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AIChatAssistant;