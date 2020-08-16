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


const logout = document.getElementById("logout");
const cotizacion = document.getElementById("cotizacion");

auth.onAuthStateChanged((user) => {
    if (user) {
      logout.style.display = "block";
      cotizacion.style.display = "block";
      console.log("auth: signin");
    } else {
      logout.style.display = "none";
      cotizacion.style.display = "none";
      console.log("auth: signout");
    }
  }
);

logout.addEventListener("click", (ev) => {
  ev.preventDefault();
  auth.signOut().then(() => {
    console.log("Good bye Mr");
  });
});