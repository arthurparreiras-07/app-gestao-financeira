# 🎨 Criar Assets para o APK

## O que você precisa:

### 1. **icon.png** (1024x1024px)

- Ícone principal do aplicativo
- Quadrado com bordas arredondadas
- Fundo colorido ou transparente

### 2. **splash.png** (1284x2778px)

- Tela de carregamento
- Vertical (retrato)
- Recomendado: logo centralizado com fundo sólido

### 3. **adaptive-icon.png** (1024x1024px)

- Para Android (ícone adaptativo)
- Área segura: círculo central (66%)

---

## 🛠️ Ferramentas Online Gratuitas

### Criar Ícones:

- **Canva**: https://www.canva.com/ (gratuito)
- **Figma**: https://www.figma.com/ (gratuito)
- **App Icon Generator**: https://www.appicon.co/

### Gerar Splash Screen:

- **Expo Splash Screen Tool**: https://github.com/expo/expo-cli
- **Figma Template**: https://www.figma.com/community/file/1155362909441341285

---

## 💡 Sugestão para MindBudget

### Cores do App:

- **Primária**: `#4F46E5` (Roxo/Indigo)
- **Background**: `#FFFFFF` (Branco) ou `#1F2937` (Escuro)
- **Accent**: `#10B981` (Verde)

### Design Simples:

```
┌─────────────────────────┐
│                         │
│                         │
│        💰 🧠           │
│     MindBudget         │
│                         │
│    Fundo: #4F46E5      │
│    Texto: Branco       │
│                         │
└─────────────────────────┘
```

### Emoji como ícone temporário:

Use 💰 ou 🧠 em um fundo colorido até ter um designer.

---

## 🚀 Opção Rápida: Usar Placeholders

Se quiser apenas testar o build:

```bash
# Crie assets básicos (requer ImageMagick)
convert -size 1024x1024 xc:#4F46E5 -gravity center \
  -pointsize 400 -fill white -annotate +0+0 "💰" \
  assets/icon.png

convert -size 1024x1024 xc:#4F46E5 \
  assets/adaptive-icon.png

convert -size 1284x2778 xc:#4F46E5 -gravity center \
  -pointsize 200 -fill white -annotate +0+0 "MindBudget" \
  assets/splash.png
```

Ou simplesmente use qualquer PNG que você tenha!

---

## ⚡ Solução Mais Rápida

### Baixar templates prontos:

```bash
mkdir -p assets
cd assets

# Baixar exemplo (substitua por suas imagens depois)
wget https://via.placeholder.com/1024x1024/4F46E5/FFFFFF?text=MindBudget -O icon.png
wget https://via.placeholder.com/1024x1024/4F46E5/FFFFFF?text=MindBudget -O adaptive-icon.png
wget https://via.placeholder.com/1284x2778/4F46E5/FFFFFF?text=MindBudget -O splash.png

cd ..
```

Isso cria placeholders funcionais que você pode substituir depois!

---

## 📝 Checklist de Assets

- [ ] Pasta `assets/` criada
- [ ] `icon.png` (1024x1024px) ✅
- [ ] `adaptive-icon.png` (1024x1024px) ✅
- [ ] `splash.png` (1284x2778px) ✅
- [ ] Ícones testados no Expo

**Pronto para build!** 🎉
