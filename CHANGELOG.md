# Changelog

Todas as mudanças notáveis neste projeto serão documentadas aqui.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/lang/pt-BR/).

## [2.0.0] - 2025-11-16

### Adicionado

- Sistema de orçamentos mensais com progress tracking visual
- Transações recorrentes automáticas (diária, semanal, mensal, anual)
- Tags personalizadas com cores customizáveis
- Anexos de fotos em transações (múltiplas imagens)
- Busca avançada com filtros por categoria, emoção, data e valor
- Exportação de dados em CSV, JSON e relatórios TXT
- Dark mode completo em todas as telas
- Relatórios visuais com gráficos de pizza por categoria e emoção
- Sistema de insights automáticos baseado no comportamento
- Separação entre gastos e economias
- Modal de ações em transações (long press)

### Modificado

- Interface completamente redesenhada
- Navegação atualizada com Bottom Tabs
- Performance otimizada com useMemo
- Database migrado para versão 3 (schema expandido)
- Store centralizado com Zustand
- Tema dark/light mode dinâmico

### Técnico

- Migração para TypeScript 5.3.3
- Implementação de Clean Architecture
- 9 tabelas no banco de dados SQLite
- 6 repositórios com interfaces
- 3 services (Insights, Recurring, Export)
- Migrations automáticas
- ~4.800 linhas de código TypeScript/TSX

## [1.0.0] - 2025-11-01

### Adicionado

- Registro de gastos e economias
- Análise emocional de transações
- 7 emoções padrão (Feliz, Triste, Estressado, Ansioso, etc)
- 8 categorias padrão (Alimentação, Transporte, Lazer, etc)
- Dashboard com resumo de gastos
- Insights automáticos básicos
- Tela de relatórios simples
- Persistência local com SQLite
- Configurações básicas (tema)

### Inicial

- Estrutura base do projeto
- Configuração Expo
- Setup React Navigation
- Integração SQLite
- Componentes base (EmotionSelector, CategorySelector)
