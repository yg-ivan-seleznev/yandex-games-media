import { createBrowserRouter } from "react-router";
import { DiscoveryPage } from "./components/discovery-page";
import { ArticlePage } from "./components/article-page";

export const router = createBrowserRouter(
  [
    {
      path: "/",
      Component: DiscoveryPage,
    },
    {
      path: "/article/:articleId",
      Component: ArticlePage,
    },
  ],
  {
    basename: "/yandex-games-media",
  },
);
