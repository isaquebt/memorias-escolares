(() => {
  "use strict";

  const paginas = document.querySelectorAll(".pagina");
  const botoesMenu = document.querySelectorAll("[data-go]");

  const lista = document.getElementById("lista-redacoes");
  const detalhe = document.getElementById("detalhe-redacao");
  const titulo = document.getElementById("titulo-redacao");
  const tema = document.getElementById("tema-redacao");
  const texto = document.getElementById("texto-redacao");
  const pesquisa = document.getElementById("pesquisa-redacoes");
  const voltar = document.getElementById("voltar-redacoes");

  function mostrarPagina(id) {
    const pagina = document.getElementById(id);

    if (!pagina || !pagina.classList.contains("pagina")) {
      id = "inicio";
    }

    paginas.forEach(p => p.classList.remove("ativa"));
    document.getElementById(id).classList.add("ativa");

    botoesMenu.forEach(botao => {
      botao.classList.toggle("selecionado", botao.dataset.go === id);
    });

    if (id === "redacoes") {
      esconderDetalhe();
    }

    if (location.hash !== `#${id}`) {
      history.pushState({ pagina: id }, "", `#${id}`);
    }
  }

  function esconderDetalhe() {
    if (detalhe) detalhe.hidden = true;
    if (lista) lista.hidden = false;
  }

  function abrirRedacao(id) {
    const redacao = window.redacoes.find(r => String(r.id) === String(id));

    if (!redacao) return;

    titulo.textContent = redacao.titulo || "Redação";
    tema.textContent = redacao.tema || "";

    texto.replaceChildren();

    String(redacao.texto || "")
      .split(/\n+/)
      .filter(paragrafo => paragrafo.trim())
      .forEach(paragrafo => {
        const p = document.createElement("p");
        p.textContent = paragrafo.trim();
        texto.appendChild(p);
      });

    lista.hidden = true;
    detalhe.hidden = false;
    detalhe.scrollIntoView({ behavior: "smooth" });
  }

  function criarCardsRedacoes(filtro = "") {
    lista.replaceChildren();

    const redacoes = window.redacoes || [];

    const filtradas = redacoes.filter(r => {
      const conteudo = `${r.titulo} ${r.tema} ${r.descricao}`.toLowerCase();
      return conteudo.includes(filtro.toLowerCase());
    });

    if (filtradas.length === 0) {
      lista.textContent = "Nenhuma redação encontrada.";
      return;
    }

    filtradas.forEach(redacao => {
      const card = document.createElement("article");
      card.className = "card";

      const h3 = document.createElement("h3");
      h3.textContent = redacao.titulo;

      const p = document.createElement("p");
      p.textContent = redacao.descricao || redacao.tema || "";

      const botao = document.createElement("button");
      botao.textContent = "Ler redação";
      botao.dataset.redacao = redacao.id;

      card.append(h3, p, botao);
      lista.appendChild(card);
    });
  }

  botoesMenu.forEach(botao => {
    botao.addEventListener("click", () => {
      mostrarPagina(botao.dataset.go);
    });
  });

  lista.addEventListener("click", evento => {
    const botao = evento.target.closest("[data-redacao]");
    if (botao) abrirRedacao(botao.dataset.redacao);
  });

  voltar.addEventListener("click", esconderDetalhe);

  pesquisa.addEventListener("input", () => {
    criarCardsRedacoes(pesquisa.value);
  });

  window.addEventListener("popstate", () => {
    const id = location.hash.slice(1) || "inicio";
    mostrarPaginaSemHistorico(id);
  });

  window.addEventListener("hashchange", () => {
    const id = location.hash.slice(1) || "inicio";
    mostrarPaginaSemHistorico(id);
  });

  function mostrarPaginaSemHistorico(id) {
    const pagina = document.getElementById(id);
    if (!pagina || !pagina.classList.contains("pagina")) return;

    paginas.forEach(p => p.classList.remove("ativa"));
    pagina.classList.add("ativa");

    if (id === "redacoes") esconderDetalhe();
  }

  function criarGaleria(id, itens) {
    const galeria = document.getElementById(id);
    if (!galeria) return;

    galeria.replaceChildren();

    itens.forEach(item => {
      const card = document.createElement("article");
      card.className = "card";

      const h3 = document.createElement("h3");
      h3.textContent = item.titulo;

      const p = document.createElement("p");
      p.textContent = item.texto;

      card.append(h3, p);
      galeria.appendChild(card);
    });
  }

  criarCardsRedacoes();

  criarGaleria("galeria-infancia", [
    { titulo: "Minhas lembranças", texto: "Momentos especiais da infância." }
  ]);

  criarGaleria("galeria-escola", [
    { titulo: "Minha trajetória", texto: "Experiências e aprendizados da vida escolar." }
  ]);

  const paginaInicial = location.hash.slice(1) || "inicio";
  mostrarPaginaSemHistorico(paginaInicial);
})();
