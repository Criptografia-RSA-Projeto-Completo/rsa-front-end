# RSA Lab

Interface React para gerar chaves, criptografar e descriptografar com o motor RSA didático publicado na Vercel.

```powershell
npm ci
npm run dev
```

Use a URL exibida pelo Vite. Clique em **Carregar exemplo** e gere as chaves. Nas outras etapas, o formulário recebe automaticamente a chave correspondente e o texto cifrado. Você também pode inserir esses valores manualmente. A interface mantém os resultados em memória até recarregar a página.

## Deploy na Vercel

Crie um projeto para o frontend, com **Root Directory** em `./` e **Application Preset** em **Vite**. O `vercel.json` define a instalação com `npm ci`, a compilação com `npm run build` e a saída em `dist`. A interface não precisa de variáveis de ambiente.

O navegador chama `/api/*` no próprio domínio do frontend. A Vercel encaminha essas requisições para `https://rsa-api-phi.vercel.app`. O Vite faz o mesmo em desenvolvimento e em `npm run preview`.

Para gerar um deploy de prévia a partir desta pasta, execute `npx vercel@latest deploy`. Vincule a pasta a um projeto próprio para o frontend se a CLI perguntar. Na URL da prévia, clique em **Carregar exemplo**, gere as chaves, criptografe `OLA MUNDO` e confirme que a descriptografia devolve o texto original. Depois, publique com `npx vercel@latest deploy --prod`.
