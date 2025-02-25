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
  Award
} from 'lucide-react';

const Homepage = () => {
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
            Your personal AI fitness trainer tracking workouts, measuring progress, and helping you achieve your fitness goals
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {/* Chat with Max Card */}
          <Link to="/chat" className="group">
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-[#BEE3F8] hover:border-[#2B6CB0] h-full">
              <div className="flex items-center gap-4 mb-4">
                <MessageSquare className="w-8 h-8 text-[#2B6CB0]" />
                <h2 className="text-2xl font-semibold text-gray-800">Chat with Max</h2>
              </div>
              <p className="text-gray-600 mb-6">
                Get personalized advice, form guidance, and expert fitness tips from your AI sports coach.
              </p>
              <div className="flex items-center text-[#2B6CB0] group-hover:translate-x-2 transition-transform">
                <span className="font-medium">Start Chatting</span>
                <ArrowRight className="w-5 h-5 ml-2" />
              </div>
            </div>
          </Link>

          {/* Workout Tracker Card */}
          <Link to="/workout" className="group">
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-[#BEE3F8] hover:border-[#2B6CB0] h-full relative overflow-hidden">
              <div className="flex items-center gap-4 mb-4">
                <Dumbbell className="w-8 h-8 text-[#2B6CB0]" />
                <h2 className="text-2xl font-semibold text-gray-800">Workout Tracker</h2>
              </div>
              <p className="text-gray-600 mb-6">
                Create and track custom workout routines, log your sets and reps, and monitor your progress over time.
              </p>
              <div className="flex items-center text-[#2B6CB0] group-hover:translate-x-2 transition-transform">
                <span className="font-medium">Start Training</span>
                <ArrowRight className="w-5 h-5 ml-2" />
              </div>
            </div>
          </Link>

          {/* Progress Analytics Card - NEW */}
          <Link to="/progress" className="group">
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-[#2B6CB0] hover:border-[#2B6CB0] h-full relative overflow-hidden">
              {/* New badge */}
              <div className="absolute top-0 right-0">
                <div className="bg-[#2B6CB0] text-white text-xs font-bold px-3 py-1 transform rotate-0 translate-x-2 -translate-y-0">
                  NEW
                </div>
              </div>
              
              <div className="flex items-center gap-4 mb-4">
                <Activity className="w-8 h-8 text-[#2B6CB0]" />
                <h2 className="text-2xl font-semibold text-gray-800">Progress Analytics</h2>
              </div>
              <p className="text-gray-600 mb-6">
                Visualize strength gains, track personal records, and analyze your workout consistency with detailed charts.
              </p>
              <div className="flex items-center text-[#2B6CB0] group-hover:translate-x-2 transition-transform">
                <span className="font-medium">View Analytics</span>
                <ArrowRight className="w-5 h-5 ml-2" />
              </div>
            </div>
          </Link>

          {/* Profile Creation Card */}
          <Link to="/profile" className="group">
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-[#BEE3F8] hover:border-[#2B6CB0] h-full">
              <div className="flex items-center gap-4 mb-4">
                <UserCircle className="w-8 h-8 text-[#2B6CB0]" />
                <h2 className="text-2xl font-semibold text-gray-800">Athlete Profile</h2>
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

        {/* Analytics Showcase Section */}
        <div className="mt-20 max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Track Your Fitness Journey</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our new analytics dashboard helps you visualize progress and identify opportunities for improvement
            </p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-[#BEE3F8]">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center">
                <div className="bg-indigo-100 p-4 rounded-full mb-4">
                  <BarChart2 className="w-10 h-10 text-indigo-600" />
                </div>
                <h3 className="font-bold text-lg mb-2">Visual Progress</h3>
                <p className="text-gray-600">See how your strength improves over time with intuitive charts and graphs</p>
              </div>
              
              <div className="flex flex-col items-center text-center">
                <div className="bg-amber-100 p-4 rounded-full mb-4">
                  <Award className="w-10 h-10 text-amber-600" />
                </div>
                <h3 className="font-bold text-lg mb-2">Personal Records</h3>
                <p className="text-gray-600">Celebrate achievements with automatic personal record tracking for every exercise</p>
              </div>
              
              <div className="flex flex-col items-center text-center">
                <div className="bg-green-100 p-4 rounded-full mb-4">
                  <TrendingUp className="w-10 h-10 text-green-600" />
                </div>
                <h3 className="font-bold text-lg mb-2">Smart Insights</h3>
                <p className="text-gray-600">Get personalized recommendations based on your training patterns and progress</p>
              </div>
            </div>
            
            <div className="mt-10 text-center">
              <Link to="/progress" className="inline-flex items-center gap-2 px-6 py-3 bg-[#4A90E2] text-white rounded-lg hover:bg-[#357ABD] transition-colors shadow-md">
                Explore Analytics
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Feature Highlights */}
        <div className="mt-24 grid md:grid-cols-4 gap-8 max-w-6xl mx-auto text-center">
          <div className="p-6">
            <Calendar className="w-8 h-8 text-[#4A90E2] mx-auto mb-3" />
            <h3 className="font-semibold text-lg mb-2 text-gray-800">Workout Tracking</h3>
            <p className="text-gray-600">Log sets, reps, and weights with our intuitive workout tracker</p>
          </div>
          <div className="p-6">
            <MessageSquare className="w-8 h-8 text-[#4A90E2] mx-auto mb-3" />
            <h3 className="font-semibold text-lg mb-2 text-gray-800">Expert Guidance</h3>
            <p className="text-gray-600">Get AI-powered advice from Max, your personal coach</p>
          </div>
          <div className="p-6">
            <Activity className="w-8 h-8 text-[#4A90E2] mx-auto mb-3" />
            <h3 className="font-semibold text-lg mb-2 text-gray-800">Progress Analysis</h3>
            <p className="text-gray-600">Track strength gains and identify improvement opportunities</p>
          </div>
          <div className="p-6">
            <UserCircle className="w-8 h-8 text-[#4A90E2] mx-auto mb-3" />
            <h3 className="font-semibold text-lg mb-2 text-gray-800">Personalized Plans</h3>
            <p className="text-gray-600">Custom workouts based on your profile and equipment</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Homepage;