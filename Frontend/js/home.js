let firebaseConfig = {
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


let medicamentos = [];
let list_prod;

const logout = document.getElementById("logout");
let link_mapa_detalle = [];
const columns_filter = document.getElementById("data-filter-items");


// Mapa

let myModalMap = document.getElementById("my-modal-map");

// Get the <span> element that closes the modal
let spanCloseMap = document.getElementsByClassName("close-map")[0];

// When the user clicks on <span> (x), close the modal
spanCloseMap.onclick = function() {
    myModalMap.style.display = "none";
}
// When the user clicks anywhere outside of the modal, close it
window.onclick = function(ev) {
  if (ev.target == myModalMap) {
    myModalMap.style.display = "none";
  }
}



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


// Importando objeto Producto
//import { Producto as Producto } from "../models/producto";


// Ejecución de busqueda
let form_busqueda = document.getElementById("busqueda-medicamento");
form_busqueda.addEventListener("submit", (ev) => {
    ev.preventDefault();
    let formData = new FormData(form_busqueda);
    let producto = formData.entries().next().value[1];
    database.collection("medicamento")
    .where("nombreComercial", "==", producto)
    .get()
    .then(result => {
        let card = document.createElement("div");
        let accordion = document.getElementById("accordionData");
        accordion.innerHTML = ""
        card.className = "card";
        if (result.empty) {
            accordion.innerHTML = "No hay resultados"
        } else {
            
            result.forEach( async (med) => {
                card.innerHTML = "";
                console.log(card);
                let med_item = new Medicamento(med.data()) //Object.assign({}, med.data());
                list_prod = [];
                // Busqueda de productos por medicamento
                responseProd = await database.collection("producto")
                .where("idMedicamento", "==", med_item.idRegistroSanitario)
                .get()

                if (!responseProd.empty) {
                    responseProd.forEach( async (prod) => {
                        let prod_item = new Producto(prod.data());
                        responseSuc = await database.collection("sucursales")
                        .where("rucNegocio", "==", prod_item.rucNegocio)
                        .where("idSucursal", "==", prod_item.idSucursal)
                        .get()

                        if (!responseSuc.empty) {
                            responseSuc.forEach( suc => {
                                prod_item.construirSucursal(suc.data());
                            });
                            med_item.agregarProducto(prod_item);
                            // Agregar a la tabla
                            let t_body = armarTBody({ ...med_item , ...prod_item});
                            document.getElementById(prod_item.idMedicamento).getElementsByTagName("table")[0].appendChild(t_body);
                        }
                    });
                    console.log(med_item);
                    card.appendChild(armarBarra(med_item));
                    medicamentos.push(med_item);
                    card.appendChild(pintarRsultados(med_item));
                }
                accordion.appendChild(card);
            });
        }
    });
});



// Armando la barra de presentacion
const armarBarra = (medicamento) => {

    let bar = document.createElement("div")
    bar.className = "card-header card-custom";
    let bar_name = document.createElement("h2")
    bar_name.classList.add("mb-0");
    bar_name.innerHTML = `<button class="btn btn-block text-left" id="r-${medicamento.idRegistroSanitario}" type="button" data-toggle="collapse" data-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">${medicamento.nombreComercial}</button>`;
    let bar_mapa = document.createElement("div")
    bar_mapa.classList.add("link-mapa");
    bar_mapa.innerHTML = `<a id="abrir-mapa" href="#">VER MAPA</a>`;
    bar_mapa.addEventListener("click", ev => {
        ev.preventDefault();
        ev.stopPropagation();
        myModalMap.style.display = "block";
        console.log("Abriendo mapa");
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
        <th scope="col" class="col_1">Concentracion</th>
        <th scope="col" class="col_2">Presentacion</th>
        <th scope="col" class="col_3">Fecha Vencimiento</th>
        <th scope="col" class="col_4">RUC </th>
        <th scope="col" class="col_5">Precio</th>
        <th scope="col" class="col_6">Direccion</th>
        <!--<th scope="col" class="col_7">Precio</th>-->
        </tr>
    </thead>`;
    return table;
}

const armarTBody = ({concentracion, fechaVencimiento, idPresentMed, productos}) => {
    let table_body = document.createElement("tbody");
    productos.forEach(data => {
        table_body.innerHTML += `<tr class="producto_item">
            <td  class="col_1">${concentracion}</td>
            <td  class="col_2">${idPresentMed}</td>
            <td  class="col_3">${fechaVencimiento}</td>
            <td  class="col_4">${data.rucNegocio}</td>
            <td  class="col_5">${data.precio}</td>
            <td  class="col_6">${data.sucursal.direccionSucursal}</td>
            <!--<td  class="col_7">Pendiente</td>-->
        </tr>`;
    });
    return table_body;
};
// Renderizacion de los resultados de la busqueda
const pintarRsultados = (med_item) => {
    let div_body = document.createElement("div");
    let div_content = document.createElement("div");
    div_body.className = "collapse";
    div_body.id = med_item.idRegistroSanitario;
    div_content.className = "data-details";
    let table = armarCabecera();
    //table.appendChild(armarTBody(med_item));
    
    div_content.appendChild(table);
    div_body.appendChild(div_content);
    return div_body;
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


// Filtros de búsqueda region - provincia - distrito
// Provincia
$("#buscar_dep").change( () => {
    let idRegion = $("#buscar_dep option:selected").val();
    let provincias = database.collection("provincia")
    .where("idRegion", "==", idRegion)
    .get()
    .then(result => {
        
        $("#buscar_prov").empty();
        $("#buscar_prov").append("<option selected>Seleccione uno</option>");
        result.forEach(provincia => {
            $("#buscar_prov").append(`<option value="${provincia.data().idProvincia}">${provincia.data().nombreProvincia}</option>`);
        });
    });
});
// Distrito
$("#buscar_prov").change( () => {
    let idRegion = $("#buscar_dep option:selected").val();
    let idProvincia = $("#buscar_prov option:selected").val();
    let distritos = database.collection("distrito")
    .where("idRegion", "==", idRegion)
    .where("idProvincia", "==", idProvincia)
    .get()
    .then(result => {
        $("#buscar_dis").empty();
        $("#buscar_dis").append("<option selected>Seleccione uno</option>");
        result.forEach(distrito => {
            $("#buscar_dis").append(`<option value="${distrito.data().idDistrito}">${distrito.data().nombreDistrito}</option>`);
        });
    });// Realizar busqueda provincia
});
// Aplicar filtro
$("#aplicarFiltro").click( () => {
    let idRegion = $("#buscar_dep option:selected").val();
    let idProvincia = $("#buscar_prov option:selected").val();
    let idDistrito = $("#buscar_dis option:selected").val();
    console.log(`${idRegion} ${idProvincia} ${idDistrito}`);
});





