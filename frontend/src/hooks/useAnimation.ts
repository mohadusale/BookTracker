import { useState } from 'react';

export const useAnimation = () => {
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

  return {
    isSignUp,
    isAnimating,
    toggleMode
  };
};
