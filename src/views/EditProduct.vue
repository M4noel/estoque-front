<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { api } from '../services/api'
import warehouseService from '../services/warehouseService'

const route = useRoute()
const router = useRouter()

// Dados do produto
const productId = ref('')
const ml_item_id = ref('')
const name = ref('')
const sku = ref('')
const stock = ref(0)
const warehouseId = ref('')
const warehouses = ref([])
const isLoading = ref(false)
const error = ref('')

// Carrega os dados do produto
const loadProduct = async () => {
  try {
    isLoading.value = true
    const { data } = await api.get(`/api/products/${productId.value}`)
    
    // Preenche os campos do formulário
    ml_item_id.value = data.ml_item_id
    name.value = data.name
    sku.value = data.sku || ''
    
    // Se houver inventário, preenche o estoque e armazém
    if (data.inventory && data.inventory.length > 0) {
      const firstItem = data.inventory[0]
      stock.value = firstItem.quantity
      warehouseId.value = firstItem.warehouse?._id || firstItem.warehouse
    }
    
  } catch (err) {
    console.error('Erro ao carregar produto:', err)
    error.value = 'Erro ao carregar os dados do produto'
  } finally {
    isLoading.value = false
  }
}

// Carrega a lista de armazéns
const loadWarehouses = async () => {
  try {
    warehouses.value = await warehouseService.getAllWarehouses()
  } catch (err) {
    error.value = 'Erro ao carregar a lista de armazéns'
    console.error('Erro ao carregar armazéns:', err)
  }
}

// Atualiza o produto
const updateProduct = async () => {
  error.value = ''
  
  // Validação
  if (!ml_item_id.value || !name.value) {
    error.value = 'ML Item ID e Nome são obrigatórios'
    return
  }

  if (!warehouseId.value) {
    error.value = 'Selecione um armazém'
    return
  }

  try {
    isLoading.value = true
    
    // Atualiza os dados básicos do produto
    await api.put(`/api/products/${productId.value}`, {
      ml_item_id: ml_item_id.value,
      name: name.value,
      sku: sku.value || undefined
    })
    
    // Atualiza o estoque no armazém selecionado
    if (warehouseId.value) {
      await api.post(`/api/products/${productId.value}/inventory`, {
        warehouseId: warehouseId.value,
        quantity: Number(stock.value)
      })
    }
    
    // Redireciona de volta para a lista de produtos
    router.push('/produtos')
    
  } catch (err) {
    console.error('Erro ao atualizar produto:', err)
    error.value = err.response?.data?.message || 'Erro ao atualizar o produto. Tente novamente.'
  } finally {
    isLoading.value = false
  }
}

// Carrega os dados iniciais
onMounted(() => {
  productId.value = route.params.id
  if (productId.value) {
    loadProduct()
  }
  loadWarehouses()
})
</script>

<template>
  <div class="container">
    <div class="card">
      <h2>✏️ Editar Produto</h2>
      
      <div v-if="error" class="error-message">
        {{ error }}
      </div>
      
      <form @submit.prevent="updateProduct">
        <div class="form-group">
          <label for="ml_item_id">ML Item ID *</label>
          <input 
            id="ml_item_id"
            v-model="ml_item_id" 
            placeholder="Ex: MLB1234567890" 
            class="form-control"
            required
            :disabled="isLoading"
          />
        </div>
        
        <div class="form-group">
          <label for="name">Nome do Produto *</label>
          <input 
            id="name"
            v-model="name" 
            placeholder="Ex: Celular XYZ" 
            class="form-control"
            required
            :disabled="isLoading"
          />
        </div>
        
        <div class="form-group">
          <label for="sku">SKU (opcional)</label>
          <input 
            id="sku"
            v-model="sku" 
            placeholder="Código SKU" 
            class="form-control"
            :disabled="isLoading"
          />
        </div>
        
        <div class="form-group">
          <label for="stock">Quantidade em Estoque</label>
          <input 
            id="stock"
            v-model.number="stock" 
            type="number" 
            min="0"
            class="form-control"
            :disabled="isLoading"
          />
        </div>
        
        <div class="form-group">
          <label for="warehouse">Armazém *</label>
          <select 
            id="warehouse"
            v-model="warehouseId"
            class="form-control"
            required
            :disabled="isLoading || warehouses.length === 0"
          >
            <option v-if="warehouses.length === 0" value="" disabled>Nenhum armazém cadastrado</option>
            <option 
              v-for="warehouse in warehouses" 
              v-else
              :key="warehouse._id"
              :value="warehouse._id"
            >
              {{ warehouse.name }}
            </option>
          </select>
        </div>
        
        <div class="form-actions">
          <button 
            type="button" 
            class="btn btn-secondary"
            @click="router.push('/produtos')"
            :disabled="isLoading"
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            class="btn btn-primary"
            :disabled="isLoading"
          >
            <span v-if="isLoading">Salvando...</span>
            <span v-else>Salvar Alterações</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.card {
  background: white;
  border-radius: 8px;
  padding: 25px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

h2 {
  margin-top: 0;
  color: #333;
  margin-bottom: 25px;
  font-size: 24px;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #555;
}

.form-control {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  transition: border-color 0.2s;
}

.form-control:focus {
  border-color: #4a90e2;
  outline: none;
  box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.2);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #eee;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.btn-primary {
  background-color: #4a90e2;
  color: white;
}

.btn-primary:hover {
  background-color: #3a7bc8;
}

.btn-primary:disabled {
  background-color: #a0c4f0;
  cursor: not-allowed;
}

.btn-secondary {
  background-color: #f0f0f0;
  color: #555;
}

.btn-secondary:hover {
  background-color: #e0e0e0;
}

.error-message {
  background-color: #ffebee;
  color: #d32f2f;
  padding: 12px 16px;
  border-radius: 4px;
  margin-bottom: 20px;
  font-size: 14px;
  border-left: 4px solid #d32f2f;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  z-index: 10;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #4a90e2;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
