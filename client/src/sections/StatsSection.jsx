import React, { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

const StatCard = ({ label, value, delay }) => {
  const [count, setCount] = useState(0);
  const [displayValue, setDisplayValue] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (inView) {
      let start = 0;
      const duration = 2000;
      const increment = value / (duration / 20);

      const counter = setInterval(() => {
        start += increment;
        if (start >= value) {
          start = value;
          clearInterval(counter);
          startRandomBoosts();
        }
        setCount(Math.floor(start));
        setDisplayValue(Math.floor(start));
      }, 20);

      const startRandomBoosts = () => {
        const boostInterval = () => {
          const boost = Math.floor(Math.random() * 21) + 40;
          setDisplayValue((prev) => prev + boost);
          const nextBoostTime = Math.floor(Math.random() * 10000) + 10000;
          setTimeout(boostInterval, nextBoostTime);
        };
        setTimeout(boostInterval, Math.random() * 5000 + 3000);
      };
    }
  }, [inView, value]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay }}
      whileHover={{ scale: 1.05 }}
      className="bg-[#1E3A46]/20 backdrop-blur-sm rounded-2xl shadow-lg text-center p-6 flex flex-col justify-center items-center"
    >
      <motion.span
        className="text-[34px] sm:text-[42px] md:text-[52px] font-semibold"
        style={{
          fontFamily: "Poppins, sans-serif",
          textShadow: "0 0 14px rgba(255,255,255,0.25)",
        }}
        key={displayValue}
      >
        {displayValue >= 1000000
          ? (displayValue / 1000000).toFixed(1) + "M"
          : displayValue >= 1000
          ? Math.floor(displayValue / 1000) + "K"
          : displayValue}
      </motion.span>
      <span
        className="text-[14px] sm:text-[15px] md:text-[16px] text-gray-300 mt-1 tracking-wide"
        style={{ fontFamily: "Poppins, sans-serif" }}
      >
        {label}
      </span>
    </motion.div>
  );
};

export default function AnimatedStatsSection() {
  const stats = [
    { label: "Current Users", value: 2300000 },
    { label: "Online Users", value: 47000 },
    { label: "Pro Users", value: 836000 },
    { label: "New Users", value: 358000 },
  ];

  return (
    <div className="w-full bg-black">
      <motion.section className="w-full text-white py-20 flex flex-col items-center overflow-hidden">
        {/* Heading */}
        <div className="text-center mb-12">
          <h2
            className="text-[26px] sm:text-[32px] md:text-[36px] leading-none tracking-widest"
            style={{ fontFamily: "AZONIX" }}
          >
            JOIN NOW
          </h2>
          <h3
            className="text-[18px] sm:text-[22px] md:text-[24px] tracking-[0.15em] mt-1 text-gray-200"
            style={{ fontFamily: "AZONIX" }}
          >
            GET STARTED
          </h3>
        </div>

        {/* Stats Grid */}
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <StatCard
              key={i}
              label={stat.label}
              value={stat.value}
              delay={i * 0.2}
            />
          ))}
        </div>
      </motion.section>
    </div>
  );
}
