import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import Navbar from '../../components/Navbar';
import api from '../../api';

interface GalleryImage {
  id: number;
  url: string;
  category: string;
  originalName: string;
}

export default function Gallery() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    fetchImages();
  }, [selectedCategory]);

  const fetchImages = async () => {
    try {
      setLoading(true);
      const url = selectedCategory === 'all'
        ? '/gallery/images'
        : `/gallery/images/category/${selectedCategory}`;
      const response = await api.get(url);
      setImages(response.data);
    } catch (error) {
      console.error('Error fetching images:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    'all',
    'Portrait',
    'Wedding',
    'Event',
    'Commercial',
    'Nature',
    'Urban',
    'Studio'
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />
      <div className="pt-24 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl mb-4 text-white">Our Gallery</h1>
            <div className="w-24 h-1 bg-primary mx-auto mb-6" />
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              A collection of our finest photography work across various genres
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg transition-all ${selectedCategory === category
                    ? 'bg-primary text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>

          {/* Gallery Grid */}
          {loading ? (
            <div className="text-center text-white py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p className="mt-2">Loading gallery...</p>
            </div>
          ) : images.length === 0 ? (
            <div className="text-center text-gray-400 py-12">
              <p>No images found in this category yet.</p>
              <p className="text-sm mt-2">Check back soon for new photos!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {images.map((image) => (
                <div
                  key={image.id}
                  onClick={() => setSelectedImage(image.url)}
                  className="group relative overflow-hidden rounded-lg aspect-square cursor-pointer"
                >
                  <img
                    src={image.url}
                    alt={image.originalName}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-6 left-6 right-6">
                      <span className="text-sm text-primary tracking-wider uppercase block mb-1">
                        {image.category}
                      </span>
                      <p className="text-white text-sm truncate">{image.originalName}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          onClick={() => setSelectedImage(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4"
        >
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 text-white hover:text-primary transition-colors z-10"
          >
            <X className="w-8 h-8" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              const currentIndex = images.findIndex(img => img.url === selectedImage);
              const prevIndex = currentIndex - 1;
              if (prevIndex >= 0) {
                setSelectedImage(images[prevIndex].url);
              }
            }}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-primary transition-colors"
          >
            <div className="bg-black/50 rounded-full p-2">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </div>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              const currentIndex = images.findIndex(img => img.url === selectedImage);
              const nextIndex = currentIndex + 1;
              if (nextIndex < images.length) {
                setSelectedImage(images[nextIndex].url);
              }
            }}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-primary transition-colors"
          >
            <div className="bg-black/50 rounded-full p-2">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>
          <img
            src={selectedImage}
            alt="Gallery image"
            className="max-w-full max-h-full object-contain"
          />
          <div className="absolute bottom-4 left-0 right-0 text-center text-white text-sm bg-black/50 py-2">
            Click anywhere to close • Use arrow keys to navigate
          </div>
        </div>
      )}
    </div>
  );
}