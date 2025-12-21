// src/utils/watchlater.js
export const getWatchLater = () => {
  const data = localStorage.getItem("watchLater");
  return data ? JSON.parse(data) : [];
};

export const addWatchLater = (movie) => {
  const current = getWatchLater();
  // Avoid duplicates
  if (!current.find((m) => m.id === movie.id)) {
    current.push(movie);
    localStorage.setItem("watchLater", JSON.stringify(current));
  }
};

export const removeWatchLater = (movieId) => {
  const current = getWatchLater();
  const updated = current.filter((m) => m.id !== movieId);
  localStorage.setItem("watchLater", JSON.stringify(updated));
};
