//reducer函数模块

import storageUtils from "../utils/storageUtils";
import {SET_HEAD_TILE} from './action-types'
import {combineReducers} from "redux";

const initHeadTitle = '首页'
function headTitle(state=initHeadTitle, action) {
    switch (action.type) {
        case SET_HEAD_TILE:
            return action.data
        default:
            return state
    }
}

const initUser = storageUtils.getUser()
function user(state=initUser, action) {
    switch (action.type) {
        default:
            return state
    }
}


export  default combineReducers({
    headTitle,
    user
})