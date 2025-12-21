import { motion } from "framer-motion";
import image7 from "../assets/image 7.png";
import image8 from "../assets/image 8.png";

export default function ShowcaseSection() {
  return (
    <section className="relative w-full bg-black text-white overflow-hidden min-h-screen py-8 sm:py-10 md:py-12">
      {/* Title */}
      <motion.h2
        initial={{ opacity: 0, y: -50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.5 }}
        className="text-center text-lg sm:text-xl md:text-2xl lg:text-3xl tracking-widest mb-6 sm:mb-8 md:mb-10 lg:mb-12 px-4"
        style={{ fontFamily: "AZONIX" }}
      >
        YOUR MOVIE JOURNEY, SIMPLIFIED.
      </motion.h2>

      {/* Image Showcase Container */}
      {/* Desktop Image */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1.5 }}
        viewport={{ once: true, amount: 0.4 }}
        className="relative w-full h-[70vh] sm:h-[75vh] md:h-[80vh] lg:h-[calc(100vh-140px)] flex items-center justify-center px-4 sm:px-6 md:px-8"
      >
        {/* Desktop Image */}
        <div className="hidden md:flex items-center justify-center w-full h-full overflow-hidden rounded-2xl">
          <div className="transition-all ease-in-out duration-700 hover:shadow-[0_0_20px_2px_rgba(155,155,155,0.8)] rounded-2xl">
            <img
              src={image7}
              alt="Movie showcase desktop"
              className="w-full h-full object-contain rounded-2xl"
            />
          </div>
        </div>

        {/* Mobile Image */}
        <div className=" md:hidden w-full h-full flex items-center justify-center overflow-hidden rounded-2xl">
          <div className="transition-all ease-in-out duration-700 hover:shadow-[0_0_20px_1px_rgba(155,155,155,0.8)] rounded-2xl">
            <img
              src={image8}
              alt="Movie showcase mobile"
              className="w-full h-full object-contain rounded-2xl"
            />
          </div>
        </div>
      </motion.div>
    </section>
  );
}
