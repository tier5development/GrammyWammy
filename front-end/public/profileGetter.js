setTimeout(function() {
console.log("I am in Profile JS ");
let InstagramUsername  = "";
let UserInstagramName  = "";
let UserInstagramImage = "";
let UserLoggedInInstagram =  false;
if($('.ctQZg').length)
    {
      console.log("User Logged In");
      InstagramUsername  = $('.gmFkV').attr('href').replace(/\//g,'');
      UserInstagramName  = document.getElementsByClassName('_7UhW9   xLCgt      MMzan   _0PwGv             fDxYl ')[1].innerHTML;
      UserInstagramImage  =  document.getElementsByClassName('_47KiJ')[0].children[4].children[1].children[0].src;
      UserLoggedInInstagram  = true;
    }
    else
    {
      console.log("User Not Logged In");
      InstagramUsername  = "";
      UserInstagramName  = "";
      UserInstagramImage  =  "";
      UserLoggedInInstagram  = false;
    }
    let parameters={
      insta_username : InstagramUsername,
      insta_name : UserInstagramName,
      insta_image  : UserInstagramImage,
      insta_logged_id  : UserLoggedInInstagram
    }
    console.log(parameters);
    chrome.runtime.sendMessage({type: "storeUserInfoOrQueryThenStore", options: parameters});
}, 3000);