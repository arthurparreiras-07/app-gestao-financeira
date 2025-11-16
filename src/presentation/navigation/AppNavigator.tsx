import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import {
  createDrawerNavigator,
  DrawerContentComponentProps,
} from "@react-navigation/drawer";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Platform, StatusBar } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { HomeScreen } from "../screens/HomeScreen";
import { AddExpenseScreen } from "../screens/AddExpenseScreen";
import { EditExpenseScreen } from "../screens/EditExpenseScreen";
import { SettingsScreen } from "../screens/SettingsScreen";
import { TransactionsScreen } from "../screens/TransactionsScreen";
import { ReportsScreen } from "../screens/ReportsScreen";
import { BudgetScreen } from "../screens/BudgetScreen";
import { RecurringExpensesScreen } from "../screens/RecurringExpensesScreen";
import { TagsScreen } from "../screens/TagsScreen";
import { ManageCategoriesScreen } from "../screens/ManageCategoriesScreen";
import { ManageEmotionsScreen } from "../screens/ManageEmotionsScreen";
import { CustomDrawerContent } from "../components/CustomDrawerContent";
import { useTheme } from "../../theme/ThemeContext";
import { getColors } from "../../theme/theme";

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

function DrawerNavigator() {
  const { isDark } = useTheme();
  const colors = getColors(isDark);

  return (
    <Drawer.Navigator
      drawerContent={(props: DrawerContentComponentProps) => (
        <CustomDrawerContent {...props} />
      )}
      screenOptions={{
        headerShown: false,
        drawerType: "slide",
        overlayColor: "rgba(0, 0, 0, 0.5)",
        drawerStyle: {
          width: 300,
          backgroundColor: colors.background,
        },
        swipeEnabled: true,
        swipeEdgeWidth: 50,
      }}
    >
      <Drawer.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: "Início",
        }}
      />
      <Drawer.Screen
        name="Transactions"
        component={TransactionsScreen}
        options={{
          title: "Transações",
        }}
      />
      <Drawer.Screen
        name="Reports"
        component={ReportsScreen}
        options={{
          title: "Relatórios",
        }}
      />
      <Drawer.Screen
        name="Budget"
        component={BudgetScreen}
        options={{
          title: "Orçamento",
        }}
      />
      <Drawer.Screen
        name="RecurringExpenses"
        component={RecurringExpensesScreen}
        options={{
          title: "Despesas Recorrentes",
        }}
      />
      <Drawer.Screen
        name="Tags"
        component={TagsScreen}
        options={{
          title: "Tags",
        }}
      />
      <Drawer.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          title: "Configurações",
        }}
      />
    </Drawer.Navigator>
  );
}

export function AppNavigator() {
  const { isDark } = useTheme();
  const colors = getColors(isDark);

  return (
    <SafeAreaProvider>
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={colors.background}
        translucent={false}
      />
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Main"
            component={DrawerNavigator}
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
