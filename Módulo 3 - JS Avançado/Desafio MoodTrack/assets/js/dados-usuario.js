angular.module('app')
    .controller('DadosUsuarioController', function ($scope, AuthService, UsuarioService, UtilsService) {
        if (!AuthService.redirectIfNotLogged()) {
            return;
        }

        function criarUsuario(data) {
            return new Usuario(
                data.nome || '',
                data.email || '',
                data.senha || '',
                data.foto || '',
                data.habitosPadrao || [],
                data.registrosDiarios || []
            );
        }

        function limparMensagens() {
            $scope.mensagemSucesso = '';
            $scope.mensagemErro = '';
        }

        function limparCampoArquivo() {
            const inputFoto = document.getElementById('foto');
            if (inputFoto) {
                inputFoto.value = '';
            }
        }

        $scope.usuario = { nome: '', email: '', senha: '', foto: '' };
        $scope.emailOriginal = '';
        $scope.novaFoto = null;
        $scope.previewNovaFoto = '';
        $scope.removerFotoAtual = false;
        $scope.emailEmUso = false;
        $scope.verificandoEmail = false;
        $scope.fotoInvalida = false;
        $scope.mensagemSucesso = '';
        $scope.mensagemErro = '';

        $scope.temFotoAtual = function () {
            return !!($scope.usuario.foto && !$scope.removerFotoAtual);
        };

        $scope.temNovaPreview = function () {
            return !!$scope.previewNovaFoto;
        };

        $scope.carregarNovaFoto = function (input) {
            limparMensagens();
            const arquivo = input.files[0];

            if (!arquivo) {
                $scope.novaFoto = null;
                $scope.previewNovaFoto = '';
                $scope.fotoInvalida = false;
                return;
            }

            if (!arquivo.type.startsWith('image/')) {
                input.value = '';
                $scope.novaFoto = null;
                $scope.previewNovaFoto = '';
                $scope.fotoInvalida = true;
                return;
            }

            const reader = new FileReader();
            reader.onload = function (event) {
                $scope.$applyAsync(function () {
                    $scope.novaFoto = arquivo;
                    $scope.previewNovaFoto = event.target.result;
                    $scope.fotoInvalida = false;
                    $scope.removerFotoAtual = false;
                });
            };
            reader.readAsDataURL(arquivo);
        };

        $scope.removerFoto = function () {
            $scope.removerFotoAtual = true;
            $scope.novaFoto = null;
            $scope.previewNovaFoto = '';
            $scope.mensagemSucesso = '';
            limparCampoArquivo();
        };

        $scope.verificarEmailDuplicado = function (form) {
            const email = ($scope.usuario.email || '').trim();
            $scope.emailEmUso = false;

            if (!email || (form && form.email && form.email.$invalid)) {
                $scope.verificandoEmail = false;
                return;
            }

            $scope.verificandoEmail = true;
            UsuarioService.verificarEmail(email, $scope.emailOriginal)
                .then(function (response) {
                    $scope.emailEmUso = !!response.data.existe;
                })
                .catch(function () {
                    $scope.emailEmUso = false;
                })
                .finally(function () {
                    $scope.verificandoEmail = false;
                });
        };

        $scope.carregarUsuario = function () {
            UsuarioService.buscarUsuario(AuthService.getEmailLogado())
                .then(function (response) {
                    const usuario = response.data.usuario || {};
                    $scope.usuario = criarUsuario(usuario);
                    $scope.emailOriginal = usuario.email || '';
                    $scope.$parent.usuarioMenu = angular.copy(usuario);
                })
                .catch(function () {
                    AuthService.logout();
                });
        };

        $scope.salvar = function (form) {
            limparMensagens();
            UtilsService.marcarCamposComoTocados(form);

            if (form.$invalid || $scope.fotoInvalida || $scope.emailEmUso || $scope.verificandoEmail) {
                $scope.mensagemErro = 'Corrija os campos antes de salvar.';
                return;
            }

            const formData = new FormData();
            formData.append('emailAtual', $scope.emailOriginal);
            formData.append('nome', ($scope.usuario.nome || '').trim());
            formData.append('email', ($scope.usuario.email || '').trim());
            formData.append('senha', $scope.usuario.senha || '');
            formData.append('manterFoto', $scope.removerFotoAtual ? 'false' : 'true');
            if ($scope.novaFoto) {
                formData.append('foto', $scope.novaFoto);
            }

            UsuarioService.atualizar(formData)
                .then(function (response) {
                    const usuario = response.data.usuario;
                    $scope.usuario = criarUsuario(usuario);
                    $scope.$parent.usuarioMenu = angular.copy(usuario);
                    $scope.emailOriginal = usuario.email;
                    AuthService.setEmailLogado(usuario.email);
                    $scope.novaFoto = null;
                    $scope.previewNovaFoto = '';
                    $scope.removerFotoAtual = false;
                    $scope.emailEmUso = false;
                    $scope.fotoInvalida = false;
                    $scope.mensagemSucesso = 'Dados alterados com sucesso.';
                    limparCampoArquivo();
                    form.$setPristine();
                    form.$setUntouched();
                })
                .catch(function (error) {
                    const msg = UtilsService.extrairMensagemErro(error, 'Erro ao atualizar usuário.');
                    if (msg.toLowerCase().includes('email já está cadastrado')) {
                        $scope.emailEmUso = true;
                    }
                    $scope.mensagemErro = msg;
                });
        };

        $scope.carregarUsuario();
    });
