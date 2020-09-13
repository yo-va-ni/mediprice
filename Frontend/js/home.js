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
let circle_radius;
let mymap;
let productos_mapa = {elegido: "", lista: []};
let marker_mapa = [];
let currentPosition;
let carrito = [],
    total = 0;


const logout = document.getElementById("logout");
const columns_filter = document.getElementById("data-filter-items");


let agregarCarrito = document.getElementById("agregar_carrito");
agregarCarrito.addEventListener("click", (ev) => {
    ev.preventDefault();
    window.location = 'receta.html';
});


// Modal mapa
let myModalMap = document.getElementById("my-modal-map");
let spanCloseMap = document.getElementsByClassName("close-map")[0];
let abrirValoracion = document.getElementById("abrirValoracion");
let realizarValoracion = document.getElementById("valoracion");

spanCloseMap.onclick = function() {
    myModalMap.style.display = "none";
    productos_mapa = {elegido: "", lista: []};
}

window.onclick = function(ev) {
  if (ev.target == myModalMap) {
    myModalMap.style.display = "none";
    productos_mapa = {elegido: "", lista: []};
  }
}

abrirValoracion.addEventListener("click", ed => {
    let prod_a_valorar = productos_mapa.elegido;
    let med = document.getElementById("map-title");
    let valoracion_item = document.getElementsByClassName("val_producto");
    let negocio_valoracion = document.getElementById("negocio_mapa_valoracion");
    negocio_valoracion.innerHTML = ` ${prod_a_valorar.sucursal.negocioFarmacia}`;
    valoracion_item[0].innerHTML = `${med.innerHTML}`;
    valoracion_item[1].innerHTML = `S/ ${prod_a_valorar.precio}`;
    //valoracion_item[2].innerHTML = `${prod_a_valorar.sucursal.direccionSucursal}`;
    //valoracion_item[3].innerHTML = `${prod_a_valorar.sucursal.calcularDistancia(currentPosition)} Km`;
});

realizarValoracion.addEventListener("click", ev => {
    let valorizacion = document.getElementById("range-valoracion");
    alert(`Gracias por valorar a ${productos_mapa.elegido.sucursal.negocioFarmacia}`);
});


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
                let med_item = new Medicamento(med.data()) 
                // Busqueda de productos por medicamento

                responsePresen = await database.collection("presentacion_medicamento")
                .where("idPresentMed", "==", med_item.idPresentMed)
                .get()
                if (!responsePresen.empty) {
                    responsePresen.forEach( present => {
                        med_item.presentacion = present.data().nombrePresentMed;
                    });
                }
                


                responseProd = await database.collection("producto")
                .where("idMedicamento", "==", med_item.idRegistroSanitario)
                .get()

                if (!responseProd.empty) {
                    responseProd.forEach( async (prod) => {
                        console.log(prod.id);
                        let prod_item = new Producto(prod.data());
                        prod_item.setId(prod.id);
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

                            responseNeg = await database.collection("negocio_farmaceutico")
                            .where("rucNegocio","==", prod_item.rucNegocio)
                            .get()

                            if(!responseNeg.empty){
                                responseNeg.forEach(neg => {
                                    prod_item.sucursal.negocioFarmacia = neg.data().nombreNegocio;
                                });
                            }
                        }
                        

                    });
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
    bar_name.innerHTML = `<button class="btn btn-block text-left" id="r-${medicamento.idRegistroSanitario}" type="button" data-toggle="collapse" data-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">${medicamento.nombreComercial} &nbsp; ${medicamento.concentracion}</button>`;
    let bar_mapa = document.createElement("div")
    bar_mapa.classList.add("link-mapa");
    bar_mapa.innerHTML = `<a id="abrir-mapa" href="#">VER MAPA</a>`;
    bar_mapa.addEventListener("click", ev => {
        ev.preventDefault();
        ev.stopPropagation();
        myModalMap.style.display = "block";

        let map_title = document.getElementById("map-title");
        map_title.innerText = medicamento.nombreComercial;
        medicamento.productos.forEach( prod => {
            productos_mapa.lista.push(prod);
            let sucursalPosition = [prod.sucursal.latitudUbicacion, prod.sucursal.longitudUbicacion];
            let marker = L.marker(sucursalPosition).addTo(mymap);
            marker_mapa.push(marker);
            marker.addEventListener("click", (ev) => {
                // Cambiar el detalle
                let mapa_negocio = document.getElementById("negocio_mapa");
                mapa_negocio.innerHTML = `${prod.sucursal.negocioFarmacia}`;
                productos_mapa.elegido = prod;
                let detalle = document.getElementsByClassName("detalle_producto");
                detalle[0].innerHTML = `S/ ${prod.precio}`;
                detalle[1].innerHTML = `S/ ${prod.precioAnterior}`;
                detalle[2].innerHTML = `${prod.ultimaActualizacion.split(" ")[0]}`
                detalle[3].innerHTML = `${prod.sucursal.direccionSucursal}`;
                let distancia_sucursal = prod.sucursal.calcularDistancia(currentPosition)*1000;
                detalle[4].innerHTML = ` ${distancia_sucursal<1000 ? distancia_sucursal: distancia_sucursal/1000} ${distancia_sucursal<1000 ? 'metros': 'Km'}`;
            });
        });
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
        <th scope="col" class="col_7">➕</th>
        <!--<th scope="col" class="col_7">Precio</th>-->
        </tr>
    </thead>`;
    return table;
}

const armarTBody = ({concentracion, fechaVencimiento, presentacion, productos}) => {
    let table_body = document.createElement("tbody");
    productos.forEach(data => {
        let tr_producto = document.createElement("tr");
        tr_producto.className = "producto_item";
        tr_producto.innerHTML = `<tr class="producto_item">
            <td  class="col_1">${concentracion}</td>
            <td  class="col_2">${presentacion}</td>
            <td  class="col_3">${fechaVencimiento}</td>
            <td  class="col_4">${data.rucNegocio}</td>
            <td  class="col_5">${data.precio}</td>
            <td  class="col_6">${data.sucursal.direccionSucursal}</td>
            <!--<td  class="col_7">Pendiente</td>-->
        </tr>`;
        table_body

        let td_addCarrito = document.createElement("td");
        let btn_addCarrito = document.createElement("button");
        btn_addCarrito.setAttribute("marcador", data.id );
        btn_addCarrito.innerHTML = `➕`;
        btn_addCarrito.addEventListener("click", (ev) => {
            carrito.push(ev.target.getAttribute('marcador'));
            calcularTotal();
            renderizarCarrito();
        });
        td_addCarrito.className = "col_7";
        td_addCarrito.appendChild(btn_addCarrito);
        tr_producto.appendChild(td_addCarrito);
        table_body.appendChild(tr_producto);
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



// Mapa

const changeDistance = (radius) => {
    circle_radius.setRadius(radius);
    let rad = document.getElementById("rad_distance_bus");
    rad.innerText = ` ${radius<1000 ? radius: radius/1000} ${radius<1000 ? 'metros': 'Km'}`
};
const showPosition = (position) => {
    currentPosition = [position.coords.latitude, position.coords.longitude];
    
    mymap = L.map('busqueda-mapa').setView(currentPosition, 15);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    }).addTo(mymap);
    L.marker(currentPosition).addTo(mymap);
    circle_radius = L.circle(currentPosition, {
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


// Carrito 

let d_carrito = document.getElementById("carrito"),
    d_total = document.getElementById("total-cotizacion"),
    d_botonVaciar = document.getElementById("boton-vaciar");

const calcularTotal =  () => {
    // Limpiamos precio anterior
    total = 0;
    // Recorremos el array del carrito
    for (let item of carrito) {
        // De cada elemento obtenemos su precio
        let miItem = [];
        medicamentos.forEach((med_item) => {
            let miItem_med = med_item.productos.filter(function(prod_item) {
                return prod_item.id == item;
            });
            miItem = miItem.concat(miItem_med);
        });
        total = total + parseFloat(miItem[0].precio);
    }
    // Renderizamos el precio en el HTML
    d_total.textContent = total.toFixed(2);
};

const borrarItemCarrito = (ev) => {
    // Obtenemos el producto ID que hay en el boton pulsado
    let id = ev.target.getAttribute('item');
    // Borramos todos los productos
    carrito = carrito.filter(function (carritoId) {
        return carritoId !== id;
    });
    // volvemos a renderizar
    renderizarCarrito();
    // Calculamos de nuevo el precio
    calcularTotal();
};


const renderizarCarrito = () => {
    d_carrito.innerHTML = "";

    let carrito_sin_duplicado = [...new Set(carrito)];

    carrito_sin_duplicado.forEach((item, indice) => {
        let miItem = [];
        medicamentos.forEach((med_item) => {
            let miItem_med = med_item.productos.filter(function(prod_item) {
                return prod_item.id == item;
            });
            miItem = miItem.concat(miItem_med);
        });

        let numeroUnidadesItem = carrito.reduce(function (total, itemId) {
            return itemId === item ? total += 1 : total;
        }, 0);

        let miFila = document.createElement("li");
        miFila.classList.add('list-group-item', 'text-right', 'mx-2');
        miFila.textContent = `${numeroUnidadesItem} x ${miItem[0].id} - ${miItem[0].precio}€`;

        let miBoton = document.createElement("button");
        miBoton.classList.add('btn', 'btn-danger', 'mx-5');
        miBoton.textContent = "X";
        miBoton.style.marginLeft = '1rem';
        miBoton.setAttribute('item', item);
        miBoton.addEventListener('click', borrarItemCarrito);

        miFila.appendChild(miBoton);
        d_carrito.appendChild(miFila);
    });
};


const vaciarCarrito = () => {
    // Limpiamos los productos guardados
    carrito = [];
    // Renderizamos los cambios
    renderizarCarrito();
    calcularTotal();
}
d_botonVaciar.addEventListener("click", vaciarCarrito)