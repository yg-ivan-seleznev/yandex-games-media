import { PreviewLayout } from './preview-layout';
import { McWrapper } from './mc-wrapper';
import type { IGameFeedProps } from '../src/mc-entry';

export function App() {

    return (
        <PreviewLayout 
            title="game-feed"
            description="Development Preview (Production Mode)"
        >
            {/* ========================================
                AI MODIFIES ONLY THIS SECTION
                ========================================
                
                Add/remove <McWrapper> blocks
                Change only props and title
                DO NOT touch PreviewLayout, imports
            */}
            
            <McWrapper<IGameFeedProps>
                componentName="GameFeed"
                title="Видео работает"
                props={{
                    title: 'Лента игр',
                    openInitially: true,
                    feedState: 'ready',
                    playButtonText: 'Играть',
                    items: [
                        {
                            id: 'long-title-demo',
                            title: 'Cyberpunk 2077: Phantom Liberty получил масштабное обновление 2.2',
                            gameTitle: 'Cyberpunk 2077: Phantom Liberty Ultimate Edition',
                            image: 'https://images.unsplash.com/photo-1674159057061-394f68e750a5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
                            videoSrc: `${import.meta.env.BASE_URL}_videos/feed-loop-1.mp4`,
                            categories: ['RPG', 'Обновления', 'Киберпанк'],
                        },
                        {
                            id: 'elden-ring-demo',
                            title: 'Elden Ring: Nightreign',
                            gameTitle: 'Elden Ring',
                            image: 'https://images.unsplash.com/photo-1692897403215-9718cae64dd9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
                            videoSrc: `${import.meta.env.BASE_URL}_videos/feed-loop-2.mp4`,
                            categories: ['Action RPG', 'Релизы', 'Фэнтези'],
                        },
                        {
                            id: 'vr-demo',
                            title: 'VR-шлем нового поколения от Sony выходит в продажу',
                            gameTitle: 'PlayStation VR',
                            image: 'https://images.unsplash.com/photo-1758523670318-f1b79559e1d1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
                            videoSrc: `${import.meta.env.BASE_URL}_videos/feed-loop-3.mp4`,
                            categories: ['VR', 'Технологии', 'Релизы'],
                        },
                        {
                            id: 'forza-demo',
                            title: 'Forza Motorsport получила обновление с 20 новыми машинами',
                            gameTitle: 'Forza Motorsport',
                            image: 'https://images.unsplash.com/photo-1752348511160-ebe429a2dffb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
                            videoSrc: `${import.meta.env.BASE_URL}_videos/feed-loop-4.mp4`,
                            categories: ['Racing', 'Обновления', 'PC'],
                        },
                        {
                            id: 'hollow-knight-demo',
                            title: 'Hollow Knight: Silksong наконец получил дату выхода',
                            gameTitle: 'Hollow Knight',
                            image: 'https://images.unsplash.com/photo-1759171052927-83f3b3a72b2b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
                            videoSrc: `${import.meta.env.BASE_URL}_videos/feed-loop-5.mp4`,
                            categories: ['Инди', 'Платформер', 'Релизы'],
                        },
                        {
                            id: 'subnautica-demo',
                            title: 'Subnautica 3 анонсирована с кооперативным режимом',
                            gameTitle: 'Subnautica',
                            image: 'https://images.unsplash.com/photo-1680201540929-4fd82ca3add0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
                            videoSrc: `${import.meta.env.BASE_URL}_videos/feed-loop-6.mp4`,
                            categories: ['Выживание', 'Кооператив', 'Океан'],
                        },
                    ],
                }}
            />

            <McWrapper<IGameFeedProps>
                componentName="GameFeed"
                title="Skeleton"
                props={{
                    title: 'Лента игр',
                    openInitially: true,
                    feedState: 'loading',
                    playButtonText: 'Играть',
                }}
            />

            <McWrapper<IGameFeedProps>
                componentName="GameFeed"
                title="Ошибка"
                props={{
                    title: 'Лента игр',
                    openInitially: true,
                    feedState: 'error',
                    errorMessage: 'Видео и данные ленты не загрузились. Повторите попытку позже.',
                    retryButtonText: 'Обновить',
                    closeButtonText: 'Закрыть',
                    playButtonText: 'Играть',
                }}
            />
            
            {/* ======================================== */}
        </PreviewLayout>
    );
}
