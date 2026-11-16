"use strict";

const layouts = {
  essencial: {
    name: "Essencial",
    description: "Essencial · Manrope + DM Sans. A identidade da dieta em uma apresentação profissional clara e direta."
  },
  editorial: {
    name: "Editorial",
    description: "Editorial · Lora + DM Sans. Composição de publicação, títulos serifados e projetos apresentados como estudos de caso."
  },
  tecnico: {
    name: "Técnica",
    description: "Técnica · Space Grotesk + DM Sans. Navegação lateral, estrutura de dossiê e maior densidade de informação."
  },
  classico: {
    name: "Clássica",
    description: "Clássica · Lora + Manrope. Apresentação pessoal sóbria, composição mais aberta e projetos em sequência."
  }
};

const projects = {
  solar: {
    category: "Pesquisa acadêmica · UnB",
    title: "IA aplicada à operação fotovoltaica",
    short: "Classificação das condições de operação de módulos fotovoltaicos a partir de curvas corrente-tensão.",
    tags: ["Python", "Machine learning", "Energia solar"],
    paragraphs: [
      "O TCC investiga como diferentes representações de curvas I–V e modelos de aprendizado de máquina podem classificar condições de operação de módulos fotovoltaicos.",
      "A pesquisa conecta o comportamento físico dos módulos ao processamento de dados, à comparação de classificadores e à análise dos resultados. O foco é compreender o problema de engenharia, além de avaliar o desempenho dos modelos."
    ],
    points: ["Organização e processamento de dados em Python.", "Comparação de representações e modelos de aprendizado de máquina.", "Análise do desempenho e da coerência física das classificações."],
    note: "As figuras apresentadas são do trabalho acadêmico. Este resumo não substitui a descrição metodológica completa."
  },
  amara: {
    category: "Experiência profissional · Amara NZero",
    title: "Gestão de pedidos e automação no Wind",
    short: "Integração de processos e sistemas para apoiar a equipe Wind, com Odoo, Python, Zendesk e Power Automate.",
    tags: ["Odoo", "Python", "Zendesk"],
    paragraphs: [
      "Durante o estágio na equipe Wind da Amara NZero, a atuação combinou apoio aos processos comerciais e de pedidos com integração de sistemas e automação.",
      "Entre os trabalhos estão o projeto de um módulo Odoo adaptado à equipe, com automações e sincronizações, e uma frente de organização de fluxos no Zendesk com Power Automate, em contato com as áreas de negócio e TI."
    ],
    points: ["Apoio à organização de pedidos, informações e indicadores.", "Interface entre processos da equipe, sistemas e automações.", "Contato com a equipe de TI durante o desenvolvimento das soluções."],
    note: "Estudo de caso descritivo. Os diagramas são reconstruções ilustrativas, sem código interno, credenciais ou informações comerciais."
  },
  dieta: {
    category: "Projeto pessoal · Aplicação web",
    title: "Da planilha ao aplicativo",
    short: "Evolução de uma ferramenta de planejamento alimentar, com biblioteca, cálculos, histórico e dados compartilhados.",
    tags: ["Excel/VBA", "Aplicação web", "Dados"],
    paragraphs: [
      "Uma ferramenta pessoal de planejamento alimentar começou em Excel e VBA e evoluiu para uma aplicação web, com organização da biblioteca de alimentos, cálculos e histórico.",
      "O projeto reúne regras de negócio, migração de dados e construção de uma interface para uso cotidiano. A identidade visual do aplicativo também é a referência para os estudos deste portfólio."
    ],
    points: ["Migração de uma ferramenta de Excel/VBA para a web.", "Biblioteca, cálculos e preservação do histórico de planejamento.", "Separação entre demonstração pública e dados pessoais dos usuários."],
    note: "A miniatura é demonstrativa. Nenhum dado pessoal ou link de edição do aplicativo é publicado neste portfólio."
  },
  baterias: {
    category: "Projeto em desenvolvimento · BESS",
    title: "Baterias e tarifas horárias",
    short: "Proposta de um simulador exploratório para relacionar tarifas, custos e hipóteses de uso de baterias.",
    tags: ["Armazenamento", "Análise econômica", "Simulação"],
    paragraphs: [
      "O projeto parte de um estudo sobre tarifas horárias e as condições econômicas para sistemas de armazenamento de energia em baterias.",
      "A proposta é transformar a análise em uma ferramenta interativa com premissas visíveis e resultados reproduzíveis. Nesta etapa de escolha visual, o controle de tarifa é apenas uma demonstração da interface."
    ],
    points: ["Relacionar a tarifa de ponta à de fora de ponta.", "Explicitar hipóteses de custo, eficiência e utilização.", "Distinguir uma simulação exploratória de um estudo de viabilidade para uma instalação real."],
    note: "Em desenvolvimento. Os valores do controle são fictícios e não representam tarifas vigentes nem retorno de investimento."
  }
};

const root = document.documentElement;
const panel = document.querySelector("#portfolio");
const tabs = Array.from(document.querySelectorAll('[role="tab"]'));
const dialog = document.querySelector("#project-dialog");
const money = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const linkedin = "https://www.linkedin.com/in/caio-aguiar-01919a236/";
const github = "https://github.com/caioaguiarkdw";
let currentLayout = "essencial";
let demoRatio = 30;
let copyTimer;

function tags(id) {
  return '<div class="tags">' + projects[id].tags.map(function(tag) {
    return "<span>" + tag + "</span>";
  }).join("") + "</div>";
}

function visual(id) {
  if (id === "solar") {
    return '<div class="project-visual solar"><img src="./assets/images/tcc-curvas-iv.png" alt="Curvas corrente-tensão de módulos fotovoltaicos usadas na pesquisa" width="1600" height="772" loading="lazy"></div>';
  }
  if (id === "amara") {
    return '<div class="project-visual flow"><div class="mini-process" aria-label="Fluxo ilustrativo: demanda, sistema e indicadores"><div><small>01</small><b>Demanda</b></div><span aria-hidden="true">→</span><div><small>02</small><b>Sistema</b></div><span aria-hidden="true">→</span><div><small>03</small><b>Indicadores</b></div></div><span class="project-mini-status">Reconstrução ilustrativa</span></div>';
  }
  return '<div class="project-visual app"><div class="mini-diet" aria-label="Representação da interface do aplicativo de dieta"><header><b>Monte a sua dieta</b><span>DEMO</span></header><p>Planejamento alimentar.</p><div class="mini-macros" aria-hidden="true"><i></i><i></i><i></i></div><footer>Biblioteca · Cálculos · Histórico</footer></div></div>';
}

function projectButton(id, label, className) {
  return '<button type="button" class="' + (className || "text-link") + '" data-project="' + id + '" aria-label="Abrir resumo: ' + projects[id].title + '">' + (label || "Resumo do projeto") + ' <span aria-hidden="true">↗</span></button>';
}

function card(id) {
  const p = projects[id];
  return '<article class="project-card">' + visual(id) + '<div class="project-content"><span class="eyebrow">' + p.category + "</span><h3>" + p.title + "</h3><p>" + p.short + "</p>" + tags(id) + projectButton(id) + "</div></article>";
}

function navigation(className, simpleName) {
  const name = simpleName ? "Caio dos Reis Aguiar" : '<span class="monogram" aria-hidden="true">CA</span><span>Caio dos Reis Aguiar<small>Engenharia · Dados · Automação</small></span>';
  return '<header class="site-nav ' + (className || "") + '"><a class="site-wordmark" href="#apresentacao" data-scroll="apresentacao">' + name + '</a><nav aria-label="Portfólio"><a href="#projetos" data-scroll="projetos">Projetos</a><a href="#sobre" data-scroll="sobre">Sobre</a><a class="nav-contact" href="' + linkedin + '">LinkedIn <span aria-hidden="true">↗</span></a></nav></header>';
}

function about() {
  return '<section class="about-section" id="sobre"><div><p class="eyebrow">Sobre a trajetória</p><h2>Formação em energia.<br>Experiência entre áreas.</h2></div><div class="about-copy"><p>Formação em Engenharia de Energia na Universidade de Brasília, com um ano de mobilidade acadêmica em Engenharia Elétrica na UFBA. Vivência no Ministério de Minas e Energia e na cadeia eólica, com a equipe Wind da Amara NZero.</p><p>Interesse profissional na conexão entre energia, programação e análise de dados, com aplicações em processos, sistemas de negócio e operação.</p><div class="experience-line"><span>UnB / UFBA</span><span>Ministério de Minas e Energia</span><span>Amara NZero</span></div></div></section>';
}

function footer() {
  return '<footer class="site-footer" id="contato"><p>Caio dos Reis Aguiar · Portfólio em construção</p><div><a href="' + linkedin + '">LinkedIn ↗</a><a href="' + github + '">GitHub ↗</a></div></footer>';
}

function demo() {
  return '<div class="demo-box"><label for="demo-ratio">Fora de ponta custa <output id="demo-percent" for="demo-ratio">' + demoRatio + '%</output> da ponta</label><input id="demo-ratio" data-demo-range type="range" min="10" max="100" value="' + demoRatio + '" step="1" aria-describedby="demo-note"><div class="range-ends" aria-hidden="true"><span>10%</span><span>100%</span></div><div class="demo-numbers"><div><small>Ponta, valor hipotético</small><strong>R$ 1,50<span>/kWh</span></strong></div><div><small>Fora de ponta</small><strong><output id="demo-price">' + money.format(1.5 * demoRatio / 100) + '</output><span>/kWh</span></strong></div></div><small class="demo-note" id="demo-note">Demonstração com valores fictícios. A calculadora de viabilidade ainda será desenvolvida.</small></div>';
}

function bess(className) {
  return '<section class="bess-band ' + (className || "") + '" aria-label="Demonstração visual de tarifas"><div><span class="pill lime">Em desenvolvimento</span><h3>Baterias e tarifas horárias.</h3><p>Um estudo que está virando ferramenta. Experimente a relação de preços nesta prévia da interface.</p><div class="hero-actions">' + projectButton("baterias", "Conhecer a proposta") + "</div></div>" + demo() + "</section>";
}

function renderEssential() {
  return '<div class="design-page layout-essential"><div class="wrap">' + navigation() +
    '<section class="essential-hero" id="apresentacao"><div><p class="eyebrow with-dot"><span class="dot" aria-hidden="true"></span>Portfólio profissional</p><h1>Engenharia de energia.<br><span>Dados e automação.</span></h1><p class="hero-copy">Pesquisa em inteligência artificial aplicada à energia solar e experiência em integração de sistemas e melhoria de processos na cadeia eólica.</p><div class="hero-actions"><a class="button" href="#projetos" data-scroll="projetos">Conhecer os projetos <span aria-hidden="true">↓</span></a><a class="text-link" href="' + linkedin + '">Conversar no LinkedIn <span aria-hidden="true">↗</span></a></div></div><aside class="profile-card" aria-label="Apresentação profissional"><span class="monogram" aria-hidden="true">CA</span><h2 style="margin-top:22px">Caio dos Reis Aguiar</h2><p>Engenharia de Energia · UnB</p><div class="profile-facts"><div><span>Formação</span><b>UnB · Mobilidade na UFBA</b></div><div><span>Experiência</span><b>MME · Amara NZero</b></div><div><span>Interesses</span><b>Energia, dados e sistemas</b></div></div></aside></section>' +
    '<div class="field-strip"><span><i aria-hidden="true"></i>Energia e operação</span><span><i aria-hidden="true"></i>Programação e automação</span><span><i aria-hidden="true"></i>Pesquisa aplicada</span><span><i aria-hidden="true"></i>Processos e sistemas</span></div>' +
    '<section id="projetos"><div class="section-heading"><div><p class="eyebrow">Trabalhos selecionados</p><h2>Projetos e experiências.</h2></div><p>O problema, a abordagem e a participação em cada trabalho.</p></div><div class="project-grid">' + ["solar", "amara", "dieta"].map(card).join("") + "</div></section>" + bess() + about() + footer() + "</div></div>";
}

function renderEditorial() {
  const index = ["solar", "amara", "dieta", "baterias"].map(function(id, i) {
    return '<button type="button" class="index-entry" data-project="' + id + '"><span>0' + (i + 1) + "</span><b>" + (id === "solar" ? "IA e energia solar" : id === "amara" ? "Processos na cadeia eólica" : id === "dieta" ? "Aplicação pessoal" : "Armazenamento e tarifas") + '</b><span aria-hidden="true">↗</span></button>';
  }).join("");
  const others = ["amara", "dieta"].map(function(id, i) {
    const p = projects[id];
    return '<article class="editorial-project"><header><span class="eyebrow">0' + (i + 2) + '</span><span class="eyebrow">' + p.category + "</span></header><h3>" + p.title + "</h3><p>" + p.short + "</p>" + tags(id) + projectButton(id) + "</article>";
  }).join("");
  return '<div class="design-page layout-editorial"><div class="wrap">' + navigation("editorial-nav", true) +
    '<section class="editorial-hero" id="apresentacao"><div><p class="eyebrow">Caderno de projetos / Caio dos Reis Aguiar</p><h1>Um olhar de engenharia<br>sobre <span>energia e dados.</span></h1><p class="hero-copy">Projetos que aproximam o conhecimento do setor de energia da programação, da pesquisa e da organização de processos.</p><div class="hero-actions"><a class="text-link" href="#projetos" data-scroll="projetos">Explorar os trabalhos <span aria-hidden="true">↓</span></a></div></div><aside class="editorial-index" aria-label="Índice de projetos"><p class="eyebrow">Neste portfólio</p>' + index + "</aside></section>" +
    '<section id="projetos"><div class="section-heading"><p class="eyebrow">01 / Pesquisa aplicada</p><span class="pill">Engenharia de Energia · UnB</span></div><article class="editorial-feature"><figure class="editorial-figure" style="margin:0"><img src="./assets/images/tcc-curvas-iv.png" alt="Curvas corrente-tensão utilizadas no estudo de operação fotovoltaica" width="1600" height="772"><figcaption class="figure-caption">Curvas I–V · Figura do trabalho acadêmico</figcaption></figure><div class="editorial-feature-copy"><p class="eyebrow">Inteligência artificial e geração solar</p><h2>Classificar a operação<br>de módulos fotovoltaicos.</h2><p>A comparação de representações dos dados e modelos de aprendizado de máquina, tendo as curvas elétricas como ponto de partida.</p>' + tags("solar") + projectButton("solar", "Ler sobre a pesquisa") + '</div></article><div class="editorial-other">' + others + "</div></section>" + bess("editorial-bess") + about() + footer() + "</div></div>";
}

function renderTechnical() {
  const rows = ["solar", "amara", "dieta"].map(function(id, i) {
    const p = projects[id];
    return '<article class="technical-row"><span>0' + (i + 1) + "</span><div><h3>" + p.title + "</h3><p>" + p.short + "</p>" + tags(id) + '</div><button type="button" data-project="' + id + '" aria-label="Abrir resumo: ' + p.title + '">↗</button></article>';
  }).join("");
  return '<div class="design-page layout-technical"><div class="wrap technical-shell"><aside class="technical-sidebar"><span class="monogram" aria-hidden="true">CA</span><h2>Caio dos Reis<br>Aguiar</h2><p>Engenharia de Energia<br>Dados e sistemas</p><nav aria-label="Portfólio técnico"><a href="#projetos" data-scroll="projetos">Projetos <span aria-hidden="true">↗</span></a><a href="#sobre" data-scroll="sobre">Trajetória <span aria-hidden="true">↗</span></a><a href="' + linkedin + '">LinkedIn <span aria-hidden="true">↗</span></a></nav><p class="eyebrow sidebar-label">Ferramentas e linguagens</p><div class="tags"><span>Python</span><span>Excel/VBA</span><span>Odoo</span><span>Zendesk</span><span>Power Automate</span><span>MATLAB</span></div><div class="side-location">Formação na UnB<br>Mobilidade acadêmica na UFBA</div></aside><div class="technical-main"><div class="technical-topline"><p class="eyebrow">Portfólio técnico / trabalhos selecionados</p><span class="pill">Energia + sistemas + dados</span></div><section class="technical-hero" id="apresentacao"><h1>Pesquisa, modelos<br>e sistemas aplicados<br><span>à energia.</span></h1><p class="hero-copy">Da análise de curvas fotovoltaicas à integração de processos na cadeia eólica. Um registro dos problemas abordados e das soluções construídas.</p></section><section class="technical-system"><div><p class="eyebrow">Um exemplo de aplicação</p><h2 style="font-size:24px;margin:12px 0">Do comportamento físico<br>à classificação.</h2><p>O TCC aproxima sinais elétricos, processamento de dados e aprendizado de máquina para analisar a operação de módulos solares.</p></div><div class="system-flow"><div class="mini-process" aria-label="Fluxo da pesquisa"><div><small>ENTRADA</small><b>Curvas I–V</b></div><span aria-hidden="true">→</span><div><small>ANÁLISE</small><b>Modelos</b></div><span aria-hidden="true">→</span><div><small>SAÍDA</small><b>Condições</b></div></div></div></section><section class="technical-projects" id="projetos"><div class="section-heading"><div><p class="eyebrow">Aplicações e experiências</p><h2>Registro de projetos.</h2></div></div>' + rows + "</section>" + bess("technical-bess") + about() + footer() + "</div></div></div>";
}

function renderClassic() {
  const rows = ["solar", "amara", "dieta"].map(function(id) {
    const p = projects[id];
    return '<article class="classic-project-row">' + visual(id) + '<div><p class="eyebrow">' + p.category + "</p><h3>" + p.title + "</h3><p>" + p.short + "</p>" + tags(id) + '</div><button type="button" data-project="' + id + '" aria-label="Abrir resumo: ' + p.title + '">↗</button></article>';
  }).join("");
  return '<div class="design-page layout-classic"><div class="wrap">' + navigation("classic-nav") +
    '<section class="classic-hero" id="apresentacao"><div><p class="eyebrow">Portfólio profissional</p><h1>Caio dos Reis<br>Aguiar.</h1><p class="hero-copy">Engenharia de Energia, programação e análise de dados. Experiência no setor elétrico, na cadeia eólica e no desenvolvimento de soluções para processos.</p><div class="hero-actions"><a class="button" href="#projetos" data-scroll="projetos">Ver os trabalhos <span aria-hidden="true">↓</span></a><a class="text-link" href="' + linkedin + '">Entrar em contato <span aria-hidden="true">↗</span></a></div><div class="classic-signature"><div><strong>Formação</strong>UnB · Mobilidade na UFBA</div><div><strong>Atuação e interesses</strong>Energia · Dados · Sistemas</div></div></div><div class="classic-art" aria-hidden="true"><div class="art-initials">CA.</div><div class="art-caption">ENGENHARIA DE ENERGIA<br>PROGRAMAÇÃO E ANÁLISE DE DADOS<div class="art-palette"><span></span><span></span><span></span></div></div></div></section><section class="classic-projects" id="projetos"><div class="section-heading"><div><p class="eyebrow">Uma seleção do percurso</p><h2>Projetos e experiências.</h2></div><p>Pesquisa acadêmica, atuação profissional e desenvolvimento pessoal.</p></div>' + rows + "</section>" + bess("classic-bess") + about() + footer() + "</div></div>";
}

const renderers = { essencial: renderEssential, editorial: renderEditorial, tecnico: renderTechnical, classico: renderClassic };

function announce(text) {
  document.querySelector("#announcement").textContent = text;
}

function updateUrl(push) {
  const url = new URL(window.location.href);
  url.hash = currentLayout;
  if (root.dataset.theme === "escuro") url.searchParams.set("tema", "escuro");
  else url.searchParams.delete("tema");
  try {
    if (push) window.history.pushState(null, "", url);
    else window.history.replaceState(null, "", url);
  } catch {
    // Direct file previews can restrict History API changes.
  }
}

function setTheme(theme, syncUrl) {
  const dark = theme === "escuro";
  root.dataset.theme = dark ? "escuro" : "claro";
  const toggle = document.querySelector("#theme-toggle");
  toggle.setAttribute("aria-pressed", String(dark));
  toggle.setAttribute("aria-label", dark ? "Ativar tema claro" : "Ativar tema escuro");
  document.querySelector("#theme-label").textContent = dark ? "Claro" : "Escuro";
  document.querySelector('meta[name="theme-color"]').content = getComputedStyle(root).getPropertyValue("--bg").trim();
  if (syncUrl) updateUrl(false);
}

function renderLayout(key, pushUrl) {
  if (!Object.hasOwn(layouts, key)) key = "essencial";
  currentLayout = key;
  root.dataset.layout = key;
  panel.innerHTML = renderers[key]();
  panel.setAttribute("aria-labelledby", "tab-" + key);
  tabs.forEach(function(tab) {
    const active = tab.dataset.layout === key;
    tab.setAttribute("aria-selected", String(active));
    tab.tabIndex = active ? 0 : -1;
  });
  document.querySelector("#design-description").textContent = layouts[key].description;
  document.title = "Caio Aguiar | " + layouts[key].name + " · Portfólio";
  const slider = panel.querySelector("[data-demo-range]");
  slider.setAttribute("aria-valuetext", demoRatio + "% da tarifa de ponta");
  setTheme(root.dataset.theme, false);
  if (pushUrl) updateUrl(true);
  announce("Opção " + layouts[key].name + ", tema " + root.dataset.theme + ".");
}

function openProject(id) {
  if (!Object.hasOwn(projects, id)) return;
  const p = projects[id];
  document.querySelector("#dialog-category").textContent = p.category;
  document.querySelector("#dialog-title").textContent = p.title;
  const figures = id === "solar" ? '<figure class="dialog-copy dialog-figure" style="margin:23px 0"><img src="./assets/images/tcc-cubo-configuracoes.png" alt="Organização das configurações dos dados e dos modelos comparados no TCC" width="1600" height="864"><figcaption class="demo-note">Figura do trabalho acadêmico: configurações de dados e famílias de modelos.</figcaption></figure>' : "";
  document.querySelector("#dialog-body").innerHTML = '<div class="dialog-copy">' + p.paragraphs.map(function(text) { return "<p>" + text + "</p>"; }).join('<br>') + "<ul>" + p.points.map(function(point) { return "<li>" + point + "</li>"; }).join("") + "</ul></div>" + figures + tags(id) + '<p class="demo-note">' + p.note + "</p>";
  if (!dialog.open) dialog.showModal();
}

document.addEventListener("click", function(event) {
  const tab = event.target.closest('[role="tab"][data-layout]');
  if (tab) {
    renderLayout(tab.dataset.layout, true);
    window.scrollTo(0, 0);
    return;
  }
  const project = event.target.closest("[data-project]");
  if (project) {
    openProject(project.dataset.project);
    return;
  }
  const scrollLink = event.target.closest("[data-scroll]");
  if (scrollLink) {
    event.preventDefault();
    const target = document.getElementById(scrollLink.dataset.scroll);
    if (target) target.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  }
});

document.querySelector(".design-tabs").addEventListener("keydown", function(event) {
  const keys = ["ArrowLeft", "ArrowRight", "Home", "End"];
  if (!keys.includes(event.key)) return;
  const current = tabs.indexOf(document.activeElement);
  if (current < 0) return;
  event.preventDefault();
  const next = event.key === "Home" ? 0 : event.key === "End" ? tabs.length - 1 : (current + (event.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length;
  tabs[next].focus();
  tabs[next].click();
});

document.addEventListener("input", function(event) {
  if (!event.target.matches("[data-demo-range]")) return;
  demoRatio = Number(event.target.value);
  document.querySelector("#demo-percent").textContent = demoRatio + "%";
  document.querySelector("#demo-price").textContent = money.format(1.5 * demoRatio / 100);
  event.target.setAttribute("aria-valuetext", demoRatio + "% da tarifa de ponta");
});

document.querySelector("#theme-toggle").addEventListener("click", function() {
  setTheme(root.dataset.theme === "escuro" ? "claro" : "escuro", true);
  announce("Tema " + root.dataset.theme + " ativado para a opção " + layouts[currentLayout].name + ".");
});

document.querySelector(".close-dialog").addEventListener("click", function() { dialog.close(); });
dialog.addEventListener("click", function(event) {
  if (event.target !== dialog) return;
  const rect = dialog.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
});

document.querySelector("#copy-option").addEventListener("click", async function() {
  const button = this;
  try {
    await navigator.clipboard.writeText(window.location.href);
    button.textContent = "Link copiado";
    announce("Link da opção e do tema copiado.");
  } catch {
    button.textContent = "Copie o endereço da barra do navegador";
    announce("Copie o endereço da barra do navegador para compartilhar esta opção.");
  }
  window.clearTimeout(copyTimer);
  copyTimer = window.setTimeout(function() { button.textContent = "Copiar link desta opção ↗"; }, 2800);
});

function applyLocation() {
  const key = window.location.hash.slice(1);
  const theme = new URL(window.location.href).searchParams.get("tema");
  setTheme(theme === "escuro" ? "escuro" : "claro", false);
  renderLayout(Object.hasOwn(layouts, key) ? key : "essencial", false);
}

window.addEventListener("popstate", applyLocation);
window.addEventListener("hashchange", applyLocation);
applyLocation();
