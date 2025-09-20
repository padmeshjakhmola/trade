import { AuthService } from './auth';

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
  private static getAuthHeaders() {
    const token = AuthService.getToken();
    return {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    };
  }

  static async getAllStocks(): Promise<Stock[]> {
    try {
      const response = await fetch(`${getApiBaseUrl()}/api/stocks`, {
        headers: this.getAuthHeaders(),
      });
      if (!response.ok) {
        if (response.status === 401) {
          AuthService.clearAuth();
          throw new Error('Session expired. Please login again.');
        }
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

  static async addStock(stock: Omit<Stock, 'timestamp' | 'user_email' | 'user_name'> & { timestamp?: Date }): Promise<void> {
    try {
      const response = await fetch(`${getApiBaseUrl()}/api/stocks`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({
          id: stock.id,
          name: stock.name,
          quantity: stock.quantity,
          price: stock.price,
          total_value: stock.total_value,
          timestamp: stock.timestamp || new Date(),
        }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          AuthService.clearAuth();
          throw new Error('Session expired. Please login again.');
        }
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
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
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        if (response.status === 401) {
          AuthService.clearAuth();
          throw new Error('Session expired. Please login again.');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }
}

export default ApiService;