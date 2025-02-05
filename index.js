var user;
fb_authenticate(readUserDetails);
var displayName;
var photoURL;
var UID;

function readUserDetails(){
    firebase.database().ref('/userdetails/'+user.uid+'/').once('value', _readDetails);

    function _readDetails(snapshot){
        if(snapshot.val() == null){
            //User Doesn't exist send to sign up page
            window.location.href = "signUp.html"
        }  else {
            displayName = snapshot.val().displayName;
            photoURL = snapshot.val().photoURL;
            UID = snapshot.val().UID;
            sessionStorage.setItem("displayName", displayName);
            sessionStorage.setItem("photoURL", photoURL);
            sessionStorage.setItem("UID", UID);
            displayPage()
        }
    }
}

function displayPage(){
    console.log("showing page")
    WelcomeMessage.innerHTML = `
    <p>
    <img src="${photoURL}" alt="profile Pic">Hi ${displayName}, welcome back.
    </p>
    Have a look at the games:
    <a href=GeoDash.html>GeoDash</a><br>
    <a href=GTN.html>Guess the Number</a>
    `
}

function index_makeMeAdmin(){
    firebase.database().ref('/admin/').set({[user.uid]:true}, _redirect);
    function _redirect(error){
        if (error){
            fb_error(error);
        }else{
            window.location.href="index.html";
        }
    }
}
function index_removeAdmin(){
    firebase.database().ref('/admin/').remove(user.uid, _redirect);
    function _redirect(error){
        if (error){
            fb_error(error);
        }else{
            window.location.href="index.html";
        }
    }
}