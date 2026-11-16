
(() => {
  "use strict";

  const paginas = document.querySelectorAll(".pagina");
  const navegacao = document.getElementById("navegacao");
  const menu = document.getElementById("menu");

  function abrirPagina(id) {
    const destino = document.getElementById(id);

    if (!destino || !destino.classList.contains("pagina")) {
      id = "inicio";
    }

    paginas.forEach(pagina => {
      pagina.classList.toggle("ativa", pagina.id === id);
    });

    document.querySelectorAll("nav a").forEach(link => {
      link.classList.toggle(
        "active",
        link.getAttribute("href") === "#" + id
      );
    });

    if (navegacao) navegacao.classList.remove("aberto");

    if (menu) {
      menu.setAttribute("aria-expanded", "false");
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Faz TODOS os links internos funcionarem.
  document.addEventListener("click", event => {
    const link = event.target.closest('a[href^="#"]');

    if (!link) return;

    const id = link.getAttribute("href").substring(1);

    if (!document.getElementById(id)?.classList.contains("pagina")) {
      return;
    }

    event.preventDefault();

    if (location.hash !== "#" + id) {
      history.pushState(null, "", "#" + id);
    }

    abrirPagina(id);
  });

  // Funciona também com voltar e avançar do navegador.
  window.addEventListener("popstate", () => {
    abrirPagina(location.hash.substring(1) || "inicio");
  });

  window.addEventListener("hashchange", () => {
    abrirPagina(location.hash.substring(1) || "inicio");
  });

  // Menu para celular.
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

  const redacoes = Array.isArray(window.redacoes)
    ? window.redacoes
    : [];

  if (abas && conteudo) {
    abas.replaceChildren();
    conteudo.replaceChildren();

    if (redacoes.length === 0) {
      if (contador) {
        contador.textContent = "Erro ao carregar redações.";
      }

      conteudo.textContent =
        "Confira se redacoes.js está na mesma pasta que index.html.";

    } else {
      if (contador) {
        contador.textContent =
          redacoes.length + " redações no acervo";
      }

      const botoes = new Map();
      const paineis = new Map();

      function selecionarRedacao(id) {
        botoes.forEach((botao, chave) => {
          botao.classList.toggle("selecionada", chave === id);
          botao.setAttribute(
            "aria-selected",
            String(chave === id)
          );
        });

        paineis.forEach((painel, chave) => {
          painel.classList.toggle(
            "selecionada",
            chave === id
          );
        });
      }

      redacoes.forEach((redacao, indice) => {
        const id = String(redacao.id ?? indice + 1);

        // Criar botão da redação.
        const botao = document.createElement("button");

        botao.type = "button";
        botao.className = "aba";
        botao.textContent = "Redação " + id;
        botao.setAttribute("role", "tab");
        botao.setAttribute("aria-selected", "false");

        botao.addEventListener("click", () => {
          selecionarRedacao(id);
        });

        abas.appendChild(botao);
        botoes.set(id, botao);

        // Criar painel correspondente.
        const painel = document.createElement("article");

        painel.className = "redacao";
        painel.setAttribute("role", "tabpanel");

        const meta = document.createElement("div");
        meta.className = "redacao-meta";

        const numero = document.createElement("span");
        numero.textContent = "REDAÇÃO " + id;

        const marca = document.createElement("span");
        marca.textContent = "ENTRE LINHAS & MEMÓRIAS";

        meta.append(numero, marca);

        const titulo = document.createElement("h2");
        titulo.textContent = redacao.titulo || "Redação " + id;

        const tema = document.createElement("p");
        tema.className = "tema";
        tema.textContent =
          "Tema: " + (redacao.tema || redacao.descricao || "");

        const texto = document.createElement("div");
        texto.className = "texto-redacao";

        String(redacao.texto || "")
          .split(/\n\s*\n/)
          .map(paragrafo => paragrafo.trim())
          .filter(Boolean)
          .forEach(paragrafoTexto => {
            const paragrafo = document.createElement("p");
            paragrafo.textContent = paragrafoTexto;
            texto.appendChild(paragrafo);
          });

        if (!texto.children.length) {
          texto.textContent = "Texto não encontrado.";
        }

        painel.append(meta, titulo, tema, texto);

        if (redacao.imagem) {
          const areaImagem = document.createElement("div");
          areaImagem.className = "imagem-redacao";

          const imagem = document.createElement("img");
          imagem.src = redacao.imagem;
          imagem.alt = "Imagem da redação " + id;

          imagem.onerror = () => areaImagem.remove();

          areaImagem.appendChild(imagem);
          painel.appendChild(areaImagem);
        }

        conteudo.appendChild(painel);
        paineis.set(id, painel);
      });

      // Abre a primeira redação.
      selecionarRedacao(
        String(redacoes[0].id ?? 1)
      );

      // Pesquisa.
      if (pesquisa) {
        pesquisa.addEventListener("input", () => {
          const termo = pesquisa.value
            .trim()
            .toLocaleLowerCase("pt-BR");

          let primeira = null;

          redacoes.forEach((redacao, indice) => {
            const id = String(redacao.id ?? indice + 1);

            const dados = [
              redacao.titulo,
              redacao.tema,
              redacao.descricao,
              redacao.texto
            ].join(" ").toLocaleLowerCase("pt-BR");

            const corresponde = dados.includes(termo);

            botoes.get(id).hidden = !corresponde;
            paineis.get(id).hidden = !corresponde;

            if (corresponde && primeira === null) {
              primeira = id;
            }
          });

          if (primeira !== null) {
            selecionarRedacao(primeira);
          }
        });
      }
    }
  }

  // Abre a página correta ao entrar no site.
  abrirPagina(location.hash.substring(1) || "inicio");

})();
