/*Faça um programa em Javascript para calcular os valores x1 e x2 da fórmula de Bhaskara,
usando as variáveis a, b e c, e mostre os valores x1 e x2. Usando os operadores de
atribuição e aritméticos.

Melhore o programa de Bhaskara do desafio anterior, adicionando IFs para verificar se:
a) A variável “a” é válida (não pode ser zero);
b) Se não existem raízes reais, e informar;
c) Se existe apenas uma raiz real, e informar essa raiz;
d) Se existem duas raízes reais, e as informar.
*/

// Para rodar com input, é necessário descomentar as linhas de "prompt" e comentar as de baixo, abrir o terminal e rodar: node exercicio2

// const prompt = require("prompt-sync")();

// const a = Number(prompt("Digite o valor de A: "));
// const b = Number(prompt("Digite o valor de B: "));
// const c = Number(prompt("Digite o valor de C: "));


const a = 1;
const b = 2;
const c = 1;


const delta = b * b - 4 * a * c;

if (Number.isNaN(a) || Number.isNaN(b) || Number.isNaN(c)) {
    console.log("Valores inválidos, precisam ser números!");
} else if (a === 0) {
    console.log('O valor de "a" não pode ser igual a 0!');
} else if (delta < 0) {
    console.log("Se Delta for menor que 0, então não existem raízes reais!");
} else if (delta === 0) {
    const x = (-b + Math.sqrt(delta)) / (2 * a);
    console.log("Existe apenas uma raiz real, sendo ela x = " + x + ".");
} else {
    const x1 = (-b + Math.sqrt(delta)) / (2 * a);
    const x2 = (-b - Math.sqrt(delta)) / (2 * a);
    console.log('Existem duas raizes reais, sendo elas -> x1 = ' + x1 + " e " + 'x2 = ' + x2 + ".");
}
