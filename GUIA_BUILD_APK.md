# 📱 Guia Completo - Gerar APK do MindBudget

## 🎯 Métodos Disponíveis

### **Método 1: EAS Build (Recomendado)** ⭐

- ✅ Mais moderno e atualizado
- ✅ Build na nuvem (não precisa de Android Studio)
- ✅ Configuração simples
- ✅ Suporta Expo SDK 54
- ❌ Requer conta Expo (gratuita)

### **Método 2: Expo Classic Build (Descontinuado)**

- ⚠️ Será removido em 2025
- ⚠️ Não recomendado para novos projetos

---

## 🚀 MÉTODO 1: EAS Build (Passo a Passo)

### Passo 1: Instalar EAS CLI

```bash
npm install -g eas-cli
```

### Passo 2: Login na Expo

```bash
# Se não tem conta, crie uma gratuitamente em expo.dev
eas login
```

### Passo 3: Configurar o Projeto

```bash
# Gera o projectId e vincula à sua conta
eas build:configure
```

Isso vai atualizar o `app.json` com o `projectId` automaticamente.

### Passo 4: Criar Assets (Ícones e Splash Screen)

**Opção A - Usar assets padrão do Expo:**

```bash
# Criar pasta assets se não existir
mkdir -p assets

# Baixar assets de exemplo (ou criar os seus)
# icon.png: 1024x1024px
# splash.png: 1284x2778px
# adaptive-icon.png: 1024x1024px (Android)
```

**Opção B - Gerar automaticamente:**

```bash
# Se tiver um logo, use:
npx expo-app-icon generate --icon ./path/to/your-logo.png
```

### Passo 5: Gerar o APK

#### Para **Teste/Desenvolvimento** (Preview):

```bash
eas build -p android --profile preview
```

#### Para **Produção** (APK Final):

```bash
eas build -p android --profile production
```

#### Para Build **Local** (sem upload):

```bash
eas build -p android --profile preview --local
```

> ⚠️ Requer Android SDK instalado localmente

### Passo 6: Acompanhar o Build

- O build acontece na nuvem da Expo
- Você verá um link no terminal (ex: `https://expo.dev/accounts/seu-usuario/projects/mindbudget/builds/123`)
- Acompanhe o progresso no navegador
- Tempo estimado: 5-15 minutos

### Passo 7: Baixar o APK

Quando o build terminar:

```bash
# O link do APK aparecerá no terminal
# Ou acesse: https://expo.dev/accounts/[seu-usuario]/projects/mindbudget/builds

# Baixe diretamente via CLI:
eas build:list
```

O APK estará pronto para instalar em qualquer Android!

---

## 📦 MÉTODO 2: Build Local (Alternativa)

Se preferir build 100% local (sem Expo Cloud):

### Requisitos:

- Android Studio instalado
- Android SDK configurado
- JDK 17+

### Passos:

```bash
# 1. Instalar dependências globais
npm install -g eas-cli

# 2. Pré-build (gera pasta android/)
npx expo prebuild --platform android

# 3. Build local com Gradle
cd android
./gradlew assembleRelease

# 4. O APK estará em:
# android/app/build/outputs/apk/release/app-release.apk
```

---

## 🔐 Assinatura do APK (Para Play Store)

### Gerar Keystore (necessário para publicar):

```bash
# 1. Gerar keystore
keytool -genkeypair -v -keystore mindbudget.keystore \
  -alias mindbudget-key -keyalg RSA -keysize 2048 -validity 10000

# 2. Configurar no eas.json
```

Adicione em `eas.json`:

```json
{
  "build": {
    "production": {
      "android": {
        "buildType": "apk",
        "credentialsSource": "local"
      }
    }
  }
}
```

---

## 📋 Checklist Pré-Build

Antes de gerar o APK, verifique:

- [ ] `app.json` configurado (nome, versão, package)
- [ ] `eas.json` criado
- [ ] Assets criados (icon.png, splash.png, adaptive-icon.png)
- [ ] Permissões configuradas no `app.json`
- [ ] Testado no Expo Go ou emulador
- [ ] Versão atualizada (`version` e `versionCode`)

---

## 🎨 Criar Assets Necessários

### 1. Icon (1024x1024px)

Ícone principal do app. Pode ser criado em:

- Figma (gratuito)
- Canva (gratuito)
- Adobe Illustrator

### 2. Splash Screen (1284x2778px)

Tela de carregamento. Use:

- Fundo sólido com logo centralizado
- Cor de fundo: `#4F46E5` (roxo do MindBudget)

### 3. Adaptive Icon (1024x1024px)

Ícone adaptativo Android:

- Área segura: círculo central (66% do tamanho)
- Fundo transparente ou sólido

### Ferramentas Online:

- https://easyappicon.com/
- https://appicon.co/
- https://makeappicon.com/

---

## 🐛 Troubleshooting

### Erro: "expo-updates" não configurado

```bash
npx expo install expo-updates
```

### Erro: "Android SDK not found"

- Instale Android Studio
- Configure ANDROID_HOME:

```bash
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

### Erro: "Build failed - memory"

Use build na nuvem (EAS) em vez de local:

```bash
eas build -p android --profile preview
```

### Erro: "Invalid package name"

- Package deve ser: `com.empresa.app` (sem espaços, sem caracteres especiais)
- Edite em `app.json` → `android.package`

---

## 📊 Comparação de Builds

| Característica        | EAS Build    | Build Local |
| --------------------- | ------------ | ----------- |
| Configuração          | Simples      | Complexa    |
| Requer Android Studio | ❌           | ✅          |
| Velocidade            | Moderada     | Rápida\*    |
| Custo                 | Gratuito\*\* | Gratuito    |
| Manutenção            | Baixa        | Alta        |

> \*Depende do hardware local  
> \*\*Plano gratuito: 30 builds/mês

---

## 🚀 Comando Rápido (TL;DR)

```bash
# Instalação única
npm install -g eas-cli
eas login
eas build:configure

# Gerar APK (toda vez)
eas build -p android --profile preview
```

Aguarde 5-15 minutos e baixe o APK do link fornecido! 🎉

---

## 📱 Instalar APK no Android

### Método 1: Transferir via USB

1. Conecte o celular no PC
2. Copie o APK para o celular
3. Abra o APK no celular
4. Permita "Instalar de fontes desconhecidas"
5. Instale normalmente

### Método 2: Via Link (EAS Build)

1. Abra o link do build no celular
2. Clique em "Install"
3. Baixe e instale

### Método 3: Via QR Code

1. O EAS gera um QR Code
2. Escaneie com a câmera do Android
3. Baixe e instale

---

## 🎯 Publicar na Play Store (Opcional)

### Requisitos:

- Conta Google Play Console (US$ 25 única vez)
- APK assinado (AAB format)
- Screenshots (mínimo 2)
- Descrição do app
- Política de privacidade

### Build para Play Store:

```bash
# Gera AAB (Android App Bundle) em vez de APK
eas build -p android --profile production
```

AAB é o formato exigido pela Google Play Store.

---

## 📞 Recursos Úteis

- **Documentação EAS Build:** https://docs.expo.dev/build/introduction/
- **Expo Dashboard:** https://expo.dev/
- **Troubleshooting:** https://docs.expo.dev/build-reference/troubleshooting/
- **Fórum Expo:** https://forums.expo.dev/

---

## ✅ Resultado Final

Ao final, você terá:

- ✅ **mindbudget.apk** (~50-100 MB)
- ✅ Instalável em qualquer Android 5.0+
- ✅ Funcional sem Expo Go
- ✅ Pronto para distribuição

---

**Dúvidas? Siga o passo a passo acima ou use o comando rápido!** 🚀
