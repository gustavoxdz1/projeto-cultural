# Relatório de Validação de Testes

## Objetivo

Este relatório documenta os testes realizados até o momento no projeto, com foco na validação inicial da aplicação por meio de testes manuais e testes de API via Postman.

O objetivo desta etapa foi garantir que os fluxos essenciais do sistema estivessem funcionando corretamente antes do início da automação com Playwright.

---

## Escopo validado

Foram validados os seguintes módulos e comportamentos da aplicação:

- autenticação de usuário comum
- autenticação de administrador
- acesso ao perfil autenticado
- listagem de locais
- detalhe de local por ID
- criação de sugestões autenticadas
- listagem de sugestões no painel administrativo
- aprovação de sugestões por administrador
- criação automática de local a partir de sugestão aprovada
- criação de categorias por administrador
- criação de locais por administrador
- tratamento de erros de autenticação
- tratamento de erros de autorização
- tratamento de recurso inexistente

---

## Tipos de teste executados

### 1. Testes manuais iniciais

Antes dos testes de API, foram executadas validações manuais no sistema para verificar o comportamento geral da aplicação no navegador.

#### Cenários manuais executados

- login com admin
- login com senha incorreta
- validação visual de botões e navegação
- verificação básica de funcionalidades disponíveis na interface

#### Resultado

Os fluxos iniciais testados manualmente apresentaram comportamento esperado.

---

### 2. Testes de API via Postman

Foi criada uma coleção no Postman para validação dos principais endpoints da aplicação.

#### Estrutura utilizada no Postman

**Collection**
`SpotTech API Tests`

**Pastas**
- Auth
- Perfil
- Places
- Suggestions
- Admin

**Variáveis de ambiente**
- `baseUrl`
- `userEmail`
- `userPassword`
- `adminEmail`
- `adminPassword`
- `token`
- `adminToken`
- `placeId`
- `suggestionId`
- `categoryId`

---

## Casos validados

### A. Autenticação

#### 1. Login de administrador

**Objetivo:** validar autenticação com usuário admin.

**Resultado esperado:**
- status `200`
- retorno de token
- retorno de usuário com role `ADMIN`

**Resultado obtido:**
- validado com sucesso

---

#### 2. Login de usuário comum

**Objetivo:** validar autenticação com usuário comum.

**Resultado esperado:**
- status `200`
- retorno de token
- retorno de usuário sem role admin

**Resultado obtido:**
- validado com sucesso

---

#### 3. Login com senha incorreta

**Objetivo:** validar tratamento de credenciais inválidas.

**Resultado esperado:**
- status `401`
- mensagem de erro coerente

**Resultado obtido:**
- status `401`
- mensagem: `Credenciais inválidas`

**Status:** aprovado

---

#### 4. Login com e-mail inexistente

**Objetivo:** validar tentativa de login com usuário não cadastrado.

**Resultado esperado:**
- status `400` ou `401`
- mensagem de erro

**Resultado obtido:**
- comportamento validado com sucesso

---

#### 5. Cadastro com e-mail duplicado

**Objetivo:** validar bloqueio de duplicidade de cadastro.

**Resultado esperado:**
- status `400` ou `409`
- mensagem informando duplicidade

**Resultado obtido:**
- validado com sucesso

---

### B. Perfil

#### 6. Buscar perfil autenticado

**Objetivo:** validar acesso a rota protegida com token válido.

**Resultado esperado:**
- status `200`
- retorno dos dados do usuário autenticado

**Resultado obtido:**
- validado com sucesso
- e-mail retornado compatível com o usuário logado

---

#### 7. Buscar perfil sem token

**Objetivo:** validar bloqueio de acesso sem autenticação.

**Resultado esperado:**
- status `401`
- mensagem de não autorizado

**Resultado obtido:**
- status `401`
- mensagem: `Token não autorizado`

**Status:** aprovado

---

### C. Places

#### 8. Listar locais

**Objetivo:** validar listagem de locais cadastrados.

**Resultado esperado:**
- status `200`
- retorno em array
- ao menos um local listado

**Resultado obtido:**
- validado com sucesso
- array retornado corretamente
- `placeId` salvo para testes seguintes

---

#### 9. Buscar local por ID

**Objetivo:** validar detalhe de local existente.

**Resultado esperado:**
- status `200`
- retorno de objeto com `id`, `name` e `address`

**Resultado obtido:**
- validado com sucesso

---

#### 10. Buscar local inexistente

**Objetivo:** validar comportamento para recurso inexistente.

**Resultado esperado:**
- status `404`
- mensagem de erro

**Resultado obtido:**
- status `404`
- mensagem: `Local não encontrado`

**Status:** aprovado

---

### D. Suggestions

#### 11. Criar sugestão autenticado

**Objetivo:** validar criação de sugestão por usuário autenticado.

**Resultado esperado:**
- status `200` ou `201`
- retorno da sugestão criada
- `suggestionId` salvo no ambiente

**Resultado obtido:**
- status `201 Created`
- sugestão criada com sucesso

**Status:** aprovado

---

#### 12. Criar sugestão sem token

**Objetivo:** validar bloqueio de sugestão sem autenticação.

**Resultado esperado:**
- status `401`
- mensagem de não autorizado

**Resultado obtido:**
- status `401`
- mensagem: `Token não informado`

**Status:** aprovado

---

### E. Administração

#### 13. Listar sugestões como admin

**Objetivo:** validar acesso administrativo à listagem de sugestões.

**Resultado esperado:**
- status `200`
- retorno em array
- presença da sugestão criada

**Resultado obtido:**
- validado com sucesso

---

#### 14. Listar sugestões com usuário comum

**Objetivo:** validar bloqueio de rota admin para usuário sem permissão.

**Resultado esperado:**
- status `403`
- mensagem de acesso negado

**Resultado obtido:**
- status `403 Forbidden`
- mensagem: `Acesso negado`

**Status:** aprovado

---

#### 15. Aprovar sugestão

**Objetivo:** validar aprovação de sugestão por administrador.

**Resultado esperado:**
- status `200`
- atualização do status para `APPROVED`

**Resultado obtido:**
- status `200`
- sugestão marcada como aprovada

**Status:** aprovado

---

#### 16. Validação do efeito da aprovação

**Objetivo:** confirmar se a aprovação gera um novo local na aplicação.

**Resultado esperado:**
- criação automática de um novo `place`
- exibição desse local na aplicação

**Resultado obtido:**
- novo local criado com sucesso
- confirmação via Postman
- confirmação visual na aplicação

**Status:** aprovado

---

#### 17. Criar categoria como admin

**Objetivo:** validar criação de categoria por administrador.

**Resultado esperado:**
- status `200` ou `201`
- retorno de categoria criada com `id`

**Resultado obtido:**
- status `201 Created`
- categoria criada com sucesso
- `categoryId` salvo para uso posterior

**Status:** aprovado

---

#### 18. Criar local como admin

**Objetivo:** validar criação manual de local por administrador.

**Resultado esperado:**
- status `200` ou `201`
- retorno do local criado

**Resultado obtido:**
- validado com sucesso

**Status:** aprovado

---

## Resumo dos resultados

### Cenários positivos validados com sucesso

- login admin
- login usuário
- perfil autenticado
- listar locais
- buscar local por ID
- criar sugestão autenticada
- listar sugestões admin
- aprovar sugestão
- criar local a partir da sugestão aprovada
- criar categoria admin
- criar local admin

### Cenários negativos validados com sucesso

- login com senha incorreta
- login com e-mail inexistente
- buscar perfil sem token
- criar sugestão sem token
- acessar admin com usuário comum
- buscar local inexistente
- cadastro com e-mail duplicado

---

## Aprendizados e conclusões

Durante essa etapa, foi possível validar aspectos importantes da qualidade da aplicação:

- autenticação funcionando corretamente
- autorização diferenciando `401` e `403`
- regras administrativas protegidas
- fluxos principais de negócio funcionando
- integração entre sugestão e criação de local funcionando
- mensagens de erro coerentes
- rotas protegidas respondendo corretamente
- consistência entre comportamento da API e comportamento visível na aplicação

Também foi possível identificar a importância de:

- configurar corretamente tokens no Postman
- separar erro de sistema de erro de configuração do teste
- confirmar não apenas o status HTTP, mas também o efeito real da regra de negócio

---

## Próximos passos

As próximas etapas recomendadas para o projeto são:## Relatório de testes positivos da API

Durante a validação da aplicação, foram executados testes positivos via **Postman** para verificar o funcionamento dos principais fluxos de negócio da API.

### Objetivo
Garantir que os fluxos principais da aplicação estivessem funcionando corretamente, com autenticação, autorização e integração entre módulos.

### Ferramenta utilizada
- **Postman**

### Ambiente
- API executando localmente
- Banco de dados com dados previamente cadastrados
- Usuário comum existente
- Usuário administrador existente

### Fluxos testados com sucesso

#### 1. Autenticação de administrador
Foi realizado login com usuário administrador para validar:
- autenticação com credenciais válidas
- retorno do token JWT
- retorno do perfil com papel `ADMIN`

**Resultado:** sucesso (`200 OK`)

---

#### 2. Autenticação de usuário comum
Foi realizado login com usuário comum para validar:
- autenticação com credenciais válidas
- retorno do token JWT
- retorno dos dados do usuário autenticado

**Resultado:** sucesso (`200 OK`)

---

#### 3. Consulta de perfil autenticado
Foi testada a rota de perfil do usuário autenticado para validar:
- acesso com token válido
- retorno correto dos dados do usuário logado
- consistência entre o e-mail autenticado e o perfil retornado

**Resultado:** sucesso (`200 OK`)

---

#### 4. Listagem de locais
Foi testada a rota de listagem de locais para validar:
- retorno dos registros cadastrados
- estrutura de resposta em formato de array
- carregamento correto dos locais disponíveis no sistema

**Resultado:** sucesso (`200 OK`)

---

#### 5. Busca de local por ID
Foi testada a consulta de um local específico por ID para validar:
- busca individual por identificador
- retorno correto do objeto esperado
- consistência dos dados do local

**Resultado:** sucesso (`200 OK`)

---

#### 6. Criação de sugestão autenticada
Foi testada a criação de sugestão de local por usuário autenticado para validar:
- proteção da rota por autenticação
- envio correto dos dados da sugestão
- criação do registro no sistema

**Resultado:** sucesso (`201 Created`)

---

#### 7. Listagem de sugestões no painel administrativo
Foi testada a rota administrativa de listagem de sugestões para validar:
- acesso restrito ao perfil administrador
- retorno das sugestões cadastradas
- disponibilidade da sugestão criada para análise administrativa

**Resultado:** sucesso (`200 OK`)

---

#### 8. Aprovação de sugestão administrativa
Foi testada a aprovação de uma sugestão pelo administrador para validar:
- atualização do status da sugestão para `APPROVED`
- processamento correto da ação administrativa
- criação automática de um novo local a partir da sugestão aprovada

**Resultado:** sucesso (`200 OK`)

---

#### 9. Validação do efeito na aplicação
Após a aprovação da sugestão via API, foi validado na aplicação que:
- a sugestão passou para o status de aprovada
- o novo local foi criado com sucesso
- o local ficou visível na aplicação

**Resultado:** sucesso

### Resumo dos testes positivos executados

| ID | Cenário | Resultado |
|----|---------|-----------|
| TP001 | Login com administrador | Aprovado |
| TP002 | Login com usuário comum | Aprovado |
| TP003 | Consulta de perfil autenticado | Aprovado |
| TP004 | Listagem de locais | Aprovado |
| TP005 | Busca de local por ID | Aprovado |
| TP006 | Criação de sugestão autenticada | Aprovado |
| TP007 | Listagem de sugestões no admin | Aprovado |
| TP008 | Aprovação de sugestão | Aprovado |
| TP009 | Criação de local após aprovação | Aprovado |

### Conclusão
Os testes positivos executados demonstraram que os principais fluxos da API estavam funcionando corretamente no ambiente validado, incluindo autenticação, acesso a dados protegidos, listagem de informações, criação de sugestões e aprovação administrativa com geração de novos registros no sistema.

### 1. Automação E2E com Playwright

Prioridades:
- login com sucesso
- login inválido
- acesso protegido à rota `/sugerir`
- criação de sugestão via interface
- fluxo admin posteriormente

### 2. Padronização final da coleção Postman

- nomes padronizados
- descrições
- melhor organização dos scripts
- exportação da coleção e environment

### 3. Expansão da cobertura de testes

Possíveis próximos casos:
- token inválido
- aprovação de sugestão inexistente
- edição de local admin
- criação de categoria duplicada
- testes de validação de payload

---

## Status atual da qualidade

Até o momento, a aplicação apresenta uma base funcional consistente para seguir com:

- automação de testes
- melhoria de cobertura
- documentação de QA
- evolução para pipeline CI/CD

Essa etapa serviu como fundação para a próxima fase de automação e amadurecimento do projeto.