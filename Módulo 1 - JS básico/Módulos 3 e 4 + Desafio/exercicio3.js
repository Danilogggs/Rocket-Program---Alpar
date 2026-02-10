/*
Crie um programa que simula um jogo de adivinhação. O programa deve gerar um número
aleatório entre 1 e 100 e permitir que o usuário tente adivinhar o número. O programa
deve informar se o palpite é maior ou menor que o número secreto até que o usuário
acerte.
Regras:
1. O número secreto deve ser gerado aleatoriamente entre 1 e 100.
2. O usuário pode fazer quantas tentativas quiser até acertar.
3. Após cada tentativa, o programa deve exibir se o número é maior ou menor que o
palpite.
4. Quando o usuário acertar, o programa deve exibir uma mensagem de parabéns e o
número de tentativas usadas.
Dica:
Para gerar um número aleatório em Javascript, você pode usar o código:
Math.round(Math.random() * 100);
Math.random() é uma função que gera um número aleatório entre 0 e 1, e multiplicando
por um número, você pode obter valores entre 0 e o número escolhido;
Math.round() arredonda um número para inteiro, 5.4 é arredondado para 5, e 5.5 é
arredondado para 6.

*/
const prompt = require("prompt-sync")();
var numeroSecreto = Math.round(Math.random() * 99) + 1;
// console.log(numeroSecreto);
var contador = 1;

console.log("Tente adivinhar o número :)\nFaça seu primeiro palpite:\n ");
var chute = Number(prompt());

while (numeroSecreto !== chute) {
    if (numeroSecreto > chute) {
        console.log("O número é maior que o seu palpite. Tente novamente.");
        chute = Number(prompt());
        contador++;
    } else {
        console.log("O número é menor que o seu palpite. Tente novamente.")
        chute = Number(prompt());
        contador++;
    }
}

if (contador == 1) console.log("Parabéns gigante, acertou de primeira!");
else console.log("Boa, você acertou em " + contador + " tentativas.");