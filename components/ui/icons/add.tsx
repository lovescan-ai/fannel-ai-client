import React from "react";

export default function AddIcon({ className }: { className?: string }) {
  return (
    <svg
      width="75"
      height="75"
      viewBox="0 0 75 75"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle
        cx="37.5"
        cy="37.5"
        r="36.5"
        fill="white"
        stroke="#496AEB"
        strokeWidth="2"
        stroke-dasharray="8 8"
      />
      <g clipPath="url(#clip0_3278_3937)">
        <path
          d="M38.7988 27.2914L36.4727 27.3274L36.6151 36.5493L27.3931 36.6917L27.4291 39.0178L36.651 38.8754L36.7934 48.0973L39.1195 48.0614L38.9771 38.8395L48.199 38.6971L48.1631 36.371L38.9412 36.5134L38.7988 27.2914Z"
          fill="#496AEB"
        />
      </g>
      <defs>
        <clipPath id="clip0_3278_3937">
          <rect
            width="28"
            height="28"
            fill="white"
            transform="translate(18 38) rotate(-45.8846)"
          />
        </clipPath>
      </defs>
    </svg>
  );
}
