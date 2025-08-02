import React from 'react';
import { 
  MapPin, 
  Users, 
  Award, 
  Globe,
  Heart,
  Shield,
  Star,
  Compass
} from 'lucide-react';

const AboutUs = () => {
  const stats = [
    { icon: Users, label: 'Happy Travelers', value: '50,000+' },
    { icon: MapPin, label: 'Destinations', value: '200+' },
    { icon: Award, label: 'Awards Won', value: '25+' },
    { icon: Globe, label: 'Countries', value: '75+' }
  ];

  const values = [
    {
      icon: Heart,
      title: 'Passion for Travel',
      description: 'We believe travel enriches lives and creates lasting memories that connect people across cultures.'
    },
    {
      icon: Shield,
      title: 'Safety First',
      description: 'Your safety and security are our top priorities. We ensure all our tours meet the highest safety standards.'
    },
    {
      icon: Star,
      title: 'Excellence',
      description: 'We strive for excellence in every aspect of our service, from planning to execution.'
    },
    {
      icon: Compass,
      title: 'Expert Guidance',
      description: 'Our experienced guides and travel experts ensure you get the most authentic and enriching experiences.'
    }
  ];

  const team = [
    {
      name: 'Sarah Johnson',
      role: 'Founder & CEO',
      image: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=300',
      bio: 'With over 15 years in the travel industry, Sarah founded Tours & Travels to make extraordinary travel accessible to everyone.'
    },
    {
      name: 'Michael Chen',
      role: 'Head of Operations',
      image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=300',
      bio: 'Michael ensures every tour runs smoothly with his expertise in logistics and customer service excellence.'
    },
    {
      name: 'Emily Rodriguez',
      role: 'Travel Experience Designer',
      image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=300',
      bio: 'Emily crafts unique and immersive travel experiences that showcase the best of each destination.'
    }
  ];

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">About Tours & Travels</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          We're passionate about creating unforgettable travel experiences that connect you with the world's most beautiful destinations and diverse cultures.
        </p>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="text-center">
              <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon className="w-8 h-8 text-emerald-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          );
        })}
      </div>

      {/* Story Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
            <div className="space-y-4 text-gray-600">
              <p>
                Founded in 2020, Tours & Travels began with a simple mission: to make extraordinary travel experiences accessible to everyone. What started as a small team of travel enthusiasts has grown into a trusted platform serving thousands of travelers worldwide.
              </p>
              <p>
                We believe that travel has the power to transform lives, broaden perspectives, and create connections that transcend borders. Every tour we offer is carefully crafted to provide authentic, immersive experiences that showcase the beauty and diversity of our world.
              </p>
              <p>
                From pristine beaches to majestic mountains, from bustling cities to serene countryside, we're here to help you discover the world's hidden gems and create memories that will last a lifetime.
              </p>
            </div>
          </div>
          <div className="relative">
            <img
              src="https://images.pexels.com/photos/1271619/pexels-photo-1271619.jpeg?auto=compress&cs=tinysrgb&w=600"
              alt="Travel team"
              className="rounded-lg shadow-lg"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg"></div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Our Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value, index) => {
            const Icon = value.icon;
            return (
              <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
                <div className="bg-emerald-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{value.title}</h3>
                <p className="text-gray-600 text-sm">{value.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Team Section */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Meet Our Team</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {team.map((member, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <img
                src={member.image}
                alt={member.name}
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-1">{member.name}</h3>
                <p className="text-emerald-600 font-medium mb-3">{member.role}</p>
                <p className="text-gray-600 text-sm">{member.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mission Section */}
      <div className="bg-gradient-to-r from-emerald-600 to-blue-600 rounded-xl p-8 text-white text-center">
        <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
        <p className="text-xl mb-6 max-w-3xl mx-auto">
          To inspire and enable people to explore the world through carefully curated travel experiences that are safe, sustainable, and transformative.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div>
            <h3 className="text-lg font-semibold mb-2">Sustainable Tourism</h3>
            <p className="text-emerald-100">We're committed to responsible travel that benefits local communities and preserves natural environments.</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Cultural Exchange</h3>
            <p className="text-emerald-100">We facilitate meaningful connections between travelers and local cultures, fostering mutual understanding.</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Exceptional Service</h3>
            <p className="text-emerald-100">We provide personalized service and support to ensure every journey exceeds expectations.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;