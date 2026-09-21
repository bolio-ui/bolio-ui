# AGENTS.md

O melhor código é aquele que você não precisou escrever.

## Antes de escrever código

1. Isso realmente precisa existir?
2. O código existente já resolve isso?
3. A biblioteca padrão pode resolver isso?
4. A própria plataforma pode resolver isso?
5. Alguma dependência já instalada pode resolver isso?
6. Isso pode ser feito de forma mais simples?
7. Só então escreva um novo código.

## Regras

- Reutilize o código existente.
- Resolva apenas o problema solicitado.
- Não faça refatorações ou alterações fora do escopo.
- Evite abstrações e dependências desnecessárias.
- Prefira APIs nativas.
- Prefira alterações pequenas.
- Siga os padrões já existentes no projeto.
- Não implemente funcionalidades para cenários hipotéticos.
- Não introduza complexidade sem justificativa.
- Não crie novos arquivos, hooks, services, providers ou abstrações sem necessidade clara.
- Preserve o comportamento existente sempre que possível.

## Validação

- Não gere screenshots automaticamente.
- Não utilize screenshots para validação visual.
- Não utilize Playwright para testes visuais ou comparação de imagens.
- Utilize Playwright apenas para automação E2E quando necessário ou solicitado.
- Não investigue ou execute ferramentas quando a análise do código for suficiente.
- Não execute comandos ou testes apenas por precaução; faça isso quando forem relevantes para a alteração.

## Docs (guias em MDX)

Todo guia em `src/pages/docs/guide` segue a estrutura de `about-bolio-ui.mdx`. Copie esse arquivo para criar um novo.

- Imports na ordem `Docs`, `src/components`, `core`, sem imports sem uso.
- `meta.title` igual ao título da sidebar em `manifest.json` (o anterior/próximo depende disso), `description` sempre preenchida (vai para o SEO).
- `## Título` igual ao `meta.title`, depois `<Spacer h={2} />`.
- Cada `###` precedido de `<Spacer h={2} />`, com título único na página (vira âncora e entra em `seed.json`).
- Listas com `- •` (o CssBaseline remove o marcador de `ul`).
- Playground segue o tema: cores via `useTheme`, nunca hex fixo.
- Todo `.mdx` termina com `export default Docs.withMeta(meta)`. JSX dentro de `export` gera erro no editor (o language server do MDX não lê JSX em ESM).
- Página nova entra em `manifest.json` e `seed.json`, com uma entrada por título de `Playground` (`General` quando não tem título), por `APIs`, por `Attributes.Title` e por `###`.

## Copy / textos

- Nunca use hífen para unir frases; escreva corrido com conectivos ou pontuação normal. Exceção: em metadata (`<title>`, Open Graph, SEO), o padrão "Título da Página - Nome da Marca" é aceitável, é convenção do formato, não prosa.
- Siga o idioma já usado na tela, sem misturar.
- Seja direto e específico, nunca instrucional ("Salvar", não "Clique aqui para salvar").
- Evite jargão técnico, stack trace, status HTTP cru ou erro genérico sem contexto.
- Prefira frases curtas e ativas; evite voz passiva e excesso de gerúndio.
- Sem reticências decorativas nem exclamação em excesso.
- Mantenha o mesmo termo e a mesma capitalização para a mesma coisa em todo o app.
- Erro deve dizer o que aconteceu e o que fazer a seguir.
- Empty state deve explicar como sair dele, não só descrever a ausência.
- Reaproveite copy já existente antes de escrever um texto novo.

## Copy para conversão / monetização

- Benefício, não feature.
- CTA específico e em primeira pessoa de ação, nunca genérico ("Assinar Pro", não "Enviar" ou "Saiba mais").
- Frase de baixa fricção perto do botão de conversão ("sem cartão", "cancele quando quiser").
- Número concreto, nunca vago.
- Destaque visual no plano recomendado.
- Mostre o limite do Free e o ganho do Pro lado a lado, nunca só a restrição.
- Urgência/escassez apenas quando real; nunca falsa.
- Prova social com número real, nunca adjetivo vazio.
- No paywall, reconheça o que o usuário já fez e mostre o próximo ganho, não só bloqueie.
- Nunca use pré-seleção enganosa, cobrança escondida ou fricção artificial para cancelar (dark pattern).

## Regra principal

Se existe uma solução mais simples, escolha a solução mais simples.

Se existe uma solução já implementada, reutilize-a.

**Não faça mais do que foi solicitado.**
