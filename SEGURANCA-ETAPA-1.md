# Revisão técnica do Pj Memories

Este pacote remove o arquivo `.env` original, pois ele pode conter credenciais. Antes de usar a aplicação, crie um novo arquivo `backend/.env` a partir de `backend/.env.example` e informe sua própria URI do MongoDB Atlas.

## O que foi alterado nesta versão

- Removidas credenciais locais do pacote e adicionados modelos `.env.example`.
- Criados `.gitignore` para backend e front-end.
- A conexão com MongoDB agora valida a existência de `MONGODB_URI` e o servidor só começa a escutar depois de conectar ao banco.
- Porta, origem do front-end e URL da API são configuráveis por ambiente.
- Adicionado endpoint de saúde `GET /health`.
- Melhorados os retornos de erro, validação de IDs, validação de formulário e persistência de favoritos/comentários.
- Corrigido o uso de `getErrorMessage` no front-end, que era chamado sem definição.
- Adicionados estados de carregamento/erro na listagem e na página de memória.
- O upload aceita JPEG/PNG de até 5 MB e a remoção de imagens usa caminhos absolutos controlados.
- Criado README na raiz com instalação, rotas, variáveis e notas de deploy.

## Antes de publicar

1. Troque no Atlas a senha que era usada pela conexão antiga.
2. Crie `backend/.env` e `frontend/.env` localmente usando os exemplos.
3. Não inclua os arquivos `.env` no Git.
4. Rode a aplicação e teste criar, listar, comentar, atualizar, favoritar e excluir.
5. Confira os arquivos rastreados com `git status` antes de qualquer commit.

## Limitações ainda conhecidas

- Não foi feito deploy: é necessário configurar contas e variáveis secretas nas plataformas.
- As imagens são armazenadas no disco do backend. Em hospedagens com sistema de arquivos efêmero, elas podem desaparecer após reinicializações; para produção, planeje armazenamento persistente ou serviço de objetos.
- A identidade visual autoral e uma funcionalidade nova ainda precisam ser escolhidas com o autor. Não foram inventadas nesta revisão.
- A origem educacional da base deve ser reconhecida no portfólio e as contribuições devem ser descritas com honestidade.
