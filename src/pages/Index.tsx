import { toast } from '@/hooks/use-toast';
import { useStocks, useAddStock } from '@/hooks/useStocks';
import StockForm from '@/components/StockForm';
import PortfolioChart from '@/components/PortfolioChart';
import StockList from '@/components/StockList';
import { LoginForm } from '@/components/LoginForm';
import { RegisterForm } from '@/components/RegisterForm';
import { useAuth } from '@/contexts/AuthContext';
import { TrendingUp, Wallet, LogOut, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';

interface Stock {
  id: string;
  name: string;
  quantity: number;
  price: number;
  totalValue: number;
  timestamp: Date;
  userEmail: string;
  userName: string;
}

const Index = () => {
  const { user, isAuthenticated, logout, loading } = useAuth();
  const { data: stocks = [], isLoading, error, refetch } = useStocks();
  const addStockMutation = useAddStock();
  const queryClient = useQueryClient();
  const [isLogin, setIsLogin] = useState(true);

  const handleAddStock = (stock: Omit<Stock, 'userEmail' | 'userName'>) => {
    addStockMutation.mutate(stock, {
      onSuccess: () => {
        toast({
          title: "Stock Purchased!",
          description: `Successfully purchased ${stock.quantity} shares of ${stock.name}`,
          className: "bg-success text-success-foreground border-success/20",
        });
      },
      onError: (error) => {
        console.error('Error adding stock:', error);
        const errorMessage = error instanceof Error ? error.message : "Failed to save stock";
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      }
    });
  };


  const handleExportCSV = () => {
    if (stocks.length === 0) {
      toast({
        title: "No Data",
        description: "No transactions to export",
        variant: "destructive",
      });
      return;
    }

    const headers = ['Stock Symbol', 'User Name', 'Email', 'Quantity', 'Price (₹)', 'Total Value (₹)', 'Date', 'Time'];
    const csvContent = [
      headers.join(','),
      ...stocks.map(stock => [
        stock.name,
        stock.userName,
        stock.userEmail,
        stock.quantity,
        stock.price,
        stock.totalValue,
        stock.timestamp.toLocaleDateString(),
        stock.timestamp.toLocaleTimeString()
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `portfolio_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Export Complete",
      description: "Portfolio data exported successfully",
      className: "bg-success text-success-foreground border-success/20",
    });
  };

  const totalValue = stocks.reduce((sum, stock) => sum + stock.totalValue, 0);

  const handleReload = () => {
    queryClient.invalidateQueries({ queryKey: ['stocks'] });
    refetch();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b border-border/50 bg-card/30 backdrop-blur-sm sticky top-0 z-40">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-center">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-primary to-chart-2 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-transparent">
                    StockTrader Pro
                  </h1>
                  <p className="text-sm text-muted-foreground">Modern Portfolio Management</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
            <div className="w-full max-w-md">
              {isLogin ? (
                <LoginForm onSwitchToRegister={() => setIsLogin(false)} />
              ) : (
                <RegisterForm onSwitchToLogin={() => setIsLogin(true)} />
              )}
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading portfolio data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="space-y-2">
            <p className="text-destructive mb-2">Error loading portfolio data</p>
            <p className="text-muted-foreground text-sm">Please reload to try again</p>
          </div>
          <div className="flex gap-3 justify-center">
            <Button onClick={handleReload} className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              Reload
            </Button>
            <Button onClick={() => window.location.reload()} variant="outline" className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              Full Reload
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/50 bg-card/30 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-primary to-chart-2 rounded-lg">
                <TrendingUp className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-transparent">
                  StockTrader Pro
                </h1>
                <p className="text-sm text-muted-foreground">Modern Portfolio Management</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Welcome, {user?.name}</p>
                <p className="text-sm text-muted-foreground">Total Portfolio</p>
                <p className="text-xl font-bold text-success">₹{totalValue.toLocaleString()}</p>
              </div>
              <div className="p-2 bg-success/10 rounded-lg">
                <Wallet className="h-6 w-6 text-success" />
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={logout}
                className="flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <StockForm onAddStock={handleAddStock} currentPortfolioValue={totalValue} />
          </div>

          <div className="lg:col-span-2">
            <PortfolioChart stocks={stocks} />
          </div>

          <div className="lg:col-span-3">
            <StockList
              stocks={stocks}
              onExportCSV={handleExportCSV}
            />
          </div>
        </div>
      </main>

      <footer className="border-t border-border/50 bg-card/30 backdrop-blur-sm mt-16">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-sm text-muted-foreground">
            <p>© 2025 StockTrader Pro</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
