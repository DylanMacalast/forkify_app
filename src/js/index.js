import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import * as searchView from './views/searchView'; // importing all functions from searchView.js
import * as recipeView from './views/recipeView'; // importing all functions from searchView.js
import * as listView from './views/listView'; 
import { elements, renderLoader, clearLoader} from './views/base'; // importing all elements from dom
import Likes from './models/Likes';
import * as likesView from './views/likesView';

// Global state of the app -> all of this data will be stored in one central variable 'state' which we can acces through our controller.
// - search object -> the search query and search results will be part of the state.
// - Current recipe object
// - Shopping list object
// - Liked recipes
const state = {};


/******************** SEARCH CONTROLLER ******************************/
// Everytime search button is pressed this will run!
// constrolSearch is an async function which will return once the promies executes.
const controlSearch = async () => {
    // 1. Get query from view
    const query = searchView.getInput(); // what is typed in by user(in searchView.js)

    //If there is a query run...
    if (query) {
        // 2. New search object and store it in global state object(the new Search instance of the Search class is now stored in the state obj)
        state.search = new Search(query); // new search object created here using the class from search.js, saved into state.search and query is the input we get in above line.

        // 3. Prepare UI for results
        searchView.clearInput(); // getting the clearInput function from searchView and invoking it to clear the html on page.
        searchView.clearResults();
        renderLoader(elements.searchRes); // whilst we wait for the results to be returned from below show the loader.

        try {
            // 4. Search for recipes -> the new Search instance is now stored in the state object so we must get the method from there.
            await state.search.getResults(); // awaiting for the async function getResults to return a promise using try/ catch in Search.js -> saves this.result (in this case state.search.result) to the correct returned values from the api.

            // 5. Render results on UI -> only happen when we recieve results from api, therefore use await on the state.search.getResults() promise.
            clearLoader(); // now that we have the results from the function clear loader.
            searchView.renderResults(state.search.result); // takes state.search.result as the recipes parameter, as this is where the 30 returned recipes from the api are saved.

        } catch(err) {
            alert('Something went wrong with the search ...');
            clearLoader();

        }
    
        
    }
}

// whenever we submit the form(press the search btn) run the the callback function e which containes the controlSearch().
elements.searchForm.addEventListener('submit', e =>{
    e.preventDefault(); // stopping button reloading page
    controlSearch();
});


// using event delegation to set an event handler for the pagination btns
elements.searchResPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline'); // if i click on a span, it will find the closest element with the .btn-inline class
    if (btn) {
        const goToPage = parseInt(btn.dataset.goto, 10); // getting the value from the html data set 'goto' which is dynamic -> (parseInt changes string to number)
        searchView.clearResults(); //clearing results so that the next page recipes are at the top not underneath old ones.
        searchView.renderResults(state.search.result, goToPage); // getting new results on new page, using goToPage as parameter for renderResults to inform it that we are on new page therefore run the function in searchView.js
    }
})



/******************** RECIPE CONTROLLER ******************************/
//controlRecipe function
const controlRecipe = async () => {
    //getting the hash
    // location is getting location from url bar, then grabbing hash, removing it and saving it all to id so we have the recipes id.
    const id = window.location.hash.replace('#', ''); // getting rid of the # by replacing it with nothing.

    // if there is a hash(or id) present, create a new recipe object
    if(id) {
        // Preparing UI for changes
        recipeView.clearRecipe();
        renderLoader(elements.recipe);

        //Highlight selected search item
        // only select search item if its selected
        if (state.search) searchView.highlightSelected(id);

        // create new recipe object -> putting inside state
        state.recipe = new Recipe(id); //creating new recipe object saved into state.recipe

        try {
            
            // Get recipe data -> we want this to run asynchronously so that the recipe data loads up in the background.
            // and parseingredients(). which parse the ingredients.
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();

            // Call our calcTime and calServings functions
            state.recipe.calcTime();
            state.recipe.calcServings();

            // Render the recipe.
            clearLoader();
            // When we render the recipe we also pass in to see if the recipe is liked to toggle the heart icon correctly
            recipeView.renderRecipe(
                state.recipe, 
                state.likes.isLiked(id)
                );

        } catch(err) {
            console.log(err);
            alert('Error proccessing recipe');
        }
       

    }
};

// Adding an event listeners to the global object, which is window
//hashchange -> when the hash in the url bar changes.
// using a forEach loop to add event listeners to the object.
// -> loops through the array, adding the eventListener to the window object each time and calling controlRecipe each time that event fires off.
['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));





// ==================SHOPPING LIST CONTROLLER ===============
// Do not have to use a loop here to render the items to the UI and list array as it is done in the 'handling recipe buttons' part
const controlList = () => {
    // Create a new list IF there is none yet
    if(!state.list) state.list = new List(); //-> if there is no list then create a new list

    // Add each ingredient to the list and UI
    // looping through the ingredients array and adding an item to the items array using the addItem method on each element in the array.
    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count, el.unit, el.ingredient);
        listView.renderItem(item); // adds a new ingredient to the list UI.
    });
}

// Handle delete and update list item events
elements.shopping.addEventListener('click', e => {
    const id = e.target.closest('.shopping__item').dataset.itemid; // getting the id of the ingredient li wherever we click on that certain ingredient -> it will always go to closest shopping item

    // Handle the delete button
    if (e.target.matches('.shopping__delete, .shopping__delete *')) {
            // delete from the state
            state.list.deleteItem(id);
            //delete from UI
            listView.deleteItem(id);
    //handle the count update
    } else if (e.target.matches('.shopping__count--value')){
        // the element that is just clicked in this case is the input value element therefore we can just use e.target to update it
        const val = parseFloat(e.target.value, 10);
        state.list.updateCount(id, val); // id is selected id, and the val (newCount) is the value of the input that we can specify in the shopping list.
    }
});



// ======================= LIKE CONTROLLER ==========================
// TESTING...

//TESTING...

const controlLike = () => {
    // If its not in state.likes array then create a new Likes object
    if(!state.likes) state.likes = new Likes();
    const currentId = state.recipe.id; // getting current id of the selected recipe.

    // User has NOT yet liked current recipe
    if(!state.likes.isLiked(currentId)) {
        //Add like to the state
        const newLike = state.likes.addLike(currentId, state.recipe.title, state.recipe.author, state.recipe.img);

        // Toggle like button UI
        likesView.toggleLikeBtn(true);

        // Add like to the UI likes list
        likesView.renderLike(newLike);

    // User HAS liked current recipe
    } else {

        // Remove like from state
        state.likes.deleteLike(currentId);

        // toggle like button
        likesView.toggleLikeBtn(false);

        // remove like from UI likes list
        likesView.deleteLike(currentId);

    }
    likesView.toggleLikeMenu(state.likes.getNumLikes());
};

// Restore liked recipe when page loads from localStorage
window.addEventListener('load', () => {
    state.likes = new Likes();

    // Restore likes from storage
    state.likes.readStorage();

    // toggle like menu button if there are some save likes
    likesView.toggleLikeMenu(state.likes.getNumLikes());

    //render existing likes
    // getting the likes array from likes object which is in the state global variable.
    // for each like invoke the likesView.renderLike(like) method on the stored likes.
    state.likes.likes.forEach(like => likesView.renderLike(like));
});






// Handling recipe button clicks using event delegation
elements.recipe.addEventListener('click', e => {
    // Matches() will return true if btn-decrease class is selected. the * selects all children elements of the class.
    if (e.target.matches('.btn-decrease, .btn-decrease *')) {
        // Decrease button is clicked
        if(state.recipe.servings > 1) {
            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe);
        }
        
    } else if (e.target.matches('.btn-increase, .btn-increase *')) {
        // increase button is clicked
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);

        // if the add to shopping list is clicked call conrolList()
    } else if(e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
        // Add to list button
        controlList();
    } else if (e.target.matches('.recipe__love, .recipe__love *')) {
        // Like controller
        controlLike();
    }

});







