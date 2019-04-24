import { elements } from "./base";

export const getInput = () => elements.searchInput.value; // auto returns value of the input into the search field.

// function to clear input field
export const clearInput = () => {
    elements.searchInput.value = '';
};

// function to clear the html result on left side of page -> setting html to nothing
export const clearResults = () => {
    elements.searchResList.innerHTML = ''; // clearing the recipes
    elements.searchResPages.innerHTML = ''; // clearing the btns
};


export const highlightSelected = id => {
    // before adding highlighted class for active link remove it firs
    const resultsArr = Array.from(document.querySelectorAll('.results__link'));
    resultsArr.forEach(el => {
        el.classList.remove('results__link--active');
    });
    // grabbing all links with a href of the recipe id which is in the markup, we then use classlist.add to add a css class to the active link.
    document.querySelector(`.results__link[href*="#${id}"]`).classList.add('results__link--active');
}

//private function which limits the length of the titles without cutting words
export const limitRecipeTitle = (title, limit = 17) => {
    const newTitle = [];
    if (title.length > limit) {
        // split splits the words in the title to arrays -> pasta with tomatoe -> ['pasta', 'with', 'tomatoe'];
        title.split(' ').reduce((acc, curr) => {
            if(acc + curr.length <= limit) {
                newTitle.push(curr);
            }
            return acc + curr.length;
        }, 0);

        //return result -> join does opposite of split joins array puttin spaces inbetween.
        return `${newTitle.join(' ')} ...`; // -> pasta with tomatoe ...
    }
    return title;
}

//====Inserting the data from api into html!===
// not exporting this function as we are only using it within renderResults() function.
const renderRecipe = recipe => {
    const markup = `
    <li>
        <a class="results__link" href="#${recipe.recipe_id}">
            <figure class="results__fig">
                <img src="${recipe.image_url}" alt="${recipe.title}">
            </figure>
            <div class="results__data">
                <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
                <p class="results__author">${recipe.publisher}</p>
            </div>
        </a>
    </li>
    `;
    elements.searchResList.insertAdjacentHTML('beforeend', markup);
};


//==== function which creates the pagination btns====
//type: 'prev' or 'next'
const createButton = (page, type) => `
    <button class="btn-inline results__btn--${type}" data-goto=${type === 'prev' ? page -1 : page + 1}>
        <span>Page ${type === 'prev' ? page -1 : page + 1}</span>
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
        </svg>
    </button>
`;


// ====render page buttons depending on how many pages there are.====
const renderButtons = (page, numResults, resPerPage) => {
    const pages = Math.ceil(numResults / resPerPage);

    let button;
    if(page === 1 && pages > 1) {
        // Only button to go to next page
        button = createButton(page, 'next');
    }else if (page < pages) {
        // Both buttons
        button = `
        ${createButton(page, 'prev')}
        ${createButton(page, 'next')}
        `;
    } else if(page === pages && pages > 1) {
        // Only button to go to prev page
        button = createButton(page, 'prev');
    }

     elements.searchResPages.insertAdjacentHTML('afterbegin', button);
};


// ====function which recieves all of the recipes(30) array, we want to go to page 1 and show 10 per page.====
export const renderResults = (recipes, page = 1, resPerPage = 10) => {
    //==== render results of current page===
    const start = (page -1) * resPerPage; // start on page 1 - 1 = 0, * 10 = 0 -> page 2-1 =1, * 10 = 10 and so on.
    const end = page * resPerPage; // page 1 * 10 = 10.

    // will loop through all 30 recipes results and call renderRecipe on each recipe in array.
    recipes.slice(start, end).forEach(renderRecipe); // using slice to copy an array from a certain point to another.

    // === render pagination btns ==
    renderButtons(page, recipes.length, resPerPage);
}