setTimeout(function() {
console.log("I am in Profile JS ");
let UserFacebookUsername =  "";
let UserFacebookName    =   "";
let UserFacebookid  =   "";
let UserFacebookImage   =   "";
let InstagramUsername  = "";
let UserInstagramName  = "";
let UserInstagramImage = "";
let UserLoggedInFacebook =  false;
let NavItem =$('.ctQZg');
let CheckCounter =0;
if(NavItem){
    console.log("I Got THIS Nav Items ",NavItem.length);
    if(NavItem.length  === 0){
        CheckCounter =0;
        UserLoggedInFacebook =  false;
    }else{
      
        InstagramUsername  = document.getElementsByClassName('_7UhW9       fKFbl yUEEX   KV-D4              fDxYl     ')[0].innerText;
        UserInstagramName  = document.getElementsByClassName('rhpdm')[0].innerText
        UserInstagramImage  =  document.getElementsByClassName('be6sR')[0].src
        UserLoggedInFacebook  = true;
        
    }   
}else{
    UserLoggedInFacebook =  false;
    //console.log("I Did Not Got THIS Nav Items ",NavItem);
}

let parameters={
    insta_username : InstagramUsername,
    insta_name : UserInstagramName,
    insta_image  : UserInstagramImage,
    LoggedInFacebook  : UserLoggedInFacebook
  }

//console.log("This I got After Scraping ",parameters);
chrome.runtime.sendMessage({type: "storeUserInfoOrQueryThenStore", options: parameters});
}, 3000);