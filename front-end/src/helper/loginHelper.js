/* eslint-disable no-undef */
const loginHelper = {
    
    login: function () {
        
        chrome.tabs.create({ 
            url: `https://www.instagram.com/`,
            active: true
        }, function(tab) {
           
        });
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