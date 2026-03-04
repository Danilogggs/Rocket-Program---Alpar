const animal = {};
animal.nome = "Max";

animal.andar = function () {
    console.log(`${this.nome} está andando`);
}

animal.andar();

const carro = {
    modelo: "Argo",
    marca: "Fiat",
    portas: 4,
    economico: true,
    andar() {
        console.log(`${this.marca} ${this.modelo} esta andando`);
    },
    freiar() {
        console.log(`${this.marca} ${this.modelo} esta freiando`);
    },
};
carro.andar();
carro.freiar();


function Pessoa(nome, email, idade, senha) {
    this.nome = nome;
    this.email = email;
    this.idade = idade;
    this.senha = senha;
    this.maiorIdade = true;

    // if (this.idade < 18){
    //     throw new Error("Menor de idade")
    // }
    if (this.idade < 18){
        this.maiorIdade = false;
    }

    this.login = function (email, senha) {
        if(this.email == email && this.senha == senha){
            console.log("Voce está logado");
        } else{
            console.log("Senha errada");
        }
    }
}
const pessoa1 = new Pessoa("Felipe", "felipe.lima@alpar.com.br", 17, "abc123");

console.log(pessoa1);

pessoa1.login('felipe.lima@alpar.com.br', 'abc123');