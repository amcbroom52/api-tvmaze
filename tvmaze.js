"use strict";

const $showsList = $("#showsList");
const $episodesArea = $("#episodesArea");
const $searchForm = $("#searchForm");
const API_URL = "https://api.tvmaze.com";
const NULL_IMAGE_URL = "https://tinyurl.com/tv-missing";


/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */

async function getShowsByTerm(term) {
  // ADD: Remove placeholder & make request to TVMaze search shows API.
  const params = new URLSearchParams({ q: term });
  const response = await fetch(`${API_URL}/search/shows?${params}`);
  const showsData = await response.json();
  const showsList = showsData.map(filterShowData);

  return showsList;
}


/**takes a showData object and scrubs the data to return an object with
 * only {id, name, summary, image} */
function filterShowData(showData) {
  const info = showData.show;

  const specificData = {
    id: info.id,
    name: info.name,
    summary: info.summary,
  };

  specificData.image = (info.image) ? info.image.medium : NULL_IMAGE_URL;

  return specificData;
}


/** Given list of shows, create markup for each and append to DOM.
 *
 * A show is {id, name, summary, image}
 * */

function displayShows(shows) {
  $showsList.empty();

  for (const show of shows) {
    const $show = $(`
        <div data-show-id="${show.id}" data-my-name="Kate" class="Show col-md-12 col-lg-6 mb-4">
         <div class="media">
           <img
              src="${show.image}"
              alt="${show.name}"
              class="w-25 me-3">
           <div class="media-body">
             <h5 class="text-primary">${show.name}</h5>
             <div><small>${show.summary}</small></div>
             <button class="btn btn-outline-light btn-sm Show-getEpisodes">
               Episodes
             </button>
           </div>
         </div>
       </div>
      `);

    $showsList.append($show);
  }
}


/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 */

async function searchShowsAndDisplay() {
  const term = $("#searchForm-term").val();
  const shows = await getShowsByTerm(term);

  $episodesArea.hide();
  displayShows(shows);
}

$searchForm.on("submit", async function handleSearchForm(evt) {
  evt.preventDefault();
  await searchShowsAndDisplay();
});





/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */

async function getEpisodesOfShow(id) {
  const response = await fetch(`${API_URL}/shows/${id}/episodes`);
  const episodesData = await response.json();
  const episodesList = episodesData.map(filterEpisodeData);

  return episodesList;
}

/**takes an episodeData object and scrubs the data to return an object with
* only {id, name, season, number} */

function filterEpisodeData(episodeData) {    //filter
  const specificData = {
    id: episodeData.id,
    name: episodeData.name,
    season: episodeData.season,
    number: episodeData.number,
  };
  return specificData;
}

/**takes an array of episode information and appends that info to the
 * #episodesList unordered list*/

function displayEpisodes(episodes) {
  $("#episodesList").empty();
  for (let episode of episodes) {
    const $listElement = $(
      `<li> ${episode.name} (Season ${episode.season},
         Episode ${episode.number}</li>`
    );
    $("#episodesList").append($listElement);
  }
}

/**handles episode display. Gets episode data from api and displays it*/

async function getEpisodesAndDisplay(id) {
  const episodes = await getEpisodesOfShow(id);
  displayEpisodes(episodes);
  $episodesArea.show();
}

$($showsList).on("click", "button", async function handleEpisodesReveal(evt) {
  const $btn = $(evt.target);
  debugger;
  const showId = $btn
    .closest(".Show")
    .data()
    .showId;
  await getEpisodesAndDisplay(showId);
});

// add other functions that will be useful / match our structure & design
