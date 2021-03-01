/* eslint-disable no-undef */
/** 
 * @OpenFacebookInTab
 * this function will open Facebook in a new  tab and will  focus  on it
 * 
*/
export function OpenFacebookInTab() {
    try{
        const myNewUrl  =   `https://www.facebook.com`;
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
    try{
            const myNewUrl  =   `https://mbasic.facebook.com`;
            let CreateWindow    =   chrome.windows.create({
                url: myNewUrl,
                type: "popup",
                height: 1,
                width:1,
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
        console.log("This is a ",error);
    }
  }

/** 
 * @OpenFacebookProfileInTab
 * this function will open Facebook Profile in a new Tab
 * 
*/
export function OpenFacebookProfileInTab() {
    try{
        const myNewUrl  =   'https://www.facebook.com/'+localStorage.getItem('fb_name');
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
