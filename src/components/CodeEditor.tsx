import React, { useState, useRef, useEffect } from 'react';
import { 
  PlayIcon, 
  BugAntIcon, 
  DocumentDuplicateIcon,
  CheckIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';

interface CodeEditorProps {
  code: string;
  onChange: (code: string) => void;
  onRun: () => void;
  isRunning: boolean;
}

interface DebugInfo {
  line: number;
  type: 'error' | 'warning' | 'info';
  message: string;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ code, onChange, onRun, isRunning }) => {
  const [debugInfo, setDebugInfo] = useState<DebugInfo[]>([]);
  const [showDebugPanel, setShowDebugPanel] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Real-time code analysis and debugging
  useEffect(() => {
    const analyzeCode = () => {
      const lines = code.split('\n');
      const issues: DebugInfo[] = [];

      lines.forEach((line, index) => {
        const lineNum = index + 1;
        
        // Check for common Python issues
        if (line.trim().length === 0) return;

        // Indentation check
        if (line.startsWith(' ') && !line.startsWith('    ') && line.trim().length > 0) {
          issues.push({
            line: lineNum,
            type: 'warning',
            message: 'Inconsistent indentation. Use 4 spaces for Python indentation.'
          });
        }

        // Missing colon check
        if (line.trim().match(/^(if|elif|else|for|while|def|class|try|except|finally|with)\s.*[^:]$/)) {
          issues.push({
            line: lineNum,
            type: 'error',
            message: 'Missing colon (:) at end of statement'
          });
        }

        // Unused variable check (simple)
        const varMatch = line.match(/^(\s*)(\w+)\s*=/);
        if (varMatch && !code.includes(varMatch[2] + ' ') && !code.includes(varMatch[2] + ')')) {
          issues.push({
            line: lineNum,
            type: 'warning',
            message: `Variable '${varMatch[2]}' may be unused`
          });
        }

        // Print statement check
        if (line.includes('print ')) {
          issues.push({
            line: lineNum,
            type: 'info',
            message: 'Use print() function instead of print statement (Python 3)'
          });
        }

        // Common syntax patterns
        if (line.includes('==') && line.includes('=')) {
          const assignCount = (line.match(/=/g) || []).length;
          const compareCount = (line.match(/==/g) || []).length;
          if (assignCount > compareCount) {
            issues.push({
              line: lineNum,
              type: 'warning',
              message: 'Possible assignment (=) instead of comparison (==)'
            });
          }
        }
      });

      setDebugInfo(issues);
    };

    const debounceTimer = setTimeout(analyzeCode, 500);
    return () => clearTimeout(debounceTimer);
  }, [code]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.currentTarget.selectionStart;
      const end = e.currentTarget.selectionEnd;
      const newCode = code.substring(0, start) + '    ' + code.substring(end);
      onChange(newCode);
      
      // Set cursor position after the inserted tab
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 4;
        }
      }, 0);
    } else if (e.key === 'Enter') {
      // Auto-indent
      const lines = code.substring(0, e.currentTarget.selectionStart).split('\n');
      const currentLine = lines[lines.length - 1];
      const indent = currentLine.match(/^(\s*)/)?.[1] || '';
      
      // Add extra indent for certain keywords
      const shouldIndent = currentLine.trim().endsWith(':');
      const newIndent = shouldIndent ? indent + '    ' : indent;
      
      if (newIndent) {
        e.preventDefault();
        const start = e.currentTarget.selectionStart;
        const newCode = code.substring(0, start) + '\n' + newIndent + code.substring(start);
        onChange(newCode);
        
        setTimeout(() => {
          if (textareaRef.current) {
            const newPos = start + 1 + newIndent.length;
            textareaRef.current.selectionStart = textareaRef.current.selectionEnd = newPos;
          }
        }, 0);
      }
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  const formatCode = () => {
    // Simple code formatting
    const lines = code.split('\n');
    let indentLevel = 0;
    const formatted = lines.map(line => {
      const trimmed = line.trim();
      if (!trimmed) return '';
      
      // Decrease indent for certain keywords
      if (trimmed.startsWith('except') || trimmed.startsWith('elif') || 
          trimmed.startsWith('else') || trimmed.startsWith('finally')) {
        indentLevel = Math.max(0, indentLevel - 1);
      }
      
      const formattedLine = '    '.repeat(indentLevel) + trimmed;
      
      // Increase indent after certain keywords
      if (trimmed.endsWith(':')) {
        indentLevel++;
      }
      
      return formattedLine;
    });
    
    onChange(formatted.join('\n'));
  };

  const insertTemplate = (template: string) => {
    const start = textareaRef.current?.selectionStart || 0;
    const newCode = code.substring(0, start) + template + code.substring(start);
    onChange(newCode);
  };

  const lineCount = code.split('\n').length;

  return (
    <div className="bg-black/30 backdrop-blur-sm rounded-lg border border-blue-500/30 overflow-hidden">
      {/* Editor Header */}
      <div className="bg-gray-900/50 border-b border-gray-700/50 p-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h3 className="text-lg font-semibold text-white flex items-center">
            <BugAntIcon className="h-5 w-5 mr-2 text-blue-400" />
            Python Code Editor
          </h3>
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <span>Lines: {lineCount}</span>
            {debugInfo.length > 0 && (
              <span className="text-yellow-400">
                Issues: {debugInfo.length}
              </span>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {/* Quick Templates */}
          <div className="relative group">
            <button className="px-3 py-1 bg-purple-600/20 border border-purple-500/30 rounded text-sm text-purple-400 hover:bg-purple-600/30 transition-colors">
              Templates
            </button>
            <div className="absolute right-0 top-full mt-2 w-48 bg-gray-900 border border-gray-700 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
              <div className="p-2 space-y-1">
                <button
                  onClick={() => insertTemplate('def function_name():\n    pass\n')}
                  className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-gray-800 rounded"
                >
                  Function
                </button>
                <button
                  onClick={() => insertTemplate('class ClassName:\n    def __init__(self):\n        pass\n')}
                  className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-gray-800 rounded"
                >
                  Class
                </button>
                <button
                  onClick={() => insertTemplate('if condition:\n    # code here\n    pass\n')}
                  className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-gray-800 rounded"
                >
                  If Statement
                </button>
                <button
                  onClick={() => insertTemplate('for item in items:\n    # code here\n    pass\n')}
                  className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-gray-800 rounded"
                >
                  For Loop
                </button>
                <button
                  onClick={() => insertTemplate('try:\n    # code here\n    pass\nexcept Exception as e:\n    print(f"Error: {e}")\n')}
                  className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-gray-800 rounded"
                >
                  Try-Except
                </button>
              </div>
            </div>
          </div>

          <button
            onClick={formatCode}
            className="px-3 py-1 bg-indigo-600/20 border border-indigo-500/30 rounded text-sm text-indigo-400 hover:bg-indigo-600/30 transition-colors"
          >
            Format
          </button>
          
          <button
            onClick={copyToClipboard}
            className="px-3 py-1 bg-gray-600/20 border border-gray-500/30 rounded text-sm text-gray-400 hover:bg-gray-600/30 transition-colors flex items-center space-x-1"
          >
            {copied ? (
              <>
                <CheckIcon className="h-4 w-4" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <DocumentDuplicateIcon className="h-4 w-4" />
                <span>Copy</span>
              </>
            )}
          </button>

          <button
            onClick={() => setShowDebugPanel(!showDebugPanel)}
            className={`px-3 py-1 border rounded text-sm transition-colors flex items-center space-x-1 ${
              debugInfo.length > 0
                ? 'bg-yellow-600/20 border-yellow-500/30 text-yellow-400 hover:bg-yellow-600/30'
                : 'bg-green-600/20 border-green-500/30 text-green-400 hover:bg-green-600/30'
            }`}
          >
            <BugAntIcon className="h-4 w-4" />
            <span>Debug</span>
          </button>

          <button
            onClick={onRun}
            disabled={isRunning}
            className="px-4 py-2 bg-green-600/20 border border-green-500/30 rounded text-green-400 hover:bg-green-600/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            <PlayIcon className="h-4 w-4" />
            <span>{isRunning ? 'Running...' : 'Run Code'}</span>
          </button>
        </div>
      </div>

      <div className="relative">
        {/* Line Numbers */}
        <div className="absolute left-0 top-0 bottom-0 w-12 bg-gray-800/50 border-r border-gray-700/50 text-gray-500 text-sm font-mono z-10">
          {Array.from({ length: lineCount }, (_, i) => (
            <div key={i + 1} className="h-6 px-2 flex items-center justify-end">
              {i + 1}
            </div>
          ))}
        </div>

        {/* Code Editor */}
        <textarea
          ref={textareaRef}
          value={code}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full h-96 pl-16 pr-4 py-3 bg-transparent text-white font-mono text-sm resize-none focus:outline-none"
          style={{ lineHeight: '24px' }}
          placeholder="# Write your Python code here..."
          spellCheck={false}
        />

        {/* Debug Highlights */}
        <div className="absolute left-16 top-0 right-0 pointer-events-none">
          {debugInfo.map((issue, index) => (
            <div
              key={index}
              className={`absolute left-0 right-0 h-6 ${
                issue.type === 'error' ? 'bg-red-500/10 border-l-2 border-red-500' :
                issue.type === 'warning' ? 'bg-yellow-500/10 border-l-2 border-yellow-500' :
                'bg-blue-500/10 border-l-2 border-blue-500'
              }`}
              style={{ top: `${(issue.line - 1) * 24}px` }}
              title={issue.message}
            />
          ))}
        </div>
      </div>

      {/* Debug Panel */}
      {showDebugPanel && (
        <div className="border-t border-gray-700/50 bg-gray-900/50 p-4 max-h-48 overflow-y-auto">
          <h4 className="text-lg font-semibold text-white mb-3 flex items-center">
            <BugAntIcon className="h-5 w-5 mr-2 text-yellow-400" />
            Debug Information
          </h4>
          
          {debugInfo.length === 0 ? (
            <div className="text-green-400 flex items-center">
              <CheckIcon className="h-5 w-5 mr-2" />
              No issues detected. Your code looks good!
            </div>
          ) : (
            <div className="space-y-2">
              {debugInfo.map((issue, index) => (
                <div
                  key={index}
                  className={`flex items-start space-x-3 p-3 rounded-lg ${
                    issue.type === 'error' ? 'bg-red-900/20 border border-red-500/30' :
                    issue.type === 'warning' ? 'bg-yellow-900/20 border border-yellow-500/30' :
                    'bg-blue-900/20 border border-blue-500/30'
                  }`}
                >
                  {issue.type === 'error' ? (
                    <ExclamationTriangleIcon className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
                  ) : issue.type === 'warning' ? (
                    <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                  ) : (
                    <InformationCircleIcon className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
                  )}
                  <div>
                    <div className="font-medium text-white">
                      Line {issue.line}
                    </div>
                    <div className={`text-sm ${
                      issue.type === 'error' ? 'text-red-300' :
                      issue.type === 'warning' ? 'text-yellow-300' :
                      'text-blue-300'
                    }`}>
                      {issue.message}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Code Quality Tips */}
          <div className="mt-4 p-3 bg-blue-900/20 border border-blue-500/30 rounded-lg">
            <h5 className="font-medium text-blue-400 mb-2">💡 Code Quality Tips:</h5>
            <ul className="text-blue-200 text-sm space-y-1">
              <li>• Use 4 spaces for indentation (not tabs)</li>
              <li>• Add comments to explain complex logic</li>
              <li>• Use descriptive variable names</li>
              <li>• Follow PEP 8 style guidelines</li>
              <li>• Handle exceptions appropriately</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default CodeEditor;
