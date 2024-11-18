# CompassCar API

## Descrição

CompassCar é uma API RESTful criada para gerenciar carros e seus itens relacionados.
A API foi desenvolvida utilizando Node.js e MySQL, sem o uso de ORMs.

## Funcionalidades

1. **Cadastro de carros** com validações específicas.
2. **Listagem de carros** com suporte a paginação e filtros.
3. **Busca de carros por ID**.
4. **Atualização de carros** com validações e substituição de itens.
5. **Exclusão de carros** com remoção associada dos itens.

---

## Requisitos

- **Node.js** (v14 ou superior)
- **MySQL** (v5.7 ou superior)

---

## Configuração do Banco de Dados

1. Crie o banco de dados:

```sql
CREATE DATABASE compasscar;
```

## Configure as tabelas:

```
CREATE TABLE cars (
    id INT AUTO_INCREMENT PRIMARY KEY,
    brand VARCHAR(255) NOT NULL,
    model VARCHAR(255) NOT NULL,
    year INT NOT NULL
);

CREATE TABLE car_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    car_id INT NOT NULL,
    FOREIGN KEY (car_id) REFERENCES cars(id) ON DELETE CASCADE
);
```

</br>
</br>
</br>
## Configure as credenciais do MySQL em config/database.js:

```
const db = mysql.createPool({
    host: 'localhost',
    user: 'user', // Substitua pelo seu usuario
    password: 'password', // Substitua por sua senha
    database: 'compasscar',
});
```

# Instalação

</br>
</br>

## Clone o repositório:

```
git clone https://github.com/Jeferson5641/compasscar.git
```

## Navegue até o diretório do projeto:

```
cd compasscar
```

## Instale as dependências:

```
npm install
```

## Inicie o servidor:

```
npm start
```

### ou

```
npm run dev
```

### ou

```
yarn dev
```

---

# Endpoints

## 1. Cadastro de Carros

- **POST** _/api/v1/cars_

```
{
  "brand": "Volkswagen",
  "model": "GOL G5",
  "year": 2021,
  "items": ["Ar-condicionado", "Direção Hidráulica", "Trava Elétrica"]
}
```

---

## 2. Listagem de Carros

- **GET** _/api/v1/cars_
- **Query Params:**
  - **page** (Número de paginas, padrão: 1)
  - **limit** (Número de itens por página, padrão: 5)
  - **brand**, **model**, **year** (Filtros opcionais)

---

## 3. Buscar Carro por ID

- **GET** _/api/v1/cars/:id_

---

## 4. Atualizar Carro

- **PATCH** _/api/v1/cars/:id_
- **Body** (parcial):

```
{
  "brand": "Chevrolet",
  "items": ["Airbag"]
}
```

---

## 5. Excluir Carro

- **DELETE** _/api/v1/cars/:id_

---

# Padrões de Commit

Utilize o formato **Conventional Commits** para mensagens de commit.
Exemplo:

- feat: add new endpoint for car listing
- fix: correct validation for car items

---

---

# Estrutura de Pastas

```
📂 compasscar
 ├── 📂 config          # Configurações do banco de dados
 ├── 📂 controllers     # Lógica dos endpoints
 ├── 📂 dtos            # Validações e regras de negócio
 ├── 📂 entities        # Representação das entidades
 ├── 📂 routes          # Definição de rotas
 └── server.js             # Arquivo principal

```

---

---

# Executando Localmente

- 1.  Certifique-se de que o MySQL está em execução.
- 2.  Execute o comando:

```
npm start
```

### ou

```
npm run dev
```

### ou

```
yarn dev
```

- 3.  Acesse a API na porta padrão:

```
http://localhost:3000
```

---

# Tratamento de Erros

- 400: Validação falhou (ex: brand is required)
- 404: Recurso não encontrado (ex: car not found)
- 409: Conflito de dados (ex: there is already a car with this data)
- 500: Erro interno do servidor

---

---

---

### P.S.:

_**O codigo se encontra incompleto, estarei trabalhando nele e em futuras atualizações.**_
</br>
</br>
_**Irão ser implementadas novas arquiteturas futuramente e atualização do JavaScript para o TypeScript para a pratica de tipagens.**_
</br>
</br>
_**Irá ser implementado o `.env` para atender a padronização de comunicação com banco de dados.**_
