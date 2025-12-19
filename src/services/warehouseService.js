import { api } from './api';

const API_PREFIX = '/api';

export default {
  // Get all warehouses
  async getAllWarehouses() {
    const response = await api.get(`${API_PREFIX}/warehouses`);
    return response.data;
  },

  // Get a single warehouse by ID
  async getWarehouse(id) {
    const response = await api.get(`${API_PREFIX}/warehouses/${id}`);
    return response.data;
  },

  // Create a new warehouse
  async createWarehouse(warehouseData) {
    const response = await api.post(`${API_PREFIX}/warehouses`, warehouseData);
    return response.data;
  },

  // Update a warehouse
  async updateWarehouse(id, updateData) {
    const response = await api.put(`${API_PREFIX}/warehouses/${id}`, updateData);
    return response.data;
  },

  // Delete a warehouse
  async deleteWarehouse(id) {
    const response = await api.delete(`${API_PREFIX}/warehouses/${id}`);
    return response.data;
  },

  // Get products in a specific warehouse
  async getWarehouseProducts(warehouseId) {
    const response = await api.get(`${API_PREFIX}/warehouses/${warehouseId}/products`);
    return response.data;
  },

  // Update stock for a product in a warehouse
  async updateProductStock(warehouseId, productId, quantity) {
    const response = await api.put(
      `${API_PREFIX}/warehouses/${warehouseId}/products/${productId}`, 
      { quantity }
    );
    return response.data;
  }
};
