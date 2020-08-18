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
let database = firebase.firestore();

let items = [];
let medicamentos = [];

const logout = document.getElementById("logout");
let link_mapa_detalle = [];
const columns_filter = document.getElementById("data-filter-items");

// Verificacion de inicio de sesion

auth.onAuthStateChanged((user) => {
    if (user) {
      console.log("auth: signin");
    } else {
      window.location = "index.html";
    }
  }
);

// Finalizacion de sesion
logout.addEventListener("click", (ev) => {
    ev.preventDefault();
    auth.signOut().then(() => {
      console.log("Good bye Mr");
      window.location = "index.html"
    });
  });




// Ejecución de busqueda
let form_busqueda = document.getElementById("busqueda-medicamento");
form_busqueda.addEventListener("submit", (ev) => {
    ev.preventDefault();
    let formData = new FormData(form_busqueda);
    let producto = formData.entries().next().value[1];
    productos = database.collection("medicamentos")
    .where("nombreComercial", "==", producto)
    .get()
    .then(result => {
        
        let card = document.createElement("div");
        let accordion = document.getElementById("accordionData");
        accordion.innerHTML = ""
        card.className = "card";
        result.forEach(med => {
            medicamentos.push(med);
        });
        card.appendChild(armarBarra(medicamentos[0]));
        card.appendChild(pintarRsultados(medicamentos));

        accordion.appendChild(card);
    });
});

// Armando la barra de presentacion
const armarBarra = (producto) => {

    let bar = document.createElement("div")
    bar.className = "card-header card-custom";
    let bar_name = document.createElement("h2")
    bar_name.classList.add("mb-0");
    bar_name.innerHTML = `<button class="btn btn-block text-left" id="r-${producto.id}" type="button" data-toggle="collapse" data-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">${producto.data().nombreComercial}</button>`;
    let bar_mapa = document.createElement("div")
    bar_mapa.classList.add("link-mapa");
    bar_mapa.innerHTML = `<a href="#">VER MAPA</a>`;
    bar_mapa.addEventListener("click", ev => {
        ev.preventDefault();
        ev.stopPropagation();
        let son = ev.target;
        let id_item =son.parentElement.previousElementSibling.lastElementChild.id.slice(2)
        console.log("redirigiendo");
        window.location = `mapa_detalle.html?id=${id_item}`
    });

    bar.appendChild(bar_name);
    bar.appendChild(bar_mapa);

    bar.addEventListener("click", (ev) =>{
        ev.stopPropagation();
        let id_item = ev.target.id.slice(2);
        let collapse = document.getElementById(id_item);
        if(collapse.classList.contains("show")){
            collapse.classList.remove("show");
        }else{
            collapse.classList.add("show");
        }
    });

    return bar;
};

// Armando la cabecera de la tabla
const armarCabecera = () => {
    let table = document.createElement("table");
    table.className = "table table-custom";
    table.innerHTML = `<thead class="thead-dark">
        <tr>
        <th scope="col" class="col_1">Nombre</th>
        <th scope="col" class="col_2">Concntracion</th>
        <th scope="col" class="col_3">Presentacion</th>
        <th scope="col" class="col_4">Fabricante</th>
        <th scope="col" class="col_5">Reg. Sanitario</th>
        <th scope="col" class="col_6">Sucursal</th>
        <th scope="col" class="col_7">Precio</th>
        </tr>
    </thead>`;
    return table;
}

const armarTBody = (medicamentos) => {
    let table_body = document.createElement("tbody");
    medicamentos.forEach(med => {
        let data = med.data();
        table_body.innerHTML += `<tr>
            <td  class="col_1">${data.nombreComercial}</td>
            <td  class="col_2">${data.concentracion}</td>
            <td  class="col_3">Pendiente</td>
            <td  class="col_4">${data.rucLaboratorio}</td>
            <td  class="col_5">${med.id}</td>
            <td  class="col_6">Pendiente</td>
            <td  class="col_7">Pendiente</td>
        </tr>`;
    });
    return table_body;
};
// Renderizacion de los resultados de la busqueda
const pintarRsultados = (medicamentos) => {
    let div_body = document.createElement("div");
    let div_content = document.createElement("div");
    div_body.className = "collapse";
    div_body.id = medicamentos[0].id;
    div_content.className = "data-details";
    let table = armarCabecera();
    table.appendChild(armarTBody(medicamentos));
    
    div_content.appendChild(table);
    div_body.appendChild(div_content);
    return div_body
};


// Agregar o quitar listas
columns_filter.addEventListener("change", (ev) => {
    let column_id = ev.target.id;
    let item_col_filter = document.getElementById(column_id);
    let columns = document.getElementsByClassName(column_id);

    if (item_col_filter.checked) {
        for (let i = 0; i < columns.length; i++) {
            columns[i].style.display = "table-cell";
        }
    } else {
        for (let i = 0; i < columns.length; i++) {
            columns[i].style.display = "none";
        }
    }
    
});

