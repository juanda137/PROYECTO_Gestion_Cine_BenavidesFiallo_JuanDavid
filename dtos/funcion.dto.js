export class FuncionDto {
    constructor({ cine_id, sala_id, pelicula_id, fecha_hora }) {
        this.cine_id = cine_id;
        this.sala_id = sala_id;
        this.pelicula_id = pelicula_id;
        this.fecha_hora = fecha_hora;
    }
}