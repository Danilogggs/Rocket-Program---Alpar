const usuarios = [
  new Aluno("neymar Jr", "ney@jogado.com", "teste", "craqui da bola"),
  new Aluno("Ana Lima", "ana@escola.com", "5678", "2º Ano B"),
  new Professor("Maria Souza", "maria@escola.com", "abcd", ["Matemática", "Física"]),
  new Professor("Carlos Pereira", "carlos@escola.com", "efgh", ["História"])
];

// login
const loginForm = document.getElementById("loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;
    const erro = document.getElementById("erro");

    const usuarioEncontrado = usuarios.find(
      (usuario) => usuario.email === email && usuario.senha === senha
    );

    if (usuarioEncontrado) {
      localStorage.setItem("usuarioLogado", JSON.stringify(usuarioEncontrado));
      window.location.href = "perfil.html";
    } else {
      erro.textContent = "Email ou senha inválidos.";
    }
  });
}

// perfil
const perfilContainer = document.getElementById("perfilContainer");

if (perfilContainer) {
  const usuarioSalvo = JSON.parse(localStorage.getItem("usuarioLogado"));

  if (usuarioSalvo) {
    let usuario;

    if (usuarioSalvo.turma) {
      usuario = new Aluno(
        usuarioSalvo.nome,
        usuarioSalvo.email,
        usuarioSalvo.senha,
        usuarioSalvo.turma
      );
    } else if (usuarioSalvo.materias) {
      usuario = new Professor(
        usuarioSalvo.nome,
        usuarioSalvo.email,
        usuarioSalvo.senha,
        usuarioSalvo.materias
      );
    }

    perfilContainer.innerHTML += `
      <div class="card shadow-sm">
        <div class="card-body">
          <h3 class="card-title mb-3">Perfil do Usuário</h3>
          ${usuario.exibirPerfil()}
        </div>
      </div>
    `;
  } else {
    perfilContainer.innerHTML = `
      <div class="alert alert-danger">
        Nenhum usuário encontrado no localStorage.
      </div>
    `;
  }
}

// logout
const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {
  logoutBtn.addEventListener("click", function () {
    localStorage.removeItem("usuarioLogado");
    window.location.href = "index.html";
  });
}