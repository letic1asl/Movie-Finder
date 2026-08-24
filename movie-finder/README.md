                                            CINEON: Movie Finder.
                Busca de filmes e séries usando a OMDb API, feito em HTML, CSS e JS Vanilla.

## O que faz?
-   Busca filmes/séries por título;
-   Grid de resultados com pôster, título, ano e tipo;
-   Modal com detalhes: sinopse, gênero, duração, nota IMDb, elenco, diretor;
-   Favoritar/desfavoritar (fica salvo no localStorage, sobrevive ao recarregar a página);
-   Estados de loading, erro, sem resultados e sucesso;
-   Responsivo

## Estrutura.
movie-finder/
├── index.html
├── css/
│   └── style.css
├── js/
│   ├── app.js       #orquestra os eventos;
│   ├── api.js        #chamadas à omdb api;
│   ├── storage.js    #localStorage dos favoritos;
│   └── ui.js          #renderização (cards, grid, modal, estados).
└── README.md

-   Chave da API é particular, solicitada pelo site próprio da OMDB.
const API_KEY = "df9066be";

Chave movieFavorites guarda um array de {id, título, pôster, ano}, atualizado sempre que favorita/desfavorita algo.

Em js/storage.js:

getFavorites() — pega os favoritos salvos
saveFavorites(favorites) — persiste o array
toggleFavorite(movie) — adiciona ou remove
isFavorite(id) — checa se já tá favoritado

## Funções principais
searchMovies(query) (api.js) — busca na OMDb
getMovieDetails(id) (api.js) — detalhes completos por imdbID
renderMovieGrid(movies) (ui.js) — monta os cards
openModal(movieId) (app.js) — abre modal com detalhes
closeModal() (ui.js)
showState(type) (ui.js) — alterna loading/erro/vazio/sucesso
renderFavorites() (ui.js)

HTML5, CSS3 (Grid + Flexbox), JS Vanilla (ES6+), Fetch API, localStorage, OMDb API.

Pôsteres indisponíveis ("N/A") viram um placeholder local, pra não depender de imagens externas.