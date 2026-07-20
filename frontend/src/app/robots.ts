import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/system-admin/', '/api/'],
      },
    ],
    sitemap: 'https://adamshop.com/sitemap.xml',
  };
}
