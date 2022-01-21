import React, { Component} from "react";
import { Input } from '@progress/kendo-react-inputs';
import { Label } from '@progress/kendo-react-labels';
import { Button} from '@progress/kendo-react-buttons';
import jwt_decode from "jwt-decode";
import back_login from '../assets/images/back_login.png';
import '../assets/scss/login.css';
import axiosInstance from '../api'
class Login extends Component {
    constructor(props) {
        super(props);
        this.state = { 
          height: 768, 
          width: 1280,
          username: "",
          password: "",
          error: false,
        };
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    componentDidMount() {
        
        if (localStorage.getItem("refresh_token") ){
            this.props.history.push('/');
        }
        this.updateWindowDimensions();
        window.addEventListener("resize", this.updateWindowDimensions, false);
    }
    componentWillUnmount() {
        window.removeEventListener("resize", this.updateWindowDimensions, false);
    }
    updateWindowDimensions() {
        this.setState({ width: window.innerWidth >= 1280 ? window.innerWidth : 1280, height: window.innerHeight >= 768 ? window.innerHeight : 768 });
    }
    async handleSubmit(event) {
        event.preventDefault();
        try {
            const data = await axiosInstance.post('/token/obtain/', {
                username: this.state.username,
                password: this.state.password
            });
            console.log(data)
            if(data !== undefined){
                var decoded = jwt_decode(data.data.access)
                console.log(decoded)
                if (decoded.auth_level === 1){
                    axiosInstance.defaults.headers['Authorization'] = "JWT " + data.data.access;
                    localStorage.setItem('user_id', decoded.user_id)
                    localStorage.setItem('username', decoded.username)
                    localStorage.setItem('access_token', data.data.access);
                    localStorage.setItem('refresh_token', data.data.refresh);
                    this.setState({
                        error: false
                    })
                    this.props.history.push('/');
                }else{
                    this.setState({
                        error: true
                    })
                }
                
            }
            
            return data;
        } catch (error) {
            this.setState({
                error: true
            })
            // throw error;
            
        }
    }
    render() {
        return (
            <div className="login" style={{width: "100%", height: this.state.height, backgroundImage: `url(${back_login})`}}>
                <form onSubmit={this.handleSubmit}>

                    <div className="login-box" style={{paddingTop:this.state.height/5}}>
                        <h1>MIDST20 - ADMIN</h1>
                        <div className="login-part">
                            <div className="row">
                                <div className="col-12 text-center">
                                    <Label >Please Enter Your Information</Label>
                                </div>
                                <div className="col-12 text-center">
                                    {this.state.error &&<Label className="text-danger">Please Enter correct information</Label>}
                                </div>
                            </div>
                            <div className="row mt-4">
                                <div className="col-12">
                                    <Input 
                                        style={{ width: "100%" }}
                                        value={this.state.username}
                                        placeholder="Username"
                                        onChange={(e)=>{
                                            this.setState({
                                                username: e.target.value
                                            })
                                        }}
                                        required={true}
                                        
                                    />
                                </div>
                            </div>
                            <div className="row mt-3">
                                <div className="col-12">
                                    <Input 
                                        style={{ width: "100%" }}
                                        value={this.state.password}
                                        placeholder="Password"
                                        type="password"
                                        onChange={(e)=>{
                                            this.setState({
                                                password: e.target.value
                                            })
                                        }}
                                        required={true}
                                    />
                                </div>
                            </div>
                            <div className="row mt-5">
                                <div className="col-12">
                                    <Button style={{width:"100%"}}>Login</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        );
    }
}

export default Login;