import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

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
      const savedData = localStorage.getItem('stocktrader-portfolio');
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        return parsedData.map((stock: any) => ({
          ...stock,
          timestamp: new Date(stock.timestamp)
        }));
      }
      return [];
    },
    staleTime: 30000,
    gcTime: 5 * 60 * 1000,
  });
};

export const useAddStock = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (stock: StockInput) => {
      const savedData = localStorage.getItem('stocktrader-portfolio');
      const existingStocks = savedData ? JSON.parse(savedData) : [];
      const updatedStocks = [stock, ...existingStocks];
      localStorage.setItem('stocktrader-portfolio', JSON.stringify(updatedStocks));
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
      const savedData = localStorage.getItem('stocktrader-portfolio');
      if (savedData) {
        const existingStocks = JSON.parse(savedData);
        const updatedStocks = existingStocks.filter((stock: any) => stock.id !== id);
        localStorage.setItem('stocktrader-portfolio', JSON.stringify(updatedStocks));
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stocks'] });
    },
  });
};