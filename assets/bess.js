/* Modelo público de arbitragem. Valores monetários reais, fluxos ao fim do ano. */
"use strict";
(() => {
  const fields = {
    investment: { label: "Investimento instalado", unit: "R$", min: 1, max: 1000000, step: 100, value: 20000 },
    capacity: { label: "Capacidade útil entregue em CA", unit: "kWh", min: 0, max: 500, step: 0.1, value: 8 },
    daily: { label: "Consumo diário a substituir na ponta", unit: "kWh", min: 0, max: 500, step: 0.1, value: 8 },
    peak: { label: "Tarifa de ponta", unit: "R$/kWh", min: 0.00001, max: 20, step: 0.00001, value: 2.47 },
    offpeak: { label: "Tarifa fora de ponta", unit: "R$/kWh", min: 0, max: 20, step: 0.00001, value: 0.38 },
    efficiency: { label: "Eficiência do ciclo completo", unit: "%", min: 1, max: 100, step: 0.1, value: 90 },
    days: { label: "Dias de uso por ano", unit: "dias", min: 0, max: 365, step: 1, value: 252, integer: true },
    years: { label: "Vida útil modelada", unit: "anos", min: 1, max: 40, step: 1, value: 15, integer: true },
    degradation: { label: "Degradação anual da capacidade", unit: "%", min: 0, max: 100, step: 0.1, value: 0 },
    maintenance: { label: "Operação e manutenção anual", unit: "R$", min: 0, max: 100000, step: 10, value: 0 },
    discount: { label: "Taxa real de desconto", unit: "%", min: 0, max: 100, step: 0.1, value: 0 }
  };
  const defaults = Object.fromEntries(Object.entries(fields).map(([k, v]) => [k, v.value]));
  const scenarios = [
    { name: "Tocantins • histórico Energisa", offpeak: 0.38, peak: 2.47 },
    { name: "Sul-Sudeste • histórico Energisa", offpeak: 0.37, peak: 1.90 },
    { name: "Paraíba • histórico Energisa", offpeak: 0.30, peak: 1.44 },
    { name: "Copel • tabela após julho/2026", offpeak: 0.60506, peak: 1.24628 }
  ];
  function validate(input) {
    return Object.entries(fields).flatMap(([key, f]) => {
      const x = input[key];
      return typeof x !== "number" || !Number.isFinite(x) || x < f.min || x > f.max || (f.integer && !Number.isInteger(x))
        ? [`${f.label}: informe ${f.integer ? "um inteiro" : "um número"} entre ${f.min} e ${f.max} ${f.unit}.`] : [];
    });
  }
  function calculate(input) {
    const errors = validate(input);
    if (errors.length) return { valid: false, errors };
    const p = { ...input }, eta = p.efficiency / 100;
    const margin = p.peak - p.offpeak / eta;
    const initialEnergy = Math.min(p.capacity, p.daily);
    let cumulative = -p.investment, discounted = -p.investment, recovery = null, discountedRecovery = null;
    const rows = [{ year: 0, capacity: p.capacity, energy: 0, gross: 0, net: -p.investment, discountedNet: -p.investment, cumulative, discounted }];
    for (let year = 1; year <= p.years; year++) {
      const capacity = p.capacity * (1 - p.degradation / 100) ** (year - 1);
      const energy = Math.min(p.daily, capacity);
      const gross = energy * p.days * margin;
      const net = gross - p.maintenance;
      const discountedNet = net / (1 + p.discount / 100) ** year;
      if (recovery === null && cumulative < 0 && cumulative + net >= 0) recovery = year - 1 + (-cumulative / net);
      if (discountedRecovery === null && discounted < 0 && discounted + discountedNet >= 0) discountedRecovery = year - 1 + (-discounted / discountedNet);
      cumulative += net;
      discounted += discountedNet;
      rows.push({ year, capacity, energy, gross, net, discountedNet, cumulative, discounted });
    }
    const firstYear = rows[1].net;
    return { valid: true, params: p, margin, initialEnergy, recharge: initialEnergy / eta, ratio: p.offpeak / p.peak * 100,
      firstYear, simplePayback: firstYear > 0 ? p.investment / firstYear : null,
      recovery, discountedRecovery, npv: discounted, cumulative, rows };
  }
  globalThis.BESS = Object.freeze({ fields, defaults, scenarios, validate, calculate });
})();
