import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "./Slider.css";

const TestimonialSlider = () => {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/movie/popular?api_key=${
            import.meta.env.VITE_TMDB_KEY
          }&language=en-US&page=1`
        );
        const data = await res.json();
        setMovies(data.results.slice(0, 20)); // limit to 9 movies
      } catch (err) {
        console.error("Error fetching movies:", err);
      }
    };

    fetchMovies();
  }, []);

  return (
    <section className="testimonial">
      <Swiper
        modules={[EffectCoverflow, Autoplay]}
        loop={true}
        slidesPerView="auto"
        centeredSlides={true}
        spaceBetween={16}
        grabCursor={true}
        speed={600}
        effect="coverflow"
        coverflowEffect={{
          rotate: -90,
          depth: 600,
          modifier: 0.5,
          slideShadows: false,
        }}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        className="testimonial__swiper container"
      >
        {movies.map((movie, index) => (
          <SwiperSlide
            key={index}
            className="testimonial__card group"
            style={{
              backgroundImage: `url(https://image.tmdb.org/t/p/w500${movie.poster_path})`,
              width: "290px",
              height: "449px",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-4">
              <h3 className="testimonial__name text-white mb-2">
                {movie.title}
              </h3>
              <div className="testimonial__rating">
                <div className="testimonial__stars">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <i
                      key={i}
                      className={`ri-star-fill ${
                        i < Math.round(movie.vote_average / 2)
                          ? "text-yellow-400"
                          : "text-gray-500"
                      }`}
                    ></i>
                  ))}
                </div>
                <h3 className="testimonial__number">
                  {movie.vote_average.toFixed(1)}
                </h3>
              </div>
              <p className="testimonial__description text-center text-sm mt-2">
                {movie.overview.length > 100
                  ? movie.overview.slice(0, 100) + "..."
                  : movie.overview}
              </p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default TestimonialSlider;
