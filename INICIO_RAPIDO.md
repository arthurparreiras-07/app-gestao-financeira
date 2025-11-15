# 🚀 INÍCIO RÁPIDO - Gerar APK em 5 Minutos

## Comandos para copiar e colar:

### 1️⃣ Instalar EAS CLI (só precisa fazer uma vez)

```bash
npm install -g eas-cli
```

### 2️⃣ Fazer login na Expo

```bash
eas login
# Se não tem conta: crie gratuitamente em expo.dev
```

### 3️⃣ Configurar o projeto

```bash
cd "/home/user/Documents/PUC Minas/app-gestao-financeira"
eas build:configure
```

### 4️⃣ Gerar o APK

```bash
eas build -p android --profile preview
```

### ✅ Pronto!

- Aguarde 5-15 minutos
- O link do APK aparecerá no terminal
- Baixe e instale no seu Android

---

## ⚠️ IMPORTANTE: Assets Necessários

Antes de rodar o build, você precisa criar a pasta `assets` com:

### Opção 1 - Criar placeholders temporários:

```bash
mkdir -p assets
# Depois coloque qualquer imagem PNG como:
# - icon.png (1024x1024px)
# - splash.png (1284x2778px)
# - adaptive-icon.png (1024x1024px)
```

### Opção 2 - Pular por enquanto:

Edite `app.json` e remova as linhas dos ícones temporariamente.

---

## 🎯 Alternativa: Build Local (sem conta Expo)

Se preferir não criar conta:

```bash
# 1. Pré-build
npx expo prebuild --platform android

# 2. Build
cd android
./gradlew assembleRelease

# 3. APK estará em:
# android/app/build/outputs/apk/release/app-release.apk
```

> ⚠️ Requer Android Studio instalado
