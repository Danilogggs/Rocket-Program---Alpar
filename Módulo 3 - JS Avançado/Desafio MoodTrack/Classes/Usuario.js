class Usuario {
  constructor(nome, email, senha, foto, habitosPadrao = [], registrosDiarios = []) {
    this.nome = nome;
    this.email = email;
    this.senha = senha;
    this.foto = foto;
    this.habitosPadrao = habitosPadrao;
    this.registrosDiarios = registrosDiarios;
  }
}

window.Usuario = Usuario;
