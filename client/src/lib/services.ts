import type { Transaction, InsertTransaction } from "@shared/schema";

export interface FinancialSummary {
  totalReceitas: number;
  totalDespesas: number;
  saldo: number;
}

export interface MonthlyData {
  month: string;
  receitas: number;
  despesas: number;
}

export interface ExpenseByCategory {
  category: string;
  amount: number;
  percentage: number;
}

export class FinanceService {
  private baseUrl = "/api";

  async getTransactions(): Promise<Transaction[]> {
    const response = await fetch(`${this.baseUrl}/transactions`);
    if (!response.ok) throw new Error("Failed to fetch transactions");
    return response.json();
  }

  async createTransaction(transaction: InsertTransaction): Promise<Transaction> {
    const response = await fetch(`${this.baseUrl}/transactions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(transaction),
    });
    if (!response.ok) throw new Error("Failed to create transaction");
    return response.json();
  }

  async updateTransaction(id: number, updates: Partial<InsertTransaction>): Promise<Transaction> {
    const response = await fetch(`${this.baseUrl}/transactions/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    if (!response.ok) throw new Error("Failed to update transaction");
    return response.json();
  }

  async deleteTransaction(id: number): Promise<void> {
    const response = await fetch(`${this.baseUrl}/transactions/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete transaction");
  }

  async getFinancialSummary(): Promise<FinancialSummary> {
    const response = await fetch(`${this.baseUrl}/analytics/financial-summary`);
    if (!response.ok) throw new Error("Failed to fetch financial summary");
    return response.json();
  }

  async getMonthlyRevenueExpenses(months: number = 6): Promise<MonthlyData[]> {
    const response = await fetch(`${this.baseUrl}/analytics/monthly-revenue-expenses?months=${months}`);
    if (!response.ok) throw new Error("Failed to fetch monthly data");
    return response.json();
  }

  async getExpensesByCategory(): Promise<ExpenseByCategory[]> {
    const response = await fetch(`${this.baseUrl}/analytics/expenses-by-category`);
    if (!response.ok) throw new Error("Failed to fetch expenses by category");
    return response.json();
  }
}

export const financeService = new FinanceService();
