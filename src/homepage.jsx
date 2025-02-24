import React from 'react';
import { Link } from 'react-router-dom';
import { Dumbbell, MessageSquare, ArrowRight, UserCircle } from 'lucide-react';

const homepage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#E6F3FF] to-[#D1E9FF]">
      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-16 pb-24">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <Dumbbell className="w-20 h-20 text-[#2B6CB0]" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gray-800">
            Meet Max, Your AI Coach
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Your personal AI fitness trainer bringing professional sports expertise to your workouts
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Chat with Max Card */}
          <Link to="/chat" className="group">
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-[#BEE3F8] hover:border-[#2B6CB0]">
              <div className="flex items-center gap-4 mb-4">
                <MessageSquare className="w-8 h-8 text-[#2B6CB0]" />
                <h2 className="text-2xl font-semibold text-gray-800">Chat with Max</h2>
              </div>
              <p className="text-gray-600 mb-6">
                Get personalized workout plans, form guidance, and expert fitness advice from your AI sports coach. Whether you're a beginner or an athlete, Max adapts to your level.
              </p>
              <div className="flex items-center text-[#2B6CB0] group-hover:translate-x-2 transition-transform">
                <span className="font-medium">Start Training</span>
                <ArrowRight className="w-5 h-5 ml-2" />
              </div>
            </div>
          </Link>

          {/* Profile Creation Card */}
          <Link to="/profile" className="group">
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-[#BEE3F8] hover:border-[#2B6CB0]">
              <div className="flex items-center gap-4 mb-4">
                <UserCircle className="w-8 h-8 text-[#2B6CB0]" />
                <h2 className="text-2xl font-semibold text-gray-800">Create Profile</h2>
              </div>
              <p className="text-gray-600 mb-6">
                Set up your fitness profile with physical capabilities, equipment access, and experience level for workouts tailored to your needs.
              </p>
              <div className="flex items-center text-[#2B6CB0] group-hover:translate-x-2 transition-transform">
                <span className="font-medium">Customize Experience</span>
                <ArrowRight className="w-5 h-5 ml-2" />
              </div>
            </div>
          </Link>
        </div>

        {/* Bottom Feature Highlights */}
        <div className="mt-24 grid md:grid-cols-3 gap-8 max-w-4xl mx-auto text-center">
          <div className="p-6">
            <h3 className="font-semibold text-lg mb-2 text-gray-800">Expert Guidance</h3>
            <p className="text-gray-600">Access professional-level sports and fitness knowledge</p>
          </div>
          <div className="p-6">
            <h3 className="font-semibold text-lg mb-2 text-gray-800">Personalized Plans</h3>
            <p className="text-gray-600">Get custom workouts based on your goals and equipment</p>
          </div>
          <div className="p-6">
            <h3 className="font-semibold text-lg mb-2 text-gray-800">Form Analysis</h3>
            <p className="text-gray-600">Receive detailed feedback on exercise technique</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default homepage;