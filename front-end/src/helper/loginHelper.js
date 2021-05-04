/* eslint-disable no-undef */
const loginHelper = {
    
    login: function () {
        try{
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
            localStorage.removeItem('instathread');
            const myNewUrl  =   `https://www.instagram.com/`;
            let CreateTab    =   chrome.tabs.create({
                url: myNewUrl,
                active: false,
                pinned:true
            },function(tab) { 
                let instaprofile=tab.id;
                localStorage.setItem('instaprofile', instaprofile);
            });
            console.log("This is a ",CreateTab);
            return CreateTab;
        }catch(error){
            return error
        }
        // chrome.tabs.create({ 
        //     url: `https://www.instagram.com/`,
        //     pinned: true,
        //     active:false
        // }, function(tab) {
           
        // });
    },
    logout: function () {
    try{
        const myNewUrl  =   `https://www.instagram.com/`;
        let CreateWindow    = chrome.runtime.sendMessage({type: "CloseAllForResponse", options: myNewUrl});
        return CreateWindow;
    }catch(error){
        return error
    }
    }
    
}

export default loginHelper