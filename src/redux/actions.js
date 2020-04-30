//action creator函数模块
import {SET_HEAD_TILE, RECEIVE_USER, SHOW_ERROR_MSG, RESET_USER} from './action-types'
import {reqLogin} from '../api'
import {message} from "antd";
import storageUtils from "../utils/storageUtils";

//设置头部同步action
export const setHeadTitle = (headTitle) => ({
    type: SET_HEAD_TILE, data:headTitle
})

//接收user的同步action
export const receiveUser = (user) => ({
    type: RECEIVE_USER, user
})

//错误信息的同步action
export const showErrorMsg = (errorMsg) => ({
    type: SHOW_ERROR_MSG, errorMsg
})

//退出登录的同步action
export const logout = () => {
    //删除local中的user
    storageUtils.removeUser()
    //返回action对象
    return {type: RESET_USER}
}

//登录的异步action
export const login = (username, password) => {
    return async dispatch => {
        //1.执行异步ajax请求
        const result = await reqLogin(username, password)
        //2.1成功
        if(result.status===0){
            const user = result.data
            //保存到local中
            storageUtils.saveUser(user)
            //分发接收用户的同步action
            dispatch(receiveUser(user))
        }
        //2.2失败
        else{
            const msg = result.msg
            //message.error(msg)
            dispatch(showErrorMsg(msg))
        }
    }
}

//显示错误信息的同步action