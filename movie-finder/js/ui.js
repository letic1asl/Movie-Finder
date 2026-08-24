const FALLBACK_POSTER =
  "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='445'%3E%3Crect width='100%25' height='100%25' fill='%2322263a'/%3E%3Ctext x='50%25' y='50%25' fill='%239296a6' font-family='sans-serif' font-size='18' text-anchor='middle' dy='.3em'%3ESem pôster%3C/text%3E%3C/svg%3E";
 
function showState(type) {
  const states = {
    loading: document.getElementById("loadingState"),
    error: document.getElementById("errorState"),
    empty: document.getElementById("emptyState"),
  };
 
  Object.values(states).forEach((el) => el && el.classList.add("hidden"));
 
  if (states[type]) {
    states[type].classList.remove("hidden");
  }
 
  const grid = document.getElementById("resultsGrid");
  const resultsTitle = document.getElementById("resultsTitle");
  const trending = document.getElementById("trendingSection");
 
  if (type === "success") {
    grid.classList.remove("hidden");
    resultsTitle.classList.remove("hidden");
    trending.classList.add("hidden");
  } else {
    grid.classList.add("hidden");
    grid.innerHTML = "";
    resultsTitle.classList.add("hidden");
    trending.classList.remove("hidden");
  }
}
 
function setErrorMessage(message) {
  document.getElementById("errorMessage").textContent = message;
}
 
function ratingBadgeHTML(rating) {
  if (rating === undefined || rating === null || rating === "N/A") {
    return `<span class="rating-badge na">N/A</span>`;
  }
  const score = Math.round(parseFloat(rating) * 10);
  const cls = score < 50 ? "low" : "";
  return `<span class="rating-badge ${cls}">${score}%</span>`;
}
 
function createMovieCard(movie) {
  const card = document.createElement("div");
  card.className = "movie-card";
  card.dataset.id = movie.imdbID;
 
  const poster =
    movie.Poster && movie.Poster !== "N/A" ? movie.Poster : FALLBACK_POSTER;
 
  const favActive = isFavorite(movie.imdbID) ? "active" : "";
  const favIcon = isFavorite(movie.imdbID) ? "♥" : "♡";
 
  card.innerHTML = `
    <div class="poster-wrap">
      <button class="fav-btn ${favActive}" data-fav-id="${movie.imdbID}" aria-label="Favoritar">${favIcon}</button>
      <img class="movie-poster" src="${poster}" alt="Pôster de ${movie.Title}" loading="lazy" />
      ${ratingBadgeHTML(movie.imdbRating)}
    </div>
    <div class="movie-info">
      <div class="movie-title">${movie.Title}</div>
      <div class="movie-meta">
        <span>${movie.Year || "-"}</span>
        <span>${movie.Type ? capitalize(movie.Type) : ""}</span>
      </div>
    </div>
  `;
 
  return card;
}
 
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
 
function renderMovieGrid(movies) {
  const grid = document.getElementById("resultsGrid");
  grid.innerHTML = "";
 
  movies.forEach((movie) => {
    grid.appendChild(createMovieCard(movie));
  });
}

function renderFavorites() {
  const favorites = getFavorites();
  const grid = document.getElementById("favoritesGrid");
  const emptyState = document.getElementById("favoritesEmpty");
 
  grid.innerHTML = "";
 
  if (favorites.length === 0) {
    emptyState.classList.remove("hidden");
    grid.classList.add("hidden");
  } else {
    emptyState.classList.add("hidden");
    grid.classList.remove("hidden");
 
    favorites.forEach((fav) => {
      const pseudoMovie = {
        imdbID: fav.id,
        Title: fav.title,
        Poster: fav.poster,
        Year: fav.year,
        Type: fav.type,
      };
      grid.appendChild(createMovieCard(pseudoMovie));
    });
  }
 
  updateFavCount();
}
 
function updateFavCount() {
  document.getElementById("favCount").textContent = getFavorites().length;
}
 
function openModalLoading() {
  document.getElementById("movieModal").classList.remove("hidden");
  document.getElementById("modalLoading").classList.remove("hidden");
  document.getElementById("modalContent").classList.add("hidden");
}
 
function renderModal(movie) {
  const modalContent = document.getElementById("modalContent");
  const poster =
    movie.Poster && movie.Poster !== "N/A" ? movie.Poster : FALLBACK_POSTER;
 
  const favActive = isFavorite(movie.imdbID);
 
  modalContent.innerHTML = `
    <img class="modal-poster" src="${poster}" alt="Pôster de ${movie.Title}" />
    <div class="modal-details">
      <h2>${movie.Title}</h2>
      <p class="modal-sub">${movie.Year} · ${movie.Runtime || "-"} · ${movie.Genre || "-"}</p>
      <div class="modal-rating">⭐ ${movie.imdbRating || "N/A"} / 10</div>
      <p class="modal-plot">${movie.Plot && movie.Plot !== "N/A" ? movie.Plot : "Sinopse não disponível."}</p>
      <div class="modal-grid">
        <div><strong>Elenco</strong>${movie.Actors || "-"}</div>
        <div><strong>Diretor</strong>${movie.Director || "-"}</div>
        <div><strong>Gênero</strong>${movie.Genre || "-"}</div>
        <div><strong>Duração</strong>${movie.Runtime || "-"}</div>
        <div><strong>Idioma</strong>${movie.Language || "-"}</div>
        <div><strong>País</strong>${movie.Country || "-"}</div>
      </div>
      <button class="modal-fav-btn ${favActive ? "active" : ""}" id="modalFavBtn">
        ${favActive ? "♥ Remover dos favoritos" : "♡ Adicionar aos favoritos"}
      </button>
    </div>
  `;
 
  document.getElementById("modalLoading").classList.add("hidden");
  modalContent.classList.remove("hidden");
 
  document.getElementById("modalFavBtn").addEventListener("click", () => {
    const nowFav = toggleFavorite({
      id: movie.imdbID,
      title: movie.Title,
      poster: poster,
      year: movie.Year,
      type: movie.Type,
    });
 
    const btn = document.getElementById("modalFavBtn");
    btn.classList.toggle("active", nowFav);
    btn.textContent = nowFav ? "♥ Remover dos favoritos" : "♡ Adicionar aos favoritos";
 
    syncFavButtonsOnPage(movie.imdbID, nowFav);
    renderFavorites();
  });
}
 
function closeModal() {
  document.getElementById("movieModal").classList.add("hidden");
}
 
function syncFavButtonsOnPage(id, isFav) {
  document.querySelectorAll(`.fav-btn[data-fav-id="${id}"]`).forEach((btn) => {
    btn.classList.toggle("active", isFav);
    btn.textContent = isFav ? "♥" : "♡";
  });
}
 
function renderTrendingRow(movies) {
  const row = document.getElementById("trendingRow");
  const loading = document.getElementById("trendingLoading");
  row.innerHTML = "";
 
  movies.forEach((movie) => {
    const pseudoMovie = {
      imdbID: movie.imdbID,
      Title: movie.Title,
      Poster: movie.Poster,
      Year: movie.Year,
      Type: movie.Type,
      imdbRating: movie.imdbRating,
    };
    row.appendChild(createMovieCard(pseudoMovie));
  });
 
  loading.classList.add("hidden");
  row.classList.remove("hidden");
}
 
function switchTab(tabName) {
  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.tab === tabName);
  });
 
  document.querySelectorAll(".tab-panel").forEach((panel) => {
    panel.classList.remove("active");
  });
 
  document.getElementById(`${tabName}Tab`).classList.add("active");
 
  if (tabName === "favorites") {
    renderFavorites();
  }
}
 
