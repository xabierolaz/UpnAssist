import React from 'react';
import { XMarkIcon, SparklesIcon } from '@heroicons/react/24/outline';
import AIChat from './AIChat';

interface AIPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const AIPopup: React.FC<AIPopupProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Popup */}
      <div className="fixed right-4 top-4 bottom-4 w-96 bg-white rounded-lg shadow-2xl border border-gray-200 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-t-lg">          <div className="flex items-center">
            <SparklesIcon className="h-6 w-6 mr-2" />
            <h3 className="text-lg font-semibold">AmaIA</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white hover:bg-opacity-10 rounded-full transition-colors"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-hidden">
          <AIChat />
        </div>
      </div>
    </div>
  );
};

export default AIPopup;
