import * as Action from '../action';
import {call,put,takeLatest} from 'redux-saga/effects';
import Api from './Api';

function* getList(data){
    try{
        const response = yield Api.getListFromApi();
        if(response && response.videos){
            yield put({type:Action.SET_LIST,data:response.videos});
        }
        yield call(data.data.onDone,response);

    }catch(err){
        console.log(err);
        call(data.data.onDone,err);
    }
}

export function* watchApiCall(){
    yield takeLatest(Action.GET_LIST,getList);
}
