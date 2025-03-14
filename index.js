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
            firebase.database().ref('/adnim/'+user.uid+'/').once('value', _readAdmin);  
            displayPage()
        }
    }
    firebase.database().ref('/adnim/'+user.uid+'/').once('value', _readAdmin);  
    function _readAdmin(snapshot){
        console.log("Read Admin")
        console.log(snapshot.val())
        if(snapshot.val() != null){
            if (snapshot.val()){
                console.log("display Admin")

                admin.innerHTML = `    <a href="admin.html">admin - only admins can see this link</a><br>`
            }
        }
    }
}

function displayPage(){
    console.log("showing page")
    WelcomeMessage.innerHTML = `
    <p>
    <img src="${photoURL}" alt="profile Pic">Hi ${displayName}, welcome back.
    </p>
    Have a look at the games:<ul>
    <li><a href=GeoDash/GeoDash.html>GeoDash</a></li>
    <li><a href=GTN.html>Guess the Number</a></li>
    <ul>
    `
}

function index_makeMeAdmin(){
    firebase.database().ref('/adnim/').set({[user.uid]:true}, _redirect);  
    function _redirect(error){
        if (error){
            fb_error(error);  
        }else{
            window.location.href="index.html";  
        }
    }
}
function index_removeAdmin(){
    firebase.database().ref('/adnim/'+user.uid).remove(_redirect);  
    function _redirect(error){
        if (error){
            fb_error(error);  
        }else{
            window.location.href="index.html";  
        }
    }
}
function index_unregister(){
    firebase.database().ref('/userdetails/'+user.uid).remove(_redirect);  
    function _redirect(error){
        if (error){
            fb_error(error);  
        }else{
            window.location.href="index.html";  
        }
    }
}