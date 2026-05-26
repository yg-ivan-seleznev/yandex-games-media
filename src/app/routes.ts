import { createBrowserRouter } from "react-router";
import { DiscoveryPage } from "./components/discovery-page";
import { ProfileReference } from "./components/profile-reference";
import { ArticlePage } from "./components/article-page";

export const router = createBrowserRouter(
  [
    {
      path: "/",
      Component: DiscoveryPage,
    },
    {
      path: "/profile-reference",
      Component: ProfileReference,
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
