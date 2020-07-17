import * as Action from '../action';
import {call,put} from 'redux-saga/effects';

function* getListFromApi(){
    try{
        const response = yield fetch('https://private-c31a5-task27.apiary-mock.com/videos', {
            method: 'GET'
            //Request Type 
        });
        const listResponse = yield response.json();
        return listResponse;
    }catch(err){
        console.log(err);
        return err;
    }
}

export default {
    getListFromApi
}
