# Caio dos Reis Aguiar | Portfolio

Galeria de quatro propostas visuais para o portfolio pessoal, cada uma com tema claro e escuro. Conteudo publico, sem dados internos de empresas ou dados de usuarios dos projetos. As propostas ainda dependem de escolha e revisao por Caio.

- Site: https://caioaguiarkdw.github.io/
- Repositorio: https://github.com/caioaguiarkdw/caioaguiarkdw.github.io
- Configuracao de publicacao: https://github.com/caioaguiarkdw/caioaguiarkdw.github.io/settings/pages
- Historico de publicacao: https://github.com/caioaguiarkdw/caioaguiarkdw.github.io/actions

## Arquivos

- `index.html`: conteudo e estrutura da pagina.
- `styles.css`: cores, tipografia, layout e versao mobile.
- `script.js`: pequena demonstracao interativa com valores ficticios.
- `.nojekyll`: publica os arquivos estaticos sem processamento Jekyll.

## Como trabalhar

O codigo e editado e testado localmente. As alteracoes sao registradas em commits e enviadas com `git push`. O GitHub Pages publica o conteudo da raiz da branch `main`.

Para visualizar localmente, abra `index.html` no navegador. Nenhuma instalacao ou compilacao e necessaria.

Exemplo de atualizacao, apos revisar os arquivos:

```powershell
git status
git add -- index.html styles.css script.js README.md
git diff --cached
git commit -m "Atualiza pagina do portfolio"
git push origin main
```

Nunca colocar senhas, tokens, arquivos `.env`, bases pessoais ou documentos internos neste repositorio. Os arquivos publicos podem ser lidos e copiados. Esta primeira versao e um teste de publicacao, nao uma calculadora de viabilidade.

## Proximos passos

1. Comparar e escolher uma das quatro direcoes visuais, ou uma combinacao delas.
2. Desenvolver o simulador exploratorio de baterias com metodologia e testes.
3. Incluir somente os materiais revisados dos demais projetos.

Direitos sobre o conteudo e o codigo permanecem com os respectivos autores. Nenhuma licenca aberta de reutilizacao foi definida nesta etapa.

## Comparar propostas

As quatro abas mudam a composicao, a hierarquia visual e a combinacao de fontes. O botao de tema funciona em todas elas. Os resumos dos projetos abrem em uma janela, e o controle de tarifas continua sendo apenas uma demonstracao.

- /#essencial: Manrope + DM Sans, proximo da identidade do aplicativo de dieta.
- /#editorial: Lora + DM Sans, com indice e composicao editorial.
- /#tecnico: Space Grotesk + DM Sans, com navegacao lateral e registro tecnico.
- /#classico: Lora + DM Sans, com apresentacao pessoal e lista de projetos.

O botao Claro/Escuro muda o tema da opcao ativa. O link /?tema=escuro#tecnico, por exemplo, abre diretamente a terceira opcao no tema escuro. O botao de copiar link preserva a opcao e o tema. As setas esquerda/direita e Home/End permitem navegar pelas abas com teclado.

As oito combinacoes usam o mesmo conteudo-base para facilitar a comparacao de layout e tipografia. Os botoes de projetos abrem resumos reais, com os limites de cada trabalho. Nenhuma opcao foi considerada aprovada automaticamente.

As fontes sao locais, em assets/fonts, com licencas SIL OFL. As figuras em assets/images sao do proprio TCC. A origem dos ativos e os limites da publicacao estao em assets/FONTES-E-REFERENCIAS.md.

## Verificacao da interface

Abra tests/interface.html no site publicado para executar a verificacao no navegador. A suite testa as quatro opcoes, ambos os temas e larguras de 320, 390, 768 e 1280 pixels. Inclui estados das abas, navegacao por teclado, resumos dos projetos, controle deslizante, links de secao, proporcao da figura editorial e contraste das cores principais de texto. Isso nao substitui uma auditoria completa de acessibilidade.

Na revisao de 16/11/2026, as 366 verificacoes passaram localmente no Edge. Capturas de revisao e perfis temporarios do navegador ficam fora deste repositorio e nao sao publicados.
