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




export function OpenPoweredBy() {
    try{
        const myNewUrl  =   'https://go.grammywammy.net/signup';
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
 * @OpenTier5Partnership
 * this function will open Tier5 Partnership in a new Tab
 * 
*/
export function OpenTier5Partnership() {
    try{
        const myNewUrl  =   'https://go.grammywammy.net/partners';
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
 * @OpenFacebookLink
 * this function will open Facebook Link in a new Tab
 * 
*/
export function OpenFacebookLink() {
    try{
        const myNewUrl  =   'https://go.grammywammy.net/facebook-page';
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
 * @OpenMessengerLink
 * this function will open Powered By in a new Tab
 * 
*/
export function OpenMessengerLink() {
    try{
        const myNewUrl  =   'https://go.grammywammy.net/messenger';
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
 * @OpenSignupLink
 * this function will open Signup Link in a new Tab
 * 
*/
export function OpenSignupLink() {
    try{
        const myNewUrl  =   'https://go.grammywammy.net/signup';
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
export function refreshMessaging()  {
      try{
        if(localStorage.getItem('instaprofile')){
            let instaprofile=parseInt(localStorage.getItem('instaprofile'));
            chrome.tabs.remove(instaprofile);
            localStorage.removeItem('instaprofile');
        }
        if(localStorage.getItem('InstagramMessageList')){
            let InstagramMessageList=parseInt(localStorage.getItem('InstagramMessageList'));
            chrome.tabs.remove(InstagramMessageList);
            localStorage.removeItem('InstagramMessageList');
        }
        if(localStorage.getItem('InstagramMessageIndividual')){
            let InstagramMessageIndividual=parseInt(localStorage.getItem('InstagramMessageIndividual'));
            chrome.tabs.remove(InstagramMessageIndividual);
            localStorage.removeItem('InstagramMessageIndividual');
        }
        let  ListIdArray=[];
        let NewListIdArray=JSON.stringify(ListIdArray);
        localStorage.setItem('CheckMessageNReply', 0);
        localStorage.setItem('ListIdArray', NewListIdArray);
        if(localStorage.getItem('instaprofile')){
            let instaprofile=parseInt(localStorage.getItem('instaprofile'));
            chrome.tabs.remove(instaprofile);
            localStorage.removeItem('instaprofile');
        }
        if(localStorage.getItem('InstagramMessageList')){
            let InstagramMessageList=parseInt(localStorage.getItem('InstagramMessageList'));
            chrome.tabs.remove(InstagramMessageList);
            localStorage.removeItem('InstagramMessageList');
        }
        if(localStorage.getItem('InstagramMessageIndividual')){
            let InstagramMessageIndividual=parseInt(localStorage.getItem('InstagramMessageIndividual'));
            chrome.tabs.remove(InstagramMessageIndividual);
            localStorage.removeItem('InstagramMessageIndividual');
        }
        const myNewUrl  =   `https://www.instagram.com/`;
        let CreateTab    =   chrome.tabs.create({
            url: myNewUrl,
            active: true,
            pinned:true
        },function(tab) { 
            let instaprofile=tab.id;
            localStorage.setItem('instaprofile', instaprofile);
        });

        //   let CreateInstagramMessageListTab    =   chrome.tabs.create({
        //       url: `https://www.instagram.com/direct/inbox/`,
        //       active: true,
        //       pinned:true
        //   },function(tab) { 
        //       let InstagramMessageList=tab.id;
        //       localStorage.setItem('InstagramMessageList', InstagramMessageList);
        //   });

        //   let CreateInstagramMessageIndividualTab    =   chrome.tabs.create({
        //       url: `https://www.instagram.com/direct/inbox/`,
        //       active: true,
        //       pinned:true
        //   },function(tab) { 
        //       let InstagramMessageIndividual=tab.id;
        //       localStorage.setItem('InstagramMessageIndividual', InstagramMessageIndividual);
        //   });
          return "Done";
      }catch(error){
          return error
      }
  }

