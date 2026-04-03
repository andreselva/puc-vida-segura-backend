# VidaSegura Backend

Backend em NestJS para o app VidaSegura, usando SQLite local.

## Stack

- NestJS
- TypeORM
- SQLite
- JWT para autenticação
- Swagger

## Como rodar

```bash
npm install
cp .env.example .env
npm run start:dev

```

A API sobe em:

- `http://localhost:3000/api`
- documentação Swagger: `http://localhost:3000/docs`

## Banco de dados

Por padrão o banco local fica em:

- `storage/vida-segura.sqlite`

O projeto cria esse arquivo automaticamente.

## Usuário demo

O backend já faz seed automático de um usuário demo na primeira inicialização:

- e-mail: `joao.silva@vidasegura.app`
- senha: `123456`
- senha pública: `4321`
- profileId: `perfil-demo-001`

## Endpoints principais

### Health

- `GET /api/health`

### Auth

- `POST /api/auth/login`
- `POST /api/auth/register`
- `GET /api/auth/demo-access`
- `GET /api/auth/me` (Bearer token)

### Users

- `GET /api/users/me` (Bearer token)
- `PUT /api/users/:id/clinical-info` (Bearer token)

### Profiles

- `POST /api/profiles/:profileId/access`
- `POST /api/profiles/:profileId`  
- `GET /api/profiles/:profileId/public?password=4321`

## Payloads esperados

### Login

```json
{
  "email": "joao.silva@vidasegura.app",
  "senha": "123456"
}
```

### Cadastro

```json
{
  "nome": "André",
  "sobrenome": "Silva",
  "dt_nasc": "1995-02-12",
  "sexo": "Masculino",
  "email": "andre@email.com",
  "senha": "123456",
  "confirmSenha": "123456"
}
```

### Atualização de informações clínicas

```json
{
  "tipoSanguineo": "A+",
  "alergias": "Dipirona",
  "medicamentos": "Nenhum",
  "doencas": "Asma",
  "cirurgias": "Nenhuma",
  "emergenciaNome": "Maria Silva",
  "emergenciaTelefone": "(54) 99999-9999",
  "senhaPublica": "4321"
}
```

### Acesso ao perfil público

```json
{
  "password": "4321"
}
```
