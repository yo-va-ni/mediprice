class Medicamento{

    constructor({idRegistroSanitario, nombreComercial, concentracion, rucLaboratorio, fechaVencimiento, idPresentMed}){
        this.idRegistroSanitario = idRegistroSanitario;
        this.nombreComercial = nombreComercial;
        this.concentracion = concentracion;
        this.rucLaboratorio = rucLaboratorio;
        this.fechaVencimiento = fechaVencimiento;
        this.idPresentMed =idPresentMed
        this.productos = [];
    };


    agregarProducto( producto ){
        this.productos.push(producto);
    }
    
};
