const FAVORITES_KEY = "movieFavorites";
 
function getFavorites() {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error("Erro ao ler favoritos do LocalStorage:", err);
    return [];
  }
}
 
function saveFavorites(favorites) {
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  } catch (err) {
    console.error("Erro ao salvar favoritos no LocalStorage:", err);
  }
}
 
function isFavorite(id) {
  return getFavorites().some((movie) => movie.id === id);
}
 
function toggleFavorite(movie) {
  const favorites = getFavorites();
  const index = favorites.findIndex((m) => m.id === movie.id);
 
  if (index >= 0) {
    favorites.splice(index, 1);
    saveFavorites(favorites);
    return false;
  }
 
  favorites.push(movie);
  saveFavorites(favorites);
  return true;
}