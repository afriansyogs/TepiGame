import { MetadataRoute } from 'next';
import gamesData from "@/data/games.json";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://tepigame.com';

  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'always',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/product`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
  ];

  const gameRoutes: MetadataRoute.Sitemap = gamesData.map((game) => ({
    url: `${baseUrl}/games/${game.name.toLowerCase().replace(/\s+/g, '-')}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [...routes, ...gameRoutes];
}
