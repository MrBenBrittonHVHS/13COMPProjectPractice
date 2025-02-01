fb_initialise();
var user;
fb_authenticate(readUserDetails);
function signup_register(){
    console.log(displayName.value);
    console.log(age.value);
    console.log(gender.value);
}

function readUserDetails(){
    firebase.database().ref('/userdetails/'+user.uid+'/').once('value', _readDetails);
    function _readDetails(snapshot){
        if(snapshot.val() == null){
            //User Doesn't exist send to sign up page
            window.location.href = "signUp.html"
        }  else {
            alert ("welcome")
        }
    }
}