import axios from 'axios';
import {key, proxy} from '../config';
//Recipe class
export default class Recipe {
    constructor(id) {
        this.id = id; //each recipe is identified by and id, each time we will create a new recipe object we will pass in the recipes id.
    }

    async getRecipe() {
        try {
            // this axios call will retrun a promise which we await as we are inside an async function.
            const res = await axios(`${proxy}https://www.food2fork.com/api/get?key=${key}&rId=${this.id}`);
            //getting all the data from the returned object ans saving to the prototype of Recipe so it can be used each time a new object is created using the Recipe class.
            this.title = res.data.recipe.title;
            this.author = res.data.recipe.publisher;
            this.img = res.data.recipe.image_url;
            this.url = res.data.recipe.source_url;
            this.ingredients = res.data.recipe.ingredients;
        } catch(error) {
            console.log(error);
            alert('Something went wrong :( '); 
        }
    }

// adding our own method to calulate the cooking time as there is no data for this in the api.
    calcTime() {
        // Assuming that we need 15 min for each 3 ingredients
        const numIng = this.ingredients.length; //saving how many ingredients to numIng
        const periods = Math.ceil(numIng / 3); // dividing total ingredients by 3
        this.time = periods * 15; // multiplying how the total / 3 by 15 to get cook time.
    }

    // method for how many servings there will be on each recipe -> set it to 4
    calcServings() {
        this.servings = 4;
    }

    //NOTE: ~ ingredients array will look like so [1, 'cup', 'chopped onions'], it is not all the ingredients in the recipe at this point as we are looping through here.

    parseIngredients() {
        const newIngredients = this.ingredients.map(el => {
            // We want to convert the unitsLong into unitsShort using the map loop which will return an array with the new units
            const unitsLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'cup'];
            const unitsShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound'];
            const units = [...unitsShort, 'kg', 'g'];
            // 1. Uniform units -> all the same
            let ingredient = el.toLowerCase(); //el is each of the elements in the array and we save them to ingredient. -> toLowerCase() converts all to lowercase for mutation to work.
            //NOTE: loop through unitsLong array and replacing the elements with the unitsShort elements, which are in the same position.
            unitsLong.forEach((unit, i) => {
                ingredient = ingredient.replace(unit, unitsShort[i]); // ingredient is the current element as assigned above, unit is the current element in the forEach loop callback function which is what will be changed.
            });

            // 2. Remove ()
            ingredient = ingredient.replace(/ *\([^)]*\) */g, ' '); // using regulare expression to replace the paranthasis with nothing ''.

            // 3. Parse ingredients into count, unit and ingredient.
            const arrIng = ingredient.split(' '); //-> 1/2 cup cheese -> [1/2, cup, cheese]
            //NOTE: using findIndex array method. findIndex takes a callback function which has a parameter el2, which refers to each element.
            // ... so for each element we will make a test on unitsShort array.
            // ... includes() returns true if the element we are passing in is inside of the unitsShort array, returns false otherwise.
            // ... So we are testing to see if each element inside the arrIng array is inside the unitsShort array.
            const unitIndex = arrIng.findIndex(el2 => units.includes(el2));

            let objIng; // initializing the ingredient object.

            // if there is a unit run, if its -1 it could not find the element so dont run.
            if(unitIndex > -1) {
                // There IS a unit...

                 //eg. 4 1/2 cups -> arrCount[4, 1/2].
                 // eg. 4 cups -> arrCount is [4]
                const arrCount = arrIng.slice(0, unitIndex);

                let count;
                if(arrCount.length === 1) {
                    // some of the data coming back from api uses 1-1/2 to say one and a half
                    // ... we want it to be a plus so that we can use the eval function to calculate it and mutate it to look like --> 1.5
                    count = eval(arrIng[0].replace('-', '+')); // if there is only one element before the unit then that element is the number(count).
                } else {
                    // ex. eval('4+1/2) --> 4.5.
                    count = eval(arrIng.slice(0, unitIndex).join('+')); // Joining the first elements before the unit and evaluating them using eval().
                }

                objIng = {
                    count, // Same as saying count: count, we dont need to specify as we have the unit from above.
                    unit: arrIng[unitIndex],
                    ingredient: arrIng.slice(unitIndex + 1).join(' ') // the ingredient will be after the unitIndex so splice it from there untill end of arra, the join it together in a string.

                };

            //if parseInt can turn the 1st element of the array into a number then it will be true.
            } else if(parseInt(arrIng[0])){
                // There is NO unit, but the first element is a number.
                objIng = {
                    count: parseInt(arrIng[0], 10), // getting the number from the first index of the array an making it an integer.
                    unit: '', // not unit again
                    ingredient: arrIng.slice(1).join(' ') // ingredient is the array starting from index 1 as there is a number, we then join the array with the number with a space between.
                };
            } else if(unitIndex === -1) {
                //there is NO unit and no number in first position
                objIng = {
                    count: 1, // if there is no number we always want 1 to be at start eg. 1 bread
                    unit: '', // no unit so its blank
                    ingredient: ingredient // is the whole ingredient array as there is no number or unit.
                };
            }
                
            // on every iteration we are returning the objIng of each ingredient, beacuse we are using map, these are then stored in an array.
            return objIng; // This is how the map method works, in each iteration we have to return something which will be saved into the current postion of the new array.
        });
        //NOTE: ingredients is now equal to all ingredients which is stored in an array due to map.
        this.ingredients = newIngredients;
    }

    //Method to update the servings and ingredients of the recipe
    updateServings (type) {
        // Servings
        const newServings = type === 'dec' ? this.servings -1 : this.servings + 1;
        // Ingredients
        // ingredients is an array so loop throuh, on each element(ing) get the new count
        this.ingredients.forEach(ing => {
            ing.count = ing.count * (newServings / this.servings); // new count is old count times the new servings divided by old servings to see the difference.
        });

        this.servings = newServings;
    }
}

