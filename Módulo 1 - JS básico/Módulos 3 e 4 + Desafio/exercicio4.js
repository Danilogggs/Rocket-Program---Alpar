/*

1. O programa deve ter um array chamado listaDeCompras que começa vazio.

2. Deve oferecer as seguintes opções ao usuário:
o Adicionar um item à lista.
o Remover um item da lista.
o Exibir os itens da lista.
o Sair do programa.
3. O programa deve rodar até que o usuário escolha sair.

4. As funções devem ser utilizadas para organizar as operações principais:
o adicionarItem(item): Adiciona um item ao array.
o removerItem(item): Remove um item do array (se existir).
o exibirLista(): Mostra todos os itens da lista no console.

*/
function addList(listaDeCompras, item) {
    listaDeCompras.push(item);
    return "Item adicionado com sucesso!\n";
}

function removeFromList(listaDeCompras, item) {
    for (let i = 0; i < listaDeCompras.length; i++) {
        if (listaDeCompras[i] === item) {
            listaDeCompras.splice(i, 1);
            return "Item removido com sucesso!\n";
        }
    }
    return "Item não existe!";
}

function showList(listaDeCompras) {
    if (listaDeCompras.length < 1) {
        console.log("Sua lista de compras está vazia :(\n");
    } else {
        console.log("Segue sua lista de compras:\n");
        for (let i = 0; i < listaDeCompras.length; i++) {
            console.log(i + 1 + ". " + listaDeCompras[i]);
        }
    }
}


const prompt = require("prompt-sync")();

let listaDeCompras = new Array;
let opcao = 0;
let item;
while (opcao !== 4) {
    console.log("Selecione uma das opções abaixo:\n\n1. Adicionar um item à lista.\n2. Remover um item da lista." +
        "\n3. Exibir os itens da lista.\n4. Sair da lista.");
    opcao = Number(prompt());
    switch (opcao) {
        case 1:
            console.log("Digite o item a ser adicionado:");
            item = prompt();
            console.log(addList(listaDeCompras, item));
            break;
        case 2:
            console.log("Digite o item a ser removido:");
            item = prompt();
            console.log(removeFromList(listaDeCompras, item));
            break;
        case 3:
            showList(listaDeCompras);
            break;
        case 4:
            console.log("Obrigado por utilizar a lista. Até mais :)");
            break;
        default:
            console.log("Opção inválida\n");

    }
}