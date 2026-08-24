document.addEventListener("DOMContentLoaded", () => {
  const searchForm = document.getElementById("searchForm");
  const searchInput = document.getElementById("searchInput");
  const resultsGrid = document.getElementById("resultsGrid");
  const favoritesGrid = document.getElementById("favoritesGrid");
  const trendingRow = document.getElementById("trendingRow");
  const modal = document.getElementById("movieModal");
  const closeModalBtn = document.getElementById("closeModalBtn");
 
  updateFavCount();
 
  searchForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const query = searchInput.value.trim();
 
    if (!query) {
      searchInput.focus();
      return;
    }
 
    await handleSearch(query);
  });
 
  async function handleSearch(query) {
    showState("loading");
 
    const response = await searchMovies(query);
 
    if (!response.ok) {
      setErrorMessage(response.error);
      showState("error");
      return;
    }
 
    if (!response.results || response.results.length === 0) {
      showState("empty");
      return;
    }
 
    renderMovieGrid(response.results);
    showState("success");
  }
 
  resultsGrid.addEventListener("click", (e) => handleGridClick(e));
  favoritesGrid.addEventListener("click", (e) => handleGridClick(e));
  trendingRow.addEventListener("click", (e) => handleGridClick(e));
 
  function handleGridClick(e) {
    const favBtn = e.target.closest(".fav-btn");
    const card = e.target.closest(".movie-card");
 
    if (favBtn) {
      e.stopPropagation();
      handleToggleFavoriteFromCard(favBtn);
      return;
    }
 
    if (card) {
      openModal(card.dataset.id);
    }
  }
 
  function handleToggleFavoriteFromCard(favBtn) {
    const id = favBtn.dataset.favId;
    const card = favBtn.closest(".movie-card");
    const title = card.querySelector(".movie-title").textContent;
    const poster = card.querySelector(".movie-poster").src;
    const year = card.querySelector(".movie-meta span").textContent;
 
    const nowFav = toggleFavorite({ id, title, poster, year });
 
    syncFavButtonsOnPage(id, nowFav);
    renderFavorites();
 
    if (!nowFav && document.getElementById("favoritesTab").classList.contains("active")) {
      renderFavorites();
    }
  }
 
  async function openModal(movieId) {
    openModalLoading();
    const response = await getMovieDetails(movieId);
 
    if (!response.ok) {
      document.getElementById("modalLoading").classList.add("hidden");
      document.getElementById("modalContent").classList.remove("hidden");
      document.getElementById("modalContent").innerHTML = `
        <p style="padding:20px;">⚠️ ${response.error}</p>
      `;
      return;
    }
 
    renderModal(response.movie);
  }
 
  window.openModal = openModal;
 
  closeModalBtn.addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });
 
  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.addEventListener("click", () => switchTab(btn.dataset.tab));
  });
 
  renderFavorites();
 
  const POPULAR_IDS = [
    "tt15398776", /* oppenheimer */
    "tt1517268", /* barbieee */
    "tt6710474", /* everything everywhere all at once */
    "tt9362722", /* miles morales*/
    "tt1745960", /* top gun maverick */
    "tt10366206", /* wick wick 4 */
    "tt5433140", /*velozes e furiosos 10*/
    "tt1630029", /* avatarrr (2022) */
    "tt9218128", /*gladiador 2*/
    "tt13238346", /*vidas passadas*/
  ];
 
  loadTrending();
 
  async function loadTrending() {
    const requests = POPULAR_IDS.map((id) => getMovieDetails(id));
    const responses = await Promise.all(requests);
    const movies = responses.filter((r) => r.ok).map((r) => r.movie);
 
    if (movies.length > 0) {
      renderTrendingRow(movies);
    } else {
      document.getElementById("trendingSection").classList.add("hidden");
    }
  }
});