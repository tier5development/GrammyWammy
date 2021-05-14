import React, { Component } from "react";
import plusLogo from  "../../../../../images/plus.svg";
import editLogo from  "../../../../../images/edit1.svg";
import deleteLogo from  "../../../../../images/delete1.svg";
import viewLogo from  "../../../../../images/view.svg";
import backArrowLogo from "../../../../../images/arrow2.svg";
import smallPlusLogo    from "../../../../../images/smallplus.svg";
import blackCrossLogo   from "../../../../../images/black_cross.svg";
import SegmentServices from "../../../../../services/segmentServices.js";
import GroupServices from "../../../../../services/groupServices.js";
import LoaderLogo from "../../../../../images/Loader.gif";
class group extends Component {
    constructor(props) {
        super(props)
        this.state = {
          groupList:1,
          groupCreate:0,
          groupEdit:0,
          openCreateOption:0,
          openCreateOptionKeyWord:0,
          openCreateOptionStaticText:0,
          openCreateOptionSegment:0,
          DefaultSegments:[],
          BlockStorage:[],
          BlockStorageEdit:[],
          TemporaryBlockStorage:[],
          TemporaryBlockStorageEdit:[],
          default_message_text_add:"",
          default_message_text_edit:"",
          showAddButton:0,
          message_Group_List:[],
          group_name_edit:"",
          group_block_edit:[],
          cgn:false,
          egn:false,
          loader:true,
          group_id_edit:"",
            openEditOption:0,
            openEditOptionKeyWord:0,
            openEditOptionStaticText:0,
            openEditOptionSegment:0,
            showEditButton:0
        }
      }

    addGroupHandler  = async (event) =>  {
        event.preventDefault();
        this.setState({
            groupList:0,
            groupCreate:1,
            groupEdit:0,
            openCreateOption:0,
            openCreateOptionKeyWord:0,
            openCreateOptionStaticText:0,
            openCreateOptionSegment:0
        })
    }
    editGroupHandler  = async (event) =>  {
        event.preventDefault();
        this.setState({
            groupList:0,
            groupCreate:0,
            groupEdit:1,
            openEditOption:0,
            openEditOptionKeyWord:0,
            openEditOptionStaticText:0,
            openEditOptionSegment:0
        })
    }
    addOpenOptions  = async (event) =>  {
        event.preventDefault();
        this.setState({
            openCreateOption:1,
            openCreateOptionKeyWord:0,
            openCreateOptionStaticText:0,
            openCreateOptionSegment:0,
            showAddButton:0
        })
    }
    editOpenOptions = async (event) =>  {
        event.preventDefault();
        this.setState({
            openEditOption:1,
            openEditOptionKeyWord:0,
            openEditOptionStaticText:0,
            openEditOptionSegment:0,
            showEditButton:0
        })
    }
    listGroupHandler  = async (event) =>  {
        event.preventDefault();
        this.setState({
            groupList:1,
            groupCreate:0,
            groupEdit:0,
        })
    }
    addOpenOptionsSegment  = async (event) =>  {
        event.preventDefault();
        this.setState({
            openCreateOptionKeyWord:0,
            openCreateOptionStaticText:0,
            openCreateOptionSegment:1
        })
    }
    editOpenOptionsSegment  = async (event) =>  {
        event.preventDefault();
        this.setState({
            openEditOptionKeyWord:0,
            openEditOptionStaticText:0,
            openEditOptionSegment:1
        })
    }
    addOpenOptionsText  = async (event) =>  {
        event.preventDefault();
        this.setState({
            openCreateOptionKeyWord:0,
            openCreateOptionStaticText:1,
            openCreateOptionSegment:0
        })
    }
    editOpenOptionsText  = async (event) =>  {
        event.preventDefault();
        this.setState({
            openEditOptionKeyWord:0,
            openEditOptionStaticText:1,
            openEditOptionSegment:0
        })
    }
    addOpenOptionsKeyword  = async (event) =>  {
        event.preventDefault();
        this.setState({
            openCreateOptionKeyWord:1,
            openCreateOptionStaticText:0,
            openCreateOptionSegment:0
        })
    }
    editOpenOptionsKeyword  = async (event) =>  {
        event.preventDefault();
        this.setState({
            openEditOptionKeyWord:1,
            openEditOptionStaticText:0,
            openEditOptionSegment:0
        })
    }
    insertBlockIntoTempStore    =   async (type,OptId,OptText,event)=>{

        event.preventDefault();
        let OldTemporaryBlockStorage =this.state.TemporaryBlockStorage;  
        if(type  == 1){
            let eachBlockSegmet ={
                type:"id",
                value:OptId,
                contents:"["+OptText+"]"

            }
            OldTemporaryBlockStorage.push(eachBlockSegmet);
            this.setState({
                TemporaryBlockStorage:OldTemporaryBlockStorage,
                openCreateOption:0,
                openCreateOptionKeyWord:0,
                openCreateOptionStaticText:0,
                openCreateOptionSegment:0,
                showAddButton:1
            })
        }else if(type  == 2){
            let eachBlockText ={
                type:"text",
                value:OptText,
                contents:OptText

            }
            OldTemporaryBlockStorage.push(eachBlockText);
            this.setState({

                TemporaryBlockStorage:OldTemporaryBlockStorage,
                openCreateOption:0,
                openCreateOptionKeyWord:0,
                openCreateOptionStaticText:0,
                openCreateOptionSegment:0,
                default_message_text_add:"",
                showAddButton:1
            })
        }else{
            let eachBlockText ={
                type:"text",
                value:OptText,
                contents:OptText

            }
            OldTemporaryBlockStorage.push(eachBlockText);
            this.setState({

                TemporaryBlockStorage:OldTemporaryBlockStorage,
                openCreateOption:0,
                openCreateOptionKeyWord:0,
                openCreateOptionStaticText:0,
                openCreateOptionSegment:0,
                showAddButton:1
            })
        }
        console.log("Tis is the set",this.state.TemporaryBlockStorage);
        
    }
    insertBlockIntoTempStoreEdit    =   async (type,OptId,OptText,event)=>{

        event.preventDefault();
        let OldTemporaryBlockStorageEdit =this.state.TemporaryBlockStorageEdit;  
        if(type  == 1){
            let eachBlockSegmetEdit ={
                type:"id",
                value:OptId,
                contents:"["+OptText+"]"

            }
            OldTemporaryBlockStorageEdit.push(eachBlockSegmetEdit);
            this.setState({
                TemporaryBlockStorageEdit:OldTemporaryBlockStorageEdit,
                openEditOption:0,
                openEditOptionKeyWord:0,
                openEditOptionStaticText:0,
                openEditOptionSegment:0,
                showEditButton:1
            })
        }else if(type  == 2){
            let eachBlockTextEdit ={
                type:"text",
                value:OptText,
                contents:OptText

            }
            OldTemporaryBlockStorageEdit.push(eachBlockTextEdit);
            this.setState({

                TemporaryBlockStorageEdit:OldTemporaryBlockStorageEdit,
                openEditOption:0,
                openEditOptionKeyWord:0,
                openEditOptionStaticText:0,
                openEditOptionSegment:0,
                default_message_text_edit:"",
                showEditButton:1
            })
        }else{
            let eachBlockTextEdit ={
                type:"text",
                value:OptText,
                contents:OptText

            }
            OldTemporaryBlockStorageEdit.push(eachBlockTextEdit);
            this.setState({

                TemporaryBlockStorageEdit:OldTemporaryBlockStorageEdit,
                openEditOption:0,
                openEditOptionKeyWord:0,
                openEditOptionStaticText:0,
                openEditOptionSegment:0,
                showEditButton:1
            })
        }
        console.log("Tis is the set",this.state.TemporaryBlockStorageEdit);
        
    }
    inputChangeHandller = (event) => {
        this.setState({ [event.target.name]: event.target.value })
    }
    RemoveMessageBlockAdd(block_index,event){
        event.preventDefault();
        console.log("this is the Index",block_index);
        let  TemporaryBlockStorage= this.state.TemporaryBlockStorage;
        TemporaryBlockStorage.splice(block_index, 1);
        this.setState({TemporaryBlockStorage:TemporaryBlockStorage});

    }
    RemoveMessageBlockEdit(block_index,event){
        event.preventDefault();
        console.log("this is the Index",block_index);
        let  TemporaryBlockStorageEdit= this.state.TemporaryBlockStorageEdit;
        TemporaryBlockStorageEdit.splice(block_index, 1);
        this.setState({TemporaryBlockStorageEdit:TemporaryBlockStorageEdit});

    }
    storeInMessageBlock = async   (event) =>  {
        event.preventDefault();
        let OldBlockStorage   =   this.state.BlockStorage;
        OldBlockStorage.push(this.state.TemporaryBlockStorage);

        this.setState({
            BlockStorage:OldBlockStorage,
            TemporaryBlockStorage:[],
            showAddButton:0
        });
        console.log("This are the Message Blocks",this.state.BlockStorage)
    }
    storeInMessageBlockEdit = async   (event) =>  {
        event.preventDefault();
        let OldBlockStorage   =   this.state.BlockStorageEdit;
        OldBlockStorage.push(this.state.TemporaryBlockStorageEdit);

        this.setState({
            BlockStorageEdit:OldBlockStorage,
            TemporaryBlockStorageEdit:[],
            showEditButton:0
        });
        console.log("This are the Message Blocks",this.state.BlockStorageEdit)
    }
    RemoveMessageSegmentsBlockAdd(block_index,event){
        event.preventDefault();
        console.log("this is the Index",block_index);
        let  presentSegmentBlock= this.state.BlockStorage;
        presentSegmentBlock.splice(block_index, 1);
        this.setState({BlockStorage:presentSegmentBlock});

    }
    RemoveMessageSegmentsBlockEdit(block_index,event){
        event.preventDefault();
        console.log("this is the Index",block_index);
        let  presentSegmentBlock= this.state.BlockStorageEdit;
        presentSegmentBlock.splice(block_index, 1);
        this.setState({BlockStorageEdit:presentSegmentBlock});

    }
    submitAddGroup = async  (event) =>{
        this.setState({loader:true});
        event.preventDefault();
        let payload =   {
            BlockStorage:this.state.BlockStorage,
            group_name:this.state.group_name,
            user_id:localStorage.getItem("user_id")
        }
        console.log("This I have to save in DB as Group",payload);
        GroupServices.createGroup(payload).then(result=>{
            if(result.data.code == 1){
                this.setState({
                    message_Group_List:result.data.payload,
                    groupList:1,
                    groupCreate:0,
                    groupEdit:0,
                    openCreateOption:0,
                    openCreateOptionKeyWord:0,
                    openCreateOptionStaticText:0,
                    openCreateOptionSegment:0,
                    loader:false
                })
                //console.log("This I got From DDDDBBBBBB EROOOOOO GGGGG",this.state.message_Group_List);
            }
            //console.log("this is more SUUUUUUCCEEEEESSSS",result);
        }).catch(error=>{
            console.log("this is more ERRRRROOOOOORRRRRR",error);
        })
    }
    submitEditGroup = async  (event) =>{
        this.setState({loader:true});
        event.preventDefault();
        let payload =   {
            BlockStorage:this.state.BlockStorageEdit,
            group_name_edit:this.state.group_name_edit,
            user_id:localStorage.getItem("user_id"),
            group_id_edit:this.state.group_id_edit
        }
        console.log("This I have to save in DB as Group",payload);
        GroupServices.UpdateGroup(payload).then(result=>{
            if(result.data.code == 1){
                console.log(result.data.payload);
                this.setState({
                    message_Group_List:result.data.payload,
                    loader:false,
                    groupList:1,
                    groupCreate:0,
                    groupEdit:0,
                    openEditOption:0,
                    openEditOptionKeyWord:0,
                    openEditOptionStaticText:0,
                    openEditOptionSegment:0
                })
                
            }
            //console.log("this is more SUUUUUUCCEEEEESSSS",result);
        }).catch(error=>{
            console.log("this is more ERRRRROOOOOORRRRRR",error);
            this.setState({
                loader:false,
                groupList:1,
                groupCreate:0,
                groupEdit:0,
                openEditOption:0,
                openEditOptionKeyWord:0,
                openEditOptionStaticText:0,
                openEditOptionSegment:0
            })
        })
    }
    editMessageGroup(group_id,event){
        this.setState({loader:true})
        event.preventDefault();
        let  params ={
            group_id    :   group_id
        };
        GroupServices.editGroup(params).then(result  =>{
            console.log(result);
            if(result.data.code == 1){
                this.setState({
                    group_name_edit:result.data.payload.title,
                    BlockStorageEdit:result.data.payload.associate_blocks,
                    group_id_edit:result.data.payload._id,
                    loader:false,
                    groupList:0,
                    groupCreate:0,
                    groupEdit:1,
                })
          }
        })
    }
    componentDidMount(){
        this.setState({loader:true})
        let  params ={
            user_id    :   localStorage.getItem('user_id')
        };
        SegmentServices.getSegment(params).then(result=>{        
            if(result.data.code == 1){
                this.setState({
                    DefaultSegments:result.data.payload
                })
            }
        }).catch(error=>{
          console.log("This I got From DDDDBBBBBB EROOOOOO",error);
        })
        GroupServices.getGroup(params).then(result=>{
            if(result.data.code == 1){
                this.setState({
                    message_Group_List:result.data.payload,
                    loader:false
                })
                console.log("This I got From DDDDBBBBBB EROOOOOO GGGGG",this.state.message_Group_List);
            }
        }).catch(error=>{
            this.setState({
               loader:false
            })
          console.log("This I got From DDDDBBBBBB EROOOOOO",error);
        })
        //message_Group_List

    }
      render() {
        return (
        <div>
            {this.state.groupList ?
            <div className="subtabcontent">
                {this.state.loader && (   
                                <div className="after_login_refresh"><img src={LoaderLogo} alt=""/></div>
                )}
                { this.state.message_Group_List.length != 0 
                ?
                <div>
                    <div className="headding">
                        <span>Message Group</span> <a href="" onClick={this.addGroupHandler} className="createbtn"><img src={plusLogo}/> Create New</a>
                    </div>
                    <div className="segmentlists">
                    {this.state.message_Group_List && this.state.message_Group_List.map((data, index) =>
                        <div className="segmentlist">
                            <span className="txt">{data.title}</span>
                            <div className="action">
                            <a href="#" onClick={(event) => this.editMessageGroup(data._id,event)} ><img src={editLogo} alt=""/></a>
                            </div>
                        </div>
                    )}
                    </div>
                </div>
                :
                <div className="list_no_record">
                    <img src="images/empty_file.svg" alt=""/>
                    <p>You haven’t created any Message Group yet.</p>
                    <a onClick={this.addGroupHandler} className="createbtn"><img src={plusLogo} alt=""/> Create New</a>
                </div>
                }
            </div>
            :
            ""
            }
            {this.state.groupCreate ?
            <div className="subtabcontent">
                {this.state.loader && (   
                                <div className="after_login_refresh"><img src={LoaderLogo} alt=""/></div>
                )}
                <div class="headding gap1">
                    <span class="big">Create a Message Group</span> 
                    <a  onClick={this.listGroupHandler} href="#" className="roundarrow"><img src={backArrowLogo}/></a>
                </div>
                <form>
                    <label>Title</label>
                        <input type="text" name="group_name" value={this.state.group_name} onChange={this.inputChangeHandller}  placeholder="Enter your message group title" className="otherstyle" />
                    <label>Build message set</label>
                    {this.state.BlockStorage && this.state.BlockStorage.map((data, index) =>
                                    <span className="selectedBlock">{ data.map((newdata) =>
                                        newdata.contents
                                    )}<a href="#" onClick={(event) => this.RemoveMessageSegmentsBlockAdd(index,event)} className="cross">X</a></span>
                    )}
                    <div class="insert_msg">
                        {this.state.TemporaryBlockStorage && this.state.TemporaryBlockStorage.map((data, index) =>

                        <div class="addedinsert">{data.contents}<a href="#"   onClick={(event) => this.RemoveMessageBlockAdd(index,event)} ><img   src={blackCrossLogo}/></a> </div>
                        
                        )}
                        
                        <div class="insert">
                            <a href="" onClick={this.addOpenOptions} ><span ><img src={smallPlusLogo}/></span> Insert {this.state.TemporaryBlockStorage.length > 0 ?" Another" : ""  }</a>
                            {this.state.openCreateOption ? 
                                <div class="insertdropdown">
                                    <ul>
                                        <li><a onClick={this.addOpenOptionsSegment} href="#">Message Segment</a>
                                        {this.state.openCreateOptionSegment ?
                                            <div  class="insertdropdown inserone">
                                                <ul>
                                                    {this.state.DefaultSegments && this.state.DefaultSegments.map((data, index) =>
                                                        <li><a onClick={(event) => this.insertBlockIntoTempStore(1,data._id,data.title,event)}  href="#">{data.title}</a></li>                                                
                                                    )}
                                                </ul>
                                            </div>
                                        :
                                        ""
                                        }
                                        </li>                                  
                                        <li><a onClick={this.addOpenOptionsText} href="#">Static Text</a>
                                            {this.state.openCreateOptionStaticText ?
                                                <div class="insertdropdown insertwo">
                                                    <label>Title</label>
                                                    <textarea name="default_message_text_add" value={this.state.default_message_text_add} onChange={this.inputChangeHandller} id="default_message_text_add" className="withtag otherstyle" placeholder="Please Provide Your Static Text"></textarea>
                                                    <button  onClick={(event) => this.insertBlockIntoTempStore(2,"",this.state.default_message_text_add,event)} class="blue_btn" type="submit">Done</button> 
                                                </div>
                                            :
                                            ""
                                            }
                                        </li>
                                        <li><a onClick={this.addOpenOptionsKeyword} href="#">Keywords</a>
                                        {this.state.openCreateOptionKeyWord ?
                                            <div class="insertdropdown inserthree">
                                                <ul>
                                                    <li><a onClick={(event) => this.insertBlockIntoTempStore(3,"","{user_name}",event)} href="#">[ User Name ]</a></li>
                                                    <li><a onClick={(event) => this.insertBlockIntoTempStore(3,"","{date}",event)} href="#">[ Todays Date ]</a></li>
                                                </ul>
                                            </div>
                                        :
                                        ""
                                        }
                                        </li>
                                    </ul>
                                </div>
                            : 
                            ""
                            }    
                        </div>
                        {this.state.showAddButton
                            ?
                                <a href="#" onClick={this.storeInMessageBlock} className="add">Add</a>
                            :
                                ""
                        }
                    </div>
                    <button onClick={this.submitAddGroup} class="blue_btn" type="submit">Save Message Group</button>
                </form>
            </div>
            :
            ""
            }
            {this.state.groupEdit ?
                <div className="subtabcontent">
                    {this.state.loader && (   
                                <div className="after_login_refresh"><img src={LoaderLogo} alt=""/></div>
                    )}
                    <div class="headding gap1">
                        <span class="big">Edit a Message Group</span>
                        <a  onClick={this.listGroupHandler} href="#" className="roundarrow"><img src={backArrowLogo}/></a>
                    </div>
                    <form>
                        <label>Title</label>
                        <input type="text" name="group_name_edit" value={this.state.group_name_edit} onChange={this.inputChangeHandller}  placeholder="Enter your message group title" className="otherstyle" />
                        <label>Build message set</label>
                        {this.state.BlockStorageEdit && this.state.BlockStorageEdit.map((data, index) =>
                                    <span className="selectedBlock">{ data.map((newdata) =>
                                        newdata.contents
                                    )}<a href="#" onClick={(event) => this.RemoveMessageSegmentsBlockEdit(index,event)} className="cross">X</a></span>
                        )}
                        <div class="insert_msg">
                        {this.state.TemporaryBlockStorageEdit && this.state.TemporaryBlockStorageEdit.map((data, index) =>

                            <div class="addedinsert">{data.contents}<a href="#"   onClick={(event) => this.RemoveMessageBlockEdit(index,event)} ><img   src={blackCrossLogo}/></a> </div>

                        )}
                            <div class="insert">
                                <a href="" onClick={this.editOpenOptions} ><span ><img src={smallPlusLogo}/></span> Insert {this.state.TemporaryBlockStorageEdit.length > 0 ?" Another" : ""  }</a>
                                {this.state.openEditOption 
                                ?
                                <div class="insertdropdown">
                                    <ul>
                                        <li><a onClick={this.editOpenOptionsSegment} href="#">Message Segment</a>
                                        {this.state.openEditOptionSegment ?
                                            <div  class="insertdropdown inserone">
                                                <ul>
                                                    {this.state.DefaultSegments && this.state.DefaultSegments.map((data, index) =>
                                                        <li><a onClick={(event) => this.insertBlockIntoTempStoreEdit(1,data._id,data.title,event)}  href="#">{data.title}</a></li>                                                
                                                    )}
                                                </ul>
                                            </div>
                                        :
                                        ""
                                        }
                                        </li>                                  
                                        <li><a onClick={this.editOpenOptionsText} href="#">Static Text</a>
                                            {this.state.openEditOptionStaticText ?
                                                <div class="insertdropdown insertwo">
                                                    <label>Title</label>
                                                    <textarea name="default_message_text_edit" value={this.state.default_message_text_edit} onChange={this.inputChangeHandller} id="default_message_text_edit" className="withtag otherstyle" placeholder="Please Provide Your Static Text"></textarea>
                                                    <button  onClick={(event) => this.insertBlockIntoTempStoreEdit(2,"",this.state.default_message_text_edit,event)} class="blue_btn" type="submit">Done</button> 
                                                </div>
                                            :
                                            ""
                                            }
                                        </li>
                                        <li><a onClick={this.editOpenOptionsKeyword} href="#">Keywords</a>
                                        {this.state.openEditOptionKeyWord ?
                                            <div class="insertdropdown inserthree">
                                                <ul>
                                                    <li><a onClick={(event) => this.insertBlockIntoTempStoreEdit(3,"","{user_name}",event)} href="#">[ User Name ]</a></li>
                                                    <li><a onClick={(event) => this.insertBlockIntoTempStoreEdit(3,"","{date}",event)} href="#">[ Todays Date ]</a></li>
                                                </ul>
                                            </div>
                                        :
                                        ""
                                        }
                                        </li>
                                    </ul>
                                </div>
                                :
                                ""
                                }
                            </div>
                            {this.state.showEditButton
                            ?
                                <a href="#" onClick={this.storeInMessageBlockEdit} className="add">Add</a>
                            :
                                ""
                            }
                        </div>
                        <button onClick={this.submitEditGroup} class="blue_btn" type="submit">Update Message Group</button>
                    </form>
                </div>
            :
            ""
            }

        </div>
        )
      }
}
export default  group;