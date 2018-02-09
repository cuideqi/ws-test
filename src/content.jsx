import React from 'react';
import { Form, FormGroup, ControlLabel, Button, FormControl, OverlayTrigger,Col  } from 'react-bootstrap';
import { Login } from './login';
const reg = /^wss?:\/\/(([a-zA-Z0-9_-])+(\.)?)*(:\d+)?(\/((\.)?(\?)?=?&?[a-zA-Z0-9_-](\?)?)*)*$/i;
export class Content extends React.Component {
    ws; // websocket 引用
    heartbeat; // 发送websoket心跳包
    captchaData = {
        tag: 888,
        url: '/p/Captcha/get',
        data: {
            type: 'loginCaptcha'
        }
    }; // 验证码信息
    constructor(props) {
        super(props);
        this.state = {
            url: 'ws://192.168.0.96:9502',
            message: '',
            wsStatus: '未连接！！！',
            response: '',
            base64Url: '',
            islogined: false,
            loginedInfo: {}
        }
        this.handleCloseWs = this.handleCloseWs.bind(this);
        this.handleConnectWs = this.handleConnectWs.bind(this);
        this.handleRequest = this.handleRequest.bind(this);
        this.handleResetUrl = this.handleResetUrl.bind(this);
    }

    getResponse() {
        this.ws.addEventListener('message', (evt) => {
            if(evt.data) {
                const data = JSON.parse(evt.data);
                if(data.tag === 222) {
                    this.setState({
                        islogined: true,
                        loginedInfo: data.data.roles
                    });
                }else if(data.tag === 888) {
                    let url;
                    url = evt.data ? JSON.parse(evt.data).data : ''; 
                    this.setState({
                        base64Url: url
                    });
                }else {
                    if(data.tag === 111) {
                        this.setState({
                            response: ''
                        });
                    }else {
                        this.setState({
                            response: JSON.stringify(data)
                        });
                    }
                }
            }
        }, false);
    }
    // 连接ws
    handleConnectWs() {
        if(this.heartbeat) {
            clearInterval(this.heartbeat);
        }
        if(reg.test(this.state.url)) {
            this.ws = new WebSocket(this.state.url);
            this.ws.addEventListener('open', () => {
                this.setState({
                    wsStatus: '已连接！！！'
                });
                this.ws.send(JSON.stringify(this.captchaData));
                this.heartbeat = setInterval(() => {
                    this.ws.send('+ping+');
                },18000);
            }, false);
            this.getResponse();
        }else {
            this.setState({
                wsStatus: '地址格式错误！！！'
            });
        }   
    }

    // 断开ws
    handleCloseWs() {
        this.ws.close();
        this.ws.addEventListener('close', () => {
            this.setState({
                wsStatus: '未连接！！！',
                islogined: false,
                base64Url: ''
            });
        }, false);
    }

    // 发送请求数据
    handleRequest() {
        if(this.ws) {
            this.ws.send(this.state.message);
        }else {
            alert('websocket 未连接！！！');
        }      
    }

    // 重置ws url
    handleResetUrl() {
        if(this.ws) {
            this.ws.close();
        }
        this.setState({
            url: '',
            wsStatus: '未连接！！！',
            islogined: false,
            base64Url: ''
        });
    }

    urlChange(evt) {
        evt.target ? this.setState({ url: evt.target.value}) : '';
    }

    textChange(evt) {
        evt.target ? this.setState({ message: evt.target.value}) : '';
    }

    render() {
        return (
            <div>
                <Col md={6} mdPull={6}>
                    <Form inline>
                        <FormGroup>
                            <ControlLabel>URL: </ControlLabel>
                            <FormControl type="text" className="ws-url" defaultValue={this.state.url} onChange={(event) => {
                                this.urlChange(event);
                            }}/>
                        </FormGroup>
                        <Button  bsStyle="info" onClick={this.handleConnectWs}>
                            连接
                        </Button>
                        <Button bsStyle="danger" onClick={this.handleCloseWs} disabled={this.state.wsStatus === '已连接！！！' ? false : true}>
                            断开
                        </Button>
                        <Button type="reset" bsStyle="warning" onClick={this.handleResetUrl}>
                            清空
                        </Button>
                    </Form>
                    <div className={this.state.wsStatus === '已连接！！！' ? 'ws-status' : 'ws-status red'}>websocket{this.state.wsStatus}</div>
                    <Form className="message-content">
                        <FormGroup controlId="formControlsTextarea">
                            <ControlLabel>请求内容</ControlLabel>
                            <FormControl componentClass="textarea" placeholder="textarea" onChange={(event) => {
                                this.textChange(event);
                            }}/>
                        </FormGroup>
                    </Form>
                    <Button type="reset" bsStyle="primary" onClick={this.handleRequest} className="sent-message">
                        发送
                    </Button>
                </Col>
                <Col md={6} mdPush={6}>
                    <Login imgsrc={this.state.base64Url} ws={this.ws} islogined={this.state.islogined} tokenInfo={this.state.loginedInfo}/>
                    <Form className="message-content">
                        <FormGroup controlId="formControlsTextareaRecive">
                            <ControlLabel>收到信息</ControlLabel>
                            <FormControl componentClass="textarea" placeholder="textarea" value={this.state.response.toString()}/>
                        </FormGroup>
                    </Form>
                </Col>
            </div>
        )
    }
}