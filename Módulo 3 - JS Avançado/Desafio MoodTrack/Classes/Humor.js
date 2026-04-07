class Humor {
  constructor(nivelDoHumor, observacao) {
    this.nivelDoHumor = Number(nivelDoHumor);
    this.observacao = observacao || '';
  }
}

window.Humor = Humor;
