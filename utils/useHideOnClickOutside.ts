"use client";

import { useEffect } from "react";

type Selector = string;

export default function useHideOnClickOutside(
  dropBtn: Selector,
  dropContent: Selector,
  callback: () => void
): void {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      const target = event.target as Element;
      const isOutsideDropBtn = !target.closest(dropBtn);
      const isOutsideDropContent = !target.closest(dropContent);

      if (isOutsideDropBtn && isOutsideDropContent) {
        callback();
      }
    };

    document.addEventListener("click", handleClickOutside, true);

    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, [dropBtn, dropContent, callback]);
}
