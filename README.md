# NexusCinema

O **NexusCinema** é um aplicativo mobile desenvolvido com React Native e Expo que permite aos usuários explorar filmes e séries de TV, visualizar detalhes e gerenciar um catálogo através do Firebase e da API do TMDB (The Movie Database).

---

## Acesso Online (Web)

O NexusCinema é totalmente multiplataforma e pode ser utilizado perfeitamente tanto no **celular** quanto no **PC** através do navegador, sem precisar instalar nada!

🔗 **Acesso em Produção:** [https://nexus-cinema.vercel.app/login](https://nexus-cinema.vercel.app/login)

---

## Funcionalidades

- Listagem de filmes e séries populares, novidades e os mais bem avaliados.
- Busca integrada de filmes e séries.
- Detalhes aprofundados sobre produções.
- Autenticação de usuários usando Firebase Auth.
- Integração de dados em tempo real com Firebase Firestore.

---

## Pré-requisitos

Antes de começar, certifique-se de que sua máquina atenda aos seguintes requisitos:

1. **Node.js**: Versão 18.x ou superior. [Download aqui](https://nodejs.org/)
2. **NPM** ou **Yarn**: Instalado juntamente com o Node.
3. **Expo CLI**: Instale globalmente (opcional, o `npx` pode ser usado).
4. **Dispositivo/Emulador**:
   - Ter o aplicativo **Expo Go** instalado no seu dispositivo iOS/Android (para testar fisicamente).
   - OU configurar um emulador Android / Simulador iOS na sua máquina.

---

## Como baixar e instalar

Siga o passo a passo abaixo para rodar o projeto localmente:

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/FilipeSJ1002/NexusCinema.git
   ```

2. **Acesse a pasta do projeto:**
   ```bash
   cd NexusCinema
   ```

3. **Instale as dependências:**
   ```bash
   npm install
   ```

---

## Variáveis de Ambiente

O projeto utiliza chaves e configurações externas para acessar o **Firebase** e o **TMDB**. Você não deve colocar suas credenciais diretamente no código-fonte!

1. Na raiz do projeto, existe um arquivo chamado `.env.example`.
2. Crie um arquivo chamado `.env` na mesma pasta (no Windows você pode simplesmente copiar e colar o arquivo e renomear).
3. Abra o arquivo `.env` e preencha as variáveis com os seus dados reais:
   - **Firebase**: Vá ao Console do Firebase, registre seu Web App e copie as configurações para as chaves correspondentes.
   - **TMDB**: Crie uma conta no [The Movie Database](https://www.themoviedb.org/), vá nas configurações e solicite uma API Key de Desenvolvedor.

---

## Como rodar e testar

1. Inicie o servidor de desenvolvimento do Expo:
   ```bash
   npx expo start
   ```

2. **Para testar no celular (Recomendado):**
   - Baixe o app **Expo Go** na App Store ou Google Play.
   - Abra a câmera (no iOS) ou o próprio app do Expo Go (no Android) e leia o **QR Code** que aparecerá no terminal ou navegador.

3. **Para testar em um emulador:**
   - Pressione `a` no terminal para rodar no Emulador Android (exige Android Studio).
   - Pressione `i` no terminal para rodar no Simulador iOS (exige macOS com Xcode).

---

## Como usar o sistema

1. **Login / Cadastro**: Ao entrar, você verá a tela de login. Use o formulário para se autenticar ou criar uma nova conta via Firebase.
2. **Explorar**: Navegue pela página inicial para ver listas separadas por categorias ("Populares", "Mais votados", etc).
3. **Detalhes**: Clique no pôster de qualquer filme/série para ver informações completas sobre as temporadas, episódios, sinopse, entre outros.

---

## Estrutura do Projeto

- `/app` - Rotas e telas do Expo Router (`index`, `login`, `movie/[id]`, etc).
- `/src/api` - Configurações de conexão externa (`firebase.js`, `tmdb.js`).
- `/src/components` - Componentes reutilizáveis de interface (`MovieRow`, `HeroCarousel`, etc).
- `/assets` - Imagens estáticas, logos e fontes.
- `/constants` - Temas, estilos globais e cores padronizadas.