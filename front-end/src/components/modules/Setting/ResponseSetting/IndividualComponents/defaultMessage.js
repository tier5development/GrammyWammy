import React, { Component } from "react";
import AuthServices from "../../../../../services/authService";
import GroupServices from "../../../../../services/groupServices";
import SettingServices from "../../../../../services/setting";
import Select from 'react-select';
const options = [
  {value:0,label:"Text  Message"},
  {value:1,label:"Message Group"}
];
class defaultMessage extends Component {
    constructor(props) {
        super(props)
        this.state = {
          selectedOption:  {value:1,label:"Message Group"},
          default_message_type:0,
          MessageGroupList:[],
          GPL:[],
          selectedGPL:null,
          default_message_group:"",
          default_message_text:"",
          default_time_delay:0
        }
      }
      handleChange = selectedOption => {
        this.setState({ selectedOption });
        console.log(`Option selected:`, selectedOption);
        console.log(`Opppppppppppp`, selectedOption.value);
        this.setState({default_message_type:selectedOption.value});
      };
      handleChangeGPL = selectedGPL =>  {
        this.setState({ selectedGPL });
        console.log(`Option selected:`, selectedGPL);
        console.log(`Opppppppppppp`, selectedGPL.value);
        this.setState({default_message_group:selectedGPL.value});
      }
      /**
        * @inputChangeHandller 
        * getting input field values
      */
      inputChangeHandller = (event) => {
        this.setState({ [event.target.name]: event.target.value })
      }
      /**
         * @insertTagAtMessageSegments
         * in this function we are managing the tag in welcome message area
        */
      insertTagAtMessageSegments(areaId, text) {
        var txtarea = document.getElementById(areaId);
        if (!txtarea) {
        return;
        }
        // if (txtarea.value.length < 188) {
        var scrollPos = txtarea.scrollTop;
        var strPos = 0;
        var br = ((txtarea.selectionStart || txtarea.selectionStart == '0') ?
        "ff" : (document.selection ? "ie" : false));
        if (br == "ie") {
        txtarea.focus();
        var range = document.selection.createRange();
        range.moveStart('character', -txtarea.value.length);
        strPos = range.text.length;
        } else if (br == "ff") {
        strPos = txtarea.selectionStart;
        }
        var front = (txtarea.value).substring(0, strPos);
        var back = (txtarea.value).substring(strPos, txtarea.value.length);
        txtarea.value = front + text + back;
        strPos = strPos + text.length;
        let WelcomeMessage = txtarea.value;
        WelcomeMessage = WelcomeMessage.replace(/{first_name}/g, "");
        WelcomeMessage = WelcomeMessage.replace(/{last_name}/g, "");
        WelcomeMessage = WelcomeMessage.replace(/{date}/g, "");
        WelcomeMessage = WelcomeMessage.replace(/{date_time}/g, "");
        //console.log("This is the message ========",WelcomeMessage);
        this.setState({ default_message_text: txtarea.value});
        // this.setState({ welcomeContent: txtarea.value, welcomeTextLengthCount: txtarea.value });
        if (br == "ie") {
        txtarea.focus();
        var ieRange = document.selection.createRange();
        ieRange.moveStart('character', -txtarea.value.length);
        ieRange.moveStart('character', strPos);
        ieRange.moveEnd('character', 0);
        ieRange.select();
        } else if (br == "ff") {
        txtarea.selectionStart = strPos;
        txtarea.selectionEnd = strPos;
        txtarea.focus();
        }
        txtarea.scrollTop = scrollPos;
        // }
      }
      
      submitAddDefaultMessage   =    async   (event) =>  {
        event.preventDefault();
        let payload =   {
            default_message_type:this.state.default_message_type,
            default_message_group:this.state.default_message_group,
            default_message_text:this.state.default_message_text,
            default_time_delay:this.state.default_time_delay,
            kyubi_user_token:localStorage.getItem("kyubi_user_token")
        }
        console.log("This I have to save in DB as Segments",payload);
        await SettingServices.setSetting(payload).then(async result=>{
          if(result.data.code==1){
                      let responsenewvalue =result.data;
                      localStorage.setItem('kyubi_user_token', responsenewvalue.payload.UserInfo.kyubi_user_token);
                      localStorage.setItem('user_id', responsenewvalue.payload.UserInfo.user_id);
                      localStorage.setItem('fb_id', responsenewvalue.payload.UserInfo.facebook_id);
                      localStorage.setItem('fb_username', responsenewvalue.payload.UserInfo.facebook_name);
                      localStorage.setItem('fb_name', responsenewvalue.payload.UserInfo.facebook_profile_name);
                      localStorage.setItem('fb_image', responsenewvalue.payload.UserInfo.facebook_image);
                      
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
          }else{

          }
        })
      }
      componentDidMount(){
        let  params ={
          user_rec    :   localStorage.getItem('kyubi_user_token')
        };
        let GPDID="";
        AuthServices.userRetrive(params).then(async result=>{
          console.log("This I got From backGround SUSSSSS Default",result);
          let opt={}
          if(result.data.payload.UserSettings.default_message_type ===1){
            opt={value:1,label:"Message Group"}
          }else{
            opt={value:0,label:"Text  Message"}
          }
          if(result.data.payload.UserSettings.default_message_group){
            this.setState({
              default_message_group:result.data.payload.UserSettings.default_message_group
            });
            GPDID=result.data.payload.UserSettings.default_message_group;
          }
          this.setState({
            default_message_type:result.data.payload.UserSettings.default_message_type,
            selectedOption:opt,
            default_message_text:result.data.payload.UserSettings.default_message_text,
            default_time_delay:result.data.payload.UserSettings.default_time_delay,
          })


          let GroupParams = {
            user_id    :   localStorage.getItem('user_id')
          }
          GroupServices.getGroup(GroupParams).then(async result=>{
            if(result.data.code == 1){
                let resultGroupList =  [];
                
                result.data.payload.map(data=>{
                  
                  resultGroupList.push({value:data._id,label:data.title})
                  console.log("This MGP",this.state.default_message_group);
                  console.log("This GAP",data._id);
                  console.log("This GAP!",GPDID);
                  if(GPDID != "" && GPDID==data._id){
  
                    this.setState({
                      selectedGPL:{value:data._id,label:data.title}
                    });
                  }
                });
                this.setState({
                  MessageGroupList:result.data.payload,
                  GPL:resultGroupList
                })
                
                
            }
          }).catch(error=>{
            console.log("This I got From DDDDBBBBBB EROOOOOO",error);
          })




        }).catch(error=>{
          console.log("This I got From backGround EROOOOOO Default",error);
        })
        

        
      }
      render() {
        const { selectedOption,selectedGPL,GPL } = this.state;

        return (
            <div id="tabdefaultMessage" className="subtabcontent">

            <form>
              <div className="selectbox">
              <Select
              className="selectbox"
              value={selectedOption}
              onChange={this.handleChange}
              options={options}
              />

              </div>
              {this.state.default_message_type ? 

              <Select
              className="selectbox"
              value={selectedGPL}
              onChange={this.handleChangeGPL}
              options={GPL}
              />
 
              : 
              <div>
                <textarea name="default_message_text" value={this.state.default_message_text} onChange={this.inputChangeHandller} id="default_message_text" className="withtag otherstyle" placeholder="Build block content">
                        
                </textarea>
              <a href="#" className="formtag">[ First Name ]</a> <a href="#" className="formtag">[ Last Name ]</a>
              <button type="button" onClick={() => this.insertTagAtMessageSegments('default_message_text', '{first_name}')} className="formtag">[ First Name ]</button> 
              <button type="button" onClick={() => this.insertTagAtMessageSegments('default_message_text', '{last_name}')} class="formtag">[ Last Name ]</button>
              <button type="button" onClick={() => this.insertTagAtMessageSegments('default_message_text', '{date}')} class="formtag">[ Todays Date ]</button>

              </div>
              
              }

              <label className="gap2">
                Time Interval for Default Message
              </label>
              <div className="formnumber">
                <input type="number" name="default_time_delay" value={this.state.default_time_delay} onChange={this.inputChangeHandller}  placeholder="Enter Time Delay" className="otherstyle" />        
                hour (s)</div>

                <button onClick={this.submitAddDefaultMessage} className="blue_btn" type="submit">Save Message</button>
            </form>

          </div>
        )
      }
}
export default defaultMessage;