import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Switch,
} from "react-native";
import { useAppStore } from "../../application/store/useAppStore";
import { DatabaseMigrations } from "../../infrastructure/database/migrations";

export const SettingsScreen = () => {
  const { expenses, loadData } = useAppStore();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);

  const handleClearData = () => {
    Alert.alert(
      "Limpar Dados",
      "Tem certeza que deseja apagar todos os dados? Esta ação não pode ser desfeita.",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Confirmar",
          style: "destructive",
          onPress: async () => {
            try {
              await DatabaseMigrations.resetDatabase();
              await loadData();
              Alert.alert("Sucesso", "Todos os dados foram removidos");
            } catch (error) {
              Alert.alert("Erro", "Não foi possível limpar os dados");
            }
          },
        },
      ]
    );
  };

  const handleExportData = () => {
    Alert.alert(
      "Exportar Dados",
      `Você possui ${expenses.length} gastos registrados.\n\nA funcionalidade de exportação será implementada em breve.`,
      [{ text: "OK" }]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Configurações ⚙️</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferências</Text>

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Notificações</Text>
            <Text style={styles.settingDescription}>
              Receber lembretes para registrar gastos
            </Text>
          </View>
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
            trackColor={{ false: "#ddd", true: "#2196F3" }}
            thumbColor={notificationsEnabled ? "#fff" : "#f4f3f4"}
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Modo Escuro</Text>
            <Text style={styles.settingDescription}>
              Ativar tema escuro (em breve)
            </Text>
          </View>
          <Switch
            value={darkModeEnabled}
            onValueChange={setDarkModeEnabled}
            trackColor={{ false: "#ddd", true: "#2196F3" }}
            thumbColor={darkModeEnabled ? "#fff" : "#f4f3f4"}
            disabled
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Dados</Text>

        <TouchableOpacity style={styles.button} onPress={handleExportData}>
          <Text style={styles.buttonIcon}>📤</Text>
          <View style={styles.buttonContent}>
            <Text style={styles.buttonLabel}>Exportar Dados</Text>
            <Text style={styles.buttonDescription}>
              Salvar seus gastos em arquivo
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.dangerButton]}
          onPress={handleClearData}
        >
          <Text style={styles.buttonIcon}>🗑️</Text>
          <View style={styles.buttonContent}>
            <Text style={[styles.buttonLabel, styles.dangerText]}>
              Limpar Todos os Dados
            </Text>
            <Text style={styles.buttonDescription}>
              Remover todos os gastos registrados
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Sobre</Text>

        <View style={styles.infoCard}>
          <Text style={styles.appName}>💙 Orçamento Emocional</Text>
          <Text style={styles.appVersion}>Versão 1.0.0</Text>
          <Text style={styles.appDescription}>
            Um aplicativo para rastrear seus gastos e entender como suas emoções
            influenciam seus hábitos financeiros.
          </Text>
        </View>

        <View style={styles.statsCard}>
          <Text style={styles.statsTitle}>Suas Estatísticas</Text>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{expenses.length}</Text>
              <Text style={styles.statLabel}>Gastos</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                R$ {expenses.reduce((sum, e) => sum + e.amount, 0).toFixed(2)}
              </Text>
              <Text style={styles.statLabel}>Total</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Desenvolvido com ❤️ para ajudar você a entender melhor seus gastos
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    padding: 20,
    backgroundColor: "#2196F3",
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 1,
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 12,
    color: "#666",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 1,
  },
  dangerButton: {
    borderWidth: 1,
    borderColor: "#ff4444",
  },
  buttonIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  buttonContent: {
    flex: 1,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  buttonDescription: {
    fontSize: 12,
    color: "#666",
  },
  dangerText: {
    color: "#ff4444",
  },
  infoCard: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 1,
  },
  appName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2196F3",
    marginBottom: 8,
  },
  appVersion: {
    fontSize: 14,
    color: "#666",
    marginBottom: 12,
  },
  appDescription: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  statsCard: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    elevation: 1,
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2196F3",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
  },
  footer: {
    padding: 24,
    alignItems: "center",
  },
  footerText: {
    fontSize: 12,
    color: "#999",
    textAlign: "center",
    lineHeight: 18,
  },
});
