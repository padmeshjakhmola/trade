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
  { symbol: 'NIFTY', name: 'NIFTY 200', price: 13730.05 },
  { symbol: 'LT', name: 'Larsen & Toubro', price: 3743.00 },
  { symbol: 'TORNTPHARM', name: 'Torrent Pharmaceuticals', price: 3587.90 },
  { symbol: 'TATAMOTORS', name: 'Tata Motors', price: 673.95 },
  { symbol: 'ITC', name: 'ITC Limited', price: 405.00 },
  { symbol: 'ASHOKLEY', name: 'Ashok Leyland', price: 141.80 },
  { symbol: 'EICHERMOT', name: 'Eicher Motors', price: 7035.00 },
  { symbol: 'RELIANCE', name: 'Reliance Industries', price: 1379.00 },
  { symbol: 'MOTHERSON', name: 'Motherson Sumi Systems', price: 105.89 },
  { symbol: 'TVSMOTOR', name: 'TVS Motor Company', price: 3423.00 },
  { symbol: 'AUBANK', name: 'AU Small Finance Bank', price: 743.85 },
  { symbol: 'BSE', name: 'BSE Limited', price: 2047.90 },
  { symbol: 'MARUTI', name: 'Maruti Suzuki India', price: 16307.00 },
  { symbol: 'ICICIGI', name: 'ICICI Lombard General Insurance', price: 1885.20 },
  { symbol: 'SONACOMS', name: 'Sona BLW Precision Forgings', price: 409.65 },
  { symbol: 'M&MFIN', name: 'Mahindra & Mahindra Financial Services', price: 279.55 },
  { symbol: 'HDFCLIFE', name: 'HDFC Life Insurance Company', price: 764.00 },
  { symbol: 'SJVN', name: 'SJVN Limited', price: 91.86 },
  { symbol: 'GODREJPROP', name: 'Godrej Properties', price: 1963.00 },
  { symbol: 'HINDPETRO', name: 'Hindustan Petroleum', price: 422.40 },
  { symbol: 'BRITANNIA', name: 'Britannia Industries', price: 5935.00 },
  { symbol: 'HINDALCO', name: 'Hindalco Industries', price: 742.50 },
  { symbol: 'ULTRACEMCO', name: 'UltraTech Cement', price: 12090.00 },
  { symbol: 'ABB', name: 'ABB India', price: 5179.00 },
  { symbol: 'SBILIFE', name: 'SBI Life Insurance Company', price: 1801.50 },
  { symbol: 'TATAPOWER', name: 'Tata Power Company', price: 384.20 },
  { symbol: 'SBIN', name: 'State Bank of India', price: 857.00 },
  { symbol: 'DLF', name: 'DLF Limited', price: 717.40 },
  { symbol: 'LODHA', name: 'Macrotech Developers', price: 1143.10 },
  { symbol: 'HDFCBANK', name: 'HDFC Bank', price: 944.25 },
  { symbol: 'AUROPHARMA', name: 'Aurobindo Pharma', price: 1090.50 },
  { symbol: 'ONGC', name: 'Oil and Natural Gas Corporation', price: 238.15 },
  { symbol: 'BAJAJHFL', name: 'Bajaj Housing Finance', price: 110.55 },
  { symbol: 'HEROMOTOCO', name: 'Hero MotoCorp', price: 5319.00 },
  { symbol: 'CIPLA', name: 'Cipla Limited', price: 1499.40 },
  { symbol: 'NTPC', name: 'NTPC Limited', price: 338.20 },
  { symbol: 'CUMMINSIND', name: 'Cummins India', price: 3949.50 },
  { symbol: 'POWERGRID', name: 'Power Grid Corporation', price: 282.35 },
  { symbol: 'MARICO', name: 'Marico Limited', price: 698.50 },
  { symbol: 'INDIANB', name: 'Indian Bank', price: 706.80 },
  { symbol: 'FEDERALBNK', name: 'Federal Bank', price: 191.74 },
  { symbol: 'MOTILALOFS', name: 'Motilal Oswal Financial Services', price: 912.50 },
  { symbol: 'HAL', name: 'Hindustan Aeronautics', price: 4734.80 },
  { symbol: 'COALINDIA', name: 'Coal India', price: 389.10 },
  { symbol: 'CONCOR', name: 'Container Corporation of India', price: 525.10 },
  { symbol: 'OBEROIRLTY', name: 'Oberoi Realty', price: 1585.80 },
  { symbol: 'IOC', name: 'Indian Oil Corporation', price: 144.90 },
  { symbol: 'BOSCHLTD', name: 'Bosch Limited', price: 38175.00 },
  { symbol: 'ICICIBANK', name: 'ICICI Bank', price: 1362.50 },
  { symbol: 'KALYANKJIL', name: 'Kalyan Jewellers India', price: 458.00 },
  { symbol: 'NESTLEIND', name: 'Nestle India', price: 1162.00 },
  { symbol: 'KOTAKBANK', name: 'Kotak Mahindra Bank', price: 1993.60 },
  { symbol: 'SUPREMEIND', name: 'Supreme Industries', price: 4229.00 },
  { symbol: 'BHARTIARTL', name: 'Bharti Airtel', price: 1915.40 },
  { symbol: 'TRENT', name: 'Trent Limited', price: 4693.00 },
  { symbol: 'HINDUNILVR', name: 'Hindustan Unilever', price: 2512.00 },
  { symbol: 'PIDILITIND', name: 'Pidilite Industries', price: 1479.90 },
  { symbol: 'AXISBANK', name: 'Axis Bank', price: 1154.00 },
  { symbol: 'PHOENIXLTD', name: 'Phoenix Mills', price: 1545.90 },
  { symbol: 'SHRIRAMFIN', name: 'Shriram Finance', price: 606.00 },
  { symbol: 'MUTHOOTFIN', name: 'Muthoot Finance', price: 3017.80 },
  { symbol: 'ADANIPORTS', name: 'Adani Ports and Special Economic Zone', price: 1391.40 },
  { symbol: 'EXIDEIND', name: 'Exide Industries', price: 388.75 },
  { symbol: 'MAXHEALTH', name: 'Max Healthcare Institute', price: 1124.80 },
  { symbol: 'DMART', name: 'Avenue Supermarts', price: 4524.10 },
  { symbol: 'POLYCAB', name: 'Polycab India', price: 7323.00 },
  { symbol: 'PETRONET', name: 'Petronet LNG', price: 267.05 },
  { symbol: 'GRASIM', name: 'Grasim Industries', price: 2745.00 },
  { symbol: 'DABUR', name: 'Dabur India', price: 500.10 },
  { symbol: 'IGL', name: 'Indraprastha Gas', price: 202.42 },
  { symbol: 'TATACONSUM', name: 'Tata Consumer Products', price: 1120.00 },
  { symbol: 'CHOLAFIN', name: 'Cholamandalam Investment and Finance Company', price: 1572.30 },
  { symbol: 'MFSL', name: 'Max Financial Services', price: 1544.90 },
  { symbol: 'MRF', name: 'MRF Limited', price: 148430.00 },
  { symbol: 'TITAN', name: 'Titan Company', price: 3333.00 },
  { symbol: 'OIL', name: 'Oil India', price: 409.20 },
  { symbol: 'GAIL', name: 'GAIL India', price: 172.05 },
  { symbol: 'VMM', name: 'Vikram Metal Manufacturing', price: 144.00 },
  { symbol: 'UNITDSPR', name: 'United Spirits', price: 1298.70 },
  { symbol: 'BAJAJ-AUTO', name: 'Bajaj Auto', price: 8715.00 },
  { symbol: 'JSWENERGY', name: 'JSW Energy', price: 521.00 },
  { symbol: 'ACC', name: 'ACC Limited', price: 1825.00 },
  { symbol: 'PAYTM', name: 'One 97 Communications', price: 1124.80 },
  { symbol: 'APOLLOHOSP', name: 'Apollo Hospitals Enterprise', price: 7513.00 },
  { symbol: 'ADANIPOWER', name: 'Adani Power', price: 146.75 },
  { symbol: 'BANDHANBNK', name: 'Bandhan Bank', price: 154.90 },
  { symbol: 'LICHSGFIN', name: 'LIC Housing Finance', price: 562.75 },
  { symbol: 'IRFC', name: 'Indian Railway Finance Corporation', price: 122.20 },
  { symbol: 'IRCTC', name: 'Indian Railway Catering and Tourism Corporation', price: 704.00 },
  { symbol: 'PATANJALI', name: 'Patanjali Foods', price: 590.80 },
  { symbol: 'BHEL', name: 'Bharat Heavy Electricals', price: 231.00 },
  { symbol: 'BPCL', name: 'Bharat Petroleum Corporation', price: 324.50 },
  { symbol: 'ADANIENT', name: 'Adani Enterprises', price: 2535.60 },
  { symbol: 'BAJAJFINSV', name: 'Bajaj Finserv', price: 2003.00 },
  { symbol: 'DRREDDY', name: 'Dr. Reddys Laboratories', price: 1254.00 },
  { symbol: 'SIEMENS', name: 'Siemens Limited', price: 3104.00 },
  { symbol: 'SWIGGY', name: 'Swiggy Limited', price: 419.00 },
  { symbol: 'BEL', name: 'Bharat Electronics', price: 396.40 },
  { symbol: 'VBL', name: 'Varun Beverages', price: 444.30 },
  { symbol: 'TATATECH', name: 'Tata Technologies', price: 668.80 },
  { symbol: 'YESBANK', name: 'Yes Bank', price: 20.99 },
  { symbol: 'ADANIENSOL', name: 'Adani Energy Solutions', price: 879.00 },
  { symbol: 'ALKEM', name: 'Alkem Laboratories', price: 5413.50 },
  { symbol: 'BANKBARODA', name: 'Bank of Baroda', price: 248.45 },
  { symbol: 'JSWSTEEL', name: 'JSW Steel', price: 1128.50 },
  { symbol: 'JIOFIN', name: 'Jio Financial Services', price: 296.35 },
  { symbol: 'NMDC', name: 'NMDC Limited', price: 75.05 },
  { symbol: 'TCS', name: 'Tata Consultancy Services', price: 2905.40 },
  { symbol: 'LICI', name: 'Life Insurance Corporation of India', price: 872.50 },
  { symbol: 'TORNTPOWER', name: 'Torrent Power', price: 1232.00 },
  { symbol: 'SBICARD', name: 'SBI Cards and Payment Services', price: 871.00 },
  { symbol: 'IDFCFIRSTB', name: 'IDFC First Bank', price: 68.65 },
  { symbol: 'PFC', name: 'Power Finance Corporation', price: 397.85 },
  { symbol: 'PRESTIGE', name: 'Prestige Estates Projects', price: 1506.00 },
  { symbol: 'ICICIPRULI', name: 'ICICI Prudential Life Insurance Company', price: 583.95 },
  { symbol: 'APLAPOLLO', name: 'APL Apollo Tubes', price: 1656.20 },
  { symbol: 'JINDALSTEL', name: 'Jindal Steel & Power', price: 1030.95 },
  { symbol: 'RVNL', name: 'Rail Vikas Nigam', price: 339.70 },
  { symbol: 'NTPCGREEN', name: 'NTPC Green Energy', price: 99.70 },
  { symbol: 'MANKIND', name: 'Mankind Pharma', price: 2475.30 },
  { symbol: 'HCLTECH', name: 'HCL Technologies', price: 1395.10 },
  { symbol: 'SUZLON', name: 'Suzlon Energy', price: 55.49 },
  { symbol: 'JUBLFOOD', name: 'Jubilant FoodWorks', price: 609.00 },
  { symbol: 'NYKAA', name: 'FSN E-Commerce Ventures', price: 231.63 },
  { symbol: 'BAJAJHLDNG', name: 'Bajaj Holdings & Investment', price: 12636.00 },
  { symbol: 'OLAELEC', name: 'Ola Electric Mobility', price: 54.89 },
  { symbol: 'LUPIN', name: 'Lupin Limited', price: 1922.90 },
  { symbol: 'GODREJCP', name: 'Godrej Consumer Products', price: 1164.50 },
  { symbol: 'MAHABANK', name: 'Bank of Maharashtra', price: 54.16 },
  { symbol: 'GMRAIRPORT', name: 'GMR Airports Infrastructure', price: 87.23 },
  { symbol: 'ESCORTS', name: 'Escorts Limited', price: 3525.50 },
  { symbol: 'RECLTD', name: 'REC Limited', price: 367.10 },
  { symbol: 'ABCAPITAL', name: 'Aditya Birla Capital', price: 280.25 },
  { symbol: 'INFY', name: 'Infosys Limited', price: 1452.20 },
  { symbol: 'BHARATFORG', name: 'Bharat Forge', price: 1180.70 },
  { symbol: 'SHREECEM', name: 'Shree Cement', price: 28860.00 },
  { symbol: 'CGPOWER', name: 'CG Power and Industrial Solutions', price: 742.00 },
  { symbol: 'WIPRO', name: 'Wipro Limited', price: 236.50 },
  { symbol: 'HDFCAMC', name: 'HDFC Asset Management Company', price: 5620.00 },
  { symbol: 'HAVELLS', name: 'Havells India', price: 1504.00 },
  { symbol: 'PIIND', name: 'PI Industries', price: 3490.00 },
  { symbol: 'ASTRAL', name: 'Astral Limited', price: 1373.00 },
  { symbol: 'INDIGO', name: 'InterGlobe Aviation', price: 5540.00 },
  { symbol: 'TIINDIA', name: 'Tube Investments of India', price: 3136.80 },
  { symbol: 'IREDA', name: 'Indian Renewable Energy Development Agency', price: 146.69 },
  { symbol: 'IRB', name: 'IRB Infrastructure Developers', price: 41.00 },
  { symbol: 'AMBUJACEM', name: 'Ambuja Cements', price: 565.35 },
  { symbol: 'COCHINSHIP', name: 'Cochin Shipyard', price: 1880.00 },
  { symbol: 'MPHASIS', name: 'Mphasis Limited', price: 2649.50 },
  { symbol: 'INDUSTOWER', name: 'Indus Towers', price: 347.50 },
  { symbol: 'NATIONALUM', name: 'National Aluminium Company', price: 200.43 },
  { symbol: 'TECHM', name: 'Tech Mahindra', price: 1407.00 },
  { symbol: 'ASIANPAINT', name: 'Asian Paints', price: 2342.00 },
  { symbol: 'COLPAL', name: 'Colgate Palmolive India', price: 2215.00 },
  { symbol: 'PREMIERENE', name: 'Premier Energies', price: 1022.20 },
  { symbol: 'SUNPHARMA', name: 'Sun Pharmaceutical Industries', price: 1585.00 },
  { symbol: 'CANBK', name: 'Canara Bank', price: 118.25 },
  { symbol: 'ADANIGREEN', name: 'Adani Green Energy', price: 1051.00 },
  { symbol: 'BHARTIHEXA', name: 'Bharti Hexacom', price: 1682.00 },
  { symbol: 'PERSISTENT', name: 'Persistent Systems', price: 4965.00 },
  { symbol: 'BANKINDIA', name: 'Bank of India', price: 116.49 },
  { symbol: 'BAJFINANCE', name: 'Bajaj Finance', price: 985.00 },
  { symbol: 'NAUKRI', name: 'Info Edge India', price: 1321.20 },
  { symbol: 'VOLTAS', name: 'Voltas Limited', price: 1334.50 },
  { symbol: 'SOLARINDS', name: 'Solar Industries India', price: 13755.00 },
  { symbol: 'SRF', name: 'SRF Limited', price: 2799.00 },
  { symbol: 'ETERNAL', name: 'Eternal Materials Co', price: 322.90 },
  { symbol: 'ABFRL', name: 'Aditya Birla Fashion and Retail', price: 84.85 },
  { symbol: 'GLENMARK', name: 'Glenmark Pharmaceuticals', price: 1972.00 },
  { symbol: 'MAZDOCK', name: 'Mazagon Dock Shipbuilders', price: 2839.00 },
  { symbol: 'TATASTEEL', name: 'Tata Steel', price: 167.35 },
  { symbol: 'APOLLOTYRE', name: 'Apollo Tyres', price: 478.75 },
  { symbol: 'TATAELXSI', name: 'Tata Elxsi', price: 5300.00 },
  { symbol: 'INDHOTEL', name: 'Indian Hotels Company', price: 710.20 },
  { symbol: 'PNB', name: 'Punjab National Bank', price: 107.90 },
  { symbol: 'COFORGE', name: 'Coforge Limited', price: 1541.00 },
  { symbol: 'NHPC', name: 'NHPC Limited', price: 83.70 },
  { symbol: 'VEDL', name: 'Vedanta Limited', price: 446.95 },
  { symbol: 'TATACOMM', name: 'Tata Communications', price: 1606.00 },
  { symbol: 'KPITTECH', name: 'KPIT Technologies', price: 1215.70 },
  { symbol: 'LTIM', name: 'LTIMindtree', price: 5047.00 },
  { symbol: 'ATGL', name: 'Adani Total Gas', price: 649.70 },
  { symbol: 'PAGEIND', name: 'Page Industries', price: 41200.00 },
  { symbol: 'HUDCO', name: 'Housing and Urban Development Corporation', price: 220.79 },
  { symbol: 'LTF', name: 'L&T Finance Holdings', price: 235.72 },
  { symbol: 'UPL', name: 'UPL Limited', price: 646.25 },
  { symbol: 'UNIONBANK', name: 'Union Bank of India', price: 133.98 },
  { symbol: 'BDL', name: 'Bharat Dynamics', price: 1499.90 },
  { symbol: 'POLICYBZR', name: 'PB Fintech', price: 1687.90 },
  { symbol: 'M&M', name: 'Mahindra & Mahindra', price: 3400.00 },
  { symbol: 'DIXON', name: 'Dixon Technologies', price: 17530.00 },
  { symbol: 'HINDZINC', name: 'Hindustan Zinc', price: 449.50 },
  { symbol: 'HYUNDAI', name: 'Hyundai Motor India', price: 2635.00 },
  { symbol: 'DIVISLAB', name: 'Divis Laboratories', price: 5675.00 },
  { symbol: 'INDUSINDBK', name: 'IndusInd Bank', price: 712.00 },
  { symbol: 'OFSS', name: 'Oracle Financial Services Software', price: 8545.00 },
  { symbol: 'SAIL', name: 'Steel Authority of India', price: 130.60 },
  { symbol: 'ZYDUSLIFE', name: 'Zydus Lifesciences', price: 974.95 },
  { symbol: 'BIOCON', name: 'Biocon Limited', price: 338.95 },
  { symbol: 'WAAREEENER', name: 'Waaree Energies', price: 3199.90 },
  { symbol: 'IDEA', name: 'Vodafone Idea', price: 8.04 }
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