import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useAppStore } from "../../application/store/useAppStore";
import { useTheme } from "../../theme/ThemeContext";
import {
  getColors,
  spacing,
  borderRadius,
  fontSize,
  fontWeight,
  shadows,
} from "../../theme/theme";

export const SettingsScreen: React.FC<{ navigation?: any }> = ({
  navigation,
}) => {
  const {
    clearAllData,
    exportToCSV,
    exportToJSON,
    exportReport,
    importFromJSON,
    importFromCSV,
  } = useAppStore();
  const { isDark, toggleTheme } = useTheme();
  const colors = getColors(isDark);
  const [notifications, setNotifications] = useState(false);
  const [exportingCSV, setExportingCSV] = useState(false);
  const [exportingJSON, setExportingJSON] = useState(false);
  const [exportingReport, setExportingReport] = useState(false);
  const [importing, setImporting] = useState(false);

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

  const handleExportCSV = async () => {
    setExportingCSV(true);
    try {
      await exportToCSV();
      Alert.alert("Sucesso", "Dados exportados em CSV!");
    } catch (error) {
      Alert.alert("Erro", "Não foi possível exportar os dados.");
    } finally {
      setExportingCSV(false);
    }
  };

  const handleExportJSON = async () => {
    setExportingJSON(true);
    try {
      await exportToJSON();
      Alert.alert("Sucesso", "Backup completo criado!");
    } catch (error) {
      Alert.alert("Erro", "Não foi possível criar o backup.");
    } finally {
      setExportingJSON(false);
    }
  };

  const handleExportReport = async () => {
    setExportingReport(true);
    try {
      await exportReport();
      Alert.alert("Sucesso", "Relatório exportado!");
    } catch (error) {
      Alert.alert("Erro", "Não foi possível exportar o relatório.");
    } finally {
      setExportingReport(false);
    }
  };

  const handleImportJSON = async () => {
    Alert.alert(
      "Importar Backup",
      "Selecione um arquivo JSON de backup. Os dados serão adicionados aos existentes.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Selecionar Arquivo",
          onPress: async () => {
            setImporting(true);
            try {
              const result = await importFromJSON();
              if (result.success) {
                Alert.alert("Sucesso ✅", result.message);
              } else {
                Alert.alert("Erro ❌", result.message);
              }
            } catch (error) {
              Alert.alert("Erro", "Não foi possível importar o arquivo.");
            } finally {
              setImporting(false);
            }
          },
        },
      ]
    );
  };

  const handleImportCSV = async () => {
    Alert.alert(
      "Importar CSV",
      "Selecione um arquivo CSV exportado anteriormente. As transações serão importadas.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Selecionar Arquivo",
          onPress: async () => {
            setImporting(true);
            try {
              const result = await importFromCSV();
              if (result.success) {
                Alert.alert("Sucesso ✅", result.message);
              } else {
                Alert.alert("Erro ❌", result.message);
              }
            } catch (error) {
              Alert.alert("Erro", "Não foi possível importar o arquivo.");
            } finally {
              setImporting(false);
            }
          },
        },
      ]
    );
  };

  const handleToggleDarkMode = () => {
    toggleTheme();
  };

  const handleToggleNotifications = () => {
    setNotifications(!notifications);
    Alert.alert(
      "Notificações",
      notifications ? "Notificações desativadas!" : "Notificações ativadas!"
    );
  };

  const styles = createStyles(colors);

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }]}
      edges={["bottom"]}
    >
      <ScrollView
        style={[styles.container, { backgroundColor: colors.background }]}
      >
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

          <TouchableOpacity
            style={styles.settingItem}
            onPress={handleToggleNotifications}
            activeOpacity={0.7}
          >
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
                {notifications ? "Ativadas" : "Desativadas"}
              </Text>
            </View>
            <Ionicons
              name={notifications ? "toggle" : "toggle-outline"}
              size={24}
              color={notifications ? colors.primary[500] : colors.gray[400]}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={handleToggleDarkMode}
            activeOpacity={0.7}
          >
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
              <Text style={styles.settingDescription}>
                {isDark ? "Ativado" : "Desativado"}
              </Text>
            </View>
            <Ionicons
              name={isDark ? "toggle" : "toggle-outline"}
              size={24}
              color={isDark ? colors.primary[500] : colors.gray[400]}
            />
          </TouchableOpacity>
        </View>

        {/* Gerenciamento */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Gerenciamento</Text>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => navigation?.navigate("Budget")}
            activeOpacity={0.7}
          >
            <View
              style={[
                styles.settingIconContainer,
                { backgroundColor: `${colors.primary[500]}15` },
              ]}
            >
              <Ionicons
                name="wallet-outline"
                size={20}
                color={colors.primary[500]}
              />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Orçamentos</Text>
              <Text style={styles.settingDescription}>
                Defina limites mensais
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
            onPress={() => navigation?.navigate("RecurringExpenses")}
            activeOpacity={0.7}
          >
            <View
              style={[
                styles.settingIconContainer,
                { backgroundColor: `${colors.secondary[500]}15` },
              ]}
            >
              <Ionicons
                name="repeat-outline"
                size={20}
                color={colors.secondary[500]}
              />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Transações Recorrentes</Text>
              <Text style={styles.settingDescription}>Gastos automáticos</Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={colors.gray[400]}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => navigation?.navigate("Tags")}
            activeOpacity={0.7}
          >
            <View
              style={[
                styles.settingIconContainer,
                { backgroundColor: `${colors.success}15` },
              ]}
            >
              <Ionicons
                name="pricetags-outline"
                size={20}
                color={colors.success}
              />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Tags Personalizadas</Text>
              <Text style={styles.settingDescription}>
                Organize suas transações
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
            onPress={() => navigation?.navigate("ManageCategories")}
            activeOpacity={0.7}
          >
            <View
              style={[
                styles.settingIconContainer,
                { backgroundColor: `${colors.warning}15` },
              ]}
            >
              <Ionicons name="grid-outline" size={20} color={colors.warning} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Categorias</Text>
              <Text style={styles.settingDescription}>
                Crie e edite categorias
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
            onPress={() => navigation?.navigate("ManageEmotions")}
            activeOpacity={0.7}
          >
            <View
              style={[
                styles.settingIconContainer,
                { backgroundColor: `${colors.error}15` },
              ]}
            >
              <Ionicons name="heart-outline" size={20} color={colors.error} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Emoções</Text>
              <Text style={styles.settingDescription}>
                Personalize suas emoções
              </Text>
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
          <Text style={styles.sectionTitle}>Exportar Dados</Text>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={handleExportCSV}
            disabled={exportingCSV}
            activeOpacity={0.7}
          >
            <View
              style={[
                styles.settingIconContainer,
                { backgroundColor: `${colors.success}15` },
              ]}
            >
              <Ionicons
                name="document-text-outline"
                size={20}
                color={colors.success}
              />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Exportar CSV</Text>
              <Text style={styles.settingDescription}>
                Para Excel ou planilhas
              </Text>
            </View>
            {exportingCSV ? (
              <ActivityIndicator size="small" color={colors.primary[500]} />
            ) : (
              <Ionicons
                name="chevron-forward"
                size={20}
                color={colors.gray[400]}
              />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={handleExportJSON}
            disabled={exportingJSON}
            activeOpacity={0.7}
          >
            <View
              style={[
                styles.settingIconContainer,
                { backgroundColor: `${colors.primary[500]}15` },
              ]}
            >
              <Ionicons
                name="cloud-download-outline"
                size={20}
                color={colors.primary[500]}
              />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Backup Completo (JSON)</Text>
              <Text style={styles.settingDescription}>
                Todos os dados em JSON
              </Text>
            </View>
            {exportingJSON ? (
              <ActivityIndicator size="small" color={colors.primary[500]} />
            ) : (
              <Ionicons
                name="chevron-forward"
                size={20}
                color={colors.gray[400]}
              />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={handleExportReport}
            disabled={exportingReport}
            activeOpacity={0.7}
          >
            <View
              style={[
                styles.settingIconContainer,
                { backgroundColor: `${colors.warning}15` },
              ]}
            >
              <Ionicons
                name="bar-chart-outline"
                size={20}
                color={colors.warning}
              />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Relatório Mensal</Text>
              <Text style={styles.settingDescription}>
                Resumo formatado em TXT
              </Text>
            </View>
            {exportingReport ? (
              <ActivityIndicator size="small" color={colors.primary[500]} />
            ) : (
              <Ionicons
                name="chevron-forward"
                size={20}
                color={colors.gray[400]}
              />
            )}
          </TouchableOpacity>
        </View>

        {/* Importar Dados */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Importar Dados</Text>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={handleImportJSON}
            disabled={importing}
            activeOpacity={0.7}
          >
            <View
              style={[
                styles.settingIconContainer,
                { backgroundColor: `${colors.primary[500]}15` },
              ]}
            >
              <Ionicons
                name="cloud-upload-outline"
                size={20}
                color={colors.primary[500]}
              />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Restaurar Backup (JSON)</Text>
              <Text style={styles.settingDescription}>
                Importar dados de backup
              </Text>
            </View>
            {importing ? (
              <ActivityIndicator size="small" color={colors.primary[500]} />
            ) : (
              <Ionicons
                name="chevron-forward"
                size={20}
                color={colors.gray[400]}
              />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={handleImportCSV}
            disabled={importing}
            activeOpacity={0.7}
          >
            <View
              style={[
                styles.settingIconContainer,
                { backgroundColor: `${colors.success}15` },
              ]}
            >
              <Ionicons
                name="document-attach-outline"
                size={20}
                color={colors.success}
              />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Importar CSV</Text>
              <Text style={styles.settingDescription}>
                Importar de planilha
              </Text>
            </View>
            {importing ? (
              <ActivityIndicator size="small" color={colors.primary[500]} />
            ) : (
              <Ionicons
                name="chevron-forward"
                size={20}
                color={colors.gray[400]}
              />
            )}
          </TouchableOpacity>
        </View>

        {/* Zona de Perigo */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Zona de Perigo</Text>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={handleClearData}
            activeOpacity={0.7}
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
            <Text style={styles.version}>Versão 2.0.0</Text>
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

const createStyles = (colors: ReturnType<typeof getColors>) =>
  StyleSheet.create({
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
