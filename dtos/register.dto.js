export class RegisterDto {
    constructor({ identificacion, nombre, telefono, email, cargo, password }) {
        this.identificacion = identificacion;
        this.nombre = nombre;
        this.telefono = telefono;
        this.email = email;
        this.cargo = cargo;
        this.password = password;
    }
}