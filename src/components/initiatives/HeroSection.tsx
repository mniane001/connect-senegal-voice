
import React from 'react';

const HeroSection = () => {
  return (
    <div 
      className="relative bg-cover bg-center py-24 md:py-32" 
      style={{
        backgroundImage: `linear-gradient(rgba(0, 51, 102, 0.7), rgba(0, 51, 102, 0.7)), url("https://images.unsplash.com/photo-1575517111839-3a3843ee7f5d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80")`
      }}
    >
      <div className="container-custom text-center text-white">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
          Initiatives Parlementaires
        </h1>
        <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8">
          Découvrez mes activités et contributions à l'Assemblée nationale
        </p>
      </div>
      <div className="absolute bottom-0 left-0 right-0">
        <div className="flex h-3">
          <div className="w-1/3 bg-senegal-green"></div>
          <div className="w-1/3 bg-senegal-yellow"></div>
          <div className="w-1/3 bg-senegal-red"></div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
