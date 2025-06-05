import React, { useState } from 'react';
import { ArrowLeftIcon, AcademicCapIcon, BookOpenIcon, UserGroupIcon, ChartBarIcon, PlayIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import PyxomExercises from '../components/PyxomExercises';

const PyXomPlatform: React.FC = () => {
  const navigate = useNavigate();
  const [showExercises, setShowExercises] = useState<boolean>(false);
  if (showExercises) {
    return <PyxomExercises onBack={() => setShowExercises(false)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      {/* Header */}
      <header className="bg-black/50 backdrop-blur-sm border-b border-blue-500/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/')}
                className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors"
              >
                <ArrowLeftIcon className="h-5 w-5" />
                <span>Back to Matrix</span>
              </button>
              <div className="h-6 w-px bg-blue-500/30"></div>
              <h1 className="text-2xl font-bold text-blue-400 font-matrix">PyXOM</h1>
            </div>            <div className="text-sm text-blue-300">
              Interactive Python Learning Platform
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">
            Welcome to <span className="text-blue-400">PyXOM</span>
          </h2>
          <p className="text-xl text-blue-200 mb-8">
            Interactive Python Learning Platform with Real-time Code Execution
          </p>
          <div className="inline-flex items-center px-6 py-3 bg-blue-600/20 rounded-full border border-blue-500/30">
            <AcademicCapIcon className="h-6 w-6 text-blue-400 mr-2" />
            <span className="text-blue-300">Comprehensive Python Programming Education</span>
          </div>
        </div>        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          <div className="bg-black/30 backdrop-blur-sm rounded-lg p-6 border border-blue-500/30 hover:border-blue-400/50 transition-all duration-300">
            <div className="flex items-center mb-4">
              <BookOpenIcon className="h-8 w-8 text-blue-400 mr-3" />
              <h3 className="text-xl font-semibold text-white">Interactive Exercises</h3>
            </div>
            <p className="text-blue-200">
              14 comprehensive Python modules with hands-on coding exercises, from basics to advanced algorithms.
            </p>
          </div>

          <div className="bg-black/30 backdrop-blur-sm rounded-lg p-6 border border-purple-500/30 hover:border-purple-400/50 transition-all duration-300">
            <div className="flex items-center mb-4">
              <UserGroupIcon className="h-8 w-8 text-purple-400 mr-3" />
              <h3 className="text-xl font-semibold text-white">Code Editor & Debugger</h3>
            </div>
            <p className="text-purple-200">
              Real-time Python code editor with syntax highlighting, auto-indentation, and debugging tools.
            </p>
          </div>

          <div className="bg-black/30 backdrop-blur-sm rounded-lg p-6 border border-indigo-500/30 hover:border-indigo-400/50 transition-all duration-300">
            <div className="flex items-center mb-4">
              <ChartBarIcon className="h-8 w-8 text-indigo-400 mr-3" />
              <h3 className="text-xl font-semibold text-white">Progress Tracking</h3>
            </div>
            <p className="text-indigo-200">
              Detailed analytics, achievement system, and personalized learning insights to track your growth.
            </p>
          </div>
        </div>{/* Course Categories */}
        <div className="bg-black/30 backdrop-blur-sm rounded-lg p-8 border border-blue-500/30">
          <h3 className="text-2xl font-bold text-white mb-6 text-center">Available Learning Modules</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: 'Python Basics', color: 'text-green-400', count: 'Variables & Operations' },
              { name: 'Control Flow', color: 'text-blue-400', count: 'Loops & Conditionals' },
              { name: 'Functions', color: 'text-purple-400', count: 'Modular Programming' },
              { name: 'Data Structures', color: 'text-yellow-400', count: 'Lists & Dictionaries' },
              { name: 'String Manipulation', color: 'text-red-400', count: 'Text Processing' },
              { name: 'File Handling', color: 'text-indigo-400', count: 'I/O Operations' },
              { name: 'Error Handling', color: 'text-pink-400', count: 'Exception Management' },
              { name: 'Classes & Objects', color: 'text-orange-400', count: 'OOP Concepts' },
              { name: 'Modules & Packages', color: 'text-cyan-400', count: 'Code Organization' },
              { name: 'Iterators & Generators', color: 'text-emerald-400', count: 'Advanced Concepts' },
              { name: 'Decorators', color: 'text-violet-400', count: 'Meta-programming' },
              { name: 'Web APIs & JSON', color: 'text-rose-400', count: 'Data Exchange' },
              { name: 'Testing & Debugging', color: 'text-amber-400', count: 'Quality Assurance' },
              { name: 'Algorithms', color: 'text-lime-400', count: 'Problem Solving' }
            ].map((category, index) => (
              <div key={index} className="bg-black/40 rounded-lg p-4 border border-gray-600/30 hover:border-gray-500/50 transition-all duration-300 cursor-pointer group">
                <div className={`text-lg font-semibold ${category.color} group-hover:scale-105 transition-transform`}>
                  {category.name}
                </div>
                <div className="text-sm text-gray-400 mt-1">
                  {category.count}
                </div>
              </div>
            ))}
          </div>
        </div>{/* Launch Interactive Learning */}
        <div className="mt-12 text-center">
          <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-lg p-8 border border-blue-500/30">
            <h3 className="text-2xl font-bold text-white mb-4">🚀 Start Interactive Python Learning</h3>
            <p className="text-blue-200 mb-6">
              Experience hands-on Python programming with 14 comprehensive modules, interactive code editor, 
              real-time debugging tools, and progress tracking.
            </p>
            <button
              onClick={() => setShowExercises(true)}
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg text-white font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <PlayIcon className="h-6 w-6 mr-2" />
              Launch Interactive Exercises
            </button>
            <div className="mt-4 flex flex-wrap justify-center gap-2 text-sm">
              <span className="px-3 py-1 bg-green-600/20 border border-green-500/30 rounded-full text-green-400">
                ✓ 14 Learning Modules
              </span>
              <span className="px-3 py-1 bg-blue-600/20 border border-blue-500/30 rounded-full text-blue-400">
                ✓ Interactive Code Editor
              </span>
              <span className="px-3 py-1 bg-purple-600/20 border border-purple-500/30 rounded-full text-purple-400">
                ✓ Real-time Debugging
              </span>
              <span className="px-3 py-1 bg-yellow-600/20 border border-yellow-500/30 rounded-full text-yellow-400">
                ✓ Progress Analytics
              </span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-black/50 backdrop-blur-sm border-t border-blue-500/30 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-blue-300">
            <p className="mb-2">© 2025 PyXOM Platform - Educational Technology</p>
            <p className="text-sm text-blue-400">Developed by Xabier Olaz Moratinos</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PyXomPlatform;
