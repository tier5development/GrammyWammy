import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import Sidebar from "../Common/sidebar";
import AutoResponderService from  "../../../services/autoResponderServices";
import settingService   from  "../../../services/setting";
class autoResponnder extends Component {
    constructor(props) {
      super(props)
      this.state = {
        autoresponderList :[],
        loader:true
      }
    }
    componentDidMount(){
        let Token=localStorage.getItem("kyubi_user_token");
        let payload ={
            user_id:Token
        }
        AutoResponderService.listAutoResponder(payload).then(async response =>{
          
            if(response.data.payload.autokey)
            this.setState({autoresponderList:response.data.payload.autokey})
            

            let user_id=localStorage.getItem('user_id');
            let payload   ={user_id:user_id }
            await settingService.getUserDetails(payload).then(result  =>{

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


            }
            }).catch(error=>{


            })
            this.setState({loader:false});
          }).catch(error=>{
            this.setState({loader:false});
          });

    }
    render() {
        return (
            <div className="wrapper">
                {this.state.loader && (   
                <div className="overlay">
                <i className="fas fa-2x fa-sync-alt fa-spin"></i>
                </div>
                )}
                <Sidebar  selectedtab="setting"></Sidebar>
                <div className="content-wrapper">
                <section className="content-header">
                    <div className="container-fluid">
                        <div className="row mb-12">
                            <div className="col-sm-6">
                            <h1>Auto-Responder</h1>
                            
                            <NavLink  to="/autorespondercreate"  class="btn btn-app">
                                <i class="fas fa-plus-square"></i> Create New Auto-Responder
                            </NavLink>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="content">
                    <div className="container-fluid">
                        <div className="row overflow-auto">
                            <div className="col-md-12">
                            {Object.keys(this.state.autoresponderList).length > 0 ?
                            (this.state.autoresponderList.map((data, i) => {
                                let editlink= "/autoresponderedit/"+data._id;
                            return(
                                
                            <div className={data.status ===  1 ? "card card-success shadow-none" : "card card-danger shadow-none" }>
                                <div className="card-header">
                                    <h3 className="card-title">{data.auto_responder_name}</h3>
                                    <div className="card-tools">
                                        <button type="button" className="btn btn-tool" data-card-widget="collapse">
                                        <NavLink  to={editlink}><i className="far fa-edit"></i></NavLink>
                                        </button>
                                    </div>
                                </div>
                                <div className="card-body" >
                                    <div className={data.status ===  1 ? "callout callout-success" : "callout callout-danger" }>
                                        <h6>Response Message :</h6>
                                        <p>{data.message}</p>
                                    </div>
                                    <div className={data.status ===  1 ? "callout callout-success" : "callout callout-danger" }>
                                        <h6>Keywords :</h6>
                                        <p>
                                        {data.autoresponderkeywords.map((result, i) => {
                                        return (
                                            <span class="badge badge-info">{result.keywords}</span>
                                        )
                                        })
                                        }
                                        
                                        </p>
                                    </div>
                                </div>
                            </div>
                            
                            )
                            }))
                            :
                            (this.state.loader ? " ": 
                            <div className="card card-danger shadow-none">
                            <div className="card-header">
                                <h3 className="card-title">Oops !</h3>
                                <div className="card-tools">
                                    
                                </div>
                            </div>
                            <div className="card-body" >
                                <div className="callout callout-danger">
                                    <h5>Sorry There Is No Auto-Responder</h5>
                                    
                                </div>
                                
                            </div>
                            </div> 
                                )
                              
                            }       
                            
                            </div>
                        </div>
                    </div>
                </section>
                </div>
            </div>
    
        );
    }
}

export default autoResponnder;