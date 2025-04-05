let jogadorMao = [];
let botMao = [];
let vezDoJogador = true;

function atualizarStatus(mensagem) {
    document.getElementById("status").textContent = mensagem;
}

function comprarCarta() {
    let carta = gerarCarta();
    jogadorMao.push(carta);
    atualizarMao("mao-jogador", jogadorMao);
    verificarVitoria();
}

function descartarCarta() {
    if (jogadorMao.length > 0) {
        jogadorMao.pop();
        atualizarMao("mao-jogador", jogadorMao);
        verificarVitoria();
        vezDoJogador = false;
        atualizarStatus("Bot está jogando...");
        setTimeout(botJoga, 1000);
    }
}

function botJoga() {
    if (botMao.length > 0) {
        botMao.pop();
        atualizarMao("mao-bot", botMao);
        verificarVitoria();
    }
    vezDoJogador = true;
    atualizarStatus("Sua vez!");
}

function gerarCarta() {
    let valores = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
    let naipes = ["♥", "♦", "♣", "♠"];
    let valor = valores[Math.floor(Math.random() * valores.length)];
    let naipe = naipes[Math.floor(Math.random() * naipes.length)];
    return valor + naipe;
}

function atualizarMao(id, mao) {
    let container = document.getElementById(id);
    container.innerHTML = "";
    mao.forEach(carta => {
        let div = document.createElement("div");
        div.classList.add("card");
        div.textContent = carta;
        container.appendChild(div);
    });
}

function verificarVitoria() {
    if (somarMao(jogadorMao) === 0) {
        exibirVitoria("Você venceu!");
    } else if (somarMao(botMao) === 0) {
        exibirVitoria("O Bot venceu!");
    }
}

function exibirVitoria(mensagem) {
    document.getElementById("mensagem-vitoria").textContent = mensagem;
    document.getElementById("modal-vitoria").style.display = "flex";
}

function fecharModal() {
    document.getElementById("modal-vitoria").style.display = "none";
}

function somarMao(mao) {
    let soma = 0;
    mao.forEach(carta => {
        let valor = carta.slice(0, -1);
        if (["J", "Q", "K"].includes(valor)) valor = 10;
        if (valor === "A") valor = 1;
        soma += parseInt(valor);
    });
    return soma;
}

// Inicializando o jogo
for (let i = 0; i < 7; i++) {
    jogadorMao.push(gerarCarta());
    botMao.push(gerarCarta());
}
atualizarMao("mao-jogador", jogadorMao);
atualizarMao("mao-bot", botMao);
