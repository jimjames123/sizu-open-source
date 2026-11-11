


import React from "react";
import { ArrowRight, Upload } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";


const Hero = () => {
  const navigate = useNavigate();

  const handleRegisterClick = () => {
    navigate('/register');
    window.scrollTo(0, 0);
  };

  const handleLoginClick = () => {
    navigate('/login');
    window.scrollTo(0, 0);
  };

  return (
    <div className="relative bg-gradient-to-br from-sizu-crimson via-red-800 to-black pt-8 sm:pt-10 pb-12 sm:pb-16 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC40Ij48cGF0aCBkPSJNMzYgMzRjMC0yLjIgMS44LTQgNC00czQgMS44IDQgNCAxLjggNCA0IDQgNC0xLjggNC00LTEuOC00LTQtNG0wLTE2YzAtMi4yIDEuOC00IDQtNHM0IDEuOCA0IDQgMS44IDQgNCA0IDQtMS44IDQtNC0xLjgtNC00LTRtMTYgMTZjMC0yLjIgMS44LTQgNC00czQgMS44IDQgNCAxLjggNCA0IDQgNC0xLjggNC00LTEuOC00LTQtNG0tMTYtMTZjMC0yLjIgMS44LTQgNC00czQgMS44IDQgNCAxLjggNCA0IDQgNC0xLjggNC00LTEuOC00LTQtNG0tMTYtMTZjMC0yLjIgMS44LTQgNC00czQgMS44IDQgNCAxLjggNCA0IDQgNC0xLjggNC00LTEuOC00LTQtNG0tMTYgNDhjMC0yLjIgMS44LTQgNC00czQgMS44IDQgNCAxLjggNCA0IDQgNC0xLjggNC00LTEuOC00LTQtNG0wLTE2YzAtMi4yIDEuOC00IDQtNHM0IDEuOCA0IDQtMS44IDQtNCA0LTQtMS44LTQtNG0wLTE2YzAtMi4yIDEuOC00IDQtNHM0IDEuOCA0IDQtMS44IDQtNCA0LTQtMS44LTQtNE0yMCA0YzAtMi4yIDEuOC00IDQtNHM0IDEuOCA0IDQtMS44IDQtNCA0LTQtMS44LTQtNG0xNiA0OGMwIDIuMiAxLjggNCA0IDRzNCAxLjggNCA0LTEuOCA0LTQgNC00LTEuOC00LTRtMC0xNmMwIDIuMiAxLjggNCA0IDRzNCAxLjggNCA0LTEuOCA0LTQgNC00LTEuOC00LTRtMC0xNmMwIDIuMiAxLjggNCA0IDRzNCAxLjggNCA0LTEuOCA0LTQgNC00LTEuOC00LTRtMC0xNmMwIDIuMiAxLjggNCA0IDRzNCAxLjggNCA0LTEuOCA0LTQgNC00LTEuOC00LTRNNCA1MmMwLTIuMiAxLjgtNCA0LTRzNCAxLjggNCA0LTEuOCA0LTQgNC00LTEuOC00LTRtMC0xNmMwLTIuMiAxLjgtNCA0LTRzNCAxLjggNCA0LTEuOCA0LTQgNC00LTEuOC00LTRtMC0xNmMwLTIuMiAxLjgtNCA0LTRzNCAxLjggNCA0LTEuOCA0LTQgNC00LTEuOC00LTQiLz48L2c+PC9nPjwvc3ZnPg==')]"></div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          <h1
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white leading-[1.15] tracking-tight [text-wrap:balance] animate-slide-down opacity-0"
            style={{ animationDelay: "0.2s" }}
          >
            <span className="block">
              Amplifying Impact <span className="text-sizu-yellow">Globally.</span>
            </span>
            <span className="block mt-1 sm:mt-2">
              Enhancing <span className="text-sizu-yellow">Collaboration.</span>
            </span>
          </h1>
          
          
          <div className="mt-4 flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-3 animate-slide-down opacity-0" style={{ animationDelay: "0.6s" }}>
            
            <button
              onClick={handleRegisterClick}
              className="btn-primary flex items-center cursor-pointer text-sm py-2"
            >
              Register Organization <ArrowRight className="ml-2 h-3 w-3" />
            </button>
            
            <button
              onClick={handleLoginClick}
              className="btn-accent flex items-center cursor-pointer text-sm py-2"
            >
              <Upload className="mr-2 h-3 w-3" />
              Post Project
            </button>
          </div>
        </div>



      </div>
    </div>
  );
};

export default Hero;


