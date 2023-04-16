import { useEffect, useRef, useCallback } from "react";

type AnyEvent = MouseEvent | TouchEvent;

export function useOutsideClickDetector<T extends HTMLElement>(
  callback: () => void
): React.RefObject<T> {
  const ref = useRef<T>(null);

  const handleClick = useCallback(
    (event: AnyEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    },
    [callback]
  );

  useEffect(() => {
    const listener = handleClick;

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [handleClick]);

  return ref;
}
