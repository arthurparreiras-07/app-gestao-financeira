import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from "@expo/vector-icons";
import { useAppStore } from "../../application/store/useAppStore";
import {
  colors,
  spacing,
  borderRadius,
  fontSize,
  fontWeight,
  shadows,
} from "../../theme/theme";

export const SettingsScreen: React.FC = () => {
  const { clearAllData } = useAppStore();

  const handleClearData = () => {
    Alert.alert(
      "Limpar todos os dados",
      "Tem certeza que deseja excluir todos os gastos? Esta ação não pode ser desfeita.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              await clearAllData();
              Alert.alert("Sucesso", "Todos os dados foram excluídos.");
            } catch (error) {
              Alert.alert("Erro", "Não foi possível excluir os dados.");
            }
          },
        },
      ]
    );
  };

  const handleExportData = () => {
    Alert.alert("Em breve", "Funcionalidade de exportação em desenvolvimento.");
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <ScrollView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Ionicons name="settings" size={28} color={colors.primary[500]} />
          </View>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Configurações</Text>
            <Text style={styles.subtitle}>MindBudget - Gestão Financeira</Text>
          </View>
        </View>

        {/* Notificações */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferências</Text>

          <TouchableOpacity style={styles.settingItem} onPress={() => {}}>
            <View
              style={[
                styles.settingIconContainer,
                { backgroundColor: `${colors.secondary[500]}15` },
              ]}
            >
              <Ionicons
                name="notifications-outline"
                size={20}
                color={colors.secondary[500]}
              />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Notificações</Text>
              <Text style={styles.settingDescription}>
                Receber lembretes de gastos
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={colors.gray[400]}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem} onPress={() => {}}>
            <View
              style={[
                styles.settingIconContainer,
                { backgroundColor: `${colors.gray[600]}15` },
              ]}
            >
              <Ionicons
                name="moon-outline"
                size={20}
                color={colors.gray[600]}
              />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Tema escuro</Text>
              <Text style={styles.settingDescription}>Ativar modo noturno</Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={colors.gray[400]}
            />
          </TouchableOpacity>
        </View>

        {/* Dados */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Gerenciar Dados</Text>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={handleExportData}
          >
            <View
              style={[
                styles.settingIconContainer,
                { backgroundColor: `${colors.primary[500]}15` },
              ]}
            >
              <Ionicons
                name="download-outline"
                size={20}
                color={colors.primary[500]}
              />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Exportar dados</Text>
              <Text style={styles.settingDescription}>
                Baixar histórico em CSV
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={colors.gray[400]}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={handleClearData}
          >
            <View
              style={[
                styles.settingIconContainer,
                { backgroundColor: `${colors.error}15` },
              ]}
            >
              <Ionicons name="trash-outline" size={20} color={colors.error} />
            </View>
            <View style={styles.settingContent}>
              <Text style={[styles.settingLabel, { color: colors.error }]}>
                Limpar todos os dados
              </Text>
              <Text style={styles.settingDescription}>
                Excluir permanentemente tudo
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={colors.gray[400]}
            />
          </TouchableOpacity>
        </View>

        {/* Sobre */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sobre</Text>

          <View style={styles.aboutCard}>
            <Text style={styles.appName}>MindBudget</Text>
            <Text style={styles.version}>Versão 1.0.0</Text>
            <Text style={styles.description}>
              Aplicativo de gestão financeira com análise emocional de gastos.
            </Text>
            <Text style={styles.credits}>
              Desenvolvido com ❤️ para PUC Minas
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.backgroundSecondary,
  },
  container: {
    flex: 1,
    backgroundColor: colors.backgroundSecondary,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.lg,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.lg,
    backgroundColor: `${colors.primary[500]}15`,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.md,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
  },
  section: {
    marginTop: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  sectionTitle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.text.secondary,
    marginBottom: spacing.md,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.background,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.sm,
    ...shadows.sm,
  },
  settingIconContainer: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.md,
  },
  settingContent: {
    flex: 1,
  },
  settingLabel: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  settingDescription: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
  },
  aboutCard: {
    backgroundColor: colors.background,
    padding: spacing.xl,
    borderRadius: borderRadius.lg,
    alignItems: "center",
    ...shadows.md,
  },
  appName: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.primary[600],
    marginBottom: spacing.xs,
  },
  version: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    marginBottom: spacing.lg,
  },
  description: {
    fontSize: fontSize.md,
    color: colors.text.primary,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: spacing.md,
  },
  credits: {
    fontSize: fontSize.sm,
    color: colors.text.tertiary,
    textAlign: "center",
  },
});
