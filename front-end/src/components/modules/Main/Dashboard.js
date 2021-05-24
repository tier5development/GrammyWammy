/* eslint-disable no-undef */
import React, { Component } from 'react';
import { Redirect, withRouter } from 'react-router-dom'
import  {OpenFacebookInTab,CheckUserInfoFromFaccebook,OpenFacebookProfileInTab,refreshMessaging} from  '../../../helper/helper'
import Header from "../Common/header";
import Footer from "../Common/footer";
import settingService from "../../../services/setting";
import AuthServices from "../../../services/authService";
import biglogo from "../../../images/biglogo.svg";
import RefreshLogo from "../../../images/layer1.svg";
import FaceBookLogo from "../../../images/Instagram.png";
import IconLogo from "../../../images/icon.svg";
import AvatarLogo from "../../../images/Avatar.png";
import LoaderLogo from "../../../images/Loader.gif"
class Dashboard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      fb_image:AvatarLogo,
      fb_name:"XXXXX",
      fb_username:"",
      fb_id:"",
      fb_logged_id:"",
      autoresponder:"0",
      default_message:"0",
      loader:true,
      is_user_logged_in_facebook:"false"
    }
  }

  fbHandler = async (event) => {
    event.preventDefault();
    let fb_logged_id=localStorage.getItem('insta_logged_id');
    console.log("You Are Loged in",fb_logged_id);
    if(fb_logged_id === "false"){
      OpenFacebookInTab();
    }else{
      OpenFacebookProfileInTab();
    }
  }
  autoresponderHandler  = async (event) =>{
  }
  refreshHandler  = async (event) =>  {
    event.preventDefault();
    refreshMessaging();
  //   this.setState({
  //     loader:true
  //   })
  //  // CheckUserInfoFromFaccebook();
  //   setTimeout(() => {

  //     let fb_image=localStorage.getItem('insta_image');
  //     let fb_username=localStorage.getItem('insta_username');
  //     let fb_name=localStorage.getItem('insta_name');
  //     let fb_id=localStorage.getItem('insta_id');
      
  //     this.setState({
  //       fb_image:fb_image,
  //       fb_username:fb_username,
  //       fb_name:fb_name,
  //       fb_id:fb_id,
  //       is_user_logged_in_facebook:localStorage.getItem('insta_logged_id'),
  //       loader:false
  //     })

  //   }, 4000);
  }
  componentDidMount(){
    let  params ={
      user_rec    :   localStorage.getItem('kyubi_user_token')
      };
      AuthServices.userRetrive(params).then(result=>{
        console.log("This I got From backGround SUSSSSS",result);
        if(result.data.code==1){
                  let responsenewvalue =result.data;
                  localStorage.setItem('kyubi_user_token', responsenewvalue.payload.UserInfo.kyubi_user_token);
                  localStorage.setItem('user_id', responsenewvalue.payload.UserInfo.user_id);
                  localStorage.setItem('insta_id', responsenewvalue.payload.UserInfo.instagram_fbid);
                  localStorage.setItem('insta_username', responsenewvalue.payload.UserInfo.instagram_profile_name);
                  localStorage.setItem('insta_name', responsenewvalue.payload.UserInfo.instagram_name);
                  localStorage.setItem('insta_image', responsenewvalue.payload.UserInfo.instagram_image);
                  
                  if(responsenewvalue.payload.UserSettings.default_message){
                    localStorage.setItem('default_message', responsenewvalue.payload.UserSettings.default_message);
                  }else{
                    localStorage.setItem('default_message', 0);
                  }
                  if(responsenewvalue.payload.UserSettings.default_message_text){
                    localStorage.setItem('default_message_text', responsenewvalue.payload.UserSettings.default_message_text);
                  }else{
                    localStorage.setItem('default_message_text',"");
                  }
                  if(responsenewvalue.payload.UserSettings.autoresponder){
                    localStorage.setItem('autoresponder', responsenewvalue.payload.UserSettings.autoresponder);
                    
                  }else{
                    localStorage.setItem('autoresponder', 0);
                  }
                  if(responsenewvalue.payload.UserSettings.default_time_delay){
                    localStorage.setItem('default_time_delay', responsenewvalue.payload.UserSettings.default_time_delay);
                  }
                  
                  localStorage.setItem('keywordsTally', JSON.stringify(responsenewvalue.payload.AutoResponderKeywords));
                  this.setState({
                        fb_image:localStorage.getItem('insta_image'),
                        fb_name:localStorage.getItem('insta_name'),
                        fb_username:localStorage.getItem('insta_username'),
                        is_user_logged_in_facebook:localStorage.getItem('insta_logged_id')
                  });
                  
        }else{
          this.setState({
            fb_image:localStorage.getItem('insta_image'),
            fb_name:localStorage.getItem('insta_name'),
            fb_username:localStorage.getItem('insta_username'),
            is_user_logged_in_facebook:localStorage.getItem('insta_logged_id')
          })
        }
        this.setState({
          loader:false
        })
      }).catch(error=>{
        console.log("This I got From backGround EROOOOOO",error);
      })
    
  }
    render() {
        return (
          <div>
            {this.state.loader && (   
                <div className="after_login_refresh"><img src={LoaderLogo} alt=""/></div>
            )}
            <div className="dashboard">
              <Header selectedtab="dashboard"></Header>
              <div className="after_log_profile">
                <img src={AvatarLogo} alt=""/>
                <p>Welcome</p>
                <h3>{this.state.fb_name}</h3>
              </div>
              <div className="fb_login_request">
                {this.state.is_user_logged_in_facebook == "true" ?
                "" 
                :
                <div className="login_caution">
                  <img crossorigin="anonymous" data-testid="user-avatar" src={IconLogo} alt=""  />
                  Please login to your Instagram profile and click the refresh button below to proceed further.
                </div>
                }
                
                <a onClick={this.refreshHandler}  href="#" className="bluebtn"><img src={RefreshLogo} alt=""/> Refresh</a>
                <a  onClick={this.fbHandler} href="#" className="whitebtn"><img src={FaceBookLogo} alt=""/> Instagram</a>
              </div>
              <Footer></Footer>
            </div>
          </div>
        );
    }
}
export default Dashboard;