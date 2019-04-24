import { elements } from './base';
// importing the function that limits the title from searchVeiw.js
import { limitRecipeTitle } from './searchView';

// function which toggles like button.
export const toggleLikeBtn = isLiked => {
    const iconString = isLiked ? 'icon-heart' : 'icon-heart-outlined';
    // set the use elements href to be dynamic by setting its attribute to below.
    document.querySelector('.recipe__love use').setAttribute('href', `img/icons.svg#${iconString}`);
    //icons.svg#icon-heart-outlined
};

// If there are no likes then the heart in top right corner should not be vissible, else show it.
export const toggleLikeMenu = numLikes => {
    elements.likeMenu.style.visibility = numLikes > 0 ? 'visible' : 'hidden';
};

// function to render likes into the likes menu dropdown
export const renderLike = like => {
    // the link is set to the id so that when we click the liked item in the drop down menu it will diplay the recipe in the middle of the page.
    const markup = `
        <li>
            <a class="likes__link" href="#${like.id}">
                <figure class="likes__fig">
                    <img src="${like.img}" alt="${like.title}">
                </figure>
                <div class="likes__data">
                    <h4 class="likes__name">${limitRecipeTitle(like.title)}</h4>
                    <p class="likes__author">${like.author}</p>
                </div>
            </a>
        </li>
    `;
    elements.likesList.insertAdjacentHTML('beforeend', markup);
};

export const deleteLike = id => {
    // not just selecting link but the whole li element, therefore we selcet the parentElement of the link to grab it all.
    const el = document.querySelector(`.likes__link[href*="#${id}"]`).parentElement;
    if (el) el.parentElement.removeChild(el);
}