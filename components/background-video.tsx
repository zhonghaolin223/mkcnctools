"use client";

import { useEffect, useRef } from "react";

export function BackgroundVideo({ src, startAt = 0 }: { src: string; startAt?: number }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const playFromStart = () => {
      const safeStart = Number.isFinite(video.duration) && video.duration > startAt ? startAt : 0;
      video.currentTime = safeStart;
      void video.play().catch(() => undefined);
    };

    video.addEventListener("loadedmetadata", playFromStart);
    video.addEventListener("ended", playFromStart);
    if (video.readyState >= HTMLMediaElement.HAVE_METADATA) playFromStart();

    return () => {
      video.removeEventListener("loadedmetadata", playFromStart);
      video.removeEventListener("ended", playFromStart);
    };
  }, [src, startAt]);

  return <video ref={videoRef} className="page-background-video" muted playsInline preload="metadata" aria-hidden="true"><source src={src} type="video/mp4" /></video>;
}
