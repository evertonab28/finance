import { Card, CardContent } from "@/components/ui/card";

interface ResumoCardProps {
  title: string;
  value: number;
  type: "receitas" | "despesas";
  trend: string;
  icon: React.ReactNode;
}

export default function ResumoCard({ title, value, type, trend, icon }: ResumoCardProps) {
  const isPositive = type === "receitas";
  const valueColor = isPositive ? "text-green-600" : "text-red-600";
  const trendColor = trend.includes("+") ? "text-green-600" : trend.includes("-") ? "text-red-600" : "text-green-600";
  const iconBgColor = isPositive ? "bg-green-100" : type === "despesas" ? "bg-red-100" : "bg-blue-100";
  const iconColor = isPositive ? "text-green-600" : type === "despesas" ? "text-red-600" : "text-blue-600";

  return (
    <Card className="rounded-2xl border-slate-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-600">{title}</p>
            <p className={`text-2xl font-bold mt-1 ${valueColor}`}>
              R$ {value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <p className={`text-xs mt-1 ${trendColor}`}>
              <span className="mr-1">
                {trend.includes("+") ? "↑" : trend.includes("-") ? "↓" : "📈"}
              </span>
              {trend}
            </p>
          </div>
          <div className={`w-12 h-12 ${iconBgColor} rounded-xl flex items-center justify-center`}>
            <div className={iconColor}>
              {icon}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
