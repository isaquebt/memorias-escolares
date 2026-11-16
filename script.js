// Navegação entre as páginas
const navLinks = document.querySelectorAll('.nav-link');
const pages = document.querySelectorAll('.page');
const menuToggle = document.getElementById('menuToggle');
const mainNav = document.getElementById('mainNav');

function showPage(pageId) {
  const target = document.getElementById(pageId);
  if (!target) return;
  pages.forEach(page => page.classList.toggle('active-page', page.id === pageId));
  navLinks.forEach(link => link.classList.toggle('active', link.dataset.page === pageId));
  if (mainNav) mainNav.classList.remove('open');
  if (menuToggle) menuToggle.setAttribute('aria-expanded', 'false');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

navLinks.forEach(link => {
  link.addEventListener('click', event => {
    event.preventDefault();
    const pageId = link.dataset.page;
    history.replaceState(null, '', `#${pageId}`);
    showPage(pageId);
  });
});

document.querySelectorAll('a[href^="#"]').forEach(link => {
  if (link.classList.contains('nav-link')) return;
  link.addEventListener('click', event => {
    const pageId = link.getAttribute('href').slice(1);
    if (document.getElementById(pageId)?.classList.contains('page')) {
      event.preventDefault();
      history.replaceState(null, '', `#${pageId}`);
      showPage(pageId);
    }
  });
});

if (menuToggle && mainNav) {
  menuToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });
}

// Carrega as redações reais do arquivo redacoes.js
const essayTabs = document.getElementById('essayTabs');
const essayPanels = document.getElementById('essayPanels');
const redacoes = Array.isArray(window.redacoes) ? window.redacoes : [];

if (essayTabs && essayPanels) {
  essayTabs.innerHTML = '';
  essayPanels.innerHTML = '';

  if (redacoes.length === 0) {
    essayPanels.textContent = 'Não foi possível carregar as redações. Confira se redacoes.js está na mesma pasta e foi carregado antes de main.js.';
  } else {
    redacoes.forEach((redacao, index) => {
      const id = Number(redacao.id) || index + 1;

      const tab = document.createElement('button');
      tab.type = 'button';
      tab.className = index === 0 ? 'tab active' : 'tab';
      tab.textContent = `Redação ${id}`;
      tab.dataset.target = `redacao${id}`;
      tab.setAttribute('role', 'tab');
      tab.setAttribute('aria-selected', String(index === 0));
      essayTabs.appendChild(tab);

      const panel = document.createElement('article');
      panel.className = index === 0 ? 'essay-panel active-panel' : 'essay-panel';
      panel.id = `redacao${id}`;

      const meta = document.createElement('div');
      meta.className = 'essay-meta';
      const number = document.createElement('span');
      number.textContent = `REDAÇÃO ${String(id).padStart(2, '0')}`;
      const date = document.createElement('span');
      date.textContent = 'ARQUIVO DE REDAÇÕES';
      meta.append(number, date);

      const title = document.createElement('h2');
      title.textContent = redacao.titulo || `Redação ${id}`;

      const theme = document.createElement('p');
      theme.className = 'essay-theme';
      theme.textContent = `Tema: ${redacao.tema || redacao.descricao || 'Não informado'}`;

      const content = document.createElement('div');
      content.className = 'essay-content';
      String(redacao.texto || '').split(/\n\s*\n/).filter(Boolean).forEach(paragrafo => {
        const p = document.createElement('p');
        p.textContent = paragrafo;
        content.appendChild(p);
      });

      panel.append(meta, title, theme, content);

      if (redacao.imagem) {
        const imageBox = document.createElement('div');
        imageBox.className = 'essay-image';
        const img = document.createElement('img');
        img.src = redacao.imagem;
        img.alt = `Imagem da redação ${id}`;
        img.onerror = () => { imageBox.style.display = 'none'; };
        imageBox.appendChild(img);
        panel.appendChild(imageBox);
      }

      essayPanels.appendChild(panel);
    });

    essayTabs.querySelectorAll('.tab').forEach(tab => {
      tab.addEventListener('click', () => {
        essayTabs.querySelectorAll('.tab').forEach(item => {
          item.classList.remove('active');
          item.setAttribute('aria-selected', 'false');
        });
        essayPanels.querySelectorAll('.essay-panel').forEach(panel => panel.classList.remove('active-panel'));
        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');
        document.getElementById(tab.dataset.target)?.classList.add('active-panel');
      });
    });
  }
}

// Abre a seção indicada no endereço ao carregar
const initialPage = location.hash.replace('#', '');
if (initialPage && document.getElementById(initialPage)?.classList.contains('page')) {
  showPage(initialPage);
}
