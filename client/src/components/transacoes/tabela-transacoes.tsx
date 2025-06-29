import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Utensils, Briefcase, Car, Home, Film } from "lucide-react";
import type { Transaction } from "@shared/schema";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface TabelaTransacoesProps {
  transactions: Transaction[];
  onDelete: (id: number) => void;
  isDeleting: boolean;
}

export default function TabelaTransacoes({ transactions, onDelete, isDeleting }: TabelaTransacoesProps) {
  const getIconForCategory = (category: string) => {
    switch (category.toLowerCase()) {
      case 'alimentação': return <Utensils className="w-4 h-4 text-red-600" />;
      case 'renda': return <Briefcase className="w-4 h-4 text-green-600" />;
      case 'transporte': return <Car className="w-4 h-4 text-blue-600" />;
      case 'moradia': return <Home className="w-4 h-4 text-purple-600" />;
      case 'entretenimento': return <Film className="w-4 h-4 text-yellow-600" />;
      default: return <Briefcase className="w-4 h-4 text-gray-600" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'alimentação': return 'bg-red-100 text-red-700';
      case 'renda': return 'bg-green-100 text-green-700';
      case 'transporte': return 'bg-blue-100 text-blue-700';
      case 'moradia': return 'bg-purple-100 text-purple-700';
      case 'entretenimento': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (transactions.length === 0) {
    return (
      <Card className="rounded-2xl border-slate-200">
        <div className="p-8 text-center">
          <p className="text-slate-500">Nenhuma transação encontrada.</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="rounded-2xl border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px]">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="text-left py-4 px-6 text-sm font-medium text-slate-700">Data</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-slate-700">Descrição</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-slate-700">Categoria</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-slate-700">Tipo</th>
              <th className="text-right py-4 px-6 text-sm font-medium text-slate-700">Valor</th>
              <th className="text-center py-4 px-6 text-sm font-medium text-slate-700">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {transactions.map((transaction) => (
              <tr key={transaction.id} className="hover:bg-slate-50 transition-colors duration-150">
                <td className="py-4 px-6 text-sm text-slate-600">
                  {format(new Date(transaction.date), 'dd/MM/yyyy', { locale: ptBR })}
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      transaction.type === 'receita' ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      {getIconForCategory(transaction.category)}
                    </div>
                    <span className="text-sm font-medium text-slate-800">{transaction.description}</span>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <Badge className={`rounded-full text-xs font-medium ${getCategoryColor(transaction.category)}`}>
                    {transaction.category}
                  </Badge>
                </td>
                <td className="py-4 px-6">
                  <Badge className={`rounded-full text-xs font-medium ${
                    transaction.type === 'receita' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {transaction.type === 'receita' ? 'Receita' : 'Despesa'}
                  </Badge>
                </td>
                <td className={`py-4 px-6 text-right text-sm font-semibold ${
                  transaction.type === 'receita' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {transaction.type === 'receita' ? '+' : '-'}R$ {parseFloat(transaction.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </td>
                <td className="py-4 px-6 text-center">
                  <div className="flex items-center justify-center space-x-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="p-1 text-slate-400 hover:text-blue-600 transition-colors duration-150"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="p-1 text-slate-400 hover:text-red-600 transition-colors duration-150"
                      onClick={() => onDelete(transaction.id)}
                      disabled={isDeleting}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between">
        <div className="text-sm text-slate-600">
          Mostrando {transactions.length} transações
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" className="rounded-lg" disabled>
            Anterior
          </Button>
          <Button size="sm" className="rounded-lg">1</Button>
          <Button variant="outline" size="sm" className="rounded-lg" disabled>
            Próximo
          </Button>
        </div>
      </div>
    </Card>
  );
}
