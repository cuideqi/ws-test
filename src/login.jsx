import React from 'react';
import { Form, FormControl, FormGroup, Col, Button, ControlLabel, Image,ButtonToolbar } from 'react-bootstrap';

export class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hascaptcha: false,
            name: '',
            password: '',
            captcha: '',
            role: {
                youshangjiao: true,
                partner: true,
                layer: true
            },

        }
        this.nameChange = this.nameChange.bind(this);
        this.passwordChange = this.passwordChange.bind(this);
        this.codeChange = this.codeChange.bind(this);
        this.choseLayer = this.choseLayer.bind(this);
        this.chosePartner = this.chosePartner.bind(this);
        this.choseYoushangjiao = this.choseYoushangjiao.bind(this);
    }

    Login(ws) {
        const  userData = JSON.stringify({
            tag: 222,
            url: '/p/User/authAccount',
            data: {
                account: this.state.name,
                password: this.state.password,
                captcha: this.state.captcha
            }
        });
        ws.send(userData);
    }

    nameChange(evt) {
        this.setState({
            name: evt.target.value
        });
    }

    passwordChange(evt) {
        this.setState({
            password: evt.target.value
        });
    }

    codeChange(evt) {
        this.setState({
            captcha: evt.target.value
        });
    }

    choseYoushangjiao() {
        this.setState({
            role: {
                youshangjiao: true,
                partner: false,
                layer: false
            }
        });
        const token = this.props.tokenInfo.filter((value) => value.type === 1 )[0].token;
        const data = JSON.stringify(this.getToken(token));
        this.props.ws.send(data);
    }

    chosePartner() {
        this.setState({
            role: {
                youshangjiao: false,
                partner: true,
                layer: false
            }
        });
        const token = this.props.tokenInfo.filter((value) => value.type === 2 )[0].token;
        const data = JSON.stringify(this.getToken(token));
        this.props.ws.send(data);
    }

    choseLayer() {
        this.setState({
            role: {
                youshangjiao: false,
                partner: false,
                layer: true
            }
        });
    }

    getToken(token) {
        return {
            tag: 111,
            url: '/p/User/loginByToken',
            data: {
                token: token,
                version: 'develop-version'
            } 
        };
    }

    render() {
        setTimeout(() => {
            this.setState({hascaptcha: true});
        });
        return ( !this.props.islogined ?
            <div className="user-login">
                <Form inline className="name-password">
                    <FormGroup controlId="formInlineName">
                        <ControlLabel>用户名</ControlLabel>
                        <FormControl type="text" placeholder="username" onChange={this.nameChange}/>
                    </FormGroup>
                    <FormGroup controlId="formInlinePassword">
                        <ControlLabel className="password">密码</ControlLabel>
                        <FormControl type="password" placeholder="password" onChange={this.passwordChange}/>
                    </FormGroup>
                </Form>
                <Form inline >
                    <FormGroup controlId="formInlineEmail">
                        <ControlLabel>验证码</ControlLabel>
                        <FormControl type="text" placeholder="请输入验证码" onChange={this.codeChange}/>
                    </FormGroup>
                    <Col xs={4} md={3}>
                        {
                            this.state.hascaptcha && <Image src={this.props.imgsrc} circle />
                        }  
                    </Col>
                    <Button onClick={(evt) => {
                        evt.preventDefault();
                        this.Login(this.props.ws);
                    }}>
                        登录
                    </Button>
                </Form>
            </div>
          : <div className="user-type">
                <span>用户已登录，请选择角色！</span>
                <ButtonToolbar>
                    {/* 提供重要视觉感知及标识重要操作的按钮 */}
                    <Button bsStyle="primary" onClick={this.choseYoushangjiao} disabled={!this.state.role.youshangjiao}>右上角</Button>

                    {/* 指示成功或正面操作按钮 */}
                    <Button bsStyle="warning" onClick={this.chosePartner} disabled={!this.state.role.partner}>权利人</Button>

                    {/* 提醒操作需要小心使用 */}
                    <Button bsStyle="success" onClick={this.choseLayer} disabled={!this.state.role.layer}>律师端</Button>
                </ButtonToolbar>
          </div>);
    }
}