export default class Likes {
    constructor() {
        this.likes = [];
    }
//Whenever we change the likes array (add or delete a like) save the array to the local storage


    // method which is the data we need to save in each like
    addLike(id, title, author, img) {
        const like = { id, title, author, img };
        // pushing the new like object into the likes array.
        this.likes.push(like);

        // Persist data in localStorage
        this.persistData();

        return like;
    }

    // Method to delete like
    deleteLike(id) {
        // finds the current elements id and checks to see if it is the passed in id
        const index = this.likes.findIndex(el => el.id === id);
        // splice removes elements from an array, it exepts a start and how many to delete and it mutates the originall aray.
        this.likes.splice(index, 1); // only want to remove one

         // Persist data in localStorage
        this.persistData();
    }

    // Method to check that we have a like in our array with the id we passed in
    isLiked(id) {
        // finding the current elements id, seeing if it matches the id passed into the method
        // ... We then test to see if it is different to -1, this is beacuse if we can not find any item with the id we passed in then the current loop will equal -1
        // ... if it is -1 then this expression will be false -> we want this as it means that the id that was passed in is not liked
        // ... if it returns true then that means that the recipe with the id passed in is liked
        return this.likes.findIndex(el => el.id === id) !== -1;
    }

    // Method to just return how many likes there are.
    getNumLikes() {
        return this.likes.length;
    } 

    // method to add data to localStorage
    persistData() {
        //JSON.stringyify -> turns the likes array to a string, it is then saved into local sotrage under 'likes' keyword.
        localStorage.setItem('likes', JSON.stringify(this.likes));
    }

    //Method to retrieve the liked recipes from the localStorage
    readStorage() {
        // saving all likes from localStorage into storage variable
        // JSON.parse turns it back to normal so no longer a string
        const storage = JSON.parse(localStorage.getItem('likes')); // if there are no likes in localStorage -> will return null
        
        // Restoring likes from local storage if we refresh or return to page.
        if(storage) this.likes = storage;

    }
}