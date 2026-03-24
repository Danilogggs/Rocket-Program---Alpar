class CentralDeLuzes {
  static instancia;

  constructor() {
    if (CentralDeLuzes.instancia) {
      return CentralDeLuzes.instancia;
    }

    CentralDeLuzes.instancia = this;
  }

  static getInstance() {
    if (!CentralDeLuzes.instancia) {
      CentralDeLuzes.instancia = new CentralDeLuzes();
    }

    return CentralDeLuzes.instancia;
  }

  ligar(comodo) {
    const divComodo = document.getElementById(comodo);
    divComodo.classList.add("aceso");
    document.getElementById("mensagem").textContent = `Luz do ${comodo} ligada`;
  }

  desligar(comodo) {
    const divComodo = document.getElementById(comodo);
    divComodo.classList.remove("aceso");
    document.getElementById("mensagem").textContent = `Luz do ${comodo} desligada`;
  }
}

const central = CentralDeLuzes.getInstance();

document.querySelectorAll("button").forEach((botao) => {
  botao.addEventListener("click", () => {
    const comodo = botao.dataset.comodo;
    const acao = botao.dataset.acao;

    if (acao === "ligar") {
      central.ligar(comodo);
    } else {
      central.desligar(comodo);
    }
  });
});