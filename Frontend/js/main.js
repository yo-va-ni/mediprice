
var firebaseConfig = {
  apiKey: "AIzaSyAp5DSQDZTHDJeDPSNCjJp8SUkkhDrtJek",
  authDomain: "proyecto-tis.firebaseapp.com",
  databaseURL: "https://proyecto-tis.firebaseio.com",
  projectId: "proyecto-tis",
  storageBucket: "proyecto-tis.appspot.com",
  messagingSenderId: "837530993946",
  appId: "1:837530993946:web:635e4c62e3783603f818a3",
  measurementId: "G-4S2YBVF649"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();
const auth = firebase.auth();
const fs = firebase.firestore();

const checkUser = () => {
  auth.onAuthStateChanged((user) => {
      if (user) {
        console.log("auth: signin");
        window.location = 'home.html';
          
      } else {
        console.log("Welcome");
      }
    }
  );
};

checkUser();




// Error message
const errorPopup = (error, tab=null) => {
  if(tab!=null){
    $(`#${tab}`).modal("hide");
  }
  $("#signError").modal("show");
  $("#signErrorText").text(error);
  setTimeout(()=>{
    $("#signError").modal("hide");
  }, 2000);
  signInForm.reset();

}




// SignUp
const signUpForm = document.querySelector("#signup-form");
signUpForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = signUpForm["signup-email"].value;
  const password = signUpForm["signup-password"].value;
  console.log(email,password)
  // Authenticate the User
  auth
    .createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // clear the form
      signUpForm.reset();
      // close the modal
      $("#signupModal").modal("hide");
    })
    .catch(error => errorPopup(error,"signupModal"));

});




// SingIn
const signInForm = document.querySelector("#login-form");

signInForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = signInForm["exampleInputEmail1"].value;
  const password = signInForm["exampleInputPassword1"].value;

  // Authenticate the User
  auth.signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // clear the form
      signInForm.reset();
      console.log("sigin");
      window.location = "home.html";
    })
    .catch(errorPopup);
});






// Login with Google
const googleButton = document.querySelector("#googleLogin");

googleButton.addEventListener("click", (e) => {
    e.preventDefault();
    signInForm.reset();
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider)
    .then((result) => {
      console.log(result);
      console.log("google sign in");
      window.location = "home.html";
      //window.location = "home.html";
    })
    .catch(errorPopup);
});



// Login with Facebook
const facebookButton = document.querySelector('#facebookLogin');

facebookButton.addEventListener('click', e => {
  e.preventDefault();
  signInForm.reset();

  const provider = new firebase.auth.FacebookAuthProvider();
  auth.signInWithPopup(provider).then((result) => {
    console.log(result);
    console.log("facebook sign in");
    window.open("home.html");
  })
  .catch(errorPopup);

})

// Login with Twitter
const twitterButton = document.querySelector("#twitterLogin");

twitterButton.addEventListener("click", e => {
  e.preventDefault();
  signInForm.reset();

  const provider = new firebase.auth.TwitterAuthProvider();
  auth.signInWithPopup(provider)
  .then((result) => {
    console.log(result);
    console.log("twitter sign in");
    window.open("home.html");
  })
  .catch(errorPopup);

})


