# Project Export

## Project Statistics

- Total files: 3

## Folder Structure

```
offline.html
index.html
src
  homepage.jsx

```

### offline.html

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Max AI Coach - Currently Offline</title>
    <meta name="description" content="Max AI Coach is currently offline. Your workout data is safe and will sync when you're back online.">
    
    <!-- Favicon links -->
    <link rel="icon" type="image/x-icon" href="/favicon/favicon.ico">
    <link rel="icon" type="image/svg+xml" href="/favicon/favicon.svg">
    
    <style>
        :root {
            --primary-color: #4A90E2;
            --primary-dark: #357ABD;
            --background: #E6F3FF;
            --text-color: #333333;
            --card-bg: #FFFFFF;
        }
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(to bottom, var(--background), #D1E9FF);
            color: var(--text-color);
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        
        .container {
            max-width: 600px;
            width: 100%;
            text-align: center;
        }
        
        .card {
            background: var(--card-bg);
            border-radius: 16px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
            padding: 40px 24px;
            margin-bottom: 24px;
        }
        
        .logo {
            width: 80px;
            height: 80px;
            background-color: var(--primary-color);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 24px;
        }
        
        .logo svg {
            width: 40px;
            height: 40px;
            fill: white;
        }
        
        h1 {
            font-size: 1.8rem;
            font-weight: 700;
            margin-bottom: 16px;
            color: var(--text-color);
        }
        
        p {
            font-size: 1rem;
            line-height: 1.5;
            color: #666;
            margin-bottom: 24px;
        }
        
        .button {
            background-color: var(--primary-color);
            color: white;
            border: none;
            border-radius: 8px;
            padding: 12px 24px;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            transition: background-color 0.2s;
            text-decoration: none;
            display: inline-block;
        }
        
        .button:hover {
            background-color: var(--primary-dark);
        }
        
        .info-box {
            background-color: #E8F4FF;
            border-radius: 8px;
            padding: 16px;
            margin-top: 24px;
            text-align: left;
        }
        
        .info-box h3 {
            font-size: 1rem;
            margin-bottom: 8px;
            color: var(--primary-color);
        }
        
        .info-box ul {
            list-style-type: none;
            margin-left: 8px;
        }
        
        .info-box li {
            padding: 4px 0;
            font-size: 0.9rem;
            color: #555;
        }
        
        .info-box li::before {
            content: "•";
            color: var(--primary-color);
            font-weight: bold;
            display: inline-block;
            width: 1em;
            margin-left: -1em;
        }
        
        footer {
            margin-top: 24px;
            font-size: 0.8rem;
            color: #888;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="card">
            <div class="logo" aria-hidden="true">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"></path>
                    <line x1="16" y1="8" x2="2" y2="22"></line>
                    <line x1="17.5" y1="15" x2="9" y2="15"></line>
                </svg>
            </div>
            
            <h1>You're Currently Offline</h1>
            <p>Max AI Coach is unable to connect to the internet. Don't worry - your workout data is safely stored on your device and will sync automatically when you're back online.</p>
            
            <button class="button" onclick="window.location.reload()">Try Again</button>
            
            <div class="info-box">
                <h3>Features available offline:</h3>
                <ul>
                    <li>View saved workouts</li>
                    <li>Track ongoing workout session</li>
                    <li>Access your recent progress data</li>
                    <li>View your athlete profile</li>
                </ul>
            </div>
        </div>
        
        <footer>
            Max AI Coach by Alikearn Studio | Jordan Montée (AlikelDev)
        </footer>
    </div>
    
    <script>
        // Check connection status when the page loads
        window.addEventListener('online', () => {
            window.location.reload();
        });
        
        // Add to homescreen functionality could be added here
        // This is a simple offline page, so we're keeping it minimal
    </script>
</body>
</html>
```

### index.html

```html
<!DOCTYPE html>
<html lang="en" class="scroll-smooth">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="robots" content="index, follow">
    
    <!-- Preload Critical Resources -->
    <link rel="preload" href="/src/main.jsx" as="script">
    <link rel="preload" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Montserrat:wght@400;600;700&display=swap" as="style">
    
    <!-- Security Headers -->
    <meta http-equiv="X-Content-Type-Options" content="nosniff">
    
    <!-- Favicons -->
    <link rel="icon" type="image/x-icon" href="/favicon/favicon.ico">
    <link rel="icon" type="image/svg+xml" href="/favicon/favicon.svg">
    <link rel="icon" type="image/png" sizes="96x96" href="/favicon/favicon-96x96.png">
    <link rel="apple-touch-icon" href="/favicon/apple-touch-icon.png">
    <link rel="manifest" href="/favicon/site.webmanifest">
    <link rel="icon" type="image/png" sizes="192x192" href="/favicon/web-app-manifest-192x192.png">
    <link rel="icon" type="image/png" sizes="512x512" href="/favicon/web-app-manifest-512x512.png">

    <!-- Primary Meta Tags -->
    <title>Max AI Coach - Your Personal AI Fitness Trainer | Jordan Montée (AlikelDev)</title>
    <meta name="description" content="Transform your fitness journey with Max AI Coach. Get personalized workout plans, real-time form analysis, progress tracking, and expert guidance tailored to your fitness level. Achieve your goals faster with AI-powered coaching by Jordan Montée.">
    <meta name="author" content="Jordan Montée (AlikelDev)">
    <meta name="keywords" content="AI fitness coach, personal trainer, workout tracker, strength training, fitness analytics, personalized workouts, body composition tracking, exercise form guidance, progress metrics, fitness goals, Max AI Coach, Jordan Montée, AlikelDev, Alikearn Studio, fitness app">

    <!-- Contact & Ownership Info -->
    <meta name="reply-to" content="j.montee.ls@gmail.com">
    <meta name="publisher" content="Alikearn Studio">
    <meta name="creator" content="Jordan Montée (AlikelDev)">
    <meta name="copyright" content="© 2023-2025 Jordan Montée (AlikelDev). All rights reserved.">

    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://deepfit-alikearn.com/">
    <meta property="og:title" content="Max AI Coach - Personal AI Fitness Trainer">
    <meta property="og:description" content="Expert AI fitness trainer providing personalized workouts, real-time form analysis, and progress tracking to transform your fitness journey.">
    <meta property="og:image" content="https://deepfit-alikearn.com/social-preview.jpg">
    <meta property="og:site_name" content="Max AI Coach">
    <meta property="og:locale" content="en_US">

    <!-- Twitter/X Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:creator" content="@Alileisr">
    <meta name="twitter:title" content="Max AI Coach - AI Powered Fitness Training">
    <meta name="twitter:description" content="Your personal AI fitness trainer, providing expert guidance, customized workouts, and progress analytics for better results.">
    <meta name="twitter:image" content="https://deepfit-alikearn.com/twitter-card.jpg">
    <meta name="twitter:site" content="@Alileisr">
    
    <!-- App-specific Meta Tags -->
    <meta name="application-name" content="Max AI Coach">
    <meta name="apple-mobile-web-app-title" content="Max AI Coach">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="default">
    <meta name="theme-color" content="#4A90E2">
    <meta name="mobile-web-app-capable" content="yes">
    
    <!-- Preconnect to External Resources -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    
    <!-- Styles & Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Montserrat:wght@400;600;700&display=swap" rel="stylesheet">
    <script src="https://cdn.tailwindcss.com"></script>
    
    <!-- Canonical URL -->
    <link rel="canonical" href="https://deepfit-alikearn.com/" />
    
    <!-- Structured Data -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "Max AI Coach",
      "applicationCategory": "HealthApplication",
      "operatingSystem": "Web",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "description": "AI personal trainer providing personalized workouts, form analysis and progress tracking",
      "creator": {
        "@type": "Person",
        "name": "Jordan Montée",
        "alternateName": "AlikelDev",
        "url": "https://github.com/AliKelDev"
      },
      "publisher": {
        "@type": "Organization",
        "name": "Alikearn Studio",
        "url": "https://deepfit-alikearn.com",
        "sameAs": [
          "https://deep-chef.netlify.app/",
          "https://webpixelle3.netlify.app/",
          "https://linkforge-alikeldev.netlify.app/"
        ]
      },
      "applicationSubCategory": "FitnessTraining",
      "screenshot": "https://deepfit-alikearn.com/app-screenshot.jpg",
      "featureList": [
        "AI-powered workout plans",
        "Progress tracking",
        "Body composition analysis",
        "Form guidance",
        "Exercise analytics"
      ]
    }
    </script>
    
    <!-- Person Schema for Author -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "Person",
      "name": "Jordan Montée",
      "alternateName": "AlikelDev",
      "url": "https://github.com/AliKelDev",
      "sameAs": [
        "https://twitter.com/Alileisr",
        "https://github.com/AliKelDev"
      ],
      "worksFor": {
        "@type": "Organization",
        "name": "Alikearn Studio"
      },
      "knowsAbout": ["Web Development", "AI Applications", "Fitness", "UX Design"]
    }
    </script>
  </head>

  <body class="font-inter bg-[#E6F3FF] flex flex-col min-h-screen">
    <div id="root" class="flex-1 flex flex-col"></div>
    <script type="module" src="/src/main.jsx"></script>

    <!-- SEO-Friendly Footer (Visible) -->
    <footer class="py-6 bg-[#D1E8FF] mt-auto">
      <div class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto">
          <div class="flex flex-col md:flex-row justify-between items-center mb-4">
            <p class="text-sm text-gray-700 mb-4 md:mb-0">
              <strong>Max AI Coach</strong> - Your personal AI fitness trainer developed by 
              <a href="https://github.com/AliKelDev" class="text-[#4A90E2] hover:underline">Jordan Montée (AlikelDev)</a>
            </p>
            <div class="flex space-x-4">
              <a href="https://deep-chef.netlify.app/" class="text-sm text-[#4A90E2] hover:underline">DeepChef</a>
              <a href="https://webpixelle3.netlify.app/" class="text-sm text-[#4A90E2] hover:underline">WebPixel</a>
              <a href="https://linkforge-alikeldev.netlify.app/" class="text-sm text-[#4A90E2] hover:underline">LinkForge</a>
            </div>
          </div>
          <p class="text-sm text-gray-600 text-center md:text-left">
            Max AI Coach offers personalized workout plans, strength training guidance, progress tracking and analytics, 
            form analysis, and body composition monitoring for fitness enthusiasts of all levels. Part of the Alikearn 
            Studio AI assistant family alongside DeepChef.
          </p>
          <p class="text-xs text-gray-500 mt-4 text-center">
            © 2023-2025 Alikearn Studio. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  </body>
</html>
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
            <a href="https://webpixelle3.netlify.app/" className="text-[#4A90E2] ml-1 hover:underline">WebPixel</a>, and
            <a href="https://linkforge-alikeldev.netlify.app/" className="text-[#4A90E2] ml-1 hover:underline">LinkForge</a>
          </p>
        </section>
      </section>
    </div>
  );
};

export default Homepage;
```
