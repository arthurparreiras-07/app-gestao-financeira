# MindBudget - Aplicativo de Gestão Financeira Emocional

<div align="center">
  <img src="./assets/icon.png" alt="MindBudget Logo" width="120" height="120">
  <p><em>Entenda a relação entre suas emoções e seus gastos</em></p>
</div>

---

## 📋 Especificação do Projeto

### Visão Geral

**MindBudget** é um aplicativo mobile inovador de gestão financeira que vai além do simples controle de gastos. Desenvolvido em React Native com Expo, o aplicativo correlaciona transações financeiras com estados emocionais, permitindo que os usuários compreendam como suas emoções influenciam seus hábitos de consumo e economia.

### Objetivos

- **Rastreamento Emocional**: Permitir que usuários associem cada transação a um estado emocional específico
- **Análise de Padrões**: Identificar correlações entre emoções e comportamentos financeiros
- **Gestão Inteligente**: Fornecer insights automáticos baseados em padrões identificados
- **Controle Orçamentário**: Permitir definição e acompanhamento de metas financeiras por categoria
- **Privacidade**: Armazenamento local de dados sem necessidade de conexão externa

### Funcionalidades Principais

#### 1. Gestão de Transações

- Registro de gastos e economias com valores, datas e observações
- Categorização personalizável de transações
- Associação de estados emocionais a cada transação
- Sistema de tags para organização adicional
- Anexos de fotos (recibos, comprovantes)

#### 2. Análise Emocional

- 8 emoções padrão com intensidades (Feliz, Triste, Ansioso, Calmo, Estressado, Animado, Entediado, Irritado)
- Visualização de gastos por emoção
- Identificação de padrões emocionais de consumo
- Insights automáticos sobre comportamentos

#### 3. Orçamentos e Metas

- Definição de limites mensais por categoria
- Alertas de gastos excessivos (configurável, padrão 80%)
- Acompanhamento de progresso em tempo real
- Visualização de economias realizadas

#### 4. Despesas Recorrentes

- Cadastro de gastos fixos (mensais, semanais, anuais)
- Geração automática de transações recorrentes
- Gestão de assinaturas e contas fixas

#### 5. Relatórios e Estatísticas

- Gráficos de gastos por categoria
- Análise temporal (diária, mensal, anual)
- Comparativo de gastos vs economias
- Estatísticas por estado emocional

#### 6. Exportação e Backup

- Exportação de dados em formato CSV
- Importação de dados de backups anteriores
- Compartilhamento de relatórios

### Público-Alvo

- Pessoas interessadas em entender seus padrões de consumo
- Indivíduos que buscam melhor controle financeiro
- Usuários que reconhecem a influência das emoções em suas decisões financeiras
- Profissionais de saúde mental que trabalham com educação financeira

---

## 🏗️ Projeto da Solução

### Arquitetura

O projeto segue os princípios da **Clean Architecture**, garantindo separação de responsabilidades, testabilidade e manutenibilidade. A arquitetura é dividida em quatro camadas principais:

```
src/
├── domain/              # Camada de Domínio (Regras de Negócio)
├── application/         # Camada de Aplicação (Casos de Uso)
├── infrastructure/      # Camada de Infraestrutura (Implementações)
└── presentation/        # Camada de Apresentação (UI/UX)
```

#### 1. **Domain Layer** (Camada de Domínio)

Contém as regras de negócio puras, independentes de frameworks.

**Entidades:**

- `Expense`: Representa uma transação financeira (gasto ou economia)
- `Emotion`: Representa um estado emocional
- `Category`: Representa uma categoria de gasto
- `Budget`: Representa um orçamento mensal
- `RecurringExpense`: Representa despesas recorrentes
- `Tag`: Representa tags personalizadas
- `User`: Representa o usuário do aplicativo

**Interfaces de Repositório:**

- `IExpenseRepository`
- `IEmotionRepository`
- `ICategoryRepository`
- `IBudgetRepository`
- `IRecurringExpenseRepository`
- `ITagRepository`

**Casos de Uso:**

- `CreateExpense`: Criação de nova transação
- `GenerateInsights`: Geração de insights automáticos
- `GetExpensesByEmotion`: Consulta de gastos por emoção

#### 2. **Application Layer** (Camada de Aplicação)

Orquestra o fluxo de dados entre a interface e o domínio.

**Store (Zustand):**

- `useAppStore`: Gerenciamento de estado global da aplicação
  - Sincronização com banco de dados
  - Cache de dados em memória
  - Operações CRUD para todas as entidades

**Serviços:**

- `InsightsService`: Análise inteligente de padrões
- `RecurringExpenseService`: Gerenciamento de despesas recorrentes
- `ExportService`: Exportação de dados (CSV)
- `ImportService`: Importação de backups

#### 3. **Infrastructure Layer** (Camada de Infraestrutura)

Implementações concretas de persistência e serviços externos.

**Banco de Dados:**

- `DatabaseManager`: Singleton para gerenciamento do SQLite
- `migrations`: Sistema de versionamento do schema
  - Versão atual: 3
  - Suporte a atualizações incrementais
  - Preservação de dados durante upgrades

**Repositórios:**

- Implementações concretas das interfaces de repositório
- Mapeamento entre entidades de domínio e tabelas SQL
- Queries otimizadas com índices

#### 4. **Presentation Layer** (Camada de Apresentação)

Interface do usuário e navegação.

**Telas:**

- `HomeScreen`: Dashboard principal com insights
- `AddExpenseScreen`: Cadastro de transações
- `EditExpenseScreen`: Edição de transações existentes
- `TransactionsScreen`: Listagem e filtros de transações
- `ReportsScreen`: Relatórios e gráficos
- `BudgetScreen`: Gestão de orçamentos
- `RecurringExpensesScreen`: Gestão de despesas recorrentes
- `ManageCategoriesScreen`: Personalização de categorias
- `ManageEmotionsScreen`: Personalização de emoções
- `TagsScreen`: Gestão de tags
- `SettingsScreen`: Configurações e exportação

**Componentes:**

- `ExpenseCard`: Card de transação
- `InsightCard`: Card de insight
- `StatisticsCard`: Card de estatísticas
- `ChartComponent`: Gráficos reutilizáveis
- `CategorySelector`: Seletor de categorias
- `EmotionSelector`: Seletor de emoções
- `CustomDrawerContent`: Menu lateral personalizado

**Navegação:**

- React Navigation v7
- Drawer Navigator para menu lateral
- Stack Navigator para fluxo de telas

### Persistência de Dados

#### Banco de Dados: SQLite (expo-sqlite v16)

**Vantagens:**

- ✅ Armazenamento local (privacidade total)
- ✅ Sem necessidade de internet
- ✅ Rápido e eficiente
- ✅ Suporte nativo no iOS e Android
- ✅ Queries SQL completas

**Schema do Banco:**

```sql
-- Usuários
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  preferences TEXT
);

-- Emoções
CREATE TABLE emotions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  intensity INTEGER,
  icon TEXT
);

-- Categorias
CREATE TABLE categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  icon TEXT,
  color TEXT
);

-- Transações
CREATE TABLE expenses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  amount REAL NOT NULL,
  date TEXT NOT NULL,
  emotion_id INTEGER NOT NULL,
  category_id INTEGER NOT NULL,
  note TEXT,
  user_id INTEGER NOT NULL,
  type TEXT DEFAULT 'expense',
  FOREIGN KEY (emotion_id) REFERENCES emotions(id),
  FOREIGN KEY (category_id) REFERENCES categories(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Orçamentos
CREATE TABLE budgets (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  category_id INTEGER,
  monthly_limit REAL NOT NULL,
  month INTEGER NOT NULL,
  year INTEGER NOT NULL,
  alert_threshold INTEGER DEFAULT 80,
  user_id INTEGER NOT NULL,
  FOREIGN KEY (category_id) REFERENCES categories(id),
  UNIQUE(category_id, month, year, user_id)
);

-- Despesas Recorrentes
CREATE TABLE recurring_expenses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  frequency TEXT NOT NULL,
  amount REAL NOT NULL,
  category_id INTEGER NOT NULL,
  emotion_id INTEGER NOT NULL,
  note TEXT,
  start_date TEXT NOT NULL,
  end_date TEXT,
  is_active INTEGER DEFAULT 1,
  FOREIGN KEY (category_id) REFERENCES categories(id),
  FOREIGN KEY (emotion_id) REFERENCES emotions(id)
);

-- Tags
CREATE TABLE tags (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  color TEXT
);

-- Relação Expense-Tag
CREATE TABLE expense_tags (
  expense_id INTEGER NOT NULL,
  tag_id INTEGER NOT NULL,
  FOREIGN KEY (expense_id) REFERENCES expenses(id),
  FOREIGN KEY (tag_id) REFERENCES tags(id),
  PRIMARY KEY (expense_id, tag_id)
);
```

**Índices para Otimização:**

```sql
CREATE INDEX idx_expenses_date ON expenses(date);
CREATE INDEX idx_expenses_emotion ON expenses(emotion_id);
CREATE INDEX idx_expenses_category ON expenses(category_id);
CREATE INDEX idx_expenses_user ON expenses(user_id);
```

#### Sistema de Migrations

O aplicativo implementa um sistema robusto de migrations para gerenciar evolução do schema:

- **Versionamento**: Tabela `schema_version` rastreia versão atual
- **Migrations Incrementais**: Aplicadas sequencialmente
- **Backwards Compatibility**: Dados preservados durante upgrades
- **Versão Atual**: 3

**Histórico de Migrations:**

- v1: Schema inicial
- v2: Adição do campo `type` em expenses (gasto vs economia)
- v3: Tabelas de budgets, recurring_expenses, tags

### Tecnologias Utilizadas

#### Core Framework

- **React Native 0.81.5**: Framework para desenvolvimento mobile multiplataforma
- **Expo SDK 54**: Toolchain e serviços para React Native
- **TypeScript 5.3**: Tipagem estática para JavaScript

#### Navegação

- **React Navigation 7**: Navegação entre telas
  - Drawer Navigator: Menu lateral
  - Stack Navigator: Pilha de telas

#### Estado Global

- **Zustand 4.5**: Gerenciamento de estado leve e performático
  - Sem boilerplate excessivo
  - Performance otimizada
  - DevTools integration

#### Persistência

- **expo-sqlite 16**: Banco de dados SQLite
- **@react-native-async-storage/async-storage**: Armazenamento key-value para preferências

#### UI/UX

- **React Native Gesture Handler**: Gestos nativos
- **React Native Reanimated**: Animações performáticas
- **React Native Safe Area Context**: Gerenciamento de safe areas
- **@expo/vector-icons**: Ícones (Ionicons)

#### Gráficos e Visualização

- **React Native Chart Kit**: Gráficos de linha, barra e pizza
- **React Native SVG**: Renderização de gráficos

#### Recursos do Dispositivo

- **expo-notifications**: Notificações push locais
- **expo-image-picker**: Seleção de imagens da galeria
- **expo-document-picker**: Seleção de documentos
- **expo-file-system**: Manipulação de arquivos
- **expo-sharing**: Compartilhamento de arquivos

#### Utilitários

- **date-fns**: Manipulação e formatação de datas

#### Temas

- **Modo Claro/Escuro**: Sistema de temas customizável
- **ThemeContext**: Provider de tema global
- **Design System**: Cores, espaçamentos e tipografia padronizados

### Padrões de Design Implementados

1. **Repository Pattern**: Abstração da camada de dados
2. **Dependency Injection**: Injeção de dependências nos repositórios
3. **Singleton**: DatabaseManager
4. **Factory**: Métodos estáticos de criação em entidades
5. **Strategy**: Diferentes estratégias de exportação/importação
6. **Observer**: Zustand store notifica componentes de mudanças

---

## 📱 Utilização do Software

### Pré-requisitos

- **Node.js**: versão 18 ou superior
- **npm** ou **yarn**: gerenciador de pacotes
- **Expo Go**: aplicativo instalado no dispositivo móvel (iOS/Android)
- Ou **Android Studio** / **Xcode** para emuladores

### Instalação

1. **Clone o repositório:**

```bash
git clone https://github.com/arthurparreiras-07/app-gestao-financeira.git
cd app-gestao-financeira
```

2. **Instale as dependências:**

```bash
npm install --legacy-peer-deps
```

3. **Inicie o servidor de desenvolvimento:**

```bash
npm start
```

4. **Execute no dispositivo:**
   - **Android**: Pressione `a` ou execute `npm run android`
   - **iOS**: Pressione `i` ou execute `npm run ios`
   - **Expo Go**: Escaneie o QR code com o app Expo Go

### Primeira Utilização

#### 1. Inicialização Automática

Ao abrir o aplicativo pela primeira vez:

- ✅ Banco de dados é criado automaticamente
- ✅ Categorias padrão são inseridas (Alimentação, Transporte, Lazer, etc.)
- ✅ Emoções padrão são inseridas (Feliz, Triste, Ansioso, etc.)
- ✅ Usuário padrão é criado

#### 2. Dashboard Inicial (Home)

A tela principal exibe:

- **Resumo do Mês**: Total de gastos e economias
- **Últimas Transações**: Lista das transações recentes
- **Insights Automáticos**: Análises baseadas em seus dados
- **Alertas de Orçamento**: Avisos se estiver próximo do limite

### Fluxo de Uso Básico

#### Registrar uma Transação

1. **Acesse**: Toque no botão "+" flutuante ou menu → "Adicionar Gasto"
2. **Preencha os dados**:
   - **Tipo**: Gasto ou Economia
   - **Valor**: Digite o valor da transação
   - **Data**: Selecione data e hora
   - **Categoria**: Escolha a categoria apropriada
   - **Emoção**: Selecione como você se sentia no momento
   - **Observação**: Adicione notas (opcional)
   - **Tags**: Adicione tags para organização (opcional)
   - **Foto**: Anexe recibo ou comprovante (opcional)
3. **Salve**: Toque em "Salvar"

#### Visualizar Relatórios

1. **Acesse**: Menu → "Relatórios"
2. **Visualize**:
   - **Gráfico de Gastos por Categoria**: Pizza ou barras
   - **Gastos ao Longo do Tempo**: Linha temporal
   - **Análise Emocional**: Gastos por emoção
   - **Estatísticas**: Médias, totais, comparativos
3. **Filtre**: Por período (semana, mês, ano)

#### Configurar Orçamentos

1. **Acesse**: Menu → "Orçamentos"
2. **Adicione Orçamento**:
   - Selecione a categoria
   - Defina o limite mensal
   - Configure o percentual de alerta (padrão: 80%)
3. **Acompanhe**: Barra de progresso mostra consumo em tempo real
4. **Receba Alertas**: Notificação quando atingir o limite

#### Cadastrar Despesa Recorrente

1. **Acesse**: Menu → "Despesas Recorrentes"
2. **Adicione**:
   - Nome da despesa
   - Valor
   - Frequência (Mensal, Semanal, Anual)
   - Categoria e Emoção padrão
   - Data de início
3. **Automação**: O app gerará as transações automaticamente

#### Exportar Dados

1. **Acesse**: Menu → "Configurações"
2. **Exporte**:
   - Toque em "Exportar para CSV"
   - Escolha o período (opcional)
   - Compartilhe ou salve o arquivo
3. **Formato CSV**: Compatível com Excel, Google Sheets, etc.

### Funcionalidades Avançadas

#### Personalização de Categorias

1. **Acesse**: Menu → "Gerenciar Categorias"
2. **Adicione**: Nome, ícone e cor personalizada
3. **Edite**: Altere categorias existentes
4. **Exclua**: Remova categorias não utilizadas (se sem transações)

#### Personalização de Emoções

1. **Acesse**: Menu → "Gerenciar Emoções"
2. **Customize**: Nome, intensidade e ícone
3. **Organize**: Ordene por relevância

#### Sistema de Tags

1. **Crie Tags**: Na tela de tags ou ao adicionar transação
2. **Aplique**: Associe múltiplas tags a uma transação
3. **Filtre**: Use tags para encontrar transações específicas

#### Insights Automáticos

O aplicativo analisa seus dados e fornece insights como:

- 📊 "Você gasta 35% mais quando está estressado"
- 💰 "Você economizou 20% mais neste mês!"
- ⚠️ "Atenção: você está gastando muito em transporte"
- ✅ "Parabéns! Você está dentro do orçamento em todas categorias"

### Temas (Claro/Escuro)

1. **Acesse**: Menu → "Configurações"
2. **Alterne**: Toque no botão de tema
3. **Automático**: Sistema respeita preferência do dispositivo

---

## 🎯 Conclusão

### Resultados Alcançados

O **MindBudget** foi desenvolvido com sucesso como uma solução completa de gestão financeira com foco na dimensão emocional dos gastos. O projeto atingiu todos os objetivos propostos:

✅ **Arquitetura Sólida**: Implementação da Clean Architecture garantiu código organizado, testável e manutenível

✅ **Funcionalidades Completas**:

- Gestão completa de transações (gastos e economias)
- Análise emocional de padrões de consumo
- Sistema de orçamentos e alertas
- Despesas recorrentes automatizadas
- Relatórios visuais com gráficos
- Exportação/importação de dados

✅ **Experiência do Usuário**:

- Interface intuitiva e responsiva
- Temas claro e escuro
- Animações fluidas
- Feedback visual consistente

✅ **Persistência Robusta**:

- Sistema de migrations para evolução do banco
- Armazenamento local (privacidade garantida)
- Performance otimizada com índices

✅ **Tecnologia Moderna**:

- React Native para multiplataforma (iOS/Android)
- TypeScript para maior segurança de tipos
- Expo para desenvolvimento ágil

### Diferenciais do Projeto

1. **Inovação Conceitual**: Correlação única entre emoções e finanças
2. **Privacidade First**: Dados armazenados localmente, sem servidor externo
3. **Insights Inteligentes**: Análise automática de padrões comportamentais
4. **Arquitetura Profissional**: Clean Architecture facilita manutenção e testes
5. **Código Limpo**: Seguindo princípios SOLID e boas práticas

### Possibilidades de Expansão Futura

Embora o aplicativo esteja completo e funcional, há oportunidades de evolução:

**Recursos Técnicos:**

- 🔄 Sincronização em nuvem (opcional)
- 🧪 Testes automatizados (unitários e E2E)
- 📊 Mais tipos de gráficos e visualizações
- 🤖 Machine Learning para previsões financeiras
- 🔔 Notificações inteligentes baseadas em padrões

**Recursos de Negócio:**

- 👥 Compartilhamento de orçamentos (família/casal)
- 💳 Integração com bancos (Open Banking)
- 🎯 Metas de economia com gamificação
- 📈 Consultoria financeira automatizada
- 🌍 Suporte a múltiplas moedas

**Experiência do Usuário:**

- 🎨 Mais temas personalizáveis
- 🌐 Internacionalização (múltiplos idiomas)
- ♿ Acessibilidade aprimorada
- 🎙️ Entrada de dados por voz
- 📸 OCR para digitalização de recibos

### Lições Aprendidas

Durante o desenvolvimento, alguns aprendizados importantes:

1. **Clean Architecture**: A separação de camadas facilitou muito a manutenção e evolução do código
2. **TypeScript**: A tipagem estática preveniu inúmeros bugs em tempo de desenvolvimento
3. **Zustand**: Gerenciamento de estado mais simples que Redux, mas igualmente poderoso
4. **SQLite Migrations**: Sistema de versionamento é essencial para apps em produção
5. **Expo**: Acelerou desenvolvimento mas requer atenção às limitações de módulos nativos

### Considerações Finais

O **MindBudget** representa não apenas um aplicativo de gestão financeira, mas uma ferramenta de autoconhecimento. Ao entender a relação entre emoções e gastos, os usuários podem tomar decisões mais conscientes e desenvolver uma relação mais saudável com o dinheiro.

O projeto demonstra a aplicação prática de conceitos modernos de desenvolvimento mobile, incluindo arquitetura limpa, padrões de design, persistência de dados e UX/UI responsiva. É uma solução completa, pronta para uso real e com potencial de impacto positivo na vida financeira dos usuários.

**Tecnologias utilizadas:** React Native, TypeScript, Expo, SQLite, Zustand, React Navigation

**Licença:** MIT

**Desenvolvido por:** Arthur Parreiras

**Repositório:** https://github.com/arthurparreiras-07/app-gestao-financeira

---

<div align="center">
  <p>💙 Desenvolvido com carinho para ajudar você a entender suas finanças e emoções</p>
  <p><strong>MindBudget</strong> - Sua mente, seu orçamento, seu controle</p>
</div>
