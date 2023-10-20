
const estoque = JSON.parse(localStorage.getItem('estoque')) || [];

function adicionarItem() {
    const item = document.getElementById("item").value;
    const quantidade = parseInt(document.getElementById("quantidade").value);

    if (item && !isNaN(quantidade)) {
      
        const itemExistente = estoque.find(i => i.item === item);
        if (itemExistente) {
            itemExistente.quantidade += quantidade;
        } else {
            estoque.push({ item, quantidade, selecionado: false });
        }

        atualizarListaEstoque();
        document.getElementById("item").value = "";
        document.getElementById("quantidade").value = "";
        salvarEstoqueLocal();
    }
}

function atualizarListaEstoque() {
    const estoqueDiv = document.getElementById("estoque");
    estoqueDiv.innerHTML = "";
    estoque.forEach((item, index) => {
        const itemDiv = document.createElement('div');
        itemDiv.innerHTML = `
            <input type="checkbox" id="selecionar${index}" onchange="atualizarSelecao(${index})" ${item.selecionado ? 'checked' : ''}>
            ${item.item}:  ${item.quantidade}
            <button onclick="adicionarQuantidade(${index}, 1)">+1</button>
            <button onclick="adicionarQuantidade(${index}, -1)">-1</button>
        `;
        estoqueDiv.appendChild(itemDiv);
    });
}

function gerarPDF() {
    const doc = new jsPDF();
    doc.text("Estoque", 10, 10);
    estoque.forEach((item, index) => {
        if (!item.selecionado) {
            doc.text(`${item.item} - Quantidade: ${item.quantidade}`, 10, 20 + (10 * index));
        }
    });
    doc.save("estoque.pdf");
}

function salvarEstoqueLocal() {
    localStorage.setItem('estoque', JSON.stringify(estoque));
}

function atualizarSelecao(index) {
    estoque[index].selecionado = !estoque[index].selecionado;
    salvarEstoqueLocal();
}

function adicionarQuantidade(index, quantidade) {
    if (estoque[index]) {
        estoque[index].quantidade += quantidade;
        if (estoque[index].quantidade < 0) {
            estoque[index].quantidade = 0; 
        }
        atualizarListaEstoque();
        salvarEstoqueLocal();
    }
}

function removerItensSelecionados() {
    const novosItens = estoque.filter(item => !item.selecionado);
    estoque.length = 0;
    estoque.push(...novosItens);
    atualizarListaEstoque();
    salvarEstoqueLocal();
}


atualizarListaEstoque();
