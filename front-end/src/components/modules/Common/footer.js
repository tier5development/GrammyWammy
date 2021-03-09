import React, { Component } from "react";
import logo from "../../../images/logo.svg";
import { NavLink } from "react-router-dom";
import FaceBookLogo from "../../../images/Path3.svg";
import MessenderLogo from "../../../images/Messanger.svg";
class footer extends Component {
    constructor(props) {
        super(props)
        this.state = {
          
        }
      }
      
    componentDidMount(){
        console.log("I am In Header");
    }
    render() {
        return (
        <div className="footer">
            <p>Powered by <a href="#">Tier5</a> and the <a href="#">Tier5 Partnership</a></p>
            <a href="#"><img src={FaceBookLogo} /></a> <a href="#"><img src={MessenderLogo} /></a>
        </div>
        )
    }
}
export default footer;