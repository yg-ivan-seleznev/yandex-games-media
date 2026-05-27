import { useMemo, useState, type CSSProperties, type ReactNode } from "react";
import { useNavigate, useParams } from "react-router";
import { ArrowLeft, ArrowRight, Eye, Search } from "lucide-react";
import {
  NEWS_ARTICLES, GUIDE_ARTICLES, COMPANY_NEWS, REVIEW_ARTICLES,
  GUIDE_SECTION_ARTICLES, RECENT_LAUNCHES, formatArticleDate,
  type Article,
} from "./discovery-data";

const imgImage2 = `${import.meta.env.BASE_URL}assets/7037144404edbd4836f8798551db4a3414381141.png`;
const imgSteamLogo = `${import.meta.env.BASE_URL}assets/steam-logo.png`;

const glassBorderStyle: CSSProperties = {
  background: "linear-gradient(135deg, rgba(255,255,255,0.32) 0%, transparent 40%, transparent 60%, rgba(255,255,255,0.32) 100%)",
  WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
  WebkitMaskComposite: "xor",
  maskComposite: "exclude",
  padding: "1px",
  borderRadius: "inherit",
};

function getAllArticles() {
  return [
    ...NEWS_ARTICLES,
    ...COMPANY_NEWS,
    ...REVIEW_ARTICLES,
    ...RECENT_LAUNCHES,
    ...GUIDE_ARTICLES,
    ...GUIDE_SECTION_ARTICLES,
  ];
}

function GlassPill({ children, className = "", onClick }: { children: ReactNode; className?: string; onClick?: () => void }) {
  return (
    <button onClick={onClick} className={`relative rounded-[500px] overflow-hidden cursor-pointer transition-all duration-200 hover:scale-[1.03] active:scale-[0.97] ${className}`}>
      <div className="absolute inset-0 backdrop-blur-[16px] rounded-[500px] bg-[rgba(41,41,41,0.48)]" />
      <div className="absolute inset-0 rounded-[500px] pointer-events-none" style={glassBorderStyle} />
      <span className="relative z-10 flex items-center gap-[inherit] w-full h-full justify-center">{children}</span>
    </button>
  );
}

function GlassBadge({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <span className={`relative inline-flex items-center justify-center rounded-[8px] overflow-hidden px-[10px] h-[24px] ${className}`}>
      <span className="absolute inset-0 backdrop-blur-[12px] bg-[rgba(255,255,255,0.16)]" />
      <span className="absolute inset-0 rounded-[8px] pointer-events-none" style={glassBorderStyle} />
      <span className="relative z-10 flex items-center justify-center">{children}</span>
    </span>
  );
}

const EDITORIAL_ARTICLE_IDS = new Set(["n2", "n6", "cn1", "rv1", "g3", "gs1"]);

function isEditorialArticle(article: Article) {
  return EDITORIAL_ARTICLE_IDS.has(article.id);
}

function getContentTypeLabel(article: Article) {
  if (article.type === "review") return "Рецензия";
  if (article.type === "guide") return "Гайд";
  if (article.type === "article") return "Статья";
  if (article.tags.includes("Рецензия")) return "Рецензия";
  if (isEditorialArticle(article)) return "Статья";
  return "Новость";
}

function ContentTypeBadge({ article }: { article: Article }) {
  return (
    <GlassBadge>
      <span className="font-['YS_Text',sans-serif] text-[12px] text-[#ebebeb]" style={{ fontWeight: 500 }}>{getContentTypeLabel(article)}</span>
    </GlassBadge>
  );
}

function ReadingTime({ value, className = "" }: { value: string; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-[4px] ${className}`}>
      <Eye size={14} strokeWidth={2} className="shrink-0" />
      <span>{value}</span>
    </span>
  );
}

function GlassCircle({ children, onClick, label, disabled = false }: { children: ReactNode; onClick: () => void; label: string; disabled?: boolean }) {
  const handlePress = () => {
    if (!disabled) onClick();
  };

  return (
    <button type="button" aria-label={label} disabled={disabled} onPointerDown={handlePress} onClick={handlePress} className={`relative h-[40px] w-[40px] shrink-0 overflow-hidden rounded-full transition-all duration-200 ${disabled ? "cursor-default opacity-40" : "cursor-pointer hover:scale-[1.05] active:scale-[0.95]"}`}>
      <span className="pointer-events-none absolute inset-0 rounded-full bg-[rgba(41,41,41,0.56)] backdrop-blur-[16px]" />
      <span className="absolute inset-0 rounded-full pointer-events-none" style={glassBorderStyle} />
      <span className="pointer-events-none relative z-10 flex h-full w-full items-center justify-center">{children}</span>
    </button>
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

function ArticleHeader() {
  return (
    <header className="fixed left-0 right-0 top-0 z-50 w-full">
      <div className="absolute inset-0 bg-[#141414]/80 backdrop-blur-[24px]" />
      <div className="relative mx-auto flex h-[70px] max-w-[1920px] flex-nowrap items-center overflow-hidden px-[18px] md:px-[31px]">
        <div className="flex shrink-0 items-center gap-[6px]">
          <div className="relative h-[28px] w-[61px] overflow-hidden max-[560px]:h-[26px] max-[560px]:w-[57px]">
            <img alt="Яндекс" className="absolute left-0 top-0 h-full w-[207.1%] max-w-none object-cover" src={imgImage2} />
          </div>
          <span className="font-['YS_Display',sans-serif] text-[28px] text-[#ebebeb] tracking-[-0.5px] whitespace-nowrap max-[560px]:hidden" style={{ fontWeight: 700 }}>Медиа</span>
        </div>
        <div className="relative z-20 ml-auto mr-[10px] shrink-0">
          <HeaderPromoControls />
        </div>
        <button type="button" aria-label="Поиск" className="relative z-20 flex h-[44px] w-[46px] shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-[44px]">
          <span className="absolute inset-0 rounded-[44px] bg-[rgba(41,41,41,0.48)] backdrop-blur-[16px]" />
          <span className="absolute inset-0 rounded-[44px] pointer-events-none" style={glassBorderStyle} />
          <Search size={20} className="relative z-10 text-[#ebebeb]" />
        </button>
      </div>
    </header>
  );
}

function RelatedCard({ article }: { article: Article }) {
  const navigate = useNavigate();

  return (
    <article onClick={() => navigate(`/article/${article.id}`)} className="group w-[292px] shrink-0 cursor-pointer overflow-hidden rounded-[16px] border border-[rgba(255,255,255,0.08)] bg-white/[0.04] transition-colors hover:bg-white/[0.06] md:w-full">
      <div className="relative aspect-[16/9] overflow-hidden">
        <img src={article.image} alt={article.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]" />
        <div className="absolute left-[12px] top-[12px]"><ContentTypeBadge article={article} /></div>
      </div>
      <div className="flex min-h-[116px] flex-col gap-[8px] p-[14px]">
        <h3 className="font-['YS_Display',sans-serif] text-[18px] leading-[22px] text-[#ebebeb]" style={{ fontWeight: 700, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{article.title}</h3>
        <p className="mt-auto flex items-center gap-[6px] font-['YS_Text',sans-serif] text-[13px] leading-[18px] text-[rgba(255,255,255,0.38)]" style={{ fontWeight: 400 }}><span>{formatArticleDate(article.date)}</span><span>·</span><ReadingTime value={article.readingTime} /></p>
      </div>
    </article>
  );
}

export function ArticlePage() {
  const navigate = useNavigate();
  const { articleId } = useParams();
  const [relatedOffset, setRelatedOffset] = useState(0);
  const articles = useMemo(() => getAllArticles(), []);
  const article = articles.find((item) => item.id === articleId);

  if (!article) {
    return (
      <div className="min-h-screen bg-[#141414] px-[24px] py-[32px] text-[#ebebeb]">
        <GlassPill onClick={() => navigate("/")} className="h-[48px] px-[20px] inline-flex items-center gap-[8px]">
          <ArrowLeft size={18} className="text-[#ebebeb]" />
          <span className="font-['YS_Text',sans-serif] text-[15px]" style={{ fontWeight: 500 }}>К ленте</span>
        </GlassPill>
        <div className="mx-auto mt-[120px] max-w-[720px] text-center">
          <h1 className="font-['YS_Display',sans-serif] text-[40px] leading-[46px]" style={{ fontWeight: 700 }}>Материал не найден</h1>
          <p className="mt-[12px] font-['YS_Text',sans-serif] text-[16px] leading-[24px] text-white/48">Возможно, ссылка устарела или материал был удален.</p>
        </div>
      </div>
    );
  }

  const primaryRelated = articles.filter((item) => (
    item.id !== article.id && (item.category === article.category || item.tags.some((tag) => article.tags.includes(tag)))
  ));
  const fallbackRelated = articles.filter((item) => item.id !== article.id && !primaryRelated.some((relatedItem) => relatedItem.id === item.id));
  const related = [...primaryRelated, ...fallbackRelated].slice(0, 8);
  const maxRelatedOffset = Math.max(0, related.length - 3);
  const safeRelatedOffset = Math.min(relatedOffset, maxRelatedOffset);
  const desktopRelated = related.slice(safeRelatedOffset, safeRelatedOffset + 3);

  const scrollRelated = (direction: -1 | 1) => {
    setRelatedOffset((offset) => {
      const nextOffset = offset + direction * 3;
      return Math.min(Math.max(nextOffset, 0), maxRelatedOffset);
    });
  };

  return (
    <div className="min-h-screen bg-[#141414] pt-[70px] text-[#ebebeb]">
      <ArticleHeader />

      <main className="mx-auto max-w-[1360px] px-[24px] pb-[80px] md:px-[48px]">
        <article>
          <section className="mx-auto max-w-[820px] pt-[16px]">
            <div className="relative h-[210px] overflow-hidden rounded-[20px] border border-white/[0.08] bg-white/[0.04]">
                <img src={article.image} alt={article.title} className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/24 to-transparent" />
                <div className="absolute left-[16px] top-[16px] flex flex-wrap gap-[8px]">
                  <ContentTypeBadge article={article} />
                  {article.tags.slice(0, 3).map((tag) => (
                    <GlassBadge key={tag}><span className="font-['YS_Text',sans-serif] text-[12px] text-[#ebebeb]" style={{ fontWeight: 500 }}>{tag}</span></GlassBadge>
                  ))}
                </div>
              <div className="absolute left-0 right-0 top-[74px] flex flex-col gap-[8px] px-[20px] md:px-[24px]">
                <h1 className="font-['YS_Display',sans-serif] text-[30px] leading-[36px] text-[#ebebeb] md:text-[34px] md:leading-[40px]" style={{ fontWeight: 700, textShadow: "0 2px 18px rgba(0,0,0,0.8)" }}>{article.title}</h1>
                <div className="font-['YS_Text',sans-serif] text-[14px] leading-[20px] text-white/64" style={{ fontWeight: 400, textShadow: "0 2px 12px rgba(0,0,0,0.72)" }}>
                  <span>{formatArticleDate(article.date)}</span><span>·</span><ReadingTime value={article.readingTime} />
                </div>
              </div>
            </div>
          </section>

          <section className="mx-auto mt-[40px] max-w-[820px]">
            <div className="flex flex-col gap-[24px]">
              <p className="font-['YS_Text',sans-serif] text-[20px] leading-[30px] text-white/72" style={{ fontWeight: 400 }}>{article.summary}</p>
              <div className="flex flex-col gap-[22px] font-['YS_Text',sans-serif] text-[17px] leading-[28px] text-white/68" style={{ fontWeight: 400 }}>
              <p>Редакция собрала главное вокруг темы и разложила детали по полкам: что изменилось, почему это важно для игроков и как материал может повлиять на ближайшие релизы.</p>
              <h2 className="pt-[8px] font-['YS_Display',sans-serif] text-[28px] leading-[34px] text-[#ebebeb]" style={{ fontWeight: 700 }}>Что изменилось</h2>
              <p>В фокусе материала не только сам анонс, но и контекст вокруг него. Для индустрии такие решения часто становятся сигналом: платформы меняют стратегию, студии перестраивают планы, а аудитория получает новые сценарии для игры.</p>
              <figure className="my-[8px] overflow-hidden rounded-[20px] border border-white/[0.08] bg-white/[0.04]">
                <div className="aspect-[16/9]">
                  <img src={related[0]?.image ?? article.image} alt="" className="h-full w-full object-cover" />
                </div>
              </figure>
              <h2 className="pt-[8px] font-['YS_Display',sans-serif] text-[28px] leading-[34px] text-[#ebebeb]" style={{ fontWeight: 700 }}>Что дальше</h2>
              <p>Мы продолжим следить за обновлениями и дополним материал, если появятся новые комментарии разработчиков, даты релизов или подробности по платформам.</p>
              </div>
            </div>
          </section>
        </article>

        {related.length > 0 && (
          <section className="mx-auto mt-[64px] max-w-[820px] border-t border-white/[0.08] pt-[32px]">
            <div className="flex items-center justify-between gap-[16px]">
              <h2 className="font-['YS_Display',sans-serif] text-[30px] leading-[36px] text-[#ebebeb]" style={{ fontWeight: 700 }}>Может быть интересно</h2>
              <div className="hidden gap-[8px] md:flex">
                <GlassCircle label="Листать влево" disabled={safeRelatedOffset === 0} onClick={() => scrollRelated(-1)}><ArrowLeft size={18} className="text-[#ebebeb]" /></GlassCircle>
                <GlassCircle label="Листать вправо" disabled={safeRelatedOffset >= maxRelatedOffset} onClick={() => scrollRelated(1)}><ArrowRight size={18} className="text-[#ebebeb]" /></GlassCircle>
              </div>
            </div>
            <div className="scrollbar-hide -mx-[24px] mt-[18px] flex gap-[16px] overflow-x-auto px-[24px] pb-[8px] md:hidden">
              {related.map((item) => <RelatedCard key={item.id} article={item} />)}
            </div>
            <div className="mt-[18px] hidden grid-cols-3 gap-[16px] md:grid">
              {desktopRelated.map((item) => <RelatedCard key={item.id} article={item} />)}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
