import React from 'react';
import { useNavigate } from 'react-router-dom';

const PillSelection: React.FC = () => {
  const navigate = useNavigate();
  
  const handleUpnAssist = async () => {
    try {
      // Show loading message for integrated PyXom functionality
      const loadingDiv = document.createElement('div');
      loadingDiv.innerHTML = `
        <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); 
                    background: rgba(0,0,0,0.9); color: #00ff00; padding: 20px; border-radius: 10px; 
                    text-align: center; z-index: 9999; font-family: 'Courier Prime', monospace;
                    border: 1px solid #00ff00; box-shadow: 0 0 20px rgba(0,255,0,0.3);">
          <div style="margin-bottom: 10px; color: #ff4444; font-size: 18px; font-weight: bold;">🔴 UpnAssist Loading...</div>
          <div style="margin-bottom: 10px; color: #00ff00;">🚀 Initializing PyXom Integration...</div>
          <div style="font-size: 12px; opacity: 0.7; color: #00ff00;">Educational MOOC Platform • Neural Network Analysis</div>
          <div style="margin-top: 10px; font-size: 10px; color: #888888;">
            Matrix Protocol: Establishing connection...
          </div>
        </div>
      `;
      document.body.appendChild(loadingDiv);
      
      // Simulate integrated startup process
      setTimeout(() => {
        document.body.removeChild(loadingDiv);
        // Navigate to UpnAssist with integrated PyXom functionality
        navigate('/upnassist');
      }, 2500);
        } catch {
      // Fallback: direct navigation
      navigate('/upnassist');
    }
  };  const handlePyXom = () => {
    // Open PyXom in a new tab - deployed separately on Vercel
    window.open('https://pyxom.vercel.app', '_blank');
  };return (
    <div className="min-h-screen bg-black flex items-center justify-center font-matrix text-green-400 overflow-hidden">
      {/* Matrix rain background effect */}
      <div className="absolute inset-0 opacity-20">
        <div className="matrix-rain"></div>
      </div>
      
      <div className="relative z-10 text-center max-w-2xl mx-auto px-8">        {/* Matrix Terminal Header */}
        <div className="mb-8 text-left">
          <div className="text-green-400 text-sm mb-2 animate-pulse">
            The Matrix has you...
          </div>
          <div className="flex items-center mb-4">
            <img 
              src="/assets/white-rabbit.gif" 
              alt="White Rabbit" 
              className="w-8 h-8 mr-3 opacity-80"
            />
            <div className="text-green-400 text-sm">
              Follow the white rabbit...
            </div>
          </div>
          <div className="text-green-400 text-sm mb-8 flex items-center">
            Knock knock, Neo.
            <span className="ml-2 animate-blink">█</span>
          </div>
        </div>{/* Menu Options */}
        <div className="text-left space-y-6">
          <div className="flex items-center text-sm mb-4">
            <span className="text-green-400 mr-4">{'>'}</span>
            <button
              onClick={handleUpnAssist}
              className="text-red-400 hover:text-red-300 hover:bg-red-900/20 px-3 py-1 rounded transition-all duration-300 hover:shadow-lg hover:shadow-red-500/30 font-matrix tracking-wider"
            >
              UpnAssist
            </button>
          </div>
          
          <div className="flex items-center text-sm mb-4">
            <span className="text-green-400 mr-4">{'>'}</span>
            <button
              onClick={handlePyXom}
              className="text-blue-400 hover:text-blue-300 hover:bg-blue-900/20 px-3 py-1 rounded transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/30 font-matrix tracking-wider"
            >
              PyXOM
            </button>
          </div>
        </div>

        {/* Bottom prompt */}
        <div className="mt-12 text-green-600 text-sm opacity-70">
          <div className="flex items-center justify-center">
            <span>Choice is an illusion...</span>
            <span className="ml-2 animate-blink">_</span>
          </div>
        </div>      </div>
    </div>
  );
};

export default PillSelection;
