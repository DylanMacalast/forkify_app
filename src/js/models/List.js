import uniqid from 'uniqid'; // a library which will create an id for elements instead of implementing it outselves.

export default class List {
    constructor() {
        // When we start adding new items to the list they will be pushed into this items array.
        this.items = [];
    }

    // method to add new item to list
    addItem (count, unit, ingredient) {
        const item ={ 
            id: uniqid(), // will create a unique id for each of the items in list based on the uniqid js library.
            count, // -> in es6 we dont have to write count: count 
            unit, 
            ingredient
        };
        this.items.push(item);
        return item;
    }

    // Method to delete items from shopping list
    deleteItem(id) {
        // finds the current elements id and checks to see if it is the passed in id
        const index = this.items.findIndex(el => el.id === id);
        // splice removes elements from an array, it exepts a start and how many to delete and it mutates the originall aray.
        this.items.splice(index, 1); // only want to remove one
    }

    //Update the count method
    updateCount(id, newCount) {
        // find will return the element not the index
        this.items.find(el => el.id === id).count = newCount;
        // if the current element's id is same as passed in id, update its count to the new count.
    }
}