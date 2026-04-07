angular.module('app')
    .controller('AppController', function ($scope, UsuarioService, AuthService, UtilsService) {
        function criarCadastroPadrao() {
            return { nome: '', email: '', senha: '', foto: null };
        }

        function limparMensagens() {
            $scope.mensagemCadastro = '';
            $scope.mensagemCadastroErro = '';
            $scope.mensagemLogin = '';
        }

        function limparCampoArquivo() {
            const inputFoto = document.getElementById('cadastroFoto');
            if (inputFoto) {
                inputFoto.value = '';
            }
        }

        function resetEstadoCadastro(form) {
            $scope.cadastro = criarCadastroPadrao();
            $scope.previewFoto = null;
            $scope.fotoInvalida = false;
            $scope.emailEmUso = false;
            $scope.verificandoEmail = false;
            $scope.emailVerificado = '';
            limparCampoArquivo();

            if (form) {
                form.$setPristine();
                form.$setUntouched();
            }
        }

        $scope.abaAtiva = 'login';
        $scope.login = { email: '', senha: '' };
        $scope.cadastro = criarCadastroPadrao();
        $scope.previewFoto = null;
        $scope.fotoInvalida = false;
        $scope.emailEmUso = false;
        $scope.verificandoEmail = false;
        $scope.emailVerificado = '';
        $scope.mensagemCadastro = '';
        $scope.mensagemCadastroErro = '';
        $scope.mensagemLogin = '';

        $scope.trocarAba = function (aba) {
            $scope.abaAtiva = aba;
            limparMensagens();
        };

        $scope.carregarImagem = function (input) {
            const arquivo = input.files[0];

            if (!arquivo) {
                $scope.previewFoto = null;
                $scope.cadastro.foto = null;
                $scope.fotoInvalida = false;
                return;
            }

            if (!arquivo.type.startsWith('image/')) {
                input.value = '';
                $scope.previewFoto = null;
                $scope.cadastro.foto = null;
                $scope.fotoInvalida = true;
                return;
            }

            const reader = new FileReader();
            reader.onload = function (event) {
                $scope.$applyAsync(function () {
                    $scope.previewFoto = event.target.result;
                    $scope.cadastro.foto = arquivo;
                    $scope.fotoInvalida = false;
                });
            };
            reader.readAsDataURL(arquivo);
        };

        $scope.verificarEmailCadastro = function (form) {
            const email = ($scope.cadastro.email || '').trim().toLowerCase();
            $scope.emailVerificado = '';

            if (!email || (form && form.cadastroEmail && form.cadastroEmail.$invalid)) {
                $scope.emailEmUso = false;
                $scope.verificandoEmail = false;
                return;
            }

            $scope.verificandoEmail = true;
            UsuarioService.verificarEmail(email)
                .then(function (response) {
                    $scope.emailEmUso = !!response.data.existe;
                    $scope.emailVerificado = email;
                })
                .catch(function () {
                    $scope.emailEmUso = false;
                })
                .finally(function () {
                    $scope.verificandoEmail = false;
                });
        };

        $scope.cadastrar = function (form) {
            $scope.mensagemCadastro = '';
            $scope.mensagemCadastroErro = '';
            UtilsService.marcarCamposComoTocados(form);

            if (form.$invalid || $scope.fotoInvalida || $scope.verificandoEmail || $scope.emailEmUso) {
                return;
            }

            const emailAtual = ($scope.cadastro.email || '').trim().toLowerCase();
            if ($scope.emailVerificado !== emailAtual) {
                $scope.verificarEmailCadastro(form);
                return;
            }

            const usuario = new Usuario(
                $scope.cadastro.nome,
                $scope.cadastro.email,
                $scope.cadastro.senha,
                $scope.cadastro.foto ? $scope.cadastro.foto.name : '',
                [],
                []
            );

            const formData = new FormData();
            formData.append('nome', usuario.nome);
            formData.append('email', usuario.email);
            formData.append('senha', usuario.senha);
            if ($scope.cadastro.foto) {
                formData.append('foto', $scope.cadastro.foto);
            }

            UsuarioService.cadastrar(formData)
                .then(function (response) {
                    $scope.login.email = response.data.usuario.email;
                    $scope.mensagemCadastro = response.data.mensagem;
                    resetEstadoCadastro(form);
                    $scope.abaAtiva = 'login';
                })
                .catch(function (error) {
                    const msg = UtilsService.extrairMensagemErro(error, 'Erro ao cadastrar usuário.');
                    $scope.mensagemCadastroErro = msg;
                    if (msg.toLowerCase().includes('email já está cadastrado')) {
                        $scope.emailEmUso = true;
                    }
                });
        };

        $scope.entrar = function (form) {
            $scope.mensagemLogin = '';
            UtilsService.marcarCamposComoTocados(form);

            if (form.$invalid) {
                $scope.mensagemLogin = 'Preencha email e senha corretamente.';
                return;
            }

            UsuarioService.login({
                email: $scope.login.email,
                senha: $scope.login.senha
            })
                .then(function (response) {
                    AuthService.setEmailLogado(response.data.usuario.email);
                    window.location.href = './home.html';
                })
                .catch(function (error) {
                    $scope.mensagemLogin = UtilsService.extrairMensagemErro(error, 'Erro ao realizar login.');
                });
        };
    });
