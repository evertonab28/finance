import type { Transaction, InsertTransaction, Category, InsertCategory } from "@shared/schema";

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

  // Category methods
  async getCategories(): Promise<Category[]> {
    const response = await fetch(`${this.baseUrl}/categories`);
    if (!response.ok) throw new Error("Failed to fetch categories");
    return response.json();
  }

  async getCategoriesByType(type: string): Promise<Category[]> {
    const response = await fetch(`${this.baseUrl}/categories/type/${type}`);
    if (!response.ok) throw new Error("Failed to fetch categories by type");
    return response.json();
  }

  async getCategoryById(id: number): Promise<Category> {
    const response = await fetch(`${this.baseUrl}/categories/${id}`);
    if (!response.ok) throw new Error("Failed to fetch category");
    return response.json();
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const response = await fetch(`${this.baseUrl}/categories`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(category),
    });
    if (!response.ok) throw new Error("Failed to create category");
    return response.json();
  }

  async updateCategory(id: number, updates: Partial<InsertCategory>): Promise<Category> {
    const response = await fetch(`${this.baseUrl}/categories/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    if (!response.ok) throw new Error("Failed to update category");
    return response.json();
  }

  async deleteCategory(id: number): Promise<void> {
    const response = await fetch(`${this.baseUrl}/categories/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete category");
  }
}

export const financeService = new FinanceService();

// Helper function to get category name from transactions with categoryId
export const getCategoryName = (categoryId: number, categories: Category[]): string => {
  const category = categories.find(c => c.id === categoryId);
  return category ? category.name : 'Indefinido';
};

// Helper function to get category by ID
export const getCategoryById = (categoryId: number, categories: Category[]): Category | undefined => {
  return categories.find(c => c.id === categoryId);
};
