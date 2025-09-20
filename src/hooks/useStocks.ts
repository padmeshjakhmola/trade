import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import ApiService, { Stock } from '@/lib/database';
import { useAuth } from '@/contexts/AuthContext';

interface StockInput {
  id: string;
  name: string;
  quantity: number;
  price: number;
  totalValue: number;
  timestamp: Date;
}

export const useStocks = () => {
  const { isAuthenticated, user } = useAuth();

  return useQuery({
    queryKey: ['stocks', user?.id],
    queryFn: async () => {
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
    },
    enabled: isAuthenticated && !!user,
    staleTime: 30000,
    gcTime: 5 * 60 * 1000,
  });
};

export const useAddStock = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (stock: StockInput) => {
      await ApiService.addStock({
        id: stock.id,
        name: stock.name,
        quantity: stock.quantity,
        price: stock.price,
        total_value: stock.totalValue,
        timestamp: stock.timestamp,
      });
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
      await ApiService.deleteStock(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stocks'] });
    },
  });
};