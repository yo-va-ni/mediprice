const search_url = window.location.search;
const urlParams = new URLSearchParams(search_url);
let id_product = urlParams.get("id");
console.log(id_product);

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

auth.onAuthStateChanged((user) => {
    if (user) {
      console.log("auth: signin");
    } else {
      window.location = "index.html";
    }
  }
);

logout.addEventListener("click", (ev) => {
    ev.preventDefault();
    auth.signOut().then(() => {
      console.log("Good bye Mr");
      window.location = "index.html"
    });
  });


/* TODO: Llenar los datos de la tabla con lo datos de la BD

  ...

*/

/* TODO: Poner en el mapa las ubicaciones de los demás locales

  ...

*/

/* TODO: Almacenar la valoracion

  ...

 */