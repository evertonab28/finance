import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { TrendingUp, TrendingDown, Plus } from "lucide-react";
import type { InsertTransaction } from "@shared/schema";
import { insertTransactionSchema } from "@shared/schema";

const formSchema = insertTransactionSchema.extend({
  amount: z.string().min(1, "Valor é obrigatório"),
});

type FormData = z.infer<typeof formSchema>;

interface FormularioTransacaoProps {
  onSubmit: (data: InsertTransaction) => void;
  isSubmitting: boolean;
}

export default function FormularioTransacao({ onSubmit, isSubmitting }: FormularioTransacaoProps) {
  const [transactionType, setTransactionType] = useState<"receita" | "despesa">("receita");

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: "receita",
      amount: "",
      category: "",
      description: "",
      paymentMethod: "",
      date: new Date(),
    },
  });

  const handleSubmit = (data: FormData) => {
    const submitData: InsertTransaction = {
      ...data,
      type: transactionType,
      amount: data.amount.replace(/[^\d,]/g, '').replace(',', '.'),
      date: new Date(data.date),
    };
    onSubmit(submitData);
  };

  const handleTypeChange = (type: "receita" | "despesa") => {
    setTransactionType(type);
    form.setValue("type", type);
  };

  const categories = transactionType === "receita" 
    ? ["Renda", "Freelance", "Investimentos", "Outros"]
    : ["Alimentação", "Transporte", "Moradia", "Saúde", "Entretenimento", "Educação", "Roupas", "Outros"];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Transaction Type */}
        <div>
          <Label className="text-sm font-medium text-slate-700 mb-3 block">Tipo da Transação</Label>
          <div className="grid grid-cols-2 gap-4">
            <Button
              type="button"
              variant={transactionType === "receita" ? "default" : "outline"}
              className={`p-4 font-medium transition-all duration-200 rounded-xl ${
                transactionType === "receita"
                  ? "bg-green-50 text-green-700 border-2 border-green-200 hover:bg-green-100"
                  : "border-2 border-slate-200 text-slate-600 hover:border-slate-300"
              }`}
              onClick={() => handleTypeChange("receita")}
            >
              <TrendingUp className="mr-2 w-4 h-4" />
              Receita
            </Button>
            <Button
              type="button"
              variant={transactionType === "despesa" ? "default" : "outline"}
              className={`p-4 font-medium transition-all duration-200 rounded-xl ${
                transactionType === "despesa"
                  ? "bg-red-50 text-red-700 border-2 border-red-200 hover:bg-red-100"
                  : "border-2 border-slate-200 text-slate-600 hover:border-slate-300"
              }`}
              onClick={() => handleTypeChange("despesa")}
            >
              <TrendingDown className="mr-2 w-4 h-4" />
              Despesa
            </Button>
          </div>
        </div>

        {/* Amount */}
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-slate-700">Valor</FormLabel>
              <FormControl>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 font-medium">R$</span>
                  <Input
                    {...field}
                    placeholder="0,00"
                    className="pl-12 text-lg font-medium rounded-xl"
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Category */}
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-slate-700">Categoria</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="rounded-xl">
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Date */}
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-slate-700">Data</FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    {...field}
                    value={field.value instanceof Date ? field.value.toISOString().split('T')[0] : field.value}
                    className="rounded-xl"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-slate-700">Descrição</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Descreva a transação..."
                  rows={3}
                  className="resize-none rounded-xl"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Payment Method */}
        <FormField
          control={form.control}
          name="paymentMethod"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-slate-700">Forma de Pagamento</FormLabel>
              <Select onValueChange={field.onChange} value={field.value || ""}>
                <FormControl>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="Selecione a forma de pagamento" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Dinheiro">Dinheiro</SelectItem>
                  <SelectItem value="Cartão de Débito">Cartão de Débito</SelectItem>
                  <SelectItem value="Cartão de Crédito">Cartão de Crédito</SelectItem>
                  <SelectItem value="PIX">PIX</SelectItem>
                  <SelectItem value="Transferência">Transferência</SelectItem>
                  <SelectItem value="Boleto">Boleto</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Action Buttons */}
        <div className="flex items-center justify-end space-x-4 pt-6">
          <Button 
            type="button" 
            variant="outline" 
            className="px-6 py-3 rounded-xl font-medium"
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button 
            type="submit" 
            className="px-6 py-3 rounded-xl font-medium" 
            disabled={isSubmitting}
          >
            <Plus className="w-4 h-4 mr-2" />
            {isSubmitting ? "Adicionando..." : "Adicionar Transação"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
