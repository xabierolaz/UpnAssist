import React from 'react';
import { ArrowLeftIcon, AcademicCapIcon, BookOpenIcon, UserGroupIcon, ChartBarIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

const PyXomPlatform: React.FC = () => {
  const navigate = useNavigate();

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
            </div>
            <div className="text-sm text-blue-300">
              Educational MOOC Platform
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">
            Welcome to <span className="text-blue-400">PyXOM</span>
          </h2>
          <p className="text-xl text-blue-200 mb-8">
            Advanced Educational Platform for Interactive Learning
          </p>
          <div className="inline-flex items-center px-6 py-3 bg-blue-600/20 rounded-full border border-blue-500/30">
            <AcademicCapIcon className="h-6 w-6 text-blue-400 mr-2" />
            <span className="text-blue-300">Massive Open Online Course System</span>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          <div className="bg-black/30 backdrop-blur-sm rounded-lg p-6 border border-blue-500/30 hover:border-blue-400/50 transition-all duration-300">
            <div className="flex items-center mb-4">
              <BookOpenIcon className="h-8 w-8 text-blue-400 mr-3" />
              <h3 className="text-xl font-semibold text-white">Interactive Courses</h3>
            </div>
            <p className="text-blue-200">
              Comprehensive learning modules with hands-on exercises and real-time feedback.
            </p>
          </div>

          <div className="bg-black/30 backdrop-blur-sm rounded-lg p-6 border border-purple-500/30 hover:border-purple-400/50 transition-all duration-300">
            <div className="flex items-center mb-4">
              <UserGroupIcon className="h-8 w-8 text-purple-400 mr-3" />
              <h3 className="text-xl font-semibold text-white">Collaborative Learning</h3>
            </div>
            <p className="text-purple-200">
              Connect with peers, join study groups, and participate in collaborative projects.
            </p>
          </div>

          <div className="bg-black/30 backdrop-blur-sm rounded-lg p-6 border border-indigo-500/30 hover:border-indigo-400/50 transition-all duration-300">
            <div className="flex items-center mb-4">
              <ChartBarIcon className="h-8 w-8 text-indigo-400 mr-3" />
              <h3 className="text-xl font-semibold text-white">Progress Analytics</h3>
            </div>
            <p className="text-indigo-200">
              Track your learning progress with detailed analytics and personalized insights.
            </p>
          </div>
        </div>

        {/* Course Categories */}
        <div className="bg-black/30 backdrop-blur-sm rounded-lg p-8 border border-blue-500/30">
          <h3 className="text-2xl font-bold text-white mb-6 text-center">Available Course Categories</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: 'Machine Learning', color: 'text-green-400', count: '12 courses' },
              { name: 'Data Science', color: 'text-blue-400', count: '8 courses' },
              { name: 'Neural Networks', color: 'text-purple-400', count: '6 courses' },
              { name: 'Python Programming', color: 'text-yellow-400', count: '15 courses' },
              { name: 'Statistics', color: 'text-red-400', count: '10 courses' },
              { name: 'Deep Learning', color: 'text-indigo-400', count: '7 courses' },
              { name: 'AI Ethics', color: 'text-pink-400', count: '4 courses' },
              { name: 'Research Methods', color: 'text-orange-400', count: '9 courses' }
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
        </div>

        {/* Integration Notice */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center px-6 py-3 bg-yellow-600/20 rounded-lg border border-yellow-500/30">
            <div className="text-yellow-400 mr-2">⚡</div>
            <span className="text-yellow-300">
              Integration with external PyXom platform in progress...
            </span>
          </div>
          <p className="text-sm text-gray-400 mt-4">
            This interface provides a preview of PyXOM platform capabilities.<br/>
            Full integration requires connecting to the external PyXom directory.
          </p>
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
