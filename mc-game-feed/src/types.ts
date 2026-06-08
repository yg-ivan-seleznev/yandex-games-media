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
