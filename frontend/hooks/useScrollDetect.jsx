import React, { useState, useEffect } from 'react'

const useScrollDetect = () => {
  const [scrollIsMax, setScrollIsMax] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      const atBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 2;
      setScrollIsMax(atBottom);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return scrollIsMax
}

export default useScrollDetect