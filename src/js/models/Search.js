import axios from 'axios';
import {key, proxy} from '../config'; //name import


// search class
export default class Search {
    constructor(query) {
        this.query = query;
    }
    // making an async method to get results from api
    async getResults() {
        try{
            const res = await axios(`${proxy}https://www.food2fork.com/api/search?key=${key}&q=${this.query}`);
            // storing the data in the search object instead of returning it
            this.result = res.data.recipes;
            // console.log(this.result);
        } catch (error){
            alert(error);
        }
    }
}


