import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { financeService } from "@/lib/services";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit2, Trash2, FolderPlus } from "lucide-react";
import type { Category, InsertCategory } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export default function Categorias() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedType, setSelectedType] = useState<"receita" | "despesa">("despesa");

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ["/api/categories"],
    queryFn: () => financeService.getCategories(),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => financeService.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
      toast({
        title: "Categoria removida",
        description: "A categoria foi removida com sucesso.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao remover categoria",
        description: error.message || "Não foi possível remover a categoria.",
        variant: "destructive",
      });
    },
  });

  const filteredCategories = categories.filter(cat => cat.type === selectedType);
  const mainCategories = filteredCategories.filter(cat => !cat.parentId);
  const subcategories = filteredCategories.filter(cat => cat.parentId);

  const getSubcategoriesForParent = (parentId: number) => {
    return subcategories.filter(cat => cat.parentId === parentId);
  };

  const handleDelete = (id: number) => {
    if (confirm("Tem certeza que deseja remover esta categoria?")) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">Carregando categorias...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Categorias</h1>
          <p className="text-muted-foreground">
            Gerencie suas categorias e subcategorias personalizáveis
          </p>
        </div>
        <div className="flex gap-2">
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Nova Categoria
          </Button>
          <Button variant="outline" size="sm">
            <FolderPlus className="h-4 w-4 mr-2" />
            Nova Subcategoria
          </Button>
        </div>
      </div>

      <div className="flex gap-2">
        <Button
          variant={selectedType === "despesa" ? "default" : "outline"}
          onClick={() => setSelectedType("despesa")}
        >
          Despesas
        </Button>
        <Button
          variant={selectedType === "receita" ? "default" : "outline"}
          onClick={() => setSelectedType("receita")}
        >
          Receitas
        </Button>
      </div>

      <div className="grid gap-4">
        {mainCategories.map((category) => {
          const subs = getSubcategoriesForParent(category.id);
          
          return (
            <Card key={category.id}>
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: category.color || "#6b7280" }}
                    />
                    <div>
                      <CardTitle className="text-lg">{category.name}</CardTitle>
                      <CardDescription>
                        {category.type === "receita" ? "Categoria de receita" : "Categoria de despesa"}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={category.isActive === "true" ? "default" : "secondary"}>
                      {category.isActive === "true" ? "Ativa" : "Inativa"}
                    </Badge>
                    <Button variant="ghost" size="sm">
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(category.id)}
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              {subs.length > 0 && (
                <CardContent>
                  <h4 className="text-sm font-medium mb-3 text-muted-foreground">
                    Subcategorias ({subs.length})
                  </h4>
                  <div className="grid gap-2">
                    {subs.map((sub) => (
                      <div
                        key={sub.id}
                        className="flex items-center justify-between p-3 rounded-lg border bg-muted/50"
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: sub.color || "#6b7280" }}
                          />
                          <span className="text-sm">{sub.name}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Badge variant={sub.isActive === "true" ? "default" : "secondary"} className="text-xs">
                            {sub.isActive === "true" ? "Ativa" : "Inativa"}
                          </Badge>
                          <Button variant="ghost" size="sm">
                            <Edit2 className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(sub.id)}
                            disabled={deleteMutation.isPending}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>

      {mainCategories.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              Nenhuma categoria encontrada para {selectedType === "receita" ? "receitas" : "despesas"}.
            </p>
            <Button className="mt-4">
              <Plus className="h-4 w-4 mr-2" />
              Criar primeira categoria
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}