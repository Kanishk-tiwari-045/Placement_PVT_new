import React, { useState, useEffect } from 'react';
import '../styles/Features.css'; // Styling for the component
import image1 from '../assets/image1.png';
import image2 from '../assets/image2.png';
import image3 from '../assets/image3.png';
import image4 from '../assets/image4.png';
import image5 from '../assets/image5.png';
import { motion } from 'framer-motion'; // For animations

const Features = () => {
  const [bubbles, setBubbles] = useState([]);
  const rowWidth = window.innerWidth;

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

  const features = [
    {
      title: 'Easy Registration',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.',
      imageUrl: image1,
    },
    {
        title: 'Worth-it Opportunities',
        description:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.',
        imageUrl: image5,
      },
    {
      title: 'Regular Notifications',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.',
      imageUrl: image2,
    },
    {
      title: 'Deals Precisely',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.',
      imageUrl: image3,
    },
    {
        title: 'Guranteed Accomplishment',
        description:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.',
        imageUrl: image4,
      }
  ];

  return (
    <div className="features-container" onMouseMove={handleMouseMove}>
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
      {features.map((feature, index) => (
        <motion.div
          key={index}
          className="feature-card"
          whileHover={{ scale: 1.2 }}
          transition={{ duration: 0.3 }}
        >
          <div className="card-front">
            <img src={feature.imageUrl} alt={feature.title} />
            <h3>{feature.title}</h3>
          </div>
          <div className="card-back">
            <p>{feature.description}</p>
            <button class="btn-5"><span>Read More</span></button>
          </div>
          
        </motion.div>
      ))}
    </div>
  );
};

export default Features;
