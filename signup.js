fb_initialise();
var user;
fb_authenticate(()=>{});
function signup_register(){
    var userDetails = {
        displayName:displayName.value,
        age:age.value,
        gender:gender.value,
        name:user.displayName,
        photoURL:user.photoURL
    }
    firebase.database().ref('/userdetails/'+user.uid+'/').set(userDetails, fb_error());
}