var user;
fb_authenticate(()=>{});
function signup_register(){


    console.log (displayName.value);
    console.log (age.value);
    console.log (gender.value);
    console.log (user.uid);
    console.log (user.photoURL);



    var userDetails = {
        displayName:displayName.value,
        age:age.value,
        gender:gender.value,
        name:user.displayName,
        photoURL:user.photoURL
    }
    firebase.database().ref('/userdetails/'+user.uid+'/').set(userDetails, _redirect);
    function _redirect(error){
        if (error){
            fb_error(error);
        }else{
            window.location.href="index.html";
        }
    }
}