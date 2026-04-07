class RegistroDiario {
  constructor(data, humor, habitos) {
    this.data = data;
    this.humor = humor;
    this.habitos = habitos || [];
  }
}

window.RegistroDiario = RegistroDiario;
