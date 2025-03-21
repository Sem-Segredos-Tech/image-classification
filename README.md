# Image Classification

Este projeto consiste em uma aplicação web para classificação de imagens usando um modelo TensorFlow.js treinado com Teachable Machine. Ele inclui um frontend construído com Svelte e uma API de backend Node.js.

## Project Struct

- `frontend/` - Aplicativo frontend Svelte
- `server.js` - Servidor de API Node.js
- `model/` - Arquivos de modelo TensorFlow.js

## Pré-requisitos

- Node.js (v14 ou superior)
- npm (Node Package Manager)

## Setup

### 1. Instalar Dependências de Back-end

```bash
npm install
```

### 2. Instalar Dependências de Front-end

```bash
cd frontend
npm install
```

## Executando o Aplicativo

### 1. Inicie o Servidor do Back-end

Do diretório raiz:

```bash
npm start
```

A API será executada em `http://localhost:5001`

### 2. Inicie o Front-end

Em um novo terminal, do diretório frontend:

```bash
cd frontend
npm run dev
```

O frontend estará disponível em `http://localhost:5173`

## Modelo

O diretório `/model` deve conter os seguintes arquivos da sua exportação do Teachable Machine:

- `model.json`
- `weights.bin`
- `metadata.json`

Para usar seu próprio modelo:

1. Treine seu modelo no [Teachable Machine](https://teachablemachine.withgoogle.com/)
2. Exporte o modelo como um modelo TensorFlow.js
3. Substitua o conteúdo do diretório `/model` pelos seus arquivos exportados

## Crie seu próprio dataset

Para coletar imagens para treinar seu modelo, você pode usar a ferramenta DuckImg Scraper disponível em [@johanlabs/duckimg-scrape](https://github.com/johanlabs/duckimg-scraper).

Exemplo de uso:

```bash
python main.py "hamburguer,pizza,food" 100
```

Isso fará o download de 100 imagens para cada categoria "hamburguer", "pizza" e "food" dentro de uma pasta "downloads", que você pode usar para treinar seu modelo no Teachable Machine.

## Endpoints da API

### POST /classify

Classifica uma imagem e retorna previsões.

- Corpo da solicitação: `{ "image": "base64_encoded_image_string" }`
- Resposta: `{ "success": true, "predictions": [{"label": "string", "confidence": number}] }`

## Suporte

Para problemas e perguntas, abra um problema no repositório do projeto.