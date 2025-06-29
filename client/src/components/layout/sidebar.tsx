import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { 
  ChartPie, 
  List, 
  Plus, 
  Settings,
  BarChart3,
  Menu,
  X
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/", icon: ChartPie },
  { name: "Transações", href: "/transacoes", icon: List },
  { name: "Nova Transação", href: "/nova-transacao", icon: Plus },
  { name: "Configurações", href: "/configuracoes", icon: Settings },
];

export default function Sidebar() {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/") {
      return location === "/" || location === "/dashboard";
    }
    return location === href;
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="fixed top-4 left-4 z-50 md:hidden">
        <Button
          variant="outline"
          size="sm"
          onClick={toggleMobileMenu}
          className="bg-white shadow-md rounded-xl p-2"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
      </div>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={closeMobileMenu}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg border-r border-slate-200 transform transition-transform duration-300 ease-in-out ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0`}>
        <div className="flex h-full flex-col">
          {/* Logo/Brand */}
          <div className="flex items-center px-6 py-5 border-b border-slate-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-sm">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-slate-800">FinanceDash</h1>
            </div>
          </div>
          
          {/* Navigation Menu */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.name} href={item.href}>
                  <Button
                    variant="ghost"
                    onClick={closeMobileMenu}
                    className={`w-full justify-start px-4 py-3 text-sm font-medium rounded-xl transition-colors duration-200 ${
                      isActive(item.href)
                        ? "bg-blue-50 text-blue-700 border border-blue-200"
                        : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <Icon className="mr-3 w-5 h-5" />
                    {item.name}
                  </Button>
                </Link>
              );
            })}
          </nav>
          
          {/* User Profile */}
          <div className="p-4 border-t border-slate-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-medium text-sm">JD</span>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-800">João da Silva</p>
                <p className="text-xs text-slate-500">Premium</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}