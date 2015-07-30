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
      if (event.target.parentElement.className.includes('active')) {
        var path = "/";
        history.pushState(null, null, path);
        parseURL();
      } else {
        generateURL(event);
      };
    });

    var title = document.createElement('div');
    title.className = "palette__title";
    title.innerText = palette.title;

    var colors = document.createElement('div');
    colors.className = "palette__colors";

    var cols = [
      palette.colours.pop,
      palette.colours.contrastingSubDominant,
      palette.colours.subDominant,
      palette.colours.contrastingDominant,
      palette.colours.dominant
    ];

    var el, i;

    for (i = 0; i < cols.length; i++) {
      el = document.createElement('div');
      el.className = "palette__color";
      el.style.backgroundColor = cols[i];
      colors.appendChild(el);
    };

    div.appendChild(button);
    div.appendChild(title);
    div.appendChild(colors);

    return div
  };

  var buildDetailsDiv = function(palette) {
    var div = document.createElement('div');
    div.className = "details";
    div.id = palette.id;

    var colorIdDiv = document.createElement('div');
    colorIdDiv.className = "details__colorId";
    colorIdDiv.innerText = "Color ID: " + palette.id;

    var colorCatDiv = document.createElement('div');
    colorCatDiv.className = "details__colorCategory";
    colorCatDiv.innerText = "Category: " + palette.category;

    var userIdDiv = document.createElement('div');
    userIdDiv.className = "details__userId";
    userIdDiv.innerText = "User ID: " + palette.user.id;

    var userNameDiv = document.createElement('div');
    userNameDiv.className = "details__userName";
    userNameDiv.innerText = "User Name: " + palette.user.name;

    var colorsDiv = document.createElement('div');
    colorsDiv.className = "details__colorsDiv";

    var colors = [
      palette.colours.dominant,
      palette.colours.contrastingDominant,
      palette.colours.subDominant,
      palette.colours.contrastingSubDominant,
      palette.colours.pop
    ];

    var msgs = [
      "Dominant<br>",
      "Contrasting<br>Dominant<br>",
      "Sub-Dominant<br>",
      "Contrasting<br>Sub-Dominant<br>",
      "Pop<br>"
    ];

    var el, elHover, i;

    for (i = 0; i < colors.length; i++) {
      el = document.createElement('div');
      el.className = "details__color";
      el.style.backgroundColor = colors[i];
      elHover = document.createElement('div');
      elHover.className = "details__colorInner";
      elHover.innerHTML = msgs[i] + colors[i];
      el.appendChild(elHover);
      colorsDiv.appendChild(el);
    };

    div.appendChild(colorIdDiv);
    div.appendChild(colorCatDiv);
    div.appendChild(userIdDiv);
    div.appendChild(userNameDiv);
    div.appendChild(colorsDiv);

    return div;
  };

  var displayIndex = function(data) {
    var mainDiv = document.querySelector('[data-js="body"]');
    data.forEach(function(palette) {
      var paletteDiv = buildPaletteDiv(palette);
      mainDiv.appendChild(paletteDiv);
    });
    return;
  };

  var displayDetails = function(id) {
    clearPalettes();
    var palette = data.filter(function(el) { return el.id == id });
    palette = palette[0];
    var paletteDiv = buildPaletteDiv(palette);
    paletteDiv.className += " active"
    var detailsDiv = buildDetailsDiv(palette);
    var mainDiv = document.querySelector('[data-js="body"]');
    mainDiv.appendChild(paletteDiv);
    mainDiv.appendChild(detailsDiv);
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

  if (localStorage.data === undefined) {
    loadJSON('/palettes.json', storeJSON);
  } else {
    data = JSON.parse(localStorage.data);
    parseURL();
  };

  window.addEventListener('popstate', parseURL);

  var homeButton = document.querySelector('[data-js="homeButton"]');
  homeButton.addEventListener('click', function() {
    var path = "/";
    history.pushState(null, null, path);
    parseURL();
  });

})();
