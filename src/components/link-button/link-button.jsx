import React, {Component} from 'react'
import './link-button.less'

export default class LinkButton extends Component {
    render() {
        var props = this.props
        return (
            <button {...props} className="link-button"></button>
        )
    }
}
    