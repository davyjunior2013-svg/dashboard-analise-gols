# Dashboard de Análise de Gols

O dashboard lê os dados do arquivo `data/gols.csv`.

Fluxo de atualização:
1. Atualize a base no Excel.
2. Salve/exporte a aba de gols como CSV UTF-8.
3. Substitua `data/gols.csv` no GitHub.
4. A Vercel fará o novo deploy automaticamente quando o GitHub estiver conectado ao projeto.

Não altere `index.html` para inserir novos gols.
