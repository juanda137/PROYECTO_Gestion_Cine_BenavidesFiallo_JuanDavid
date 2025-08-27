export class UserResponseDto {
    constructor(user) {
        this.id = user._id;
        this.identificacion = user.identificacion;
        this.nombre = user.nombre;
        this.email = user.email;
        this.cargo = user.cargo;
    }
}