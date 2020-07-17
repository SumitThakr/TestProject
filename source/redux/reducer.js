import * as Action from './action';

const initialState = {
    list: []
}

export const rootReducer = (state = initialState,action) => {
    switch(action.type){
        case Action.SET_LIST:
            return {
                list: [...action.data]
            }
        default:
            return state;
    }
}