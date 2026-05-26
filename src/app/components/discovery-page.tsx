import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import React from "react";
import { useNavigate } from "react-router";
import { Search, X, ArrowLeft, ArrowRight, ChevronRight, Eye } from "lucide-react";
import { Masonry, useInfiniteLoader, type RenderComponentProps } from "masonic";
import { Toaster } from "sonner";
const imgImage2 = `${import.meta.env.BASE_URL}assets/7037144404edbd4836f8798551db4a3414381141.png`;
const imgSteamLogo = `${import.meta.env.BASE_URL}assets/steam-logo.png`;
import {
  NEWS_ARTICLES, GUIDE_ARTICLES, SIDEBAR_NEWS, COMPANY_NEWS,
  REVIEW_ARTICLES, GUIDE_SECTION_ARTICLES, GAME_DATABASE, RELEASE_ITEMS, RECENT_LAUNCHES,
  formatArticleDate,
  type Article, type TextNewsItem, type GameEntry, type ReleaseItem,
} from "./discovery-data";

const glassBorderStyle: React.CSSProperties = {
  background: "linear-gradient(135deg, rgba(255,255,255,0.32) 0%, transparent 40%, transparent 60%, rgba(255,255,255,0.32) 100%)",
  WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
  WebkitMaskComposite: "xor", maskComposite: "exclude", padding: "1px", borderRadius: "inherit",
};

type PageMode = "all" | "all2" | "news" | "guide";
const TABS: { key: PageMode; label: string }[] = [
  { key: "all2", label: "Все" }, { key: "news", label: "Новости" },
  { key: "guide", label: "Статьи" },
];

/* ─── Primitives ─── */
function GlassBadge({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`relative inline-flex items-center justify-center rounded-[8px] overflow-hidden px-[10px] h-[24px] ${className}`}>
      <span className="absolute inset-0 backdrop-blur-[12px] bg-[rgba(255,255,255,0.16)]" />
      <span className="absolute inset-0 rounded-[8px] pointer-events-none" style={glassBorderStyle} />
      <span className="relative z-10 flex items-center justify-center">{children}</span>
    </span>
  );
}

function GlassCircle({ children, onClick, size = 40 }: { children: React.ReactNode; onClick?: () => void; size?: number }) {
  return (
    <button onClick={onClick} className="relative rounded-full overflow-hidden cursor-pointer transition-all duration-200 hover:scale-[1.05] active:scale-[0.95] shrink-0" style={{ width: size, height: size }}>
      <div className="absolute inset-0 backdrop-blur-[16px] bg-[rgba(255,255,255,0.08)] rounded-full" />
      <div className="absolute inset-0 rounded-full pointer-events-none" style={glassBorderStyle} />
      <span className="relative z-10 flex items-center justify-center w-full h-full">{children}</span>
    </button>
  );
}

function GlassPill({ children, className = "", onClick }: { children: React.ReactNode; className?: string; onClick?: () => void }) {
  return (
    <button onClick={onClick} className={`relative rounded-[500px] overflow-hidden cursor-pointer transition-all duration-200 hover:scale-[1.03] active:scale-[0.97] ${className}`}>
      <div className="absolute inset-0 backdrop-blur-[16px] rounded-[500px] bg-[rgba(41,41,41,0.48)]" />
      <div className="absolute inset-0 rounded-[500px] pointer-events-none" style={glassBorderStyle} />
      <span className="relative z-10 flex items-center gap-[inherit] w-full h-full justify-center">{children}</span>
    </button>
  );
}

function SearchButton({ searchQuery, setSearchQuery }: { searchQuery: string; setSearchQuery: (v: string) => void }) {
  const [expanded, setExpanded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => { if (expanded && inputRef.current) inputRef.current.focus(); }, [expanded]);
  return (
    <div className="relative h-[44px] overflow-hidden rounded-[44px] transition-all duration-300 ease-in-out" style={{ width: expanded ? 264 : 46 }}>
      <div className="absolute inset-0 backdrop-blur-[16px] bg-[rgba(41,41,41,0.48)] rounded-[44px]" />
      <div className="absolute inset-0 rounded-[44px] pointer-events-none" style={glassBorderStyle} />
      {expanded ? (
        <div className="relative z-10 flex items-center h-full px-[15px] gap-[9px]">
          <Search size={20} className="text-[#ebebeb] shrink-0" />
          <input ref={inputRef} type="text" placeholder="Поиск" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onKeyDown={(e) => { if (e.key === "Escape") { setExpanded(false); setSearchQuery(""); } }} className="flex-1 bg-transparent border-none outline-none font-['YS_Text',sans-serif] text-[15px] text-[#ebebeb] placeholder-[rgba(255,255,255,0.32)]" style={{ fontWeight: 400 }} />
          <button
            onClick={() => {
              if (searchQuery) {
                setSearchQuery("");
                return;
              }
              setExpanded(false);
            }}
            className="text-[#ebebeb] cursor-pointer transition-colors"
            aria-label={searchQuery ? "Очистить поиск" : "Закрыть поиск"}
          >
            <X size={20} />
          </button>
        </div>
      ) : (
        <button onClick={() => setExpanded(true)} className="relative z-10 w-full h-full flex items-center justify-center cursor-pointer"><Search size={20} className="text-[#ebebeb]" /></button>
      )}
    </div>
  );
}

function HeaderPromoControls() {
  return (
    <div className="pointer-events-auto hidden items-center gap-[8px] lg:flex">
      <button
        type="button"
        className="group relative flex h-[37px] w-[104px] rotate-[2deg] items-center justify-center gap-[6px] overflow-hidden rounded-[13px] bg-gradient-to-br from-[#35c7ff] via-[#1c91d8] to-[#155d92] shadow-[0_0_16px_rgba(34,160,225,0.18)] transition-transform duration-200 hover:rotate-[0deg] hover:scale-[1.03] active:scale-[0.98]"
      >
        <span className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.38),transparent_34%)]" />
        <span className="relative flex h-[22px] w-[22px] items-center justify-center overflow-hidden">
          <img alt="" src={imgSteamLogo} className="h-full w-full object-contain" />
        </span>
        <span className="relative font-['YS_Text',sans-serif] text-[12px] leading-[12px] text-white" style={{ fontWeight: 700 }}>
          Ключи<br />Steam
        </span>
      </button>
    </div>
  );
}

function SectionHeading({ children, rightContent }: { children: React.ReactNode; rightContent?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-[20px]">
      <div className="flex items-center gap-[12px]">
        <h2 className="font-['YS_Display',sans-serif] text-[32px] text-[#ebebeb] tracking-[-0.75px]" style={{ fontWeight: 700 }}>{children}</h2>
        <GlassCircle size={36}><ChevronRight size={18} className="text-[#ebebeb]" /></GlassCircle>
      </div>
      {rightContent}
    </div>
  );
}

function SectionDivider() { return <div className="h-[1px] bg-[rgba(255,255,255,0.08)]" />; }

const textShadow = "0 2px 12px rgba(0,0,0,0.8), 0 1px 3px rgba(0,0,0,0.9)";
const FEED_IMAGE_RATIOS = ["4 / 3", "3 / 4", "4 / 5", "5 / 4"] as const;
const INITIAL_FEED_COUNT = 24;
const FEED_BATCH_SIZE = 16;
const AUTO_FEED_BATCHES = 3;
const FIXED_FEED_SECTION_SIZE = 5;
const FIXED_FEED_SECTION_BATCH = 3;
type FeedImageRatio = (typeof FEED_IMAGE_RATIOS)[number];
type FeedArticle = Article & { feedId: string; imageRatio: FeedImageRatio };
const EDITORIAL_ARTICLE_IDS = new Set(["n2", "n6", "cn1", "rv1", "g3", "gs1"]);

function isEditorialArticle(article: Article) {
  return EDITORIAL_ARTICLE_IDS.has(article.id);
}

function getContentTypeLabel(article: Article) {
  if (article.type === "guide") return "Гайд";
  if (article.tags.includes("Рецензия")) return "Статья";
  return "Новость";
}

function ReadingTime({ value, className = "" }: { value: string; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-[4px] ${className}`}>
      <Eye size={14} strokeWidth={2} className="shrink-0" />
      <span>{value}</span>
    </span>
  );
}

function getArticlePreview(summary: string) {
  const firstSentence = summary.match(/^.*?[.!?](?:\s|$)/)?.[0].trim();
  const preview = firstSentence && firstSentence.length >= 80 ? firstSentence : summary.slice(0, 150).trim();
  return preview.length < summary.length ? `${preview.replace(/[.。!?]+$/, "")}...` : preview;
}

/* ═══ CARD COMPONENTS ═══ */

function LargeCard({ article, aspect }: { article: Article; aspect?: string }) {
  const navigate = useNavigate();

  return (
    <article onClick={() => navigate(`/article/${article.id}`)} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") navigate(`/article/${article.id}`); }} role="link" tabIndex={0} className={`relative rounded-[20px] overflow-hidden group cursor-pointer transition-transform duration-200 hover:scale-[1.01] h-full focus:outline-none focus:ring-2 focus:ring-white/30 ${aspect === "16/9" ? "" : "min-h-[360px]"}`}>
      {aspect === "16/9" && <div className="aspect-[16/9]" />}
      <img src={article.image} alt={article.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-[24px] flex flex-col gap-[8px]">
        <div className="flex gap-[6px] flex-wrap">
          {article.tags.slice(0, 2).map((tag) => (
            <GlassBadge key={tag}><span className="font-['YS_Text',sans-serif] text-[12px] text-[rgba(255,255,255,0.90)]" style={{ fontWeight: 500 }}>{tag}</span></GlassBadge>
          ))}
        </div>
        <h3 className="font-['YS_Display',sans-serif] text-[24px] text-[#ebebeb] tracking-[-0.5px] leading-[30px] line-clamp-2" style={{ fontWeight: 700 }}>{article.title}</h3>
        <div className="flex items-center gap-[8px] font-['YS_Text',sans-serif] text-[13px] text-[rgba(255,255,255,0.48)]" style={{ fontWeight: 400 }}>
          <span>{formatArticleDate(article.date)}</span><span>·</span><ReadingTime value={article.readingTime} />
        </div>
      </div>
    </article>
  );
}

function StandardCard({ article }: { article: Article }) {
  const navigate = useNavigate();

  return (
    <article onClick={() => navigate(`/article/${article.id}`)} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") navigate(`/article/${article.id}`); }} role="link" tabIndex={0} className="relative rounded-[20px] overflow-hidden border border-[rgba(255,255,255,0.08)] group cursor-pointer transition-transform duration-200 hover:scale-[1.02] bg-white/[0.04] h-full flex flex-col focus:outline-none focus:ring-2 focus:ring-white/30">
      <div className="relative h-[200px] overflow-hidden shrink-0">
        <img src={article.image} alt={article.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        <div className="absolute top-[12px] left-[12px]">
          <GlassBadge><span className="font-['YS_Text',sans-serif] text-[12px] text-[#ebebeb]" style={{ fontWeight: 500 }}>{article.tags[0]}</span></GlassBadge>
        </div>
      </div>
      <div className="p-[16px] flex flex-col gap-[8px] flex-1">
        <h3 className="font-['YS_Display',sans-serif] text-[20px] text-[#ebebeb] tracking-[-0.3px] leading-[26px] line-clamp-2" style={{ fontWeight: 700 }}>{article.title}</h3>
        <p className="font-['YS_Text',sans-serif] text-[14px] text-[rgba(255,255,255,0.48)] leading-[20px] line-clamp-2" style={{ fontWeight: 400 }}>{article.summary}</p>
        <div className="mt-auto flex items-center gap-[8px] font-['YS_Text',sans-serif] text-[13px] text-[rgba(255,255,255,0.32)]" style={{ fontWeight: 400 }}>
          <span>{formatArticleDate(article.date)}</span><span>·</span><ReadingTime value={article.readingTime} />
        </div>
      </div>
    </article>
  );
}

function EditorialBadge() {
  return (
    <GlassBadge>
      <span className="font-['YS_Text',sans-serif] text-[12px] text-[#ebebeb]" style={{ fontWeight: 500 }}>Редакция</span>
    </GlassBadge>
  );
}

function buildFeedItems(articles: Article[]): FeedArticle[] {
  if (articles.length === 0) return [];

  const total = Math.max(160, articles.length * 10);
  return Array.from({ length: total }, (_, index) => {
    const article = articles[index % articles.length];
    const cycle = Math.floor(index / articles.length);
    return {
      ...article,
      feedId: `${article.id}-${cycle}-${index}`,
      imageRatio: FEED_IMAGE_RATIOS[(index + cycle) % FEED_IMAGE_RATIOS.length],
    };
  });
}

function MasonryFeedCard({ data }: RenderComponentProps<FeedArticle>) {
  const navigate = useNavigate();

  return (
    <article onClick={() => navigate(`/article/${data.id}`)} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") navigate(`/article/${data.id}`); }} role="link" tabIndex={0} className="group cursor-pointer overflow-hidden rounded-[16px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] transition-colors duration-200 hover:bg-[rgba(255,255,255,0.06)] focus:outline-none focus:ring-2 focus:ring-white/30">
      <div className="relative overflow-hidden bg-[rgba(255,255,255,0.04)]" style={{ aspectRatio: data.imageRatio }}>
        <img src={data.image} alt={data.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]" />
        <div className="absolute left-[12px] top-[12px]">
          <GlassBadge>
            <span className="font-['YS_Text',sans-serif] text-[12px] text-[#ebebeb]" style={{ fontWeight: 500 }}>{data.tags[0]}</span>
          </GlassBadge>
        </div>
      </div>
      <div className="flex flex-col gap-[8px] p-[14px]">
        <h3 className="font-['YS_Display',sans-serif] text-[20px] leading-[24px] tracking-[-0.3px] text-[#ebebeb] line-clamp-3" style={{ fontWeight: 700 }}>{data.title}</h3>
        <div className="flex items-center gap-[8px] font-['YS_Text',sans-serif] text-[13px] text-[rgba(255,255,255,0.36)]" style={{ fontWeight: 400 }}>
          <span>{formatArticleDate(data.date)}</span><span>·</span><ReadingTime value={data.readingTime} />
        </div>
      </div>
    </article>
  );
}

function AllMasonryFeed({ articles }: { articles: Article[] }) {
  const [visibleCount, setVisibleCount] = useState(INITIAL_FEED_COUNT);
  const [autoBatchCount, setAutoBatchCount] = useState(0);

  useEffect(() => {
    setVisibleCount(INITIAL_FEED_COUNT);
    setAutoBatchCount(0);
  }, [articles]);

  const feedItems = useMemo(() => buildFeedItems(articles), [articles]);
  const visibleItems = useMemo(() => feedItems.slice(0, visibleCount), [feedItems, visibleCount]);
  const canAutoLoad = autoBatchCount < AUTO_FEED_BATCHES && visibleCount < feedItems.length;
  const hasMore = visibleCount < feedItems.length;

  const loadMoreItems = useCallback((_startIndex: number, _stopIndex: number, _items: FeedArticle[]) => {
    if (!canAutoLoad) return;
    setVisibleCount((count) => Math.min(count + FEED_BATCH_SIZE, feedItems.length));
    setAutoBatchCount((count) => Math.min(count + 1, AUTO_FEED_BATCHES));
  }, [canAutoLoad, feedItems.length]);

  const maybeLoadMore = useInfiniteLoader(loadMoreItems, {
    isItemLoaded: (index, items) => index < items.length,
    minimumBatchSize: FEED_BATCH_SIZE,
    threshold: 10,
    totalItems: canAutoLoad ? visibleItems.length + FEED_BATCH_SIZE : visibleItems.length,
  });

  const handleMoreClick = () => {
    setVisibleCount((count) => Math.min(count + FEED_BATCH_SIZE, feedItems.length));
  };

  return (
    <div className="max-w-[1320px] mx-auto px-[16px] md:px-[32px] mt-[40px]">
      <section>
        <SectionHeading>Все</SectionHeading>
        <Masonry
          items={visibleItems}
          render={MasonryFeedCard}
          itemKey={(item: FeedArticle) => item.feedId}
          columnWidth={320}
          columnGutter={16}
          rowGutter={16}
          maxColumnCount={3}
          itemHeightEstimate={360}
          overscanBy={2}
          onRender={maybeLoadMore}
        />
        {hasMore && !canAutoLoad && (
          <div className="flex justify-center pt-[28px]">
            <GlassPill onClick={handleMoreClick} className="h-[48px] px-[28px] flex items-center">
              <span className="font-['YS_Text',sans-serif] text-[16px] text-[#ebebeb]" style={{ fontWeight: 500 }}>Еще</span>
            </GlassPill>
          </div>
        )}
      </section>
    </div>
  );
}

function FixedFeedCard({ article }: { article: FeedArticle }) {
  const navigate = useNavigate();

  return (
    <article onClick={() => navigate(`/article/${article.id}`)} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") navigate(`/article/${article.id}`); }} role="link" tabIndex={0} className="group flex h-[300px] cursor-pointer flex-col overflow-hidden rounded-[16px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] transition-colors duration-200 hover:bg-[rgba(255,255,255,0.06)] focus:outline-none focus:ring-2 focus:ring-white/30">
      <div className="relative aspect-[16/9] overflow-hidden bg-[rgba(255,255,255,0.04)]">
        <img src={article.image} alt={article.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]" />
        {isEditorialArticle(article) && <div className="absolute right-[12px] top-[12px]"><EditorialBadge /></div>}
      </div>
      <div className="flex flex-1 flex-col justify-center gap-[8px] p-[14px]">
        <div className="font-['YS_Text',sans-serif] text-[12px] leading-[16px] text-[rgba(255,255,255,0.38)]" style={{ fontWeight: 500 }}>{getContentTypeLabel(article)}</div>
        <h3 className="font-['YS_Display',sans-serif] text-[18px] leading-[22px] text-[#ebebeb]" style={{ fontWeight: 700, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{article.title}</h3>
        <div className="font-['YS_Text',sans-serif] text-[13px] leading-[18px] text-[rgba(255,255,255,0.38)]" style={{ fontWeight: 400 }}>
          {formatArticleDate(article.date)} · <ReadingTime value={article.readingTime} />
        </div>
      </div>
    </article>
  );
}

function FeatureFeedCard({ article }: { article: FeedArticle }) {
  const navigate = useNavigate();

  return (
    <article onClick={() => navigate(`/article/${article.id}`)} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") navigate(`/article/${article.id}`); }} role="link" tabIndex={0} className="group relative h-[300px] w-full cursor-pointer overflow-hidden rounded-[16px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] transition-colors duration-200 hover:bg-[rgba(255,255,255,0.06)] focus:outline-none focus:ring-2 focus:ring-white/30">
      <img src={article.image} alt={article.title} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
      {isEditorialArticle(article) && <div className="absolute right-[16px] top-[16px]"><EditorialBadge /></div>}
      <div className="absolute bottom-[18px] left-[18px] right-[18px] flex flex-col gap-[10px]">
        <div className="font-['YS_Text',sans-serif] text-[12px] leading-[16px] text-[rgba(255,255,255,0.56)]" style={{ fontWeight: 500, textShadow }}>{getContentTypeLabel(article)}</div>
        <h3 className="font-['YS_Display',sans-serif] text-[26px] leading-[31px] text-[#ebebeb]" style={{ fontWeight: 700, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden", textShadow }}>{article.title}</h3>
        <div className="flex items-center gap-[8px] font-['YS_Text',sans-serif] text-[13px] leading-[18px] text-[rgba(255,255,255,0.56)]" style={{ fontWeight: 400, textShadow }}><span>{formatArticleDate(article.date)}</span><span>·</span><ReadingTime value={article.readingTime} /></div>
      </div>
    </article>
  );
}

function AllFixedFeed({ articles, className = "max-w-[1180px] mx-auto px-[24px] md:px-[48px] mt-[40px]" }: { articles: Article[]; className?: string }) {
  const [visibleSections, setVisibleSections] = useState(FIXED_FEED_SECTION_BATCH);

  useEffect(() => {
    setVisibleSections(FIXED_FEED_SECTION_BATCH);
  }, [articles]);

  const fixedItems = useMemo(() => buildFeedItems(articles), [articles]);
  const totalSections = Math.floor(fixedItems.length / FIXED_FEED_SECTION_SIZE);
  const shownSections = Math.min(visibleSections, totalSections);
  const sections = useMemo(() => (
    Array.from({ length: shownSections }, (_, sectionIndex) => {
      const start = sectionIndex * FIXED_FEED_SECTION_SIZE;
      return fixedItems.slice(start, start + FIXED_FEED_SECTION_SIZE);
    })
  ), [fixedItems, shownSections]);
  const hasMoreSections = shownSections < totalSections;

  return (
    <div className={className}>
      <section>
        <div className="flex flex-col gap-[28px]">
          {sections.map(([feature, side, ...row], sectionIndex) => (
            <div key={`${feature.feedId}-section-${sectionIndex}`} className="flex flex-col gap-[16px]">
              <div className="flex flex-col gap-[16px] lg:hidden">
                <div className="min-w-0">
                  <FeatureFeedCard article={feature} />
                </div>
                <div className="grid grid-cols-2 gap-[16px]">
                  {[side, ...row].map((article) => (
                    <div key={article.feedId} className="min-w-0">
                      <FixedFeedCard article={article} />
                    </div>
                  ))}
                </div>
              </div>

              <div className="hidden flex-col gap-[16px] lg:flex">
                <div className="grid grid-cols-3 gap-[16px]">
                  <div className="min-w-0 col-span-2">
                    <FeatureFeedCard article={feature} />
                  </div>
                  <div className="min-w-0">
                    <FixedFeedCard article={side} />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-[16px]">
                  {row.map((article) => (
                    <div key={article.feedId} className="min-w-0">
                      <FixedFeedCard article={article} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
        {hasMoreSections && (
          <div className="flex justify-center pt-[32px]">
            <GlassPill onClick={() => setVisibleSections((count) => Math.min(count + FIXED_FEED_SECTION_BATCH, totalSections))} className="h-[48px] px-[28px] flex items-center">
              <span className="font-['YS_Text',sans-serif] text-[16px] text-[#ebebeb]" style={{ fontWeight: 500 }}>Показать еще</span>
            </GlassPill>
          </div>
        )}
      </section>
    </div>
  );
}

function NewsHeroSection({ articles }: { articles: Article[] }) {
  const navigate = useNavigate();
  const sectionCards = articles.slice(0, 3).map((article, index) => ({
    ...article,
    feedId: `news-hero-${article.id}-${index}`,
    imageRatio: "16 / 9" as FeedImageRatio,
  }));
  const [featureArticle, ...smallArticles] = sectionCards;
  const textItems = articles.slice(0, 5);

  if (!featureArticle) return null;

  return (
    <section className="grid grid-cols-1 gap-[16px] lg:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
      <div className="grid min-w-0 grid-cols-1 gap-[16px] md:grid-cols-2">
        <div className="min-w-0 md:col-span-2">
          <FeatureFeedCard article={featureArticle} />
        </div>
        {smallArticles.map((article) => (
          <div key={article.feedId} className="min-w-0">
            <FixedFeedCard article={article} />
          </div>
        ))}
      </div>

      <div className="flex min-h-[616px] min-w-0 flex-col overflow-hidden rounded-[16px] border border-[rgba(255,255,255,0.08)] bg-white/[0.04] p-[20px]">
        <div className="mb-[18px] flex items-center">
          <h3 className="font-['YS_Display',sans-serif] text-[24px] leading-[28px] text-[#ebebeb]" style={{ fontWeight: 700 }}>Свежее</h3>
        </div>
        <div className="flex min-h-0 flex-1 flex-col">
          {textItems.map((article, index) => {
            return (
              <div key={article.id} className="min-w-0">
                {index > 0 && <div className="my-[12px] h-[1px] bg-[rgba(255,255,255,0.08)]" />}
                <button
                  type="button"
                  onClick={() => navigate(`/article/${article.id}`)}
                  className="group -mx-[4px] block w-[calc(100%+8px)] px-[12px] py-[10px] text-left"
                >
                  <p className="font-['YS_Text',sans-serif] text-[15px] leading-[19px] text-[#ebebeb] transition-colors line-clamp-3 group-hover:text-[rgba(255,255,255,0.72)]" style={{ fontWeight: 500 }}>{article.title}</p>
                  <p className="mt-[3px] flex items-center gap-[6px] font-['YS_Text',sans-serif] text-[12px] leading-[16px] text-[rgba(255,255,255,0.36)]" style={{ fontWeight: 400 }}><span>{formatArticleDate(article.date)}</span><span>·</span><ReadingTime value={article.readingTime} /></p>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function NewsFeed({ articles }: { articles: Article[] }) {
  const feedArticles = articles.slice(6);

  return (
    <div className="max-w-[1180px] mx-auto px-[24px] md:px-[48px] mt-[40px]">
      <div className="flex flex-col gap-[28px]">
        <NewsHeroSection articles={articles} />
        {feedArticles.length > 0 && <AllFixedFeed articles={feedArticles} className="" />}
      </div>
    </div>
  );
}

function GameCard({ game }: { game: GameEntry }) {
  return (
    <div className="relative rounded-[16px] overflow-hidden group cursor-pointer transition-transform duration-200 hover:scale-[1.02] shrink-0 w-[calc(25%-9px)]">
      <div className="aspect-[9/16] overflow-hidden">
        <img src={game.image} alt={game.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      <div className="absolute bottom-[16px] left-[14px] right-[14px]">
        <h3 className="font-['YS_Display',sans-serif] text-[18px] text-[#ebebeb] leading-[22px] line-clamp-2" style={{ fontWeight: 700, textShadow }}>{game.title}</h3>
      </div>
    </div>
  );
}

function ReleaseCard({ item }: { item: ReleaseItem }) {
  return (
    <div className="relative rounded-[16px] overflow-hidden group cursor-pointer transition-transform duration-200 hover:scale-[1.02] shrink-0 w-[calc(25%-9px)]">
      <div className="aspect-[9/16] overflow-hidden">
        <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      <div className="absolute bottom-[16px] left-[14px] right-[14px] flex flex-col gap-[4px]">
        <h3 className="font-['YS_Display',sans-serif] text-[18px] text-[#ebebeb] leading-[22px] line-clamp-2" style={{ fontWeight: 700, textShadow }}>{item.title}</h3>
        <p className="font-['YS_Text',sans-serif] text-[13px] text-[rgba(255,255,255,0.64)]" style={{ fontWeight: 500, textShadow }}>
          {item.released ? `Вышла: ${item.releaseDate}` : `Релиз: ${item.releaseDate}`}
        </p>
      </div>
    </div>
  );
}

/* Sidebar — compact for inline use */
function TextNewsList({ items, expanded, onToggle }: { items: TextNewsItem[]; expanded: boolean; onToggle: () => void }) {
  const visibleItems = expanded ? items : items.slice(0, 6);
  return (
    <div className="rounded-[20px] border border-[rgba(255,255,255,0.08)] bg-white/[0.04] p-[24px] h-full flex flex-col">
      <div className="flex items-center justify-between mb-[20px]">
        <h3 className="font-['YS_Display',sans-serif] text-[24px] text-[#ebebeb] tracking-[-0.5px]" style={{ fontWeight: 700 }}>Свежее</h3>
        <GlassCircle size={32}><ChevronRight size={16} className="text-[#ebebeb]" /></GlassCircle>
      </div>
      <div className="flex flex-col flex-1">
        {visibleItems.map((item, i) => (
          <div key={item.id}>
            {i > 0 && <div className="h-[1px] bg-[rgba(255,255,255,0.08)] my-[14px]" />}
            <div className="cursor-pointer group">
              <p className="font-['YS_Text',sans-serif] text-[14px] text-[#ebebeb] leading-[20px] group-hover:text-[rgba(255,255,255,0.72)] transition-colors line-clamp-2" style={{ fontWeight: 500 }}>{item.title}</p>
              <p className="font-['YS_Text',sans-serif] text-[12px] text-[rgba(255,255,255,0.32)] mt-[4px]" style={{ fontWeight: 400 }}>{item.source} · {item.timeAgo}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="h-[1px] bg-[rgba(255,255,255,0.08)] my-[14px]" />
      <button onClick={onToggle} className="w-full py-[8px] rounded-[12px] border border-[rgba(255,255,255,0.12)] font-['YS_Text',sans-serif] text-[14px] text-[#ebebeb] cursor-pointer hover:bg-[rgba(255,255,255,0.06)] transition-colors shrink-0" style={{ fontWeight: 500 }}>
        {expanded ? "Свернуть" : "Ещё"}
      </button>
    </div>
  );
}

/* ═══ PAGE ═══ */
export function DiscoveryPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<PageMode>("all2");
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [releaseOffset, setReleaseOffset] = useState(0);
  const [gameOffset, setGameOffset] = useState(0);

  const allArticles = useMemo(() => [
    ...NEWS_ARTICLES,
    ...COMPANY_NEWS,
    ...REVIEW_ARTICLES,
    ...RECENT_LAUNCHES,
    ...GUIDE_ARTICLES,
    ...GUIDE_SECTION_ARTICLES,
  ], []);
  const sourceArticles = useMemo(() => {
    if (mode === "all") return allArticles;
    if (mode === "all2") return allArticles;
    if (mode === "news") return allArticles.filter((article) => getContentTypeLabel(article) === "Новость");
    if (mode === "guide") return allArticles.filter((article) => getContentTypeLabel(article) !== "Новость");
    return allArticles;
  }, [mode, allArticles]);
  const filteredArticles = useMemo(() => {
    if (!searchQuery.trim()) return sourceArticles;
    const q = searchQuery.toLowerCase();
    return sourceArticles.filter((a) => a.title.toLowerCase().includes(q) || a.tags.some((t) => t.toLowerCase().includes(q)) || a.category.toLowerCase().includes(q));
  }, [sourceArticles, searchQuery]);

  const trendingMain = filteredArticles[0];
  const trendingRow2 = filteredArticles.slice(1, 4);
  const reviewCards = REVIEW_ARTICLES.slice(0, 2);

  const visibleReleases = RELEASE_ITEMS.slice(releaseOffset, releaseOffset + 4);
  const canRelPrev = releaseOffset > 0;
  const canRelNext = releaseOffset + 4 < RELEASE_ITEMS.length;
  const visibleGames = GAME_DATABASE.slice(gameOffset, gameOffset + 4);
  const canGamePrev = gameOffset > 0;
  const canGameNext = gameOffset + 4 < GAME_DATABASE.length;

  return (
    <div className="w-full min-h-screen bg-[#141414] overflow-x-hidden pt-[70px]">
      <Toaster position="bottom-center" toastOptions={{ style: { background: "rgba(41,41,41,0.72)", backdropFilter: "blur(16px)", border: "1px solid rgba(255,255,255,0.12)", color: "#ebebeb", fontFamily: "'YS Text', sans-serif" } }} />

      {/* HEADER */}
      <header className="fixed left-0 right-0 top-0 z-50 w-full">
        <div className="absolute inset-0 bg-[#141414]/80 backdrop-blur-[24px]" />
        <div className="relative max-w-[1920px] mx-auto px-[18px] md:px-[31px] h-[70px] flex items-center flex-nowrap overflow-hidden">
          <div className="flex items-center gap-[6px] shrink-0">
            <div className="h-[28px] w-[61px] overflow-hidden relative max-[560px]:h-[26px] max-[560px]:w-[57px]"><img alt="Яндекс" className="absolute h-full left-0 top-0 w-[207.1%] max-w-none object-cover" src={imgImage2} /></div>
            <span className="font-['YS_Display',sans-serif] text-[28px] text-[#ebebeb] tracking-[-0.5px] whitespace-nowrap max-[560px]:hidden" style={{ fontWeight: 700 }}>Медиа</span>
          </div>
          <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
            <div className="relative h-[40px] w-[262px] shrink-0 overflow-hidden rounded-[500px] sm:h-[44px] sm:w-auto">
              <div className="absolute inset-0 backdrop-blur-[16px] bg-[rgba(41,41,41,0.48)] rounded-[500px]" />
              <div className="absolute inset-0 rounded-[500px] pointer-events-none" style={glassBorderStyle} />
              <div className="relative z-10 flex items-center h-full px-[5px] gap-[3px] sm:px-[6px]">
                {TABS.map((tab) => (
                  <button key={tab.key} onClick={() => setMode(tab.key)} className={`relative h-[31px] flex-1 rounded-[500px] px-[9px] flex items-center justify-center cursor-pointer transition-all duration-200 sm:h-[33px] sm:flex-none sm:px-[20px] ${mode === tab.key ? "bg-[rgba(255,255,255,0.16)]" : "hover:bg-[rgba(255,255,255,0.06)]"}`}>
                    <span className={`font-['YS_Text',sans-serif] text-[14px] whitespace-nowrap sm:text-[15px] ${mode === tab.key ? "text-[#ebebeb]" : "text-[#a3a3a3]"}`} style={{ fontWeight: 500 }}>{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="absolute left-[calc(50%+150px)] top-1/2 z-10 -translate-y-1/2 2xl:left-[calc(50%+165px)]">
            <HeaderPromoControls />
          </div>
          <div className="relative z-20 ml-auto shrink-0"><SearchButton searchQuery={searchQuery} setSearchQuery={setSearchQuery} /></div>
        </div>
      </header>

      {/* CONTENT — centered, no sidebar */}
      {filteredArticles.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-[120px]">
          <Search size={48} className="text-[rgba(255,255,255,0.08)] mb-[16px]" />
          <p className="font-['YS_Text',sans-serif] text-[18px] text-[rgba(255,255,255,0.24)]" style={{ fontWeight: 500 }}>Ничего не найдено</p>
        </div>
      ) : mode === "all" ? (
        <AllMasonryFeed articles={filteredArticles} />
      ) : mode === "news" ? (
        <NewsFeed articles={filteredArticles} />
      ) : mode === "all2" || mode === "guide" ? (
        <AllFixedFeed articles={filteredArticles} />
      ) : (
        <div className="max-w-[1320px] mx-auto px-[16px] md:px-[32px] mt-[40px]">
          <div className="flex flex-col gap-[48px]">

            {/* ── ИГРОВЫЕ НОВОСТИ — 4-col grid: large(3) + свежее(1), then 3 cards ── */}
            {trendingMain && (
              <section>
                <SectionHeading>Игровые новости</SectionHeading>
                <div className="grid grid-cols-[minmax(0,3fr)_minmax(280px,1fr)] gap-[16px]">
                  <div className="grid grid-cols-3 gap-[16px]">
                    <div className="col-span-3">
                      <LargeCard article={trendingMain} />
                    </div>
                    {trendingRow2.map((a) => (
                      <StandardCard key={a.id} article={a} />
                    ))}
                  </div>
                  <TextNewsList items={SIDEBAR_NEWS} expanded={sidebarExpanded} onToggle={() => setSidebarExpanded((v) => !v)} />
                </div>
              </section>
            )}

            <SectionDivider />

            {/* ── НОВОСТИ КОМПАНИЙ — 4 cards ── */}
            <section>
              <SectionHeading>Новости компаний</SectionHeading>
              <div className="grid grid-cols-4 gap-[16px]">
                {COMPANY_NEWS.slice(0, 4).map((a) => <StandardCard key={a.id} article={a} />)}
              </div>
            </section>

            <SectionDivider />

            {/* ── РЕЦЕНЗИИ — 2 cards, each 2 cols ── */}
            <section>
              <SectionHeading>Рецензии</SectionHeading>
              <div className="grid grid-cols-2 gap-[16px]">
                {reviewCards.map((a) => <LargeCard key={a.id} article={a} aspect="16/9" />)}
              </div>
            </section>

            <SectionDivider />

            {/* ── РЕЛИЗЫ — 4 vertical 9:16 ── */}
            <section>
              <SectionHeading rightContent={
                <div className="flex gap-[8px]">
                  <GlassCircle size={40} onClick={() => canRelPrev && setReleaseOffset((o) => Math.max(0, o - 4))}><ArrowLeft size={18} className={canRelPrev ? "text-[#ebebeb]" : "text-[rgba(255,255,255,0.24)]"} /></GlassCircle>
                  <GlassCircle size={40} onClick={() => canRelNext && setReleaseOffset((o) => o + 4)}><ArrowRight size={18} className={canRelNext ? "text-[#ebebeb]" : "text-[rgba(255,255,255,0.24)]"} /></GlassCircle>
                </div>
              }>Релизы</SectionHeading>
              <div className="flex gap-[12px]">
                {visibleReleases.map((item) => <ReleaseCard key={item.id} item={item} />)}
              </div>
            </section>

            <SectionDivider />

            {/* ── ГАЙДЫ — row1: wide(3col) + standard(1col), row2: 2 x 16:9 overlay ── */}
            <section>
              <SectionHeading>Статьи</SectionHeading>
              <div className="grid grid-cols-4 gap-[16px] mb-[16px]">
                <div className="col-span-3">
                  <LargeCard article={GUIDE_SECTION_ARTICLES[0]} />
                </div>
                <div className="col-span-1">
                  <LargeCard article={GUIDE_SECTION_ARTICLES[1]} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-[16px]">
                {GUIDE_SECTION_ARTICLES.slice(2, 4).map((a) => <LargeCard key={a.id} article={a} aspect="16/9" />)}
              </div>
            </section>

            <SectionDivider />

            {/* ── БАЗА ИГР — 4 vertical with arrows ── */}
            <section>
              <SectionHeading rightContent={
                <div className="flex gap-[8px]">
                  <GlassCircle size={40} onClick={() => canGamePrev && setGameOffset((o) => Math.max(0, o - 4))}><ArrowLeft size={18} className={canGamePrev ? "text-[#ebebeb]" : "text-[rgba(255,255,255,0.24)]"} /></GlassCircle>
                  <GlassCircle size={40} onClick={() => canGameNext && setGameOffset((o) => o + 4)}><ArrowRight size={18} className={canGameNext ? "text-[#ebebeb]" : "text-[rgba(255,255,255,0.24)]"} /></GlassCircle>
                </div>
              }>База игр</SectionHeading>
              <div className="flex gap-[12px]">
                {visibleGames.map((game) => <GameCard key={game.id} game={game} />)}
              </div>
            </section>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="max-w-[1320px] mx-auto px-[16px] md:px-[32px] py-[40px] mt-[64px] flex flex-col md:flex-row items-center justify-between gap-[16px] border-t border-[rgba(255,255,255,0.10)] bg-[rgba(255,255,255,0.035)]">
        <div className="flex items-center gap-[6px]">
          <div className="h-[24px] w-[53px] overflow-hidden relative"><img alt="Яндекс" className="absolute h-full left-0 top-0 w-[207.1%] max-w-none object-cover" src={imgImage2} /></div>
          <span className="font-['YS_Display',sans-serif] text-[24px] text-[rgba(255,255,255,0.32)] tracking-[-0.5px]" style={{ fontWeight: 700 }}>Медиа</span>
        </div>
        <p className="font-['YS_Text',sans-serif] text-[14px] text-[rgba(255,255,255,0.24)]" style={{ fontWeight: 400 }}>© 2026 Яндекс Игры</p>
        <div className="flex gap-[24px]">
          {["Главная", "Каталог игр"].map((link) => (
            <span key={link} className="font-['YS_Text',sans-serif] text-[14px] text-[rgba(255,255,255,0.48)] hover:text-[rgba(255,255,255,0.72)] transition-colors cursor-pointer" style={{ fontWeight: 500 }}>{link}</span>
          ))}
        </div>
      </footer>

      <div className="fixed bottom-[24px] right-[24px] z-50">
        <GlassPill onClick={() => navigate("/profile-reference")} className="px-[20px] py-[12px] flex items-center gap-[8px] shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
          <span className="font-['YS_Text',sans-serif] text-[14px] text-[rgba(255,255,255,0.64)]" style={{ fontWeight: 500 }}>Дизайн-референс</span>
        </GlassPill>
      </div>
    </div>
  );
}
