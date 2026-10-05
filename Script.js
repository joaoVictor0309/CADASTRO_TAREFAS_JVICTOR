document.addEventListener('DOMContentLoaded', () => {
    const campoTarefa = document.getElementById('campo-tarefa');
    const selectPrioridade = document.getElementById('select-prioridade');
    const selectCategoria = document.getElementById('select-categoria');
    const botaoAdicionar = document.getElementById('botao-adicionar');
    const listaTarefas = document.getElementById('lista-tarefas');
    const contadorTarefas = document.getElementById('contador-tarefas');
    const botaoLimparConcluidas = document.getElementById('botao-limpar-concluidas');
    const botaoTema = document.getElementById('botao-alterar-tema');
    const mensagemErro = document.getElementById('mensagem-erro');
    const modalConfirmacao = document.getElementById('modal-confirmacao');
    const modalTexto = document.getElementById('modal-texto');
    const botaoModalCancelar = document.getElementById('modal-cancelar');
    const botaoModalConfirmar = document.getElementById('modal-confirmar');

    let tarefas = JSON.parse(localStorage.getItem('tarefas_v2')) || [];
    let filtroAtual = 'todas';
    let idParaExcluir = null;

    function salvar() {
        localStorage.setItem('tarefas_v2', JSON.stringify(tarefas));
    }

    function renderizar() {
        listaTarefas.innerHTML = '';

        const filtradas = tarefas.filter(t => {
            if (filtroAtual === 'pendentes') return !t.concluida;
            if (filtroAtual === 'concluidas') return t.concluida;
            return true;
        });

        if (filtradas.length === 0) {
            listaTarefas.innerHTML = '<li style="text-align:center; padding: 20px; color: #888;">Nenhuma tarefa encontrada.</li>';
        } else {
            filtradas.forEach(t => {
                const li = document.createElement('li');
                li.className = `item-tarefa prioridade-${t.prioridade} ${t.concluida ? 'concluido' : ''}`;
                li.innerHTML = `
                    <div class="conteudo-tarefa">
                        <span class="tag-categoria">${t.categoria}</span>
                        <span>${t.texto}</span>
                    </div>
                    <div class="acoes-tarefa">
                        <button class="botao-acao" onclick="alternarConclusao(${t.id})" title="Concluir"><i class="fa-solid fa-check"></i></button>
                        <button class="botao-acao" onclick="confirmarExclusao(${t.id})" title="Excluir"><i class="fa-solid fa-trash"></i></button>
                    </div>
                `;
                listaTarefas.appendChild(li);
            });
        }

        const pendentes = tarefas.filter(t => !t.concluida).length;
        contadorTarefas.textContent = `${pendentes} pendente(s) de ${tarefas.length}`;
    }

    function adicionarTarefa() {
        const texto = campoTarefa.value.trim();
        if (!texto) {
            mensagemErro.textContent = 'Digite uma descrição para a tarefa!';
            mensagemErro.hidden = false;
            return;
        }

        mensagemErro.hidden = true;
        tarefas.push({
            id: Date.now(),
            texto: texto,
            prioridade: selectPrioridade.value,
            categoria: selectCategoria.value,
            concluida: false
        });

        campoTarefa.value = '';
        salvar();
        renderizar();
    }

    window.alternarConclusao = function(id) {
        const t = tarefas.find(item => item.id === id);
        if (t) t.concluida = !t.concluida;
        salvar();
        renderizar();
    };

    window.confirmarExclusao = function(id) {
        idParaExcluir = id;
        modalTexto.textContent = "Tem certeza que deseja excluir esta tarefa?";
        modalConfirmacao.hidden = false;
    };

    botaoModalConfirmar.addEventListener('click', () => {
        if (idParaExcluir !== null) {
            tarefas = tarefas.filter(t => t.id !== idParaExcluir);
            salvar();
            renderizar();
        }
        modalConfirmacao.hidden = true;
    });

    botaoModalCancelar.addEventListener('click', () => modalConfirmacao.hidden = true);

    botaoLimparConcluidas.addEventListener('click', () => {
        tarefas = tarefas.filter(t => !t.concluida);
        salvar();
        renderizar();
    });

    // Filtros
    document.querySelectorAll('.botao-filtro').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.botao-filtro').forEach(b => b.classList.remove('ativo'));
            btn.classList.add('ativo');
            filtroAtual = btn.dataset.filtro;
            renderizar();
        });
    });

    // Tema
    botaoTema.addEventListener('click', () => {
        document.body.classList.toggle('modo-escuro');
    });

    botaoAdicionar.addEventListener('click', adicionarTarefa);
    campoTarefa.addEventListener('keydown', e => { if (e.key === 'Enter') adicionarTarefa(); });

    renderizar();
});