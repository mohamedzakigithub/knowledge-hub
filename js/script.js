///////////////////// News API app ////////////////////////////

$("#searchBtn").on("click", function () {
  let topic = $("#searchText").val();

  $(".column").attr("style", "display:block");
  newsAPIstub($("#searchText").val());
  wikiAPIstub($("#searchText").val());
  flickrAPIstub($("#searchText").val());
});

function wikiAPIstub(topic) {
  console.log("wikiAPI called with..." + " " + topic);
}

function flickrAPIstub(topic="other") {
  console.log("flicrAPI called with..." + " " + topic);
  //retrieve data from Flickr API
  var keysearch = topic.trim().toLowerCase();
  var api_key = "40076406b171f50ca25bfbe121eb2806";
  var queryURL = "https://www.flickr.com/services/rest/?method=flickr.galleries.getPhotos&api_key=" + 
                    api_key + "&gallery_id=187359801-72157713443419606&format=json&nojsoncallback=1";
  var photoIds = {};
  // let newsID = 0;

  $.ajax({
    url: queryURL,
    method: "GET"
  })
  //
    .then(function(response) {
      let photos = response.photos.photo; // bushfire:41241063925-5, australia:5248354281-7, 
      let others = [];
      others.push(photos[0].id);
      others.push(photos[6].id);
      others.push(photos[8].id);
      others.push(photos[9].id);
      others.push(photos[10].id);
      Object.assign(photoIds, {"others": others});
      Object.assign(photoIds, {"megxit": photos[1].id});
      Object.assign(photoIds, {"afl": photos[2].id});
      Object.assign(photoIds, {"stock market": photos[3].id});
      Object.assign(photoIds, {"corona virus": photos[4].id});
      Object.assign(photoIds, {"bushfire": photos[5].id});
      Object.assign(photoIds, {"australia": photos[7].id});
      let hotTopic = Object.keys(photoIds);
      if(hotTopic.indexOf(topic) === -1) {
        var randomPhotoId = photoIds.others[Math.floor(Math.random() * photoIds.others.length)];
        queryURL = "https://www.flickr.com/services/rest/?method=flickr.photos.getSizes&api_key=" +
                    api_key + "&photo_id=" + randomPhotoId + "&format=json&nojsoncallback=1";
        
      }  else {
        queryURL = "https://www.flickr.com/services/rest/?method=flickr.photos.getSizes&api_key=" +
                    api_key + "&photo_id=" + photoIds[topic] + "&format=json&nojsoncallback=1";
        //console.log(photoIds[topic]);
      }
      $.ajax({
        url: queryURL,
        method: "GET"
      })
      //
        .then(function(data) {
          $("#flickrImg").attr("src", data.sizes.size[6].source);
        });
    });
}

function newsAPIstub(topic) {
  console.log("newsAPI called with..." + " " + topic);

  let api_url = "https://newsapi.org/v2/everything?qInTitle=";
  let newsAPIkey = "02403ceecf7b4629a113e349b90603ec";
  let news = [];
  let newsID = 0;

  $.ajax({
    url: api_url + topic + "&language=en" + "&apikey=" + newsAPIkey
  }).then(function (result) {
    console.log(result);
    newsArray = result;
    updateNews(result);
  });

  function updateNews(result) {
    $(".newsTitle").text(result.articles[newsID].title);
    $(".newsImage").attr("src", result.articles[newsID].urlToImage);
    $(".newsSource").text("source: " + result.articles[newsID].source.name);
    $(".newsDescription").text(result.articles[newsID].description);
    $(".newsURL").attr("href", result.articles[newsID].url);
  }

  $(".next").on("click", function () {
    if (newsID < 19) {
      console.log(newsID);
      newsID++;
      updateNews(newsArray);
    }
  });

  $(".prev").on("click", function () {
    if (newsID > 1) {
      newsID--;
      console.log(newsID);
      updateNews(newsArray);
    }
  });
}


//////////////////////////////////
