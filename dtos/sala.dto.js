export class SalaDto {
    constructor({ codigo, numero_sillas }) {
        this.codigo = codigo;
        this.numero_sillas = parseInt(numero_sillas, 10);
    }
}