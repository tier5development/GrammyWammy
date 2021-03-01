import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import "../Auth/login.css";
import "./setting.css";
import SettingServices from "../../../services/setting";
import Sidebar from "../Common/sidebar";
import  {CheckUserInfoFromFaccebook} from  '../../../helper/helper'
class setting extends Component {
    constructor(props) {
      super(props)
      this.state = {
        defaultmessage:0,
        default_time_delay:0,
        default_message_text:"",
        autoresponder: 0,
        loader:true
      }
    }
    /**
    * @inputChangeHandller 
    * getting input field values
    */
   inputChangeHandller = (event) => {
    this.setState({ [event.target.name]: event.target.value })
    }
    
   autoSetting = () => {
        console.log("hiyy",this.state.defaultmessage )
        if(this.state.defaultmessage === 0){
            this.setState({defaultmessage:1})
        }else{
            this.setState({defaultmessage:0})
        }
    }
    autoRespoSetting = () => {
        console.log("hiyy",this.state.autoresponder )
        if(this.state.autoresponder === 0){
            this.setState({autoresponder:1})
        }else{
            this.setState({autoresponder:0})
        }
    }
    /**
    * @handleLoginFormValidation 
    * email and password field blank validation
    */
    handleFormValidation() {
        let payload = {
            defaultmessage: this.state.defaultmessage,
            default_time_delay: this.state.default_time_delay,
            default_message_text: this.state.default_message_text,
            autoresponder:this.state.autoresponder,
            kyubi_user_token:localStorage.getItem("kyubi_user_token")
        }
        let formIsValid = true;
        if(payload["defaultmessage"] ===  1){
            console.log("Ya Ya Ya Ya");
            if(isNaN(payload["default_time_delay"])){
             console.log("Is not a number");
             return false;
            }else if(payload["default_message_text"]){
                console.log("Is have no test");
             return false;
            }
            else{
                return true;
            }
        }
    }
    submitHandler = async (event) => {
        this.setState({loader:true});
        event.preventDefault();        
        let payload = {
            defaultmessage: this.state.defaultmessage,
            default_time_delay: this.state.default_time_delay,
            default_message_text: this.state.default_message_text,
            autoresponder:this.state.autoresponder,
            kyubi_user_token:localStorage.getItem("kyubi_user_token")
        }
        console.log("This are payload",payload);
        await SettingServices.setSetting(payload).then(async result=>{
            console.log("Setttttttttttttttttttttt",result);
            if(result.data.code==1){
                let responsenewvalue =result.data;
                console.log("Autoresponder  is ------------",responsenewvalue.payload.UserSettings.autoresponder);
                localStorage.setItem('kyubi_user_token', responsenewvalue.payload.UserInfo.kyubi_user_token);
                localStorage.setItem('user_id', responsenewvalue.payload.UserInfo.user_id);
                localStorage.setItem('fb_id', responsenewvalue.payload.UserInfo.facebook_id);
                localStorage.setItem('fb_username', responsenewvalue.payload.UserInfo.facebook_name);
                localStorage.setItem('fb_name', responsenewvalue.payload.UserInfo.facebook_profile_name);
                localStorage.setItem('fb_image', responsenewvalue.payload.UserInfo.facebook_image);
                localStorage.setItem('default_message', responsenewvalue.payload.UserSettings.default_message);
                localStorage.setItem('default_message_text', responsenewvalue.payload.UserSettings.default_message_text);
                localStorage.setItem('autoresponder', responsenewvalue.payload.UserSettings.autoresponder);
                localStorage.setItem('default_time_delay', responsenewvalue.payload.UserSettings.default_time_delay);
                localStorage.setItem('keywordsTally', JSON.stringify(responsenewvalue.payload.AutoResponderKeywords));
                this.setState({loader:false});
                if(responsenewvalue.payload.UserSettings.autoresponder === 1){
                    CheckUserInfoFromFaccebook();
                }
                
                
              }else{
                this.setState({loader:false});  
              }
            
            
        }).catch(error=>{
            console.log(error);
            this.setState({loader:false});
        });
        

    }
    
    componentDidMount(){
        let payload = {

            kyubi_user_token:localStorage.getItem("kyubi_user_token")
        }
        SettingServices.getSetting(payload).then(async result=>{
            console.log(result);
            if(result.data.code===1){
                this.setState({
                    defaultmessage:result.data.payload.default_message,
                    default_time_delay:result.data.payload.default_time_delay,
                    default_message_text:result.data.payload.default_message_text,
                    autoresponder: result.data.payload.autoresponder,
                    loader:false
                })
            }else{
                this.setState({loader:false});
            }
            //console.log(result);
        }).catch(error=>{
            //console.log(error);
            this.setState({loader:false});
        }); 

    }
    render() {
        return (
            <div className="wrapper">
                {this.state.loader ?   
                    <div className="overlay">
                    <i className="fas fa-2x fa-sync fa-spin"> </i>
                    
                    
                    <p className="text-success lodclass">Loading ........</p>
                    </div>
                :
                    <div>                
                        <Sidebar  selectedtab="setting"></Sidebar>
                        <div className="content-wrapper">
                        <section className="content-header">
                            <div className="container-fluid">
                                <div className="row mb-12">
                                    <div className="col-sm-6">
                                    <h1>Settings</h1>
                                    </div>
                                </div>
                            </div>
                        </section>
                        <section className="content">
                            <div className="container-fluid">
                                <div className="row">
                                    <div className="col-md-12">
                                    
                                    <div className="card card-primary">
                                        <div className="card-header">
                                            <h3 className="card-title">Settings
                                            
                                            </h3>
                                        </div>
                                        <form>
                                        <div className="card-body">
                                            

                                            <div className="form-group clearfix">
                                                <div className="icheck-success d-inline">
                                                {this.state.defaultmessage ?  
                                                    <input type="checkbox" id="checkboxPrimary3" name="defaultmessage" onChange={this.autoSetting} checked/>
                                                    :
                                                    <input type="checkbox" id="checkboxPrimary3" name="defaultmessage" onChange={this.autoSetting} />
                                                }  
                                                <label for="checkboxPrimary3">
                                                    Activate Default Message
                                                </label>
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <label for="exampleInputEmail1">Default  Message</label>
                                                <textarea name="default_message_text" value={this.state.default_message_text} onChange={this.inputChangeHandller} className="form-control" rows="3" name="default_message_text" placeholder="Enter ..."></textarea>
                                            </div>
                                            <div className="bootstrap-timepicker">
                                                <div className="form-group">
                                                    <label>Time Interval For Default Message:</label>
                                                        <div className="input-group date" id="timepicker" data-target-input="nearest">
                                                            <input type="number" onChange={this.inputChangeHandller} className="form-control datetimepicker-input" name="default_time_delay"  value={this.state.default_time_delay} data-target="#timepicker"/>
                                                            <div className="input-group-append" data-target="#timepicker" data-toggle="datetimepicker">
                                                                <div className="input-group-text">
                                                                    <i className="far fa-clock"></i>
                                                                </div>
                                                            </div>
                                                        </div>
                                                </div>
                                            </div>
                                            <div className="form-group clearfix">
                                            <div className="icheck-success d-inline">
                                            {this.state.autoresponder ?  
                                                <input type="checkbox" id="checkboxPrimary2" name="autoresponder" onChange={this.autoRespoSetting} checked/>
                                                :
                                                <input type="checkbox" id="checkboxPrimary2" name="autoresponder" onChange={this.autoRespoSetting} />
                                            }  
                                            <label for="checkboxPrimary2">
                                                Activate Auto-Responder
                                            </label>
                                            </div>
                                        </div>
                                        </div>           
                                        <div className="card-footer">
                                        <button type="submit" className="btn btn-primary"  onClick={this.submitHandler} >Submit</button>
                                        </div>
                                        </form>
                                    </div>

                                    </div>
                                </div>
                            </div>
                        </section>
                        </div>
                    </div>
                }
            
            </div>
        );
    }
}

export default setting;