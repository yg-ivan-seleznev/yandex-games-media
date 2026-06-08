import { useEffect, useRef, useState } from 'preact/hooks';
import type { IGameFeedItem } from '../types';
import { getPreloadItems, getSafeIndex } from '../utils/feed';
import { FeedPage } from './feed-page';
import { VideoPreloader } from './video-layer';

const WHEEL_TRIGGER_DELTA = 220;
const WHEEL_RESET_MS = 220;
const PAGE_TRANSITION_MS = 380;
const WHEEL_COOLDOWN_MS = 520;
const TOUCH_TRIGGER_MIN_PX = 180;
const TOUCH_TRIGGER_RATIO = 0.34;
const PRELOAD_AHEAD = 4;

export function FeedPlayer({
    items,
    initialIndex,
    playButtonText,
    onPlay,
}: {
    items: IGameFeedItem[];
    initialIndex: number;
    playButtonText: string;
    onPlay?: (item: IGameFeedItem) => void;
}) {
    const [currentIndex, setCurrentIndex] = useState(() => getSafeIndex(initialIndex, items.length));
    const [progress, setProgress] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [feedbackIcon, setFeedbackIcon] = useState<'play' | 'pause' | null>(null);
    const [dragOffset, setDragOffset] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [isRebounding, setIsRebounding] = useState(false);
    const [transitionDirection, setTransitionDirection] = useState<-1 | 0 | 1>(0);
    const lastNavigationAt = useRef(0);
    const touchStartY = useRef<number | null>(null);
    const wheelDeltaY = useRef(0);
    const wheelResetTimeout = useRef<number | null>(null);
    const playerRef = useRef<HTMLElement | null>(null);
    const current = items[getSafeIndex(currentIndex, items.length)];

    useEffect(() => {
        setCurrentIndex(getSafeIndex(initialIndex, items.length));
        setProgress(0);
        setIsPaused(false);
        setFeedbackIcon(null);
        setDragOffset(0);
        setTransitionDirection(0);
    }, [initialIndex, items.length]);

    useEffect(() => {
        if (isPaused || feedbackIcon === null) {
            return;
        }

        const timeoutId = window.setTimeout(() => setFeedbackIcon(null), 700);

        return () => window.clearTimeout(timeoutId);
    }, [feedbackIcon, isPaused]);

    useEffect(() => {
        return () => {
            if (wheelResetTimeout.current !== null) {
                window.clearTimeout(wheelResetTimeout.current);
            }
        };
    }, []);

    useEffect(() => {
        if (transitionDirection === 0) {
            return;
        }

        const timeoutId = window.setTimeout(() => {
            setCurrentIndex((index) => getSafeIndex(index + transitionDirection, items.length));
            setTransitionDirection(0);
            setDragOffset(0);
        }, PAGE_TRANSITION_MS);

        return () => window.clearTimeout(timeoutId);
    }, [items.length, transitionDirection]);

    useEffect(() => {
        if (!isRebounding) {
            return;
        }

        const timeoutId = window.setTimeout(() => setIsRebounding(false), PAGE_TRANSITION_MS);

        return () => window.clearTimeout(timeoutId);
    }, [isRebounding]);

    const resetPlaybackForNextPage = () => {
        setProgress(0);
        setIsPaused(false);
        setFeedbackIcon(null);
    };

    const startPageTransition = (direction: -1 | 1) => {
        const now = Date.now();

        if (transitionDirection !== 0 || now - lastNavigationAt.current < WHEEL_COOLDOWN_MS || items.length < 2) {
            return;
        }

        lastNavigationAt.current = now;
        resetPlaybackForNextPage();
        setIsDragging(false);
        setIsRebounding(false);
        setDragOffset(0);
        setTransitionDirection(direction);
    };

    const togglePlayback = () => {
        setIsPaused((paused) => {
            const nextPaused = !paused;

            setFeedbackIcon(nextPaused ? 'pause' : 'play');

            return nextPaused;
        });
    };

    if (!current) {
        return (
            <div class="mc-game-feed__empty">
                <span class="mc-game-feed__empty-title">Лента пока пуста</span>
            </div>
        );
    }

    const pageHeight = playerRef.current?.clientHeight ?? 1;
    const preloadItems = getPreloadItems(items, currentIndex, PRELOAD_AHEAD);
    const trackClass = [
        'mc-game-feed__page-track',
        isDragging ? 'mc-game-feed__page-track--dragging' : '',
        transitionDirection !== 0 || isRebounding ? 'mc-game-feed__page-track--transitioning' : '',
    ]
        .filter(Boolean)
        .join(' ');
    const trackTransform = transitionDirection !== 0
        ? `translateY(${-transitionDirection * 100}%)`
        : `translateY(${dragOffset}px)`;

    return (
        <section
            ref={playerRef}
            class="mc-game-feed__player"
            aria-label="Видео ленты"
            onWheel={(event) => {
                event.preventDefault();

                if (transitionDirection !== 0 || isDragging) {
                    return;
                }

                wheelDeltaY.current += event.deltaY;

                if (wheelResetTimeout.current !== null) {
                    window.clearTimeout(wheelResetTimeout.current);
                }

                wheelResetTimeout.current = window.setTimeout(() => {
                    wheelDeltaY.current = 0;
                    wheelResetTimeout.current = null;
                }, WHEEL_RESET_MS);

                if (Math.abs(wheelDeltaY.current) < WHEEL_TRIGGER_DELTA) {
                    return;
                }

                const direction = wheelDeltaY.current > 0 ? 1 : -1;
                wheelDeltaY.current = 0;

                if (wheelResetTimeout.current !== null) {
                    window.clearTimeout(wheelResetTimeout.current);
                    wheelResetTimeout.current = null;
                }

                startPageTransition(direction);
            }}
            onTouchStart={(event) => {
                if (transitionDirection !== 0) {
                    return;
                }

                touchStartY.current = event.touches[0]?.clientY ?? null;
                setIsDragging(true);
                setIsRebounding(false);
                setDragOffset(0);
            }}
            onTouchMove={(event) => {
                event.preventDefault();

                if (touchStartY.current === null || transitionDirection !== 0) {
                    return;
                }

                const nextOffset = (event.touches[0]?.clientY ?? touchStartY.current) - touchStartY.current;
                const clampedOffset = Math.max(-pageHeight * 0.86, Math.min(pageHeight * 0.86, nextOffset));

                setDragOffset(clampedOffset);
            }}
            onTouchEnd={(event) => {
                if (touchStartY.current === null) {
                    return;
                }

                const rawOffset = (event.changedTouches[0]?.clientY ?? touchStartY.current) - touchStartY.current;
                touchStartY.current = null;
                setIsDragging(false);

                if (Math.abs(rawOffset) < Math.max(TOUCH_TRIGGER_MIN_PX, pageHeight * TOUCH_TRIGGER_RATIO)) {
                    setIsRebounding(true);
                    setDragOffset(0);
                    return;
                }

                startPageTransition(rawOffset < 0 ? 1 : -1);
            }}
            onTouchCancel={() => {
                touchStartY.current = null;
                setIsDragging(false);
                setIsRebounding(true);
                setDragOffset(0);
            }}
        >
            <VideoPreloader items={preloadItems} />
            <div class={trackClass} style={{ transform: trackTransform }}>
                {([-1, 0, 1] as const).map((offset) => {
                    const item = items[getSafeIndex(currentIndex + offset, items.length)];
                    const isActive = offset === 0;

                    return (
                        <div
                            key={item.id}
                            class="mc-game-feed__page-slot"
                            style={{ transform: `translateY(${offset * 100}%)` }}
                        >
                            <FeedPage
                                item={item}
                                isActive={isActive}
                                isPaused={isPaused}
                                shouldPrimeFrame={!isActive}
                                feedbackIcon={feedbackIcon}
                                progress={isActive ? progress : 0}
                                playButtonText={playButtonText}
                                onPlay={onPlay}
                                onProgress={setProgress}
                                onTogglePlayback={togglePlayback}
                            />
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
