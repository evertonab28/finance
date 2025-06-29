import { transactions, categories, type Transaction, type InsertTransaction, type Category, type InsertCategory } from "@shared/schema";
import { format, startOfMonth, endOfMonth, subMonths } from "date-fns";

export interface IStorage {
  // Category methods
  getCategories(): Promise<Category[]>;
  getCategoryById(id: number): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: number, category: Partial<InsertCategory>): Promise<Category | undefined>;
  deleteCategory(id: number): Promise<boolean>;
  getCategoriesByType(type: string): Promise<Category[]>;
  
  // Transaction methods
  getTransactions(): Promise<Transaction[]>;
  getTransactionById(id: number): Promise<Transaction | undefined>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  updateTransaction(id: number, transaction: Partial<InsertTransaction>): Promise<Transaction | undefined>;
  deleteTransaction(id: number): Promise<boolean>;
  
  // Analytics methods
  getTransactionsByDateRange(startDate: Date, endDate: Date): Promise<Transaction[]>;
  getMonthlyRevenueExpenses(months: number): Promise<Array<{ month: string; receitas: number; despesas: number }>>;
  getExpensesByCategory(): Promise<Array<{ category: string; amount: number; percentage: number }>>;
  getFinancialSummary(): Promise<{ totalReceitas: number; totalDespesas: number; saldo: number }>;
}

export class MemStorage implements IStorage {
  private transactions: Map<number, Transaction>;
  private categories: Map<number, Category>;
  private currentTransactionId: number;
  private currentCategoryId: number;

  constructor() {
    this.transactions = new Map();
    this.categories = new Map();
    this.currentTransactionId = 1;
    this.currentCategoryId = 1;
    
    // Initialize with some sample data for demonstration
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Initialize sample categories
    const sampleCategories: Omit<Category, 'id'>[] = [
      // Revenue categories
      { name: 'Salário', type: 'receita', parentId: null, color: '#22c55e', icon: 'banknote', isActive: 'true', createdAt: new Date() },
      { name: 'Freelance', type: 'receita', parentId: null, color: '#16a34a', icon: 'laptop', isActive: 'true', createdAt: new Date() },
      { name: 'Investimentos', type: 'receita', parentId: null, color: '#15803d', icon: 'trendingUp', isActive: 'true', createdAt: new Date() },
      
      // Expense categories
      { name: 'Moradia', type: 'despesa', parentId: null, color: '#ef4444', icon: 'home', isActive: 'true', createdAt: new Date() },
      { name: 'Alimentação', type: 'despesa', parentId: null, color: '#f97316', icon: 'utensils', isActive: 'true', createdAt: new Date() },
      { name: 'Transporte', type: 'despesa', parentId: null, color: '#eab308', icon: 'car', isActive: 'true', createdAt: new Date() },
      { name: 'Entretenimento', type: 'despesa', parentId: null, color: '#a855f7', icon: 'gamepad2', isActive: 'true', createdAt: new Date() },
      { name: 'Saúde', type: 'despesa', parentId: null, color: '#06b6d4', icon: 'heart', isActive: 'true', createdAt: new Date() },
      
      // Subcategories for Moradia
      { name: 'Aluguel', type: 'despesa', parentId: 1, color: '#dc2626', icon: 'key', isActive: 'true', createdAt: new Date() },
      { name: 'Condomínio', type: 'despesa', parentId: 1, color: '#b91c1c', icon: 'building', isActive: 'true', createdAt: new Date() },
      { name: 'IPTU', type: 'despesa', parentId: 1, color: '#991b1b', icon: 'fileText', isActive: 'true', createdAt: new Date() },
      
      // Subcategories for Alimentação
      { name: 'Supermercado', type: 'despesa', parentId: 2, color: '#ea580c', icon: 'shoppingCart', isActive: 'true', createdAt: new Date() },
      { name: 'Restaurante', type: 'despesa', parentId: 2, color: '#c2410c', icon: 'chefHat', isActive: 'true', createdAt: new Date() },
      { name: 'Delivery', type: 'despesa', parentId: 2, color: '#9a3412', icon: 'bike', isActive: 'true', createdAt: new Date() },
    ];

    sampleCategories.forEach((category) => {
      const newCategory: Category = {
        id: this.currentCategoryId++,
        ...category,
      };
      this.categories.set(newCategory.id, newCategory);
    });

    const sampleTransactions: Omit<Transaction, 'id'>[] = [
      {
        type: 'receita',
        amount: '4500.00',
        categoryId: 1, // Salário
        description: 'Salário Dezembro',
        paymentMethod: 'Transferência',
        date: new Date('2024-12-14T09:00:00'),
        createdAt: new Date(),
      },
      {
        type: 'despesa',
        amount: '187.50',
        categoryId: 12, // Supermercado
        description: 'Supermercado Extra',
        paymentMethod: 'Cartão de Débito',
        date: new Date('2024-12-15T14:30:00'),
        createdAt: new Date(),
      },
      {
        type: 'despesa',  
        amount: '98.40',
        categoryId: 6, // Transporte
        description: 'Posto Shell',
        paymentMethod: 'PIX',
        date: new Date('2024-12-13T16:20:00'),
        createdAt: new Date(),
      },
      {
        type: 'despesa',
        amount: '1200.00',
        categoryId: 9, // Aluguel
        description: 'Aluguel Apartamento',
        paymentMethod: 'Transferência',
        date: new Date('2024-12-12T10:00:00'),
        createdAt: new Date(),
      },
      {
        type: 'despesa',
        amount: '45.00',
        categoryId: 7, // Entretenimento
        description: 'Cinema Cinemark',
        paymentMethod: 'Cartão de Crédito',
        date: new Date('2024-12-10T19:30:00'),
        createdAt: new Date(),
      },
    ];

    sampleTransactions.forEach(transaction => {
      const id = this.currentTransactionId++;
      this.transactions.set(id, { ...transaction, id });
    });
  }

  // Category methods
  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values()).sort((a, b) => a.name.localeCompare(b.name));
  }

  async getCategoryById(id: number): Promise<Category | undefined> {
    return this.categories.get(id);
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const category: Category = {
      id: this.currentCategoryId++,
      ...insertCategory,
      createdAt: new Date(),
    };
    
    this.categories.set(category.id, category);
    return category;
  }

  async updateCategory(id: number, updates: Partial<InsertCategory>): Promise<Category | undefined> {
    const category = this.categories.get(id);
    if (!category) return undefined;

    const updatedCategory = { ...category, ...updates };
    this.categories.set(id, updatedCategory);
    
    return updatedCategory;
  }

  async deleteCategory(id: number): Promise<boolean> {
    // Check if category has transactions
    const hasTransactions = Array.from(this.transactions.values()).some(t => t.categoryId === id);
    if (hasTransactions) return false;
    
    // Check if category has subcategories
    const hasSubcategories = Array.from(this.categories.values()).some(c => c.parentId === id);
    if (hasSubcategories) return false;
    
    return this.categories.delete(id);
  }

  async getCategoriesByType(type: string): Promise<Category[]> {
    return Array.from(this.categories.values())
      .filter(category => category.type === type && category.isActive === 'true')
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  async getTransactions(): Promise<Transaction[]> {
    return Array.from(this.transactions.values()).sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }

  async getTransactionById(id: number): Promise<Transaction | undefined> {
    return this.transactions.get(id);
  }

  async createTransaction(insertTransaction: InsertTransaction): Promise<Transaction> {
    const id = this.currentTransactionId++;
    const transaction: Transaction = {
      ...insertTransaction,
      id,
      paymentMethod: insertTransaction.paymentMethod ?? null,
      createdAt: new Date(),
    };
    this.transactions.set(id, transaction);
    return transaction;
  }

  async updateTransaction(id: number, updates: Partial<InsertTransaction>): Promise<Transaction | undefined> {
    const transaction = this.transactions.get(id);
    if (!transaction) return undefined;

    const updatedTransaction = { ...transaction, ...updates };
    this.transactions.set(id, updatedTransaction);
    return updatedTransaction;
  }

  async deleteTransaction(id: number): Promise<boolean> {
    return this.transactions.delete(id);
  }

  async getTransactionsByDateRange(startDate: Date, endDate: Date): Promise<Transaction[]> {
    const transactions = await this.getTransactions();
    return transactions.filter(t => {
      const transactionDate = new Date(t.date);
      return transactionDate >= startDate && transactionDate <= endDate;
    });
  }

  async getMonthlyRevenueExpenses(months: number): Promise<Array<{ month: string; receitas: number; despesas: number }>> {
    const transactions = await this.getTransactions();
    const result: Array<{ month: string; receitas: number; despesas: number }> = [];

    for (let i = months - 1; i >= 0; i--) {
      const date = subMonths(new Date(), i);
      const monthStart = startOfMonth(date);
      const monthEnd = endOfMonth(date);
      
      const monthTransactions = transactions.filter(t => {
        const transactionDate = new Date(t.date);
        return transactionDate >= monthStart && transactionDate <= monthEnd;
      });

      const receitas = monthTransactions
        .filter(t => t.type === 'receita')
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);

      const despesas = monthTransactions
        .filter(t => t.type === 'despesa')
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);

      result.push({
        month: format(date, 'MMM'),
        receitas,
        despesas,
      });
    }

    return result;
  }

  async getExpensesByCategory(): Promise<Array<{ category: string; amount: number; percentage: number }>> {
    const transactions = await this.getTransactions();
    const expenses = transactions.filter(t => t.type === 'despesa');
    
    const categoryTotals = expenses.reduce((acc, t) => {
      const category = this.categories.get(t.categoryId);
      const categoryName = category ? category.name : 'Indefinido';
      acc[categoryName] = (acc[categoryName] || 0) + parseFloat(t.amount);
      return acc;
    }, {} as Record<string, number>);

    const totalExpenses = Object.values(categoryTotals).reduce((sum, amount) => sum + amount, 0);

    return Object.entries(categoryTotals).map(([category, amount]) => ({
      category,
      amount,
      percentage: totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0,
    })).sort((a, b) => b.amount - a.amount);
  }

  async getFinancialSummary(): Promise<{ totalReceitas: number; totalDespesas: number; saldo: number }> {
    const transactions = await this.getTransactions();
    
    const totalReceitas = transactions
      .filter(t => t.type === 'receita')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    const totalDespesas = transactions
      .filter(t => t.type === 'despesa')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    return {
      totalReceitas,
      totalDespesas,
      saldo: totalReceitas - totalDespesas,
    };
  }
}

export const storage = new MemStorage();
