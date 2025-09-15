import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, PieChart as PieChartIcon, BarChart3 } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

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

interface PortfolioChartProps {
  stocks: Stock[];
}

const COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
];

export default function PortfolioChart({ stocks }: PortfolioChartProps) {
  const [chartType, setChartType] = useState<'pie' | 'bar'>('pie');

  const aggregatedStocks = stocks.reduce((acc, stock) => {
    const existingStock = acc.find(s => s.name === stock.name);
    if (existingStock) {
      existingStock.quantity += stock.quantity;
      existingStock.totalValue += stock.totalValue;
    } else {
      acc.push({
        name: stock.name,
        quantity: stock.quantity,
        totalValue: stock.totalValue,
      });
    }
    return acc;
  }, [] as { name: string; quantity: number; totalValue: number }[]);

  const totalPortfolioValue = aggregatedStocks.reduce((sum, stock) => sum + stock.totalValue, 0);

  const pieData = aggregatedStocks.map((stock, index) => ({
    name: stock.name,
    value: stock.totalValue,
    percentage: ((stock.totalValue / totalPortfolioValue) * 100).toFixed(1),
    fill: COLORS[index % COLORS.length],
  }));

  const barData = aggregatedStocks.map((stock) => ({
    name: stock.name,
    value: stock.totalValue,
    quantity: stock.quantity,
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="font-semibold text-foreground">{data.name}</p>
          <p className="text-success">
            Value: ₹{data.value?.toLocaleString()}
          </p>
          {chartType === 'pie' && (
            <p className="text-muted-foreground text-sm">
              {data.percentage}% of portfolio
            </p>
          )}
          {chartType === 'bar' && (
            <p className="text-muted-foreground text-sm">
              Quantity: {data.quantity}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  if (aggregatedStocks.length === 0) {
    return (
      <Card className="w-full bg-gradient-to-br from-card via-card to-muted/50 border-border/50">
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center space-y-2">
            <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto" />
            <p className="text-muted-foreground">No stocks in portfolio yet</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full bg-gradient-to-br from-card via-card to-muted/50 border-border/50 shadow-2xl">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="flex items-center gap-2 text-xl font-bold">
          {chartType === 'pie' ? (
            <PieChartIcon className="h-5 w-5 text-primary" />
          ) : (
            <BarChart3 className="h-5 w-5 text-primary" />
          )}
          Portfolio Overview
        </CardTitle>
        <div className="flex gap-2">
          <Button
            variant={chartType === 'pie' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setChartType('pie')}
            className="h-8"
          >
            <PieChartIcon className="h-4 w-4" />
          </Button>
          <Button
            variant={chartType === 'bar' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setChartType('bar')}
            className="h-8"
          >
            <BarChart3 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4 p-4 bg-muted/30 rounded-lg border border-border/50">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Total Portfolio Value</p>
            <p className="text-2xl font-bold text-success">
              ₹{totalPortfolioValue.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'pie' ? (
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  formatter={(value, entry: any) => (
                    <span style={{ color: entry.color }} className="text-sm">
                      {value}
                    </span>
                  )}
                />
              </PieChart>
            ) : (
              <BarChart data={barData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="name" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickFormatter={(value) => `₹${value.toLocaleString()}`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="value" 
                  fill="hsl(var(--primary))"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}