import { useQuery } from "@tanstack/react-query";
import ResumoCard from "@/components/dashboard/resumo-card";
import GraficoBarras from "@/components/dashboard/grafico-barras";
import GraficoPizza from "@/components/dashboard/grafico-pizza";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Download, TrendingUp, TrendingDown, Wallet, Utensils, Briefcase, Car, Home } from "lucide-react";
import type { Transaction } from "@shared/schema";
import { format, formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function Dashboard() {
  const { data: transactions = [], isLoading: transactionsLoading } = useQuery<Transaction[]>({
    queryKey: ["/api/transactions"],
  });

  const { data: monthlyData = [], isLoading: monthlyLoading } = useQuery<Array<{ month: string; receitas: number; despesas: number }>>({
    queryKey: ["/api/analytics/monthly-revenue-expenses"],
  });

  const { data: expensesByCategory = [], isLoading: expensesLoading } = useQuery<Array<{ category: string; amount: number; percentage: number }>>({
    queryKey: ["/api/analytics/expenses-by-category"],
  });

  const { data: financialSummary, isLoading: summaryLoading } = useQuery<{ totalReceitas: number; totalDespesas: number; saldo: number }>({
    queryKey: ["/api/analytics/financial-summary"],
  });

  const getIconForCategory = (category: string) => {
    switch (category.toLowerCase()) {
      case 'alimentação': return <Utensils className="text-red-600 w-4 h-4" />;
      case 'renda': return <Briefcase className="text-green-600 w-4 h-4" />;
      case 'transporte': return <Car className="text-blue-600 w-4 h-4" />;
      case 'moradia': return <Home className="text-purple-600 w-4 h-4" />;
      default: return <Wallet className="text-gray-600 w-4 h-4" />;
    }
  };

  const recentTransactions = transactions.slice(0, 4);

  if (transactionsLoading || monthlyLoading || expensesLoading || summaryLoading) {
    return (
      <div className="min-h-screen p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                <div className="h-6 bg-gray-200 rounded mb-2"></div>
                <div className="h-8 bg-gray-200 rounded mb-1"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Dashboard Financeiro</h1>
            <p className="text-slate-600 mt-1">Visão geral das suas finanças pessoais</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <Select defaultValue="6months">
              <SelectTrigger className="w-[180px] rounded-xl">
                <SelectValue placeholder="Selecionar período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="6months">Últimos 6 meses</SelectItem>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2023">2023</SelectItem>
                <SelectItem value="december">Dezembro 2024</SelectItem>
                <SelectItem value="november">Novembro 2024</SelectItem>
              </SelectContent>
            </Select>
            <Button className="rounded-xl">
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </Button>
          </div>
        </div>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <ResumoCard
          title="Total Receitas"
          value={financialSummary?.totalReceitas || 0}
          type="receitas"
          trend="+12% vs mês anterior"
          icon={<TrendingUp className="w-6 h-6" />}
        />
        <ResumoCard
          title="Total Despesas"
          value={financialSummary?.totalDespesas || 0}
          type="despesas"
          trend="-3% vs mês anterior"
          icon={<TrendingDown className="w-6 h-6" />}
        />
        <ResumoCard
          title="Saldo Atual"
          value={financialSummary?.saldo || 0}
          type={financialSummary && financialSummary.saldo >= 0 ? "receitas" : "despesas"}
          trend="Saldo positivo"
          icon={<Wallet className="w-6 h-6" />}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <GraficoBarras data={monthlyData} />
        <GraficoPizza data={expensesByCategory} />
      </div>

      {/* Recent Transactions */}
      <Card className="rounded-2xl border-slate-200">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-slate-800">Transações Recentes</CardTitle>
            <Button variant="ghost" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              Ver todas
              <span className="ml-1">→</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-4">
            {recentTransactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-b-0">
                <div className="flex items-center space-x-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    transaction.type === 'receita' ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    {getIconForCategory(transaction.category)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-800">{transaction.description}</p>
                    <p className="text-xs text-slate-500">
                      {transaction.category} • {formatDistanceToNow(new Date(transaction.date), { addSuffix: true, locale: ptBR })}
                    </p>
                  </div>
                </div>
                <span className={`text-sm font-semibold ${
                  transaction.type === 'receita' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {transaction.type === 'receita' ? '+' : '-'}R$ {parseFloat(transaction.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
