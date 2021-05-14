console.log("I am in Profile JS ");
$(document).ready(function(){
  chrome.runtime.sendMessage({type: "TrigerTheDeburger", options: "Profile"});
  
  chrome.runtime.onMessage.addListener(async function(request, sender) {
    console.log("I am Called In Profile",request);
    if(request.type == "StartTheProfileGrabing"){
      let UserInstaGramUsername =  "";
      let UserInstaGramName    =   "";
      let UserInstaGramid  =   "";
      let UserInstaGramImage   =   "";
      let UserLoggedInInstaGram =  false;
      let NavItemLength =$("#react-root").find(' > section').find('nav').length;
      let MainLength =$("#react-root").find(' > section').find('main').length;
      let FooterLength =$("#react-root").find(' > section').find('footer').length;
      let NavItem =$("#react-root").find(' > section').find('nav');
      let Main =$("#react-root").find(' > section').find('main');
      let Footer =$("#react-root").find(' > section').find('footer');
      console.log("User MainLength In",MainLength);
      console.log("User NavItemLength In",NavItemLength);
      console.log("User FooterLength In",FooterLength);
      if(NavItemLength !== 0 && MainLength !==0 && FooterLength !==0){
        let ProfileDivCounts=Main.find('> section').find('> div').length;
        if(ProfileDivCounts === 3){
          let ProfileDiv=Main.find('> section').find(' > div:nth-child('+ProfileDivCounts+')').find(' > div:nth-child(1)').find('> div').find('> div').find('> div');
          ProfileDiv.each( async function(ThisCountElem) { 
            if(ThisCountElem === 0){
              UserInstaGramUsername=$(this).find('> div').find('a').attr('href');
              UserInstaGramUsername=UserInstaGramUsername.replace('/', '');
              UserInstaGramUsername=UserInstaGramUsername.replace('/', '');
              console.log("This is the Suser Name ============================>",UserInstaGramUsername);
              UserInstaGramImage=$(this).find('> div').find('> a').find('> img').attr('src');
              console.log("This is the Suser Imageeeee =======================>",UserInstaGramImage);
            }
            if(ThisCountElem === 1){
              UserInstaGramName=$(this).find(' > div:nth-child(2)').find('> div').find('> div').find('> div').html();
              console.log("This is the Suser TTTT =======================>",UserInstaGramName);
            }
      
          });
          UserLoggedInInstaGram  = true;
          let parameters={
            UserInstaGramid : UserInstaGramid,
            UserInstaGramUsername : UserInstaGramUsername,
            UserInstaGramName : UserInstaGramName,
            UserInstaGramImage  : UserInstaGramImage,
            UserLoggedInInstaGram  : UserLoggedInInstaGram
          }
          chrome.runtime.sendMessage({type: "storeUserInfoOrQueryThenStore", options: parameters});
        }
      }else{
        console.log("User Not Logged In");
        UserLoggedInInstaGram  = false;
        let parameters={
          UserInstaGramid : UserInstaGramid,
          UserInstaGramUsername : UserInstaGramUsername,
          UserInstaGramName : UserInstaGramName,
          UserInstaGramImage  : UserInstaGramImage,
          UserLoggedInInstaGram  : UserLoggedInInstaGram
        }
        chrome.runtime.sendMessage({type: "storeUserInfoOrQueryThenStore", options: parameters});
      }
    }
  });

})
