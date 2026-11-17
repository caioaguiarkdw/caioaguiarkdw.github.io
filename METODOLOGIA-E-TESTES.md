# Metodologia e verificação

## Escopo dos casos

O TCC usa a referência metodológica de novembro de 2026: 190 unidades experimentais, compostas por 154 curvas completas e 36 registros pontuais de máxima potência, com 13.896 registros. As cinco classes têm suporte desigual. O recorte XGB17 / BT[2,1,0] registra 190/190 unidades e 1.108/1.114 pontos no protocolo LOCO, com agregação por média das probabilidades. É seleção e avaliação interna, sem demonstrar generalização em campo.

O caso Amara distingue as customizações Odoo/Python da frente Zendesk/Power Automate. A integração completa entre os sistemas aparece como continuidade futura. Os ganhos são qualitativos, sem porcentagens de tempo ou custo. O fluxo público foi reconstruído com dados fictícios.

O aplicativo real usa React/TypeScript/Vinext, Cloudflare Workers e D1. O caso descreve regras, snapshots, revisões e rascunho. A demonstração pública funciona em memória e não acessa a aplicação real. As quantidades e referências são fictícias, sem recomendação nutricional.

## Modelo BESS

O cenário é arbitragem tarifária para consumo próprio, carregando pela rede. Todos os valores monetários são reais e constantes. A capacidade é útil entregue em corrente alternada. Não se aplica novamente profundidade de descarga.

Com eficiência `eta` como fração, tarifa de ponta `Tp` e tarifa fora de ponta `Tf`:

```text
margem = Tp - Tf / eta
capacidade(t) = capacidadeInicial × (1 - degradação)^(t - 1)
energiaDiária(t) = min(consumoDiário, capacidade(t))
fluxo(t) = energiaDiária(t) × dias × margem - manutençãoAnual
saldo(0) = -investimento
saldo(t) = saldo(t - 1) + fluxo(t)
VPL = -investimento + soma[fluxo(t) / (1 + taxaReal)^t]
```

O primeiro ano usa a capacidade inicial integral. O consumo só é reduzido pela degradação quando ultrapassa a capacidade restante. A manutenção é um custo fixo anual, inclusive em anos sem operação.

O retorno simples de referência congela o fluxo líquido do primeiro ano. Não incorpora degradação futura. A recuperação modelada identifica a primeira passagem do saldo acumulado por zero. A recuperação descontada faz o mesmo com fluxos descontados. As frações de ano são aproximações por interpolação linear. O VPL considera pagamentos ao fim de cada ano.

Uma recuperação inicial pode ser seguida de saldo negativo quando os fluxos posteriores se tornam negativos. Por isso o resultado mostra também o saldo final e o VPL. Quando o fluxo de referência é nulo ou negativo, não se calcula retorno simples. Se não houver passagem por zero no horizonte, a recuperação é informada como ausente.

As tarifas absolutas são a fonte da relação percentual. O campo de relação mostra até seis casas decimais, sem arredondar os preços de origem. Ao editar a relação, a tarifa de ponta é preservada e a fora de ponta é recalculada. Os controles de faixa dos valores não inteiros usam precisão contínua, evitando deslocar preços históricos para uma grade diferente.

O modelo pressupõe potência, janela e consumo suficientes para o deslocamento diário. Não modela venda à rede, créditos solares, demanda, efeitos tributários adicionais, parcelas fixas, financiamento, substituição ou valor residual. Garantia contratual não determina vida útil ou rentabilidade. A análise de uma instalação exige comparação de fatura completa e dimensionamento físico.

## Referências de regressão

Investimento de R$ 20.000, capacidade e utilização de 8 kWh úteis, 252 dias, eficiência de 90%, sem degradação, manutenção ou desconto.

| Referência histórica | Fora de ponta | Ponta | Economia anual | Retorno simples |
| --- | ---: | ---: | ---: | ---: |
| Copel após julho/2026 | 0,60506 | 1,24628 | 1.157,16608 | 17,283604 anos |
| Energisa Paraíba | 0,30 | 1,44 | 2.231,04 | 8,964429 anos |
| Energisa Sul-Sudeste | 0,37 | 1,90 | 3.001,60 | 6,663113 anos |
| Energisa Tocantins | 0,38 | 2,47 | 4.128,32 | 4,844586 anos |

Tarifas em R$/kWh. Investimento hipotético. As referências não asseguram vigência durante o prazo calculado nem equivalência tributária entre experimentos. Na consulta de 16/11/2026, a fonte ANEEL apresentava proposta técnica, e a tabela Copel foi confirmada. A página Energisa não pôde ser revalidada, portanto seus valores são apresentados como históricos.

## Verificação executada

A versão foi exercitada no Microsoft Edge em modo headless com Playwright Python. A suíte é nova e substitui os testes da antiga galeria. As capturas e o JSON detalhado ficam fora do pacote público.

- Regressão dos quatro cenários, eficiência, capacidade e consumo, investimento único, degradação, manutenção, desconto e recuperação.
- Entradas inválidas, eficiência zero, NaN, infinito, números negativos e inteiros obrigatórios.
- Margem zero/negativa, dias zero, energia zero, vida insuficiente, degradação de 100% e limites numéricos.
- Cinco páginas, temas claro e escuro, larguras 320, 390, 768, 1280 e 1440: 50 combinações.
- Abertura de rotas, imagens, ausência de overflow da página e verificação interna dos painéis e controles da calculadora.
- Presets e sincronização de campos/sliders, relação de preços, reset, cópia, CSV, reconstituição de URL e URL inválida.
- Etapas e reset Odoo, cálculo proporcional e snapshot da dieta, troca de figura e zoom do TCC.
- Foco do menu móvel, Escape, retorno de foco do diálogo, persistência de tema, recarga e prefixo de subpasta.
- Conteúdo e navegação sem JavaScript, erros de execução e requisições de rede.

Na execução registrada, 296 verificações automatizadas passaram. A inspeção visual de capturas levou à correção do corte interno da calculadora em telas pequenas. Os testes agora verificam esse problema diretamente, pois apenas medir a largura do documento não o detectava.

Uma conferência adicional calculou o contraste de 36 pares da paleta: texto principal, secundário e acento sobre seis superfícies em ambos os temas. Todos ficaram acima de 4,5:1, com menor valor de 5,19:1. Esse cálculo de tokens não substitui uma auditoria de todos os estados renderizados.

A auditoria final conferiu 101 referências locais entre links, ativos e âncoras, sem destinos ausentes nem IDs duplicados nas cinco páginas. O artigo público foi comparado ao trecho autoral da fonte e permaneceu idêntico, incluindo referências. O iniciador de prévia respondeu HTTP 200 nas cinco rotas, e o processo usado nesse teste foi encerrado.

O antivírus local injetou requisições próprias no navegador durante a validação. Elas foram identificadas como tráfego do ambiente e registradas separadamente. Nenhuma configuração de segurança foi alterada. O código do aplicativo não faz requisições a serviços externos durante o uso das demonstrações.

## Revisões e limites

Foram realizadas passagens editorial, visual e técnica, incluindo revisão independente de fontes, código, links e capturas. As páginas não publicam os extratos usados na preparação.

A validação de teclado e cores é básica, não uma certificação completa de acessibilidade. Não foram executados testes com leitor de tela, Safari, Firefox ou dispositivos físicos. Os links externos foram usados como referências, sem prometer disponibilidade futura. A implantação pública desta proposta não foi executada e depende de aprovação.
