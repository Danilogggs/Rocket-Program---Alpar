class Usuario {
  constructor(nome, email, senha) {
    this.nome = nome;
    this.email = email;
    this.senha = senha;
  }

  exibirPerfil() {
    return `
      <p><strong>Nome:</strong> ${this.nome}</p>
      <p><strong>Email:</strong> ${this.email}</p>
    `;
  }
}

class Aluno extends Usuario {
  constructor(nome, email, senha, turma) {
    super(nome, email, senha);
    this.turma = turma;
  }

  exibirPerfil() {
    return `
      <p><strong>Nome:</strong> ${this.nome}</p>
      <p><strong>Email:</strong> ${this.email}</p>
      <p><strong>Turma:</strong> ${this.turma}</p>
    `;
  }
}

class Professor extends Usuario {
  constructor(nome, email, senha, materias) {
    super(nome, email, senha);
    this.materias = materias;
  }

  exibirPerfil() {
    return `
      <p><strong>Nome:</strong> ${this.nome}</p>
      <p><strong>Email:</strong> ${this.email}</p>
      <p><strong>Matérias:</strong> ${this.materias.join(", ")}</p>
    `;
  }
}

// testes
// const aluno1 = new Aluno("neymar Jr", "ney@jogado.com", "teste", "craqui da bola");
// const professor1 = new Professor("Maria Souza", "maria@escola.com", "abcd", ["Matemática", "Física"]);

// console.log("Aluno:");
// console.log(aluno1.exibirPerfil());

// console.log("Professor:");
// console.log(professor1.exibirPerfil());