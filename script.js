'use strict';

const carouselImages = document.querySelector('.carousel__images');
const carouselButtons = document.querySelectorAll('.carousel__button');
const images = document.querySelectorAll('.carousel__images img');
const imagesContainer = document.querySelector('.carousel__images');
const gridContainer = document.querySelector('.grid-container');
const FavButton = document.getElementById('favorite');
const searchField = document.querySelector('.search--input');
const submitSearchButton = document.querySelector('.search--button');

let numberOfImages = 0;

let imageIndex = 1;
let translateX = 0;

window.addEventListener('DOMContentLoaded', () => renderItems());
window.addEventListener('DOMContentLoaded', () => renderCarousel());

const renderItems = async search => {
  let uri = 'http://localhost:3000/cookies';

  if (search) {
    uri += `?q=${search}`;
  }

  const result = await fetch(uri);

  const cookies = await result.json();

  let template = '';

  cookies.forEach(cookie => {
    template += `<div class="grid-item" id="${cookie.id}">
    <img
      src="${cookie.imageLink}"
    />
    <button class="grid-button edit" id="${cookie.id}">Edit</button>
    <button class="grid-button delete" id="${cookie.id}">Delete</button>
    </div>`;
  });

  gridContainer.innerHTML = template;
};

const renderCarousel = async () => {
  let uri = 'http://localhost:3000/cookies?q=true';

  const result = await fetch(uri);

  const cookies = await result.json();

  let template = '';

  cookies.forEach(cookie => {
    template += `<img
    src="${cookie.imageLink}"
  />`;

    numberOfImages += 1;
  });

  imagesContainer.innerHTML = template;
};

carouselButtons.forEach(button => {
  button.addEventListener('click', event => {
    if (event.target.id === 'previous') {
      if (imageIndex !== 1) {
        imageIndex--;
        translateX += 600;
      }
    } else {
      if (imageIndex !== numberOfImages) {
        imageIndex++;
        translateX -= 600;
      }
    }

    carouselImages.style.transform = `translateX(${translateX}px)`;
  });
});

gridContainer.addEventListener('click', event => {
  if (event.target.tagName === 'BUTTON') {
    let button = event.target;

    if (button.className === 'grid-button edit') {
      console.log('ooooo');
    }

    if (button.className === 'grid-button delete') {
      const res = fetch('http://localhost:3000/cookies/' + button.id, {
        method: 'DELETE',
      });
    }
  }
});

submitSearchButton.addEventListener('click', e => {
  renderItems(searchField.value);
});

const form = document.querySelector('form');
const createBtn = document.querySelector('.create-btn');
const createInput = document.querySelector('.create-input');

const createPost = async e => {
  e.preventDefault();

  const doc = {
    imageLink: form.imageLink.value,
    favorite: form.favorite.checked,
  };

  await fetch('http://localhost:3000/cookies', {
    method: 'POST',
    body: JSON.stringify(doc),
    headers: { 'Content-Type': 'application/json' },
  });

  renderItems();
  renderCarousel();
};

form.addEventListener('submit', createPost);
