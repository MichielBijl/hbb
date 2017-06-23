'use strict'

load();

function load() {
  listObjects();
};

function listObjects() {
  let search = '/?type=koop&zo=/amsterdam/tuin/garage/&page=1&pagesize=10';
  let url = `${API.URL}${API.FORMAT}/${API.KEY}${search}`;

  fetch(url, API)
    .then(res => {
      res.json().then(data => {
        renderOverview(data);
      });
    });
};

function getObjectDetail(objectId) {
  let url = `${API.URL}${API.FORMAT}/detail/${API.KEY}/koop/${objectId}`;

  fetch(url, API)
    .then(res => {
      res.json().then(data => {
        renderDetails(data);
      });
    });
}

function renderOverview(data) {
  fetch('templates/overview.mst')
    .then(res => res.text())
    .then(template => {
      let rendered = Mustache.render(template, data);
      document.getElementById('main').innerHTML = rendered;

      let links = document.querySelectorAll('[data-id]');
      for (let i = 0; i < links.length; i++) {
        links[i].addEventListener('click', listClickHandler);
      }
    });
};

function renderDetails(data) {
  fetch('templates/details.mst')
    .then(res => res.text())
    .then(template => {
      let rendered = Mustache.render(template, data);
      document.getElementById('main').innerHTML = rendered;
    });
};

function listClickHandler(event) {
  event.preventDefault();

  let propertyId = this.getAttribute('data-id');

  getObjectDetail(propertyId);
};
