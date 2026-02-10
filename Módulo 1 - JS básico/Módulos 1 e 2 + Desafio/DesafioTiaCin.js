/*Criar uma calculadora de impostos.
A calculadora precisa conter 3 variáveis: uma que recebe um preço de um produto(em decimal, por favor), 
uma que informe se o produto tem direito a desconto (desconto de 10%), e o ICMS (que pode variar entre 12 e 25%)
O ICMS deverá ser calculado após o produto receber (ou não desconto).

O progama deverá retornar o valor do produto original, se ele teve desconto, 
o valor do produto com descontoe o valor do produto com o imposto aplicado.

Pra tornar as coisas mais interessantes, como o valor do imposto é variável, 
vamos brincar de loteria e deixar o valor do imposto randômico (entre os valores informados.... 12 a 25%).

IMPORTANTE: Para rodar é necessário abrir o terminal e rodar: node DesafioTiaCin
*/

const prompt = require("prompt-sync")();

let precoDoProduto = Number(prompt("Digite o preço do produto: "));
while (Number.isNaN(precoDoProduto) || precoDoProduto <= 0) {
    console.log("Por favor, digite um preço de produto válido (Exemplo: 100.00):");
    precoDoProduto = Number(prompt());
}

console.log("O produto possui desconto? \nSim -> Digite 1 \nNão -> Digite 2")
let desconto = Number(prompt());
while (Number.isNaN(desconto) || (desconto !== 1 && desconto !== 2)) {
    console.log("Por favor, digite 1 para sim ou 2 para não:");
    desconto = Number(prompt());
}

const icms = (Math.floor(Math.random() * (25 - 12 + 1)) + 12) / 100;
let precoDoProdutoComDesconto;
if (desconto == 1) {
    precoDoProdutoComDesconto = precoDoProduto * 0.9;
    console.log("Valor do produto: " + precoDoProduto.toFixed(2) + "\nProduto teve desconto, valor atualizado: " + precoDoProdutoComDesconto +
        "\nValor com imposto de " + icms * 100 + "% aplicado no produto: " + (precoDoProdutoComDesconto * (icms + 1)).toFixed(2));
} else {
    console.log("Valor do produto: " + precoDoProduto.toFixed(2) +
        "\nProduto não teve desconto\nValor com imposto de " + icms * 100 + "% aplicado no produto: " +
        (precoDoProduto * (icms + 1)).toFixed(2));
}

