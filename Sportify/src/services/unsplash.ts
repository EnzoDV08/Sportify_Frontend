const UNSPLASH_ACCESS_KEY = import.meta.env.VITE_UNSPLASH_KEY;

export const fetchUnsplashImages = async (query: string) => {
  const response = await fetch(
    `https://api.unsplash.com/search/photos?query=${query}&per_page=6&orientation=landscape&client_id=${UNSPLASH_ACCESS_KEY}`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch images from Unsplash');
  }

  const data = await response.json();
  return data.results.map((img: any) => ({
    url: img.urls.small,
    full: img.urls.full,
    alt: img.alt_description || 'Unsplash image',
    photographer: img.user.name,
    photographerLink: img.user.links.html,
  }));
};
