angular.module("appEscolar", [])

    .controller("AppController", function ($scope) {
        $scope.mensagem = "Bem-vindo ao sistema de cadastro escolar";

        $scope.aba = "login";
        $scope.abaProfessor = "materias";
        $scope.logado = false;
        $scope.retorno = "";

        $scope.login = {
            nome: "",
            tipo: ""
        };

        $scope.cadastro = {
            nome: "",
            tipo: "",
            materias: [],
            materiasNomes: [],
            professorNome: "",
            materiaAluno: ""
        };

        $scope.usuario = {};

        $scope.catalogoMaterias = [
            { valor: "sn", nome: "ServiceNow" },
            { valor: "ang", nome: "Angular" },
            { valor: "rec", nome: "React" }
        ];

        $scope.materiasDisponiveisCadastro = angular.copy($scope.catalogoMaterias);
        $scope.materiasSelecionadasCadastro = [];

        $scope.usuarios = [
            {
                nome: "Marina",
                tipo: "Professor",
                dataCadastro: new Date(),
                materias: ["ang", "rec"],
                materiasNomes: ["Angular", "React"]
            },
            {
                nome: "Carlos",
                tipo: "Professor",
                dataCadastro: new Date(),
                materias: ["sn"],
                materiasNomes: ["ServiceNow"]
            },
            {
                nome: "Bianca",
                tipo: "Aluno",
                dataCadastro: new Date(),
                professorNome: "Marina",
                materia: "Angular"
            },
            {
                nome: "Lucas",
                tipo: "Aluno",
                dataCadastro: new Date(),
                professorNome: "Carlos",
                materia: "ServiceNow"
            },
            {
                nome: "Fernanda",
                tipo: "Aluno",
                dataCadastro: new Date(),
                professorNome: "Marina",
                materia: "React"
            }
        ];

        $scope.limparFormularioLogin = function () {
            $scope.login = {
                nome: "",
                tipo: ""
            };
        };

        $scope.limparFormularioCadastro = function () {
            $scope.cadastro = {
                nome: "",
                tipo: "",
                materias: [],
                materiasNomes: [],
                professorNome: "",
                materiaAluno: ""
            };

            $scope.materiasDisponiveisCadastro = angular.copy($scope.catalogoMaterias);
            $scope.materiasSelecionadasCadastro = [];
        };

        $scope.trocarAba = function (novaAba) {
            $scope.aba = novaAba;
            $scope.retorno = "";
            $scope.limparFormularioLogin();
            $scope.limparFormularioCadastro();
        };

        $scope.aoAlterarTipoCadastro = function () {
            $scope.cadastro.materias = [];
            $scope.cadastro.materiasNomes = [];
            $scope.cadastro.professorNome = "";
            $scope.cadastro.materiaAluno = "";

            $scope.materiasDisponiveisCadastro = angular.copy($scope.catalogoMaterias);
            $scope.materiasSelecionadasCadastro = [];
        };

        $scope.selecionarMateriaCadastro = function (materia) {
            var indice = $scope.materiasDisponiveisCadastro.indexOf(materia);

            if (indice !== -1) {
                $scope.materiasSelecionadasCadastro.push(materia);
                $scope.materiasDisponiveisCadastro.splice(indice, 1);
            }

            $scope.cadastro.materias = $scope.materiasSelecionadasCadastro.map(function (item) {
                return item.valor;
            });

            $scope.cadastro.materiasNomes = $scope.materiasSelecionadasCadastro.map(function (item) {
                return item.nome;
            });
        };

        $scope.removerMateriaCadastro = function (materia) {
            var indice = $scope.materiasSelecionadasCadastro.indexOf(materia);

            if (indice !== -1) {
                $scope.materiasDisponiveisCadastro.push(materia);
                $scope.materiasSelecionadasCadastro.splice(indice, 1);
            }

            $scope.cadastro.materias = $scope.materiasSelecionadasCadastro.map(function (item) {
                return item.valor;
            });

            $scope.cadastro.materiasNomes = $scope.materiasSelecionadasCadastro.map(function (item) {
                return item.nome;
            });
        };

        $scope.obterProfessores = function () {
            return $scope.usuarios.filter(function (usuario) {
                return usuario.tipo === "Professor";
            });
        };

        $scope.obterProfessoresDisponiveisCadastro = function () {
            var professores = $scope.obterProfessores();

            if ($scope.cadastro.materiaAluno) {
                professores = professores.filter(function (professor) {
                    return (professor.materiasNomes || []).indexOf($scope.cadastro.materiaAluno) !== -1;
                });
            }

            return professores;
        };

        $scope.obterMateriasDisponiveisAluno = function () {
            if ($scope.cadastro.professorNome) {
                var professorEscolhido = $scope.usuarios.find(function (usuario) {
                    return usuario.tipo === "Professor" && usuario.nome === $scope.cadastro.professorNome;
                });

                return professorEscolhido ? angular.copy(professorEscolhido.materiasNomes || []) : [];
            }

            var materiasUnicas = [];

            $scope.obterProfessores().forEach(function (professor) {
                (professor.materiasNomes || []).forEach(function (materia) {
                    if (materiasUnicas.indexOf(materia) === -1) {
                        materiasUnicas.push(materia);
                    }
                });
            });

            if ($scope.cadastro.materiaAluno) {
                return materiasUnicas.filter(function (materia) {
                    return materia === $scope.cadastro.materiaAluno;
                });
            }

            return materiasUnicas;
        };

        $scope.atualizarMateriaAlunoPorProfessor = function () {
            var materiasDisponiveis = $scope.obterMateriasDisponiveisAluno();

            if (materiasDisponiveis.indexOf($scope.cadastro.materiaAluno) === -1) {
                $scope.cadastro.materiaAluno = "";
            }
        };

        $scope.atualizarProfessorPorMateria = function () {
            var professoresDisponiveis = $scope.obterProfessoresDisponiveisCadastro().map(function (professor) {
                return professor.nome;
            });

            if (professoresDisponiveis.indexOf($scope.cadastro.professorNome) === -1) {
                $scope.cadastro.professorNome = "";
            }
        };

        $scope.cadastrarUsuario = function () {
            if ($scope.cadastro.tipo === "Professor" && $scope.cadastro.materias.length === 0) {
                $scope.retorno = "Selecione pelo menos uma matéria para o professor.";
                return;
            }

            if ($scope.cadastro.tipo === "Aluno" && (!$scope.cadastro.professorNome || !$scope.cadastro.materiaAluno)) {
                $scope.retorno = "Selecione o professor e a matéria do aluno.";
                return;
            }

            var novoUsuario = {
                nome: $scope.cadastro.nome,
                tipo: $scope.cadastro.tipo,
                dataCadastro: new Date()
            };

            if ($scope.cadastro.tipo === "Professor") {
                novoUsuario.materias = angular.copy($scope.cadastro.materias);
                novoUsuario.materiasNomes = angular.copy($scope.cadastro.materiasNomes);
            }

            if ($scope.cadastro.tipo === "Aluno") {
                novoUsuario.professorNome = $scope.cadastro.professorNome;
                novoUsuario.materia = $scope.cadastro.materiaAluno;
            }

            $scope.usuarios.push(novoUsuario);

            $scope.retorno = "Usuário cadastrado com sucesso.";
            $scope.aba = "login";
            $scope.limparFormularioCadastro();
            $scope.limparFormularioLogin();
        };

        $scope.fazerLogin = function () {
            var usuarioEncontrado = $scope.usuarios.find(function (usuario) {
                return usuario.nome === $scope.login.nome &&
                    usuario.tipo === $scope.login.tipo;
            });

            if (usuarioEncontrado) {
                $scope.usuario = usuarioEncontrado;
                $scope.logado = true;
                $scope.abaProfessor = "materias";
                $scope.retorno = "";
                $scope.limparFormularioLogin();
            } else {
                $scope.retorno = "Usuário não encontrado.";
            }
        };

        $scope.obterAlunosDoProfessorLogado = function () {
            if (!$scope.usuario || $scope.usuario.tipo !== "Professor") {
                return [];
            }

            return $scope.usuarios.filter(function (usuario) {
                return usuario.tipo === "Aluno" &&
                    usuario.professorNome === $scope.usuario.nome &&
                    ($scope.usuario.materiasNomes || []).indexOf(usuario.materia) !== -1;
            });
        };

        $scope.logout = function () {
            $scope.logado = false;
            $scope.usuario = {};
            $scope.retorno = "";
            $scope.aba = "login";
            $scope.abaProfessor = "materias";
            $scope.limparFormularioLogin();
            $scope.limparFormularioCadastro();
        };
    })

    .controller("ListaUsuariosController", function ($scope) {
        $scope.filtro = "";
        $scope.filtroTipo = "";
    });