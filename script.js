
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
      Tema:O RESPEITO ÀS DIFERENÇAS COMO CAMINHO PARA A SUPERAÇÃO DOS CONFLITOS SOCIAIS NA SOCIEDADE CONTEMPORÂNEA
    </p>

    <div class="essay-content">

      <p>
        Na sociedade contemporânea, caracteriza-se pela diversidade cultural, religiosa e social, os conflitos tornam-se cada vez mais frequentes devido à dificuldade de convivência entre diferentes grupos. A globalização aproximou diversas pessoas com distintas visões de mundo, mas também evidenciou preconceitos e intolerância. Nesse contexto, o respeito às diferenças mostra-se essencial como meio de promover a harmonia social e reduzir tenções.
         Em primeiro lugar, a ausência de respeito contribui diretamente para o surgimento de conflitos sócias, como racismo, preconceito e intolerância religiosa. Quando indivíduos não aceitam aquilo que difere, acabam gerando exclusão e desigualdade, intensificando divisões na sociedade. Dessa forma, valorizar a diversidade e reconhecer a importância de cada indivíduo são atitudes fundamentais para diminuir esses problemas.
             Além disso, a educação exerce um papel fundamental na construção de uma sociedade mais respeitosa. Ao incentivar o diálogo, a empatia e o pensamento crítico, escolas e famílias podem se formar cidadãos mais conscientes e preparados para conviver com as diferenças. Assim, o ensino voltado para a inclusão contribui para a redução de conflitos e para a construção de relações mais saudáveis.
                Portanto, o respeito às diferenças é indispensável para a superação dos conflitos sociais na atualidade. Para que isso se torne realidade, é necessário investir em educação, promover a conscientização e fortalecer valores como empatia e tolerância. Somente assim será possível construir uma sociedade mais justa, pacífica e igualitária.
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
