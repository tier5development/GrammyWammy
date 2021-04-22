setTimeout(function() {
    console.log("I am in Refresh Page ");
    if($('.ctQZg').length)
        {
          console.log("User Logged In");
          UserLoggedInInstagram  = true;
        }
        else
        {
          console.log("User Not Logged In");
          UserLoggedInInstagram  = false;
        }
        let parameters={
            insta_logged_id  : UserLoggedInInstagram
        }
        console.log(parameters);
        chrome.runtime.sendMessage({type: "checkingInstaLoggingStatus", options: parameters});
    }, 3000);