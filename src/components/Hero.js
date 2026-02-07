import React from 'react';

const Hero = () => {
  return (
    <section id="home" className="hero">
      <div className="hero-container">
        <div className="hero-content">
          <h1 className="hero-title">
            Dominic <span>Amuah</span>
          </h1>
          <p className="hero-subtitle">I'm a Backend Dev (FullStack)</p>
          <p className="hero-description">
            Building secure, scalable applications with expertise in Django, Springboot, and modern backend technologies.
          </p>
        </div>
        <div className="hero-image-wrapper">
          <div className="hero-image-frame">
            <img src="/my-photo.jpg" alt="Dominic Amuah" className="hero-image" />
          </div>
        </div>
      </div>

      <div className="scroll-indicator" aria-hidden="true">
        <div className="scroll-mouse">
          <div className="scroll-wheel" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
