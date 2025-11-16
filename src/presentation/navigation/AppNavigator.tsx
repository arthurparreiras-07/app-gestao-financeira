import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Platform } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { HomeScreen } from "../screens/HomeScreen";
import { AddExpenseScreen } from "../screens/AddExpenseScreen";
import { EditExpenseScreen } from "../screens/EditExpenseScreen";
import { SettingsScreen } from "../screens/SettingsScreen";
import { TransactionsScreen } from "../screens/TransactionsScreen";
import { BudgetScreen } from "../screens/BudgetScreen";
import { RecurringExpensesScreen } from "../screens/RecurringExpensesScreen";
import { TagsScreen } from "../screens/TagsScreen";
import { ManageCategoriesScreen } from "../screens/ManageCategoriesScreen";
import { ManageEmotionsScreen } from "../screens/ManageEmotionsScreen";
import { useTheme } from "../../theme/ThemeContext";
import { getColors } from "../../theme/theme";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function HomeTabs() {
  const { isDark } = useTheme();
  const colors = getColors(isDark);

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary[500],
        tabBarInactiveTintColor: colors.gray[400],
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          paddingBottom: Platform.OS === "ios" ? 20 : 8,
          paddingTop: 8,
          height: Platform.OS === "ios" ? 85 : 65,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "500",
          marginBottom: Platform.OS === "ios" ? 0 : 4,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: "Início",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Transactions"
        component={TransactionsScreen}
        options={{
          title: "Transações",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="list" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          title: "Configurações",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export function AppNavigator() {
  const { isDark } = useTheme();
  const colors = getColors(isDark);

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Main"
            component={HomeTabs}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="AddExpense"
            component={AddExpenseScreen}
            options={{
              title: "Nova Transação",
              headerStyle: {
                backgroundColor: colors.primary[500],
              },
              headerTintColor: colors.text.inverse,
              headerTitleStyle: {
                fontWeight: "600",
              },
            }}
          />
          <Stack.Screen
            name="EditExpense"
            component={EditExpenseScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="Budget"
            component={BudgetScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="RecurringExpenses"
            component={RecurringExpensesScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="Tags"
            component={TagsScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="ManageCategories"
            component={ManageCategoriesScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="ManageEmotions"
            component={ManageEmotionsScreen}
            options={{
              headerShown: false,
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
