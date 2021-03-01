import React, { Component} from "react";
import MessageGroupService from  "../../../services/messageGroupService";
import { Redirect, withRouter } from 'react-router-dom';
import Sidebar from "../Common/sidebar";
import {kyubiExtensionId}  from "../../../config";
import { NavLink } from "react-router-dom";
class messageGroup extends Component {
    constructor(props) {
        super(props)
        this.state = {
          messageGroupList :[],
          loader:true
        }
    }
    componentDidMount(){
        this.setState({loader:false});
        if(localStorage.getItem("groupitems"))
        this.setState({messageGroupList:JSON.parse(localStorage.getItem("groupitems"))})
    }
    deleteMessageGroupHandler =  (id,event) =>{
        let payload = {
            message_group_id:id
        }
        if(MessageGroupService.deleteMessageGroup(payload))
        {
            this.setState({loader:false});
            this.props.history.push('/messageGroup');
        }
        

    }
    render() {
        
        return ( <div className="wrapper">
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
                                            <h1>Message-Group</h1>
                                            
                                            <NavLink  to="/messagegroupcreate"  class="btn btn-app">
                                                <i class="fas fa-plus-square"></i> Create New Message-Group
                                            </NavLink>
                                            </div>
                                        </div>
                                    </div>
                                </section>
                                <section className="content">
                                        <div className="container-fluid">
                                            <div className="row overflow-auto">
                                                <div className="col-md-12">
                                                {Object.keys(this.state.messageGroupList).length > 0 ?
                                                (this.state.messageGroupList.map((data, i) => {
                                                    let editlink= "/messagegroupedit/"+i;
                                                    
                                                return(
                                                    
                                                <div className="card card-success shadow-none">
                                                    <div className="card-header">
                                                        <h3 className="card-title">{data.message_group_name}</h3>
                                                        <div className="card-tools">
                                                            <button type="button" className="btn btn-tool" data-card-widget="collapse">
                                                            <NavLink  to={editlink}><i className="far fa-edit"></i></NavLink>
                                                            </button>
                                                        </div>
                                                        <div className="card-tools">
                                                            <button type="button" className="btn btn-tool" data-card-widget="collapse" >
                                                            <i className="fas fa-trash" onClick={() => this.deleteMessageGroupHandler(i)} ></i>
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <div className="card-body" >
                                                        <div className="callout callout-success" >
                                                            <h6>Message Group Description :</h6>
                                                            <p>{data.message_group_description}</p>
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
                                                        <h5>Sorry There Is No Message-Group</h5>
                                                        
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
export default messageGroup;