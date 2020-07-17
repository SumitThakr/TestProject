import {all,fork} from 'redux-saga/effects';

import {watchApiCall} from './rootSaga';


export default function* rootSaga(){
    yield all([
        fork(watchApiCall)
    ])
}