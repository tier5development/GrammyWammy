import React, { Component } from 'react';
import { Redirect, withRouter } from 'react-router-dom'
import  {OpenFacebookInTab,CheckUserInfoFromFaccebook,OpenFacebookProfileInTab} from  '../../../helper/helper'
import Sidebar from "../Common/sidebar"
import { NavLink } from "react-router-dom";
import settingService from "../../../services/setting"
class Dashboard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      fb_image:"",
      fb_name:"",
      fb_username:"",
      insta_image:"",
      insta_name:"",
      insta_username:"",
      insta_logged_id:"",
      fb_id:"",
      fb_logged_id:"",
      autoresponder:"0",
      shownavbar:false,
      loader:true,
      openSidebar:false,
    }
  }
  HideMenu = (event) => {
    event.preventDefault();
    //console.log(this.props.shownav);
    this.setState({
      openSidebar:false
    })
  }
  ShowMenu = (event) => {
    event.preventDefault();
    //console.log(this.props.shownav);
    this.setState({
      openSidebar:true
    })
  }
  fbHandler = async (event) => {
    event.preventDefault();
    let insta_logged_id=localStorage.getItem('insta_logged_id');
    console.log("You Are Loged in",insta_logged_id);
    if(insta_logged_id === "false"){
      OpenFacebookInTab();
    }else{
      OpenFacebookProfileInTab();
    }
  }
  autoresponderHandler  = async (event) =>{
    let user_id=localStorage.getItem('user_id');
    let autoresponder = 0;
    let payload ={
      user_id:user_id,
      autoresponder:autoresponder
    }
    await settingService.updateAutoresponderSetting(payload).then(async result=>{
      this.setState({
        loader:true
      })
      console.log(result);
      if(result.data.code==1){
        let responsenewvalue =result.data;
        console.log( responsenewvalue.payload.UserInfo.user_id);
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
        let fb_image=localStorage.getItem('fb_image');
        let fb_username=localStorage.getItem('fb_username');
        let fb_name=localStorage.getItem('fb_name');
        let fb_id=localStorage.getItem('fb_id');
        let fb_logged_id=localStorage.getItem('fb_logged_id');
        let autoresponder=localStorage.getItem('autoresponder');
        console.log("Yo Are Loged in",fb_logged_id);
        this.setState({
        fb_image:fb_image,
        fb_username:fb_username,
        fb_name:fb_name,
        fb_id:fb_id,
        fb_logged_id:fb_logged_id,
        autoresponder:autoresponder,
        loader:false
        })

      }
    });

    //CheckUserInfoFromFaccebook();
  }
  refreshHandler  = async (event) =>  {
    event.preventDefault();
    // this.setState({
    //   loader:true
    // })
    CheckUserInfoFromFaccebook();
    // setTimeout(() => {

    //   let fb_image=localStorage.getItem('fb_image');
    //   let fb_username=localStorage.getItem('fb_username');
    //   let fb_name=localStorage.getItem('fb_name');
    //   let fb_id=localStorage.getItem('fb_id');
    //   let fb_logged_id=localStorage.getItem('fb_logged_id');
    //   let autoresponder=localStorage.getItem('autoresponder');
    //   this.setState({
    //     fb_image:fb_image,
    //     fb_username:fb_username,
    //     fb_name:fb_name,
    //     fb_id:fb_id,
    //     fb_logged_id:fb_logged_id,
    //     autoresponder:autoresponder,
    //     loader:false
    //   })

    // }, 4000);
  }
  componentDidMount(){
    setTimeout(async () => {
      
      let user_id=localStorage.getItem('user_id');
      let payload   ={user_id:user_id }
      
      await settingService.getUserDetails(payload).then(result  =>{
        
      if(result.data.code==1){
        let responsenewvalue =result.data;
        console.log( responsenewvalue.payload.UserInfo);
        localStorage.setItem('kyubi_user_token', responsenewvalue.payload.UserInfo.kyubi_user_token);
        localStorage.setItem('user_id', responsenewvalue.payload.UserInfo.user_id);
        localStorage.setItem('insta_username', responsenewvalue.payload.UserInfo.instagram_profile_name);
        localStorage.setItem('insta_name', responsenewvalue.payload.UserInfo.instagram_name);
        localStorage.setItem('insta_image', responsenewvalue.payload.UserInfo.instagram_image);
        localStorage.setItem('default_message', responsenewvalue.payload.UserSettings.default_message);
        localStorage.setItem('default_message_text', responsenewvalue.payload.UserSettings.default_message_text);
        localStorage.setItem('autoresponder', responsenewvalue.payload.UserSettings.autoresponder);
        localStorage.setItem('default_time_delay', responsenewvalue.payload.UserSettings.default_time_delay);
        localStorage.setItem('keywordsTally', JSON.stringify(responsenewvalue.payload.AutoResponderKeywords));
        let insta_image=localStorage.getItem('insta_image');
        let insta_username=localStorage.getItem('insta_username');
        let insta_name=localStorage.getItem('insta_name');
        
        let insta_logged_id=localStorage.getItem('insta_logged_id');
        let autoresponder=localStorage.getItem('autoresponder');
        console.log("Yo Are Loged in",insta_logged_id);
        this.setState({
        insta_image:insta_image,
        insta_username:insta_username,
        insta_name:insta_name,
        insta_logged_id:insta_logged_id,
        autoresponder:autoresponder,
        loader:false
        })
        

      }
      }).catch(error=>{

        let fb_image=localStorage.getItem('fb_image');
        let fb_username=localStorage.getItem('fb_username');
        let fb_name=localStorage.getItem('fb_name');
        let fb_id=localStorage.getItem('fb_id');
        let fb_logged_id=localStorage.getItem('fb_logged_id');
        let autoresponder=localStorage.getItem('autoresponder');
        console.log("Yo Are Loged in",fb_logged_id);
        this.setState({
        fb_image:fb_image,
        fb_username:fb_username,
        fb_name:fb_name,
        fb_id:fb_id,
        fb_logged_id:fb_logged_id,
        autoresponder:autoresponder,
        loader:false
        })

      })
      

    }, 3000);
    
  }
    render() {
        return (
              <div className="dashboard_screen_width">
                 {this.state.loader && (   
                    <div className="overlay">
                       <img src="images/ajax-loader.gif"></img>
                    </div>
                    )}
                  <div className="dashboard">

                    <div className="gen_header">
                      <div className="logo"><img src="images/logo.svg" alt=""></img></div>
                          <div className="hBtnWrapper">
                                <div className="toogler">
                                  <label className="switch_box box_1">
                                    <input type="checkbox" class="switch_1" id="swich" name="togg" />
                                    <div className="toogler"></div>
                                  </label>
                                </div>
                                <div className="slide_menu_click">
                                    <a href="#" className="side_click" onClick={this.ShowMenu}><img src="images/side_menu.svg"></img></a>
                                    {this.state.openSidebar ?
                                     <div className="slider_menu active">
                                        <a href="#" className="cross" onClick={this.HideMenu}>X</a>
                                        <div className="after_log_profile">
                                            <img src={this.state.insta_image} alt=""></img>
                                          <p>Welcome</p>
                                          <h3>{this.state.insta_name}</h3>
                                        </div>
                                        <ul className="menunav">
                                            <li><a href="#"><img src="images/menuicon4.svg"></img> Dashboard</a></li>
                                            <li><a href="#"><img src="images/menuicon3.svg"></img> Settings</a></li>
                                            <li><a href="#"><img src="images/menuicon2.svg"></img> Friends</a></li>
                                            <li><NavLink  to="/logout" className="nav-link"><img src="images/menuicon1.svg"></img> Logout</NavLink></li>
                                          </ul>
                                     </div>
                                     :
                                     ""
                                     }
                                  </div> 
                              </div> 
                           </div>
                           <div className="after_log_profile">
                              <img src={this.state.insta_image} alt=""></img>
                              <p>Welcome</p>
                              <h3>{this.state.insta_name}</h3>
                          </div>
                          <div className="fb_login_request">
                            {!this.state.insta_logged_id ?
                            <p>Please log-in to your Instagram profile</p>
                            :
                            ""
                            }
                            <a onClick={this.refreshHandler}  class="bluebtn"><img src="images/layer1.svg"></img> Refresh</a>
                            <a onClick={this.fbHandler} class="whitebtn"><img src="images/fb_blue.svg"></img> Facebook</a>
                          </div>
                          <div class="footer">
                            <p>Powered by <a href="#">Tier5</a> and the <a href="#">Tier5 Partnership</a></p>
                            <a href="#"><img src="images/Path3.svg"></img></a> <a href="#"><img src="images/Messanger.svg"></img></a>
                          </div>

                  </div>
              </div>  
        );
    }
}
export default Dashboard;