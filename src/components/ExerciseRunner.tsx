import React, { useState, useEffect } from 'react';
import { 
  CheckCircleIcon, 
  XCircleIcon, 
  ClockIcon,
  BoltIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  PlayIcon
} from '@heroicons/react/24/outline';

interface ExerciseResults {
  success: boolean;
  output: string;
  tests_passed: number;
  total_tests: number;
  errors: string[];
  execution_time?: number;
  memory_usage?: number;
}

interface Exercise {
  id: string;
  title: string;
  description: string;
  tests: Array<{
    input: string;
    expected: string;
    description: string;
  }>;
}

interface ExerciseRunnerProps {
  results: ExerciseResults;
  exercise: Exercise;
}

const ExerciseRunner: React.FC<ExerciseRunnerProps> = ({ results, exercise }) => {
  const [showDetailedResults, setShowDetailedResults] = useState<boolean>(false);
  const [animateProgress, setAnimateProgress] = useState<boolean>(false);

  useEffect(() => {
    // Animate progress bar
    setAnimateProgress(true);
    const timer = setTimeout(() => setAnimateProgress(false), 1000);
    return () => clearTimeout(timer);
  }, [results]);

  const progressPercentage = (results.tests_passed / results.total_tests) * 100;
  const isAllPassed = results.tests_passed === results.total_tests;

  const getPerformanceRating = () => {
    if (results.execution_time === undefined) return null;
    
    if (results.execution_time < 100) return { label: 'Excellent', color: 'text-green-400', bg: 'bg-green-400/20' };
    if (results.execution_time < 500) return { label: 'Good', color: 'text-blue-400', bg: 'bg-blue-400/20' };
    if (results.execution_time < 1000) return { label: 'Fair', color: 'text-yellow-400', bg: 'bg-yellow-400/20' };
    return { label: 'Slow', color: 'text-red-400', bg: 'bg-red-400/20' };
  };

  const performance = getPerformanceRating();

  return (
    <div className="bg-black/30 backdrop-blur-sm rounded-lg border border-blue-500/30 overflow-hidden">
      {/* Results Header */}
      <div className={`p-4 border-b border-gray-700/50 ${
        isAllPassed ? 'bg-green-900/20' : results.success ? 'bg-yellow-900/20' : 'bg-red-900/20'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {isAllPassed ? (
              <CheckCircleIcon className="h-8 w-8 text-green-400" />
            ) : results.success ? (
              <ClockIcon className="h-8 w-8 text-yellow-400" />
            ) : (
              <XCircleIcon className="h-8 w-8 text-red-400" />
            )}
            <div>
              <h3 className="text-lg font-semibold text-white">
                {isAllPassed ? 'All Tests Passed!' : 
                 results.success ? 'Partial Success' : 'Tests Failed'}
              </h3>
              <p className={`text-sm ${
                isAllPassed ? 'text-green-300' : 
                results.success ? 'text-yellow-300' : 'text-red-300'
              }`}>
                {results.tests_passed} of {results.total_tests} tests passed
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Performance Metrics */}
            {performance && (
              <div className={`px-3 py-1 rounded-full text-sm ${performance.bg} ${performance.color}`}>
                <BoltIcon className="h-4 w-4 inline mr-1" />
                {performance.label}
              </div>
            )}
            
            <button
              onClick={() => setShowDetailedResults(!showDetailedResults)}
              className="px-3 py-1 bg-blue-600/20 border border-blue-500/30 rounded text-sm text-blue-400 hover:bg-blue-600/30 transition-colors"
            >
              {showDetailedResults ? 'Hide Details' : 'Show Details'}
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex justify-between text-sm text-gray-400 mb-2">
            <span>Test Progress</span>
            <span>{Math.round(progressPercentage)}%</span>
          </div>
          <div className="w-full bg-gray-700/50 rounded-full h-2 overflow-hidden">
            <div 
              className={`h-full transition-all duration-1000 ease-out ${
                isAllPassed ? 'bg-green-400' : 
                results.success ? 'bg-yellow-400' : 'bg-red-400'
              } ${animateProgress ? 'animate-pulse' : ''}`}
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Quick Summary */}
      <div className="p-4 bg-gray-900/30">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Test Results */}
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-600/20 rounded-lg">
              <ChartBarIcon className="h-6 w-6 text-blue-400" />
            </div>
            <div>
              <div className="text-sm text-gray-400">Tests Passed</div>
              <div className="text-lg font-semibold text-white">
                {results.tests_passed}/{results.total_tests}
              </div>
            </div>
          </div>

          {/* Execution Time */}
          {results.execution_time !== undefined && (
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-600/20 rounded-lg">
                <ClockIcon className="h-6 w-6 text-purple-400" />
              </div>
              <div>
                <div className="text-sm text-gray-400">Execution Time</div>
                <div className="text-lg font-semibold text-white">
                  {results.execution_time}ms
                </div>
              </div>
            </div>
          )}

          {/* Memory Usage */}
          {results.memory_usage !== undefined && (
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-indigo-600/20 rounded-lg">
                <BoltIcon className="h-6 w-6 text-indigo-400" />
              </div>
              <div>
                <div className="text-sm text-gray-400">Memory Used</div>
                <div className="text-lg font-semibold text-white">
                  {(results.memory_usage / 1024).toFixed(1)}KB
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Output Section */}
      {results.output && (
        <div className="p-4 border-t border-gray-700/50 bg-gray-900/20">
          <h4 className="text-sm font-semibold text-gray-300 mb-2 flex items-center">
            <PlayIcon className="h-4 w-4 mr-2" />
            Program Output
          </h4>
          <div className="bg-black/50 rounded-lg p-3 font-mono text-sm">
            <pre className="text-green-400 whitespace-pre-wrap">{results.output}</pre>
          </div>
        </div>
      )}

      {/* Errors Section */}
      {results.errors.length > 0 && (
        <div className="p-4 border-t border-gray-700/50 bg-red-900/10">
          <h4 className="text-sm font-semibold text-red-400 mb-2 flex items-center">
            <ExclamationTriangleIcon className="h-4 w-4 mr-2" />
            Errors & Issues
          </h4>
          <div className="space-y-2">
            {results.errors.map((error, index) => (
              <div key={index} className="bg-red-900/20 border border-red-500/30 rounded-lg p-3">
                <div className="text-red-300 text-sm font-mono">{error}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Detailed Test Results */}
      {showDetailedResults && (
        <div className="p-4 border-t border-gray-700/50 bg-gray-900/10">
          <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
            <ChartBarIcon className="h-5 w-5 mr-2 text-blue-400" />
            Detailed Test Results
          </h4>
          
          <div className="space-y-3">
            {exercise.tests.map((test, index) => {
              const isPassed = index < results.tests_passed;
              return (
                <div 
                  key={index}
                  className={`p-4 rounded-lg border ${
                    isPassed 
                      ? 'bg-green-900/20 border-green-500/30' 
                      : 'bg-red-900/20 border-red-500/30'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      {isPassed ? (
                        <CheckCircleIcon className="h-5 w-5 text-green-400" />
                      ) : (
                        <XCircleIcon className="h-5 w-5 text-red-400" />
                      )}
                      <span className="font-medium text-white">
                        Test {index + 1}: {test.description}
                      </span>
                    </div>
                    <span className={`text-sm px-2 py-1 rounded ${
                      isPassed ? 'bg-green-600/20 text-green-400' : 'bg-red-600/20 text-red-400'
                    }`}>
                      {isPassed ? 'PASSED' : 'FAILED'}
                    </span>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    {test.input && (
                      <div>
                        <span className="text-gray-400">Input: </span>
                        <code className="bg-gray-800/50 px-2 py-1 rounded text-blue-300">
                          {test.input}
                        </code>
                      </div>
                    )}
                    <div>
                      <span className="text-gray-400">Expected: </span>
                      <code className="bg-gray-800/50 px-2 py-1 rounded text-green-300">
                        {test.expected}
                      </code>
                    </div>
                    {!isPassed && (
                      <div>
                        <span className="text-gray-400">Actual: </span>
                        <code className="bg-gray-800/50 px-2 py-1 rounded text-red-300">
                          {results.output || 'No output'}
                        </code>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Success Message */}
          {isAllPassed && (
            <div className="mt-6 p-4 bg-green-900/20 border border-green-500/30 rounded-lg">
              <div className="flex items-center space-x-3">
                <CheckCircleIcon className="h-8 w-8 text-green-400" />
                <div>
                  <h5 className="text-lg font-semibold text-green-400">
                    🎉 Excellent Work!
                  </h5>
                  <p className="text-green-300">
                    You've successfully completed this exercise. All tests are passing!
                  </p>
                </div>
              </div>
              
              {/* Achievement Badge */}
              <div className="mt-4 flex items-center space-x-2">
                <div className="px-3 py-1 bg-green-600/20 border border-green-500/30 rounded-full text-sm text-green-400">
                  🏆 Exercise Completed
                </div>
                <div className="px-3 py-1 bg-blue-600/20 border border-blue-500/30 rounded-full text-sm text-blue-400">
                  +10 XP
                </div>
              </div>
            </div>
          )}

          {/* Hints for Failed Tests */}
          {!isAllPassed && (
            <div className="mt-6 p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
              <h5 className="font-semibold text-blue-400 mb-2 flex items-center">
                <InformationCircleIcon className="h-5 w-5 mr-2" />
                💡 Debugging Tips
              </h5>
              <ul className="text-blue-200 text-sm space-y-1">
                <li>• Check your indentation - Python is sensitive to whitespace</li>
                <li>• Make sure you're returning the correct data type</li>
                <li>• Verify your logic handles all edge cases</li>
                <li>• Use print() statements to debug intermediate values</li>
                <li>• Read the error messages carefully for clues</li>
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ExerciseRunner;
