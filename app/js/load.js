'use strict'

load();

function load() {
  listObjects();
};

function listObjects() {
  // Default search string
  let search = '/?type=koop&zo=/amsterdam/tuin/garage/&page=1&pagesize=10';

  // Combine API info with search string
  let url = `${API.URL}${API.FORMAT}/${API.KEY}${search}`;

  // Fetch data for the search string from the API
  fetch(url, API)
    .then(res => {
      res.json().then(data => {
        // When data is returned hand it over to the render function
        renderOverview(data);
      });
    });
};

function getObjectDetail(objectId) {
  // Feed the provided object ID into the API
  let url = `${API.URL}${API.FORMAT}/detail/${API.KEY}/koop/${objectId}`;

  // Request data for the object
  fetch(url, API)
    .then(res => {
      res.json().then(data => {
        // When data is returned hand it over to the render function
        renderDetails(data);
      });
    });
}

function renderOverview(data) {
  // Grab the template
  fetch('templates/overview.mst')

    // Grab the text content of the template file
    .then(res => res.text())
    .then(template => {
      // Render the view with Mustache and place it in the #view element
      let rendered = Mustache.render(template, data);
      document.getElementById('view').innerHTML = rendered;

      addOverviewEventListeners();
    });
};

function renderDetails(data) {
  // Grab the template
  fetch('templates/details.mst')

    // Grab the text content of the template file
    .then(res => res.text())
    .then(template => {
      // Render the view with Mustache and place it in the #view element
      let rendered = Mustache.render(template, data);
      document.getElementById('view').innerHTML = rendered;

      addDetailsEventListeners();
    });
};

function addOverviewEventListeners(event) {
  // Grab all elements with [data-id] and attatch a event listener
  let links = document.querySelectorAll('[data-id]');
  for (let i = 0; i < links.length; i++) {
    links[i].addEventListener('click', listClickHandler);
  }
};

function listClickHandler(event) {
  // Prevent the default action of the links
  event.preventDefault();

  // Get the property ID
  let propertyId = this.getAttribute('data-id');

  // Feed the property ID to the API call function
  getObjectDetail(propertyId);
};

// Using some jQuery just to show I can
function addDetailsEventListeners(event) {
  $('#toggle-description').on('click', toggleContentHeight);
  $('.description-clip').on('transitionend', setClippingAutoHeight);
};

function toggleContentHeight() {
  // Get height of full content
  let contentHeight = $('.description-content').height();

  // Set height to the clipping area
  $('.description-clip').height(contentHeight);

  // Remove the button
  $('#toggle-description').remove();
};

// After the content height is set and the transition is overflow
// set the clipping area height to auto to prevent issues on resize
function setClippingAutoHeight() {
  $('.description-clip').height('auto');
};
