angular.module('weatherApp', [])
    .controller('WeatherController', function ($scope, $http) {
        var apiKey = '64a6bc7ad20aad916572c02385bdea5c';

        $scope.cidade = localStorage.getItem('ultimaCidade') || 'Curitiba';
        $scope.clima = null;
        $scope.erro = '';
        $scope.carregando = false;
        $scope.mostrarDetalhes = false;

        $scope.classeTemperatura = 'ameno';
        $scope.tituloFaixa = 'Clima ameno na vila';
        $scope.descricaoFaixa = 'A vila está tranquila, com céu agradável e roupas normais.';

        $scope.alternarDetalhes = function () {
            $scope.mostrarDetalhes = !$scope.mostrarDetalhes;
        };

        $scope.definirCenario = function (temperatura) {
            if (temperatura <= 15) {
                $scope.classeTemperatura = 'frio';
                $scope.tituloFaixa = 'Frio na vila';
                $scope.descricaoFaixa = 'O céu esfria, a fumaça sai das chaminés e os moradores vestem roupas de frio.';
            } else if (temperatura <= 25) {
                $scope.classeTemperatura = 'ameno';
                $scope.tituloFaixa = 'Clima ameno na vila';
                $scope.descricaoFaixa = 'A vila fica equilibrada, com céu leve, árvores vivas e roupas normais.';
            } else {
                $scope.classeTemperatura = 'quente';
                $scope.tituloFaixa = 'Calor na vila';
                $scope.descricaoFaixa = 'O sol fica mais forte, os tons esquentam e os moradores usam roupas leves.';
            }
        };

        $scope.buscarClima = function () {
            var cidadeLimpa = ($scope.cidade || '').trim();

            if (!cidadeLimpa) {
                $scope.erro = 'Digite uma cidade.';
                $scope.clima = null;
                return;
            }

            $scope.carregando = true;
            $scope.erro = '';

            $http.get('https://api.openweathermap.org/data/2.5/weather', {
                params: {
                    q: cidadeLimpa,
                    appid: apiKey,
                    units: 'metric',
                    lang: 'pt_br'
                }
            })
                .then(function (response) {
                    $scope.clima = response.data;
                    $scope.erro = '';
                    $scope.mostrarDetalhes = false;

                    localStorage.setItem('ultimaCidade', cidadeLimpa);
                    $scope.definirCenario(response.data.main.temp);
                })
                .catch(function (error) {
                    if (error.data && error.data.message) {
                        $scope.erro = error.data.message;
                    } else {
                        $scope.erro = 'Não foi possível buscar o clima dessa cidade.';
                    }

                    $scope.clima = null;
                })
                .finally(function () {
                    $scope.carregando = false;
                });
        };

        $scope.buscarClima();
    });