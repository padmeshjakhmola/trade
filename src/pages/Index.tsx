import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import StockForm from '@/components/StockForm';
import PortfolioChart from '@/components/PortfolioChart';
import StockList from '@/components/StockList';
import { TrendingUp, BarChart3, Wallet } from 'lucide-react';

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
  const [stocks, setStocks] = useState<Stock[]>([]);

  const handleAddStock = (stock: Stock) => {
    setStocks(prev => [stock, ...prev]);
    toast({
      title: "Stock Purchased!",
      description: `Successfully purchased ${stock.quantity} shares of ${stock.name}`,
      className: "bg-success text-success-foreground border-success/20",
    });
  };

  const handleDeleteStock = (id: string) => {
    setStocks(prev => prev.filter(stock => stock.id !== id));
    toast({
      title: "Transaction Deleted",
      description: "Stock transaction has been removed from your portfolio",
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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
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
                <p className="text-sm text-muted-foreground">Total Portfolio</p>
                <p className="text-xl font-bold text-success">₹{totalValue.toLocaleString()}</p>
              </div>
              <div className="p-2 bg-success/10 rounded-lg">
                <Wallet className="h-6 w-6 text-success" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Stock Form */}
          <div className="lg:col-span-1">
            <StockForm onAddStock={handleAddStock} currentPortfolioValue={totalValue} />
          </div>

          {/* Portfolio Chart */}
          <div className="lg:col-span-2">
            <PortfolioChart stocks={stocks} />
          </div>

          {/* Stock List */}
          <div className="lg:col-span-3">
            <StockList 
              stocks={stocks} 
              onExportCSV={handleExportCSV}
              onDeleteStock={handleDeleteStock}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-card/30 backdrop-blur-sm mt-16">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-sm text-muted-foreground">
            <p>© 2024 StockTrader Pro. Built with React & Recharts.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
