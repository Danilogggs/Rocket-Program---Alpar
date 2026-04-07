angular.module('app')
    .controller('HomePageController', function ($scope, AuthService, RegistroService, UsuarioService, UtilsService) {
        if (!AuthService.redirectIfNotLogged()) {
            return;
        }

        function criarHabitoVazio() {
            return new Habito('', false);
        }

        function criarHumorPadrao(data) {
            return {
                data: data || UtilsService.hoje(),
                nivelDoHumor: 3,
                observacao: ''
            };
        }

        function criarHabitosPadrao(data) {
            return {
                data: data || UtilsService.hoje(),
                habitos: [criarHabitoVazio()]
            };
        }

        function limparMensagensHumor() {
            $scope.mensagemHumorErro = '';
            $scope.mensagemHumorSucesso = '';
        }

        function limparMensagensHabitos() {
            $scope.mensagemHabitosErro = '';
            $scope.mensagemHabitosSucesso = '';
        }

        function recarregarPainel() {
            $scope.carregarDashboard();
            $scope.carregarRegistros();
        }

        function fecharModalComDelay(callback) {
            setTimeout(function () {
                $scope.$applyAsync(function () {
                    callback();
                });
            }, 400);
        }

        $scope.filtros = {
            data: '',
            humorNivel: ''
        };
        $scope.resumo = {};
        $scope.registros = [];
        $scope.habitosPadrao = [];
        $scope.carregandoRegistros = false;
        $scope.modalHumorAberto = false;
        $scope.modalHabitosAberto = false;
        $scope.editandoHumor = false;
        $scope.editandoHabitos = false;

        $scope.opcoesHumor = [
            { valor: 1, emoji: '😢', texto: 'Muito triste' },
            { valor: 2, emoji: '😐', texto: 'Neutro' },
            { valor: 3, emoji: '🙂', texto: 'Feliz' },
            { valor: 4, emoji: '😄', texto: 'Muito feliz' }
        ];

        $scope.humorFormData = criarHumorPadrao();
        $scope.habitosFormData = criarHabitosPadrao();
        $scope.mensagemHumorErro = '';
        $scope.mensagemHumorSucesso = '';
        $scope.mensagemHabitosErro = '';
        $scope.mensagemHabitosSucesso = '';

        $scope.getEmoji = function (nivel) {
            return UtilsService.getEmojiHumor(nivel);
        };

        $scope.formatarData = function (data) {
            return UtilsService.formatarData(data);
        };

        $scope.carregarDashboard = function () {
            RegistroService.buscarDashboard()
                .then(function (response) {
                    $scope.resumo = response.data.resumo || {};
                });
        };

        $scope.carregarRegistros = function () {
            $scope.carregandoRegistros = true;
            RegistroService.buscarRegistros({
                data: UtilsService.normalizarData($scope.filtros.data),
                humorNivel: $scope.filtros.humorNivel
            })
                .then(function (response) {
                    $scope.registros = response.data.registros || [];
                })
                .finally(function () {
                    $scope.carregandoRegistros = false;
                });
        };

        $scope.carregarUsuarioBase = function () {
            UsuarioService.buscarUsuario(AuthService.getEmailLogado())
                .then(function (response) {
                    const usuario = response.data.usuario || {};
                    $scope.habitosPadrao = usuario.habitosPadrao || [];
                    $scope.$parent.usuarioMenu = angular.copy(usuario);
                })
                .catch(function () {
                    AuthService.logout();
                });
        };

        $scope.aplicarFiltros = function () {
            $scope.filtros.data = UtilsService.normalizarData($scope.filtros.data);
            $scope.carregarRegistros();
        };

        $scope.limparFiltros = function () {
            $scope.filtros = { data: '', humorNivel: '' };
            $scope.carregarRegistros();
        };

        $scope.abrirModalHumor = function () {
            $scope.editandoHumor = false;
            limparMensagensHumor();
            $scope.humorFormData = criarHumorPadrao(UtilsService.normalizarData($scope.filtros.data) || UtilsService.hoje());
            $scope.modalHumorAberto = true;
        };

        $scope.fecharModalHumor = function () {
            $scope.modalHumorAberto = false;
            $scope.editandoHumor = false;
        };

        $scope.abrirModalHabitos = function () {
            $scope.editandoHabitos = false;
            limparMensagensHabitos();
            $scope.habitosFormData = criarHabitosPadrao(UtilsService.normalizarData($scope.filtros.data) || UtilsService.hoje());
            $scope.modalHabitosAberto = true;
        };

        $scope.fecharModalHabitos = function () {
            $scope.modalHabitosAberto = false;
            $scope.editandoHabitos = false;
        };

        $scope.selecionarHumor = function (valor) {
            $scope.humorFormData.nivelDoHumor = valor;
        };

        $scope.salvarHumor = function () {
            limparMensagensHumor();

            const payload = {
                data: UtilsService.normalizarData($scope.humorFormData.data),
                nivelDoHumor: Number($scope.humorFormData.nivelDoHumor),
                observacao: ($scope.humorFormData.observacao || '').trim()
            };

            if (!payload.data || !(payload.nivelDoHumor >= 1 && payload.nivelDoHumor <= 4)) {
                $scope.mensagemHumorErro = 'Informe uma data válida e selecione um nível de humor.';
                return;
            }

            RegistroService.registrarHumor(payload)
                .then(function (response) {
                    $scope.mensagemHumorSucesso = response.data.mensagem;
                    recarregarPainel();
                    fecharModalComDelay(function () {
                        $scope.fecharModalHumor();
                    });
                })
                .catch(function (error) {
                    $scope.mensagemHumorErro = UtilsService.extrairMensagemErro(error, 'Erro ao registrar humor.');
                });
        };

        $scope.adicionarHabitoLinha = function () {
            $scope.habitosFormData.habitos.push(criarHabitoVazio());
        };

        $scope.removerHabitoLinha = function (index) {
            $scope.habitosFormData.habitos.splice(index, 1);

            if (!$scope.editandoHabitos && !$scope.habitosFormData.habitos.length) {
                $scope.habitosFormData.habitos.push(criarHabitoVazio());
            }
        };

        $scope.usarHabitoPadrao = function (nome) {
            const alvo = String(nome || '').trim().toLowerCase();
            const jaExiste = $scope.habitosFormData.habitos.some(function (item) {
                return String(item.nome || '').trim().toLowerCase() === alvo;
            });

            if (!jaExiste && alvo) {
                $scope.habitosFormData.habitos.push(new Habito(nome, false));
            }
        };

        $scope.salvarHabitos = function () {
            limparMensagensHabitos();

            const dataNormalizada = UtilsService.normalizarData($scope.habitosFormData.data);
            const habitos = ($scope.habitosFormData.habitos || [])
                .map(function (item) {
                    return new Habito((item.nome || '').trim(), !!item.concluido);
                })
                .filter(function (item) {
                    return item.nome;
                });

            if (!dataNormalizada) {
                $scope.mensagemHabitosErro = 'Informe a data dos hábitos.';
                return;
            }

            if (!$scope.editandoHabitos && !habitos.length) {
                $scope.mensagemHabitosErro = 'Adicione pelo menos um hábito válido.';
                return;
            }

            RegistroService.registrarHabitos({
                data: dataNormalizada,
                habitos: habitos
            })
                .then(function (response) {
                    $scope.mensagemHabitosSucesso = response.data.mensagem;
                    $scope.habitosPadrao = response.data.habitosPadrao || [];
                    recarregarPainel();
                    fecharModalComDelay(function () {
                        $scope.fecharModalHabitos();
                        $scope.habitosFormData = criarHabitosPadrao();
                    });
                })
                .catch(function (error) {
                    $scope.mensagemHabitosErro = UtilsService.extrairMensagemErro(error, 'Erro ao registrar hábitos.');
                });
        };

        $scope.editarHumorRegistro = function (registro) {
            $scope.editandoHumor = true;
            limparMensagensHumor();

            $scope.humorFormData = {
                data: registro.data,
                nivelDoHumor: registro.humor ? Number(registro.humor.nivelDoHumor) : null,
                observacao: registro.humor ? (registro.humor.observacao || '') : ''
            };

            $scope.modalHumorAberto = true;
        };

        $scope.editarHabitosRegistro = function (registro) {
            $scope.editandoHabitos = true;
            limparMensagensHabitos();

            $scope.habitosFormData = {
                data: registro.data,
                habitos: angular.copy(registro.habitos || [])
            };

            $scope.modalHabitosAberto = true;
        };

        $scope.excluirRegistro = function (registro) {
            RegistroService.excluirRegistro(registro.data)
                .then(function () {
                    recarregarPainel();
                })
                .catch(function (error) {
                    alert(UtilsService.extrairMensagemErro(error, 'Erro ao excluir registro.'));
                });
        };

        $scope.carregarUsuarioBase();
        $scope.carregarDashboard();
        $scope.carregarRegistros();
    });
