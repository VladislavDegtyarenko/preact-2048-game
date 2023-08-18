import { useEffect, useRef, RefObject } from "react";
import { tilesMoved } from "../features/boardSlice";
import { Direction } from "../types/types";
import { useAppDispatch, useAppSelector } from "./reduxHooks";
import { getBoardSize } from "../features/settingsSlice";

const useSwipes = (elementRef: RefObject<HTMLDivElement>) => {
  const boardSize = useAppSelector(getBoardSize);
  const settingsIsOpened = useAppSelector((state) => state.settings.settingsIsOpened);
  const dispatch = useAppDispatch();

  const moveTiles = (direction: Direction) => {
    dispatch(tilesMoved({ direction, boardSize }));
  };

  useEffect(() => {
    bindSwipes();

    return () => clearSwipes();
  });

  function bindSwipes() {
    const element = elementRef.current;

    if (!element) return;

    element.addEventListener("touchstart", handleTouchStart);
    element.addEventListener("touchmove", handleTouchMove);
    element.addEventListener("touchend", handleTouchEnd);

    element.addEventListener("mousedown", handleTouchStart);
    element.addEventListener("mousemove", handleTouchMove);
    element.addEventListener("mouseup", handleTouchEnd);
    element.addEventListener("mouseleave", handleTouchEnd);
  }

  function clearSwipes() {
    const element = elementRef.current;

    if (!element) return;

    element.removeEventListener("touchstart", handleTouchStart);
    element.removeEventListener("touchmove", handleTouchMove);
    element.removeEventListener("touchend", handleTouchEnd);

    element.removeEventListener("mousedown", handleTouchStart);
    element.removeEventListener("mousemove", handleTouchMove);
    element.removeEventListener("mouseup", handleTouchEnd);
    element.removeEventListener("mouseleave", handleTouchEnd);
  }

  const touchstart = useRef({
    x: 0,
    y: 0,
  });

  let mouseClicked = false;
  let swipeDetected = false; // Initialize the flag to false

  function handleTouchStart(e: TouchEvent | MouseEvent) {
    mouseClicked = true;

    if (e.type === "touchstart") {
      const touchEvent = e as TouchEvent;

      touchstart.current = {
        x: touchEvent.touches[0].clientX,
        y: touchEvent.touches[0].clientY,
      };
    }

    if (e.type === "mousedown") {
      const mouseEvent = e as MouseEvent;

      touchstart.current = {
        x: mouseEvent.clientX,
        y: mouseEvent.clientY,
      };
    }
  }

  const SWIPE_DISTANCE = 32;

  function handleTouchMove(e: MouseEvent | TouchEvent) {
    e.preventDefault();

    if (swipeDetected) return; // Don't detect any more swipes if one has already been detected
    if (!mouseClicked) return; // Skip if mousedown is not fired
    if (settingsIsOpened) return;

    let x = 0,
      y = 0;

    if (e.type === "touchmove") {
      const touchEvent = e as TouchEvent;

      x = touchEvent.touches[0].clientX;
      y = touchEvent.touches[0].clientY;
    }

    if (e.type === "mousemove") {
      const mouseEvent = e as MouseEvent;

      x = mouseEvent.clientX;
      y = mouseEvent.clientY;
    }

    const startX = touchstart.current.x;
    const startY = touchstart.current.y;

    const swipeLeft = startX - x > SWIPE_DISTANCE;
    const swipeRight = x - startX > SWIPE_DISTANCE;
    const swipeUp = startY - y > SWIPE_DISTANCE;
    const swipeDown = y - startY > SWIPE_DISTANCE;

    if (swipeLeft || swipeRight || swipeUp || swipeDown) {
      swipeDetected = true;
      mouseClicked = false;

      touchstart.current = {
        x: 0,
        y: 0,
      };
    }

    if (swipeLeft) return moveTiles("left");
    else if (swipeRight) return moveTiles("right");
    else if (swipeUp) return moveTiles("up");
    else if (swipeDown) return moveTiles("down");
  }

  function handleTouchEnd() {
    swipeDetected = false;
    mouseClicked = false;

    touchstart.current = {
      x: 0,
      y: 0,
    };
  }
};

export default useSwipes;
