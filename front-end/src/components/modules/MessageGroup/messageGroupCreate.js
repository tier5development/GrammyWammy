import React, { Component } from "react";
import MessageGroupService from  "../../../services/messageGroupService"
import Sidebar from "../Common/sidebar";
class messageGroupCreate extends Component {

    constructor(props) {
        super(props)
        this.state = {
          message_group_name:"",
          message_group_description:"",
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
    allTweets = [];
    createMessageGroupHandler =  (event) =>{
        this.setState({loader:true});
        event.preventDefault();
        let Token=localStorage.getItem("kyubi_user_token");
        let payload = {
            user_id:Token,
            message_group_name:this.state.message_group_name,
            message_group_description:this.state.message_group_description,
        }
        
        if(MessageGroupService.createMessageGroup(payload))
        {
            this.setState({loader:false});
            this.props.history.push('/messageGroup');
        }
       
    }

    render() {
        return ( <div className="wrapper">
                    <Sidebar  selectedtab="setting"></Sidebar>
                        <div className="content-wrapper">
                            <section className="content-header">
                                <div className="container-fluid">
                                    <div className="row mb-12">
                                        <div className="col-sm-6">
                                        <h1>Message-Group</h1>
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
                                                <h3 className="card-title"> Create Message-Group</h3>
                                            </div>
                                            <form>
                                            <div className="card-body">
                                                
                                                <div className="form-group">
                                                    <label for="exampleInputEmail1">Message-Group Name</label>
                                                    <input type="text"
                                                        name="message_group_name" 
                                                        className="form-control" 
                                                        placeholder="Name" 
                                                        value={this.state.message_group_name}
                                                        onChange={this.inputChangeHandller}
                                                    />
                                                </div>
                                                
                                                <div className="form-group">
                                                    <label for="exampleInputEmail1">Message-Group Description</label>
                                                    <textarea 
                                                    name="message_group_description" 
                                                    className="form-control" 
                                                    rows="3"
                                                    placeholder="Description"
                                                    value={this.state.message_group_description}
                                                    onChange={this.inputChangeHandller}
                                                   
                                                    ></textarea>
                                                </div>
                                                </div>           
                                            <div className="card-footer">
                                            <button type="submit" className="btn btn-primary" onClick={this.createMessageGroupHandler} >Submit</button>
                                            </div>
                                            </form>
                                        </div>

                                        </div>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </div>);
    }

}
export default messageGroupCreate;