export class PeliculaDto {
    constructor({ codigo, titulo, sinopsis, reparto, director, duracion, genero, clasificacion, idioma, fecha_estreno, poster, trailer }) {
        this.codigo = codigo;
        this.titulo = titulo;
        this.sinopsis = sinopsis;
        this.reparto = reparto;
        this.director = director;
        this.duracion = parseInt(duracion, 10);
        this.genero = genero;
        this.clasificacion = clasificacion;
        this.idioma = idioma;
        this.fecha_estreno = fecha_estreno;
        this.poster = poster;
        this.trailer = trailer;
    }
}