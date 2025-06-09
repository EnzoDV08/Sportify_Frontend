import { useState } from 'react';
import { fetchUnsplashImages } from '../services/unsplash.ts';

interface ImageSelectorProps {
  query: string;
  onSelect: (url: string) => void;
}

const ImageSelector = ({ query, onSelect }: ImageSelectorProps) => {
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const loadImages = async () => {
    setLoading(true);
    try {
      const results = await fetchUnsplashImages(query);
      setImages(results);
    } catch (error) {
      console.error('Error fetching images:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={loadImages} disabled={loading}>
        {loading ? 'Loading...' : `Find images for "${query}"`}
      </button>

      <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', flexWrap: 'wrap' }}>
        {images.map((img, idx) => (
          <div key={idx}>
            <img
              src={img.url}
              alt={img.alt}
              style={{ width: '150px', cursor: 'pointer', borderRadius: '8px' }}
              onClick={() => onSelect(img.url)}
            />
            <small>
              Photo by <a href={img.photographerLink} target="_blank" rel="noreferrer">{img.photographer}</a> on <a href="https://unsplash.com" target="_blank" rel="noreferrer">Unsplash</a>
            </small>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageSelector;
