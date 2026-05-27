export interface Article {
  id: string;
  title: string;
  summary: string;
  image: string;
  date: string;
  author: string;
  readingTime: string;
  tags: string[];
  category: string;
  type: "news" | "article" | "guide" | "review";
}

const MONTH_LABELS: Record<string, string> = {
  Jan: "янв",
  Feb: "фев",
  Mar: "мар",
  Apr: "апр",
  May: "май",
  Jun: "июн",
  Jul: "июл",
  Aug: "авг",
  Sep: "сен",
  Oct: "окт",
  Nov: "ноя",
  Dec: "дек",
};

export function formatArticleDate(date: string) {
  const relativeMatch = date.match(/^(\d+)([hdmy]) ago$/);
  if (relativeMatch) {
    const [, value, unit] = relativeMatch;
    const unitLabel = ({ h: "ч", d: "д", m: "м", y: "г" } as const)[unit as "h" | "d" | "m" | "y"];
    return `${value} ${unitLabel} назад`;
  }

  const monthMatch = date.match(/^([A-Z][a-z]{2}) (\d{1,2})$/);
  if (monthMatch) {
    const [, month, day] = monthMatch;
    return `${day} ${MONTH_LABELS[month] ?? month.toLowerCase()}`;
  }

  return date;
}

export const CATEGORIES = [
  "Все",
  "Индустрия",
  "Релизы",
  "Обновления",
  "События",
  "Киберспорт",
  "Мобайл",
  "PC",
  "Консоли",
  "Инди",
  "MMO / Онлайн",
  "RPG",
  "Экшн",
  "Стратегии",
  "Хоррор",
  "Выживание",
];

const IMG = {
  controller: "https://images.unsplash.com/photo-1610561212775-b191f21b6998?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWRlbyUyMGdhbWUlMjBjb250cm9sbGVyJTIwbmVvbnxlbnwxfHx8fDE3NzI3MTY1Njd8MA&ixlib=rb-4.1.0&q=80&w=1080",
  cyberpunk: "https://images.unsplash.com/photo-1674159057061-394f68e750a5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjeWJlcnB1bmslMjBjaXR5JTIwbmlnaHR8ZW58MXx8fHwxNzcyNzM0MTcyfDA&ixlib=rb-4.1.0&q=80&w=1080",
  pcSetup: "https://images.unsplash.com/photo-1704871132546-d1d3b845ae65?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1pbmclMjBQQyUyMHNldHVwJTIwUkdCfGVufDF8fHx8MTc3Mjc4ODg5N3ww&ixlib=rb-4.1.0&q=80&w=1080",
  fantasy: "https://images.unsplash.com/photo-1706804653497-1b43f7cc68ef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYW50YXN5JTIwZ2FtZSUyMGxhbmRzY2FwZXxlbnwxfHx8fDE3NzI3MTIxMDd8MA&ixlib=rb-4.1.0&q=80&w=1080",
  scifi: "https://images.unsplash.com/photo-1762441112136-4dfc6edf58e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY2ktZmklMjBzcGFjZSUyMGJhdHRlxlbnwxfHx8fDE3NzI3ODg4OTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
  pixel: "https://images.unsplash.com/photo-1759171052927-83f3b3a72b2b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaXhlbCUyMGFydCUyMHJldHJvJTIwZ2FtZXxlbnwxfHx8fDE3NzI3ODg4OTh8MA&ixlib=rb-4.1.0&q=80&w=1080",
  vr: "https://images.unsplash.com/photo-1758523670318-f1b79559e1d1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxWUiUyMHZpcnR1YWwlMjByZWFsaXR5JTIwaGVhZHNldHxlbnwxfHx8fDE3NzI3MDcyNDJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
  castle: "https://images.unsplash.com/photo-1692897403215-9718cae64dd9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXJrJTIwZmFudGFzeSUyMGNhc3RsZXxlbnwxfHx8fDE3NzI2NzE1NjB8MA&ixlib=rb-4.1.0&q=80&w=1080",
  mobile: "https://images.unsplash.com/photo-1661347999665-579bb8f9402d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2JpbGUlMjBnYW1pbmclMjBzbWFydHBob25lfGVufDF8fHx8MTc3Mjc4ODg5OHww&ixlib=rb-4.1.0&q=80&w=1080",
  racing: "https://images.unsplash.com/photo-1752348511160-ebe429a2dffb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyYWNpbmclMjBnYW1lJTIwY2FyJTIwc3BlZWR8ZW58MXx8fHwxNzcyNzA5NzYzfDA&ixlib=rb-4.1.0&q=80&w=1080",
  rpg: "https://images.unsplash.com/photo-1440711085503-89d8ec455791?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxSUEclMjBtZWRpZXZhbCUyMHdhcnJpb3IlMjBzd29yZHxlbnwxfHx8fDE3NzI3ODg4OTl8MA&ixlib=rb-4.1.0&q=80&w=1080",
  horror: "https://images.unsplash.com/photo-1761410777083-0812af765065?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3Jyb3IlMjBnYW1lJTIwZGFyayUyMGNvcnJpZG9yfGVufDF8fHx8MTc3Mjc4ODg5OXww&ixlib=rb-4.1.0&q=80&w=1080",
  survival: "https://images.unsplash.com/photo-1760233470648-1c87c7657098?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdXJ2aXZhbCUyMGdhbWUlMjB3aWxkZXJuZXNzJTIwZm9yZXN0fGVufDF8fHx8MTc3Mjc4ODg5OXww&ixlib=rb-4.1.0&q=80&w=1080",
  strategy: "https://images.unsplash.com/photo-1570989412391-bac1ffb78dd1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHJhdGVneSUyMGdhbWUlMjBjaGVzcyUyMGZ1dHVyaXN0aWN8ZW58MXx8fHwxNzcyNzg4OTAxfDA&ixlib=rb-4.1.0&q=80&w=1080",
  esports: "https://images.unsplash.com/photo-1767455471543-055dbc6c6700?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlc3BvcnRzJTIwYXJlbmElMjBnYW1pbmclMjBjb21wZXRpdGlvbnxlbnwxfHx8fDE3NzI3ODg5MDR8MA&ixlib=rb-4.1.0&q=80&w=1080",
  corporate: "https://images.unsplash.com/photo-1597239451147-f163967b8581?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3Jwb3JhdGUlMjBnYW1pbmclMjBvZmZpY2V8ZW58MXx8fHwxNzcyODAwNTcyfDA&ixlib=rb-4.1.0&q=80&w=1080",
  launch: "https://images.unsplash.com/photo-1558008258-3256797b43f3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWRlbyUyMGdhbWUlMjBsYXVuY2glMjBldmVudHxlbnwxfHx8fDE3NzI4MDA1NzN8MA&ixlib=rb-4.1.0&q=80&w=1080",
  review: "https://images.unsplash.com/photo-1672754091891-b58ed53665e6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1pbmclMjBtb25pdG9yJTIwcmV2aWV3JTIwZGVza3xlbnwxfHx8fDE3NzI4MDA1Nzl8MA&ixlib=rb-4.1.0&q=80&w=1080",
  neonCity: "https://images.unsplash.com/photo-1728160990491-d3ae436225dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZW9uJTIwY2l0eSUyMG5pZ2h0JTIwY3liZXJwdW5rJTIwc3RyZWV0fGVufDF8fHx8MTc3MjgwMDU3OXww&ixlib=rb-4.1.0&q=80&w=1080",
  knight: "https://images.unsplash.com/photo-1738697216337-962a74e45180?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXJrJTIwc291bHMlMjBtZWRpZXZhbCUyMGtuaWdodHxlbnwxfHx8fDE3NzI4MDA1NzN8MA&ixlib=rb-4.1.0&q=80&w=1080",
  astronaut: "https://images.unsplash.com/photo-1703782010144-49e3a6e4bca2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcGFjZSUyMGV4cGxvcmF0aW9uJTIwYXN0cm9uYXV0fGVufDF8fHx8MTc3MjgwMDU3NHww&ixlib=rb-4.1.0&q=80&w=1080",
  samurai: "https://images.unsplash.com/photo-1723164965017-ea5d1c6945df?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYW11cmFpJTIwd2FycmlvciUyMGphcGFufGVufDF8fHx8MTc3MjczMjUxMXww&ixlib=rb-4.1.0&q=80&w=1080",
  deepSea: "https://images.unsplash.com/photo-1680201540929-4fd82ca3add0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1bmRlcndhdGVyJTIwb2NlYW4lMjBkZWVwJTIwc2VhfGVufDF8fHx8MTc3MjczODI0Mnww&ixlib=rb-4.1.0&q=80&w=1080",
  wasteland: "https://images.unsplash.com/photo-1765578539072-7c074ddb5ef3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3N0JTIwYXBvY2FseXB0aWMlMjB3YXN0ZWxhbmR8ZW58MXx8fHwxNzcyNzE2MjU2fDA&ixlib=rb-4.1.0&q=80&w=1080",
  enchanted: "https://images.unsplash.com/photo-1547140741-00d6fd251528?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWdpY2FsJTIwZm9yZXN0JTIwZW5jaGFudGVkfGVufDF8fHx8MTc3MjcxMDA0MXww&ixlib=rb-4.1.0&q=80&w=1080",
  mech: "https://images.unsplash.com/photo-1718453908945-f9520145837f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmdXR1cmlzdGljJTIwcm9ib3QlMjBtZWNofGVufDF8fHx8MTc3MjcxMzIwOHww&ixlib=rb-4.1.0&q=80&w=1080",
  ruins: "https://images.unsplash.com/photo-1598177183308-ec8555cbfe76?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmNpZW50JTIwcnVpbnMlMjB0ZW1wbGV8ZW58MXx8fHwxNzcyNzMzNzQ4fDA&ixlib=rb-4.1.0&q=80&w=1080",
  dragon: "https://images.unsplash.com/photo-1765148754568-3bdda3dc843f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkcmFnb24lMjBmYW50YXN5JTIwZmlyZXxlbnwxfHx8fDE3NzI4MDA1NzZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
  pirate: "https://images.unsplash.com/photo-1771913044092-4927174a7d50?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaXJhdGUlMjBzaGlwJTIwb2NlYW4lMjBhZHZlbnR1cmV8ZW58MXx8fHwxNzcyODAwNTgwfDA&ixlib=rb-4.1.0&q=80&w=1080",
  snow: "https://images.unsplash.com/photo-1548984401-e9c656f1e0e0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbm93eSUyMG1vdW50YWluJTIwd2lsZGVybmVzc3xlbnwxfHx8fDE3NzI4MDA1ODB8MA&ixlib=rb-4.1.0&q=80&w=1080",
};

export const NEWS_ARTICLES: Article[] = [
  {
    id: "n1",
    title: "Cyberpunk 2077: Phantom Liberty получил масштабное обновление 2.2",
    summary: "CD Projekt RED выпустила крупнейший патч для Phantom Liberty, добавив новые миссии, оружие и переработав систему крафта. Игроков ждут десятки часов нового контента и улучшенная производительность на всех платформах.",
    image: IMG.cyberpunk,
    date: "2h ago",
    author: "Иван Иванов",
    readingTime: "5 мин",
    tags: ["Cyberpunk 2077", "RPG"],
    category: "Обновления",
    type: "news",
  },
  {
    id: "n2",
    title: "Valve анонсировала новую игру во вселенной Half-Life",
    summary: "После многих лет ожидания Valve представила тизер нового проекта. Подробности раскроют на The Game Awards.",
    image: IMG.pcSetup,
    date: "5h ago",
    author: "Мария Петрова",
    readingTime: "3 мин",
    tags: ["Half-Life", "Valve"],
    category: "Индустрия",
    type: "article",
  },
  {
    id: "n3",
    title: "VR-шлем нового поколения от Sony выходит в продажу",
    summary: "PlayStation VR3 обещает 4K на каждый глаз и поддержку eye-tracking нового уровня.",
    image: IMG.vr,
    date: "8h ago",
    author: "Алексей Смирнов",
    readingTime: "4 мин",
    tags: ["PlayStation", "VR"],
    category: "Релизы",
    type: "news",
  },
  {
    id: "n4",
    title: "Финал турнира The International побил рекорд зрителей",
    summary: "Более 5 миллионов одновременных зрителей наблюдали за гранд-финалом крупнейшего турнира по Dota 2.",
    image: IMG.esports,
    date: "Mar 5",
    author: "Елена Кузнецова",
    readingTime: "6 мин",
    tags: ["Dota 2", "Esports"],
    category: "Киберспорт",
    type: "news",
  },
  {
    id: "n5",
    title: "Mobile Legends представила нового героя с уникальной механикой",
    summary: "Новый герой может переключаться между тремя стихиями прямо во время боя.",
    image: IMG.mobile,
    date: "Mar 5",
    author: "Дмитрий Соколов",
    readingTime: "3 мин",
    tags: ["Mobile Legends", "MOBA"],
    category: "Мобайл",
    type: "news",
  },
  {
    id: "n6",
    title: "Elden Ring: Nightreign — всё что известно о новом DLC",
    summary: "FromSoftware готовит масштабное дополнение к своему хиту. Новые боссы, локации и PvP-режим ожидаются этим летом.",
    image: IMG.castle,
    date: "Mar 4",
    author: "Анна Михайлова",
    readingTime: "7 мин",
    tags: ["Elden Ring", "Action RPG"],
    category: "Релизы",
    type: "article",
  },
  {
    id: "n7",
    title: "Forza Motorsport получила обновление с 20 новыми машинами",
    summary: "Turn 10 Studios добавила культовые суперкары и новую трассу Nürburgring Nordschleife.",
    image: IMG.racing,
    date: "Mar 4",
    author: "Сергей Иванов",
    readingTime: "4 мин",
    tags: ["Forza", "Racing"],
    category: "Обновления",
    type: "news",
  },
  {
    id: "n8",
    title: "Инди-хит Hollow Knight: Silksong наконец получил дату выхода",
    summary: "Team Cherry завершила разработку долгожданного сиквела. Релиз запланирован на осень 2026.",
    image: IMG.pixel,
    date: "Mar 3",
    author: "Ольга Петрова",
    readingTime: "4 мин",
    tags: ["Hollow Knight", "Инди"],
    category: "Инди",
    type: "news",
  },
  {
    id: "n9",
    title: "Resident Evil 10 будет самой страшной частью серии",
    summary: "Capcom раскрыла детали нового хоррора: открытый мир, динамическая погода и адаптивный AI врагов.",
    image: IMG.horror,
    date: "Mar 3",
    author: "Игорь Смирнов",
    readingTime: "5 мин",
    tags: ["Resident Evil", "Horror"],
    category: "Хоррор",
    type: "news",
  },
  {
    id: "n10",
    title: "Subnautica 3 анонсирована с кооперативным режимом на 4 игрока",
    summary: "Unknown Worlds раскрыла первые подробности о третьей части серии выживания в космическом океане.",
    image: IMG.survival,
    date: "Mar 2",
    author: "Александра Кузнецова",
    readingTime: "4 мин",
    tags: ["Subnautica", "Survival"],
    category: "Выживание",
    type: "news",
  },
  {
    id: "n11",
    title: "Age of Empires V покажут на Xbox Showcase",
    summary: "Relic Entertainment подготовила амбициозное продолжение легендарной серии стратегий с новым движком.",
    image: IMG.strategy,
    date: "Mar 2",
    author: "Дмитрий Соколов",
    readingTime: "3 мин",
    tags: ["Age of Empires", "RTS"],
    category: "Стратегии",
    type: "news",
  },
  {
    id: "n12",
    title: "The Witcher 4 на Unreal Engine 5: первые скриншоты",
    summary: "CD Projekt RED показала как будет выглядеть новый Ведьмак на новом движке. Детализация впечатляет.",
    image: IMG.fantasy,
    date: "Mar 1",
    author: "Анна Михайлова",
    readingTime: "5 мин",
    tags: ["Witcher 4", "RPG"],
    category: "RPG",
    type: "news",
  },
];

export const GUIDE_ARTICLES: Article[] = [
  {
    id: "g1",
    title: "Полный гайд по прокачке в Elden Ring: Nightreign",
    summary: "Оптимальные билды, маршруты фарма рун и советы по прохождению самых сложных боссов. Разбираем каждый класс и лучшие стратегии для PvE и PvP.",
    image: IMG.castle,
    date: "3h ago",
    author: "Алексей Смирнов",
    readingTime: "12 мин",
    tags: ["Elden Ring", "RPG"],
    category: "RPG",
    type: "guide",
  },
  {
    id: "g2",
    title: "Как собрать идеальный игровой ПК в 2026 году",
    summary: "Подробный разбор комплектующих, сравнение видеокарт и процессоров для разных бюджетов.",
    image: IMG.pcSetup,
    date: "6h ago",
    author: "Ольга Петрова",
    readingTime: "15 мин",
    tags: ["Hardware", "PC"],
    category: "PC",
    type: "guide",
  },
  {
    id: "g3",
    title: "Cyberpunk 2077: все секретные локации и скрытые квесты",
    summary: "Карта всех пасхалок и секретов Найт-Сити, включая контент из Phantom Liberty.",
    image: IMG.cyberpunk,
    date: "Mar 5",
    author: "Игорь Смирнов",
    readingTime: "10 мин",
    tags: ["Cyberpunk 2077", "RPG"],
    category: "RPG",
    type: "guide",
  },
  {
    id: "g4",
    title: "Стратегии победы в Dota 2: мета текущего патча",
    summary: "Лучшие герои, оптимальные пики и контрпики для каждой роли в текущем мета.",
    image: IMG.esports,
    date: "Mar 5",
    author: "Александра Кузнецова",
    readingTime: "8 мин",
    tags: ["Dota 2", "MOBA"],
    category: "Киберспорт",
    type: "guide",
  },
  {
    id: "g5",
    title: "Как настроить VR-шлем для максимального погружения",
    summary: "Правильная калибровка, настройка IPD и оптимальные параметры для каждой игры.",
    image: IMG.vr,
    date: "Mar 4",
    author: "Дмитрий Соколов",
    readingTime: "7 мин",
    tags: ["VR", "Hardware"],
    category: "Консоли",
    type: "guide",
  },
  {
    id: "g6",
    title: "Subnautica: выживание на хардкоре — полный гайд",
    summary: "Маршрут прохождения, лучшие базы и как избежать самых опасных существ.",
    image: IMG.survival,
    date: "Mar 4",
    author: "Анна Михайлова",
    readingTime: "11 мин",
    tags: ["Subnautica", "Survival"],
    category: "Выживание",
    type: "guide",
  },
  {
    id: "g7",
    title: "Гайд по прохождению Resident Evil Village на S-ранг",
    summary: "Спидран-стратегии, оптимальные маршруты и управление ресурсами для получения S-ранга.",
    image: IMG.horror,
    date: "Mar 3",
    author: "Иван Иванов",
    readingTime: "9 мин",
    tags: ["Resident Evil", "Horror"],
    category: "Хоррор",
    type: "guide",
  },
  {
    id: "g8",
    title: "Forza Motorsport: настройка машин для онлайн-рейтинга",
    summary: "Тюнинг подвески, аэродинамики и передаточных чисел для каждого класса авто.",
    image: IMG.racing,
    date: "Mar 3",
    author: "Мария Петрова",
    readingTime: "8 мин",
    tags: ["Forza", "Racing"],
    category: "PC",
    type: "guide",
  },
  {
    id: "g9",
    title: "The Witcher 3: все концовки и как их получить",
    summary: "Полный разбор развилок сюжета и ключевых решений, влияющих на финал игры.",
    image: IMG.fantasy,
    date: "Mar 2",
    author: "Алексей Смирнов",
    readingTime: "14 мин",
    tags: ["Witcher 3", "RPG"],
    category: "RPG",
    type: "guide",
  },
  {
    id: "g10",
    title: "Мобильный гейминг: лучшие контроллеры и аксессуары",
    summary: "Обзор геймпадов, кулеров и триггеров для смартфонов в 2026 году.",
    image: IMG.mobile,
    date: "Mar 2",
    author: "Ольга Петрова",
    readingTime: "6 мин",
    tags: ["Mobile", "Hardware"],
    category: "Мобайл",
    type: "guide",
  },
  {
    id: "g11",
    title: "Age of Empires IV: гайд для начинающих",
    summary: "Основы экономики, управления армией и лучшие цивилизации для новичков.",
    image: IMG.strategy,
    date: "Mar 1",
    author: "Дмитрий Соколов",
    readingTime: "10 мин",
    tags: ["Age of Empires", "RTS"],
    category: "Стратегии",
    type: "guide",
  },
  {
    id: "g12",
    title: "Hollow Knight: секретные боссы и скрытые области",
    summary: "Как найти все DLC-боссов и открыть секретную концовку в Godhome.",
    image: IMG.pixel,
    date: "Feb 28",
    author: "Анна Михайлова",
    readingTime: "8 мин",
    tags: ["Hollow Knight", "Инди"],
    category: "Инди",
    type: "guide",
  },
];

/* ─── Sidebar text-only news (Свежее / Дзен-стиль) ─── */
export interface TextNewsItem {
  id: string;
  title: string;
  source: string;
  timeAgo: string;
}

export const SIDEBAR_NEWS: TextNewsItem[] = [
  { id: "sn1", title: "Valve выпустила экстренный патч для Counter-Strike 2 после обнаружения критического эксплойта", source: "Cybersport.ru", timeAgo: "3 минуты назад" },
  { id: "sn2", title: "Riot Games объявила о переносе чемпионата мира по Valorant на 2027 год", source: "DTF", timeAgo: "8 минут назад" },
  { id: "sn3", title: "Nintendo подала иск против создателей эмулятора Switch 2", source: "3DNews", timeAgo: "12 минут назад" },
  { id: "sn4", title: "Продажи Elden Ring: Nightreign превысили 10 миллионов копий за первую неделю", source: "IGN Russia", timeAgo: "18 минут назад" },
  { id: "sn5", title: "Steam установил новый рекорд одновременных пользователей — 40 миллионов", source: "Хабр", timeAgo: "25 минут назад" },
  { id: "sn6", title: "Sony снижает цену PlayStation VR3 на 30% в преддверии праздников", source: "GameMAG", timeAgo: "32 минуты назад" },
  { id: "sn7", title: "Ubisoft закрывает серверы трёх игр серии Assassin's Creed", source: "Lenta.ru", timeAgo: "41 минуту назад" },
  { id: "sn8", title: "Разработчики Baldur's Gate 3 тизерят новый проект во вселенной D&D", source: "Канобу", timeAgo: "48 минут назад" },
  { id: "sn9", title: "Epic Games Store раздаёт сразу четыре AAA-игры на этой неделе", source: "DTF", timeAgo: "55 минут назад" },
  { id: "sn10", title: "Microsoft подтвердила разработку Fable 2 для Xbox Series X", source: "3DNews", timeAgo: "1 час назад" },
];

export const FRESH_NEWS: TextNewsItem[] = [
  { id: "fn1", title: "CD Projekt RED раскрыла первые детали мультиплеера The Witcher 4", source: "IGN Russia", timeAgo: "5 минут назад" },
  { id: "fn2", title: "Genshin Impact получит кроссовер с серией Final Fantasy", source: "DTF", timeAgo: "11 минут назад" },
  { id: "fn3", title: "Blizzard анонсировала Diablo V на BlizzCon 2026", source: "Cybersport.ru", timeAgo: "17 минут назад" },
  { id: "fn4", title: "Indie-студия из Новосибирска получила грант на разработку roguelike-игры", source: "vc.ru", timeAgo: "22 минуты назад" },
  { id: "fn5", title: "Google Stadia 2.0 возвращается с поддержкой облачного гейминга нового поколения", source: "Хабр", timeAgo: "30 минут назад" },
  { id: "fn6", title: "Турнир по Dota 2 в Москве собрал аншлаг — 25 000 зрителей", source: "Чемпионат", timeAgo: "38 минут назад" },
  { id: "fn7", title: "Rockstar Games показала первый геймплей GTA VI на 15 минут", source: "3DNews", timeAgo: "45 минут назад" },
  { id: "fn8", title: "AMD предствила видеокарту RX 9900 XT специально для геймеров", source: "Хабр", timeAgo: "52 минуты назад" },
];

/* ─── Section-specific articles ─── */

export const COMPANY_NEWS: Article[] = [
  { id: "cn1", title: "Microsoft завершила реструктуризацию Xbox — фокус на мультиплатформу", summary: "Глава Xbox подтвердил, что все будущие эксклюзивы будут выходить одновременно на PC и консолях.", image: IMG.corporate, date: "1h ago", author: "Иван Иванов", readingTime: "6 мин", tags: ["Microsoft", "Xbox"], category: "Индустрия", type: "article" },
  { id: "cn2", title: "Sony инвестирует $2 млрд в облачный гейминг", summary: "PlayStation Cloud станет конкурентом Xbox Game Pass и GeForce Now.", image: IMG.launch, date: "3h ago", author: "Мария Петрова", readingTime: "4 мин", tags: ["Sony", "Cloud"], category: "Индустрия", type: "news" },
  { id: "cn3", title: "Tencent приобрела контрольный пакет акций Ubisoft", summary: "Китайский гигант становится крупнейшим игроком индустрии.", image: IMG.neonCity, date: "5h ago", author: "Алексей Смирнов", readingTime: "5 мин", tags: ["Tencent", "Ubisoft"], category: "Индустрия", type: "news" },
  { id: "cn4", title: "EA открывает новую студию в Берлине для работы над Battlefield", summary: "Команда из 200 человек будет создавать следующую часть серии.", image: IMG.review, date: "8h ago", author: "Елена Кузнецова", readingTime: "3 мин", tags: ["EA", "Battlefield"], category: "Индустрия", type: "news" },
  { id: "cn5", title: "Nintendo раскрыла продажи Switch 2 — 15 млн за первый квартал", summary: "Новая консоль побила рекорд предшественницы.", image: IMG.controller, date: "Mar 5", author: "Дмитрий Соколов", readingTime: "4 мин", tags: ["Nintendo", "Switch 2"], category: "Индустрия", type: "news" },
];

export const REVIEW_ARTICLES: Article[] = [
  { id: "rv1", title: "Рецензия: Elden Ring Nightreign — шедевр или провал?", summary: "Разбираем новое DLC от FromSoftware: геймплей, босс-файты и влияние на лор.", image: IMG.knight, date: "2h ago", author: "Игорь Смирнов", readingTime: "12 мин", tags: ["Elden Ring", "Рецензия"], category: "RPG", type: "review" },
  { id: "rv2", title: "Обзор Starfield: Shattered Space — космос стал интереснее", summary: "Bethesda исправила ошибки оригинала и добавила глубину исследованию.", image: IMG.astronaut, date: "5h ago", author: "Анна Михайлова", readingTime: "10 мин", tags: ["Starfield", "Рецензия"], category: "RPG", type: "review" },
  { id: "rv3", title: "Ghost of Tsushima 2 — самурайское совершенство", summary: "Sucker Punch создала одну из лучших игр поколения.", image: IMG.samurai, date: "Mar 5", author: "Мария Петрова", readingTime: "11 мин", tags: ["Ghost of Tsushima", "Рецензия"], category: "Экшн", type: "review" },
  { id: "rv4", title: "Обзор Subnautica 3: океан стал глубже и опаснее", summary: "Кооперативный режим меняет всё — выживать вместе веселее.", image: IMG.deepSea, date: "Mar 4", author: "Алексей Смирнов", readingTime: "9 мин", tags: ["Subnautica 3", "Рецензия"], category: "Выживание", type: "review" },
  { id: "rv5", title: "Fallout 5: первые впечатления от раннего доступа", summary: "Bethesda вернулась к корням — RPG-механики наконец на высоте.", image: IMG.wasteland, date: "Mar 3", author: "Дмитрий Соколов", readingTime: "8 мин", tags: ["Fallout 5", "Рецензия"], category: "RPG", type: "review" },
  { id: "rv6", title: "Armored Core VII — мехи вернулись в большой стиль", summary: "FromSoftware доказывает, что серия жива и актуальна.", image: IMG.mech, date: "Mar 2", author: "Иван Иванов", readingTime: "10 мин", tags: ["Armored Core", "Рецензия"], category: "Экшн", type: "review" },
  { id: "rv7", title: "Frostpunk 2 — город должен выжить снова", summary: "11 bit studios превзошли оригинал во всём.", image: IMG.snow, date: "Mar 1", author: "Ольга Петрова", readingTime: "9 мин", tags: ["Frostpunk 2", "Рецензия"], category: "Стратегии", type: "review" },
];

export const RECENT_LAUNCHES: Article[] = [
  { id: "rl1", title: "Hollow Knight: Silksong — долгожданный релиз состоялся", summary: "Team Cherry наконец выпустила сиквел. Критики в восторге — 95 на Metacritic.", image: IMG.enchanted, date: "1d ago", author: "Ольга Петрова", readingTime: "7 мин", tags: ["Hollow Knight", "Инди"], category: "Инди", type: "news" },
  { id: "rl2", title: "Armored Core VII вышел на всех платформах", summary: "FromSoftware удивляет снова — меха-экшн нового поколения.", image: IMG.mech, date: "2d ago", author: "Игорь Смирнов", readingTime: "6 мин", tags: ["Armored Core", "Экшн"], category: "Экшн", type: "news" },
  { id: "rl3", title: "Assassin's Creed: Shadows — старт продаж", summary: "Ubisoft переносит серию в феодальную Японию.", image: IMG.ruins, date: "3d ago", author: "Анна Михайлова", readingTime: "5 мин", tags: ["AC Shadows", "RPG"], category: "RPG", type: "news" },
  { id: "rl4", title: "Dragon Age: The Veilguard — релиз и первые оценки", summary: "BioWare возвращается с новой главой в мире Тедаса.", image: IMG.dragon, date: "4d ago", author: "Мария Петрова", readingTime: "8 мин", tags: ["Dragon Age", "RPG"], category: "RPG", type: "news" },
  { id: "rl5", title: "Skull and Bones наконец вышел из раннего доступа", summary: "Ubisoft довела пиратский экшн до полноценного релиза.", image: IMG.pirate, date: "5d ago", author: "Алексей Смирнов", readingTime: "5 мин", tags: ["Skull and Bones", "Экшн"], category: "Экшн", type: "news" },
];

export const GUIDE_SECTION_ARTICLES: Article[] = [
  { id: "gs1", title: "Elden Ring Nightreign: все скрытые боссы и как их найти", summary: "Полная карта секретных боссов нового DLC и стратегии победы.", image: IMG.castle, date: "4h ago", author: "Алексей Смирнов", readingTime: "15 мин", tags: ["Elden Ring", "Гайд"], category: "RPG", type: "guide" },
  { id: "gs2", title: "Starfield: лучшие билды и навыки для исследователя", summary: "Оптимальная прокачка для максимального погружения в космос.", image: IMG.astronaut, date: "8h ago", author: "Дмитрий Соколов", readingTime: "12 мин", tags: ["Starfield", "Гайд"], category: "RPG", type: "guide" },
  { id: "gs3", title: "Ghost of Tsushima 2: все мифические истории", summary: "Где найти и как пройти каждую мифическую историю в игре.", image: IMG.samurai, date: "Mar 5", author: "Анна Михайлова", readingTime: "10 мин", tags: ["Ghost of Tsushima", "Гайд"], category: "Экшн", type: "guide" },
  { id: "gs4", title: "Как выжить первые 10 дней в Frostpunk 2", summary: "Стратегия развития города и управление ресурсами для новичков.", image: IMG.snow, date: "Mar 4", author: "Мария Петрова", readingTime: "8 мин", tags: ["Frostpunk 2", "Гайд"], category: "Стратегии", type: "guide" },
  { id: "gs5", title: "Cyberpunk 2077: финальный гайд по всем концовкам", summary: "Как получить каждую из 7 концовок включая секретную из Phantom Liberty.", image: IMG.neonCity, date: "Mar 3", author: "Игорь Смирнов", readingTime: "11 мин", tags: ["Cyberpunk 2077", "Гайд"], category: "RPG", type: "guide" },
];

/* ─── Game Database ─── */
export interface GameEntry {
  id: string;
  title: string;
  image: string;
  genre: string;
}

export const GAME_DATABASE: GameEntry[] = [
  { id: "gd1", title: "Elden Ring: Nightreign", image: IMG.knight, genre: "Action RPG" },
  { id: "gd2", title: "Starfield: Shattered Space", image: IMG.astronaut, genre: "RPG / Sci-fi" },
  { id: "gd3", title: "Ghost of Tsushima 2", image: IMG.samurai, genre: "Action / Adventure" },
  { id: "gd4", title: "Hollow Knight: Silksong", image: IMG.enchanted, genre: "Metroidvania" },
  { id: "gd5", title: "Subnautica 3", image: IMG.deepSea, genre: "Survival / Adventure" },
  { id: "gd6", title: "Fallout 5", image: IMG.wasteland, genre: "RPG / Post-apocalyptic" },
  { id: "gd7", title: "Armored Core VII", image: IMG.mech, genre: "Action / Mech" },
  { id: "gd8", title: "Dragon Age: Veilguard", image: IMG.dragon, genre: "RPG / Fantasy" },
  { id: "gd9", title: "Skull and Bones 2", image: IMG.pirate, genre: "Action / Pirate" },
  { id: "gd10", title: "Frostpunk 2", image: IMG.snow, genre: "Strategy / Survival" },
  { id: "gd11", title: "Resident Evil 10", image: IMG.horror, genre: "Horror / Survival" },
  { id: "gd12", title: "The Witcher 4", image: IMG.fantasy, genre: "RPG / Open World" },
];

/* ─── Release items ─── */
export interface ReleaseItem {
  id: string;
  title: string;
  image: string;
  genre: string;
  released: boolean;
  releaseDate: string;
}

export const RELEASE_ITEMS: ReleaseItem[] = [
  { id: "rel1", title: "Hollow Knight: Silksong", image: IMG.enchanted, genre: "Metroidvania", released: true, releaseDate: "1 марта 2026" },
  { id: "rel2", title: "Armored Core VII", image: IMG.mech, genre: "Action / Mech", released: true, releaseDate: "18 февраля 2026" },
  { id: "rel3", title: "Ghost of Tsushima 2", image: IMG.samurai, genre: "Action / Adventure", released: false, releaseDate: "12 марта 2026" },
  { id: "rel4", title: "Dragon Age: The Veilguard", image: IMG.dragon, genre: "RPG / Fantasy", released: false, releaseDate: "24 апреля 2026" },
  { id: "rel5", title: "Skull and Bones 2", image: IMG.pirate, genre: "Action / Pirate", released: false, releaseDate: "15 мая 2026" },
  { id: "rel6", title: "Subnautica 3", image: IMG.deepSea, genre: "Survival / Adventure", released: false, releaseDate: "3 июня 2026" },
  { id: "rel7", title: "Fallout 5", image: IMG.wasteland, genre: "RPG / Post-apocalyptic", released: false, releaseDate: "20 июля 2026" },
  { id: "rel8", title: "Frostpunk 2", image: IMG.snow, genre: "Strategy / Survival", released: true, releaseDate: "8 января 2026" },
];
