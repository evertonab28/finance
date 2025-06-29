import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import FormularioTransacao from "@/components/forms/formulario-transacao";
import { ArrowLeft } from "lucide-react";
import { Link, useLocation } from "wouter";
import type { InsertTransaction } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function NovaTransacao() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();

  const createTransactionMutation = useMutation({
    mutationFn: async (data: InsertTransaction) => {
      const response = await apiRequest("POST", "/api/transactions", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/transactions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/analytics/financial-summary"] });
      queryClient.invalidateQueries({ queryKey: ["/api/analytics/monthly-revenue-expenses"] });
      queryClient.invalidateQueries({ queryKey: ["/api/analytics/expenses-by-category"] });
      
      toast({
        title: "Transação criada!",
        description: "A transação foi adicionada com sucesso.",
      });
      
      setLocation("/transacoes");
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao criar transação",
        description: error.message || "Não foi possível criar a transação. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (data: InsertTransaction) => {
    createTransactionMutation.mutate(data);
  };

  return (
    <div className="min-h-screen p-4 md:p-6">
      {/* Header */}
      <div className="mb-6 md:mb-8 pt-16 md:pt-0">
        <div className="flex items-center space-x-4">
          <Link href="/transacoes">
            <Button variant="ghost" size="sm" className="p-2 text-slate-400 hover:text-slate-600">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Nova Transação</h1>
            <p className="text-slate-600 mt-1">Registre uma nova receita ou despesa</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-2xl mx-auto">
        <Card className="rounded-2xl border-slate-200">
          <CardContent className="p-8">
            <FormularioTransacao 
              onSubmit={handleSubmit}
              isSubmitting={createTransactionMutation.isPending}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
