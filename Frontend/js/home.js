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

let items = [];

const logout = document.getElementById("logout");
const link_mapa_detalle = document.getElementsByClassName("link-mapa");
const columns_filter = document.getElementById("data-filter-items");
items.push(document.getElementById("r-111111"));

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


items.forEach(element => {
    element.addEventListener("click", (ev) =>{
        let id_item = ev.target.id.slice(2);
        let collapse = document.getElementById(id_item);
        if(collapse.classList.contains("show")){
            collapse.classList.remove("show");
        }else{
            collapse.classList.add("show");
        }
    });
});


columns_filter.addEventListener("change", (ev) => {
    let column_id = ev.target.id;
    let item_col_filter = document.getElementById(column_id);
    let columns = document.getElementsByClassName(column_id);
    console.log(item_col_filter.checked);

    if (item_col_filter.checked) {
        for (let i = 0; i < columns.length; i++) {
            console.log("adding column");
            columns[i].style.display = "table-cell";
        }
    } else {
        for (let i = 0; i < columns.length; i++) {
            console.log("adding column");
            columns[i].style.display = "none";
        }
    }
    
});



for (let i = 0; i < link_mapa_detalle.length; i++) {
    const element = link_mapa_detalle[i];
    element.addEventListener("click", ev => {
        ev.preventDefault();
        let son = ev.target;
        let id_item =son.parentElement.previousElementSibling.lastElementChild.id.slice(2)
        console.log(son.parentElement.previousElementSibling.lastElementChild.id.slice(2));
        window.location = `mapa_detalle.html?id=${id_item}`
    });
}


