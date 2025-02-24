import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Dumbbell, MessageSquare, Home, UserCircle, ArrowRight, Activity } from 'lucide-react';

const WorkoutPage = () => {
  const navigate = useNavigate();

  const navigationCards = [
    {
      title: "Chat with Max",
      description: "Get personalized workout advice and form tips from your AI fitness coach.",
      icon: MessageSquare,
      path: "/chat",
      color: "hover:bg-[#E8F4FF]"
    },
    {
      title: "Return Home",
      description: "Go back to the homepage to explore all features of Max AI Coach.",
      icon: Home,
      path: "/",
      color: "hover:bg-[#E8F4FF]"
    },
    {
      title: "Create Profile",
      description: "Set up your fitness profile and preferences for a personalized experience.",
      icon: UserCircle,
      path: "/profile",
      color: "hover:bg-[#E8F4FF]"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#E6F3FF] to-[#D1E9FF] py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        {/* Header Section */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1, rotate: 360 }}
            transition={{ type: "spring", duration: 1.5 }}
            className="inline-block mb-6"
          >
            <Dumbbell className="w-24 h-24 text-[#2B6CB0]" />
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-5xl font-bold mb-6 text-gray-800"
          >
            Workout Platform Coming Soon!
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-gray-600 max-w-2xl mx-auto"
          >
            We're building an advanced AI-powered workout platform to help you achieve your fitness goals. Get ready for personalized training sessions!
          </motion.p>
        </div>

        {/* Features Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16"
        >
          <div className="bg-white p-6 rounded-xl shadow-md border border-[#BEE3F8]">
            <div className="flex items-center gap-3 mb-4 text-[#2B6CB0]">
              <Activity className="w-6 h-6" />
              <h3 className="text-xl font-semibold">Smart Workout Tracking</h3>
            </div>
            <p className="text-gray-600">Track your exercises, sets, and reps with intelligent progression recommendations.</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-md border border-[#BEE3F8]">
            <div className="flex items-center gap-3 mb-4 text-[#2B6CB0]">
              <Dumbbell className="w-6 h-6" />
              <h3 className="text-xl font-semibold">Form Analysis</h3>
            </div>
            <p className="text-gray-600">Get real-time feedback on your exercise form to maximize results and prevent injuries.</p>
          </div>
        </motion.div>

        {/* Navigation Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="grid md:grid-cols-3 gap-6"
        >
          {navigationCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.path}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + (index * 0.2) }}
                className="group"
                onClick={() => navigate(card.path)}
              >
                <div className={`cursor-pointer bg-white rounded-xl p-6 shadow-md border border-[#BEE3F8] ${card.color} transition-all duration-300 h-full`}>
                  <div className="flex items-center gap-3 mb-4">
                    <Icon className="w-6 h-6 text-[#2B6CB0]" />
                    <h3 className="text-lg font-semibold text-gray-800">{card.title}</h3>
                  </div>
                  <p className="text-gray-600 mb-4">{card.description}</p>
                  <div className="flex items-center text-[#2B6CB0] group-hover:translate-x-2 transition-transform">
                    <span className="font-medium">Go to {card.title}</span>
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default WorkoutPage;