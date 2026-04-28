import { Camera, Aperture, Lightbulb, Award, Users, Heart, Clock, Star } from 'lucide-react';
import Navbar from '../../components/Navbar';

export default function About() {
  const features = [
    {
      icon: Camera,
      title: "Professional Equipment",
      description: "State-of-the-art cameras and lenses to capture every moment in stunning detail",
    },
    {
      icon: Aperture,
      title: "Perfect Composition",
      description: "Expert framing and composition techniques that bring your vision to life",
    },
    {
      icon: Lightbulb,
      title: "Creative Vision",
      description: "Unique artistic perspective that tells your story through imagery",
    },
    {
      icon: Award,
      title: "Award Winning",
      description: "Recognized excellence in portrait, event, and commercial photography",
    },
  ];

  const photographyTypes = [
    {
      icon: Users,
      title: "Portrait Photography",
      description: "Capturing personalities and emotions in natural, authentic moments",
    },
    {
      icon: Heart,
      title: "Wedding Photography",
      description: "Documenting your special day with creativity and emotion",
    },
    {
      icon: Clock,
      title: "Event Photography",
      description: "Professional coverage for corporate events, parties, and gatherings",
    },
    {
      icon: Star,
      title: "Commercial Photography",
      description: "High-quality images for brands, products, and marketing",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />
      <div className="pt-24 pb-12">
        {/* Hero Section */}
        <section className="px-4 mb-20">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-5xl md:text-6xl mb-6 text-white">About Our Photography</h1>
                <div className="w-24 h-1 bg-primary mb-6" />
                <p className="text-xl text-gray-300 mb-6 leading-relaxed">
                  We are passionate photographers dedicated to creating stunning visual
                  experiences that capture life's most precious moments. With years of experience
                  and an unwavering commitment to excellence, we transform ordinary scenes into
                  extraordinary works of art.
                </p>
                <p className="text-lg text-gray-400 leading-relaxed">
                  Our approach combines technical precision with creative storytelling, ensuring
                  that every photograph not only looks beautiful but also conveys the emotion,
                  atmosphere, and essence of the moment.
                </p>
              </div>
              <div className="relative">
                <div className="aspect-square rounded-lg overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1542038784456-1ea8e935640e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080"
                    alt="Professional photographer at work"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-primary/20 rounded-lg -z-10" />
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="px-4 py-20 bg-gradient-to-b from-gray-900 to-gray-800">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl mb-4 text-white">Why Choose Us</h2>
              <div className="w-24 h-1 bg-primary mx-auto" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={index}
                    className="text-center p-6 rounded-lg bg-gray-800 border border-primary/20 hover:border-primary/50 transition-colors"
                  >
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                      <Icon className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-xl mb-3 text-white">{feature.title}</h3>
                    <p className="text-gray-400">{feature.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Photography Types */}
        <section className="px-4 py-20">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl mb-4 text-white">What We Offer</h2>
              <div className="w-24 h-1 bg-primary mx-auto" />
              <p className="text-gray-300 mt-4 max-w-2xl mx-auto">
                From intimate portraits to large-scale events, we cover all aspects of professional photography
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {photographyTypes.map((type, index) => {
                const Icon = type.icon;
                return (
                  <div
                    key={index}
                    className="p-6 rounded-lg bg-gray-800/50 border border-gray-700 hover:border-primary/50 transition-colors"
                  >
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-xl mb-2 text-white">{type.title}</h3>
                    <p className="text-gray-400">{type.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="px-4 py-20 bg-gradient-to-b from-gray-800 to-gray-900">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-5xl text-primary mb-2">1000+</div>
                <div className="text-gray-400">Photo Shoots</div>
              </div>
              <div>
                <div className="text-5xl text-primary mb-2">500+</div>
                <div className="text-gray-400">Happy Clients</div>
              </div>
              <div>
                <div className="text-5xl text-primary mb-2">25+</div>
                <div className="text-gray-400">Awards Won</div>
              </div>
              <div>
                <div className="text-5xl text-primary mb-2">15+</div>
                <div className="text-gray-400">Years Experience</div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}