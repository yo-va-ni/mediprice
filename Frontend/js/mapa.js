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

// TODO: Poner en el mapa las ubicaciones de los demás locales
let currentPosition = [];
let mymap;
let circle_distance;

// Eleccion del radio de distancia
function changeDistance(radius){
  circle_distance.setRadius(radius);
};

// Añadir markers de los establecimientos


// Inicializar el mapa
const showPosition = (position) => {
  currentPosition = [position.coords.latitude, position.coords.longitude];
  
  mymap = L.map('busqueda-mapa').setView(currentPosition, 15);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
  }).addTo(mymap);
  L.marker(currentPosition).addTo(mymap);
  circle_distance = L.circle(currentPosition, {
    color: 'green',
    fillColor: '#2feb7d',
    fillOpacity: 0.3,
    radius: document.getElementById("range-distance").value
  }).addTo(mymap);
};

const getLocation = async () => {
  if (navigator.geolocation) {
    await navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    console.log("No position");
  }
};

getLocation();




/* TODO: Almacenar la valoracion

  ...

 */