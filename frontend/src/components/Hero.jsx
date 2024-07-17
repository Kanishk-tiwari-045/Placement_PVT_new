import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import '../styles/Hero.css';
import image1 from '../assets/image1.png';
import image2 from '../assets/image2.png';
import image3 from '../assets/image3.png';
import image4 from '../assets/image4.png';

const Hero = () => {
  const [bubbles, setBubbles] = useState([]);
  const rowWidth = window.innerWidth;
  const text = "Welcome to My Website".split(" ");
  const [displayText, setDisplayText] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newBubble = {
        id: Date.now(),
        x: Math.random() * rowWidth,
        y: window.innerHeight,
        startX: Math.random() * rowWidth,
        startY: window.innerHeight + 50,
        type: 'big',
      };

      setBubbles((prevBubbles) => [...prevBubbles, newBubble]);
    }, 250); // Adjust the interval time as needed

    return () => clearInterval(interval);
  }, [rowWidth]);

  useEffect(() => {
    let index = 0;
    const textInterval = setInterval(() => {
      if (index < text.length) {
        setDisplayText((prevText) => [...prevText, text[index]]);
        index++;
      } else {
        clearInterval(textInterval);
      }
    }, 500); // Adjust the interval time as needed

    return () => clearInterval(textInterval);
  }, [text]);

  const handleMouseMove = (e) => {
    const mouseX = e.clientX;
    const mouseY = e.clientY;

    setBubbles((prevBubbles) =>
      prevBubbles.map((bubble) => ({
        ...bubble,
        x: bubble.startX + (mouseX - rowWidth / 2) * 0.2,
        y: bubble.startY + (mouseY - window.innerHeight / 2) * 0.2,
      }))
    );
  };

  return (
    <div className="hero-container" onMouseMove={handleMouseMove}>
      <div className="bubbles">
        {bubbles.map((bubble) => (
          <motion.div
            key={bubble.id}
            className={`bubble ${bubble.type}`}
            style={{ left: bubble.x, top: bubble.y }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 0.5 }}
          />
        ))}
      </div>
      <motion.div
        className="image-container"
        initial={{ x: -200, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.2 }} // Delay the animation
      >
        <motion.img src={image1} alt="Image 1" className="hero-image" />
        <motion.img src={image2} alt="Image 2" className="hero-image" />
        <motion.img src={image3} alt="Image 3" className="hero-image" />
        <motion.img src={image4} alt="Image 4" className="hero-image" />
      </motion.div>
      <motion.div
        className="text-container"
        initial={{ x: -200, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.7 }} // Delay the animation further
      >
        <motion.h1 className="hero-title">Welcome to My Website</motion.h1>
        <motion.p className="hero-subtitle">Engage with various good mindsets</motion.p>
        <button class="btn-36">
          <span class="new">Signup</span>
          <div class="old">
            <span>Get-started</span>
            <span aria-hidden>Get-started</span>
          </div>
        </button>
      </motion.div>
    </div>
  );
};

export default Hero;
