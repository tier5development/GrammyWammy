import React, { Component} from "react";
import { Redirect, withRouter } from 'react-router-dom';
import {kyubiExtensionId}  from "../../../config";
//import "./login.css";
import AuthServices from "../../../services/authService";
import loginHelper from "../../../helper/loginHelper";
import { NavLink } from "react-router-dom";
class Login extends Component {
    constructor(props) {
        super(props)
        this.state = {
          email:"",
          password:"",
          loader:false,
          error:false,
          errorMessage:"",
          loadingstatus:false
        }
        

      }
    /**
    * @inputChangeHandller 
    * getting input field values
    */
    inputChangeHandller = (event) => {
        this.setState({ [event.target.name]: event.target.value })
    }
    /**
    * @checkBackgroundFetching 
    * Check  Wether Background Fetching is  done or not
    */
    checkBackgroundFetching() {
            // setInterval(() => {
            //     let inBackgroundFetching=localStorage.getItem('inBackgroundFetching');
            //     console.log("This check ++++++++++",inBackgroundFetching);
            //     if(inBackgroundFetching !== "true"){
            //         console.log("This check 111++++++++++",inBackgroundFetching);
            //         this.props.history.push('/dashboard');       
                               
            //     }
            // },2000);
        }
    /**
    * @handleLoginFormValidation 
    * email and password field blank validation
    */
    handleLoginFormValidation() {
        let fields = {
        email: this.state.email,
        password: this.state.password,
        };
        
        let formIsValid = true;
        let emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        let checkResult = emailRegex.test(String(this.state.email).toLowerCase());
        if (!fields["email"]) {
        formIsValid = false;
        this.setState({errorMessage:"Email Is Required"});
        return formIsValid;
        } else if (checkResult === false) {
        formIsValid = false;
        this.setState({errorMessage:"Please enter a proper email"});
        return formIsValid;
        }
        else if (!fields["password"]) {
        formIsValid = false;
        this.setState({errorMessage:"Password Is Required"});
        return formIsValid;
        }else{
            formIsValid = true;
            return formIsValid;
        }
        
        return formIsValid;
    }
     /**
    * @loginHandler 
    * in this function we are checking the email id, password
    * and if the details are correct then login them and also take care about the remember password one
    */
    loginHandler = async (event) => {
        event.preventDefault();
        event.preventDefault();
        let payload = {
        email: this.state.email,
        password: this.state.password,
        }
        if (this.handleLoginFormValidation()) {
            this.setState({ error:false});
            this.setState({errorMessage:""});
            this.setState({ loader: true });
            let payload  ={
                extensionId: kyubiExtensionId,
                email: this.state.email,
                password: this.state.password,
            }
            await AuthServices.login(payload).then(async result=>{
                console.log("This I gggggggg",result);
                localStorage.setItem('token', result.data.token);
                localStorage.setItem('inBackgroundFetching', true);
                localStorage.setItem('userEmail', this.state.email);
                if(result.data.code === 1){
                    let LC=loginHelper.login();
                    setTimeout(() => {
                        this.props.history.push('/dashboard');
                        console.log("sorry");
                    }, 3000);
                }else{
                this.setState({ loader: false });
                this.setState({errorMessage:"User not found or In-Active"});
                this.setState({ error:true});
                }
                
                //this.checkBackgroundFetching();
                 //console.log(LC);
                 
                //history.push("/dashboard");
            }).catch(error=>{
                console.log(error);
                this.setState({ loader: false });
                this.setState({errorMessage:"User not found or In-Active"});
                this.setState({ error:true});
            });
            


        }else{
            this.setState({ error:true});

        }
        //this.setState({ loader: false });
    }

    componentDidMount(){
        this.setState({ loader: true });
        let token=localStorage.getItem('token');
        let inBackgroundFetching=localStorage.getItem('inBackgroundFetching');
        if(token){
            if(inBackgroundFetching !== "true"){
                this.props.history.push('/dashboard');    
            }else{
                this.setState({ loader: false });
            }
        }else{
            this.setState({ loader: false });
        }
        
    }

    render() {
        
        return (
               <div className="login_screen_width">
                   {this.state.loader && (   
                    <div className="overlay">
                       <img src="images/ajax-loader.gif"></img>
                    </div>
                    )}
                <div className="loginscreen">
                        <div className="graphics1"></div>
                        <div className="graphics2"></div>
                        <div className="logo"><img src="images/logo1.svg"></img></div>
                            <div className="login_container">
                                <div className="login_welcome_block">
                                    Welcome,
                                        <h3>Login to continue!</h3>
                                </div>
                                <div className="login_block">
                                    <form>
                                        <label>
                                        <span><img src="images/mail.svg"></img></span>
                                        <input type="text" name="email" id="email" placeholder="Email Address"   onChange={this.inputChangeHandller}/>
                                        </label>
                                        <label>
                                            <span><img src="images/lock.svg"></img></span>
                                            <input type="password" name="password" id="password" placeholder="Enter your password" onChange={this.inputChangeHandller}/>
                                        </label>
                                        {this.state.error && ( 
                                             <p class="text-danger">{this.state.errorMessage}</p> 
                                         )} 
                                        <div className="text-right gap1"><a href="#" class="link">Forgot Password?</a></div>
                                        <button className="blue_btn" type="button" onClick={this.loginHandler}>LOGIN</button>
                                        <div className="login_signup">Don’t have an account? <a href="#">Sign up</a></div>
                                    </form>
                                </div>
                                <div className="footer">
                                    <p>Powered by <a href="#">Tier5</a> and the <a href="#">Tier5 Partnership</a></p>
                                    <a href="#"><img src="images/Path3.svg"></img></a> <a href="#"><img src="images/Messanger.svg"></img></a>
                               </div>
                            </div>    
                        </div>
                    </div>
        );
    }
}
export default Login;