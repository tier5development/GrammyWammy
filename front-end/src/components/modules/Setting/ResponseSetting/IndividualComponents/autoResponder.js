import React, { Component } from "react";
import plusLogo from  "../../../../../images/plus.svg";
import editLogo from  "../../../../../images/edit.svg";
import deleteLogo from  "../../../../../images/delete.svg";
import EmptyFileLogo from "../../../../../images/empty_file.svg";
import LoaderLogo from "../../../../../images/Loader.gif"
import backArrowLogo from "../../../../../images/arrow2.svg";
import AutoResponderService from  "../../../../../services/autoResponderServices";
import { WithContext as ReactTags } from 'react-tag-input';
const KeyCodes = {
    comma: 188,
    enter: 13,
  };
  
const delimiters = [KeyCodes.comma, KeyCodes.enter];
class responseSetting extends Component {
    constructor(props) {
        super(props)
        this.state = {
          autoResponsederList:1,
          autoResponsederCreate:0,
          autoResponsederEdit:0,
          autoresponderListValue:[],
          auto_responder_name:"",
          auto_responder_keywords: [],
          auto_responder_message:"",
          auto_responder_status:1,
            loader:false,
            auto_responder_id_edit:"",
            auto_responder_name_edit:"",
            auto_responder_message_edit:"",
            auto_responder_status_edit:1,
            auto_responder_keywords_edits:[]
        }
        this.handleDelete = this.handleDelete.bind(this);
        this.handleAddition = this.handleAddition.bind(this);

        this.handleEditDelete = this.handleEditDelete.bind(this);
        this.handleEditAddition = this.handleEditAddition.bind(this);
    }
    autoSetting = () => {
        console.log("hiyy",this.state.auto_responder_status )
        if(this.state.auto_responder_status === 0){
            this.setState({auto_responder_status:1})
        }else{
            this.setState({auto_responder_status:0})
        }
    }
    autoSettingEdit = () => {
        console.log("hiyy",this.state.auto_responder_status_edit )
        if(this.state.auto_responder_status_edit === 0){
            this.setState({auto_responder_status_edit:1})
        }else{
            this.setState({auto_responder_status_edit:0})
        }
    }

    handleDelete(i) {
        const { auto_responder_keywords } = this.state;
        this.setState({
            auto_responder_keywords: auto_responder_keywords.filter((auto_responder_keyword, index) => index !== i),
        });
    }
    handleEditDelete(i) {
        const { auto_responder_keywords_edits } = this.state;
        this.setState({
            auto_responder_keywords_edits: auto_responder_keywords_edits.filter((auto_responder_keywords_edit, index) => index !== i),
        });
    }
    handleAddition(auto_responder_keyword) {
        this.setState(state => ({ auto_responder_keywords: [...state.auto_responder_keywords, auto_responder_keyword] }));
    }
    handleEditAddition(auto_responder_keywords_edit) {
        this.setState(state => ({ auto_responder_keywords_edits: [...state.auto_responder_keywords_edits, auto_responder_keywords_edit] }));
    }
    addAutoResponderHandler  = async (event) =>  {
        this.setState({loader:true});
    event.preventDefault();
    this.setState({
        autoResponsederList:0,
        autoResponsederCreate:1,
        autoResponsederEdit:0,
        loader:false
    })
    
    }
    listAutoResponderHandler  = async (event) =>  {
        event.preventDefault();
        this.setState({
            autoResponsederList:1,
            autoResponsederCreate:0,
            autoResponsederEdit:0,
        })
    }
    /**
     * @insertTagAtMessageSegments
     * in this function we are managing the tag in welcome message area
    */
    insertTagAtMessageSegments(areaId, text) {
        console.log("Yo");
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
        if(areaId == "auto_responder_message"){
            this.setState({ auto_responder_message: txtarea.value});
        }else{
            this.setState({ auto_responder_message_edit: txtarea.value});
        }
        
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
     /**
        * @inputChangeHandller 
        * getting input field values
    */
    inputChangeHandller = (event) => {
        this.setState({ [event.target.name]: event.target.value })
    }
    createAutoResponderGroupHandler =  (event) =>{
        event.preventDefault();
        let Token=localStorage.getItem("kyubi_user_token");
        let payload = {
            user_id:Token,
            auto_responder_name:this.state.auto_responder_name,
            auto_responder_keywords:this.state.auto_responder_keywords,
            auto_responder_message:this.state.auto_responder_message,
            auto_responder_status:this.state.auto_responder_status
        }
      
         AutoResponderService.createAutoResponder(payload).then(response =>{
            console.log("This I gottttt",payload);
          if(response.data.code == 1){
            let UserTokenNew=localStorage.getItem("kyubi_user_token");
            let payloadNew ={
                user_id:UserTokenNew
            }
            AutoResponderService.listAutoResponder(payloadNew).then(async responsex =>{
                if(responsex.data.payload !=  "" ){
                    console.log("This is what i Got",responsex.data.payload);
                    if(responsex.data.payload.autokey.length>0){
                        console.log("This is what i Got",responsex.data.payload.autokey);
                        this.setState({
                                        autoresponderListValue:responsex.data.payload.autokey,
                                        autoResponsederList:1,
                                        autoResponsederCreate:0,
                                        autoResponsederEdit:0,
                                        auto_responder_name:"",
                                        auto_responder_keywords: [],
                                        auto_responder_message:"",
                                        auto_responder_status:1,
                        })
                    }
                  }
            })
          }
          console.log("This Is I Got ====== ",response);
        });
    }
    createAutoResponderGroupHandlerEdit =  (event) =>{
        event.preventDefault();
        this.setState({loader:true})
        let Token=localStorage.getItem("kyubi_user_token");
        let payload = {
            user_id:Token,
            auto_responder_id:this.state.auto_responder_id_edit,
            auto_responder_name:this.state.auto_responder_name_edit,
            auto_responder_keywords:this.state.auto_responder_keywords_edits,
            auto_responder_message:this.state.auto_responder_message_edit,
            auto_responder_status:this.state.auto_responder_status_edit
        }
        console.log("This I am Getting",payload)
      
        AutoResponderService.updateAutoResponder(payload).then(response =>{
            console.log("This I gottttt",payload);
          if(response.data.code == 1){
            let UserTokenNew=localStorage.getItem("kyubi_user_token");
            let payloadNew ={
                user_id:UserTokenNew
            }
            AutoResponderService.listAutoResponder(payloadNew).then(async responsex =>{
                if(responsex.data.payload !=  "" ){
                    console.log("This is what i Got",responsex.data.payload);
                    if(responsex.data.payload.autokey.length>0){
                        console.log("This is what i Got",responsex.data.payload.autokey);
                        this.setState({
                                        autoresponderListValue:responsex.data.payload.autokey,
                                        autoResponsederList:1,
                                        autoResponsederCreate:0,
                                        autoResponsederEdit:0,
                                        auto_responder_id_edit:"",
                                        auto_responder_name_edit:"",
                                        auto_responder_keywords_edits:[],
                                        auto_responder_message_edit:"",
                                        auto_responder_status_edit:1,
                                        loader:false
                        })
                    }
                  }
            })
          }
          console.log("This Is I Got ====== ",response);
        });
    }
    editAutoResponder(autoresponder_id,event){
        this.setState({loader:true})
        event.preventDefault();
        let payload = { 
            Id: autoresponder_id 
        }; 
        AutoResponderService.editAutoResponder(payload).then(async response=>{
            console.log("O)OO)O)O",response);
            if(response.data.code === 1){
                let newKey=[];
                await response.data.payload[0].autoresponderkeywords.map(async (result, i) => {
                    console.log(result.keywords);
                    newKey.push({"id":result.keywords,"text":result.keywords})
                });
                this.setState({
                    auto_responder_id_edit:response.data.payload[0]._id,
                    auto_responder_name_edit:response.data.payload[0].auto_responder_name,
                    auto_responder_message_edit:response.data.payload[0].message,
                    auto_responder_status_edit:response.data.payload[0].status,
                    auto_responder_keywords_edits:newKey,
                    autoResponsederList:0,
                    autoResponsederCreate:0,
                    autoResponsederEdit:1,
                    loader:false
                  })
            }
        }).catch(error=>{

        })
    }
    editAutoResponderStatus(autoresponder_id,prestatus){
        this.setState({loader:true})
        let status =1;
        if(prestatus == 1){
            status=0;
        }else{
            status=1;
        }
        let payload = {
            autoresponder_id:autoresponder_id,
            status:status
        };
        console.log("This is a Seeeee====>",payload);
        AutoResponderService.updateAutoResponderStatus(payload).then(response =>{
            console.log("This I gottttt",payload);
          if(response.data.code == 1){
            let UserTokenNew=localStorage.getItem("kyubi_user_token");
            let payloadNew ={
                user_id:UserTokenNew
            }
            AutoResponderService.listAutoResponder(payloadNew).then(async responsex =>{
                if(responsex.data.payload !=  "" ){
                    console.log("This is what i Got",responsex.data.payload);
                    if(responsex.data.payload.autokey.length>0){
                        console.log("This is what i Got",responsex.data.payload.autokey);
                        this.setState({
                                        autoresponderListValue:responsex.data.payload.autokey,
                                        autoResponsederList:1,
                                        autoResponsederCreate:0,
                                        autoResponsederEdit:0,
                                        loader:false
                                        
                        })
                    }
                  }
            })
          }
          console.log("This Is I Got ====== ",response);
        });
    }
    deleteAutoResponder(autoresponder_id,event){
        this.setState({loader:true})
        event.preventDefault();
        let user_id=localStorage.getItem("user_id");
        let payload = { 
            Id: autoresponder_id ,
            user_id:user_id
        }; 
        console.log("O)OO)O)O",payload);
        AutoResponderService.deleteAutoResponderStatus(payload).then(response =>{
            console.log("This I gottttt",payload);
          if(response.data.code == 1){
            let UserTokenNew=localStorage.getItem("kyubi_user_token");
            let payloadNew ={
                user_id:UserTokenNew
            }
            AutoResponderService.listAutoResponder(payloadNew).then(async responsex =>{
                if(responsex.data.payload !=  "" ){
                        this.setState({
                                        autoresponderListValue:responsex.data.payload.autokey,
                                        autoResponsederList:1,
                                        autoResponsederCreate:0,
                                        autoResponsederEdit:0,
                                        loader:false
                                        
                        })
                  }
            })
          }
          console.log("This Is I Got ====== ",response);
        });
    }
    componentDidMount(){
        this.setState({loader:true});
        let UserToken=localStorage.getItem("kyubi_user_token");
        //this.setState({autoresponderList:autoresponderList})
        let payload ={
            user_id:UserToken
        }
        AutoResponderService.listAutoResponder(payload).then(async response =>{
            console.log("This is what i Got",response);
            
          if(response.data.payload !=  "" ){
            console.log("This is what i Got",response.data.payload);
            if(response.data.payload.autokey.length>0){
                console.log("This is what i Got",response.data.payload.autokey);
                this.setState({autoresponderListValue:response.data.payload.autokey,loader:false})
            }
            
          }
          this.setState({loader:false});
        }).catch(error=>{
            this.setState({loader:false});
            this.setState({autoresponderListValue:[],loader:false})
        });
    }
      render() {
        const { auto_responder_keywords,auto_responder_keywords_edits } = this.state;
        return (
        <div>
                {this.state.autoResponsederList ?
                
                <div id="tabautoResponder" className="subtabcontent">
                    {this.state.loader && (   
                                <div className="after_login_refresh"><img src={LoaderLogo} alt=""/></div>
                    )}
                    { this.state.autoresponderListValue.length != 0 ?

                        <div>
                            <div className="headding">
                                <span>Auto Responder Lists</span> <a href="" onClick={this.addAutoResponderHandler} className="createbtn"><img alt="" src={plusLogo}/> Create New</a>
                            </div>
                            <div className="listingholder">

                            {this.state.autoresponderListValue.map((data, i) => {
                                return(
                                    
                                    <div className={data.status === 1  ?  "listing_card" :"listing_card inactive"}>
                                        <div className="head">
                                            <div className="txt">{data.auto_responder_name}</div>
                                            <div className="action">
                                                <label className="switch_box box_2">
                                                <input type="checkbox" onChange={() => this.editAutoResponderStatus(data._id,data.status)} className="switch_2" id="" name="" checked={data.status === 1  ?  "checked" :""}  />
                                                <div className="toogler"></div>
                                                </label>
                                                <a href="#" onClick={(event) => this.editAutoResponder(data._id,event)} ><img src={editLogo} alt=""/></a> 
                                                <a href="#"  onClick={(event) => this.deleteAutoResponder(data._id,event)} ><img src={deleteLogo} alt=""/></a>
                                            </div>
                                        </div>
                                        <div className="body">
                                                <p className="qn">{data.message}</p>
                                            <div className="listfooter">
                                                <p>Keywords:</p>
                                                {   data.autoresponderkeywords.map((result, i) => {
                                                        return (
                                                            <span class="tags">{result.keywords}</span>
                                                        )
                                                    })
                                                }
                                                
                                            </div>
                                        </div>
                                        
                                    </div>                                  

                                )
                            })}
                            </div>

                        </div>
                            
                    :
                    <div className="list_no_record">
                        <img src={EmptyFileLogo} alt=""/>
                        <p>You haven’t created any Auto Responder yet.</p>
                        <a href="" onClick={this.addAutoResponderHandler} className="createbtn"><img src={plusLogo} alt=""/> Create New</a>
                    </div>
                    }
                </div> 
                :
                ""
                }
                {this.state.autoResponsederCreate ?
                <div id="tabautoResponder" className="subtabcontent">
                    {this.state.loader && (   
                                <div className="after_login_refresh"><img src={LoaderLogo} alt=""/></div>
                    )}
                    <div className="headding gap1">
                            <span className="big">Create a Auto Responder</span> 
                            <a  onClick={this.listAutoResponderHandler} href="#" className="roundarrow"><img src={backArrowLogo}/></a>
                        </div>
                    <form>
                        <label>
                            Auto Responder Name
                        </label>
                            <input type="text" 
                            name="auto_responder_name" 
                            id="auto_responder_name" 
                            placeholder="Auto-Responder Name" 
                            value={this.state.auto_responder_name}
                            onChange={this.inputChangeHandller}/>
                        <label>
                            Keywords
                        </label>
                            <ReactTags 
                            placeholder="Press enter Or Press , to Create Autoresponder Keywords"
                            tags={auto_responder_keywords}
                            handleDelete={this.handleDelete}
                            handleAddition={this.handleAddition}
                            allowUnique={true}
                            delimiters={delimiters} />
                            
                        <label>Auto Response Message</label>
                            <textarea className="withtag" 
                            name="auto_responder_message"
                            id="auto_responder_message"
                            rows="3"  
                            placeholder="Please enter the response message...."
                            value={this.state.auto_responder_message}
                            onChange={this.inputChangeHandller}
                            ></textarea>
                            <button type="button" onClick={() => this.insertTagAtMessageSegments('auto_responder_message', '{first_name}')} className="formtag">[ First Name ]</button> 
                            <button type="button" onClick={() => this.insertTagAtMessageSegments('auto_responder_message', '{last_name}')} class="formtag">[ Last Name ]</button>
                            <button type="button" onClick={() => this.insertTagAtMessageSegments('auto_responder_message', '{date}')} class="formtag">[ Todays Date ]</button>


                            
                        <label>
                            {this.state.auto_responder_status ?
                                <input className="checking" type="checkbox" id="checkboxPrimary3" name="auto_responder_status" onChange={this.autoSetting} checked/>
                            :
                                <input className="checking" type="checkbox" id="checkboxPrimary3" name="auto_responder_status" onChange={this.autoSetting}/>
                            }
                            Activate this Auto Responder
                        </label>
    
                        <button className="blue_btn" onClick={this.createAutoResponderGroupHandler} type="submit">Save Auto Responder</button>
                    </form>
                </div>
                :
                ""
                }
                {this.state.autoResponsederEdit?
                <div id="tabautoResponder" className="subtabcontent">
                    {this.state.loader && (   
                                <div className="after_login_refresh"><img src={LoaderLogo} alt=""/></div>
                    )}
                    <div className="headding gap1">
                            <span className="big">Edit a Auto Responder</span> 
                            <a  onClick={this.listAutoResponderHandler} href="#" className="roundarrow"><img src={backArrowLogo}/></a>
                        </div>
                    <form>
                        <label>
                            Auto Responder Name
                        </label>
                            <input type="text" 
                            name="auto_responder_name_edit" 
                            id="auto_responder_name_edit" 
                            placeholder="Auto-Responder Name" 
                            value={this.state.auto_responder_name_edit}
                            onChange={this.inputChangeHandller}/>
                        <label>
                            Keywords
                        </label>
                            <ReactTags 
                            placeholder="Press enter Or Press , to Create Autoresponder Keywords"
                            tags={auto_responder_keywords_edits}
                            handleDelete={this.handleEditDelete}
                            handleAddition={this.handleEditAddition}
                            allowUnique={true}
                            delimiters={delimiters} />
                        
                        <label>Auto Response Message</label>
                            <textarea className="withtag" 
                            name="auto_responder_message_edit"
                            id="auto_responder_message_edit"
                            rows="3"  
                            placeholder="Please enter the response message...."
                            value={this.state.auto_responder_message_edit}
                            onChange={this.inputChangeHandller}
                            ></textarea>
                            <button type="button" onClick={() => this.insertTagAtMessageSegments('auto_responder_message_edit', '{first_name}')} className="formtag">[ First Name ]</button> 
                            <button type="button" onClick={() => this.insertTagAtMessageSegments('auto_responder_message_edit', '{last_name}')} class="formtag">[ Last Name ]</button>
                            <button type="button" onClick={() => this.insertTagAtMessageSegments('auto_responder_message_edit', '{date}')} class="formtag">[ Todays Date ]</button>

                        <label>
                            {this.state.auto_responder_status_edit ?
                                <input className="checking" type="checkbox" id="checkboxPrimary3" name="auto_responder_status_edit" onChange={this.autoSettingEdit} checked/>
                            :
                                <input className="checking" type="checkbox" id="checkboxPrimary3" name="auto_responder_status_edit" onChange={this.autoSettingEdit}/>
                            }
                            Activate this Auto Responder
                        </label>
                        <button className="blue_btn" onClick={this.createAutoResponderGroupHandlerEdit} type="submit">Update Auto Responder</button>

                    </form>
                </div>
                :
                ""
                }

        </div>
            
            
       
        )
      }
}
export default responseSetting;