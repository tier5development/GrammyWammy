/* eslint-disable no-undef */
/** 
 * @OpenFacebookInTab
 * this function will open Facebook in a new  tab and will  focus  on it
 * 
*/
export function OpenFacebookInTab() {
    try{
        const myNewUrl  =   `https://www.instagram.com/`;
            let CreateTab    =   chrome.tabs.create({
                url: myNewUrl,
                active: true
              });
              console.log("This is a ",CreateTab);
              return CreateTab;
    }catch(error){
        console.log("This is a ",error);
    }
  }

/** 
 * @CheckUserInfoFromFaccebook
 * this function will open Facebook in a new Window and grab its info
 * 
*/
export function CheckUserInfoFromFaccebook() {
    // try{
    //         const myNewUrl  =   `https://www.instagram.com/`+localStorage.getItem('fb_username');
            
    //         let CreateWindow    = chrome.runtime.sendMessage({type: "OpenMessageProfileToRead", options: myNewUrl});
    //         return CreateWindow;
            
    // }catch(error){
    //     console.log("This is a ",error);
    // }
    chrome.tabs.update( parseInt(localStorage.getItem("profileTabId")), { 
        url: `https://www.instagram.com/explore/people/suggested/`,
        active: false, pinned:true});
  }

/** 
 * @OpenFacebookProfileInTab
 * this function will open Facebook Profile in a new Tab
 * 
*/
export function OpenFacebookProfileInTab() {
    try{
        const myNewUrl  =   `https://www.instagram.com/`+localStorage.getItem('insta_username');
        let CreateTab    =   chrome.tabs.create({
            url: myNewUrl,
            active: true
          });
          console.log("This is a ",CreateTab);
          return CreateTab;
    }catch(error){
        console.log("This is a ",error);
    }
  }
export function framecaller()   {
    try{
        const myNewUrl  =   'https://www.instagram.com/'+
        console.log("This is a ",myNewUrl);
        return myNewUrl;
    }catch(error){
        console.log("This is a ",error);
    }
}
