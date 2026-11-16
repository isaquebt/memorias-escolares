
// NAVEGAÇÃO DO SITE

const navLinks = document.querySelectorAll(".nav-link");
const pages = document.querySelectorAll(".page");

const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");

function showPage(pageId) {
  const target = document.getElementById(pageId);

  if (!target) return;

  pages.forEach(page => {
    page.classList.toggle("active-page", page.id === pageId);
  });

  navLinks.forEach(link => {
    link.classList.toggle(
      "active",
      link.dataset.page === pageId
    );
  });

  mainNav.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}


// LINKS DO MENU

navLinks.forEach(link => {
  link.addEventListener("click", event => {
    event.preventDefault();

    const pageId = link.dataset.page;

    history.replaceState(null, "", `#${pageId}`);

    showPage(pageId);
  });
});


// LINKS INTERNOS

document.querySelectorAll('a[href^="#"]').forEach(link => {

  if (link.classList.contains("nav-link")) return;

  link.addEventListener("click", event => {

    const pageId = link.getAttribute("href").slice(1);

    if (document.getElementById(pageId)?.classList.contains("page")) {

      event.preventDefault();

      history.replaceState(null, "", `#${pageId}`);

      showPage(pageId);
    }
  });
});


// MENU PARA CELULAR

menuToggle.addEventListener("click", () => {

  const isOpen = mainNav.classList.toggle("open");

  menuToggle.setAttribute(
    "aria-expanded",
    String(isOpen)
  );

});


// CRIAÇÃO DAS 17 REDAÇÕES

const essayTabs = document.getElementById("essayTabs");
const essayPanels = document.getElementById("essayPanels");

for (let i = 1; i <= 17; i++) {

  // CRIA O BOTÃO DA ABA

  const tab = document.createElement("button");

  tab.className = i === 1 ? "tab active" : "tab";

  tab.textContent = `Redação ${i}`;

  tab.dataset.target = `redacao${i}`;

  tab.setAttribute("role", "tab");

  essayTabs.appendChild(tab);


  // CRIA O CONTEÚDO DA REDAÇÃO

  const panel = document.createElement("article");

  panel.className = i === 1
    ? "essay-panel active-panel"
    : "essay-panel";

  panel.id = `redacao${i}`;

  panel.innerHTML = `

    <div class="essay-meta">

      <span>REDAÇÃO ${String(i).padStart(2, "0")}</span>

      <span>ANO / DATA: preencher</span>

    </div>

    <h2>Redação ${i} — título ou tema</h2>

    <p class="essay-theme">
      Tema: escreva aqui o tema da redação
    </p>

    <div class="essay-content">

      <p>
        Coloque aqui o texto da sua redação.
        Você pode copiar o texto original,
        mantendo os parágrafos.
      </p>

      <p>
        Também vale registrar o que foi mais difícil,
        quais repertórios utilizou e o que faria diferente hoje.
      </p>

    </div>

    <div class="reflection">

      <strong>✦ O que ficou de aprendizado?</strong>

      <p>
        Escreva aqui uma pequena reflexão
        sobre essa produção.
      </p>

    </div>

    <div class="essay-image">

      <img
        src="images/redacao-${i}.jpg"
        alt="Fotografia da redação ${i}"
        onerror="this.style.display='none'; this.parentElement.classList.add('image-placeholder')"
      >

      <span>
        Adicione uma foto ou digitalização da redação
      </span>

    </div>

  `;

  essayPanels.appendChild(panel);
}


// TROCA ENTRE AS REDAÇÕES

const tabs = document.querySelectorAll(".tab");

const essayArticles = document.querySelectorAll(".essay-panel");

tabs.forEach(tab => {

  tab.addEventListener("click", () => {

    // Remove a seleção anterior

    tabs.forEach(item => {
      item.classList.remove("active");
    });

    essayArticles.forEach(panel => {
      panel.classList.remove("active-panel");
    });

    // Ativa a redação escolhida

    tab.classList.add("active");

    const target = document.getElementById(
      tab.dataset.target
    );

    if (target) {
      target.classList.add("active-panel");
    }

  });

});


// ABRE A PÁGINA CORRETA AO CARREGAR

const initialPage = location.hash.replace("#", "");

if (
  initialPage &&
  document.getElementById(initialPage)?.classList.contains("page")
) {
  showPage(initialPage);
}
