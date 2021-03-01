import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import AutoResponderService from  "../../../services/autoResponderServices"
import Sidebar from "../Common/sidebar"
class autoResponderEdit extends Component {
    constructor(props) {
      super(props)
      this.state = {
        auto_responder_id:"",
        auto_responder_name:"",
        auto_responder_keywords:"",
        auto_responder_message:"",
        auto_responder_status:0,
        loader:false
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
        console.log("hiyy",this.state.auto_responder_status )
        if(this.state.auto_responder_status === 0){
            this.setState({auto_responder_status:1})
        }else{
            this.setState({auto_responder_status:0})
        }
    }
    updateAutoResponderGroupHandler =  (event) =>{
        this.setState({loader:true});
        event.preventDefault();
        let Token=localStorage.getItem("kyubi_user_token");
        let payload = {
            user_id:Token,
            auto_responder_id:this.state.auto_responder_id,
            auto_responder_name:this.state.auto_responder_name,
            auto_responder_keywords:this.state.auto_responder_keywords,
            auto_responder_message:this.state.auto_responder_message,
            auto_responder_status:this.state.auto_responder_status
        }
        
        AutoResponderService.updateAutoResponder(payload).then(response =>{
          
          this.setState({loader:false});
           this.props.history.push('/autoresponder');
        });
      }
      backAutoResponderGroupHandler =  (event) =>{
        
          this.props.history.push('/autoresponder');
       
      }
      componentDidMount(){
        this.setState({loader:true});
        let payload = { Id: this.props.match.params.idfy };
        console.log(payload);
        AutoResponderService.editAutoResponder(payload).then(async response=>{
            console.log(response);
            if(response.data.code === 1){
                let newKey="";
                await response.data.payload[0].autoresponderkeywords.map(async (result, i) => {
                    console.log(result.keywords);
                    if(newKey===""){
                        //console.log(result);
                        newKey=result.keywords
                    }else{
                        newKey=newKey+","+result.keywords;
                        
                    }
                });
                this.setState({
                    auto_responder_id:response.data.payload[0]._id,
                    auto_responder_name:response.data.payload[0].auto_responder_name,
                    auto_responder_message:response.data.payload[0].message,
                    auto_responder_status:response.data.payload[0].status,
                    auto_responder_keywords:newKey,
                    loader:false
                  })
            }
        }).catch(error=>{

        })
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
                                    <h3 className="card-title"> Create Auto-Responder</h3>
                                </div>
                                <form>
                                <div className="card-body">
                                    
                                    <div className="form-group">
                                        <label for="exampleInputEmail1">Auto-Responder Name</label>
                                        <input type="text"
                                            name="auto_responder_name" 
                                            className="form-control" 
                                            id="exampleInputEmail1" 
                                            placeholder="Auto-Responder Name" 
                                            value={this.state.auto_responder_name}
                                            onChange={this.inputChangeHandller}
                                        />
                                    </div>
                                    
                                    <div className="form-group">
                                        <label for="exampleInputEmail1">Auto-Responder Keywords</label>
                                        <textarea 
                                        name="auto_responder_keywords" 
                                        className="form-control" 
                                        rows="3"
                                        placeholder="Auto-Responder Keywords  Seperated with coma Like hello,Hi,How are you"
                                        value={this.state.auto_responder_keywords}
                                        onChange={this.inputChangeHandller}
                                        ></textarea>
                                    </div>
                                    <div className="form-group">
                                        <label for="exampleInputEmail1">Auto-Responder Response Message</label>
                                        <textarea 
                                        name="auto_responder_message" 
                                        value=""  
                                        className="form-control" 
                                        rows="3"  
                                        placeholder="Please enter the response message...."
                                        value={this.state.auto_responder_message}
                                        onChange={this.inputChangeHandller}
                                        ></textarea>
                                    </div>
                                    <div className="form-group clearfix">
                                        <div className="icheck-success d-inline">
                                        
                                        {this.state.auto_responder_status ?
                                        <input type="checkbox" id="checkboxPrimary3" name="auto_responder_status" onChange={this.autoSetting} checked/>
                                        :
                                        <input type="checkbox" id="checkboxPrimary3" name="auto_responder_status" onChange={this.autoSetting}/>
                                        }
                                        <label for="checkboxPrimary3">
                                            Activate Auto-Responder
                                        </label>
                                        </div>
                                    </div>
                                    
                                </div>           
                                <div className="card-footer">
                                <button type="submit" className="btn btn-primary" onClick={this.updateAutoResponderGroupHandler} >Update</button>
                                <button type="button" className="btn btn-secondary  float-right"  onClick={this.backAutoResponderGroupHandler} ><i className="far fa-arrow-alt-circle-left"></i> Back</button>
                                </div>
                                </form>
                            </div>

                            </div>
                        </div>
                    </div>
                </section>
                </div>
            </div>
        );
    }
}

export default autoResponderEdit;