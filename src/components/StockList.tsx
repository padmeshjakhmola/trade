import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, TrendingUp } from 'lucide-react';

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

interface StockListProps {
  stocks: Stock[];
  onExportCSV: () => void;
}

export default function StockList({ stocks, onExportCSV }: StockListProps) {
  if (stocks.length === 0) {
    return (
      <Card className="w-full bg-gradient-to-br from-card via-card to-muted/50 border-border/50">
        <CardContent className="flex items-center justify-center h-32">
          <p className="text-muted-foreground">No transactions yet</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full bg-gradient-to-br from-card via-card to-muted/50 border-border/50 shadow-2xl">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="flex items-center gap-2 text-xl font-bold">
          <TrendingUp className="h-5 w-5 text-primary" />
          Recent Transactions
        </CardTitle>
        <Button
          onClick={onExportCSV}
          size="sm"
          className="bg-gradient-to-r from-success to-chart-2 hover:from-success/90 hover:to-chart-2/90 text-success-foreground"
        >
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {stocks.map((stock) => (
          <div
            key={stock.id}
            className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border/50 hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="font-mono font-bold">
                    {stock.name}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {stock.timestamp.toLocaleDateString()} {stock.timestamp.toLocaleTimeString()}
                  </span>
                </div>
                <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                  <span>Qty: {stock.quantity}</span>
                  <span>@₹{stock.price.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="flex items-center gap-1 text-lg font-bold text-success">
                <span>₹{stock.totalValue.toLocaleString()}</span>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}