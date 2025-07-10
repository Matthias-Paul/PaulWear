import { useState, useEffect } from 'react';

const useResponsiveSkeletonCount = () => {
  const [count, setCount] = useState(1);

  const updateCount = () => {
    const width = window.innerWidth;
    if (width < 640) { 
      setCount(1);
    } else if (width >= 640 && width < 768) { 
      setCount(2);
    } else if (width >= 768 && width < 1024) { 
      setCount(3);
    } else { 
      setCount(4);
    }
  };

  useEffect(() => {
    updateCount(); 

    window.addEventListener('resize', updateCount);
    return () => window.removeEventListener('resize', updateCount);
  }, []);

  return count;
};

export default useResponsiveSkeletonCount;
