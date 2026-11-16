
(() => {
  "use strict";

  document.addEventListener("DOMContentLoaded", () => {
    // ELEMENTOS PRINCIPAIS
    const paginas = [...document.querySelectorAll(".pagina")];
    const navegacao = document.getElementById("navegacao");
    const menu = document.getElementById("menu");

    // NAVEGAÇÃO
    function abrirPagina(id, atualizarUrl = false) {
      let destino = document.getElementById(id);

      if (!destino || !destino.classList.contains("pagina")) {
        id = "inicio";
      }

      paginas.forEach(pagina => {
        pagina.classList.toggle("ativa", pagina.id === id);
      });

      document.querySelectorAll('a[href^="#"]').forEach(link => {
        const ativo = link.getAttribute("href") === "#" + id;
        link.classList.toggle("active", ativo);
        link.classList.toggle("ativo", ativo);
      });

      if (atualizarUrl && location.hash !== "#" + id) {
        history.pushState(null, "", "#" + id);
      }

      navegacao?.classList.remove("aberto");
      menu?.setAttribute("aria-expanded", "false");

      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    document.addEventListener("click", event => {
      const link = event.target.closest('a[href^="#"]');
      if (!link) return;

      const id = link.getAttribute("href").slice(1);
      const destino = document.getElementById(id);

      if (!destino?.classList.contains("pagina")) return;

      event.preventDefault();
      abrirPagina(id, true);
    });

    window.addEventListener("popstate", () => {
      abrirPagina(location.hash.slice(1) || "inicio");
    });

    window.addEventListener("hashchange", () => {
      abrirPagina(location.hash.slice(1) || "inicio");
    });

    // MENU MOBILE
    if (menu && navegacao) {
      menu.addEventListener("click", () => {
        const aberto = navegacao.classList.toggle("aberto");
        menu.setAttribute("aria-expanded", String(aberto));
      });
    }

    // REDAÇÕES
    const abas = document.getElementById("abas");
    const conteudo = document.getElementById("conteudo-redacoes");
    const pesquisa = document.getElementById("pesquisa");
    const contador = document.getElementById("contador");

    const lista = Array.isArray(window.redacoes)
      ? window.redacoes
      : [];

    if (!abas || !conteudo) {
      console.error("Não encontrei #abas ou #conteudo-redacoes no HTML.");
    } else if (!lista.length) {
      if (contador) contador.textContent = "Não foi possível carregar as redações.";
      conteudo.textContent = "Verifique se redacoes.js está carregando corretamente.";
      console.error("window.redacoes está vazio ou não foi definido.");
    } else {
      abas.replaceChildren();
      conteudo.replaceChildren();

      const botoes = [];
      const paineis = [];

      function selecionar(indice) {
        botoes.forEach((botao, i) => {
          botao.classList.toggle("selecionada", i === indice);
          botao.setAttribute("aria-selected", String(i === indice));
        });

        paineis.forEach((painel, i) => {
          painel.classList.toggle("selecionada", i === indice);
        });
      }

      lista.forEach((redacao, indice) => {
        // BOTÃO
        const botao = document.createElement("button");
        botao.type = "button";
        botao.className = "aba";
        botao.textContent = "Redação " + (redacao.id ?? indice + 1);
        botao.setAttribute("role", "tab");
        botao.setAttribute("aria-selected", "false");

        botao.addEventListener("click", () => selecionar(indice));

        abas.appendChild(botao);
        botoes.push(botao);

        // CONTEÚDO
        const painel = document.createElement("article");
        painel.className = "redacao";
        painel.setAttribute("role", "tabpanel");

        const titulo = document.createElement("h2");
        titulo.textContent = redacao.titulo || "Redação " + (indice + 1);

        const tema = document.createElement("p");
        tema.className = "tema";
        tema.textContent = "Tema: " + (redacao.tema || redacao.descricao || "");

        const texto = document.createElement("div");
        texto.className = "texto-redacao";

        String(redacao.texto || "")
          .split(/\n\s*\n/)
          .map(p => p.trim())
          .filter(Boolean)
          .forEach(p => {
            const paragrafo = document.createElement("p");
            paragrafo.textContent = p;
            texto.appendChild(paragrafo);
          });

        if (!texto.children.length) {
          texto.textContent = "Texto não encontrado.";
        }

        painel.append(titulo, tema, texto);

        if (redacao.imagem) {
          const img = document.createElement("img");
          img.src = redacao.imagem;
          img.alt = "Imagem da redação " + (indice + 1);
          img.onerror = () => img.remove();
          painel.appendChild(img);
        }

        conteudo.appendChild(painel);
        paineis.push(painel);
      });

      if (contador) {
        contador.textContent = lista.length + " redações no acervo";
      }

      selecionar(0);

      // PESQUISA
      if (pesquisa) {
        pesquisa.addEventListener("input", () => {
          const termo = pesquisa.value.trim().toLocaleLowerCase("pt-BR");
          let primeira = -1;

          lista.forEach((redacao, indice) => {
            const dados = [
              redacao.titulo,
              redacao.tema,
              redacao.descricao,
              redacao.texto
            ].join(" ").toLocaleLowerCase("pt-BR");

            const aparece = dados.includes(termo);
            botoes[indice].hidden = !aparece;
            paineis[indice].hidden = !aparece;

            if (aparece && primeira === -1) primeira = indice;
          });

          if (primeira !== -1) selecionar(primeira);
        });
      }
    }

    // ABRE A PÁGINA INICIAL OU A PÁGINA DO LINK
    abrirPagina(location.hash.slice(1) || "inicio");
  });
})();
