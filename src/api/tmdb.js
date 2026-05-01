const TMDB_KEY = process.env.EXPO_PUBLIC_TMDB_API_KEY;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";


export const searchMedia = async (query, type = "movie", page = 1) => {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/search/${type}?api_key=${TMDB_KEY}&query=${encodeURIComponent(query)}&language=pt-BR&page=${page}`,
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erro na busca:", error);
    return { results: [], total_pages: 0 };
  }
};


export const getDetails = async (id, type = "movie") => {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/${type}/${id}?api_key=${TMDB_KEY}&language=pt-BR`,
    );
    return await response.json();
  } catch (error) {
    console.error("Erro ao buscar detalhes:", error);
    return null;
  }
};


export const getPopular = async (type = "movie") => {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/${type}/popular?api_key=${TMDB_KEY}&language=pt-BR&page=1`,
    );
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error("Erro ao buscar populares:", error);
    return [];
  }
};

export const getTopRated = async (type = "movie") => {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/${type}/top_rated?api_key=${TMDB_KEY}&language=pt-BR&page=1`,
    );
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error("Erro ao buscar top rated:", error);
    return [];
  }
};

export const getUpcoming = async () => {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/movie/upcoming?api_key=${TMDB_KEY}&language=pt-BR&page=1`,
    );
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error("Erro ao buscar novidades:", error);
    return [];
  }
};


export const getSeasonEpisodes = async (tvId, seasonNumber) => {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/tv/${tvId}/season/${seasonNumber}?api_key=${TMDB_KEY}&language=pt-BR`,
    );
    const data = await response.json();
    return data.episodes || [];
  } catch (error) {
    console.error("Erro ao buscar episódios da temporada:", error);
    return [];
  }
};
