#!/bin/bash

# 🚀 Script Automatizado - Gerar APK do MindBudget
# Uso: bash build-apk.sh

set -e  # Para se houver erro

echo "🎯 Iniciando processo de build do APK..."
echo ""

# Verificar se está no diretório correto
if [ ! -f "package.json" ]; then
    echo "❌ Erro: Execute este script na raiz do projeto!"
    exit 1
fi

# 1. Verificar se EAS CLI está instalado
echo "📦 Verificando EAS CLI..."
if ! command -v eas &> /dev/null; then
    echo "⚙️  Instalando EAS CLI globalmente..."
    npm install -g eas-cli
else
    echo "✅ EAS CLI já instalado"
fi

# 2. Verificar assets
echo ""
echo "🎨 Verificando assets..."
if [ ! -d "assets" ] || [ ! -s "assets/icon.png" ] || [ ! -s "assets/adaptive-icon.png" ] || [ ! -s "assets/splash.png" ]; then
    echo "⚠️  Assets ausentes ou vazios. Gerando automaticamente..."
    
    # Usar o script Python para gerar assets
    if command -v python3 &> /dev/null; then
        echo "   Gerando assets com Python..."
        python3 generate-assets.py
        echo "   ✅ Assets criados!"
    else
        echo "   ❌ Python3 não encontrado. Instale Python3 ou crie os assets manualmente:"
        echo "      - assets/icon.png (1024x1024px)"
        echo "      - assets/adaptive-icon.png (1024x1024px)"
        echo "      - assets/splash.png (1284x2778px)"
        echo ""
        read -p "   Pressione ENTER quando os assets estiverem prontos..."
    fi
else
    echo "✅ Assets válidos encontrados"
fi

# 3. Verificar login
echo ""
echo "👤 Verificando autenticação..."
if ! eas whoami &> /dev/null; then
    echo "⚠️  Você precisa fazer login na Expo:"
    echo ""
    eas login
else
    echo "✅ Já está logado como: $(eas whoami)"
fi

# 4. Configurar projeto (se necessário)
echo ""
echo "⚙️  Configurando projeto EAS..."
if [ ! -f "eas.json" ]; then
    echo "   eas.json não encontrado. Executando configure..."
    eas build:configure
else
    echo "✅ eas.json já configurado"
fi

# 5. Escolher tipo de build
echo ""
echo "📱 Escolha o tipo de build:"
echo "   1) Preview (APK para testes - mais rápido)"
echo "   2) Production (APK final otimizado)"
echo "   3) Local (build no seu computador - requer Android SDK)"
echo ""
read -p "Opção (1-3): " BUILD_TYPE

case $BUILD_TYPE in
    1)
        echo ""
        echo "🔨 Iniciando build PREVIEW na nuvem..."
        eas build -p android --profile preview
        ;;
    2)
        echo ""
        echo "🔨 Iniciando build PRODUCTION na nuvem..."
        eas build -p android --profile production
        ;;
    3)
        echo ""
        echo "🔨 Iniciando build LOCAL..."
        echo "⚠️  Isso requer Android SDK instalado!"
        read -p "Continuar? (s/n): " CONFIRM
        if [ "$CONFIRM" = "s" ]; then
            npx expo prebuild --platform android
            cd android
            ./gradlew assembleRelease
            echo ""
            echo "✅ APK gerado em: android/app/build/outputs/apk/release/app-release.apk"
        else
            echo "❌ Build local cancelado"
            exit 0
        fi
        ;;
    *)
        echo "❌ Opção inválida"
        exit 1
        ;;
esac

echo ""
echo "✅ Processo concluído!"
echo ""
echo "📥 Próximos passos:"
echo "   1. Aguarde o build terminar (5-15 minutos)"
echo "   2. O link do APK aparecerá no terminal"
echo "   3. Baixe e instale no seu Android"
echo ""
echo "🔗 Você também pode acessar: https://expo.dev/accounts/$(eas whoami)/projects/mindbudget/builds"
echo ""
