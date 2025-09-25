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
  { symbol: 'IDEA', name: 'Idea Cellular', price: 8.75 },
  { symbol: 'AUBANK', name: 'AU Small Finance Bank', price: 731.65 },
  { symbol: 'ASHOKLEY', name: 'Ashok Leyland', price: 144.05 },
  { symbol: 'JINDALSTEL', name: 'Jindal Steel & Power', price: 1063.50 },
  { symbol: 'INDUSINDBK', name: 'IndusInd Bank', price: 755.00 },
  { symbol: 'ESCORTS', name: 'Escorts Limited', price: 3760.00 },
  { symbol: 'HINDPETRO', name: 'Hindustan Petroleum', price: 424.00 },
  { symbol: 'CANBK', name: 'Canara Bank', price: 121.85 },
  { symbol: 'AXISBANK', name: 'Axis Bank', price: 1170.00 },
  { symbol: 'BAJFINANCE', name: 'Bajaj Finance', price: 1025.90 },
  { symbol: 'MOTHERSON', name: 'Motherson Sumi Systems', price: 112.05 },
  { symbol: 'NMDC', name: 'NMDC Limited', price: 78.30 },
  { symbol: 'JSWSTEEL', name: 'JSW Steel', price: 1137.90 },
  { symbol: 'MFSL', name: 'Max Financial Services', price: 1583.90 },
  { symbol: 'MARUTI', name: 'Maruti Suzuki India', price: 16083.00 },
  { symbol: 'SBIN', name: 'State Bank of India', price: 869.60 },
  { symbol: 'MRF', name: 'MRF Limited', price: 155340.00 },
  { symbol: 'BPCL', name: 'Bharat Petroleum Corporation', price: 330.60 },
  { symbol: 'KOTAKBANK', name: 'Kotak Mahindra Bank', price: 2052.00 },
  { symbol: 'ADANIENT', name: 'Adani Enterprises', price: 2666.00 },
  { symbol: 'ALKEM', name: 'Alkem Laboratories', price: 5570.50 },
  { symbol: 'SAIL', name: 'Steel Authority of India', price: 137.29 },
  { symbol: 'ABCAPITAL', name: 'Aditya Birla Capital', price: 291.90 },
  { symbol: 'BHARTIHEXA', name: 'Bharti Hexacom', price: 1709.90 },
  { symbol: 'NTPC', name: 'NTPC Limited', price: 343.05 },
  { symbol: 'INDUSTOWER', name: 'Indus Towers', price: 359.80 },
  { symbol: 'TATASTEEL', name: 'Tata Steel', price: 173.21 },
  { symbol: 'TATACOMM', name: 'Tata Communications', price: 1669.70 },
  { symbol: 'UNIONBANK', name: 'Union Bank of India', price: 140.15 },
  { symbol: 'HDFCAMC', name: 'HDFC Asset Management Company', price: 5883.50 },
  { symbol: 'YESBANK', name: 'Yes Bank', price: 21.40 },
  { symbol: 'PFC', name: 'Power Finance Corporation', price: 412.50 },
  { symbol: 'TATAMOTORS', name: 'Tata Motors', price: 702.20 },
  { symbol: 'RECLTD', name: 'REC Limited', price: 387.00 },
  { symbol: 'TORNTPOWER', name: 'Torrent Power', price: 1278.40 },
  { symbol: 'BANKBARODA', name: 'Bank of Baroda', price: 253.00 },
  { symbol: 'ZYDUSLIFE', name: 'Zydus Lifesciences', price: 1043.25 },
  { symbol: 'APOLLOTYRE', name: 'Apollo Tyres', price: 489.90 },
  { symbol: 'BANKINDIA', name: 'Bank of India', price: 121.40 },
  { symbol: 'M&M', name: 'Mahindra & Mahindra', price: 3610.00 },
  { symbol: 'BAJAJFINSV', name: 'Bajaj Finserv', price: 2084.00 },
  { symbol: 'POWERGRID', name: 'Power Grid Corporation', price: 288.55 },
  { symbol: 'LTIM', name: 'LTIMindtree', price: 5293.50 },
  { symbol: 'HINDZINC', name: 'Hindustan Zinc', price: 462.00 },
  { symbol: 'PATANJALI', name: 'Patanjali Foods', price: 601.00 },
  { symbol: 'VMM', name: 'Vikram Metal Manufacturing', price: 149.90 },
  { symbol: 'OFSS', name: 'Oracle Financial Services Software', price: 9110.00 },
  { symbol: 'SONACOMS', name: 'Sona BLW Precision Forgings', price: 422.90 },
  { symbol: 'EICHERMOT', name: 'Eicher Motors', price: 6982.50 },
  { symbol: 'FEDERALBNK', name: 'Federal Bank', price: 196.00 },
  { symbol: 'MOTILALOFS', name: 'Motilal Oswal Financial Services', price: 955.00 },
  { symbol: 'ICICIGI', name: 'ICICI Lombard General Insurance', price: 1895.00 },
  { symbol: 'LT', name: 'Larsen & Toubro', price: 3660.00 },
  { symbol: 'MUTHOOTFIN', name: 'Muthoot Finance', price: 3060.00 },
  { symbol: 'JSWENERGY', name: 'JSW Energy', price: 544.95 },
  { symbol: 'DRREDDY', name: 'Dr. Reddys Laboratories', price: 1305.30 },
  { symbol: 'PNB', name: 'Punjab National Bank', price: 113.35 },
  { symbol: 'UNITDSPR', name: 'United Spirits', price: 1342.90 },
  { symbol: 'POLICYBZR', name: 'PB Fintech', price: 1800.00 },
  { symbol: 'LUPIN', name: 'Lupin Limited', price: 2008.20 },
  { symbol: 'DIXON', name: 'Dixon Technologies', price: 18112.00 },
  { symbol: 'OLAELEC', name: 'Ola Electric Mobility', price: 58.10 },
  { symbol: 'APLAPOLLO', name: 'APL Apollo Tubes', price: 1682.00 },
  { symbol: 'GODREJPROP', name: 'Godrej Properties', price: 2106.20 },
  { symbol: 'SBICARD', name: 'SBI Cards and Payment Services', price: 870.00 },
  { symbol: 'GLENMARK', name: 'Glenmark Pharmaceuticals', price: 2019.90 },
  { symbol: 'SWIGGY', name: 'Swiggy Limited', price: 449.95 },
  { symbol: 'HYUNDAI', name: 'Hyundai Motor India', price: 2724.00 },
  { symbol: 'INFY', name: 'Infosys Limited', price: 1500.60 },
  { symbol: 'SHRIRAMFIN', name: 'Shriram Finance', price: 628.30 },
  { symbol: 'IOC', name: 'Indian Oil Corporation', price: 148.39 },
  { symbol: 'RELIANCE', name: 'Reliance Industries', price: 1390.50 },
  { symbol: 'HINDALCO', name: 'Hindalco Industries', price: 745.60 },
  { symbol: 'CGPOWER', name: 'CG Power and Industrial Solutions', price: 770.00 },
  { symbol: 'TATAPOWER', name: 'Tata Power Company', price: 395.10 },
  { symbol: 'SHREECEM', name: 'Shree Cement', price: 29690.00 },
  { symbol: 'CUMMINSIND', name: 'Cummins India', price: 3986.90 },
  { symbol: 'EXIDEIND', name: 'Exide Industries', price: 403.50 },
  { symbol: 'ACC', name: 'ACC Limited', price: 1880.00 },
  { symbol: 'SRF', name: 'SRF Limited', price: 2910.50 },
  { symbol: 'BOSCHLTD', name: 'Bosch Limited', price: 39520.00 },
  { symbol: 'TATACONSUM', name: 'Tata Consumer Products', price: 1128.40 },
  { symbol: 'COALINDIA', name: 'Coal India', price: 394.00 },
  { symbol: 'PETRONET', name: 'Petronet LNG', price: 275.40 },
  { symbol: 'INDIGO', name: 'InterGlobe Aviation', price: 5735.00 },
  { symbol: 'AMBUJACEM', name: 'Ambuja Cements', price: 589.00 },
  { symbol: 'VOLTAS', name: 'Voltas Limited', price: 1373.00 },
  { symbol: 'ONGC', name: 'Oil and Natural Gas Corporation', price: 236.89 },
  { symbol: 'JIOFIN', name: 'Jio Financial Services', price: 313.05 },
  { symbol: 'TORNTPHARM', name: 'Torrent Pharmaceuticals', price: 3646.10 },
  { symbol: 'BAJAJHLDNG', name: 'Bajaj Holdings & Investment', price: 13242.00 },
  { symbol: 'TCS', name: 'Tata Consultancy Services', price: 3065.00 },
  { symbol: 'BHARATFORG', name: 'Bharat Forge', price: 1252.40 },
  { symbol: 'GMRAIRPORT', name: 'GMR Airports Infrastructure', price: 90.90 },
  { symbol: 'ASTRAL', name: 'Astral Limited', price: 1434.00 },
  { symbol: 'MAHABANK', name: 'Bank of Maharashtra', price: 57.08 },
  { symbol: 'VEDL', name: 'Vedanta Limited', price: 457.00 },
  { symbol: 'PERSISTENT', name: 'Persistent Systems', price: 5252.00 },
  { symbol: 'ADANIPORTS', name: 'Adani Ports and Special Economic Zone', price: 1438.80 },
  { symbol: 'WIPRO', name: 'Wipro Limited', price: 249.40 },
  { symbol: 'ICICIBANK', name: 'ICICI Bank', price: 1396.10 },
  { symbol: 'HAL', name: 'Hindustan Aeronautics', price: 4790.00 },
  { symbol: 'CHOLAFIN', name: 'Cholamandalam Investment and Finance Company', price: 1623.70 },
  { symbol: 'SIEMENS', name: 'Siemens Limited', price: 3229.20 },
  { symbol: 'IDFCFIRSTB', name: 'IDFC First Bank', price: 70.60 },
  { symbol: 'TATATECH', name: 'Tata Technologies', price: 699.00 },
  { symbol: 'OBEROIRLTY', name: 'Oberoi Realty', price: 1666.00 },
  { symbol: 'BEL', name: 'Bharat Electronics', price: 404.45 },
  { symbol: 'IRCTC', name: 'Indian Railway Catering and Tourism Corporation', price: 723.40 },
  { symbol: 'BIOCON', name: 'Biocon Limited', price: 360.25 },
  { symbol: 'TITAN', name: 'Titan Company', price: 3439.30 },
  { symbol: 'WAAREEENER', name: 'Waaree Energies', price: 3436.00 },
  { symbol: 'LICI', name: 'Life Insurance Corporation of India', price: 899.50 },
  { symbol: 'BAJAJHFL', name: 'Bajaj Housing Finance', price: 112.60 },
  { symbol: 'HCLTECH', name: 'HCL Technologies', price: 1431.40 },
  { symbol: 'HDFCBANK', name: 'HDFC Bank', price: 958.45 },
  { symbol: 'LTF', name: 'L&T Finance Holdings', price: 246.60 },
  { symbol: 'POLYCAB', name: 'Polycab India', price: 7610.00 },
  { symbol: 'RVNL', name: 'Rail Vikas Nigam', price: 356.65 },
  { symbol: 'BHEL', name: 'Bharat Heavy Electricals', price: 238.10 },
  { symbol: 'PRESTIGE', name: 'Prestige Estates Projects', price: 1607.00 },
  { symbol: 'IRB', name: 'IRB Infrastructure Developers', price: 43.18 },
  { symbol: 'BANDHANBNK', name: 'Bandhan Bank', price: 162.09 },
  { symbol: 'SUNPHARMA', name: 'Sun Pharmaceutical Industries', price: 1632.80 },
  { symbol: 'LICHSGFIN', name: 'LIC Housing Finance', price: 583.30 },
  { symbol: 'TVSMOTOR', name: 'TVS Motor Company', price: 3501.40 },
  { symbol: 'APOLLOHOSP', name: 'Apollo Hospitals Enterprise', price: 7685.00 },
  { symbol: 'ITC', name: 'ITC Limited', price: 404.00 },
  { symbol: 'LODHA', name: 'Macrotech Developers', price: 1203.60 },
  { symbol: 'HAVELLS', name: 'Havells India', price: 1569.80 },
  { symbol: 'NTPCGREEN', name: 'NTPC Green Energy', price: 103.05 },
  { symbol: 'UPL', name: 'UPL Limited', price: 677.55 },
  { symbol: 'CIPLA', name: 'Cipla Limited', price: 1530.00 },
  { symbol: 'NATIONALUM', name: 'National Aluminium Company', price: 209.24 },
  { symbol: 'TATAELXSI', name: 'Tata Elxsi', price: 5560.00 },
  { symbol: 'BHARTIARTL', name: 'Bharti Airtel', price: 1939.50 },
  { symbol: 'ETERNAL', name: 'Eternal Materials Co', price: 338.80 },
  { symbol: 'DIVISLAB', name: 'Divis Laboratories', price: 6038.50 },
  { symbol: 'KPITTECH', name: 'KPIT Technologies', price: 1250.80 },
  { symbol: 'OIL', name: 'Oil India', price: 405.50 },
  { symbol: 'BAJAJ-AUTO', name: 'Bajaj Auto', price: 8968.00 },
  { symbol: 'COLPAL', name: 'Colgate Palmolive India', price: 2322.00 },
  { symbol: 'MAZDOCK', name: 'Mazagon Dock Shipbuilders', price: 2947.10 },
  { symbol: 'SJVN', name: 'SJVN Limited', price: 92.90 },
  { symbol: 'PIIND', name: 'PI Industries', price: 3632.10 },
  { symbol: 'PHOENIXLTD', name: 'Phoenix Mills', price: 1621.70 },
  { symbol: 'IRFC', name: 'Indian Railway Finance Corporation', price: 127.23 },
  { symbol: 'DMART', name: 'Avenue Supermarts', price: 4622.70 },
  { symbol: 'SUPREMEIND', name: 'Supreme Industries', price: 4326.50 },
  { symbol: 'AUROPHARMA', name: 'Aurobindo Pharma', price: 1105.40 },
  { symbol: 'ABB', name: 'ABB India', price: 5303.80 },
  { symbol: 'VBL', name: 'Varun Beverages', price: 458.50 },
  { symbol: 'HEROMOTOCO', name: 'Hero MotoCorp', price: 5365.00 },
  { symbol: 'JUBLFOOD', name: 'Jubilant FoodWorks', price: 615.25 },
  { symbol: 'CONCOR', name: 'Container Corporation of India', price: 543.50 },
  { symbol: 'ADANIENSOL', name: 'Adani Energy Solutions', price: 926.00 },
  { symbol: 'PAYTM', name: 'One 97 Communications', price: 1181.00 },
  { symbol: 'DABUR', name: 'Dabur India', price: 515.40 },
  { symbol: 'MANKIND', name: 'Mankind Pharma', price: 2561.70 },
  { symbol: 'NHPC', name: 'NHPC Limited', price: 86.60 },
  { symbol: 'ASIANPAINT', name: 'Asian Paints', price: 2450.00 },
  { symbol: 'GAIL', name: 'GAIL India', price: 178.51 },
  { symbol: 'TIINDIA', name: 'Tube Investments of India', price: 3305.00 },
  { symbol: 'BSE', name: 'BSE Limited', price: 2126.40 },
  { symbol: 'IGL', name: 'Indraprastha Gas', price: 208.58 },
  { symbol: 'ULTRACEMCO', name: 'UltraTech Cement', price: 12470.00 },
  { symbol: 'GRASIM', name: 'Grasim Industries', price: 2813.60 },
  { symbol: 'ABFRL', name: 'Aditya Birla Fashion and Retail', price: 92.15 },
  { symbol: 'INDIANB', name: 'Indian Bank', price: 694.50 },
  { symbol: 'PAGEIND', name: 'Page Industries', price: 42785.00 },
  { symbol: 'MAXHEALTH', name: 'Max Healthcare Institute', price: 1154.70 },
  { symbol: 'PREMIERENE', name: 'Premier Energies', price: 1011.90 },
  { symbol: 'HDFCLIFE', name: 'HDFC Life Insurance Company', price: 775.90 },
  { symbol: 'ICICIPRULI', name: 'ICICI Prudential Life Insurance Company', price: 600.00 },
  { symbol: 'NYKAA', name: 'FSN E-Commerce Ventures', price: 238.51 },
  { symbol: 'MARICO', name: 'Marico Limited', price: 705.25 },
  { symbol: 'NAUKRI', name: 'Info Edge India', price: 1394.40 },
  { symbol: 'NESTLEIND', name: 'Nestle India', price: 1167.90 },
  { symbol: 'PIDILITIND', name: 'Pidilite Industries', price: 1492.70 },
  { symbol: 'DLF', name: 'DLF Limited', price: 760.30 },
  { symbol: 'SOLARINDS', name: 'Solar Industries India', price: 14210.00 },
  { symbol: 'COCHINSHIP', name: 'Cochin Shipyard', price: 1888.60 },
  { symbol: 'KALYANKJIL', name: 'Kalyan Jewellers India', price: 496.00 },
  { symbol: 'ADANIGREEN', name: 'Adani Green Energy', price: 1131.00 },
  { symbol: 'HINDUNILVR', name: 'Hindustan Unilever', price: 2524.90 },
  { symbol: 'SUZLON', name: 'Suzlon Energy', price: 58.78 },
  { symbol: 'BRITANNIA', name: 'Britannia Industries', price: 5940.00 },
  { symbol: 'HUDCO', name: 'Housing and Urban Development Corporation', price: 235.20 },
  { symbol: 'SBILIFE', name: 'SBI Life Insurance Company', price: 1820.30 },
  { symbol: 'BDL', name: 'Bharat Dynamics', price: 1593.70 },
  { symbol: 'TRENT', name: 'Trent Limited', price: 4905.00 },
  { symbol: 'INDHOTEL', name: 'Indian Hotels Company', price: 752.85 },
  { symbol: 'TECHM', name: 'Tech Mahindra', price: 1472.90 },
  { symbol: 'IREDA', name: 'Indian Renewable Energy Development Agency', price: 155.59 },
  { symbol: 'M&MFIN', name: 'Mahindra & Mahindra Financial Services', price: 282.80 },
  { symbol: 'MPHASIS', name: 'Mphasis Limited', price: 2772.80 },
  { symbol: 'COFORGE', name: 'Coforge Limited', price: 1668.70 },
  { symbol: 'GODREJCP', name: 'Godrej Consumer Products', price: 1192.20 },
  { symbol: 'ADANIPOWER', name: 'Adani Power', price: 163.30 },
  { symbol: 'ATGL', name: 'Adani Total Gas', price: 721.00 }
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