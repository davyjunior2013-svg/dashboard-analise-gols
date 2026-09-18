# Dashboard de Análise de Gols — Vercel

Esta é uma versão web independente do dashboard de análise de gols, usando a base Excel fornecida.

## Arquivos
- `index.html` — interface.
- `style.css` — layout.
- `app.js` — filtros, KPIs, gráficos e tabela.
- `data.js` — dados exportados da aba `BASE_GOLS`.

## Publicar na Vercel
1. Crie um repositório no GitHub e envie estes 4 arquivos.
2. Entre na Vercel e escolha **Add New → Project**.
3. Importe o repositório.
4. Clique em **Deploy**.
5. A Vercel fornecerá uma URL pública.

Não há backend nem banco de dados nesta primeira versão: os dados estão dentro de `data.js`.
Para atualização automática futura, podemos trocar essa etapa por uma base de dados/API e manter a mesma interface.

## Observação
O `.pbix` original foi usado como referência estrutural. O Power BI não é executado dentro da Vercel; esta aplicação recria a camada interativa na web usando os dados da sua base.
