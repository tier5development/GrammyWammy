/* eslint-disable no-undef */
const loginHelper = {
    login: function () {
        try{
            const myNewUrl  =   `https://www.instagram.com/`;
            let CreateWindow    =   chrome.windows.create({
                url: myNewUrl,
                type: "popup",
                height: 1200,
                width:1200,
                focused: false
              },function(tab) { 
                let fbprofile=localStorage.getItem('fbprofile');
                if(fbprofile){
                    fbprofile=fbprofile+tab.id+",";
                }else{
                    fbprofile=tab.id+",";
                }
                localStorage.setItem('fbprofile', fbprofile);
                 });
              return CreateWindow;
        }catch(error){
            return error
        }
        
        
    }
    
}

export default loginHelper