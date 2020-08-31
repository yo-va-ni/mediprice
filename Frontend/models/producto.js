
class Producto{
    
    constructor(idMedicamento, idSucursal, precio, precioAnterior, ultimaAct){
        this.idMedicamento = idMedicamento;
        this.idSucursal = idSucursal;
        this.precio = precio;
        this.precioAnterior = precioAnterior;
        this.ultimaAct = ultimaAct;
    };

    construirMedicamento({ idRegistroSanitario, nombreComercial, concentracion, rucLaboratorio, fechaVencimiento }){
        this.medicamento = new Medicamento(idRegistroSanitario, nombreComercial, concentracion, rucLaboratorio, fechaVencimiento);
    };
    construirSucursal({ rucNegocio, idSucursal, direccionSucursal, latitudUbicacion, longitudUbicacion, idRegion, idProvincia, idDistrito }){
        this.sucursal = new Sucursal(rucNegocio, idSucursal, direccionSucursal, latitudUbicacion, longitudUbicacion, idRegion, idProvincia, idDistrito);
    };
};

