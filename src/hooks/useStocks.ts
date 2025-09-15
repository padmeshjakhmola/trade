import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import ApiService, { Stock } from '@/lib/database';

interface StockInput {
  id: string;
  name: string;
  quantity: number;
  price: number;
  totalValue: number;
  timestamp: Date;
  userEmail: string;
  userName: string;
}

export const useStocks = () => {
  return useQuery({
    queryKey: ['stocks'],
    queryFn: async () => {
      try {
        const stocks = await ApiService.getAllStocks();
        return stocks.map(stock => ({
          id: stock.id,
          name: stock.name,
          quantity: stock.quantity,
          price: Number(stock.price),
          totalValue: Number(stock.total_value),
          timestamp: new Date(stock.timestamp),
          userEmail: stock.user_email,
          userName: stock.user_name
        }));
      } catch (error) {
        console.error('API error, falling back to localStorage:', error);
        const savedData = localStorage.getItem('stocktrader-portfolio');
        if (savedData) {
          const parsedData = JSON.parse(savedData);
          return parsedData.map((stock: any) => ({
            ...stock,
            timestamp: new Date(stock.timestamp)
          }));
        }
        return [];
      }
    },
    staleTime: 30000,
    gcTime: 5 * 60 * 1000,
  });
};

export const useAddStock = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (stock: StockInput) => {
      try {
        await ApiService.addStock({
          id: stock.id,
          name: stock.name,
          quantity: stock.quantity,
          price: stock.price,
          total_value: stock.totalValue,
          timestamp: stock.timestamp,
          user_email: stock.userEmail,
          user_name: stock.userName
        });
      } catch (error) {
        console.error('API error, falling back to localStorage:', error);
        const savedData = localStorage.getItem('stocktrader-portfolio');
        const existingStocks = savedData ? JSON.parse(savedData) : [];
        const updatedStocks = [stock, ...existingStocks];
        localStorage.setItem('stocktrader-portfolio', JSON.stringify(updatedStocks));
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stocks'] });
    },
  });
};

export const useDeleteStock = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      try {
        await ApiService.deleteStock(id);
      } catch (error) {
        console.error('API error, falling back to localStorage:', error);
        const savedData = localStorage.getItem('stocktrader-portfolio');
        if (savedData) {
          const existingStocks = JSON.parse(savedData);
          const updatedStocks = existingStocks.filter((stock: any) => stock.id !== id);
          localStorage.setItem('stocktrader-portfolio', JSON.stringify(updatedStocks));
        }
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stocks'] });
    },
  });
};