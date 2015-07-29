;(function() {

  var storeJSON = function(e) {
    data = JSON.parse(e.target.responseText);
    localStorage.data = e.target.responseText;
    parseURL();
  };

  var loadJSON = function(url, callback) {
    var request = new XMLHttpRequest;
    request.open('GET', url);
    request.onload = callback;
    request.send();
    return;
  };

  var buildPaletteDiv = function(palette) {
    var div = document.createElement('div');
    div.className = "palette";
    div.id = palette.id;

    var button = document.createElement('button');
    button.className = "palette__button";
    button.setAttribute("data-js", "paletteButton");
    button.addEventListener("click", function(event) {
      generateURL(event);
    });

    var title = document.createElement('div');
    title.className = "palette__title";
    title.innerText = palette.title;

    // var titleDiv = document.createElement('div');
    // titleDiv.className = "palette__topText";
    // titleDiv.innerHTML = "<strong>Title: </strong>" + palette.title;
    //
    // var keywordDiv = document.createElement('div');
    // keywordDiv.className = "palette__topText";
    // keywordDiv.innerHTML = "<strong>Keyword: </strong>" + palette.keyword;
    //
    // textDiv.appendChild(titleDiv);
    // textDiv.appendChild(keywordDiv);
    //
    // var colorsDiv = document.createElement('div');
    // colorsDiv.className = "palette__colors";
    //
    // var colors = [
    //   palette.colours.dominant,
    //   palette.colours.contrastingDominant,
    //   palette.colours.subDominant,
    //   palette.colours.contrastingSubDominant,
    //   palette.colours.pop
    // ];
    //
    // var msgs = [
    //   "Dominant<br>",
    //   "Contrasting<br>Dominant<br>",
    //   "Sub-Dominant<br>",
    //   "Contrasting<br>Sub-Dominant<br>",
    //   "Pop<br>"
    // ];
    //
    // var el, elHover, i;
    // for (i = 0; i < colors.length; i++) {
    //   el = document.createElement('div');
    //   el.className = "palette__color";
    //   el.style.backgroundColor = colors[i];
    //   elHover = document.createElement('div');
    //   elHover.className = "palette__colorInner";
    //   elHover.innerHTML = msgs[i] + colors[i];
    //   el.appendChild(elHover);
    //   colorsDiv.appendChild(el);
    // };

    div.appendChild(button);
    div.appendChild(title);
    // div.appendChild(colorsDiv);
    //
    return div
  };

  var displayIndex = function(data) {
    var mainDiv = document.querySelector('[data-js="body"]');
    data.forEach(function(palette) {
      var paletteDiv = buildPaletteDiv(palette);
      mainDiv.appendChild(paletteDiv);
    });
    return; //mainDiv;
  };

  var displayDetails = function(id) {
    clearPalettes();
    var palette = data.filter(function(el) { return el.id == id });
    palette = palette[0];
    var paletteDiv = buildPaletteDiv(palette);
    var mainDiv = document.querySelector('[data-js="body"]');
    mainDiv.appendChild(paletteDiv);
  };

  var clearPalettes = function() {
    var body = document.querySelector('[data-js="body"]');
    body.innerHTML = "";
  };

  var generateURL = function(event) {
    var path = "/palette/" + event.target.parentNode.id;
    history.pushState(null, null, path);
    parseURL();
  };

  var parseURL = function() {
    event.preventDefault();
    var path = window.location.pathname;
    var pathArr = path.split('/');
    if (pathArr[1] === "") {
      console.log('Parsing: ' + path)
      clearPalettes();
      displayIndex(data);
    } else if (pathArr[1] === "palette") {
      console.log('Parsing: ' + path)
      displayDetails(pathArr[2]);
    } else {
      console.log('Parsing: ' + path)
      var err = document.createElement('div');
      err.className = "palette";
      err.innerText = "This is not a valid URL";
      var body = document.querySelector('[data-js="body"]');
      body.insertBefore(err, body.childNodes[0]);
    };
  };

  var data;

  if (localStorage.data) {
    loadJSON('/palettes.json', storeJSON);
  } else {
    data = JSON.parse(localStorage.data);
  };

  window.onpopstate = parseURL;

  var homeButton = document.querySelector('[data-js="homeButton"]');
  homeButton.addEventListener('click', function() {
    var path = "/";
    history.pushState(null, null, path);
    parseURL();
  });

})();
