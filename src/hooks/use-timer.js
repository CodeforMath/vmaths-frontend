import { useState, useEffect } from 'react';

export const useTimer = (initialTime, onTimeUp) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let timer;
    if (isActive && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      if (onTimeUp) onTimeUp();
    }
    return () => clearInterval(timer);
  }, [isActive, timeLeft, onTimeUp]);

  return { timeLeft, setTimeLeft, setIsActive };
};