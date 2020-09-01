
class Producto{
    
    constructor({idMedicamento, idSucursal, precio, precioAnterior, ultimaAct, rucNegocio}){
        this.idMedicamento = idMedicamento;
        this.idSucursal = idSucursal;
        this.precio = precio;
        this.precioAnterior = precioAnterior;
        this.ultimaAct = ultimaAct;
        this.rucNegocio = rucNegocio;
        this.sucursal = "";
    };

    construirSucursal(sucursal){
        this.sucursal = new Sucursal(sucursal);
    };
};

