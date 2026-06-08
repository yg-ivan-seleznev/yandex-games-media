import { useEffect, useRef } from 'preact/hooks';
import type { IGameFeedItem } from '../types';

export function FeedVideo({
    item,
    isActive,
    isPaused,
    shouldPrimeFrame,
    onProgress,
}: {
    item: IGameFeedItem;
    isActive: boolean;
    isPaused: boolean;
    shouldPrimeFrame: boolean;
    onProgress: (progress: number) => void;
}) {
    const videoRef = useRef<HTMLVideoElement | null>(null);

    useEffect(() => {
        const video = videoRef.current;

        if (!video) {
            return;
        }

        video.muted = true;

        if (!isActive || isPaused) {
            video.pause();

            if (!isActive && shouldPrimeFrame) {
                const primeFirstFrame = () => {
                    try {
                        video.currentTime = 0;
                    } catch {
                        // Some browsers can reject seeking before metadata is ready.
                    }
                };

                if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
                    primeFirstFrame();
                } else {
                    video.load();
                    video.addEventListener('loadeddata', primeFirstFrame, { once: true });

                    return () => video.removeEventListener('loadeddata', primeFirstFrame);
                }
            }

            return;
        }

        const playPromise = video.play();

        if (playPromise) {
            playPromise.catch(() => undefined);
        }
    }, [isActive, isPaused, item.videoSrc, shouldPrimeFrame]);

    useEffect(() => {
        if (!isActive) {
            return;
        }

        let frameId = 0;

        const updateProgress = () => {
            const video = videoRef.current;

            if (video && Number.isFinite(video.duration) && video.duration > 0) {
                onProgress(Math.min(1, Math.max(0, video.currentTime / video.duration)));
            }

            frameId = window.requestAnimationFrame(updateProgress);
        };

        updateProgress();

        return () => window.cancelAnimationFrame(frameId);
    }, [isActive, item.videoSrc, onProgress]);

    return (
        <video
            ref={videoRef}
            class="mc-game-feed__video"
            autoPlay={isActive && !isPaused}
            loop
            muted
            playsInline
            preload="auto"
            aria-label={item.title}
            onCanPlay={(event) => {
                if (!isActive || isPaused) {
                    return;
                }

                const playPromise = event.currentTarget.play();

                if (playPromise) {
                    playPromise.catch(() => undefined);
                }
            }}
        >
            <source src={item.videoSrc} type="video/mp4" />
        </video>
    );
}

export function VideoPreloader({ items }: { items: IGameFeedItem[] }) {
    return (
        <div class="mc-game-feed__preload" aria-hidden="true">
            {items.map((item) => (
                <video
                    key={item.id}
                    src={item.videoSrc}
                    poster={item.image}
                    muted
                    playsInline
                    preload="auto"
                />
            ))}
        </div>
    );
}
