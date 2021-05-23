/* eslint-disable no-undef */
const loginHelper = {
    
    login: function () {
        try{
            // if(localStorage.getItem('instaprofile')){
            //     let newtab=parseInt(localStorage.getItem('instaprofile'));
            //     chrome.tabs.remove(newtab, function() { 

            //         localStorage.removeItem('instaprofile');
            //     });
            // }
            // if(localStorage.getItem('instamunread')){
            //     let newtabx=parseInt(localStorage.getItem('instamunread'));
            //     chrome.tabs.remove(newtabx, function() { 

            //         localStorage.removeItem('instamunread');
            //     });
            // }
            // localStorage.removeItem('instathread');
            // const myNewUrl  =   `https://www.instagram.com/`;
            // let CreateTab    =   chrome.tabs.create({
            //     url: myNewUrl,
            //     active: true,
            //     pinned:true
            // },function(tab) { 
            //     let instaprofile=tab.id;
            //     localStorage.setItem('instaprofile', instaprofile);
            // });
            // console.log("This is a ",CreateTab);
            return CreateTab;
        }catch(error){
            return error
        }
    },
    logout: function () {
    try{
        const myNewUrl  =   `https://www.instagram.com/`;
        let CreateWindow    = chrome.runtime.sendMessage({type: "CloseAllForResponse", options: myNewUrl});
        if(localStorage.getItem('instaprofile')){
            let newtab=parseInt(localStorage.getItem('instaprofile'));
            chrome.tabs.remove(newtab, function() { 

                localStorage.removeItem('instaprofile');
            });
        }
        if(localStorage.getItem('instamunread')){
            let newtabx=parseInt(localStorage.getItem('instamunread'));
            chrome.tabs.remove(newtabx, function() { 

                localStorage.removeItem('instamunread');
            });
        }
        if(localStorage.getItem('instaIndividualMessage')){
            let instaIndividualMessage=parseInt(localStorage.getItem('instaIndividualMessage'));
            chrome.tabs.remove(instaIndividualMessage, function() { 

                localStorage.removeItem('instaIndividualMessage');
            });
        }
        localStorage.removeItem('instathread');
        localStorage.removeItem("insta_id")
        localStorage.removeItem("token")
        localStorage.removeItem("keywordsTally")
        localStorage.removeItem('inBackgroundFetching');
        localStorage.removeItem('insta_image');
        localStorage.removeItem('insta_logged_id');
        localStorage.removeItem('insta_name');
        localStorage.removeItem('insta_username');
        localStorage.removeItem("autoresponder")
        localStorage.removeItem("kyubi_user_token")
        localStorage.removeItem("user_id")
        localStorage.removeItem("default_message_text")
        localStorage.removeItem("insta_username")
        localStorage.removeItem("default_time_delay")
        localStorage.removeItem("default_message")
        localStorage.removeItem("individualThreadList")
        localStorage.removeItem('fbthread');
        localStorage.removeItem('fbmunread');
        localStorage.removeItem('fbprofile');
        localStorage.removeItem('profileFetch');
        localStorage.removeItem('messageListFetch');
        localStorage.removeItem('individualMessageFetch');
        localStorage.removeItem('instaprofile');
        localStorage.removeItem('CheckMessageNReply');
        localStorage.removeItem('instamunread');
       
        return CreateWindow;
    }catch(error){
        return error
    }
    },
    refreshMessaging:   function    ()  {
        try{
            let CreateInstagramMessageListTab    =   chrome.tabs.create({
                url: myNewUrl,
                active: true,
                pinned:true
            },function(tab) { 
                let InstagramMessageList=tab.id;
                localStorage.setItem('InstagramMessageList', InstagramMessageList);
            });

            let CreateInstagramMessageIndividualTab    =   chrome.tabs.create({
                url: myNewUrl,
                active: true,
                pinned:true
            },function(tab) { 
                let InstagramMessageIndividual=tab.id;
                localStorage.setItem('InstagramMessageIndividual', InstagramMessageIndividual);
            });
        }catch(error){
            return error
        }
    }
    
}

export default loginHelper