# Caio dos Reis Aguiar · Portfólio

Portfólio estático de energia, dados, programação e processos. A versão da branch `portfolio-final` reúne a página inicial e quatro estudos de caso. A promoção para o site principal depende da aprovação de Caio. A galeria anterior permanece no histórico Git, no commit `69e7017`, e na branch publicada enquanto a proposta é avaliada.

## Abrir a prévia

No Windows, abra **Abrir-previa.cmd**. O iniciador usa o Python disponível, abre o navegador e mantém uma janela com o servidor local. Feche essa janela ou pressione Ctrl+C para encerrar. O endereço preferencial é `http://127.0.0.1:8765/`. Se a porta estiver ocupada, o iniciador escolhe outra e abre o endereço correto. O servidor escuta somente neste computador.

Alternativamente, na raiz do repositório:

```text
python -X utf8 tools/preview.py
```

Não é necessário Node, npm ou instalar dependências para abrir o site. Use o servidor local, pois links para diretórios não funcionam da mesma forma ao abrir arquivos HTML diretamente.

## Páginas e arquivos editáveis

| Conteúdo | Local |
| --- | --- |
| Início | `index.html` |
| TCC de IA e fotovoltaica | `projetos/tcc/index.html` |
| Processos e Odoo / Amara | `projetos/odoo/index.html` |
| Artigo e calculadora BESS | `projetos/baterias/index.html` |
| Aplicativo de dieta | `projetos/dieta/index.html` |
| Fonte editorial e estrutura comum das páginas | `tools/build.py` |
| Texto autoral do artigo, sem dados do formulário | `content/artigo.md` |
| Identidade visual e responsividade | `assets/site.css` |
| Tema inicial | `assets/theme.js` |
| Navegação e demonstrações | `assets/site.js` |
| Modelo econômico puro e cenários históricos | `assets/bess.js` |
| Controles, gráfico, CSV e compartilhamento | `assets/calculator.js` |

Edite a fonte editorial em `tools/build.py` e o artigo em `content/artigo.md`. Gere os HTMLs com `python -X utf8 tools/build.py` e revise o diff. Os arquivos HTML gerados são versionados: o GitHub Pages apenas os serve, sem executar Python. Não edite só o HTML gerado, pois uma geração posterior sobrescreveria essa alteração.

O site funciona em sua raiz e em uma subpasta de prévia. As rotas possuem arquivos `index.html`, permitindo abertura direta e recarga sem fallback de aplicação. As fontes são locais. O site não depende de APIs, analytics ou cadastro.

## Calculadora e manutenção

A metodologia, os limites e a verificação estão em [METODOLOGIA-E-TESTES.md](METODOLOGIA-E-TESTES.md). Os cenários são históricos e não constituem ofertas tarifárias atuais ou recomendações de investimento.

Para atualizar uma referência: confirme a fonte primária, a edição, a composição dos preços e a data. Atualize o cenário em `assets/bess.js`, a referência no artigo quando pertinente, a tabela de `tools/build.py` e os valores de regressão em `tests/model-tests.js`. Recalcule de forma independente antes de ajustar a expectativa de teste. Evite comparar preços com bases tributárias diferentes como se fossem equivalentes.

## Verificações

`tests/interface.html` executa os testes puros do modelo no navegador. `tests/test_site.py` executa verificações de layout, navegação e interação com Playwright Python e um navegador Chromium já instalado. O script não instala ferramentas:

```text
python -X utf8 tests/test_site.py --browser "EXECUTAVEL_DO_NAVEGADOR" --artifacts "../qa-portfolio"
```

Os artefatos devem ficar fora do repositório. As capturas de QA, o relatório detalhado, a matriz de evidências e os documentos de preparação ficaram privados. O resultado executado e os limites estão documentados em [METODOLOGIA-E-TESTES.md](METODOLOGIA-E-TESTES.md).

## Publicar depois da aprovação

A proposta foi preparada em `portfolio-final`, sem substituir `main`. Não há duas árvores editoriais independentes para manter. Depois de aprovada, revise o diff entre as branches e integre a versão aprovada à `main`. O Pages existente está configurado para servir a raiz da `main`.

Antes de enviar, confira `git status`, autoria, diff e arquivos selecionados. Adicione explicitamente apenas os arquivos públicos revisados. Preserve a autoria já configurada e o e-mail noreply. Não use adição indiscriminada da pasta de planejamento.

Se for necessária uma prévia pública antes da promoção, sirva uma cópia dos arquivos estáticos sob uma subpasta, gerada da mesma revisão. Após a promoção, remova essa cópia para evitar divergência. Atualize a URL absoluta da imagem Open Graph caso a prévia pública precise de uma imagem própria antes da promoção.

Após a publicação autorizada, confira a execução do Pages e abra as cinco rotas no endereço público. A validação local não substitui a confirmação desse deploy.

## Conteúdo publicável

Este repositório contém a apresentação sanitizada, o artigo autoral, figuras selecionadas do TCC, fontes com licenças, código novo das demonstrações, cálculos, testes e documentação. Não contém código corporativo, registros do aplicativo real, credenciais, links de edição com chave, extratos privados ou o PDF acadêmico completo.

As demonstrações Odoo e dieta usam informações fictícias e são independentes dos sistemas reais. O caso do aplicativo reconhece desenvolvimento assistido por IA. [Fontes e direitos dos ativos](assets/FONTES-E-REFERENCIAS.md).
