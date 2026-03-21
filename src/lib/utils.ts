import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Generate image srcSet for responsive images
 * Supports different image sizes for different device widths
 */
export function getImageSrcSet(imagePath: string): string {
  // Return original path - CDN/server will handle optimization
  return imagePath;
}

/**
 * Get optimized image URL with encoding for special characters
 */
export function getOptimizedImageUrl(imagePath: string): string {
  // Encode the image path to handle special characters
  try {
    // Split the path and filename
    const parts = imagePath.split('/');
    const filename = parts[parts.length - 1];
    // Encode the filename
    const encodedFilename = encodeURIComponent(filename);
    // Reconstruct the path
    return parts.slice(0, -1).join('/') + '/' + encodedFilename;
  } catch {
    return imagePath;
  }
}

/**
 * Image error handler for broken images
 */
export function handleImageError(
  event: React.SyntheticEvent<HTMLImageElement, Event>
): void {
  const img = event.currentTarget;
  img.src = '/placeholder.svg';
  img.alt = 'Image unavailable';
  img.className = `${img.className} opacity-50`;
}

/**
 * Preload an image for faster display
 */
export function preloadImage(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => reject(new Error(`Failed to preload image: ${src}`));
    img.src = src;
  });
}

/**
 * Get image dimensions for aspect ratio calculation
 */
export function getImageAspectRatio(src: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.width, height: img.height });
    };
    img.onerror = () => {
      resolve({ width: 16, height: 9 }); // Default aspect ratio
    };
    img.src = src;
  });
}
