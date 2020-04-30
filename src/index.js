import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import {Provider} from 'react-redux'

import store from "./redux/store";
import App from './app'

//渲染虚拟DOM
ReactDOM.render((
    <Provider store={store}>
        <App />
    </Provider>
    ), document.getElementById('root'))
