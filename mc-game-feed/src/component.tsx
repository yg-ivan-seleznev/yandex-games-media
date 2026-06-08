import { useEffect, useMemo, useRef, useState } from 'preact/hooks';
import defaultLogoSrc from './assets/logo-yg.svg';

export interface IGameFeedItem {
    id: string;
    title: string;
    gameTitle: string;
    image: string;
    videoSrc: string;
    categories: string | string[];
    source?: string;
    price?: string;
    accountName?: string;
    accountLogo?: string;
}

export type IGameFeedState = 'ready' | 'loading' | 'error';

export interface IGameFeedProps {
    title?: string;
    logoSrc?: string;
    items?: IGameFeedItem[];
    initialIndex?: number;
    openInitially?: boolean;
    feedState?: IGameFeedState;
    errorMessage?: string;
    playButtonText?: string;
    retryButtonText?: string;
    closeButtonText?: string;
    onPlay?: (item: IGameFeedItem) => void;
    onRetry?: () => void;
    onClose?: () => void;
}

const DEFAULT_LOGO_SRC = defaultLogoSrc;
const DEFAULT_PUBLIC_BASE = import.meta.env.BASE_URL || '/';
const WHEEL_TRIGGER_DELTA = 220;
const WHEEL_RESET_MS = 220;
const PAGE_TRANSITION_MS = 380;
const WHEEL_COOLDOWN_MS = 520;
const TOUCH_TRIGGER_MIN_PX = 180;
const TOUCH_TRIGGER_RATIO = 0.34;

const DEFAULT_ARTICLES = [
    {
        title: 'Cyberpunk 2077: Phantom Liberty получил масштабное обновление 2.2',
        gameTitle: 'Cyberpunk 2077',
        image: 'https://images.unsplash.com/photo-1674159057061-394f68e750a5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        categories: 'RPG · Обновления · Киберпанк',
    },
    {
        title: 'Elden Ring: Nightreign - все что известно о новом DLC',
        gameTitle: 'Elden Ring',
        image: 'https://images.unsplash.com/photo-1692897403215-9718cae64dd9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        categories: 'Action RPG · Релизы · Фэнтези',
    },
    {
        title: 'VR-шлем нового поколения от Sony выходит в продажу',
        gameTitle: 'PlayStation VR',
        image: 'https://images.unsplash.com/photo-1758523670318-f1b79559e1d1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        categories: 'VR · Технологии · Релизы',
    },
    {
        title: 'Forza Motorsport получила обновление с 20 новыми машинами',
        gameTitle: 'Forza Motorsport',
        image: 'https://images.unsplash.com/photo-1752348511160-ebe429a2dffb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        categories: 'Racing · Обновления · PC',
    },
    {
        title: 'Инди-хит Hollow Knight: Silksong наконец получил дату выхода',
        gameTitle: 'Hollow Knight',
        image: 'https://images.unsplash.com/photo-1759171052927-83f3b3a72b2b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        categories: 'Инди · Платформер · Релизы',
    },
    {
        title: 'Subnautica 3 анонсирована с кооперативным режимом',
        gameTitle: 'Subnautica',
        image: 'https://images.unsplash.com/photo-1680201540929-4fd82ca3add0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        categories: 'Выживание · Кооператив · Океан',
    },
];

function buildDefaultItems(): IGameFeedItem[] {
    return Array.from({ length: 52 }, (_, index) => {
        const article = DEFAULT_ARTICLES[index % DEFAULT_ARTICLES.length];

        return {
            id: `game-feed-${index + 1}`,
            title: article.title,
            gameTitle: article.gameTitle,
            image: article.image,
            videoSrc: `${DEFAULT_PUBLIC_BASE}_videos/feed-loop-${(index % 13) + 1}.mp4`,
            categories: article.categories,
            source: 'Яндекс Игры',
            price: `${[299, 499, 799, 1199][index % 4]} ₽`,
            accountName: 'Yandex Games',
            accountLogo: article.image,
        };
    });
}

function getSafeIndex(index: number, length: number): number {
    if (length === 0) {
        return 0;
    }

    return ((index % length) + length) % length;
}

function getVisibleCategories(categories: string | string[]): string {
    const list = Array.isArray(categories)
        ? categories
        : categories
              .split('·')
              .map((category) => category.trim())
              .filter(Boolean);

    return list.slice(0, 2).join(' · ');
}

function FeedSkeleton() {
    return (
        <section class="mc-game-feed__player mc-game-feed__player--skeleton" aria-label="Загрузка ленты">
            <div class="mc-game-feed__skeleton-video" />
            <div class="mc-game-feed__meta mc-game-feed__meta--skeleton" aria-hidden="true">
                <span class="mc-game-feed__skeleton-cover mc-game-feed__skeleton-item" />
                <span class="mc-game-feed__skeleton-text">
                    <span class="mc-game-feed__skeleton-line mc-game-feed__skeleton-line--title mc-game-feed__skeleton-item" />
                    <span class="mc-game-feed__skeleton-line mc-game-feed__skeleton-line--caption mc-game-feed__skeleton-item" />
                </span>
                <span class="mc-game-feed__skeleton-button mc-game-feed__skeleton-item" />
            </div>
        </section>
    );
}

function FeedError({
    message,
    retryButtonText,
    closeButtonText,
    onRetry,
    onClose,
}: {
    message: string;
    retryButtonText: string;
    closeButtonText: string;
    onRetry?: () => void;
    onClose: () => void;
}) {
    return (
        <section class="mc-game-feed__player mc-game-feed__player--error" aria-label="Ошибка загрузки ленты">
            <div class="mc-game-feed__error-panel">
                <span class="mc-game-feed__error-title">Не удалось загрузить ленту</span>
                <span class="mc-game-feed__error-message">{message}</span>
                <span class="mc-game-feed__error-actions">
                    <button type="button" class="mc-game-feed__retry-button" onClick={onRetry}>
                        {retryButtonText}
                    </button>
                    <button type="button" class="mc-game-feed__dismiss-button" onClick={onClose}>
                        {closeButtonText}
                    </button>
                </span>
            </div>
        </section>
    );
}

function LoopingVideo({
    src,
    title,
    muted,
    paused,
    shouldPrimeFrame,
    onProgress,
}: {
    src: string;
    title: string;
    muted: boolean;
    paused: boolean;
    shouldPrimeFrame: boolean;
    onProgress: (progress: number) => void;
}) {
    const videoRef = useRef<HTMLVideoElement | null>(null);

    useEffect(() => {
        const video = videoRef.current;

        if (!video) {
            return;
        }

        video.muted = muted;

        if (paused) {
            video.pause();

            if (shouldPrimeFrame) {
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
    }, [muted, paused, shouldPrimeFrame, src]);

    useEffect(() => {
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
    }, [onProgress, src]);

    return (
        <video
            ref={videoRef}
            class="mc-game-feed__video"
            autoPlay
            loop
            muted={muted}
            playsInline
            preload="auto"
            aria-label={title}
            onCanPlay={(event) => {
                if (paused) {
                    return;
                }

                const playPromise = event.currentTarget.play();

                if (playPromise) {
                    playPromise.catch(() => undefined);
                }
            }}
        >
            <source src={src} type="video/mp4" />
        </video>
    );
}

function PreloadVideos({ items }: { items: IGameFeedItem[] }) {
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

function PlaybackIndicator({
    feedbackIcon,
    isPaused,
}: {
    feedbackIcon: 'play' | 'pause' | null;
    isPaused: boolean;
}) {
    return (
        <span
            class={`mc-game-feed__playback-indicator ${
                feedbackIcon || isPaused ? 'mc-game-feed__playback-indicator--visible' : ''
            }`}
            aria-hidden="true"
        >
            {feedbackIcon === 'play' && (
                <svg class="mc-game-feed__playback-icon" viewBox="0 0 24 24" fill="none">
                    <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M9.18416 19.7655C11.9756 18.6407 15.6497 16.2818 17.6796 14.4433C19.5318 12.8166 19.5318 11.189 17.6796 9.56139C15.6497 7.72384 11.9756 5.36491 9.18416 4.24012C6.91212 3.50295 5.60377 4.47152 5.19174 7.02964C5.01209 8.6309 4.92714 10.2927 4.93398 12.0023C4.92714 13.712 5.01209 15.3748 5.19174 16.976C5.5901 19.5429 6.91407 20.4861 9.18416 19.7655Z"
                        fill="white"
                    />
                </svg>
            )}
            {(feedbackIcon === 'pause' || (feedbackIcon === null && isPaused)) && (
                <svg class="mc-game-feed__playback-icon" viewBox="0 0 24 24" fill="none">
                    <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M7.43263 3.5C5.96763 3.5 4.77563 4.692 4.77563 6.157V17.843C4.77563 19.308 5.96763 20.5 7.43263 20.5C8.89763 20.5 10.0896 19.308 10.0896 17.843V6.157C10.0896 4.692 8.89763 3.5 7.43263 3.5Z"
                        fill="white"
                    />
                    <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M16.5674 3.5C15.1024 3.5 13.9104 4.692 13.9104 6.157V17.843C13.9104 19.308 15.1024 20.5 16.5674 20.5C18.0324 20.5 19.2244 19.308 19.2244 17.843V6.157C19.2244 4.692 18.0324 3.5 16.5674 3.5Z"
                        fill="white"
                    />
                </svg>
            )}
        </span>
    );
}

function FeedPage({
    item,
    isActive,
    isPaused,
    shouldPrimeFrame,
    feedbackIcon,
    progress,
    playButtonText,
    onPlay,
    onProgress,
    onTogglePlayback,
}: {
    item: IGameFeedItem;
    isActive: boolean;
    isPaused: boolean;
    shouldPrimeFrame: boolean;
    feedbackIcon: 'play' | 'pause' | null;
    progress: number;
    playButtonText: string;
    onPlay?: (item: IGameFeedItem) => void;
    onProgress: (progress: number) => void;
    onTogglePlayback: () => void;
}) {
    const visibleCategories = getVisibleCategories(item.categories);

    return (
        <div class="mc-game-feed__page">
            <LoopingVideo
                key={item.id}
                src={item.videoSrc}
                title={item.title}
                muted
                paused={!isActive || isPaused}
                shouldPrimeFrame={shouldPrimeFrame}
                onProgress={isActive ? onProgress : () => undefined}
            />
            <div class="mc-game-feed__scrim" />
            <div class="mc-game-feed__bottom-fade" />
            {isActive && (
                <button
                    type="button"
                    class="mc-game-feed__playback-toggle"
                    aria-label={isPaused ? 'Продолжить видео' : 'Поставить видео на паузу'}
                    onClick={onTogglePlayback}
                >
                    <PlaybackIndicator feedbackIcon={feedbackIcon} isPaused={isPaused} />
                </button>
            )}
            <div class="mc-game-feed__meta">
                <span class="mc-game-feed__cover">
                    <img src={item.image} alt="" class="mc-game-feed__cover-image" />
                </span>
                <span class="mc-game-feed__text">
                    <span class="mc-game-feed__game-title">{item.gameTitle}</span>
                    <span class="mc-game-feed__categories">{visibleCategories}</span>
                </span>
                <button
                    type="button"
                    class="mc-game-feed__play-button"
                    onClick={() => onPlay?.(item)}
                >
                    {playButtonText}
                </button>
            </div>
            {isActive && (
                <div class="mc-game-feed__progress">
                    <div class="mc-game-feed__progress-fill" style={{ width: `${progress * 100}%` }} />
                </div>
            )}
        </div>
    );
}

function FeedPlayer({
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

    const startPageTransition = (direction: -1 | 1) => {
        const now = Date.now();

        if (transitionDirection !== 0 || now - lastNavigationAt.current < WHEEL_COOLDOWN_MS || items.length < 2) {
            return;
        }

        lastNavigationAt.current = now;
        setProgress(0);
        setIsPaused(false);
        setFeedbackIcon(null);
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
    const preloadItems = Array.from({ length: Math.min(4, Math.max(0, items.length - 1)) }, (_, index) => (
        items[getSafeIndex(currentIndex + index + 1, items.length)]
    ));
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
            <PreloadVideos items={preloadItems} />
            <div
                class={trackClass}
                style={{ transform: trackTransform }}
            >
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

export function GameFeed({
    title = 'Лента игр',
    logoSrc = DEFAULT_LOGO_SRC,
    items,
    initialIndex = 0,
    openInitially = true,
    feedState = 'ready',
    errorMessage = 'Проверьте соединение и попробуйте ещё раз.',
    playButtonText = 'Играть',
    retryButtonText = 'Обновить',
    closeButtonText = 'Закрыть',
    onPlay,
    onRetry,
    onClose,
}: IGameFeedProps) {
    const [isOpen, setIsOpen] = useState(openInitially);
    const feedItems = useMemo(() => (items && items.length > 0 ? items : buildDefaultItems()), [items]);

    useEffect(() => {
        setIsOpen(openInitially);
    }, [openInitially]);

    const closeFeed = () => {
        setIsOpen(false);
        onClose?.();
    };

    if (!isOpen) {
        return (
            <div class="mc-game-feed mc-game-feed--closed">
                <button type="button" class="mc-game-feed__open-button" onClick={() => setIsOpen(true)}>
                    Открыть ленту
                </button>
            </div>
        );
    }

    return (
        <div class="mc-game-feed">
            <section class="mc-game-feed__dialog" role="dialog" aria-modal="true" aria-label={title}>
                <div class="mc-game-feed__header">
                    <div class="mc-game-feed__brand">
                        <span class="mc-game-feed__logo">
                            <img src={logoSrc} alt="" class="mc-game-feed__logo-image" />
                        </span>
                        <span class="mc-game-feed__title">{title}</span>
                    </div>
                    <button
                        type="button"
                        aria-label="Закрыть ленту"
                        class="mc-game-feed__close-button"
                        onClick={closeFeed}
                    >
                        <svg
                            class="mc-game-feed__close-icon"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            aria-hidden="true"
                        >
                            <path d="M6 6L18 18" stroke="white" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M18 6L6 18" stroke="white" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                    </button>
                </div>
                {feedState === 'loading' && <FeedSkeleton />}
                {feedState === 'error' && (
                    <FeedError
                        message={errorMessage}
                        retryButtonText={retryButtonText}
                        closeButtonText={closeButtonText}
                        onRetry={onRetry}
                        onClose={closeFeed}
                    />
                )}
                {feedState === 'ready' && (
                    <FeedPlayer
                        items={feedItems}
                        initialIndex={initialIndex}
                        playButtonText={playButtonText}
                        onPlay={onPlay}
                    />
                )}
            </section>
        </div>
    );
}
