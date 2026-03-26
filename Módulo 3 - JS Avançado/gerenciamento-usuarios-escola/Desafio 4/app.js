angular.module("appEscolar", [])
    .controller("AppController", function ($scope) {
        $scope.mensagem = "Bem-vindo ao sistema de cadastro escolar";

        $scope.aba = "login";
        $scope.logado = false;
        $scope.mostrarMaterias = false;
        $scope.retorno = "";

        $scope.usuario = {};

        $scope.login = {
            nome: "",
            tipo: ""
        };

        $scope.cadastro = {
            nome: "",
            tipo: "",
            materias: []
        };

        $scope.usuarios = [];

        $scope.todasMaterias = [
            { valor: "sn", nome: "ServiceNow" },
            { valor: "ang", nome: "Angular" },
            { valor: "rec", nome: "React" }
        ];

        $scope.materiasDisponiveis = angular.copy($scope.todasMaterias);
        $scope.materiasSelecionadasCadastro = [];

        $scope.materiasDisponiveisEdicao = [];
        $scope.materiasSelecionadasEdicao = [];

        $scope.obterNomeMateria = function (valor) {
            const materia = $scope.todasMaterias.find(function (item) {
                return item.valor === valor;
            });

            return materia ? materia.nome : valor;
        };

        $scope.converterMateriasParaNomes = function (listaValores) {
            return listaValores.map(function (valor) {
                return $scope.obterNomeMateria(valor);
            });
        };

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
                materias: []
            };

            $scope.materiasDisponiveis = angular.copy($scope.todasMaterias);
            $scope.materiasSelecionadasCadastro = [];
        };

        $scope.trocarAba = function (novaAba) {
            $scope.aba = novaAba;
            $scope.retorno = "";
            $scope.limparFormularioLogin();
            $scope.limparFormularioCadastro();
        };

        $scope.selecionarMateriaCadastro = function (materia) {
            const indice = $scope.materiasDisponiveis.indexOf(materia);

            if (indice !== -1) {
                $scope.materiasSelecionadasCadastro.push(materia);
                $scope.materiasDisponiveis.splice(indice, 1);
            }

            $scope.cadastro.materias = $scope.materiasSelecionadasCadastro.map(function (item) {
                return item.valor;
            });
        };

        $scope.removerMateriaCadastro = function (materia) {
            const indice = $scope.materiasSelecionadasCadastro.indexOf(materia);

            if (indice !== -1) {
                $scope.materiasDisponiveis.push(materia);
                $scope.materiasSelecionadasCadastro.splice(indice, 1);
            }

            $scope.cadastro.materias = $scope.materiasSelecionadasCadastro.map(function (item) {
                return item.valor;
            });
        };

        $scope.cadastrarUsuario = function () {
            const novoUsuario = {
                nome: $scope.cadastro.nome,
                tipo: $scope.cadastro.tipo,
                materias: $scope.cadastro.tipo === "Professor" ? angular.copy($scope.cadastro.materias) : [],
                materiasNomes: $scope.cadastro.tipo === "Professor"
                    ? $scope.converterMateriasParaNomes($scope.cadastro.materias)
                    : []
            };

            $scope.usuarios.push(novoUsuario);

            $scope.retorno = "Usuário cadastrado com sucesso.";
            $scope.limparFormularioCadastro();
            $scope.aba = "login";
            $scope.limparFormularioLogin();
        };

        $scope.fazerLogin = function () {
            const usuarioEncontrado = $scope.usuarios.find(function (usuario) {
                return usuario.nome === $scope.login.nome &&
                    usuario.tipo === $scope.login.tipo;
            });

            if (usuarioEncontrado) {
                $scope.usuario = usuarioEncontrado;
                $scope.logado = true;
                $scope.mostrarMaterias = false;
                $scope.retorno = "";
                $scope.aba = "";
                $scope.limparFormularioLogin();
            } else {
                $scope.retorno = "Usuário não encontrado.";
            }
        };

        $scope.prepararMateriasEdicao = function () {
            const materiasDoProfessor = $scope.usuario.materias || [];

            $scope.materiasSelecionadasEdicao = $scope.todasMaterias.filter(function (materia) {
                return materiasDoProfessor.includes(materia.valor);
            });

            $scope.materiasDisponiveisEdicao = $scope.todasMaterias.filter(function (materia) {
                return !materiasDoProfessor.includes(materia.valor);
            });
        };

        $scope.visualizarMaterias = function () {
            $scope.mostrarMaterias = true;
            $scope.prepararMateriasEdicao();
        };

        $scope.fecharMaterias = function () {
            $scope.mostrarMaterias = false;
        };

        $scope.selecionarMateriaEdicao = function (materia) {
            const indice = $scope.materiasDisponiveisEdicao.indexOf(materia);

            if (indice !== -1) {
                $scope.materiasSelecionadasEdicao.push(materia);
                $scope.materiasDisponiveisEdicao.splice(indice, 1);
            }
        };

        $scope.removerMateriaEdicao = function (materia) {
            const indice = $scope.materiasSelecionadasEdicao.indexOf(materia);

            if (indice !== -1) {
                $scope.materiasDisponiveisEdicao.push(materia);
                $scope.materiasSelecionadasEdicao.splice(indice, 1);
            }
        };

        $scope.salvarMateriasProfessor = function () {
            const materiasValores = $scope.materiasSelecionadasEdicao.map(function (item) {
                return item.valor;
            });

            const materiasNomes = $scope.materiasSelecionadasEdicao.map(function (item) {
                return item.nome;
            });

            $scope.usuario.materias = angular.copy(materiasValores);
            $scope.usuario.materiasNomes = angular.copy(materiasNomes);

            $scope.retorno = "Matérias salvas com sucesso.";
            $scope.mostrarMaterias = false;
        };

        $scope.logout = function () {
            $scope.logado = false;
            $scope.usuario = {};
            $scope.mostrarMaterias = false;
            $scope.retorno = "";
            $scope.aba = "login";
            $scope.limparFormularioLogin();
            $scope.limparFormularioCadastro();
        };
    });