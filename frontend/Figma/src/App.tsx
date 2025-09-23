import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { LoginForm } from "./components/LoginForm";
import { SignUpForm } from "./components/SignUpForm";
import { LeftColumn } from "./components/LeftColumn";

export default function App() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const toggleMode = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    
    // Start the animation sequence
    setTimeout(() => {
      setIsSignUp(!isSignUp);
      setTimeout(() => {
        setIsAnimating(false);
      }, 300);
    }, 300);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center p-6">
      <motion.div 
        className={`w-full flex gap-8 ${
          isSignUp ? 'max-w-5xl' : 'max-w-4xl'
        }`}
        animate={{
          maxWidth: isSignUp ? '64rem' : '56rem',
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        {/* Left Column with Animation */}
        <motion.div
          className={`relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden z-10 ${
            isSignUp ? 'w-[480px] h-[520px]' : 'w-[400px] h-[480px]'
          }`}
          animate={{
            x: isAnimating ? "calc(100% + 2rem)" : "0%",
            width: isSignUp ? '480px' : '400px',
            height: isSignUp ? '520px' : '480px'
          }}
          transition={{
            x: { duration: 0.6, ease: [0.4, 0, 0.2, 1] },
            width: { duration: 0.3, ease: "easeInOut" },
            height: { duration: 0.3, ease: "easeInOut" }
          }}
        >
          <LeftColumn />
        </motion.div>

        {/* Right Column */}
        <motion.div 
          className={`bg-white dark:bg-gray-800 rounded-2xl shadow-xl flex items-center justify-center p-8 relative overflow-hidden ${
            isSignUp ? 'w-[480px] h-[520px]' : 'w-[400px] h-[480px]'
          }`}
          animate={{
            width: isSignUp ? '480px' : '400px',
            height: isSignUp ? '520px' : '480px'
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={isSignUp ? "signup" : "login"}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3, delay: isAnimating ? 0.3 : 0 }}
              className="w-full"
            >
              {isSignUp ? (
                <SignUpForm onToggleMode={toggleMode} />
              ) : (
                <LoginForm onToggleMode={toggleMode} />
              )}
            </motion.div>
          </AnimatePresence>
          
          {/* Overlay during animation */}
          <motion.div
            className="absolute inset-0 bg-white dark:bg-gray-800 z-20 rounded-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: isAnimating ? 1 : 0 }}
            transition={{ duration: 0.2 }}
            style={{ pointerEvents: isAnimating ? "all" : "none" }}
          />
        </motion.div>
      </motion.div>
    </div>
  );
}