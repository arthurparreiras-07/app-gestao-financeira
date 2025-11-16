# MindBudget - Gestão Financeira com Análise Emocional

## 📱 Sobre o Projeto

**MindBudget** é um aplicativo mobile de gestão financeira pessoal que incorpora análise emocional aos gastos, desenvolvido como trabalho acadêmico da disciplina de Desenvolvimento de Aplicações Móveis (DAM) da PUC Minas.

O aplicativo permite que usuários registrem suas despesas associando-as a emoções, possibilitando insights sobre padrões comportamentais e tomada de decisões financeiras mais conscientes.

---

## 📋 Documentação Acadêmica

### Relatório Final

O relatório final do projeto segue o template acadêmico fornecido e contém:

1. **Descrição do Problema**

   - Contextualização da gestão financeira pessoal
   - Justificativa da análise emocional de gastos
   - Objetivos do aplicativo

2. **Especificação do Projeto**

   - Requisitos funcionais e não-funcionais
   - Casos de uso
   - Regras de negócio

3. **Projeto da Solução**

   - Protótipos de interface
   - Modelo de persistência de dados
   - Arquitetura Clean Architecture
   - Stack tecnológica utilizada

4. **Utilização do Software**

   - Guia de instalação e configuração
   - Manual de uso das funcionalidades
   - Capturas de tela

5. **Conclusão**
   - Resultados alcançados
   - Lições aprendidas
   - Trabalhos futuros

**Formato:** Artigo científico  
**Máximo:** 12 páginas  
**Normas:** ABNT para escrita acadêmica

---

## 🚀 Funcionalidades Implementadas

### Gestão de Despesas

- ✅ Cadastro de despesas com categoria e valor
- ✅ Associação de emoções às despesas
- ✅ Anexo de comprovantes (fotos)
- ✅ Histórico completo de transações
- ✅ Filtros por categoria, período e emoção

### Análise e Insights

- ✅ Geração automática de insights baseados em padrões emocionais
- ✅ Gráficos de gastos por categoria
- ✅ Gráficos de gastos por emoção
- ✅ Análise de tendências de comportamento
- ✅ Sugestões personalizadas de economia

### Relatórios

- ✅ Exportação de dados em CSV
- ✅ Exportação de dados em JSON
- ✅ Compartilhamento de relatórios
- ✅ Visualização de estatísticas detalhadas

### Notificações

- ✅ Lembretes para registro de despesas
- ✅ Alertas de gastos elevados
- ✅ Sugestões de reflexão emocional

---

## 🏗️ Arquitetura

O projeto segue os princípios da **Clean Architecture**, garantindo:

- Separação clara de responsabilidades
- Independência de frameworks
- Testabilidade
- Manutenibilidade

### Estrutura de Camadas

```
src/
├── domain/              # Camada de Domínio
│   ├── entities/        # Entidades de negócio
│   ├── repositories/    # Interfaces de repositórios
│   └── usecases/        # Casos de uso
│
├── application/         # Camada de Aplicação
│   ├── services/        # Serviços de aplicação
│   └── store/           # Gerenciamento de estado
│
├── infrastructure/      # Camada de Infraestrutura
│   ├── database/        # SQLite e migrations
│   └── repositories/    # Implementação dos repositórios
│
└── presentation/        # Camada de Apresentação
    ├── components/      # Componentes React Native
    ├── screens/         # Telas do aplicativo
    └── navigation/      # Navegação
```

---

## 🛠️ Tecnologias Utilizadas

### Core

- **React Native 0.81.5** - Framework mobile
- **Expo ~54.0.0** - Plataforma de desenvolvimento
- **TypeScript 5.3.3** - Linguagem tipada

### Navegação

- **React Navigation 6.x** - Navegação entre telas
  - Bottom Tabs Navigator
  - Native Stack Navigator

### Persistência

- **Expo SQLite** - Banco de dados local
- **AsyncStorage** - Armazenamento simples

### Estado

- **Zustand 4.5.7** - Gerenciamento de estado global

### UI/UX

- **React Native Chart Kit** - Gráficos e visualizações
- **React Native SVG** - Gráficos vetoriais
- **DateTimePicker** - Seleção de datas

### Funcionalidades Nativas

- **Expo Notifications** - Sistema de notificações
- **Expo Image Picker** - Câmera e galeria
- **Expo File System** - Sistema de arquivos
- **Expo Sharing** - Compartilhamento de arquivos

### Utilitários

- **date-fns** - Manipulação de datas

---

## 📊 Modelo de Dados

### Entidades Principais

#### Expense (Despesa)

```typescript
{
  id: string
  description: string
  amount: number
  categoryId: string
  emotionId: string
  date: string
  receipt?: string
  notes?: string
}
```

#### Category (Categoria)

```typescript
{
  id: string;
  name: string;
  icon: string;
  color: string;
}
```

#### Emotion (Emoção)

```typescript
{
  id: string;
  name: string;
  icon: string;
  color: string;
}
```

#### User (Usuário)

```typescript
{
  id: string;
  name: string;
  email: string;
  monthlyBudget: number;
  createdAt: string;
}
```

---

## 🚀 Instalação e Execução

### Pré-requisitos

- Node.js 18+ instalado
- npm ou yarn
- Expo CLI (instalado globalmente)
- Dispositivo Android/iOS ou emulador

### Passos de Instalação

```bash
# 1. Clone o repositório
git clone https://github.com/arthurparreiras-07/app-gestao-financeira.git

# 2. Entre na pasta do projeto
cd app-gestao-financeira

# 3. Instale as dependências
npm install

# 4. Inicie o projeto
npm start
```

### Executar no Dispositivo

```bash
# Android
npm run android

# iOS (apenas macOS)
npm run ios

# Web (para testes rápidos)
npm run web
```

---

## 📱 Utilização do Software

### 1. Tela Inicial (Home)

- Visualização do saldo atual
- Resumo de gastos do mês
- Insights emocionais destacados
- Acesso rápido às principais funcionalidades

### 2. Adicionar Despesa

- Preencha descrição e valor
- Selecione categoria (Alimentação, Transporte, Lazer, etc.)
- Escolha emoção associada (Feliz, Estressado, Ansioso, etc.)
- Opcionalmente, anexe comprovante fotográfico
- Adicione observações

### 3. Relatórios

- Visualize gráficos de gastos por categoria
- Analise gastos por emoção
- Compare períodos diferentes
- Identifique padrões de comportamento

### 4. Insights

- Receba análises automáticas sobre seus gastos
- Veja correlações entre emoções e despesas
- Obtenha sugestões personalizadas de economia

### 5. Exportar Dados

- Exporte seus dados em formato CSV ou JSON
- Compartilhe relatórios via e-mail ou mensagens
- Mantenha backup das suas informações

---

## 👥 Equipe de Desenvolvimento

**Aluno:** Arthur Parreiras  
**Email:** arthurparreiras07@gmail.com  
**Curso:** Sistemas de Informação / Engenharia de Software  
**Instituição:** PUC Minas  
**Disciplina:** Desenvolvimento de Aplicações Móveis (DAM)  
**Professor:** Jardell Fillipe

---

## 📄 Licença

Este projeto foi desenvolvido para fins acadêmicos como parte do curso de Desenvolvimento de Aplicações Móveis da PUC Minas.

---

## 🎓 Agradecimentos

- Professor Jardell Fillipe pela orientação na disciplina
- PUC Minas pela infraestrutura e suporte acadêmico
- Comunidade Expo e React Native pela documentação e recursos

---

## 📝 Observações Importantes

### Para Avaliação Acadêmica

Este README serve como documentação técnica do projeto. O **relatório final em formato PDF** segue o template acadêmico fornecido (Template_DAM.docx) e contém a análise completa conforme especificações da disciplina.

### Estrutura do Código

O código foi desenvolvido seguindo:

- ✅ Princípios SOLID
- ✅ Clean Architecture
- ✅ Clean Code
- ✅ Padrões de projeto
- ✅ Tipagem forte com TypeScript
- ✅ Separação de responsabilidades

### Qualidade do Código

- **Arquitetura:** Clean Architecture (3 camadas)
- **Padrões:** Repository Pattern, Dependency Injection
- **Estado:** Gerenciamento centralizado com Zustand
- **Tipagem:** 100% TypeScript
- **Organização:** Estrutura modular e escalável

---

## 🔗 Links Úteis

- [Documentação React Native](https://reactnative.dev/)
- [Documentação Expo](https://docs.expo.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)

---

**Versão:** 2.0.0  
**Última Atualização:** Novembro 2025  
**Status:** ✅ Projeto Concluído
