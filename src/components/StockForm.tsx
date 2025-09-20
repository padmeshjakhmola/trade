import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TrendingUp, DollarSign, AlertTriangle, LogOut, User } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';

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

const PREDEFINED_STOCKS = [
  { symbol: 'TCS', name: 'Tata Consultancy Services', price: 3850 },
  { symbol: 'INFY', name: 'Infosys Limited', price: 1720 },
  { symbol: 'RELIANCE', name: 'Reliance Industries', price: 2950 },
  { symbol: 'HDFCBANK', name: 'HDFC Bank Limited', price: 1650 },
  { symbol: 'ICICIBANK', name: 'ICICI Bank Limited', price: 1180 },
  { symbol: 'HINDUNILVR', name: 'Hindustan Unilever', price: 2420 },
  { symbol: 'BHARTIARTL', name: 'Bharti Airtel Limited', price: 1580 },
  { symbol: 'WIPRO', name: 'Wipro Limited', price: 580 },
  { symbol: 'MARUTI', name: 'Maruti Suzuki India', price: 12800 },
  { symbol: 'ADANIGREEN', name: 'Adani Green Energy', price: 1850 },
];

interface StockFormProps {
  onAddStock: (stock: Omit<Stock, 'userEmail' | 'userName'>) => void;
  currentPortfolioValue: number;
}

export default function StockForm({ onAddStock, currentPortfolioValue }: StockFormProps) {
  const { user, logout } = useAuth();
  const [selectedStock, setSelectedStock] = useState('');
  const [quantity, setQuantity] = useState('');

  const MAX_PORTFOLIO_VALUE = user?.portfolioLimit || 5000000;
  
  const selectedStockData = PREDEFINED_STOCKS.find(stock => stock.symbol === selectedStock);
  const price = selectedStockData?.price || 0;

  const totalValue = Number(quantity) * price || 0;
  const newPortfolioValue = currentPortfolioValue + totalValue;
  const remainingLimit = MAX_PORTFOLIO_VALUE - currentPortfolioValue;
  const isOverLimit = newPortfolioValue > MAX_PORTFOLIO_VALUE;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedStock || !quantity) {
      return;
    }

    if (isOverLimit) {
      return;
    }

    const newStock = {
      id: crypto.randomUUID(),
      name: selectedStock,
      quantity: Number(quantity),
      price: price,
      totalValue,
      timestamp: new Date(),
    };

    onAddStock(newStock);

    setSelectedStock('');
    setQuantity('');
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-gradient-to-br from-card via-card to-muted/50 border-border/50 shadow-2xl">
      <CardHeader className="text-center pb-3">
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <User className="h-4 w-4" />
            <span>{user?.name}</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={logout}
            className="text-muted-foreground hover:text-destructive"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
        <CardTitle className="flex items-center justify-center gap-2 text-2xl font-bold bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-transparent">
          <TrendingUp className="h-6 w-6 text-primary" />
          Buy Stock
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {currentPortfolioValue > MAX_PORTFOLIO_VALUE * 0.8 && (
          <Alert className={currentPortfolioValue > MAX_PORTFOLIO_VALUE * 0.9 ? "border-destructive/50 bg-destructive/10" : "border-warning/50 bg-warning/10"}>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-sm">
              {currentPortfolioValue > MAX_PORTFOLIO_VALUE * 0.9 
                ? `Portfolio limit almost reached. Only ₹${remainingLimit.toLocaleString()} remaining.`
                : `Approaching portfolio limit. ₹${remainingLimit.toLocaleString()} remaining of ₹50,00,000.`
              }
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          <div className="space-y-2">
            <Label htmlFor="stockSelect" className="text-sm font-medium">Select Stock</Label>
            <Select value={selectedStock} onValueChange={setSelectedStock}>
              <SelectTrigger className="h-11 bg-muted/50 border-border/50 focus:border-primary/50">
                <SelectValue placeholder="Choose a stock from NSE" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border z-50">
                {PREDEFINED_STOCKS.map((stock) => (
                  <SelectItem key={stock.symbol} value={stock.symbol}>
                    <div className="flex justify-between items-center w-full">
                      <div>
                        <span className="font-medium">{stock.symbol}</span>
                        <span className="text-xs text-muted-foreground ml-2">{stock.name}</span>
                      </div>
                      <span className="text-success font-medium ml-4">₹{stock.price.toLocaleString()}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity" className="text-sm font-medium">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                placeholder="Enter quantity"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                min="1"
                step="1"
                className="h-11 bg-muted/50 border-border/50 focus:border-primary/50 transition-colors"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price" className="text-sm font-medium">Price (₹)</Label>
              <Input
                id="price"
                type="text"
                value={selectedStockData ? `₹${selectedStockData.price.toLocaleString()}` : ''}
                className="h-11 bg-muted/50 border-border/50 cursor-not-allowed"
                disabled
                readOnly
              />
            </div>
          </div>

          <div className="bg-muted/30 rounded-lg p-4 border border-border/50">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Total Purchase Value:</span>
                <div className="flex items-center gap-1 text-lg font-bold">
                  <span className="text-success">₹{totalValue.toLocaleString()}</span>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">New Portfolio Value:</span>
                <span className={isOverLimit ? "text-destructive font-medium" : "text-muted-foreground"}>
                  ₹{newPortfolioValue.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {isOverLimit && (
            <Alert className="border-destructive/50 bg-destructive/10">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="text-sm">
                This purchase would exceed the ₹50,00,000 portfolio limit. Please reduce quantity.
              </AlertDescription>
            </Alert>
          )}

          <Button
            type="submit"
            className="w-full h-11 bg-gradient-to-r from-primary to-chart-2 hover:from-primary/90 hover:to-chart-2/90 text-primary-foreground font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            disabled={!selectedStock || !quantity || isOverLimit}
          >
            Purchase Stock
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}