export class BoletaDto {
    constructor({ funcion_id, cantidad_asientos }) {
        this.funcion_id = funcion_id;
        this.cantidad_asientos = parseInt(cantidad_asientos, 10);
    }
}