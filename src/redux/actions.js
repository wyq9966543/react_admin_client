//action creator函数模块
import {SET_HEAD_TILE} from './action-types'

export const setHeadTitle = (headTitle) => ({
    type: SET_HEAD_TILE, data:headTitle
})