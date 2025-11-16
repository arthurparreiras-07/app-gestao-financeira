#!/bin/bash

# 🧹 Script de Limpeza do MindBudget
# Remove arquivos temporários e pastas de build

echo "🧹 Iniciando limpeza do projeto MindBudget..."
echo ""

# Função para remover com confirmação
remove_with_size() {
    local path=$1
    if [ -d "$path" ] || [ -f "$path" ]; then
        local size=$(du -sh "$path" 2>/dev/null | cut -f1)
        echo "  📁 $path ($size)"
        return 0
    fi
    return 1
}

# 1. Limpar pastas de build
echo "🔨 Removendo pastas de build..."
remove_with_size "android" && rm -rf android
remove_with_size "ios" && rm -rf ios
echo "  ✅ Build folders removidas"
echo ""

# 2. Limpar cache do Expo
echo "📦 Removendo cache do Expo..."
remove_with_size ".expo" && rm -rf .expo
echo "  ✅ Expo cache limpo"
echo ""

# 3. Limpar node_modules (opcional)
read -p "❓ Remover node_modules? (s/N): " remove_modules
if [[ $remove_modules =~ ^[Ss]$ ]]; then
    echo "📦 Removendo node_modules..."
    remove_with_size "node_modules" && rm -rf node_modules
    echo "  ✅ node_modules removido"
    echo "  💡 Execute 'npm install' para reinstalar"
    echo ""
fi

# 4. Limpar arquivos de log
echo "📝 Removendo arquivos de log..."
find . -name "*.log" -type f -delete 2>/dev/null
find . -name "npm-debug.log*" -type f -delete 2>/dev/null
echo "  ✅ Logs removidos"
echo ""

# 5. Limpar arquivos temporários
echo "🗑️  Removendo arquivos temporários..."
find . -name "*.tmp" -type f -delete 2>/dev/null
find . -name "*.swp" -type f -delete 2>/dev/null
find . -name "*.swo" -type f -delete 2>/dev/null
find . -name ".DS_Store" -type f -delete 2>/dev/null
echo "  ✅ Temporários removidos"
echo ""

# Resumo
echo "✨ Limpeza concluída!"
echo ""
echo "📊 Espaço liberado:"
echo "  - Builds (android/ios)"
echo "  - Cache (.expo)"
echo "  - Logs (*.log)"
echo "  - Temporários (*.tmp, *.swp)"
if [[ $remove_modules =~ ^[Ss]$ ]]; then
    echo "  - node_modules"
fi
echo ""
echo "💡 Próximos passos:"
if [[ $remove_modules =~ ^[Ss]$ ]]; then
    echo "  1. npm install (reinstalar dependências)"
    echo "  2. npm start (iniciar o projeto)"
else
    echo "  1. npm start (iniciar o projeto)"
fi
echo ""
echo "✅ Projeto limpo e pronto!"
