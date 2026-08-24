const API_KEY = "df9066be";
const BASE_URL = "https://www.omdbapi.com/";
 
async function searchMovies(query) {
  const url = `${BASE_URL}?apikey=${API_KEY}&s=${encodeURIComponent(query)}&type=`;
 
  try {
    const response = await fetch(url);
 
    if (!response.ok) {
      return { ok: false, error: "Falha na comunicação com o servidor." };
    }
 
    const data = await response.json();
 
    if (data.Response === "False") {
      return { ok: true, results: [], message: data.Error };
    }
 
    return { ok: true, results: data.Search };
  } catch (err) {
    return { ok: false, error: "Não foi possível conectar à API. Verifique sua conexão." };
  }
}
 
async function getMovieDetails(imdbID) {
  const url = `${BASE_URL}?apikey=${API_KEY}&i=${encodeURIComponent(imdbID)}&plot=full`;
 
  try {
    const response = await fetch(url);
 
    if (!response.ok) {
      return { ok: false, error: "Falha na comunicação com o servidor." };
    }
 
    const data = await response.json();
 
    if (data.Response === "False") {
      return { ok: false, error: data.Error || "Detalhes não encontrados." };
    }
 
    return { ok: true, movie: data };
  } catch (err) {
    return { ok: false, error: "Não foi possível conectar à API. Verifique sua conexão." };
  }
}