import React, { useState } from 'react';
import Navbar from './Navbar';
import Hero from './Hero';
import Features from './Features';

const Home = () => {
  const [activeTab, setActiveTab] = useState("Home");

  return (
    <div className="home-page">
      {/* Navbar Component */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
      />

      <main>
        {/* Hero Section */}
        <section id="home" className="section">
          <Hero />
        </section>

        {/* Features Section */}
        <section className="section">
          <Features />
        </section>
      </main>
    </div>
  );
};

export default Home;
