angular.module("validacaoApp", [])
    .controller("ValidacaoController", ["$scope", function ($scope) {
        $scope.form = {
            nome: "",
            email: "",
            cpf: ""
        };

        $scope.resultado = {
            nome: null,
            email: null,
            cpf: null
        };

        $scope.validarFormulario = function ($event) {
            $event.preventDefault();

            const regexNome = /^[A-Za-zÀ-ÿ\s]+$/;
            const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const regexCpf = /^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/;

            $scope.resultado.nome = regexNome.test($scope.form.nome);
            $scope.resultado.email = regexEmail.test($scope.form.email);
            $scope.resultado.cpf = regexCpf.test($scope.form.cpf);

            const formularioValido =
                $scope.resultado.nome &&
                $scope.resultado.email &&
                $scope.resultado.cpf;

            if (!formularioValido) {
                return;
            }
        };
    }]);