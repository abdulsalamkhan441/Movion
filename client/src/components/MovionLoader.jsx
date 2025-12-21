import { motion } from "framer-motion";

const letters = ["M", "O", "V", "I", "O", "N"];

export default function MovionLoader() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black">
      <motion.div
        initial="hidden"
        animate="visible"
        className="flex gap-2"
        style={{ fontFamily: "Azonix" }}
      >
        {letters.map((letter, index) => (
          <motion.span
            key={index}
            variants={{
              hidden: {
                opacity: 0,
                y: 40,
                filter: "blur(10px)",
              },
              visible: {
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
              },
            }}
            transition={{
              delay: index * 0.15,
              duration: 0.8,
              ease: "easeOut",
            }}
            className="
              text-white
              text-[3rem]
              md:text-[4rem]
              tracking-[0.4em]
              relative
            "
          >
            {letter}

            {/* Glow */}
            <span
              className="
                absolute inset-0
                text-white
                blur-xl
                opacity-30
                animate-pulse
              "
            >
              {letter}
            </span>
          </motion.span>
        ))}
      </motion.div>
    </div>
  );
}
