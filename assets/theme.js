/* Executado antes do CSS para evitar clarão na primeira pintura. */
try {
  if (localStorage.getItem("caio-portfolio-theme") === "claro") document.documentElement.dataset.theme = "claro";
} catch (_) { /* A preferência é opcional quando o armazenamento está bloqueado. */ }
document.documentElement.classList.add("js");
