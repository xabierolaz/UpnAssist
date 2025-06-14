import React, { useState, useEffect, useMemo } from 'react';
import { 
  CheckCircleIcon, 
  AcademicCapIcon,
  ChartBarIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';
import CodeEditor from './CodeEditor';
import ExerciseRunner from './ExerciseRunner';
import ReviewModule from './ReviewModule';

interface Exercise {
  id: string;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  template: string;
  solution: string;
  tests: Array<{
    input: string;
    expected: string;
    description: string;
  }>;
  hints: string[];
  category: string;
}

interface ExerciseModule {
  id: string;
  title: string;
  description: string;
  exercises: Exercise[];
  completed: boolean;
}

interface PyxomExercisesProps {
  onBack?: () => void;
}

const PyxomExercises: React.FC<PyxomExercisesProps> = ({ onBack }) => {
  const [currentModule, setCurrentModule] = useState<number>(0);
  const [currentExercise, setCurrentExercise] = useState<number>(0);
  const [userCode, setUserCode] = useState<string>('');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [results, setResults] = useState<{
    success: boolean;
    output: string;
    tests_passed: number;
    total_tests: number;
    errors: string[];
  } | null>(null);
  const [showReview, setShowReview] = useState<boolean>(false);  const [completedExercises, setCompletedExercises] = useState<Set<string>>(new Set());

  // Define 14 comprehensive Python learning modules
  const modules: ExerciseModule[] = useMemo(() => [
    {
      id: 'basics',
      title: 'Python Basics',
      description: 'Variables, data types, and basic operations',
      completed: false,
      exercises: [
        {
          id: 'hello_world',
          title: 'Hello World',
          description: 'Write your first Python program',
          difficulty: 'Beginner',
          template: '# Write a program that prints "Hello, World!"\n\n',
          solution: 'print("Hello, World!")',
          tests: [
            { input: '', expected: 'Hello, World!', description: 'Should print Hello, World!' }
          ],
          hints: ['Use the print() function', 'Remember to use quotes around text'],
          category: 'basics'
        },
        {
          id: 'variables',
          title: 'Variable Assignment',
          description: 'Learn to work with variables',
          difficulty: 'Beginner',
          template: '# Create variables and perform basic operations\n# Create a variable called name with your name\n# Create a variable called age with your age\n# Print both variables\n\n',
          solution: 'name = "Alice"\nage = 25\nprint(f"Name: {name}, Age: {age}")',
          tests: [
            { input: '', expected: 'Name: Alice, Age: 25', description: 'Should display name and age' }
          ],
          hints: ['Use = to assign values', 'Use f-strings for formatting'],
          category: 'basics'
        }
      ]
    },
    {
      id: 'control_flow',
      title: 'Control Flow',
      description: 'Conditionals, loops, and decision making',
      completed: false,
      exercises: [
        {
          id: 'if_statements',
          title: 'If Statements',
          description: 'Make decisions with if statements',
          difficulty: 'Beginner',
          template: '# Write a program that checks if a number is positive, negative, or zero\nnum = 5\n\n',
          solution: 'num = 5\nif num > 0:\n    print("Positive")\nelif num < 0:\n    print("Negative")\nelse:\n    print("Zero")',
          tests: [
            { input: '5', expected: 'Positive', description: 'Should identify positive numbers' },
            { input: '-3', expected: 'Negative', description: 'Should identify negative numbers' },
            { input: '0', expected: 'Zero', description: 'Should identify zero' }
          ],
          hints: ['Use if, elif, else statements', 'Remember proper indentation'],
          category: 'control_flow'
        },
        {
          id: 'for_loops',
          title: 'For Loops',
          description: 'Iterate with for loops',
          difficulty: 'Beginner',
          template: '# Write a program that prints numbers from 1 to 5\n\n',
          solution: 'for i in range(1, 6):\n    print(i)',
          tests: [
            { input: '', expected: '1\n2\n3\n4\n5', description: 'Should print numbers 1 to 5' }
          ],
          hints: ['Use range() function', 'Remember loop syntax'],
          category: 'control_flow'
        }
      ]
    },
    {
      id: 'functions',
      title: 'Functions',
      description: 'Creating and using functions',
      completed: false,
      exercises: [
        {
          id: 'basic_function',
          title: 'Basic Function',
          description: 'Create your first function',
          difficulty: 'Intermediate',
          template: '# Create a function that takes two numbers and returns their sum\n\n',
          solution: 'def add_numbers(a, b):\n    return a + b\n\nresult = add_numbers(3, 5)\nprint(result)',
          tests: [
            { input: 'add_numbers(3, 5)', expected: '8', description: 'Should return sum of two numbers' }
          ],
          hints: ['Use def keyword', 'Use return statement'],
          category: 'functions'
        }
      ]
    },
    {
      id: 'data_structures',
      title: 'Data Structures',
      description: 'Lists, dictionaries, and sets',
      completed: false,
      exercises: [
        {
          id: 'lists',
          title: 'Working with Lists',
          description: 'Create and manipulate lists',
          difficulty: 'Intermediate',
          template: '# Create a list of fruits and perform operations\n\n',
          solution: 'fruits = ["apple", "banana", "orange"]\nfruits.append("grape")\nprint(fruits)',
          tests: [
            { input: '', expected: "['apple', 'banana', 'orange', 'grape']", description: 'Should create and modify list' }
          ],
          hints: ['Use square brackets []', 'Use append() method'],
          category: 'data_structures'
        }
      ]
    },
    {
      id: 'strings',
      title: 'String Manipulation',
      description: 'Working with text and strings',
      completed: false,
      exercises: [
        {
          id: 'string_methods',
          title: 'String Methods',
          description: 'Use string methods for text processing',
          difficulty: 'Intermediate',
          template: '# Process a string using various methods\ntext = "Hello World"\n\n',
          solution: 'text = "Hello World"\nprint(text.upper())\nprint(text.lower())\nprint(text.replace("World", "Python"))',
          tests: [
            { input: '', expected: 'HELLO WORLD\nhello world\nHello Python', description: 'Should demonstrate string methods' }
          ],
          hints: ['Use upper(), lower(), replace() methods'],
          category: 'strings'
        }
      ]
    },
    {
      id: 'file_handling',
      title: 'File Handling',
      description: 'Reading from and writing to files',
      completed: false,
      exercises: [
        {
          id: 'file_operations',
          title: 'File Operations',
          description: 'Read and write files',
          difficulty: 'Intermediate',
          template: '# Simulate file operations (using variables)\ncontent = "This is file content"\n\n',
          solution: 'content = "This is file content"\nlines = content.split("\\n")\nfor line in lines:\n    print(f"Line: {line}")',
          tests: [
            { input: '', expected: 'Line: This is file content', description: 'Should process file content' }
          ],
          hints: ['Use split() to process lines', 'Use with statement for files'],
          category: 'file_handling'
        }
      ]
    },
    {
      id: 'error_handling',
      title: 'Error Handling',
      description: 'Try-except blocks and debugging',
      completed: false,
      exercises: [
        {
          id: 'try_except',
          title: 'Try-Except Blocks',
          description: 'Handle errors gracefully',
          difficulty: 'Intermediate',
          template: '# Handle division by zero error\n\n',
          solution: 'try:\n    result = 10 / 0\nexcept ZeroDivisionError:\n    print("Cannot divide by zero!")\nelse:\n    print(f"Result: {result}")',
          tests: [
            { input: '', expected: 'Cannot divide by zero!', description: 'Should handle division by zero' }
          ],
          hints: ['Use try-except blocks', 'Catch specific exceptions'],
          category: 'error_handling'
        }
      ]
    },
    {
      id: 'classes_objects',
      title: 'Classes and Objects',
      description: 'Object-oriented programming basics',
      completed: false,
      exercises: [
        {
          id: 'basic_class',
          title: 'Basic Class',
          description: 'Create your first class',
          difficulty: 'Advanced',
          template: '# Create a simple Person class\n\n',
          solution: 'class Person:\n    def __init__(self, name, age):\n        self.name = name\n        self.age = age\n    \n    def introduce(self):\n        return f"Hi, I\'m {self.name} and I\'m {self.age} years old"\n\nperson = Person("Alice", 30)\nprint(person.introduce())',
          tests: [
            { input: '', expected: "Hi, I'm Alice and I'm 30 years old", description: 'Should create and use class' }
          ],
          hints: ['Use class keyword', 'Define __init__ method', 'Use self parameter'],
          category: 'classes_objects'
        }
      ]
    },
    {
      id: 'modules_packages',
      title: 'Modules and Packages',
      description: 'Importing and organizing code',
      completed: false,
      exercises: [
        {
          id: 'imports',
          title: 'Import Modules',
          description: 'Work with Python modules',
          difficulty: 'Intermediate',
          template: '# Import and use math module\n\n',
          solution: 'import math\n\nprint(math.sqrt(16))\nprint(math.pi)',
          tests: [
            { input: '', expected: '4.0\n3.141592653589793', description: 'Should use math module functions' }
          ],
          hints: ['Use import statement', 'Access module functions with dot notation'],
          category: 'modules_packages'
        }
      ]
    },
    {
      id: 'iterators_generators',
      title: 'Iterators and Generators',
      description: 'Advanced iteration concepts',
      completed: false,
      exercises: [
        {
          id: 'generators',
          title: 'Generator Functions',
          description: 'Create generator functions',
          difficulty: 'Advanced',
          template: '# Create a generator that yields even numbers\n\n',
          solution: 'def even_numbers(n):\n    for i in range(0, n, 2):\n        yield i\n\nfor num in even_numbers(10):\n    print(num)',
          tests: [
            { input: '', expected: '0\n2\n4\n6\n8', description: 'Should generate even numbers' }
          ],
          hints: ['Use yield keyword', 'Generator functions return iterators'],
          category: 'iterators_generators'
        }
      ]
    },
    {
      id: 'decorators',
      title: 'Decorators',
      description: 'Function decorators and meta-programming',
      completed: false,
      exercises: [
        {
          id: 'simple_decorator',
          title: 'Simple Decorator',
          description: 'Create a timing decorator',
          difficulty: 'Advanced',
          template: '# Create a decorator that prints function name\n\n',
          solution: 'def name_decorator(func):\n    def wrapper(*args, **kwargs):\n        print(f"Calling function: {func.__name__}")\n        return func(*args, **kwargs)\n    return wrapper\n\n@name_decorator\ndef greet(name):\n    return f"Hello, {name}!"\n\nresult = greet("World")\nprint(result)',
          tests: [
            { input: '', expected: 'Calling function: greet\nHello, World!', description: 'Should apply decorator' }
          ],
          hints: ['Use @ syntax for decorators', 'Decorators wrap functions'],
          category: 'decorators'
        }
      ]
    },
    {
      id: 'web_apis',
      title: 'Web APIs and JSON',
      description: 'Working with web data',
      completed: false,
      exercises: [
        {
          id: 'json_handling',
          title: 'JSON Processing',
          description: 'Parse and create JSON data',
          difficulty: 'Intermediate',
          template: '# Work with JSON data\nimport json\n\n',
          solution: 'import json\n\ndata = {"name": "Alice", "age": 30, "city": "New York"}\njson_string = json.dumps(data)\nprint(json_string)\n\nparsed_data = json.loads(json_string)\nprint(parsed_data["name"])',
          tests: [
            { input: '', expected: '{"name": "Alice", "age": 30, "city": "New York"}\nAlice', description: 'Should handle JSON data' }
          ],
          hints: ['Use json.dumps() and json.loads()', 'JSON is text representation of data'],
          category: 'web_apis'
        }
      ]
    },
    {
      id: 'testing_debugging',
      title: 'Testing and Debugging',
      description: 'Writing tests and debugging code',
      completed: false,
      exercises: [
        {
          id: 'unit_tests',
          title: 'Unit Testing',
          description: 'Write unit tests for functions',
          difficulty: 'Advanced',
          template: '# Write tests for a calculator function\n\n',
          solution: 'def add(a, b):\n    return a + b\n\ndef test_add():\n    assert add(2, 3) == 5\n    assert add(-1, 1) == 0\n    assert add(0, 0) == 0\n    print("All tests passed!")\n\ntest_add()',
          tests: [
            { input: '', expected: 'All tests passed!', description: 'Should run unit tests' }
          ],
          hints: ['Use assert statements', 'Test edge cases'],
          category: 'testing_debugging'
        }
      ]
    },
    {
      id: 'algorithms',
      title: 'Algorithms and Data Analysis',
      description: 'Common algorithms and problem solving',
      completed: false,
      exercises: [
        {
          id: 'sorting',
          title: 'Sorting Algorithm',
          description: 'Implement bubble sort',
          difficulty: 'Advanced',
          template: '# Implement bubble sort algorithm\n\n',
          solution: 'def bubble_sort(arr):\n    n = len(arr)\n    for i in range(n):\n        for j in range(0, n-i-1):\n            if arr[j] > arr[j+1]:\n                arr[j], arr[j+1] = arr[j+1], arr[j]\n    return arr\n\nnumbers = [64, 34, 25, 12, 22, 11, 90]\nsorted_numbers = bubble_sort(numbers.copy())\nprint(sorted_numbers)',
          tests: [
            { input: '', expected: '[11, 12, 22, 25, 34, 64, 90]', description: 'Should sort numbers' }
          ],
          hints: ['Compare adjacent elements', 'Swap if in wrong order'],
          category: 'algorithms'        }
      ]
    }
  ], []);

  useEffect(() => {
    // Initialize user code with current exercise template
    if (modules[currentModule]?.exercises[currentExercise]) {
      setUserCode(modules[currentModule].exercises[currentExercise].template);
    }
  }, [currentModule, currentExercise, modules]);

  const handleRunCode = async () => {
    setIsRunning(true);
    try {
      // Simulate code execution and testing
      const currentEx = modules[currentModule].exercises[currentExercise];
      
      // Simple code evaluation simulation
      const mockResults = {
        success: userCode.includes('print') || userCode.includes('return'),
        output: 'Code executed successfully!',
        tests_passed: Math.floor(Math.random() * currentEx.tests.length) + 1,
        total_tests: currentEx.tests.length,
        errors: []
      };

      setResults(mockResults);
      
      if (mockResults.tests_passed === mockResults.total_tests) {
        setCompletedExercises(prev => new Set([...prev, currentEx.id]));
      }    } catch {
      setResults({
        success: false,
        output: '',
        tests_passed: 0,
        total_tests: modules[currentModule].exercises[currentExercise].tests.length,
        errors: ['Code execution failed']
      });
    } finally {
      setIsRunning(false);
    }
  };

  const nextExercise = () => {
    const currentModuleData = modules[currentModule];
    if (currentExercise < currentModuleData.exercises.length - 1) {
      setCurrentExercise(currentExercise + 1);
    } else if (currentModule < modules.length - 1) {
      setCurrentModule(currentModule + 1);
      setCurrentExercise(0);
    }
    setResults(null);
  };

  const previousExercise = () => {
    if (currentExercise > 0) {
      setCurrentExercise(currentExercise - 1);
    } else if (currentModule > 0) {
      setCurrentModule(currentModule - 1);
      setCurrentExercise(modules[currentModule - 1].exercises.length - 1);
    }
    setResults(null);
  };

  const currentModuleData = modules[currentModule];
  const currentExerciseData = currentModuleData?.exercises[currentExercise];
  if (showReview) {
    return (
      <ReviewModule 
        modules={modules}
        completedExercises={completedExercises}
        onBack={() => setShowReview(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white">
      {/* Header */}      <div className="bg-black/50 backdrop-blur-sm border-b border-blue-500/30 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {onBack && (
              <button
                onClick={onBack}
                className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors"
              >
                <ArrowLeftIcon className="h-5 w-5" />
                <span>Back to Platform</span>
              </button>
            )}
            {onBack && <div className="h-6 w-px bg-blue-500/30"></div>}
            <AcademicCapIcon className="h-8 w-8 text-blue-400" />
            <h1 className="text-2xl font-bold text-blue-400">Pyxom Interactive Learning</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowReview(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600/20 border border-green-500/30 rounded-lg hover:bg-green-600/30 transition-colors"
            >
              <ChartBarIcon className="h-5 w-5" />
              <span>Review Progress</span>
            </button>
            <div className="text-sm text-blue-300">
              Module {currentModule + 1} of {modules.length}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Sidebar - Module Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-black/30 backdrop-blur-sm rounded-lg p-6 border border-blue-500/30">
            <h2 className="text-xl font-bold text-blue-400 mb-4">Modules</h2>
            <div className="space-y-2">
              {modules.map((module, index) => (
                <button
                  key={module.id}
                  onClick={() => {
                    setCurrentModule(index);
                    setCurrentExercise(0);
                    setResults(null);
                  }}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    index === currentModule
                      ? 'bg-blue-600/30 border border-blue-500/50'
                      : 'bg-gray-800/30 hover:bg-gray-700/30'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold">{module.title}</div>
                      <div className="text-sm text-gray-400">{module.description}</div>
                    </div>
                    {module.completed && (
                      <CheckCircleIcon className="h-5 w-5 text-green-400" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Exercise List */}
          <div className="bg-black/30 backdrop-blur-sm rounded-lg p-6 border border-blue-500/30 mt-6">
            <h3 className="text-lg font-bold text-blue-400 mb-4">
              {currentModuleData?.title} Exercises
            </h3>
            <div className="space-y-2">
              {currentModuleData?.exercises.map((exercise, index) => (
                <button
                  key={exercise.id}
                  onClick={() => {
                    setCurrentExercise(index);
                    setResults(null);
                  }}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    index === currentExercise
                      ? 'bg-purple-600/30 border border-purple-500/50'
                      : 'bg-gray-800/30 hover:bg-gray-700/30'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{exercise.title}</div>
                      <div className="text-sm text-gray-400">{exercise.difficulty}</div>
                    </div>
                    {completedExercises.has(exercise.id) && (
                      <CheckCircleIcon className="h-5 w-5 text-green-400" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Exercise Description */}
          {currentExerciseData && (
            <div className="bg-black/30 backdrop-blur-sm rounded-lg p-6 border border-blue-500/30">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-white">{currentExerciseData.title}</h2>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  currentExerciseData.difficulty === 'Beginner' ? 'bg-green-600/20 text-green-400' :
                  currentExerciseData.difficulty === 'Intermediate' ? 'bg-yellow-600/20 text-yellow-400' :
                  'bg-red-600/20 text-red-400'
                }`}>
                  {currentExerciseData.difficulty}
                </span>
              </div>
              <p className="text-gray-300 mb-4">{currentExerciseData.description}</p>
              
              {/* Hints */}
              <div className="bg-blue-900/20 rounded-lg p-4 border border-blue-500/20">
                <h4 className="font-semibold text-blue-400 mb-2">💡 Hints:</h4>
                <ul className="text-blue-200 text-sm space-y-1">
                  {currentExerciseData.hints.map((hint, index) => (
                    <li key={index}>• {hint}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}          <CodeEditor
            code={userCode}
            onChange={setUserCode}
            onRun={handleRunCode}
            isRunning={isRunning}
          />

          {/* Exercise Runner Results */}
          {results && (
            <ExerciseRunner
              results={results}
              exercise={currentExerciseData}
            />
          )}

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <button
              onClick={previousExercise}
              disabled={currentModule === 0 && currentExercise === 0}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-600/20 border border-gray-500/30 rounded-lg hover:bg-gray-600/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>← Previous</span>
            </button>
            
            <div className="text-center">
              <div className="text-sm text-gray-400">
                Exercise {currentExercise + 1} of {currentModuleData?.exercises.length || 0}
              </div>
              <div className="text-xs text-gray-500">
                Module: {currentModuleData?.title}
              </div>
            </div>

            <button
              onClick={nextExercise}
              disabled={currentModule === modules.length - 1 && 
                       currentExercise === (modules[modules.length - 1]?.exercises.length || 1) - 1}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600/20 border border-blue-500/30 rounded-lg hover:bg-blue-600/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>Next →</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PyxomExercises;
