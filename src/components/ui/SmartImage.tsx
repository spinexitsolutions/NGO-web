import Image, { type ImageProps } from "next/image";

const OPTIMISABLE = ["images.unsplash.com", "plus.unsplash.com"];

/** next/image for known hosts, unoptimised passthrough for anything an admin pastes in. */
export default function SmartImage(props: ImageProps) {
  const src = typeof props.src === "string" ? props.src : "";
  let unoptimized = props.unoptimized;
  if (src && !src.startsWith("/")) {
    try {
      unoptimized = unoptimized ?? !OPTIMISABLE.includes(new URL(src).hostname);
    } catch {
      unoptimized = true;
    }
  }
  if (src.startsWith("/api/")) unoptimized = true;
  // eslint-disable-next-line jsx-a11y/alt-text
  return <Image {...props} unoptimized={unoptimized} />;
}
