import { FC, ImgHTMLAttributes } from 'react';

export interface NextImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'width' | 'height'> {
  /** The source URL or static import of the image */
  src: string;
  /** Alternate text description for accessibility */
  alt: string;
  /** Width of the image in pixels (required if fill is false or omitted) */
  width?: number | string;
  /** Height of the image in pixels (required if fill is false or omitted) */
  height?: number | string;
  /** If true, the image will fill its parent container instead of having fixed width/height. Parent must have position: relative */
  fill?: boolean;
  /** If true, the image will be loaded with high priority (adds preload attribute) */
  priority?: boolean;
  /** Standard responsive image sizes attribute for source optimization */
  sizes?: string;
  /** Quality of the image (simulated for dev, utilized in Next.js optimizer) */
  quality?: number;
}

/**
 * NextImage - A Next.js-compatible Image Wrapper.
 * 
 * This component is designed to fully emulate Next.js's `next/image` component.
 * To migrate to Next.js, simply replace this import with:
 * `import NextImage from 'next/image'`
 */
export const NextImage: FC<NextImageProps> = ({
  src,
  alt,
  width,
  height,
  fill = false,
  priority = false,
  sizes,
  quality,
  className = '',
  style = {},
  ...rest
}) => {
  // Translate fill behavior to Next.js absolute styling rules
  const fillStyles = fill
    ? {
        position: 'absolute' as const,
        height: '100%',
        width: '100%',
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        objectFit: 'cover' as const,
        objectPosition: 'center',
      }
    : {};

  const widthHeightStyles = !fill
    ? {
        width: width ? (typeof width === 'number' ? `${width}px` : width) : undefined,
        height: height ? (typeof height === 'number' ? `${height}px` : height) : undefined,
      }
    : {};

  return (
    <img
      src={src}
      alt={alt}
      sizes={sizes}
      referrerPolicy="no-referrer"
      fetchPriority={priority ? 'high' : 'auto'}
      loading={priority ? 'eager' : 'lazy'}
      style={{
        ...fillStyles,
        ...widthHeightStyles,
        ...style,
      }}
      className={`next-image-container ${className}`}
      data-cms-image-optimized="true"
      {...rest}
    />
  );
};

export default NextImage;
