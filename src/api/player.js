// src/api/player.js

const FEMBED_BASE_URL = "https://fembed.sx/e";

export const getMoviePlayerUrl = (id) => {
  // Rota de Embed Único para Filmes
  return `${FEMBED_BASE_URL}/${id}`;
};

export const getTvPlayerUrl = (id, season, episode) => {
  // Rota de Embed Único para Séries
  return `${FEMBED_BASE_URL}/${id}/${season}-${episode}`;
};
