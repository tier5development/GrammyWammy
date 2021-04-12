import React, { Component} from "react";
import { Redirect, withRouter } from 'react-router-dom';

import {kyubiExtensionId}  from "../../../config";
import "./login.css";
import AuthServices from "../../../services/authService";
import loginHelper from "../../../helper/loginHelper";
import { NavLink } from "react-router-dom";
import LoaderLogo from "../../../images/Loader.gif";
import logo from "../../../images/Logo_White.svg";
import mail from "../../../images/mail.svg";
import messanger from "../../../images/Messanger.svg";
import path from "../../../images/Path3.svg";
class ForgotPassword extends Component {
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
       handleForgotPasswordFormValidation() {
        let fields = {
        email: this.state.email,
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
        else{
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
        forgotPasswordHandler = async (event) => {
        event.preventDefault();
        event.preventDefault();
        console.log(this.state.email);
        let payload = {
        email: this.state.email
        }
        if (this.handleForgotPasswordFormValidation()) {
            this.setState({ error:false});
            this.setState({errorMessage:""});
            let payload  ={
                extId: kyubiExtensionId,
                email: this.state.email
            }
            await AuthServices.forgotPassword(payload).then(async result=>{
                console.log("This I gggggggg",result);
                localStorage.setItem('token', result.data.token);
                localStorage.setItem('inBackgroundFetching', true);
                if(result.data.code === 1){

                    this.setState({ loader: false });
                    this.setState({successMessage:result.data.message});
                    this.setState({ success:true});
                    this.setState({ error:false});
                    
                }else{
                this.setState({ loader: false });
                this.setState({errorMessage:"User not found or In-Active"});
                this.setState({ error:true});
                this.setState({ success:false});
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
            <div>
            {this.state.loader && (   
            <div class="after_login_refresh"><img src={LoaderLogo} alt=""/></div>
            )}
            <div className="loginscreen">
            <div className="graphics1"></div>
            <div className="graphics2"></div>
            <div className="logo"><img src={logo} /></div>
            <div className="login_container">
                <div className="login_welcome_block">
                    Welcome,
                    <h3>Please provide your email!</h3>
                </div>
                <div className="login_block">
                        <form>
                            <label>
                                <span><img src={mail}/></span>
                                <input 
                                name="email"
                                id="email"
                                type="email"
                                placeholder="Email Address"
                                onChange={this.inputChangeHandller}
                                />
                            </label>
                            
                            <div className="text-right gap1">
                                <NavLink  to="/">
                                    <p className="link">Login</p>
                                </NavLink>
                            </div>
                            <button type="button" className="blue_btn" onClick={this.forgotPasswordHandler} >SUBMIT</button>
                            <div className="login_signup">
                                Don’t have an account? <a href="#">Sign up</a>
                            </div>
                            {this.state.error && ( 
                                <div className="error"> {this.state.errorMessage} *</div>
                            )}
                            {this.state.success && ( 
                                <div class="text-success">{this.state.successMessage}</div> 
                            )}  
                        </form>
                </div>  
                <div className="footer">
                    <p>Powered by <a href="#">Tier5</a> and the <a href="#">Tier5 Partnership</a></p>
                    <a href="#"><img src={path}/></a> <a href="#"><img src={messanger}/></a>
                </div>
            </div>
        </div>
        </div>
        );
    }
}
export default ForgotPassword;