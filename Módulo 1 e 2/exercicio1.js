/*Faça um programa em Javascript para calcular os valores x1 e x2 da fórmula de Bhaskara,
usando as variáveis a, b e c, e mostre os valores x1 e x2. Usando os operadores de
atribuição e aritméticos.
*/

// Para rodar com input, é necessário descomentar as linhas de "prompt" e comentar as de baixo, abrir o terminal e rodar: node exercicio1

// const prompt = require("prompt-sync")();

// const a = Number(prompt("Digite o valor de A: "));
// const b = Number(prompt("Digite o valor de B: "));
// const c = Number(prompt("Digite o valor de C: "));


const a = 1;
const b = -4;
const c = 0;

const delta = b * b - 4 * a * c;

const x1 = (-b + Math.sqrt(delta)) / (2 * a);
const x2 = (-b - Math.sqrt(delta)) / (2 * a);

console.log('x1 = ' + x1 + " e " + 'x2 = ' + x2 + ".");

