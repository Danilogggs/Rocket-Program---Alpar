angular.module('app', [])
    .factory('UtilsService', function () {
        function normalizarData(data) {
            if (!data) return '';

            if (Object.prototype.toString.call(data) === '[object Date]' && !Number.isNaN(data.getTime())) {
                return data.toISOString().slice(0, 10);
            }

            const valor = String(data).trim();

            if (/^\d{4}-\d{2}-\d{2}$/.test(valor)) {
                return valor;
            }

            const iso = valor.match(/^(\d{4}-\d{2}-\d{2})/);
            if (iso) {
                return iso[1];
            }

            const br = valor.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
            if (br) {
                return `${br[3]}-${br[2]}-${br[1]}`;
            }

            return '';
        }

        function buildQueryString(params) {
            const query = Object.keys(params || {})
                .filter(function (chave) {
                    return params[chave] !== undefined && params[chave] !== null && params[chave] !== '';
                })
                .map(function (chave) {
                    return `${encodeURIComponent(chave)}=${encodeURIComponent(params[chave])}`;
                })
                .join('&');

            return query ? `?${query}` : '';
        }

        function getFotoPadraoSvg() {
            return 'data:image/svg+xml;utf8,' + encodeURIComponent(
                '<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80">' +
                '<circle cx="40" cy="40" r="40" fill="#ede9fe"/>' +
                '<circle cx="40" cy="30" r="16" fill="#8b5cf6"/>' +
                '<path d="M16 68c4-14 18-22 24-22s20 8 24 22" fill="#8b5cf6"/>' +
                '</svg>'
            );
        }

        return {
            getEmojiHumor: function (nivel) {
                const mapa = { 1: '😢', 2: '😐', 3: '🙂', 4: '😄' };
                return mapa[Number(nivel)] || '🙂';
            },

            formatarData: function (data) {
                const normalizada = normalizarData(data);
                if (!normalizada) return '';

                const partes = String(normalizada).split('-');
                return `${partes[2]}/${partes[1]}/${partes[0]}`;
            },

            normalizarData: normalizarData,

            hoje: function () {
                return new Date().toISOString().split('T')[0];
            },

            buildQueryString: buildQueryString,

            marcarCamposComoTocados: function (form) {
                angular.forEach(form, function (campo, nome) {
                    if (nome[0] !== '$' && campo && campo.$setTouched) {
                        campo.$setTouched();
                    }
                });
            },

            extrairMensagemErro: function (error, fallback) {
                return error && error.data && error.data.mensagem
                    ? error.data.mensagem
                    : fallback;
            },

            getFotoPadraoSvg: getFotoPadraoSvg,

            getFotoUsuario: function (usuario) {
                return usuario && usuario.foto ? `./${usuario.foto}` : getFotoPadraoSvg();
            }
        };
    })

    .directive('fileChange', function () {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                const handler = function () {
                    scope.$applyAsync(function () {
                        const callback = scope.$eval(attrs.fileChange);
                        if (typeof callback === 'function') {
                            callback(element[0]);
                        }
                    });
                };

                element.on('change', handler);

                scope.$on('$destroy', function () {
                    element.off('change', handler);
                });
            }
        };
    })

    .service('AuthService', function ($window) {
        this.getEmailLogado = function () {
            return $window.localStorage.getItem('usuarioLogadoEmail');
        };

        this.setEmailLogado = function (email) {
            $window.localStorage.setItem('usuarioLogadoEmail', email);
        };

        this.logout = function () {
            $window.localStorage.removeItem('usuarioLogadoEmail');
            $window.location.href = './index.html';
        };

        this.redirectIfNotLogged = function () {
            if (!this.getEmailLogado()) {
                $window.location.href = './index.html';
                return false;
            }
            return true;
        };
    })

    .service('UsuarioService', function ($http, UtilsService) {
        function multipartConfig() {
            return {
                headers: { 'Content-Type': undefined },
                transformRequest: angular.identity
            };
        }

        this.verificarEmail = function (email, ignorarEmail) {
            return $http.get('/verificar-email' + UtilsService.buildQueryString({
                email: email || '',
                ignorarEmail: ignorarEmail || ''
            }));
        };

        this.buscarUsuario = function (email) {
            return $http.get('/usuario' + UtilsService.buildQueryString({ email: email }));
        };

        this.cadastrar = function (formData) {
            return $http.post('/cadastrar', formData, multipartConfig());
        };

        this.login = function (payload) {
            return $http.post('/login', payload);
        };

        this.atualizar = function (formData) {
            return $http.put('/usuario', formData, multipartConfig());
        };
    })

    .service('RegistroService', function ($http, AuthService, UtilsService) {
        function authConfig(extra) {
            return angular.extend({
                headers: {
                    'x-user-email': AuthService.getEmailLogado() || ''
                }
            }, extra || {});
        }

        this.buscarRegistros = function (filtros) {
            return $http.get('/registros' + UtilsService.buildQueryString({
                data: filtros && filtros.data ? UtilsService.normalizarData(filtros.data) : '',
                humorNivel: filtros && filtros.humorNivel ? filtros.humorNivel : ''
            }), authConfig());
        };

        this.buscarDashboard = function () {
            return $http.get('/dashboard', authConfig());
        };

        this.registrarHumor = function (payload) {
            return $http.post('/registros/humor', payload, authConfig());
        };

        this.registrarHabitos = function (payload) {
            return $http.post('/registros/habitos', payload, authConfig());
        };

        this.excluirRegistro = function (data) {
            return $http.delete('/registros/' + encodeURIComponent(data), authConfig());
        };
    })

    .controller('MenuController', function ($scope, $document, AuthService, UsuarioService, UtilsService) {
        $scope.menuAberto = false;
        $scope.usuarioMenu = null;

        $scope.toggleMenu = function (event) {
            if (event && event.stopPropagation) {
                event.stopPropagation();
            }
            $scope.menuAberto = !$scope.menuAberto;
        };

        $scope.fecharMenu = function () {
            $scope.menuAberto = false;
        };

        $scope.logout = function () {
            AuthService.logout();
        };

        $scope.getFotoUsuario = function () {
            return UtilsService.getFotoUsuario($scope.usuarioMenu);
        };

        $scope.carregarUsuarioMenu = function () {
            const email = AuthService.getEmailLogado();
            if (!email) return;

            UsuarioService.buscarUsuario(email)
                .then(function (response) {
                    $scope.usuarioMenu = response.data.usuario;
                })
                .catch(function () {
                    AuthService.logout();
                });
        };

        const cliqueFora = function () {
            if ($scope.menuAberto) {
                $scope.$applyAsync(function () {
                    $scope.menuAberto = false;
                });
            }
        };

        $document.on('click', cliqueFora);

        $scope.$on('$destroy', function () {
            $document.off('click', cliqueFora);
        });
    });
