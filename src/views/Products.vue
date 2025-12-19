<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { api } from '../services/api'
import warehouseService from '../services/warehouseService'

const router = useRouter()
const products = ref([])
const warehouses = ref([])
const selectedWarehouse = ref('all')
const isLoading = ref(true)
const search = ref('')

// Carrega os produtos
async function loadProducts() {
  try {
    isLoading.value = true
    const { data } = await api.get('/api/products')
    products.value = data
  } catch (error) {
    console.error('Erro ao carregar produtos:', error)
    error.value = 'Erro ao carregar a lista de produtos'
  } finally {
    isLoading.value = false
  }
}

// Carrega os armazéns
async function loadWarehouses() {
  try {
    const data = await warehouseService.getAllWarehouses()
    warehouses.value = data
  } catch (error) {
    console.error('Erro ao carregar armazéns:', error)
  }
}

// Filtra produtos por nome, SKU e armazém
const filteredProducts = computed(() => {
  let result = [...products.value]
  
  // Filtra por termo de busca
  if (search.value.trim()) {
    const searchTerm = search.value.toLowerCase()
    result = result.filter(p => 
      p.name.toLowerCase().includes(searchTerm) ||
      (p.sku && p.sku.toLowerCase().includes(searchTerm)) ||
      p.ml_item_id.toLowerCase().includes(searchTerm)
    )
  }
  
  // Filtra por armazém
  if (selectedWarehouse.value && selectedWarehouse.value !== 'all') {
    result = result.filter(p => {
      if (!p.inventory || !p.inventory.length) return false;
      return p.inventory.some(item => {
        const warehouseId = item.warehouse?._id || item.warehouse;
        return warehouseId === selectedWarehouse.value || 
               warehouseId?.toString() === selectedWarehouse.value;
      });
    });
  }
  
  return result
})

// Formata o estoque com cores
const getStockClass = (stock) => {
  if (stock <= 0) return 'stock-out'
  if (stock <= 10) return 'stock-low'
  return 'stock-ok'
}

// Obtém o nome do armazém pelo ID
const getWarehouseName = (warehouseId) => {
  if (!warehouseId) return 'Não definido'
  if (warehouseId._id) return warehouseId.name // Handle populated warehouse object
  const warehouse = warehouses.value.find(w => w._id === warehouseId || w._id.toString() === warehouseId)
  return warehouse ? warehouse.name : 'Desconhecido'
}

// Navega para adicionar novo produto
const goToAddProduct = () => {
  router.push('/adicionar-produto')
}

// Editar produto
const editProduct = (productId) => {
  router.push(`/editar-produto/${productId}`)
}

// Confirmar exclusão
const confirmDelete = (productId, productName) => {
  if (confirm(`Tem certeza que deseja excluir o produto "${productName}"?`)) {
    deleteProduct(productId)
  }
}

// Excluir produto
const deleteProduct = async (productId) => {
  if (!confirm('Tem certeza que deseja excluir este produto? Esta ação não pode ser desfeita.')) {
    return
  }
  
  try {
    await api.delete(`/api/products/${productId}`)
    // Recarregar a lista de produtos após a exclusão
    loadProducts()
  } catch (error) {
    console.error('Erro ao excluir produto:', error)
    alert('Erro ao excluir o produto. Tente novamente.')
  }
}

onMounted(() => {
  loadProducts()
  loadWarehouses()
})
</script>

<template>
  <div class="container">
    <div class="header">
      <h1>📦 Controle de Estoque</h1>
      <button @click="goToAddProduct" class="btn btn-primary">
        ➕ Adicionar Produto
      </button>
    </div>

    <!-- Barra de pesquisa e filtros -->
    <div class="filters-container">
      <div class="search-box">
        <input
          v-model="search"
          placeholder="🔍 Buscar por nome, SKU ou ML Item ID"
          class="search-input"
        />
        <span class="search-count">
          {{ filteredProducts.length }} {{ filteredProducts.length === 1 ? 'item' : 'itens' }} encontrados
        </span>
      </div>
      
      <div class="warehouse-filter">
        <label for="warehouse">Armazém:</label>
        <select id="warehouse" v-model="selectedWarehouse" class="warehouse-select">
          <option value="all">Todos os Armazéns</option>
          <option 
            v-for="warehouse in warehouses" 
            :key="warehouse._id" 
            :value="warehouse._id"
          >
            {{ warehouse.name }}
          </option>
        </select>
      </div>
    </div>

    <!-- Lista de produtos -->
    <div class="table-responsive">
      <table class="products-table">
        <thead>
          <tr>
            <th>ML Item ID</th>
            <th>Produto</th>
            <th>SKU</th>
            <th>Armazém</th>
            <th class="text-center">Estoque Total</th>
            <th class="text-center">Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="isLoading">
            <td colspan="4" class="loading-cell">
              <div class="loading-spinner"></div>
              <span>Carregando produtos...</span>
            </td>
          </tr>
          <tr v-else-if="filteredProducts.length === 0">
            <td colspan="4" class="no-results">
              Nenhum produto encontrado
            </td>
          </tr>
          <tr v-for="p in filteredProducts" :key="p._id" class="product-row">
            <td class="ml-id">{{ p.ml_item_id }}</td>
            <td class="product-name">{{ p.name }}</td>
            <td class="sku">{{ p.sku || '-' }}</td>
            <td class="warehouse">
              <template v-if="p.inventory && p.inventory.length > 0">
                <div v-for="item in p.inventory" :key="item.warehouse._id || item.warehouse" class="inventory-item">
                  {{ getWarehouseName(item.warehouse) }}: {{ item.quantity }}
                </div>
              </template>
              <span v-else>-</span>
            </td>
            <td :class="['stock', getStockClass(p.totalStock)]">
              {{ p.totalStock || 0 }}
            </td>
            <td class="actions">
              <button @click="editProduct(p._id)" class="btn-edit" title="Editar">
                ✏️
              </button>
              <button @click="confirmDelete(p._id, p.name)" class="btn-delete" title="Excluir">
                🗑️
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  flex-wrap: wrap;
  gap: 20px;
}

h1 {
  color: #2c3e50;
  margin: 0;
  font-size: 1.8rem;
}

.filters-container {
  display: flex;
  gap: 20px;
  margin-bottom: 25px;
  flex-wrap: wrap;
  align-items: center;
}

.search-box {
  flex: 1;
  min-width: 300px;
  position: relative;
  max-width: 500px;
}

.warehouse-filter {
  display: flex;
  align-items: center;
  gap: 10px;
}

.warehouse-select {
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 0.95rem;
  background-color: #f8f9fa;
  min-width: 200px;
}

.warehouse-select:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.2);
  background-color: white;
}

.search-input {
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  transition: all 0.3s;
  padding-left: 40px;
  background-color: #f8f9fa;
}

.search-input:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.2);
  background-color: white;
}

.search-count {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.85rem;
  color: #7f8c8d;
  background: white;
  padding: 0 8px;
  border-radius: 10px;
  pointer-events: none;
}

.table-responsive {
  overflow-x: auto;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.products-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.95rem;
}

.products-table th,
.products-table td {
  padding: 15px;
  text-align: left;
}

.product-row {
  transition: background-color 0.2s;
}

.product-row:hover {
  background-color: #f8f9fa;
}

.warehouse {
  color: #555;
  font-size: 0.9em;
}

.products-table th {
  background-color: #f8f9fa;
  font-weight: 600;
  color: #2c3e50;
  text-transform: uppercase;
  font-size: 0.8rem;
  letter-spacing: 0.5px;
}

.products-table tbody tr:hover {
  background-color: #f8f9fa;
}

.product-name {
  font-weight: 500;
  color: #2c3e50;
}

.ml-id {
  font-family: 'Courier New', monospace;
  color: #7f8c8d;
  font-size: 0.9rem;
}

.sku {
  color: #7f8c8d;
  font-size: 0.9rem;
}

.stock {
  font-weight: 600;
  text-align: right;
  padding-right: 20px;
}

.stock-ok {
  color: #27ae60;
}

.stock-low {
  color: #f39c12;
}

.stock-out {
  color: #e74c3c;
}

.loading-cell,
.no-results {
  text-align: center;
  padding: 30px;
  color: #7f8c8d;
}

.loading-spinner {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 3px solid rgba(52, 152, 219, 0.3);
  border-radius: 50%;
  border-top-color: #3498db;
  animation: spin 1s ease-in-out infinite;
  margin-right: 10px;
  vertical-align: middle;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 0.95rem;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.btn-primary {
  background-color: #3498db;
  color: white;
}

.btn-primary:hover {
  background-color: #2980b9;
}

.text-right {
  text-align: right;
}

@media (max-width: 768px) {
  .header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .search-box {
    max-width: 100%;
  }
  
  .products-table th,
  .products-table td {
    padding: 10px;
  }
}
</style>
