"use client";
import React, { useState } from "react";
import {
  BookOpen,
  Users,
  Brain,
  Zap,
  Database,
  Lock,
  MessageSquare,
  Trophy,
  FileText,
  BarChart3,
  Settings,
  Rocket,
} from "lucide-react";

const BrainWaveProject = () => {
  const [activeTab, setActiveTab] = useState("overview");

  const tabs = [
    { id: "overview", label: "Overview", icon: BookOpen },
    { id: "features", label: "Core Features", icon: Zap },
    { id: "tech", label: "Tech Stack", icon: Database },
    { id: "schema", label: "Database", icon: FileText },
    { id: "roadmap", label: "Roadmap", icon: Rocket },
    { id: "api", label: "API Structure", icon: Settings },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return <OverviewSection />;
      case "features":
        return <FeaturesSection />;
      case "tech":
        return <TechStackSection />;
      case "schema":
        return <DatabaseSection />;
      case "roadmap":
        return <RoadmapSection />;
      case "api":
        return <APISection />;
      default:
        return <OverviewSection />;
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-linear-to-r from-indigo-600 to-purple-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-white p-3 rounded-xl">
              <Brain className="w-8 h-8 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">BrainWave</h1>
              <p className="text-indigo-100 mt-1">
                AI-Powered Collaborative Learning Platform
              </p>
            </div>
          </div>
          <p className="text-indigo-50 max-w-3xl">
            A next-generation learning platform where AI transforms study
            materials into interactive quizzes, students track their mastery in
            real-time, and collaborative study groups amplify learning outcomes.
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-1 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 font-medium transition-all whitespace-nowrap ${activeTab === tab.id
                    ? "text-indigo-600 border-b-2 border-indigo-600"
                    : "text-gray-600 hover:text-indigo-600"
                    }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">{renderContent()}</div>
    </div>
  );
};

const OverviewSection = () => (
  <div className="space-y-6">
    <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        🎯 Project Vision
      </h2>
      <p className="text-gray-700 leading-relaxed mb-4">
        BrainWave is not a social media app. It's not just another quiz
        platform. It's a <strong>learning-first ecosystem</strong> where every
        feature serves one purpose:{" "}
        <strong>making students smarter, faster, together</strong>.
      </p>
      <div className="grid md:grid-cols-3 gap-4 mt-6">
        <div className="bg-linear-to-br from-blue-50 to-blue-100 p-6 rounded-xl">
          <Brain className="w-8 h-8 text-blue-600 mb-3" />
          <h3 className="font-bold text-gray-900 mb-2">AI-Powered</h3>
          <p className="text-sm text-gray-700">
            Transform PDFs and notes into personalized quizzes and flashcards
            instantly
          </p>
        </div>
        <div className="bg-linear-to-br from-purple-50 to-purple-100 p-6 rounded-xl">
          <Users className="w-8 h-8 text-purple-600 mb-3" />
          <h3 className="font-bold text-gray-900 mb-2">Collaborative</h3>
          <p className="text-sm text-gray-700">
            Real-time study groups with chat and shared learning sessions
          </p>
        </div>
        <div className="bg-linear-to-br from-green-50 to-green-100 p-6 rounded-xl">
          <Trophy className="w-8 h-8 text-green-600 mb-3" />
          <h3 className="font-bold text-gray-900 mb-2">Progress Tracking</h3>
          <p className="text-sm text-gray-700">
            Mastery percentages, streaks, and detailed analytics
          </p>
        </div>
      </div>
    </div>

    <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        ⚡ Key Differentiators
      </h2>
      <div className="space-y-3">
        {[
          {
            emoji: "🎓",
            title: "Learning-First Design",
            desc: "Social features exist only to enhance education, not distract from it",
          },
          {
            emoji: "🤖",
            title: "Practical AI",
            desc: "AI generates quizzes and flashcards, not generic chatbots",
          },
          {
            emoji: "📊",
            title: "Deep Analytics",
            desc: "Track mastery by topic, accuracy trends, and learning velocity",
          },
          {
            emoji: "⚡",
            title: "Real-Time Collaboration",
            desc: "Study groups with live presence and synchronized quiz sessions",
          },
          {
            emoji: "🎯",
            title: "Scoped Social",
            desc: "Share educational content only, no infinite scroll feeds",
          },
        ].map((item, i) => (
          <div key={i} className="flex gap-4 p-4 bg-gray-50 rounded-lg">
            <span className="text-2xl">{item.emoji}</span>
            <div>
              <h3 className="font-semibold text-gray-900">{item.title}</h3>
              <p className="text-sm text-gray-600">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>

    <div className="bg-linear-to-r from-amber-50 to-orange-50 border-l-4 border-amber-500 rounded-xl p-6">
      <h3 className="font-bold text-amber-900 mb-2">🎤 Interview Pitch</h3>
      <p className="text-amber-800 italic">
        "BrainWave is a collaborative learning platform where students upload
        study materials and AI generates personalized quizzes. I implemented
        real-time study groups using Socket.io, tracked learning progress with
        MongoDB aggregations, and built an analytics dashboard showing mastery
        percentages by topic. The platform intentionally limits social features
        to educational content sharing, keeping users focused on learning
        outcomes."
      </p>
    </div>
  </div>
);

const FeaturesSection = () => (
  <div className="space-y-6">
    {[
      {
        title: "🧠 AI Learning Core",
        color: "from-blue-500 to-indigo-500",
        features: [
          {
            name: "PDF & Note Upload",
            desc: "Support for PDFs, text files, and direct text input",
            priority: "P0",
          },
          {
            name: "Text Extraction",
            desc: "Parse uploaded files and extract clean text",
            priority: "P0",
          },
          {
            name: "AI Quiz Generation",
            desc: "Generate MCQs with explanations using Gemini API",
            priority: "P0",
          },
          {
            name: "AI Flashcard Generation",
            desc: "Create front/back flashcards from content",
            priority: "P1",
          },
          {
            name: "Difficulty Levels",
            desc: "Easy, Medium, Hard quiz generation",
            priority: "P1",
          },
          {
            name: "Custom Prompts",
            desc: "Let users customize AI generation style",
            priority: "P2",
          },
        ],
      },
      {
        title: "📊 Progress & Analytics",
        color: "from-green-500 to-emerald-500",
        features: [
          {
            name: "Quiz Attempts Tracking",
            desc: "Store all quiz attempts with timestamps",
            priority: "P0",
          },
          {
            name: "Accuracy Calculation",
            desc: "Overall and per-topic accuracy percentages",
            priority: "P0",
          },
          {
            name: "Mastery System",
            desc: "Calculate mastery % based on repeated correct answers",
            priority: "P1",
          },
          {
            name: "Streak Tracking",
            desc: "Daily login streaks and study consistency",
            priority: "P1",
          },
          {
            name: "Learning Velocity",
            desc: "Questions per day, improvement rate over time",
            priority: "P2",
          },
          {
            name: "Visual Analytics",
            desc: "Charts showing progress trends and weak topics",
            priority: "P1",
          },
        ],
      },
      {
        title: "👥 Collaboration Layer",
        color: "from-purple-500 to-pink-500",
        features: [
          {
            name: "Study Groups",
            desc: "Create/join groups with invite codes",
            priority: "P1",
          },
          {
            name: "Group Chat",
            desc: "Real-time messaging with Socket.io",
            priority: "P1",
          },
          {
            name: "1:1 Direct Messages",
            desc: "Private messaging between users",
            priority: "P2",
          },
          {
            name: "Online Presence",
            desc: "Show who is currently active in groups",
            priority: "P1",
          },
          {
            name: "Shared Quiz Sessions",
            desc: "Take quizzes together with live leaderboards",
            priority: "P2",
          },
          {
            name: "Group Progress",
            desc: "See group members study stats",
            priority: "P2",
          },
        ],
      },
      {
        title: "🌐 Social Layer (LIMITED)",
        color: "from-orange-500 to-red-500",
        features: [
          {
            name: "Share Study Content",
            desc: "Post quizzes/flashcards to community",
            priority: "P2",
          },
          {
            name: "Like & Bookmark",
            desc: "Save and appreciate shared content",
            priority: "P2",
          },
          {
            name: "Comments",
            desc: "Discuss shared educational content",
            priority: "P2",
          },
          {
            name: "Search & Filter",
            desc: "Find content by subject/difficulty",
            priority: "P2",
          },
          {
            name: "User Profiles",
            desc: "Public profiles showing learning stats",
            priority: "P2",
          },
        ],
      },
    ].map((section, i) => (
      <div
        key={i}
        className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
      >
        <div className={`bg-linear-to-r ${section.color} text-white px-6 py-4`}>
          <h2 className="text-xl font-bold">{section.title}</h2>
        </div>
        <div className="p-6">
          <div className="space-y-3">
            {section.features.map((feature, j) => (
              <div
                key={j}
                className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-semibold text-gray-900">
                      {feature.name}
                    </h3>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${feature.priority === "P0"
                        ? "bg-red-100 text-red-700"
                        : feature.priority === "P1"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-blue-100 text-blue-700"
                        }`}
                    >
                      {feature.priority}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    ))}

    <div className="bg-gray-900 text-white rounded-2xl p-6">
      <h3 className="font-bold mb-3 flex items-center gap-2">
        <Zap className="w-5 h-5 text-yellow-400" />
        Priority Guide
      </h3>
      <div className="grid md:grid-cols-3 gap-4 text-sm">
        <div>
          <span className="font-semibold text-red-400">P0 - Critical:</span>
          <p className="text-gray-300 mt-1">
            Must have for v1. Build these first.
          </p>
        </div>
        <div>
          <span className="font-semibold text-yellow-400">P1 - Important:</span>
          <p className="text-gray-300 mt-1">
            Strongly recommended for complete product.
          </p>
        </div>
        <div>
          <span className="font-semibold text-blue-400">
            P2 - Nice to Have:
          </span>
          <p className="text-gray-300 mt-1">
            Polish features. Add if time permits.
          </p>
        </div>
      </div>
    </div>
  </div>
);

const TechStackSection = () => (
  <div className="space-y-6">
    <div className="grid md:grid-cols-2 gap-6">
      {[
        {
          title: "⚛️ Frontend",
          items: [
            {
              name: "Next.js 14+",
              reason: "App Router, Server Components, API routes",
              required: true,
            },
            {
              name: "React 18",
              reason: "Latest features, concurrent rendering",
              required: true,
            },
            {
              name: "TypeScript",
              reason: "Type safety, better DX",
              required: true,
            },
            {
              name: "TailwindCSS",
              reason: "Rapid styling, consistent design",
              required: true,
            },
            {
              name: "shadcn/ui",
              reason: "Beautiful, accessible components",
              required: true,
            },
            {
              name: "Framer Motion",
              reason: "Smooth animations for key flows",
              required: false,
            },
            {
              name: "Recharts",
              reason: "Analytics dashboard visualizations",
              required: true,
            },
            {
              name: "React Query",
              reason: "Server state management, caching",
              required: true,
            },
          ],
        },
        {
          title: "🔧 Backend",
          items: [
            {
              name: "Next.js API Routes",
              reason: "Simple REST endpoints",
              required: true,
            },
            {
              name: "MongoDB",
              reason: "Flexible schema for learning data",
              required: true,
            },
            {
              name: "Mongoose",
              reason: "Schema validation, relationships",
              required: true,
            },
            {
              name: "Socket.io",
              reason: "Real-time chat and presence",
              required: true,
            },
            {
              name: "Express (optional)",
              reason: "Heavy logic if API routes insufficient",
              required: false,
            },
          ],
        },
        {
          title: "🔐 Authentication",
          items: [
            {
              name: "Firebase Auth",
              reason: "Email/password + Google OAuth",
              required: true,
            },
            {
              name: "JWT",
              reason: "Socket.io authentication only",
              required: true,
            },
            {
              name: "NextAuth (alternative)",
              reason: "If you prefer all-in-one auth",
              required: false,
            },
          ],
        },
        {
          title: "🤖 AI & Services",
          items: [
            {
              name: "Gemini API",
              reason: "Quiz and flashcard generation",
              required: true,
            },
            {
              name: "pdf-parse",
              reason: "Extract text from PDFs",
              required: true,
            },
            {
              name: "Cloudinary",
              reason: "File uploads and storage",
              required: true,
            },
            {
              name: "Vercel",
              reason: "Deployment (free tier)",
              required: true,
            },
            {
              name: "MongoDB Atlas",
              reason: "Cloud database (free tier)",
              required: true,
            },
          ],
        },
      ].map((section, i) => (
        <div
          key={i}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            {section.title}
          </h3>
          <div className="space-y-3">
            {section.items.map((item, j) => (
              <div key={j} className="flex items-start gap-3">
                <div
                  className={`mt-1 w-2 h-2 rounded-full ${item.required ? "bg-green-500" : "bg-gray-400"
                    }`}
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900">
                      {item.name}
                    </span>
                    {!item.required && (
                      <span className="text-xs text-gray-500">(optional)</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{item.reason}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>

    <div className="bg-linear-to-r from-indigo-600 to-purple-600 text-white rounded-2xl p-8">
      <h3 className="text-2xl font-bold mb-4">📦 Complete Package.json</h3>
      <pre className="bg-black bg-opacity-30 rounded-lg p-4 overflow-x-auto text-sm">
        {`{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "typescript": "^5.0.0",
    "tailwindcss": "^3.4.0",
    "firebase": "^10.7.0",
    "mongodb": "^6.3.0",
    "mongoose": "^8.0.0",
    "socket.io": "^4.6.0",
    "socket.io-client": "^4.6.0",
    "@google/generative-ai": "^0.24.1",
    "pdf-parse": "^1.1.1",
    "@tanstack/react-query": "^5.0.0",
    "recharts": "^2.10.0",
    "framer-motion": "^10.16.0",
    "lucide-react": "^0.300.0",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.0.0"
  }
}`}
      </pre>
    </div>
  </div>
);

const DatabaseSection = () => (
  <div className="space-y-6">
    {[
      {
        name: "users",
        color: "from-blue-500 to-cyan-500",
        fields: [
          { name: "_id", type: "ObjectId", desc: "Auto-generated user ID" },
          {
            name: "firebaseUid",
            type: "String",
            desc: "Firebase Auth UID (unique)",
          },
          { name: "email", type: "String", desc: "User email" },
          { name: "displayName", type: "String", desc: "Full name" },
          { name: "avatar", type: "String", desc: "Profile image URL" },
          {
            name: "studyInterests",
            type: "Array<String>",
            desc: "Topics user studies",
          },
          { name: "streak", type: "Number", desc: "Current daily streak" },
          { name: "lastActive", type: "Date", desc: "Last login timestamp" },
          { name: "totalXP", type: "Number", desc: "Gamification points" },
          { name: "createdAt", type: "Date", desc: "Account creation date" },
        ],
      },
      {
        name: "notes",
        color: "from-green-500 to-emerald-500",
        fields: [
          { name: "_id", type: "ObjectId", desc: "Note ID" },
          {
            name: "userId",
            type: "ObjectId",
            desc: "Reference to users collection",
          },
          { name: "title", type: "String", desc: "Note title" },
          { name: "content", type: "String", desc: "Full note text content" },
          { name: "subject", type: "String", desc: "Subject/topic category" },
          {
            name: "fileUrl",
            type: "String",
            desc: "Original file URL if uploaded",
          },
          { name: "tags", type: "Array<String>", desc: "Custom tags" },
          { name: "createdAt", type: "Date", desc: "Upload timestamp" },
        ],
      },
      {
        name: "quizzes",
        color: "from-purple-500 to-pink-500",
        fields: [
          { name: "_id", type: "ObjectId", desc: "Quiz ID" },
          { name: "noteId", type: "ObjectId", desc: "Source note reference" },
          { name: "userId", type: "ObjectId", desc: "Creator reference" },
          { name: "title", type: "String", desc: "Quiz title" },
          { name: "subject", type: "String", desc: "Subject category" },
          { name: "difficulty", type: "String", desc: "easy | medium | hard" },
          {
            name: "questions",
            type: "Array<Object>",
            desc: "[{question, options, correct, explanation}]",
          },
          { name: "isPublic", type: "Boolean", desc: "Shared to community" },
          { name: "createdAt", type: "Date", desc: "Generation timestamp" },
        ],
      },
      {
        name: "quiz_attempts",
        color: "from-orange-500 to-red-500",
        fields: [
          { name: "_id", type: "ObjectId", desc: "Attempt ID" },
          { name: "quizId", type: "ObjectId", desc: "Quiz reference" },
          { name: "userId", type: "ObjectId", desc: "Student reference" },
          {
            name: "answers",
            type: "Array<Object>",
            desc: "[{questionId, selected, isCorrect}]",
          },
          { name: "score", type: "Number", desc: "Percentage score" },
          { name: "timeSpent", type: "Number", desc: "Seconds taken" },
          { name: "completedAt", type: "Date", desc: "Submission timestamp" },
        ],
      },
      {
        name: "flashcards",
        color: "from-yellow-500 to-amber-500",
        fields: [
          { name: "_id", type: "ObjectId", desc: "Flashcard set ID" },
          { name: "noteId", type: "ObjectId", desc: "Source note" },
          { name: "userId", type: "ObjectId", desc: "Creator" },
          { name: "title", type: "String", desc: "Set title" },
          {
            name: "cards",
            type: "Array<Object>",
            desc: "[{front, back, mastered}]",
          },
          { name: "lastReviewed", type: "Date", desc: "Last study session" },
          { name: "createdAt", type: "Date", desc: "Creation date" },
        ],
      },
      {
        name: "study_groups",
        color: "from-indigo-500 to-blue-500",
        fields: [
          { name: "_id", type: "ObjectId", desc: "Group ID" },
          { name: "name", type: "String", desc: "Group name" },
          { name: "description", type: "String", desc: "Group purpose" },
          { name: "creatorId", type: "ObjectId", desc: "Creator reference" },
          { name: "members", type: "Array<ObjectId>", desc: "Member user IDs" },
          { name: "inviteCode", type: "String", desc: "Unique join code" },
          { name: "isPrivate", type: "Boolean", desc: "Invite-only flag" },
          { name: "createdAt", type: "Date", desc: "Group creation date" },
        ],
      },
      {
        name: "messages",
        color: "from-pink-500 to-rose-500",
        fields: [
          { name: "_id", type: "ObjectId", desc: "Message ID" },
          {
            name: "groupId",
            type: "ObjectId",
            desc: "Group reference (null for DMs)",
          },
          { name: "senderId", type: "ObjectId", desc: "Sender user ID" },
          { name: "receiverId", type: "ObjectId", desc: "For DMs only" },
          { name: "content", type: "String", desc: "Message text" },
          {
            name: "type",
            type: "String",
            desc: "text | quiz_share | flashcard_share",
          },
          {
            name: "metadata",
            type: "Object",
            desc: "Extra data for shared content",
          },
          { name: "createdAt", type: "Date", desc: "Send timestamp" },
        ],
      },
      {
        name: "posts",
        color: "from-teal-500 to-green-500",
        fields: [
          { name: "_id", type: "ObjectId", desc: "Post ID" },
          { name: "userId", type: "ObjectId", desc: "Author reference" },
          {
            name: "contentType",
            type: "String",
            desc: "quiz | flashcard | note",
          },
          {
            name: "contentId",
            type: "ObjectId",
            desc: "Reference to shared content",
          },
          { name: "caption", type: "String", desc: "Post description" },
          {
            name: "likes",
            type: "Array<ObjectId>",
            desc: "User IDs who liked",
          },
          {
            name: "comments",
            type: "Array<Object>",
            desc: "[{userId, text, createdAt}]",
          },
          { name: "createdAt", type: "Date", desc: "Post timestamp" },
        ],
      },
    ].map((collection, i) => (
      <div
        key={i}
        className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
      >
        <div
          className={`bg-linear-to-r ${collection.color} text-white px-6 py-4`}
        >
          <h3 className="text-xl font-bold font-mono">{collection.name}</h3>
        </div>
        <div className="p-6">
          <div className="space-y-2">
            {collection.fields.map((field, j) => (
              <div
                key={j}
                className="flex items-start gap-4 p-3 bg-gray-50 rounded-lg font-mono text-sm"
              >
                <span className="font-bold text-gray-900 min-w-35">
                  {field.name}
                </span>
                <span className="text-indigo-600 min-w-30">{field.type}</span>
                <span className="text-gray-600 flex-1">{field.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    ))}

    <div className="bg-gray-900 text-white rounded-2xl p-6">
      <h3 className="font-bold mb-3 text-lg">🔗 Key Relationships</h3>
      <div className="space-y-2 text-sm font-mono">
        <p>• users ← quiz_attempts (userId)</p>
        <p>• notes → quizzes (noteId)</p>
        <p>• notes → flashcards (noteId)</p>
        <p>• quizzes ← quiz_attempts (quizId)</p>
        <p>• study_groups ← messages (groupId)</p>
        <p>• users ← messages (senderId, receiverId)</p>
        <p>• users ← posts (userId)</p>
        <p>• quizzes/flashcards ← posts (contentId)</p>
      </div>
    </div>
  </div>
);

const RoadmapSection = () => (
  <div className="space-y-6">
    {[
      {
        week: "Week 1",
        title: "Foundation",
        color: "from-blue-500 to-cyan-500",
        status: "Start Here",
        tasks: [
          { task: "Initialize Next.js project with TypeScript", time: "2h" },
          { task: "Set up TailwindCSS + shadcn/ui", time: "1h" },
          { task: "Configure Firebase Auth (Email + Google)", time: "3h" },
          { task: "Build login/signup pages", time: "4h" },
          { task: "Create protected route wrapper", time: "2h" },
          { task: "Set up MongoDB Atlas + Mongoose schemas", time: "3h" },
          { task: "Build user profile page", time: "3h" },
          { task: "Create dashboard layout with sidebar", time: "4h" },
        ],
        deliverable: "Working auth system + empty dashboard",
      },
      {
        week: "Week 2",
        title: "AI Learning Core",
        color: "from-green-500 to-emerald-500",
        status: "Critical",
        tasks: [
          { task: "Build note upload component (PDF + text)", time: "4h" },
          { task: "Integrate pdf-parse for text extraction", time: "3h" },
          { task: "Create Gemini API route for quiz generation", time: "4h" },
          { task: "Build quiz display component", time: "5h" },
          { task: "Implement quiz taking flow with timer", time: "4h" },
          { task: "Save quiz attempts to database", time: "3h" },
          { task: "Show results with explanations", time: "3h" },
          { task: "Build flashcard generation endpoint", time: "2h" },
        ],
        deliverable: "Working AI quiz generation from PDFs",
      },
      {
        week: "Week 3",
        title: "Progress & Analytics",
        color: "from-purple-500 to-pink-500",
        status: "Important",
        tasks: [
          { task: "Build analytics dashboard page", time: "4h" },
          { task: "Calculate accuracy by subject/topic", time: "3h" },
          { task: "Implement streak tracking logic", time: "3h" },
          { task: "Create mastery percentage algorithm", time: "4h" },
          { task: "Build Recharts visualizations", time: "5h" },
          { task: "Add XP system and leveling", time: "3h" },
          { task: "Create progress history timeline", time: "3h" },
          { task: "Build flashcard spaced repetition", time: "3h" },
        ],
        deliverable: "Complete analytics dashboard with charts",
      },
      {
        week: "Week 4",
        title: "Real-Time Collaboration",
        color: "from-orange-500 to-red-500",
        status: "Advanced",
        tasks: [
          { task: "Set up Socket.io server", time: "3h" },
          { task: "Build study group creation flow", time: "4h" },
          { task: "Implement invite code system", time: "3h" },
          { task: "Create group chat UI", time: "5h" },
          { task: "Add real-time messaging with Socket.io", time: "5h" },
          { task: "Implement online presence indicators", time: "3h" },
          { task: "Build message persistence", time: "3h" },
          { task: "Add typing indicators", time: "2h" },
        ],
        deliverable: "Working real-time study groups with chat",
      },
      {
        week: "Week 5",
        title: "Social Layer (Limited)",
        color: "from-yellow-500 to-amber-500",
        status: "Polish",
        tasks: [
          { task: "Build community feed page", time: "4h" },
          { task: "Create share quiz/flashcard flow", time: "3h" },
          { task: "Add like and bookmark functionality", time: "3h" },
          { task: "Build comment system", time: "4h" },
          { task: "Implement search and filters", time: "4h" },
          { task: "Create notification system", time: "4h" },
          { task: "Build user profile pages", time: "4h" },
          { task: "Add settings page", time: "2h" },
        ],
        deliverable: "Community sharing with interactions",
      },
      {
        week: "Week 6",
        title: "Polish & Deploy",
        color: "from-indigo-500 to-purple-500",
        status: "Final",
        tasks: [
          { task: "Add loading states everywhere", time: "3h" },
          { task: "Implement error boundaries", time: "2h" },
          { task: "Build dark mode toggle", time: "3h" },
          { task: "Optimize images and performance", time: "4h" },
          { task: "Add responsive mobile layouts", time: "5h" },
          { task: "Write API documentation", time: "3h" },
          { task: "Deploy to Vercel", time: "2h" },
          { task: "Set up MongoDB Atlas production", time: "2h" },
        ],
        deliverable: "Production-ready deployed application",
      },
    ].map((phase, i) => (
      <div
        key={i}
        className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
      >
        <div className={`bg-linear-to-r ${phase.color} text-white px-6 py-4`}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold">{phase.week}</h3>
              <p className="text-sm opacity-90 mt-1">{phase.title}</p>
            </div>
            <span className="bg-white bg-opacity-20 px-4 py-2 rounded-full text-sm font-semibold">
              {phase.status}
            </span>
          </div>
        </div>
        <div className="p-6">
          <div className="space-y-2 mb-4">
            {phase.tasks.map((item, j) => (
              <div
                key={j}
                className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <input type="checkbox" className="mt-1" />
                <div className="flex-1">
                  <p className="text-gray-900">{item.task}</p>
                </div>
                <span className="text-sm text-gray-500 font-mono">
                  {item.time}
                </span>
              </div>
            ))}
          </div>
          <div className="bg-linear-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 p-4 rounded-r-lg">
            <p className="text-sm font-semibold text-green-900">
              ✅ Deliverable: {phase.deliverable}
            </p>
          </div>
        </div>
      </div>
    ))}

    <div className="bg-linear-to-r from-red-50 to-orange-50 border-l-4 border-red-500 rounded-xl p-6">
      <h3 className="font-bold text-red-900 mb-3">
        ⚠️ Critical Success Factors
      </h3>
      <ul className="space-y-2 text-red-800">
        <li>
          • <strong>DO NOT skip Week 1</strong> - broken auth ruins everything
        </li>
        <li>
          • <strong>Test each feature</strong> before moving to the next week
        </li>
        <li>
          • <strong>Commit code daily</strong> with clear messages
        </li>
        <li>
          • <strong>Week 2 alone</strong> is enough for a strong portfolio
          project
        </li>
        <li>
          • <strong>Don't add features</strong> not in this roadmap until v1 is
          done
        </li>
      </ul>
    </div>
  </div>
);

const APISection = () => (
  <div className="space-y-6">
    {[
      {
        group: "🔐 Authentication",
        color: "from-blue-500 to-cyan-500",
        endpoints: [
          {
            method: "POST",
            path: "/api/auth/register",
            desc: "Create new user account",
            body: "{ email, password, displayName }",
            response: "{ success, user, token }",
          },
          {
            method: "POST",
            path: "/api/auth/login",
            desc: "User login with Firebase",
            body: "{ firebaseToken }",
            response: "{ success, user, token }",
          },
          {
            method: "GET",
            path: "/api/auth/me",
            desc: "Get current user profile",
            body: "None (uses auth header)",
            response: "{ user: {...} }",
          },
          {
            method: "PUT",
            path: "/api/auth/profile",
            desc: "Update user profile",
            body: "{ displayName, avatar, studyInterests }",
            response: "{ success, user }",
          },
        ],
      },
      {
        group: "📝 Notes & Content",
        color: "from-green-500 to-emerald-500",
        endpoints: [
          {
            method: "POST",
            path: "/api/notes/upload",
            desc: "Upload PDF or text note",
            body: "FormData with file/text, title, subject",
            response: "{ success, noteId, extractedText }",
          },
          {
            method: "GET",
            path: "/api/notes",
            desc: "Get user notes (paginated)",
            body: "Query: ?page=1&subject=math",
            response: "{ notes: [...], total, page }",
          },
          {
            method: "GET",
            path: "/api/notes/:id",
            desc: "Get single note details",
            body: "None",
            response: "{ note: {...} }",
          },
          {
            method: "DELETE",
            path: "/api/notes/:id",
            desc: "Delete note",
            body: "None",
            response: "{ success: true }",
          },
        ],
      },
      {
        group: "🧠 AI Generation",
        color: "from-purple-500 to-pink-500",
        endpoints: [
          {
            method: "POST",
            path: "/api/ai/generate-quiz",
            desc: "Generate quiz from note",
            body: "{ noteId, difficulty, numQuestions }",
            response: "{ quizId, questions: [...] }",
          },
          {
            method: "POST",
            path: "/api/ai/generate-flashcards",
            desc: "Generate flashcards from note",
            body: "{ noteId, numCards }",
            response: "{ flashcardSetId, cards: [...] }",
          },
          {
            method: "POST",
            path: "/api/ai/explain",
            desc: "Get AI explanation of concept",
            body: "{ topic, context }",
            response: '{ explanation: "..." }',
          },
        ],
      },
      {
        group: "📊 Quizzes & Attempts",
        color: "from-orange-500 to-red-500",
        endpoints: [
          {
            method: "GET",
            path: "/api/quizzes",
            desc: "Get user quizzes",
            body: "Query: ?subject=math&difficulty=easy",
            response: "{ quizzes: [...] }",
          },
          {
            method: "GET",
            path: "/api/quizzes/:id",
            desc: "Get quiz questions",
            body: "None",
            response: "{ quiz: {...}, questions: [...] }",
          },
          {
            method: "POST",
            path: "/api/quizzes/:id/attempt",
            desc: "Submit quiz answers",
            body: "{ answers: [{questionId, selected}], timeSpent }",
            response: "{ score, correct, incorrect, results: [...] }",
          },
          {
            method: "GET",
            path: "/api/quizzes/:id/attempts",
            desc: "Get quiz attempt history",
            body: "None",
            response: "{ attempts: [...] }",
          },
        ],
      },
      {
        group: "📈 Analytics",
        color: "from-yellow-500 to-amber-500",
        endpoints: [
          {
            method: "GET",
            path: "/api/analytics/overview",
            desc: "Get user stats dashboard",
            body: "None",
            response: "{ totalQuizzes, avgAccuracy, streak, mastery: {...} }",
          },
          {
            method: "GET",
            path: "/api/analytics/progress",
            desc: "Get progress over time",
            body: "Query: ?timeframe=30days",
            response: "{ chartData: [...], trends: {...} }",
          },
          {
            method: "GET",
            path: "/api/analytics/topics",
            desc: "Get performance by topic",
            body: "None",
            response: "{ topics: [{name, mastery, attempts}] }",
          },
        ],
      },
      {
        group: "👥 Study Groups",
        color: "from-indigo-500 to-blue-500",
        endpoints: [
          {
            method: "POST",
            path: "/api/groups/create",
            desc: "Create study group",
            body: "{ name, description, isPrivate }",
            response: "{ groupId, inviteCode }",
          },
          {
            method: "POST",
            path: "/api/groups/join",
            desc: "Join group with code",
            body: "{ inviteCode }",
            response: "{ success, group: {...} }",
          },
          {
            method: "GET",
            path: "/api/groups/:id",
            desc: "Get group details",
            body: "None",
            response: "{ group: {...}, members: [...] }",
          },
          {
            method: "GET",
            path: "/api/groups/:id/messages",
            desc: "Get group messages",
            body: "Query: ?limit=50&before=timestamp",
            response: "{ messages: [...] }",
          },
        ],
      },
      {
        group: "💬 Messaging (Socket.io)",
        color: "from-pink-500 to-rose-500",
        endpoints: [
          {
            method: "SOCKET",
            path: "join_group",
            desc: "Join group chat room",
            body: "{ groupId, userId }",
            response: "Emits: user_joined",
          },
          {
            method: "SOCKET",
            path: "send_message",
            desc: "Send message to group",
            body: "{ groupId, content, type }",
            response: "Emits: new_message",
          },
          {
            method: "SOCKET",
            path: "typing",
            desc: "Broadcast typing status",
            body: "{ groupId, isTyping }",
            response: "Emits: user_typing",
          },
          {
            method: "SOCKET",
            path: "disconnect",
            desc: "Handle user disconnect",
            body: "Auto",
            response: "Emits: user_left",
          },
        ],
      },
      {
        group: "🌐 Social (Limited)",
        color: "from-teal-500 to-green-500",
        endpoints: [
          {
            method: "POST",
            path: "/api/posts/create",
            desc: "Share quiz/flashcard",
            body: "{ contentType, contentId, caption }",
            response: "{ postId, post: {...} }",
          },
          {
            method: "GET",
            path: "/api/posts/feed",
            desc: "Get community posts",
            body: "Query: ?page=1&subject=math",
            response: "{ posts: [...], hasMore }",
          },
          {
            method: "POST",
            path: "/api/posts/:id/like",
            desc: "Like a post",
            body: "None",
            response: "{ success, likeCount }",
          },
          {
            method: "POST",
            path: "/api/posts/:id/comment",
            desc: "Comment on post",
            body: "{ text }",
            response: "{ success, comment: {...} }",
          },
        ],
      },
    ].map((section, i) => (
      <div
        key={i}
        className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
      >
        <div className={`bg-linear-to-r ${section.color} text-white px-6 py-4`}>
          <h3 className="text-xl font-bold">{section.group}</h3>
        </div>
        <div className="p-6">
          <div className="space-y-3">
            {section.endpoints.map((endpoint, j) => (
              <div
                key={j}
                className="border border-gray-200 rounded-lg overflow-hidden"
              >
                <div className="bg-gray-50 px-4 py-3 flex items-center gap-3">
                  <span
                    className={`px-3 py-1 rounded text-xs font-bold ${endpoint.method === "GET"
                      ? "bg-blue-100 text-blue-700"
                      : endpoint.method === "POST"
                        ? "bg-green-100 text-green-700"
                        : endpoint.method === "PUT"
                          ? "bg-yellow-100 text-yellow-700"
                          : endpoint.method === "DELETE"
                            ? "bg-red-100 text-red-700"
                            : "bg-purple-100 text-purple-700"
                      }`}
                  >
                    {endpoint.method}
                  </span>
                  <code className="text-sm font-mono text-gray-900">
                    {endpoint.path}
                  </code>
                </div>
                <div className="p-4 space-y-2">
                  <p className="text-sm text-gray-700">{endpoint.desc}</p>
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="font-semibold text-gray-600">
                        Request:
                      </span>
                      <code className="block mt-1 p-2 bg-gray-50 rounded text-gray-800">
                        {endpoint.body}
                      </code>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-600">
                        Response:
                      </span>
                      <code className="block mt-1 p-2 bg-gray-50 rounded text-gray-800">
                        {endpoint.response}
                      </code>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    ))}

    <div className="bg-gray-900 text-white rounded-2xl p-8">
      <h3 className="text-2xl font-bold mb-4">🔒 Authentication Pattern</h3>
      <div className="bg-black bg-opacity-30 rounded-lg p-4">
        <pre className="text-sm overflow-x-auto">{`// All protected routes require this header:
Authorization: Bearer <firebase_jwt_token>

// Middleware checks token and attaches user to request:
const verifyAuth = async (req, res, next) => {
  const token = req.headers.authorization?.split('Bearer ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  
  try {
    const decoded = await admin.auth().verifyIdToken(token);
    req.userId = decoded.uid;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};`}</pre>
      </div>
    </div>

    <div className="bg-linear-to-r from-indigo-50 to-purple-50 border-l-4 border-indigo-500 rounded-xl p-6">
      <h3 className="font-bold text-indigo-900 mb-3">💡 API Best Practices</h3>
      <ul className="space-y-2 text-indigo-800 text-sm">
        <li>
          • <strong>Always return consistent error format:</strong>{" "}
          {`{ error: "message", code: "ERROR_CODE" }`}
        </li>
        <li>
          • <strong>Use proper HTTP status codes:</strong> 200 (success), 201
          (created), 400 (bad request), 401 (unauthorized), 404 (not found), 500
          (server error)
        </li>
        <li>
          • <strong>Implement rate limiting:</strong> Especially for AI
          generation endpoints (expensive!)
        </li>
        <li>
          • <strong>Validate all inputs:</strong> Use Zod or Joi for request
          validation
        </li>
        <li>
          • <strong>Paginate list endpoints:</strong> Never return all records
          at once
        </li>
        <li>
          • <strong>Cache expensive operations:</strong> Store generated
          quizzes, don't regenerate
        </li>
      </ul>
    </div>
  </div>
);

export default BrainWaveProject;
