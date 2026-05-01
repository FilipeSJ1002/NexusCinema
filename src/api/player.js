

const FEMBED_BASE_URL = "https://fembed.sx/e";

export const getMoviePlayerUrl = (id) => {
  
  return `${FEMBED_BASE_URL}/${id}`;
};

export const getTvPlayerUrl = (id, season, episode) => {
  
  return `${FEMBED_BASE_URL}/${id}/${season}-${episode}`;
};
