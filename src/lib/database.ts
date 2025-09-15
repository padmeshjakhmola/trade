const getApiBaseUrl = () => {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  return 'http://localhost:8080';
};

export interface Stock {
  id: string;
  name: string;
  quantity: number;
  price: number;
  total_value: number;
  timestamp: Date;
  user_email: string;
  user_name: string;
}

export class ApiService {
  static async getAllStocks(): Promise<Stock[]> {
    try {
      const response = await fetch(`${getApiBaseUrl()}/api/stocks`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data.map((stock: any) => ({
        ...stock,
        price: Number(stock.price),
        total_value: Number(stock.total_value),
        timestamp: new Date(stock.timestamp)
      }));
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  static async addStock(stock: Omit<Stock, 'timestamp'> & { timestamp?: Date }): Promise<void> {
    try {
      const response = await fetch(`${getApiBaseUrl()}/api/stocks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: stock.id,
          name: stock.name,
          quantity: stock.quantity,
          price: stock.price,
          total_value: stock.total_value,
          timestamp: stock.timestamp || new Date(),
          user_email: stock.user_email,
          user_name: stock.user_name
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  static async deleteStock(id: string): Promise<void> {
    try {
      const response = await fetch(`${getApiBaseUrl()}/api/stocks/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }
}

export default ApiService;