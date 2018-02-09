import React from 'react';
import { Header } from './header';
import { Content } from './content'
export default class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
       return this.getRootDom();
    }

    getRootDom() {
        return (
            <div className="rootDiv">
                <Header title="WebSocket 在线测试V1" author=" by cdq..."/>
                <Content />
            </div>

        )
    }
}