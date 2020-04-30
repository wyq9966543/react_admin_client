import React, {Component} from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import { Layout } from 'antd'
import {connect} from 'react-redux'

import LeftNav from "../../components/left-nav/left-nav"
import Header from "../../components/header/header"

import Home from '../home/home'
import Category from "../category/category"
import Product from '../product/product'
import Role from '../role/role'
import User from "../user/user"
import line from "../charts/line"
import bar from "../charts/bar"
import pie from "../charts/pie"


const { Footer, Sider, Content } = Layout

class Admin extends Component {
    render() {
        const user = this.props.user
        //如果内存没存user ==》 当前没有登录
        if(!user || !user._id) {
            //自动跳转到登录界面
            return <Redirect to='/login'/>
        }
        return (
                <Layout style={{minHeight: '100%'}}>
                    <Sider>
                        <LeftNav/>
                    </Sider>
                    <Layout>
                        <Header>Header</Header>
                        <Content style= {{margin: 20, backgroundColor: '#fff'}}>
                            <Switch>
                                <Route path='/home'component={Home}/>
                                <Route path='/category'component={Category}/>
                                <Route path='/product'component={Product}/>
                                <Route path='/user'component={User}/>
                                <Route path='/charts/bar'component={bar}/>
                                <Route path='/charts/line'component={line}/>
                                <Route path='/charts/pie'component={pie}/>
                                <Route path='/role'component={Role}/>

                                <Redirect to='/home'/>
                            </Switch>
                        </Content>
                        <Footer style={{textAlign: 'center', color: '#cccccc'}}>推荐使用谷歌浏览器</Footer>
                    </Layout>
                </Layout>
        )
    }
}

export default connect(
    state => ({user:state.user}),
    {}
)(Admin)