async function searchShows(query) {
  const showList = [];
  // TODO: Make an ajax request to the searchShows api.  Remove
  // hard coded data.
  const getShow = await axios.get("http://api.tvmaze.com/search/shows?", {params: {q: query}});
  getShow.data.forEach(element => {
    const showData = {
      id: element.show.id,
      name: element.show.name,
      summary: element.show.summary, 
      image: element.show.image ? element.show.image.original : "https://tinyurl.com/tv-missing"
    };
      showList.push(showData);
  })
  return showList;
}

function populateShows(shows) {
  const $showsList = $("#shows-list");
  $showsList.empty();

  for (let show of shows) {
    let $item = $(
      `<div class="col-md-6 col-lg-3 Show" data-show-id="${show.id}">
         <div class="card" data-show-id="${show.id}">
         <img class="card-img-top" src="${show.image}">
           <div class="card-body">
             <h5 class="card-title">${show.name}</h5>
             <p class="card-text">${show.summary}</p>
             <button class="episodes btn btn-primary">Episodes</button>
           </div>
         </div>
       </div>
      `);

    $showsList.append($item);
  }
}

$("#search-form").on("submit", async function handleSearch (evt) {
  evt.preventDefault();

  let query = $("#search-query").val();
  if (!query) return;

  $("#episodes-area").hide();

  let shows = await searchShows(query);

  populateShows(shows);
});

async function getEpisodes(id) {
  const episodeList = [];
  const getEpisodesResponse = await axios.get(`http://api.tvmaze.com/shows/${id}/episodes`);
  getEpisodesResponse.data.forEach(episode => {
    const episodeData = {
      id: episode.id,
      name: episode.name,
      season: episode.season, 
      number: episode.number
    };
      episodeList.push(episodeData);
  })
  return episodeList;
}

function populateEpisodes(episodes) {
  const episodesList = $("#episodes-list");
  episodesList.empty();
    
  for (let episode of episodes) {
    let item = (
      `<li>
         ${episode.name}
         (season ${episode.season}, episode ${episode.number})
       </li>
      `);
    episodesList.append(item);
  }

  $("#episodes-area").show();
}


$("#shows-list").on("click", ".episodes", async function episodeClick(e) {
  e.preventDefault();
  const showID = $(e.target).closest(".Show").data("show-id");
  const episodes = await getEpisodes(showID);
  populateEpisodes(episodes);
});