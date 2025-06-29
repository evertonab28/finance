import { transactions, type Transaction, type InsertTransaction } from "@shared/schema";
import { format, startOfMonth, endOfMonth, subMonths } from "date-fns";

export interface IStorage {
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
  private currentId: number;

  constructor() {
    this.transactions = new Map();
    this.currentId = 1;
    
    // Initialize with some sample data for demonstration
    this.initializeSampleData();
  }

  private initializeSampleData() {
    const sampleTransactions: Omit<Transaction, 'id'>[] = [
      {
        type: 'receita',
        amount: '4500.00',
        category: 'Renda',
        description: 'Salário Dezembro',
        paymentMethod: 'Transferência',
        date: new Date('2024-12-14T09:00:00'),
        createdAt: new Date(),
      },
      {
        type: 'despesa',
        amount: '187.50',
        category: 'Alimentação',
        description: 'Supermercado Extra',
        paymentMethod: 'Cartão de Débito',
        date: new Date('2024-12-15T14:30:00'),
        createdAt: new Date(),
      },
      {
        type: 'despesa',
        amount: '98.40',
        category: 'Transporte',
        description: 'Posto Shell',
        paymentMethod: 'PIX',
        date: new Date('2024-12-13T16:20:00'),
        createdAt: new Date(),
      },
      {
        type: 'despesa',
        amount: '1200.00',
        category: 'Moradia',
        description: 'Aluguel Apartamento',
        paymentMethod: 'Transferência',
        date: new Date('2024-12-12T10:00:00'),
        createdAt: new Date(),
      },
      {
        type: 'despesa',
        amount: '45.00',
        category: 'Entretenimento',
        description: 'Cinema Cinemark',
        paymentMethod: 'Cartão de Crédito',
        date: new Date('2024-12-10T19:30:00'),
        createdAt: new Date(),
      },
    ];

    sampleTransactions.forEach(transaction => {
      const id = this.currentId++;
      this.transactions.set(id, { ...transaction, id });
    });
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
    const id = this.currentId++;
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
      acc[t.category] = (acc[t.category] || 0) + parseFloat(t.amount);
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
