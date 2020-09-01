class Sucursal{
    constructor({rucNegocio, idSucursal, direccionSucursal, latitudUbicacion, longitudUbicacion, idRegion, idProvincia, idDistrito}){
        this.rucNegocio = rucNegocio || "";
        this.idSucursal = idSucursal || "";
        this.direccionSucursal = direccionSucursal || "";
        this.latitudUbicacion = latitudUbicacion || "";
        this.longitudUbicacion = longitudUbicacion || "";
        this.idRegion = idRegion || "";
        this.idProvincia = idProvincia || "";
        this.idDistrito = idDistrito || "";
    };

    calcularDistancia(coorPersona) 
    {
      var R = 6371; // km
      var dLat = this.toRad(this.latitudUbicacion-coorPersona[0]);
      var dLon = this.toRad(this.longitudUbicacion-coorPersona[1]);
      var lat1 = this.toRad(coorPersona[0]);
      var lat2 = this.toRad(this.latitudUbicacion);

      var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
      var d = R * c;
      return d.toFixed(2);
    }

    // Converts numeric degrees to radians
    toRad(value) 
    {
        return value * Math.PI / 180;
    }
};

