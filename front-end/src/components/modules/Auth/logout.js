import React, { Component} from "react";
import { Redirect, withRouter } from 'react-router-dom';
import loginHelper from "../../../helper/loginHelper";
import {kyubiExtensionId}  from "../../../config";
import "./login.css";

class logout extends Component {
    constructor(props) {
        super(props)
        this.state = {
          
        }
        

      }
      componentDidMount(){
        let LO = loginHelper.logout();
        
        
        this.props.history.push('/');
         
      }
    render() {
        return (

          <div className="wrapper">
            
            

            <div className="content-wrapper">
              <section className="content-header">
                <div className="container-fluid">
                  <div className="row mb-12">
                    <div className="col-sm-6">
                      
                    </div>
                  </div>
                </div>
              </section>
              <section className="content">
                <div className="container-fluid">
                  <div className="row">
                    <div className="col-md-12">
                    <div class="alert alert-danger alert-dismissible">
                  
                  <h5><i class="icon fas fa-ban"></i> Alert!</h5>
                  Thanks For Being With Us We are Loging You Out
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
export default logout;