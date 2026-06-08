type IMcApiFetch = <TResponse = unknown, TBody = unknown>(
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

interface IMcUserData {
    uid?: string;
    login?: string;
    displayName?: string;
    avatar?: string;
    isChild?: boolean;
    isAuth: boolean;
}

export const mockUserData: IMcUserData = {
    uid: 'mock-uid-12345',
    login: 'testuser',
    displayName: 'Тестовый Пользователь',
    avatar: 'https://avatars.mds.yandex.net/get-yapic/0/0-0/islands-200',
    isChild: false,
    isAuth: true,
};

export const mockApiFetch: IMcApiFetch = async (url, method, options) => {
    console.log('[MockAPI]', method.toUpperCase(), url, options);

    await new Promise((resolve) => setTimeout(resolve, 300));

    if (url.includes('balance')) {
        return { yans: 100, plus: 50 } as never;
    }

    if (url.includes('user')) {
        return mockUserData as never;
    }

    return { success: true, data: null } as never;
};
