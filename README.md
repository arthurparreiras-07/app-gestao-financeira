# 🧠💰 MindBudget

> Gestão financeira pessoal com análise emocional de gastos

[![React Native](https://img.shields.io/badge/React%20Native-0.81.5-blue.svg)](https://reactnative.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3.3-blue.svg)](https://www.typescriptlang.org/)
[![Expo](https://img.shields.io/badge/Expo-54.0.0-black.svg)](https://expo.dev/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

## 📱 Sobre o Projeto

MindBudget é um aplicativo inovador de gestão financeira que conecta suas emoções aos seus gastos, ajudando você a entender melhor seus padrões de comportamento financeiro através da análise emocional de transações.

Desenvolvido como projeto acadêmico para a PUC Minas, utilizando Clean Architecture e as melhores práticas de desenvolvimento mobile.

## ✨ Funcionalidades

### Principais Features

- 📊 **Análise Emocional de Gastos** - Registre como você se sentia ao realizar cada transação
- 💰 **Orçamentos Mensais** - Crie e monitore orçamentos com alertas automáticos
- 🔄 **Transações Recorrentes** - Automatize lançamentos fixos (mensal, semanal, etc)
- 🏷️ **Tags Personalizadas** - Organize seus gastos com tags coloridas customizáveis
- 📸 **Anexos de Comprovantes** - Adicione fotos dos seus recibos e notas fiscais
- 📈 **Relatórios Visuais** - Gráficos detalhados por categoria e emoção
- 🔍 **Busca Avançada** - Filtros por data, categoria, emoção, valor e muito mais
- 💾 **Exportação de Dados** - Exporte seus dados em CSV, JSON ou relatórios em TXT
- 🎯 **Insights Automáticos** - Receba dicas personalizadas baseadas no seu comportamento
- 🌓 **Dark Mode** - Interface adaptável ao modo escuro do sistema
- 📱 **100% Offline** - Todos os dados armazenados localmente com SQLite

## 🚀 Instalação

### Pré-requisitos

- Node.js 18+ instalado
- Expo CLI instalado globalmente
- Android Studio (para Android) ou Xcode (para iOS)

### Passos

```bash
# Clone o repositório
git clone https://github.com/arthurparreiras-07/app-gestao-financeira.git

# Entre na pasta do projeto
cd app-gestao-financeira

# Instale as dependências
npm install

# Inicie o projeto
npm start
```

## 📱 Executar o App

### Expo Go (Desenvolvimento)

```bash
npm start
# Escaneie o QR Code com o Expo Go
```

### Android

```bash
npm run android
```

### iOS

```bash
npm run ios
```

### Web

```bash
npm run web
```

## 📦 Build para Produção

### Gerar APK Android

```bash
# APK de teste (mais rápido)
npm run build:apk

# APK de produção (otimizado)
npm run build:prod
```

> **Nota:** Para builds, é necessário ter uma conta Expo. Veja a [documentação de build](docs/build/) para mais detalhes.

## 🏗️ Arquitetura

O projeto segue os princípios da **Clean Architecture** com separação clara de responsabilidades:

```
src/
├── domain/              # Camada de domínio
│   ├── entities/        # Entidades de negócio
│   ├── repositories/    # Interfaces de repositórios
│   └── usecases/        # Casos de uso
├── application/         # Camada de aplicação
│   ├── services/        # Serviços da aplicação
│   └── store/           # Gerenciamento de estado (Zustand)
├── infrastructure/      # Camada de infraestrutura
│   ├── database/        # Configuração do SQLite e migrations
│   └── repositories/    # Implementações dos repositórios
└── presentation/        # Camada de apresentação
    ├── components/      # Componentes reutilizáveis
    ├── screens/         # Telas do aplicativo
    ├── navigation/      # Configuração de rotas
    └── theme/           # Tema e estilos

```

### Princípios Aplicados

- ✅ Dependency Inversion (interfaces)
- ✅ Single Responsibility
- ✅ Separation of Concerns
- ✅ Clean Code
- ✅ SOLID principles

## 🛠️ Tecnologias Utilizadas

### Core

- **React Native** 0.81.5 - Framework mobile
- **TypeScript** 5.3.3 - Tipagem estática
- **Expo** 54.0.0 - Toolchain e SDK

### State Management & Data

- **Zustand** 4.5.7 - Gerenciamento de estado
- **SQLite** (expo-sqlite) - Banco de dados local
- **AsyncStorage** - Persistência de preferências

### UI & Navigation

- **React Navigation** 6.x - Navegação entre telas
- **react-native-chart-kit** - Gráficos e visualizações
- **Ionicons** - Biblioteca de ícones
- **react-native-svg** - Renderização de gráficos

### Utilitários

- **date-fns** - Manipulação de datas
- **expo-image-picker** - Seleção de imagens
- **expo-file-system** - Sistema de arquivos
- **expo-sharing** - Compartilhamento de arquivos
- **expo-notifications** - Notificações push

## 📊 Estrutura do Banco de Dados

O app utiliza SQLite com as seguintes tabelas:

- **expenses** - Transações (gastos e economias)
- **emotions** - Emoções disponíveis
- **categories** - Categorias de gastos
- **budgets** - Orçamentos mensais
- **recurring_expenses** - Transações recorrentes
- **tags** - Tags personalizadas
- **expense_tags** - Relacionamento N:N entre expenses e tags

> Migrations automáticas garantem a evolução do schema do banco.

## 🎨 Screenshots

> Em breve...

## 🧪 Testes

```bash
# Executar testes
npm test

# Testes em modo watch
npm run test:watch

# Cobertura de testes
npm run test:coverage
```

## 📝 Scripts Disponíveis

| Script               | Descrição              |
| -------------------- | ---------------------- |
| `npm start`          | Inicia o servidor Expo |
| `npm run android`    | Roda no Android        |
| `npm run ios`        | Roda no iOS            |
| `npm run web`        | Roda no navegador      |
| `npm run build:apk`  | Gera APK de teste      |
| `npm run build:prod` | Gera APK de produção   |

## 📚 Documentação

- [Guia de Build](docs/build/) - Como gerar APKs e publicar
- [Guia de Desenvolvimento](docs/development/) - Detalhes técnicos e arquitetura
- [Análise Completa](docs/development/ANALISE_COMPLETA.md) - Análise detalhada do projeto

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Add: nova feature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.
