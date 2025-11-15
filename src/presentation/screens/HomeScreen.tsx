import React, { useEffect } from 'react';
import {
View,
Text,
StyleSheet,
ScrollView,
TouchableOpacity,
ActivityIndicator,
} from 'react-native';
import { useAppStore } from '../../application/store/useAppStore';
import { InsightCard } from '../components/InsightCard';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const HomeScreen = ({ navigation }: any) => {
const { expenses, insights, loading, loadData } = useAppStore();

useEffect(() => {
  loadData();
}, []);

const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
const thisMonthExpenses = expenses.filter(
  (e) => e.date.getMonth() === new Date().getMonth()
);
const monthTotal = thisMonthExpenses.reduce((sum, e) => sum + e.amount, 0);

if (loading) {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#2196F3" />
    </View>
  );
}

return (
  <ScrollView style={styles.container}>
    <View style={styles.header}>
      <Text style={styles.title}>Orçamento Emocional 💙</Text>
      <Text style={styles.subtitle}>
        {format(new Date(), "EEEE, d 'de' MMMM", { locale: ptBR })}
      </Text>
    </View>

    <View style={styles.summaryContainer}>
      <View style={styles.summaryCard}>
        <Text style={styles.summaryLabel}>Total Gasto</Text>
        <Text style={styles.summaryValue}>
          R$ {totalExpenses.toFixed(2)}
        </Text>
      </View>
      <View style={styles.summaryCard}>
        <Text style={styles.summaryLabel}>Este Mês</Text>
        <Text style={styles.summaryValue}>
          R$ {monthTotal.toFixed(2)}
        </Text>
      </View>
    </View>

    <TouchableOpacity
      style={styles.addButton}
      onPress={() => navigation.navigate('AddExpense')}
    >
      <Text style={styles.addButtonText}>+ Adicionar Gasto</Text>
    </TouchableOpacity>

    <View style={styles.insightsContainer}>
      <Text style={styles.sectionTitle}>💡 Insights</Text>
      {insights.length > 0 ? (
        insights.map((insight) => (
          <InsightCard key={insight.id} insight={insight} />
        ))
      ) : (
        <Text style={styles.emptyText}>
          Adicione gastos para receber insights personalizados
        </Text>
      )}
    </View>

    <View style={styles.recentContainer}>
      <Text style={styles.sectionTitle}>Gastos Recentes</Text>
      {expenses.slice(0, 5).map((expense) => (
        <View key={expense.id} style={styles.expenseItem}>
          <View>
            <Text style={styles.expenseAmount}>
              R$ {expense.amount.toFixed(2)}
            </Text>
            <Text style={styles.expenseDate}>
              {format(expense.date, 'dd/MM/yyyy')}
            </Text>
          </View>
          {expense.note && (
            <Text style={styles.expenseNote}>{expense.note}</Text>
          )}
        </View>
      ))}
    </View>
  </ScrollView>
);
};

const styles = StyleSheet.create({
container: {
  flex: 1,
  backgroundColor: '#f8f9fa',
},
loadingContainer: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
},
header: {
  padding: 20,
  backgroundColor: '#2196F3',
  paddingTop: 60,
},
title: {
  fontSize: 28,
  fontWeight: 'bold',
  color: '#fff',
  marginBottom: 8,
},
subtitle: {
  fontSize: 14,
  color: '#fff',
  opacity: 0.9,
},
summaryContainer: {
  flexDirection: 'row',
  padding: 16,
  gap: 12,
},
summaryCard: {
  flex: 1,
  backgroundColor: '#fff',
  padding: 20,
  borderRadius: 12,
  elevation: 2,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
},
summaryLabel: {
  fontSize: 12,
  color: '#666',
  marginBottom: 8,
},
summaryValue: {
  fontSize: 24,
  fontWeight: 'bold',
  color: '#2196F3',
},
addButton: {
  backgroundColor: '#4CAF50',
  margin: 16,
  padding: 18,
  borderRadius: 12,
  alignItems: 'center',
},
addButtonText: {
  color: '#fff',
  fontSize: 16,
  fontWeight: 'bold',
},
insightsContainer: {
  padding: 16,
},
sectionTitle: {
  fontSize: 20,
  fontWeight: 'bold',
  marginBottom: 16,
  color: '#333',
},
emptyText: {
  textAlign: 'center',
  color: '#999',
  fontStyle: 'italic',
  marginVertical: 20,
},
recentContainer: {
  padding: 16,
},
expenseItem: {
  backgroundColor: '#fff',
  padding: 16,
  borderRadius: 12,
  marginBottom: 8,
  elevation: 1,
},
expenseAmount: {
  fontSize: 18,
  fontWeight: 'bold',
  color: '#333',
},
expenseDate: {
  fontSize: 12,
  color: '#666',
  marginTop: 4,
},
expenseNote: {
  fontSize: 14,
  color: '#666',
  marginTop: 8,
},
});