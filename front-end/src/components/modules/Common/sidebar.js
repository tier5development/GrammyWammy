import React, { Component } from "react";
import logo from "../../../image/Logo_Side.png";
import { NavLink } from "react-router-dom";
import {Animated} from "react-animated-css";
class sidebar extends Component {
    constructor(props) {
      super(props)
      this.state = {
        selected:this.props.selectedtab,
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
    componentDidMount(){
        //console.log(this.props.shownav);
    }
    render() {
        return (
        <div>
          <nav className="main-header navbar navbar-expand  navbar-dark">
              <ul className="navbar-nav">
                <li className="nav-item">
                  <a className="nav-link" onClick={this.ShowMenu} data-widget="pushmenu" href="#" role="button">
                    <i className="fas fa-bars"></i>
                  </a>
                </li>
              </ul>
          </nav>
        {this.state.openSidebar ?
                      
                      <div className="main-sidebar sidebar-light-primary elevation-4 sidebar-no-expand" id="navbarMenu">
              
                      <a href="" onClick={this.HideMenu} ><div className="crossbox"><i class="fas fa-times"></i></div></a>
                      
                        <NavLink  to="/dashboard" className="brand-link">
                        
                          <img  src={logo} className="Brandlogo"></img>
                        
                        </NavLink>
                        <div className="sidebar">
                          <nav className="mt-2">
                            <ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
                              <li className="nav-item">
                                  <NavLink  to="/dashboard" className="nav-link">
                                    <i className="nav-icon fas fa-tachometer-alt"></i>
                                    <p>
                                      Dashboard
                                    </p>
                                  </NavLink>
                              </li>
                              <li className="nav-item">
                                  <NavLink  to="/setting" className="nav-link">
                                    <i className="nav-icon fas fa-cogs"></i>
                                    <p>
                                      Setting
                                    </p>
                                  </NavLink>
                              </li> 
                              <li className="nav-item">
                                  <NavLink  to="/messageGroup" className="nav-link">
                                    <i className="nav-icon fas fa-cogs"></i>
                                    <p>
                                      Message Group
                                    </p>
                                  </NavLink>
                              </li>  
                              <li className="nav-item">
                                  <NavLink  to="/autoresponder" className="nav-link">
                                    <i className="nav-icon fas fa-magic"></i>
                                    <p>
                                      Auto-Responder
                                    </p>
                                  </NavLink>
                              </li>
                              
                              <li className="nav-item">
                                  <NavLink  to="/logout" className="nav-link">
                                    <i className="nav-icon fas fa-sign-out-alt"></i>
                                    <p>
                                      Logout
                                    </p>
                                  </NavLink>
                              </li>
                            </ul>
                          </nav>
                        </div>
                      </div>
                   
        :
        ""
        }
        </div>
          
         

          
        );
    }
}

export default sidebar;