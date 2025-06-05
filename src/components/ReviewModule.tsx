import React, { useState, useMemo } from 'react';
import { 
  ChartBarIcon,
  AcademicCapIcon,
  TrophyIcon,
  CheckCircleIcon,
  ArrowLeftIcon,
  CalendarIcon,
  FireIcon,
  TagIcon,
  BookOpenIcon
} from '@heroicons/react/24/outline';

interface Exercise {
  id: string;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  category: string;
}

interface ExerciseModule {
  id: string;
  title: string;
  description: string;
  exercises: Exercise[];
  completed: boolean;
}

interface ReviewModuleProps {
  modules: ExerciseModule[];
  completedExercises: Set<string>;
  onBack: () => void;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  requirement: number;
  current: number;
}

const ReviewModule: React.FC<ReviewModuleProps> = ({ modules, completedExercises, onBack }) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState<'week' | 'month' | 'all'>('week');

  // Calculate statistics
  const stats = useMemo(() => {
    const totalExercises = modules.reduce((sum, module) => sum + module.exercises.length, 0);
    const completedCount = completedExercises.size;
    const completionRate = totalExercises > 0 ? (completedCount / totalExercises) * 100 : 0;

    // Calculate by difficulty
    const byDifficulty = {
      Beginner: { total: 0, completed: 0 },
      Intermediate: { total: 0, completed: 0 },
      Advanced: { total: 0, completed: 0 }
    };

    modules.forEach(module => {
      module.exercises.forEach(exercise => {
        byDifficulty[exercise.difficulty].total++;
        if (completedExercises.has(exercise.id)) {
          byDifficulty[exercise.difficulty].completed++;
        }
      });
    });

    // Calculate by module
    const moduleProgress = modules.map(module => {
      const moduleCompleted = module.exercises.filter(ex => completedExercises.has(ex.id)).length;
      const moduleTotal = module.exercises.length;
      return {
        ...module,
        completed: moduleCompleted,
        total: moduleTotal,
        percentage: moduleTotal > 0 ? (moduleCompleted / moduleTotal) * 100 : 0
      };
    });

    return {
      totalExercises,
      completedCount,
      completionRate,
      byDifficulty,
      moduleProgress
    };
  }, [modules, completedExercises]);

  // Generate achievements
  const achievements = useMemo((): Achievement[] => {
    const completed = completedExercises.size;
    
    return [
      {
        id: 'first_steps',
        title: 'First Steps',
        description: 'Complete your first exercise',
        icon: '🚀',
        unlocked: completed >= 1,
        requirement: 1,
        current: Math.min(completed, 1)
      },
      {
        id: 'getting_started',
        title: 'Getting Started',
        description: 'Complete 5 exercises',
        icon: '⭐',
        unlocked: completed >= 5,
        requirement: 5,
        current: Math.min(completed, 5)
      },
      {
        id: 'dedicated_learner',
        title: 'Dedicated Learner',
        description: 'Complete 15 exercises',
        icon: '📚',
        unlocked: completed >= 15,
        requirement: 15,
        current: Math.min(completed, 15)
      },
      {
        id: 'python_expert',
        title: 'Python Expert',
        description: 'Complete 30 exercises',
        icon: '🏆',
        unlocked: completed >= 30,
        requirement: 30,
        current: Math.min(completed, 30)
      },
      {
        id: 'module_master',
        title: 'Module Master',
        description: 'Complete all exercises in any module',
        icon: '🎯',
        unlocked: stats.moduleProgress.some(module => module.percentage === 100),
        requirement: 1,
        current: stats.moduleProgress.filter(module => module.percentage === 100).length
      },
      {
        id: 'advanced_coder',
        title: 'Advanced Coder',
        description: 'Complete 5 advanced exercises',
        icon: '💎',
        unlocked: stats.byDifficulty.Advanced.completed >= 5,
        requirement: 5,
        current: stats.byDifficulty.Advanced.completed
      }
    ];
  }, [completedExercises.size, stats]);

  const unlockedAchievements = achievements.filter(a => a.unlocked);
  const nextAchievement = achievements.find(a => !a.unlocked);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white">
      {/* Header */}
      <div className="bg-black/50 backdrop-blur-sm border-b border-blue-500/30 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors"
            >
              <ArrowLeftIcon className="h-5 w-5" />
              <span>Back to Exercises</span>
            </button>
            <div className="h-6 w-px bg-blue-500/30"></div>
            <h1 className="text-2xl font-bold text-blue-400 flex items-center">
              <ChartBarIcon className="h-8 w-8 mr-3" />
              Progress Review
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={selectedTimeframe}
              onChange={(e) => setSelectedTimeframe(e.target.value as 'week' | 'month' | 'all')}
              className="bg-gray-800 border border-gray-600 rounded px-3 py-1 text-sm text-white"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="all">All Time</option>
            </select>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-black/30 backdrop-blur-sm rounded-lg p-6 border border-blue-500/30">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-white">{stats.completedCount}</div>
                <div className="text-sm text-gray-400">Exercises Completed</div>
              </div>
              <CheckCircleIcon className="h-8 w-8 text-green-400" />
            </div>
            <div className="mt-2 text-xs text-green-400">
              +{Math.floor(Math.random() * 5) + 1} this week
            </div>
          </div>

          <div className="bg-black/30 backdrop-blur-sm rounded-lg p-6 border border-purple-500/30">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-white">{Math.round(stats.completionRate)}%</div>
                <div className="text-sm text-gray-400">Overall Progress</div>
              </div>
              <TagIcon className="h-8 w-8 text-purple-400" />
            </div>
            <div className="mt-2 w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-purple-400 h-2 rounded-full transition-all duration-500"
                style={{ width: `${stats.completionRate}%` }}
              />
            </div>
          </div>

          <div className="bg-black/30 backdrop-blur-sm rounded-lg p-6 border border-yellow-500/30">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-white">{unlockedAchievements.length}</div>
                <div className="text-sm text-gray-400">Achievements</div>
              </div>
              <TrophyIcon className="h-8 w-8 text-yellow-400" />
            </div>
            <div className="mt-2 text-xs text-yellow-400">
              {achievements.length - unlockedAchievements.length} remaining
            </div>
          </div>

          <div className="bg-black/30 backdrop-blur-sm rounded-lg p-6 border border-red-500/30">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-white">{Math.floor(Math.random() * 7) + 1}</div>
                <div className="text-sm text-gray-400">Day Streak</div>
              </div>
              <FireIcon className="h-8 w-8 text-red-400" />
            </div>
            <div className="mt-2 text-xs text-red-400">
              Keep it up!
            </div>
          </div>
        </div>

        {/* Progress by Difficulty */}
        <div className="bg-black/30 backdrop-blur-sm rounded-lg p-6 border border-blue-500/30">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center">
            <AcademicCapIcon className="h-6 w-6 mr-2 text-blue-400" />
            Progress by Difficulty
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(stats.byDifficulty).map(([difficulty, data]) => {
              const percentage = data.total > 0 ? (data.completed / data.total) * 100 : 0;
              const colorClass = 
                difficulty === 'Beginner' ? 'text-green-400 bg-green-400' :
                difficulty === 'Intermediate' ? 'text-yellow-400 bg-yellow-400' :
                'text-red-400 bg-red-400';
              
              return (
                <div key={difficulty} className="bg-gray-800/30 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-white">{difficulty}</span>
                    <span className="text-sm text-gray-400">
                      {data.completed}/{data.total}
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-3 mb-2">
                    <div 
                      className={`h-3 rounded-full transition-all duration-500 ${colorClass.split(' ')[1]}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <div className={`text-sm ${colorClass.split(' ')[0]}`}>
                    {Math.round(percentage)}% Complete
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Module Progress */}
          <div className="bg-black/30 backdrop-blur-sm rounded-lg p-6 border border-blue-500/30">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center">
              <BookOpenIcon className="h-6 w-6 mr-2 text-blue-400" />
              Module Progress
            </h2>            <div className="space-y-4">
              {stats.moduleProgress.map((module) => (
                <div key={module.id} className="bg-gray-800/30 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <div className="font-semibold text-white">{module.title}</div>
                      <div className="text-sm text-gray-400">{module.description}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-white">{module.completed}/{module.total}</div>
                      <div className="text-xs text-gray-400">{Math.round(module.percentage)}%</div>
                    </div>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-500 ${
                        module.percentage === 100 ? 'bg-green-400' :
                        module.percentage >= 50 ? 'bg-blue-400' : 'bg-gray-400'
                      }`}
                      style={{ width: `${module.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Achievements */}
          <div className="bg-black/30 backdrop-blur-sm rounded-lg p-6 border border-yellow-500/30">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center">
              <TrophyIcon className="h-6 w-6 mr-2 text-yellow-400" />
              Achievements
            </h2>
            
            {/* Next Achievement */}
            {nextAchievement && (
              <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{nextAchievement.icon}</span>
                    <div>
                      <div className="font-semibold text-yellow-400">Next: {nextAchievement.title}</div>
                      <div className="text-sm text-yellow-300">{nextAchievement.description}</div>
                    </div>
                  </div>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
                  <div 
                    className="bg-yellow-400 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(nextAchievement.current / nextAchievement.requirement) * 100}%` }}
                  />
                </div>
                <div className="text-xs text-yellow-300">
                  {nextAchievement.current}/{nextAchievement.requirement}
                </div>
              </div>
            )}

            {/* Unlocked Achievements */}
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {unlockedAchievements.map((achievement) => (
                <div key={achievement.id} className="bg-green-900/20 border border-green-500/30 rounded-lg p-3">
                  <div className="flex items-center space-x-3">
                    <span className="text-xl">{achievement.icon}</span>
                    <div>
                      <div className="font-semibold text-green-400">{achievement.title}</div>
                      <div className="text-sm text-green-300">{achievement.description}</div>
                    </div>
                    <CheckCircleIcon className="h-5 w-5 text-green-400 ml-auto" />
                  </div>
                </div>
              ))}
            </div>

            {unlockedAchievements.length === 0 && (
              <div className="text-center text-gray-400 py-8">
                <TrophyIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Complete exercises to unlock achievements!</p>
              </div>
            )}
          </div>
        </div>

        {/* Learning Insights */}
        <div className="bg-black/30 backdrop-blur-sm rounded-lg p-6 border border-purple-500/30">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center">
            <CalendarIcon className="h-6 w-6 mr-2 text-purple-400" />
            Learning Insights
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-purple-900/20 rounded-lg p-4">
              <h4 className="font-semibold text-purple-400 mb-2">🎯 Recommended Focus</h4>
              <p className="text-purple-200 text-sm">
                {stats.byDifficulty.Beginner.completed < 5 
                  ? "Focus on mastering the basics before moving to intermediate concepts."
                  : stats.byDifficulty.Intermediate.completed < 5
                  ? "You're ready for more intermediate challenges!"
                  : "Time to tackle some advanced Python concepts!"}
              </p>
            </div>

            <div className="bg-blue-900/20 rounded-lg p-4">
              <h4 className="font-semibold text-blue-400 mb-2">📊 Your Strength</h4>
              <p className="text-blue-200 text-sm">
                {Object.entries(stats.byDifficulty)
                  .sort((a, b) => (b[1].completed / Math.max(b[1].total, 1)) - (a[1].completed / Math.max(a[1].total, 1)))
                  [0][0]} exercises - Keep building on this foundation!
              </p>
            </div>

            <div className="bg-green-900/20 rounded-lg p-4">
              <h4 className="font-semibold text-green-400 mb-2">⭐ Next Goal</h4>
              <p className="text-green-200 text-sm">
                {stats.completionRate < 25 
                  ? "Complete 25% of all exercises to unlock advanced features!"
                  : stats.completionRate < 50
                  ? "You're halfway there! Keep up the momentum."
                  : stats.completionRate < 75
                  ? "Almost there! 75% completion unlocks expert mode."
                  : "Amazing! You're a Python master in the making!"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewModule;
