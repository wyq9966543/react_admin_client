import React, {Component} from 'react'
import {withRouter} from 'react-router-dom'
import { Modal} from 'antd'

import LinkButton from "../link-button/link-button"
import {reqWeather} from '../../api/index'
import menuList from "../../config/menuConfig"
import {formateDate} from '../../utils/dateUtils'
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'
import './header.less'

class Header extends Component {

    state = {
        currentTime: formateDate(Date.now()), // 当前时间字符串
        dayPictureUrl: '', // 天气图片url
        weather: '', // 天气的文本
    }

    getTime = () => {
        this.intervalId = setInterval(() => {
            const currentTime = formateDate(Date.now())
            this.setState({currentTime})
        },1000)
    }

    getWeather = async () => {
        //调用接口请求函数异步获取数据
        const {dayPictureUrl, weather} = await reqWeather('深圳')
        this.setState({dayPictureUrl, weather})
    }

    getTitle = () => {
        //得到当前请求路径
        const path = this.props.location.pathname
        let title
        menuList.forEach(item => {
            if(item.key===path){ // 如果当前item对象的key与path一样,item的title就是需要显示的title
                title = item.title
            } else if (item.children) {// 在所有子item中查找匹配的
                //const cItem = item.children.find(cItem => true)
                const cItem = item.children.find(cItem => path.indexOf(cItem.key)===0)
                if (cItem) { // 如果有值才说明有匹配的
                    title = cItem.title // 取出它的title
                }
            }
        })
        return title
    }

    Logout = () => {
        // 显示确认框
        Modal.confirm({
            content: '确定退出吗?',
            onOk: () => {
                console.log('OK', this)
                // 删除保存的user数据
                storageUtils.removeUser()
                memoryUtils.user = {}
                // 跳转到login
                this.props.history.replace('/login')
            }
        })
    }

    componentDidMount() {
        this.getTime()
        this.getWeather()
    }

    /*
    当前组件卸载之前调用
   */
    componentWillUnmount () {
        // 清除定时器
        clearInterval(this.intervalId)
    }

    render() {
        const username = memoryUtils.user.username
        const {currentTime, dayPictureUrl, weather} = this.state
        const title = this.getTitle()
        return (
            <div className='header'>
                <div className='header-top'>
                    <span>欢迎, {username}</span>
                    <LinkButton onClick={this.Logout}>退出</LinkButton>
                </div>
                <div className='header-bottom'>
                    <div className='header-bottom-left'>{title}</div>
                    <div className='header-bottom-right'>
                        <span>{currentTime}</span>
                        <img src={dayPictureUrl} alt="weather"/>
                        <span>{weather}</span>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(Header)
    