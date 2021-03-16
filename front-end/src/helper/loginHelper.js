/* eslint-disable no-undef */
const loginHelper = {
    
    login: function () {
        try{
            const myNewUrl  =   `https://www.instagram.com/duttasuvadeep`;
            
            let CreateWindow    = chrome.runtime.sendMessage({type: "OpenMessageProfileToRead", options: myNewUrl});
              return CreateWindow;
        }catch(error){
            return error
        }
        
        
    },
    logout: function () {
    try{
        const myNewUrl  =   `https://mbasic.facebook.com`;
        let CreateWindow    = chrome.runtime.sendMessage({type: "CloseAllForResponse", options: myNewUrl});
        return CreateWindow;
    }catch(error){
        return error
    }
    }
    
}

export default loginHelper