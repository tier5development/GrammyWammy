import React, { Component} from "react";
import { Redirect, withRouter } from 'react-router-dom';

import {kyubiExtensionId}  from "../../../config";
import "./login.css";
import AuthServices from "../../../services/authService";
import loginHelper from "../../../helper/loginHelper";
import { NavLink } from "react-router-dom";
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
        <div className="overlay">
            <i className="fas fa-2x fa-sync-alt fa-spin"></i>
        </div>
        )}
        
        
        <div className="login-html">
            <p className="login-box-msg">Forgot Password</p>
            <form>
                <div className="input-group mb-3">
                    <input 
                    className="form-control" 
                    name="email"
                    id="email"
                    type="email"
                    placeholder="Email Address"
                    onChange={this.inputChangeHandller}
                    />
                    <div className="input-group-append">
                        <div className="input-group-text">
                            <span className="fas fa-envelope"></span>
                        </div>
                    </div>
                </div>
                
                <div className="row"> 
                {this.state.error && ( 
                <p class="text-danger">{this.state.errorMessage}</p> 
                )}
                {this.state.success && ( 
                <p class="text-success">{this.state.successMessage}</p> 
                )}             
                <div class="col-12">
                    <button 
                    type="button" 
                    className="btn btn-primary btn-block"
                    onClick={this.forgotPasswordHandler}
                    >Submit</button>
                </div>
                <NavLink  to="/">
                    <p>Login</p>
                </NavLink>

                   
                </div>
            </form>
        </div>
        </div>
        );
    }
}
export default ForgotPassword;