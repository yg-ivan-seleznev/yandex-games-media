import { h, render } from 'preact';
import { GameFeed, type IGameFeedProps } from './component';
import styles from './styles.css?inline';

export type { IGameFeedItem, IGameFeedProps } from './component';

interface IMcPackageConfig {
    dispatcher?: {
        dispatch(action: string, props?: unknown): void;
        subscribe(action: string, callback: (props: unknown) => void): void;
    };
    name: string;
    packageUrl: string;
    version: string;
    apiFetch?: <TResponse = unknown, TBody = unknown>(
        url: string,
        method: 'get' | 'post' | 'put' | 'patch' | 'delete',
        options?: {
            body?: TBody;
            params?: Record<string, string | number | boolean>;
            directlyToBackend?: boolean;
            isSdkUrl?: boolean;
            parseJSON?: boolean;
            csrfSupport?: boolean;
            additionalHeaders?: HeadersInit;
        }
    ) => Promise<TResponse>;
    userData?: {
        uid?: string;
        login?: string;
        displayName?: string;
        avatar?: string;
        isChild?: boolean;
        isAuth: boolean;
    };
}

export class McPackage {
    private readonly config: IMcPackageConfig;

    constructor(config: IMcPackageConfig) {
        this.config = config;
    }

    public getStyles(): string {
        return styles;
    }

    public renderMcGameFeed(container: HTMLElement, props: IGameFeedProps): void {
        render(h(GameFeed, props), container);
    }
}
