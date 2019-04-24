// this will include an object which will contain all of our elements that we select from the dom
export const elements = {
    searchForm: document.querySelector('.search'), //-> used to check search form is submitted by clicking it
    searchInput: document.querySelector('.search__field'), // -> used for getting value from the input field in search form
    searchRes: document.querySelector('.results'),
    searchResList: document.querySelector('.results__list'), // -> used to place the rendered html into the ul results__list.
    searchResPages: document.querySelector('.results__pages'),
    recipe: document.querySelector('.recipe'),
    shopping: document.querySelector('.shopping__list'),
    likeMenu: document.querySelector('.likes__field'),
    likesList: document.querySelector('.likes__list')
};

// object containing elements to be used on this page
export const elementStrings = {
    loader: 'loader'
};

// these will include styles that are reusable
//loader function
export const renderLoader = parent => {
    const loader = `
        <div class="${elementStrings.loader}">
            <svg>
                <use href="img/icons.svg#icon-cw"></use>
            </svg>
        </div>
    `;
    parent.insertAdjacentHTML('afterbegin', loader);
};

// clear loader function
export const clearLoader = () => {
    const loader = document.querySelector(`.${elementStrings.loader}`);
    if(loader) loader.parentElement.removeChild(loader);
};