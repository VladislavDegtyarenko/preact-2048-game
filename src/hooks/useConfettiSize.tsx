import { useState, useLayoutEffect, RefObject } from "react";
import { debounce } from "lodash";

const useConfettiSize = (parentContainerRef: RefObject<HTMLElement>) => {
  // Handle Confetti Size
  const [confettiSize, setConfettiSize] = useState({
    width: 0,
    height: 0,
  });

  const resizeConfetti = () => {
    if (!parentContainerRef.current) return;

    setConfettiSize({
      width: parentContainerRef.current.clientWidth,
      height: parentContainerRef.current.clientHeight,
    });
  };

  const debounceResizeConfetti = debounce(resizeConfetti, 150);

  useLayoutEffect(() => {
    resizeConfetti();

    window.addEventListener("resize", debounceResizeConfetti);

    return () => window.removeEventListener("resize", debounceResizeConfetti);
  }, []);

  return { ...confettiSize };
};

export default useConfettiSize;
