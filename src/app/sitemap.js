export default function sitemap() {
    const base = 'https://www.tokiosushibar.uz';
    return [
        { url: base, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
        { url: `${base}/menu`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
        { url: `${base}/contacts`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
        { url: `${base}/links`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    ];
}