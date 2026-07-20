import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://adamshop.com';
  const langs = ['ar', 'en'];

  const staticPages = ['', '/products', '/categories', '/cart', '/login', '/register', '/about', '/contact'];

  const urls: MetadataRoute.Sitemap = [];

  langs.forEach((lang) => {
    staticPages.forEach((page) => {
      urls.push({
        url: `${baseUrl}/${lang}${page}`,
        lastModified: new Date(),
        changeFrequency: page === '' ? 'daily' : 'weekly',
        priority: page === '' ? 1 : 0.8,
      });
    });
  });

  urls.push({
    url: baseUrl,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 1,
  });

  return urls;
}
