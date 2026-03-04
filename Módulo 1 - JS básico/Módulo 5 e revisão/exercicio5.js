/*
Crie um programa simples que permite ao usuário gerenciar um cadastro de pessoas.
Cada pessoa terá um nome, idade e e-mail armazenados como um objeto dentro de um
array. O usuário poderá adicionar, remover e listar os cadastros.
Regras:
1. O programa deve armazenar os usuários em um array de objetos, onde cada
objeto representa uma pessoa com as propriedades:
o nome
o idade
o email
2. O usuário poderá escolher entre as seguintes opções:
o Adicionar um novo usuário.
o Remover um usuário pelo email.
o Listar todos os usuários cadastrados.
o Sair do programa.
3. O programa deve rodar até que o usuário escolha sair.
4. Não pode haver mais de um usuário com o mesmo e-mail.

*/
function verificaEmailExistente(listaDeUsuarios, email) {
    for (let i = 0; i < listaDeUsuarios.length; i++) {
        if ((listaDeUsuarios[i].email) == email) {
            return false;
        }
    }
    return true;
}

function addUser(listaDeUsuarios, user) {
    let verificacao = verificaEmailExistente(listaDeUsuarios, user.email)
    if (verificacao === true) {
        listaDeUsuarios.push(user);
        return "Usuario adicionado com sucesso!\n";
    }
    return "Já existe um usuário com esse email\n";
}

function removeFromList(listaDeUsuarios, removerPorEmail) {
    for (let i = 0; i < listaDeUsuarios.length; i++) {
        if ((listaDeUsuarios[i].email) == removerPorEmail) {
            listaDeUsuarios.splice(i, 1);
            return "Usuario removido com sucesso!\n";
        }
    }
    return "Usuário não existe!";
}

function showList(listaDeUsuarios) {
    if (listaDeUsuarios.length < 1) {
        console.log("Sua lista de Usuarios está vazia :(\n");
    } else {
        console.log("Segue sua lista de Usuarios:\n");
        for (let i = 0; i < listaDeUsuarios.length; i++) {
            console.log(i + 1 + ". " + JSON.stringify(listaDeUsuarios[i]));
        }
    }
}


const prompt = require("prompt-sync")();
const User = require("./user");

let listaDeUsuarios = new Array;
let opcao = 0;

while (opcao !== 4) {
    console.log("Selecione uma das opções abaixo:\n\n1. Adicionar um usuário à lista.\n2. Remover um usuário da lista." +
        "\n3. Exibir os usuários da lista.\n4. Sair da lista.");

    opcao = Number(prompt());

    switch (opcao) {

        case 1:
            console.log("Digite o nome do usuário:");
            const nome = prompt();

            console.log("Digite o email do usuário:");
            const email = prompt();

            console.log("Digite a idade do usuário:");
            const idade = prompt();

            const usuario = new User(nome, email, idade);

            console.log(addUser(listaDeUsuarios, usuario));

            break;
        case 2:
            console.log("Digite o email do usuário a ser removido:");
            const removerPorEmail = prompt();

            console.log(removeFromList(listaDeUsuarios, removerPorEmail));

            break;
        case 3:
            showList(listaDeUsuarios);

            break;
        case 4:
            console.log("Obrigado por utilizar a lista. Até mais :)");

            break;
        default:
            console.log("Opção inválida\n");

    }
}