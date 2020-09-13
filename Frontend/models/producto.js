
class Producto{
    
    constructor({idMedicamento, idSucursal, precio, precioAnterior, ultimaActualizacion, rucNegocio}){
        this.idMedicamento = idMedicamento;
        this.idSucursal = idSucursal;
        this.precio = precio;
        this.precioAnterior = precioAnterior;
        this.ultimaActualizacion = ultimaActualizacion;
        this.rucNegocio = rucNegocio;
        this.sucursal = "";
    };

    construirSucursal(sucursal){
        this.sucursal = new Sucursal(sucursal);
    };

    setId(id){
        this.id = id;
    }
};

