import React, { useState } from 'react';
import {
View,
Text,
TextInput,
StyleSheet,
TouchableOpacity,
ScrollView,
Alert,
} from 'react-native';
import { useAppStore } from '../../application/store/useAppStore';
import { EmotionSelector } from '../components/EmotionSelector';
import { CategorySelector } from '../components/CategorySelector';

export const AddExpenseScreen = ({ navigation }: any) => {
const { emotions, categories, addExpense } = useAppStore();
const [amount, setAmount] = useState('');
const [emotionId, setEmotionId] = useState<number>();
const [categoryId, setCategoryId] = useState<number>();
const [note, setNote] = useState('');
const [loading, setLoading] = useState(false);

const handleSubmit = async () => {
  if (!amount || !emotionId || !categoryId) {
    Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios');
    return;
  }

  const numAmount = parseFloat(amount.replace(',', '.'));
  if (isNaN(numAmount) || numAmount <= 0) {
    Alert.alert('Erro', 'Valor inválido');
    return;
  }

  setLoading(true);
  try {
    await addExpense({
      amount: numAmount,
      date: new Date(),
      emotionId,
      categoryId,
      note,
    });
    Alert.alert('Sucesso', 'Gasto registrado com sucesso!');
    navigation.goBack();
  } catch (error) {
    Alert.alert('Erro', 'Não foi possível salvar o gasto');
  } finally {
    setLoading(false);
  }
};

return (
  <ScrollView style={styles.container}>
    <View style={styles.content}>
      <Text style={styles.title}>Novo Gasto 💰</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Valor *</Text>
        <TextInput
          style={styles.input}
          placeholder="0,00"
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
        />
      </View>

      <EmotionSelector
        emotions={emotions}
        selectedEmotionId={emotionId}
        onSelect={setEmotionId}
      />

      <CategorySelector
        categories={categories}
        selectedCategoryId={categoryId}
        onSelect={setCategoryId}
      />

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Observações (opcional)</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Ex: Almoço no restaurante..."
          multiline
          numberOfLines={4}
          value={note}
          onChangeText={setNote}
        />
      </View>

      <TouchableOpacity
        style={[styles.submitButton, loading && styles.submitButtonDisabled]}
        onPress={handleSubmit}
        disabled={loading}
      >
        <Text style={styles.submitButtonText}>
          {loading ? 'Salvando...' : 'Salvar Gasto'}
        </Text>
      </TouchableOpacity>
    </View>
  </ScrollView>
);
};

const styles = StyleSheet.create({
container: {
  flex: 1,
  backgroundColor: '#f8f9fa',
},
content: {
  padding: 20,
},
title: {
  fontSize: 28,
  fontWeight: 'bold',
  marginBottom: 24,
  color: '#333',
},
inputContainer: {
  marginBottom: 20,
},
label: {
  fontSize: 16,
  fontWeight: '600',
  marginBottom: 8,
  color: '#333',
},
input: {
  backgroundColor: '#fff',
  borderRadius: 12,
  padding: 16,
  fontSize: 16,
  borderWidth: 1,
  borderColor: '#ddd',
},
textArea: {
  height: 100,
  textAlignVertical: 'top',
},
submitButton: {
  backgroundColor: '#4CAF50',
  padding: 18,
  borderRadius: 12,
  alignItems: 'center',
  marginTop: 24,
},
submitButtonDisabled: {
  opacity: 0.6,
},
submitButtonText: {
  color: '#fff',
  fontSize: 16,
  fontWeight: 'bold',
},
});