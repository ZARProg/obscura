// src/components/NoImage.tsx
import React from "react";

interface NoImageProps {
  className?: string;
  alt?: string;
}

export default function NoImage({
  className = "",
  alt = "No Image",
}: NoImageProps) {
  return (
    <img
      src="/no-image.jpg"
      alt={alt}
      className={`object-cover ${className}`}
    />
  );
}
