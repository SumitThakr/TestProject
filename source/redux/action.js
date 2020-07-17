export const GET_LIST = "GET_LIST";
export const SET_LIST = "SET_LIST";

export const getUserList = (data) => {
    return {
        type: GET_LIST,
        data
    }
}