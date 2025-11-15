# 📱 RESUMO: Como Gerar APK do MindBudget

## ✅ Arquivos Criados

Criei todos os arquivos necessários para você:

1. ✅ **app.json** - Configuração do app (nome, ícone, permissões)
2. ✅ **eas.json** - Configuração de build (preview e production)
3. ✅ **build-apk.sh** - Script automatizado 🔥
4. ✅ **package.json** - Scripts npm adicionados

---

## 🚀 MÉTODO MAIS FÁCIL (Recomendado)

### Opção 1: Script Automatizado
```bash
cd "/home/user/Documents/PUC Minas/app-gestao-financeira"
bash build-apk.sh
```

O script faz TUDO automaticamente:
- ✅ Instala EAS CLI
- ✅ Verifica/cria assets
- ✅ Faz login na Expo
- ✅ Configura o projeto
- ✅ Gera o APK

---

## 🎯 MÉTODO RÁPIDO (Manual)

### Passo a passo:

```bash
# 1. Instalar EAS CLI (só uma vez)
npm install -g eas-cli

# 2. Login na Expo (crie conta gratuita se não tiver)
eas login

# 3. Ir para o diretório do projeto
cd "/home/user/Documents/PUC Minas/app-gestao-financeira"

# 4. Configurar projeto
eas build:configure

# 5. Gerar APK para teste
npm run build:apk

# OU diretamente:
eas build -p android --profile preview
```

**Aguarde 5-15 minutos** e o link do APK aparecerá no terminal! 🎉

---

## ⚠️ ANTES DE BUILDAR: Criar Assets

Você precisa criar a pasta `assets/` com 3 imagens:

### Opção 1 - Placeholders Rápidos (temporário):
```bash
mkdir -p assets
cd assets

# Baixar placeholders (requer wget)
wget "https://via.placeholder.com/1024x1024/4F46E5/FFFFFF?text=MindBudget" -O icon.png
wget "https://via.placeholder.com/1024x1024/4F46E5/FFFFFF?text=MB" -O adaptive-icon.png
wget "https://via.placeholder.com/1284x2778/4F46E5/FFFFFF?text=MindBudget" -O splash.png

cd ..
```

### Opção 2 - Criar Próprios Ícones:
Use Canva, Figma ou qualquer editor:
- **icon.png**: 1024x1024px (ícone principal)
- **adaptive-icon.png**: 1024x1024px (ícone Android)
- **splash.png**: 1284x2778px (tela de carregamento)

**Cor sugerida:** `#4F46E5` (roxo do MindBudget)

---

## 📋 TRÊS OPÇÕES DE BUILD

### 1️⃣ Preview (Teste rápido) - RECOMENDADO
```bash
npm run build:apk
# OU
eas build -p android --profile preview
```
- ⏱️ Mais rápido
- 📦 APK para instalar em qualquer Android
- 🎯 Ideal para testes

### 2️⃣ Production (Final otimizado)
```bash
npm run build:prod
# OU
eas build -p android --profile production
```
- ⏱️ Um pouco mais lento
- 🚀 Otimizado e compactado
- 📱 Pronto para publicar

### 3️⃣ Local (Sem nuvem)
```bash
npm run build:local
# OU
npx expo prebuild --platform android
cd android
./gradlew assembleRelease
```
- ⚠️ Requer Android Studio instalado
- 💻 Build no seu computador
- 📁 APK em: `android/app/build/outputs/apk/release/app-release.apk`

---

## 🎬 PROCESSO COMPLETO (Passo a Passo Visual)

```
┌─────────────────────────────────────────┐
│ 1. Criar Assets (icon.png, splash.png) │
└────────────────┬────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│ 2. Instalar EAS CLI                     │
│    npm install -g eas-cli               │
└────────────────┬────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│ 3. Login na Expo                        │
│    eas login                            │
└────────────────┬────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│ 4. Configurar Projeto                   │
│    eas build:configure                  │
└────────────────┬────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│ 5. Gerar APK                            │
│    eas build -p android --profile preview│
└────────────────┬────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│ 6. Aguardar Build (5-15 min) ☕         │
└────────────────┬────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│ 7. Baixar APK do Link                   │
└────────────────┬────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│ 8. Instalar no Android 📱               │
└─────────────────────────────────────────┘
```

---

## 📥 APÓS O BUILD

### Você receberá:

1. **Link no terminal** - Ex: `https://expo.dev/accounts/seu-usuario/...`
2. **Email de confirmação** (se cadastrou email)
3. **APK pronto para download** (~50-100 MB)

### Como instalar:

**No Android:**
1. Baixe o APK
2. Abra o arquivo
3. Permita "Fontes desconhecidas" se solicitado
4. Instale normalmente

**Via QR Code:**
- O EAS gera um QR Code
- Escaneie com o celular
- Baixe e instale direto

---

## 🐛 Soluções para Problemas Comuns

### ❌ "eas: command not found"
```bash
npm install -g eas-cli
# OU
sudo npm install -g eas-cli
```

### ❌ "Assets not found"
```bash
# Crie a pasta e adicione placeholders
mkdir -p assets
# Depois adicione as 3 imagens PNG
```

### ❌ "Not logged in"
```bash
eas login
# Crie conta gratuita em expo.dev se não tiver
```

### ❌ "Build failed"
- Verifique se app.json está correto
- Verifique se os assets existem
- Veja os logs em expo.dev

---

## 📊 COMPARAÇÃO: Qual Método Usar?

| Método | Facilidade | Velocidade | Requer |
|--------|-----------|-----------|--------|
| **Script Automatizado** | ⭐⭐⭐⭐⭐ | Rápida | Nada |
| **EAS Build (Nuvem)** | ⭐⭐⭐⭐ | Moderada | Conta Expo |
| **Build Local** | ⭐⭐ | Rápida* | Android Studio |

**Recomendação:** Use o **script automatizado** (`build-apk.sh`)

---

## ✅ CHECKLIST FINAL

Antes de gerar o APK:

- [ ] ✅ Criou arquivos de configuração (já feito!)
- [ ] ✅ app.json configurado (já feito!)
- [ ] ✅ eas.json criado (já feito!)
- [ ] ⏳ Assets criados (icon.png, splash.png, adaptive-icon.png)
- [ ] ⏳ Conta Expo criada (gratuita em expo.dev)
- [ ] ⏳ EAS CLI instalado (`npm install -g eas-cli`)

**Pronto para gerar o APK!** 🚀

---

## 🎯 COMANDO FINAL (TL;DR)

Se já tem tudo configurado:

```bash
cd "/home/user/Documents/PUC Minas/app-gestao-financeira"
eas build -p android --profile preview
```

Aguarde 10 minutos e receba o link do APK! 📱✨

---

## 📚 Guias Completos Criados

1. **INICIO_RAPIDO.md** - Guia super resumido
2. **GUIA_BUILD_APK.md** - Guia completo e detalhado
3. **CRIAR_ASSETS.md** - Como criar ícones e splash
4. **build-apk.sh** - Script automatizado
5. **README_APK.md** - Este arquivo (resumo)

**Leia qualquer um desses arquivos para mais detalhes!**

---

**Boa sorte com o build! 🎉📱**
