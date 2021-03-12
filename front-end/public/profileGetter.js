
//console.log("I am in Profile JS ");
let UserFacebookUsername =  "";
let UserFacebookName    =   "";
let UserFacebookid  =   "";
let UserFacebookImage   =   "";
let UserLoggedInFacebook =  false;
let NavItem =$("nav").find("a");
let CheckCounter =0;
if(NavItem){
    //console.log("I Got THIS Nav Items ",NavItem.length);
    if(NavItem.length  === 0){
        CheckCounter =0;
        UserLoggedInFacebook =  false;
    }else{
        NavItem.each( async function() {
            let  name = $(this).text();
            if(name === "Profile"){
                CheckCounter =CheckCounter+1;
            }
        })
        if(CheckCounter > 0){
            UserLoggedInFacebook =  true;
            UserFacebookid  =$('input[name=target]').val();
            let FormBox = $('#mbasic_inline_feed_composer').find('form').find('table').find('tbody').find('tr');
            //console.log("I Got THIS Table ",FormBox);
            FormBox.each(async function(i){
                if(i === 0){
                    let UserURL =$(this).find('td').find('div').find('a').attr('href');
                    let UserURLNo = UserURL.split('/');
                    let UserURLMo = UserURLNo[1].split('?');
                    UserFacebookUsername = UserURLMo[0];
                    let Name    =   $(this).find('td').find('div').find('a').find('img').attr('alt');
                    let finame = Name.split(',');
                    UserFacebookName  = finame[0];
                    UserFacebookImage   =   $(this).find('td').find('div').find('a').find('img').attr('src');
                    
                }
                

            })
          
        }else{
            UserLoggedInFacebook =  false;
        }
    }   
}else{
    UserLoggedInFacebook =  false;
    //console.log("I Did Not Got THIS Nav Items ",NavItem);
}

let parameters={
    FacebookId : UserFacebookid,
    FacebookUsername : UserFacebookUsername,
    FacebookName : UserFacebookName,
    FacebookImage  : UserFacebookImage,
    LoggedInFacebook  : UserLoggedInFacebook
  }

//console.log("This I got After Scraping ",parameters);
chrome.runtime.sendMessage({type: "storeUserInfoOrQueryThenStore", options: parameters});