"use strict";
(() => {
  const $ = (q, root = document) => root.querySelector(q);
  const $$ = (q, root = document) => [...root.querySelectorAll(q)];
  const announce = text => { $("#announcement").textContent = text; };
  function themeState() {
    const light = document.documentElement.dataset.theme === "claro";
    $$("[data-theme-toggle]").forEach(b => { b.setAttribute("aria-label", `Ativar tema ${light ? "escuro" : "claro"}`); b.setAttribute("aria-pressed", String(light)); b.querySelector("span").textContent = light ? "Tema escuro" : "Tema claro"; });
    $('meta[name="theme-color"]').content = light ? "#f1f5f3" : "#111410";
  }
  $$("[data-theme-toggle]").forEach(b => b.addEventListener("click", () => {
    const next = document.documentElement.dataset.theme === "claro" ? "escuro" : "claro";
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem("caio-portfolio-theme", next); } catch (_) {}
    themeState();
  }));
  themeState();
  const sidebar = $(".sidebar"), menu = $("#menu-toggle"), media = matchMedia("(max-width: 800px)");
  function menuState(open, focus = true) {
    document.body.classList.toggle("nav-open", open);
    sidebar.inert = media.matches && !open;
    menu.setAttribute("aria-expanded", String(open));
    if (focus) (open ? $("a", sidebar) : menu).focus();
  }
  menu.addEventListener("click", () => menuState(!document.body.classList.contains("nav-open")));
  $(".nav-scrim").addEventListener("click", () => menuState(false));
  $$("a", sidebar).forEach(a => a.addEventListener("click", () => { if (media.matches) menuState(false); }));
  media.addEventListener("change", () => menuState(false, false));
  menuState(false, false);
  document.addEventListener("keydown", e => {
    if (!document.body.classList.contains("nav-open")) return;
    if (e.key === "Escape") menuState(false);
    if (e.key === "Tab") {
      const nodes = $$('a, button', sidebar), first = nodes[0], last = nodes.at(-1);
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
  $("#nav-close").addEventListener("click", () => menuState(false));
  $$("[data-figure]").forEach(button => button.addEventListener("click", () => {
    $$("[data-figure]").forEach(b => b.setAttribute("aria-pressed", String(b === button)));
    $$("[data-figure-panel]").forEach(p => { p.hidden = p.dataset.figurePanel !== button.dataset.figure; });
  }));
  const dialog = $("#image-dialog");
  if (dialog) {
    $$("[data-zoom]").forEach(b => b.addEventListener("click", () => {
      const source = $("img", b.closest("figure"));
      $("img", dialog).src = source.src; $("img", dialog).alt = source.alt;
      $("#image-title").textContent = b.dataset.zoom;
      dialog.showModal();
    }));
    $("button", dialog).addEventListener("click", () => dialog.close());
  }
  const stages = [
    ["Demanda", "Registrar o contexto antes de buscar preços.", "Referência", "DEMO-001", "Necessidade", "Conjunto de manutenção fictício"],
    ["Itens", "Transformar a necessidade em itens comparáveis, com quantidade e especificação.", "Item ilustrativo", "Componente A", "Quantidade", "4 unidades"],
    ["Cotação", "Relacionar as respostas aos mesmos itens para preservar a comparação.", "Fornecedor fictício", "Fornecedor Alfa", "Resposta ilustrativa", "4 unidades • prazo de 12 dias"],
    ["Consolidação", "Comparar condições e manter a origem da informação visível para a equipe.", "Critério ilustrativo", "Especificação e prazo", "Situação", "Pronto para análise"],
    ["Pedido", "Levar a decisão ao pedido mantendo o vínculo com a demanda e os itens.", "Pedido fictício", "PED-DEMO-001", "Rastreabilidade", "Demanda → itens → cotação → pedido"]
  ];
  function stage(index) {
    const row = stages[index], target = $("#process-stage");
    $$("[data-stage]").forEach(b => b.setAttribute("aria-pressed", String(+b.dataset.stage === index)));
    target.innerHTML = `<h3>${row[0]}</h3><p>${row[1]}</p><div class="fake-record"><div><small>${row[2]}</small><strong>${row[3]}</strong></div><div><small>${row[4]}</small><strong>${row[5]}</strong></div></div>`;
  }
  $$("[data-stage]").forEach(b => b.addEventListener("click", () => stage(+b.dataset.stage)));
  if ($("#process-stage")) { stage(0); $("#process-reset").addEventListener("click", () => stage(0)); }
  const diet = $("#diet-demo");
  if (diet) {
    const items = [{ kcal: 120, protein: 5, carbs: 20, fat: 2.2 }, { kcal: 180, protein: 20, carbs: 10, fat: 6.7 }, { kcal: 80, protein: 2, carbs: 14, fat: 1.8 }];
    const fmt = x => x.toLocaleString("pt-BR", { maximumFractionDigits: 1 });
    let snapshot = null;
    function update() {
      const totals = { kcal: 0, protein: 0, carbs: 0, fat: 0 };
      $$("input", diet).forEach((input, i) => { $("output", input.closest(".demo-control")).textContent = `${input.value} g`; Object.keys(totals).forEach(k => { totals[k] += items[i][k] * +input.value / 100; }); });
      Object.keys(totals).forEach(k => { $(`[data-nutrient="${k}"]`).textContent = fmt(totals[k]); });
      return totals;
    }
    $$("input", diet).forEach(i => i.addEventListener("input", update));
    $("#diet-save").addEventListener("click", () => { snapshot = { ...update() }; $("#diet-history").textContent = `Registro fictício salvo nesta visita: ${fmt(snapshot.kcal)} kcal. Alterações posteriores não mudam este registro.`; announce("Registro fictício salvo em memória."); });
    $("#diet-reset").addEventListener("click", () => { $$("input", diet).forEach(i => { i.value = 100; }); snapshot = null; $("#diet-history").textContent = "Nenhum registro salvo nesta visita."; update(); });
    update();
  }
})();
