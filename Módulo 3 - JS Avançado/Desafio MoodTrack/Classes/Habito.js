class Habito {
  constructor(nome, concluido) {
    this.nome = nome;
    this.concluido = !!concluido;
  }
}

window.Habito = Habito;
