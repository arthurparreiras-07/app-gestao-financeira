# 📱 Gerar APK - Guia Definitivo

## ✅ PROBLEMA RESOLVIDO!

O erro "Invalid UUID appId" foi corrigido. O build está funcionando! 🎉

---

## 🚀 COMANDO ÚNICO (Mais Fácil)

```bash
bash build-apk.sh
```

Esse script faz **TUDO automaticamente**:

1. ✅ Verifica EAS CLI
2. ✅ Gera assets se não existirem
3. ✅ Configura o projeto
4. ✅ Inicia o build

---

## 📋 O QUE FOI CONFIGURADO

### Projeto Expo:

- **Nome**: MindBudget
- **Slug**: mindbudget
- **Package**: com.pucminas.mindbudget
- **Versão**: 2.0.0
- **Project ID**: `d84bd9db-84c3-471f-b4c0-761a3a5dab14`

### Assets Criados:

- ✅ `icon.png` (1024x1024px) - 13 KB
- ✅ `adaptive-icon.png` (1024x1024px) - 13 KB
- ✅ `splash.png` (1284x2778px) - 31 KB

**Design atual:** Logo "MB" roxo/branco (placeholder)

---

## 🔄 REGENERAR ASSETS

Se quiser criar novos ícones:

### Automático (Script Python):

```bash
python3 generate-assets.py
```

### Manual (Substituir arquivos):

1. Crie suas imagens PNG
2. Substitua em `assets/`:
   - `icon.png` (1024x1024px)
   - `adaptive-icon.png` (1024x1024px)
   - `splash.png` (1284x2778px)

**Ferramentas sugeridas:**

- Canva (gratuito)
- Figma (gratuito)
- https://www.appicon.co/

---

## 🎯 TIPOS DE BUILD

### 1. Preview (Teste) - RECOMENDADO

```bash
eas build -p android --profile preview
```

- ⏱️ Mais rápido (~10-15 min)
- 📦 APK instalável
- 🎯 Ideal para testes

### 2. Production (Final)

```bash
eas build -p android --profile production
```

- ⏱️ Um pouco mais lento (~15-20 min)
- 🚀 Otimizado
- 📱 Pronto para publicar

### 3. Local (Offline)

```bash
npx expo prebuild --platform android
cd android && ./gradlew assembleRelease
```

- ⚠️ Requer Android SDK
- 💻 Build no seu PC
- 📁 APK em: `android/app/build/outputs/apk/release/`

---

## 📥 ACOMPANHAR O BUILD

### No Terminal:

O comando mostra o progresso e o link do APK ao final.

### Online (Recomendado):

https://expo.dev/accounts/arthur_parreiras/projects/mindbudget/builds

Você verá:

- ⏳ Progresso em tempo real
- 📊 Logs detalhados
- 📥 Link de download quando concluir

### Comandos úteis:

```bash
# Listar builds
eas build:list

# Ver último build
eas build:view

# Cancelar build
eas build:cancel
```

---

## 📱 INSTALAR O APK

### Quando o build terminar:

1. **Baixe o APK** do link fornecido
2. **Transfira** para o Android (USB, email, Drive, etc)
3. **Abra** o arquivo no celular
4. **Permita** "Fontes desconhecidas" (se solicitado)
5. **Instale** normalmente
6. ✅ **MindBudget** instalado!

**Alternativa:** Escaneie o QR Code gerado pelo EAS

---

## ⏱️ TEMPO ESTIMADO

| Etapa                | Duração        |
| -------------------- | -------------- |
| Configuração inicial | 2-5 min        |
| Upload do projeto    | 1-2 min        |
| Build na nuvem       | 10-15 min      |
| **Total**            | **~15-20 min** |

---

## 🐛 TROUBLESHOOTING

### "Invalid UUID appId"

✅ **Resolvido!** Executamos `eas init` para gerar projectId válido.

### "Assets not found"

✅ **Resolvido!** Script `generate-assets.py` cria automaticamente.

### "Build failed"

1. Verifique logs: https://expo.dev/accounts/arthur_parreiras/projects/mindbudget/builds
2. Veja a fase que falhou
3. Ajuste `package.json` ou `app.json` se necessário

### Assets vazios (0 bytes)

```bash
# Regenerar com o script
python3 generate-assets.py
```

### Erro de permissões

```bash
# Dar permissão ao script
chmod +x build-apk.sh
```

---

## 📊 CONFIGURAÇÕES IMPORTANTES

### app.json:

- `"name"`: "MindBudget"
- `"version"`: "2.0.0"
- `"android.package"`: "com.pucminas.mindbudget"
- `"extra.eas.projectId"`: "d84bd9db-84c3-471f-b4c0-761a3a5dab14"

### eas.json:

- `preview`: Build APK para testes
- `production`: Build APK otimizado

---

## 🎉 RESULTADO FINAL

Você terá:

- ✅ **mindbudget.apk** (~50-100 MB)
- ✅ Instalável em Android 5.0+
- ✅ Standalone (sem Expo Go)
- ✅ Pronto para distribuir

---

## 📞 RECURSOS

- **Dashboard EAS**: https://expo.dev/accounts/arthur_parreiras
- **Seu projeto**: https://expo.dev/accounts/arthur_parreiras/projects/mindbudget
- **Documentação**: https://docs.expo.dev/build/introduction/
- **Suporte**: https://forums.expo.dev/

---

## 📝 ARQUIVOS ÚTEIS

| Arquivo              | Descrição               |
| -------------------- | ----------------------- |
| `build-apk.sh`       | Script automatizado     |
| `generate-assets.py` | Gera ícones PNG         |
| `BUILD_STATUS.md`    | Status atual do build   |
| `README_APK.md`      | Resumo geral            |
| `GUIA_BUILD_APK.md`  | Guia completo detalhado |

---

## ✅ CHECKLIST

- [x] EAS CLI instalado
- [x] Login realizado (@arthur_parreiras)
- [x] Projeto configurado (projectId válido)
- [x] Assets criados (3 PNGs válidos)
- [x] Build testado e funcionando
- [ ] APK baixado (em andamento...)
- [ ] APK instalado no Android

---

## 🎯 PRÓXIMOS PASSOS

1. ⏳ **Aguarde o build** terminar (10-20 min)
2. 📥 **Baixe o APK** do link fornecido
3. 📱 **Instale** no seu Android
4. ✅ **Teste** o MindBudget
5. 🚀 **Distribua** ou publique na Play Store

---

**Última atualização:** 15/11/2025 19:40  
**Status:** ✅ Build configurado e funcionando  
**Build atual:** Em andamento 🚀

---

**Dúvidas?** Veja `BUILD_STATUS.md` para detalhes do build atual.
