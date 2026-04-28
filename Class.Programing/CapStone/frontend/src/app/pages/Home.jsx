import { Link } from 'react-router-dom';
import { ArrowRight, Camera } from 'lucide-react';
import Navbar from '../../components/Navbar';

export default function Home() {
  const featuredImages = [
    {
      url: "https://images.unsplash.com/photo-1755811248279-1ab13b7d4384?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
      title: "Gourmet Plating",
    },
    {
      url: "https://images.unsplash.com/photo-1541963020-4f9732b3ee29?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
      title: "Fine Dining",
    },
    {
      url: "https://images.unsplash.com/photo-1541167760496-1628856ab772?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
      title: "Coffee Art",
    },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/50 to-black z-10" />
        <img
          src="https://images.unsplash.com/photo-1768326119181-5f3cfe0adb4c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080"
          alt="Hero dessert"
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />

        <div className="relative z-20 text-center px-4 max-w-4xl">
          <div className="flex justify-center mb-6">
            <Camera className="w-16 h-16 text-primary" />
          </div>
          <h1 className="text-5xl md:text-7xl mb-6 tracking-tight">
            Capturing Photography <span className="text-primary">Excellence</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Professional photography that tells your story.
          </p>
          <Link
            to="/gallery"
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-lg transition-all hover:gap-4"
          >
            View Gallery
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Featured Work */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl mb-4">Featured Work</h2>
          <div className="w-24 h-1 bg-primary mx-auto" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredImages.map((image, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-lg aspect-square cursor-pointer"
            >
              <img
                src={image.url}
                alt={image.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-6 left-6">
                  <h3 className="text-2xl text-white">{image.title}</h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* About Preview */}
      <section className="py-20 px-4 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl mb-6">Elevating Food Through Photography</h2>
          <p className="text-xl text-gray-300 mb-8 leading-relaxed">
            We specialize in creating stunning visual narratives that showcase the beauty,
            texture, and essence of culinary creations. Every dish tells a story, and we're
            here to capture it in its finest form.
          </p>
          <Link
            to="/about"
            className="inline-flex items-center gap-2 border border-primary text-primary hover:bg-primary hover:text-white px-8 py-4 rounded-lg transition-all"
          >
            Learn More About Us
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}