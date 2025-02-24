import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Activity, MessageSquare, Home, UserCircle, ArrowRight, LineChart, Target } from 'lucide-react';

const ProgressPage = () => {
  const navigate = useNavigate();

  const navigationCards = [
    {
      title: "Chat with Max",
      description: "Discuss your progress and get insights from your AI fitness coach.",
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
      description: "Complete your profile to track your fitness journey effectively.",
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
            <Activity className="w-24 h-24 text-[#2B6CB0]" />
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-5xl font-bold mb-6 text-gray-800"
          >
            Progress Tracking Coming Soon!
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-gray-600 max-w-2xl mx-auto"
          >
            We're developing powerful analytics tools to help you visualize and understand your fitness journey. Track your progress like never before!
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
              <LineChart className="w-6 h-6" />
              <h3 className="text-xl font-semibold">Progress Analytics</h3>
            </div>
            <p className="text-gray-600">Visualize your fitness progress with detailed charts and insights.</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-md border border-[#BEE3F8]">
            <div className="flex items-center gap-3 mb-4 text-[#2B6CB0]">
              <Target className="w-6 h-6" />
              <h3 className="text-xl font-semibold">Goal Tracking</h3>
            </div>
            <p className="text-gray-600">Set and monitor your fitness goals with AI-powered recommendations.</p>
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

export default ProgressPage;