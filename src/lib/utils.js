import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}



// selectedGradient, backgroundColor, uploadedImage, selectedOverlay, selectedMeshGradient, opacity, noiseAmount, imageScale, imageRadius