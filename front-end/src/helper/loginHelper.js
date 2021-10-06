/* eslint-disable no-undef */
const loginHelper = {
  login: function () {
    try {
      // if(localStorage.getItem('instaprofile')){
      //     let newtab=parseInt(localStorage.getItem('instaprofile'));
      //     chrome.tabs.remove(newtab, function() {

      //         localStorage.removeItem('instaprofile');
      //     });
      // }
      // if(localStorage.getItem('instamunread')){
      //     let newtabx=parseInt(localStorage.getItem('instamunread'));
      //     chrome.tabs.remove(newtabx, function() {

      //         localStorage.removeItem('instamunread');
      //     });
      // }
      // localStorage.removeItem('instathread');
      const myNewUrl = `https://www.instagram.com/`;
      let CreateTab = chrome.tabs.create(
        {
          url: myNewUrl,
          pinned: true,
          active: false,
        },
        function (tab) {
          let instaprofile = tab.id;
          localStorage.setItem("instaprofile", instaprofile);
          localStorage.setItem("InstagramMessageList", instaprofile);
          setTimeout(() => {
            chrome.tabs.remove(instaprofile);
          }, 10000);
        }
      );
      // let windowHeight = parseInt(window.screen.height) + 20;
      // let WindowWidth = parseInt(window.screen.width) + 20;
      // chrome.windows.create(
      //   {
      //     url: myNewUrl,
      //     type: "panel",
      //     top: windowHeight,
      //     left: WindowWidth,
      //     height: 1,
      //     width: 1,
      //     focused: true,
      //   },
      //   function (tab) {
      //     let instaprofile = tab.tabs[0];
      //     localStorage.setItem("instaprofile", instaprofile);
      //   }
      // );
      // console.log("This is a ",CreateTab);
      return CreateTab;
    } catch (error) {
      return error;
    }
  },
  logout: function () {
    try {
      const myNewUrl = `https://www.instagram.com/`;
      let CreateWindow = chrome.runtime.sendMessage({
        type: "CloseAllForResponse",
        options: myNewUrl,
      });
      if (localStorage.getItem("instaprofile")) {
        let instaprofile = parseInt(localStorage.getItem("instaprofile"));
        chrome.tabs.remove(instaprofile);
        localStorage.removeItem("instaprofile");
      }
      if (localStorage.getItem("InstagramMessageList")) {
        let InstagramMessageList = parseInt(
          localStorage.getItem("InstagramMessageList")
        );
        chrome.tabs.remove(InstagramMessageList);
        localStorage.removeItem("InstagramMessageList");
      }
      if (localStorage.getItem("InstagramMessageIndividual")) {
        let InstagramMessageIndividual = parseInt(
          localStorage.getItem("InstagramMessageIndividual")
        );
        chrome.tabs.remove(InstagramMessageIndividual);
        localStorage.removeItem("InstagramMessageIndividual");
      }
      localStorage.removeItem("instathread");
      localStorage.removeItem("insta_id");
      localStorage.removeItem("token");
      localStorage.removeItem("keywordsTally");
      localStorage.removeItem("inBackgroundFetching");
      localStorage.removeItem("insta_image");
      localStorage.removeItem("insta_logged_id");
      localStorage.removeItem("insta_name");
      localStorage.removeItem("insta_username");
      localStorage.removeItem("autoresponder");
      localStorage.removeItem("kyubi_user_token");
      localStorage.removeItem("user_id");
      localStorage.removeItem("default_message_text");
      localStorage.removeItem("insta_username");
      localStorage.removeItem("default_time_delay");
      localStorage.removeItem("default_message");
      localStorage.removeItem("individualThreadList");
      localStorage.removeItem("fbthread");
      localStorage.removeItem("fbmunread");
      localStorage.removeItem("fbprofile");
      localStorage.removeItem("profileFetch");
      localStorage.removeItem("messageListFetch");
      localStorage.removeItem("individualMessageFetch");
      localStorage.removeItem("instaprofile");
      let NewListIdArray = [];
      localStorage.setItem("CheckMessageNReply", 0);
      localStorage.setItem("ListIdArray", NewListIdArray);
      localStorage.removeItem("instamunread");

      return CreateWindow;
    } catch (error) {
      return error;
    }
  },
  refreshMessaging: function () {
    try {
      chrome.tabs.create(
        {
          url: myNewUrl,
          active: true,
          pinned: true,
        },
        function (tab) {
          let InstagramMessageList = tab.id;
          localStorage.setItem("InstagramMessageList", InstagramMessageList);
        }
      );

      chrome.tabs.create(
        {
          url: myNewUrl,
          active: true,
          pinned: true,
        },
        function (tab) {
          let InstagramMessageIndividual = tab.id;
          localStorage.setItem(
            "InstagramMessageIndividual",
            InstagramMessageIndividual
          );
        }
      );
    } catch (error) {
      return error;
    }
  },
};

export default loginHelper;
