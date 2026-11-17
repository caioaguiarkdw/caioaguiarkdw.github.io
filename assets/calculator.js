"use strict";
(() => {
  if (!document.querySelector("#calculator")) return;
  const $ = q => document.querySelector(q);
  const { fields, defaults, scenarios, calculate } = BESS;
  const br = (x, digits = 2) => x.toLocaleString("pt-BR", { minimumFractionDigits: digits, maximumFractionDigits: digits });
  const money = x => `R$ ${br(x)}`;
  const years = x => x === null ? "Não ocorre" : `${br(x)} anos`;
  let result = null;
  const hints = {
    capacity: "Energia útil entregue em corrente alternada. Não é a capacidade nominal das células.",
    daily: "Limitada à capacidade útil disponível em cada ano. Pressupõe consumo suficiente na ponta.",
    efficiency: "Perdas completas entre energia comprada para carregar e energia entregue ao consumo.",
    years: "Horizonte de análise. Não representa uma garantia contratual.",
    degradation: "Reduz a capacidade disponível a partir do segundo ano.",
    maintenance: "Custo anual constante em reais, inclusive em anos sem operação.",
    discount: "Taxa real anual. Sem inflação adicional ou reajuste oculto."
  };
  Object.entries(fields).forEach(([key, f], i) => {
    const host = $(i < 8 ? "#essential-fields" : "#advanced-fields");
    const element = document.createElement("div"); element.className = "field";
    element.innerHTML = `<label for="${key}">${f.label}</label><div class="input-unit"><input id="${key}" name="${key}" type="number" min="${f.min}" max="${f.max}" step="${f.integer ? 1 : 'any'}" value="${f.value}" ${hints[key] ? `aria-describedby="help-${key}"` : ''}><span>${f.unit}</span></div><label class="sr-only" for="range-${key}">Ajustar ${f.label}</label><input class="field-range" id="range-${key}" type="range" min="${f.min}" max="${f.max}" step="${f.integer ? 1 : 'any'}" value="${f.value}">${hints[key] ? `<small class="help" id="help-${key}">${hints[key]}</small>` : ''}`;
    host.append(element);
    $(`#${key}`).addEventListener("input", () => { $("#scenario").value = "custom"; if ($(`#${key}`).value !== "") $(`#range-${key}`).value = $(`#${key}`).value; render(); });
    $(`#range-${key}`).addEventListener("input", () => { $(`#${key}`).value = $(`#range-${key}`).value; $("#scenario").value = "custom"; render(); });
  });
  scenarios.forEach((scenario, i) => { const option = document.createElement("option"); option.value = i; option.textContent = scenario.name; $("#scenario").append(option); });
  function read() { return Object.fromEntries(Object.keys(fields).map(k => [k, $(`#${k}`).value.trim() === "" ? NaN : Number($(`#${k}`).value)])); }
  function populate(params) { Object.keys(fields).forEach(k => { $(`#${k}`).value = params[k]; $(`#range-${k}`).value = params[k]; }); }
  function preset(i) { populate({ ...defaults, offpeak: scenarios[i].offpeak, peak: scenarios[i].peak }); $("#scenario").value = i; render(); }
  $("#scenario").addEventListener("change", e => { if (e.target.value !== "custom") preset(+e.target.value); });
  $("#bess-form").addEventListener("submit", e => e.preventDefault());
  function ratioInput(source) {
    const raw = source.value, ratio = Number(raw), peak = Number($("#peak").value);
    if (!raw.trim() || !Number.isFinite(ratio) || ratio < 0 || ratio > 200000000 || !Number.isFinite(peak) || peak <= 0) {
      invalidate(["Informe uma relação não negativa e uma tarifa de ponta positiva, dentro dos limites dos preços."]); return;
    }
    $("#offpeak").value = Number((peak * ratio / 100).toPrecision(12));
    $("#range-offpeak").value = $("#offpeak").value;
    $("#scenario").value = "custom";
    render();
  }
  $("#ratio-number").addEventListener("input", e => ratioInput(e.target));
  $("#ratio-range").addEventListener("input", e => ratioInput(e.target));
  function invalidate(errors) {
    result = null;
    $("#form-error").hidden = false; $("#form-error").textContent = errors.join(" ");
    $("#calculator-results").innerHTML = '<p class="result-interpretation">Ajuste as entradas indicadas para calcular. Resultados anteriores foram removidos para evitar uma leitura com premissas inválidas.</p>';
  }
  function chart(rows) {
    const width = 620, height = 290, left = 80, top = 25, right = 25, bottom = 45;
    const values = rows.flatMap(r => [r.cumulative, r.discounted]).concat([0]);
    const min = Math.min(...values), max = Math.max(...values), span = max - min || 1;
    const x = year => left + year / (rows.length - 1) * (width - left - right);
    const y = value => top + (max - value) / span * (height - top - bottom);
    let ticks = '';
    for (let i = 0; i <= 4; i++) { const value = min + span * i / 4; ticks += `<line x1="${left}" y1="${y(value)}" x2="${width-right}" y2="${y(value)}" class="chart-grid"/><text x="${left-9}" y="${y(value)+4}" text-anchor="end">${br(value/1000,1)}</text>`; }
    const indices = [...new Set([0, Math.round((rows.length-1)/2), rows.length-1])];
    ticks += indices.map(i => `<text x="${x(i)}" y="${height-17}" text-anchor="middle">${i}</text>`).join('');
    const points = key => rows.map(r => `${x(r.year)},${y(r[key])}`).join(' ');
    return `<div class="cash-chart" tabindex="0" role="region" aria-label="Gráfico do fluxo de caixa, com rolagem horizontal em telas pequenas"><svg viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="chart-title chart-description"><title id="chart-title">Fluxo acumulado durante a vida útil</title><desc id="chart-description">Valores em milhares de reais. Linha contínua para saldo acumulado, tracejada para saldo descontado. Linha horizontal de equilíbrio em zero. Os dados completos estão na tabela abaixo.</desc>${ticks}<text x="${left}" y="14">R$ mil</text><text x="${width-right}" y="${height-1}" text-anchor="end">Ano</text><line x1="${left}" y1="${y(0)}" x2="${width-right}" y2="${y(0)}" class="chart-zero"/><polyline points="${points('cumulative')}" class="chart-line"/><polyline points="${points('discounted')}" class="chart-discounted"/></svg></div><div class="chart-legend"><span><i class="legend-line"></i>Acumulado</span><span><i class="legend-line discounted"></i>Descontado</span></div><p class="help">A linha de zero marca o equilíbrio. O gráfico termina na vida útil informada. Em telas pequenas, deslize o gráfico ou consulte a tabela.</p>`;
  }
  function summary() {
    if (!result) return '';
    return ['Calculadora exploratória BESS | Caio Aguiar', ...Object.entries(fields).map(([k,f]) => `${f.label}: ${br(result.params[k], k==='peak'||k==='offpeak'?5:2)} ${f.unit}`), `Fora de ponta / ponta: ${br(result.ratio,3)}%`, `Margem: ${money(result.margin)} / kWh útil`, `Fluxo operacional no ano 1: ${money(result.firstYear)}`, `Retorno simples de referência: ${years(result.simplePayback)}`, `Primeira recuperação modelada: ${years(result.recovery)}`, `Recuperação descontada: ${years(result.discountedRecovery)}`, `Saldo final: ${money(result.cumulative)}`, `VPL: ${money(result.npv)}`, 'Valores reais constantes. Arbitragem para consumo próprio. Exclui efeitos adicionais da fatura. Não é cotação ou garantia de retorno.'].join('\n');
  }
  async function copy(text, success) {
    try { await navigator.clipboard.writeText(text); $("#announcement").textContent = success; $("#copy-status").textContent = success; }
    catch (_) { $("#copy-fallback").hidden = false; $("#copy-text").value = text; $("#copy-text").focus(); $("#copy-text").select(); $("#copy-status").textContent = "Cópia automática indisponível. Selecione e copie o texto abaixo."; }
  }
  function csv() {
    if (!result) return '';
    const lines = [['Premissa','Valor','Unidade'], ...Object.entries(fields).map(([k,f]) => [f.label, result.params[k], f.unit]), [], ['Indicador','Valor'], ['Margem por kWh útil',result.margin], ['Fluxo ano 1',result.firstYear], ['Retorno simples (anos)',result.simplePayback ?? 'Não ocorre'], ['Primeira recuperação (anos)',result.recovery ?? 'Não ocorre'], ['Recuperação descontada (anos)',result.discountedRecovery ?? 'Não ocorre'], ['Saldo final',result.cumulative], ['VPL',result.npv], [], ['Ano','Capacidade útil kWh','Energia diária kWh','Economia bruta R$','Fluxo líquido R$','Fluxo descontado R$','Acumulado R$','Acumulado descontado R$'], ...result.rows.map(r=>[r.year,r.capacity,r.energy,r.gross,r.net,r.discountedNet,r.cumulative,r.discounted])];
    return '\uFEFF'+lines.map(row => row.map(v => `"${String(v).replaceAll('"','""')}"`).join(';')).join('\r\n');
  }
  function render() {
    const current = calculate(read());
    if (!current.valid) { invalidate(current.errors); return; }
    result = current;
    $("#form-error").hidden = true;
    $("#ratio-label").textContent = br(result.ratio,3);
    if (document.activeElement !== $("#ratio-number")) $("#ratio-number").value = Number(result.ratio.toFixed(6));
    $("#ratio-range").max = Math.max(200, Math.ceil(result.ratio));
    $("#ratio-range").step = "any";
    $("#ratio-range").value = $("#ratio-number").value;
    const p = result.params;
    const interpretation = result.margin <= 0 ? 'A diferença de tarifas não cobre as perdas do ciclo. Operar não gera margem energética positiva.' : result.firstYear <= 0 ? 'O fluxo operacional do primeiro ano não é positivo. Confira uso e custos anuais.' : result.recovery === null ? `O investimento não é recuperado nos ${p.years} anos modelados.` : `O fluxo acumulado cruza zero pela primeira vez em aproximadamente ${br(result.recovery)} anos.${result.cumulative < 0 ? ' O saldo volta a ficar negativo antes do fim do horizonte.' : ''} A fração do ano é uma aproximação linear.`;
    const rows = result.rows.map(r=>`<tr><th scope="row">${r.year}</th><td>${br(r.energy)}</td><td>${money(r.net)}</td><td>${money(r.cumulative)}</td><td>${money(r.discounted)}</td></tr>`).join('');
    $("#calculator-results").innerHTML = `<p class="eyebrow">Resultado do cenário</p><p class="price-summary">Ponta <strong>${br(p.peak,5)} R$/kWh</strong><br>Fora de ponta <strong>${br(p.offpeak,5)} R$/kWh</strong></p><div class="result-cards"><div class="result-card"><small>Fluxo operacional / primeiro ano</small><strong id="result-annual">${money(result.firstYear)}</strong></div><div class="result-card"><small>Retorno simples / ano 1 constante</small><strong id="result-simple">${years(result.simplePayback)}</strong></div><div class="result-card"><small>Primeira recuperação modelada</small><strong id="result-recovery">${years(result.recovery)}</strong></div><div class="result-card"><small>Valor presente líquido (VPL)</small><strong id="result-npv">${money(result.npv)}</strong></div></div><p class="result-interpretation">${interpretation}</p><p class="help">Energia deslocada no primeiro ano: <strong>${br(result.initialEnergy)} kWh/dia</strong>. Recarga: ${br(result.recharge)} kWh/dia. Margem: ${br(result.margin,4)} R$/kWh útil. ${p.daily > p.capacity ? 'O consumo informado foi limitado pela capacidade útil.' : ''}</p><dl class="result-detail"><dt>Recuperação descontada</dt><dd>${years(result.discountedRecovery)}</dd><dt>Saldo acumulado no fim da vida útil</dt><dd>${money(result.cumulative)}</dd></dl>${chart(result.rows)}<p class="help">Simulação da parcela energética. Não representa a fatura completa nem uma garantia de retorno. Garantia do equipamento e vida útil são conceitos distintos.</p><details><summary>Tabela dos fluxos anuais</summary><div class="table-scroll" tabindex="0" role="region" aria-label="Fluxos anuais"><table><caption>Energia útil diária e fluxos em reais constantes</caption><thead><tr><th scope="col">Ano</th><th scope="col">kWh/dia</th><th scope="col">Fluxo líquido</th><th scope="col">Acumulado</th><th scope="col">Acumulado descontado</th></tr></thead><tbody>${rows}</tbody></table></div></details><div class="calculator-actions"><button class="button small" id="copy-result">Copiar resumo</button><button class="button small" id="export-csv">Exportar CSV</button><button class="button small" id="share-result">Copiar link do cenário</button><button class="button small" id="reset-calc">Restaurar referência</button></div><p id="copy-status" role="status" class="help"></p><div id="copy-fallback" hidden><label for="copy-text">Texto para copiar</label><textarea id="copy-text" rows="7" readonly></textarea></div>`;
    $("#copy-result").addEventListener("click", () => copy(summary(), "Resumo copiado."));
    $("#share-result").addEventListener("click", () => { const url = new URL(location.href); url.search = ''; url.hash = 'calculadora'; Object.keys(fields).forEach(k => url.searchParams.set(k, result.params[k])); copy(url.href, "Link do cenário copiado."); });
    $("#export-csv").addEventListener("click", () => { const blob = new Blob([csv()],{type:'text/csv;charset=utf-8'}); const url = URL.createObjectURL(blob), a = document.createElement('a'); a.href = url; a.download = 'cenario-bess.csv'; a.click(); setTimeout(()=>URL.revokeObjectURL(url),1000); $("#copy-status").textContent = 'CSV exportado com premissas e resultados.'; });
    $("#reset-calc").addEventListener("click", () => { preset(0); $("#scenario").focus(); });
  }
  const query = new URLSearchParams(location.search), shared = { ...defaults };
  let hasShared = false;
  Object.keys(fields).forEach(k => { if (query.has(k)) { hasShared = true; shared[k] = query.get(k).trim() === '' ? NaN : Number(query.get(k)); } });
  if (hasShared) { populate(shared); $("#scenario").value = 'custom'; render(); }
  else preset(0);
})();
