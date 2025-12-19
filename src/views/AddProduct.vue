<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { api } from '../services/api'
import warehouseService from '../services/warehouseService'

const router = useRouter()

// formulário
const ml_item_id = ref('')
const name = ref('')
const sku = ref('')
const stock = ref(0)
const warehouseId = ref('')
const warehouses = ref([])
const isLoading = ref(false)
const error = ref('')

// Carrega a lista de armazéns
const loadWarehouses = async () => {
  try {
    warehouses.value = await warehouseService.getAllWarehouses()
    // Seleciona o primeiro armazém por padrão se existir
    if (warehouses.value.length > 0) {
      warehouseId.value = warehouses.value[0]._id
    }
  } catch (err) {
    error.value = 'Erro ao carregar a lista de armazéns'
    console.error('Erro ao carregar armazéns:', err)
  }
}

// Carrega os armazéns quando o componente for montado
onMounted(() => {
  loadWarehouses()
})

async function addProduct() {
  // Reset error message
  error.value = ''
  
  // Validate required fields
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
    console.log('Iniciando cadastro do produto...', {
      ml_item_id: ml_item_id.value,
      name: name.value,
      sku: sku.value,
      warehouseId: warehouseId.value,
      stock: stock.value
    })
    
    // Prepare product data
    const productData = {
      ml_item_id: ml_item_id.value,
      name: name.value,
      sku: sku.value || undefined, // Only include if provided
      inventory: []
    }
    
    console.log('Enviando dados do produto para a API:', productData)
    
    // First, create the product
    const productResponse = await api.post('/api/products', productData)
    console.log('Produto criado com sucesso:', productResponse.data)
    
    // Then, add stock to the selected warehouse if stock is greater than 0
    if (stock.value > 0 && warehouseId.value) {
      try {
        console.log('Adicionando estoque ao armazém:', {
          productId: productResponse.data._id,
          warehouseId: warehouseId.value,
          quantity: Number(stock.value)
        })
        
        await api.post(`/api/products/${productResponse.data._id}/inventory`, {
          warehouseId: warehouseId.value,
          quantity: Number(stock.value)
        })
        
        console.log('Estoque adicionado com sucesso')
      } catch (stockError) {
        console.error('Erro ao adicionar estoque:', stockError)
        // Continue even if stock update fails, as the product was created successfully
        error.value = 'Produto criado, mas houve um erro ao adicionar o estoque. Você pode adicionar o estoque manualmente mais tarde.'
      }
    }

    // Redirect to products list after successful creation
    router.push('/produtos')
  } catch (err) {
    console.error('Erro detalhado ao adicionar produto:', {
      message: err.message,
      response: err.response?.data,
      status: err.response?.status,
      config: {
        url: err.config?.url,
        method: err.config?.method,
        data: err.config?.data
      }
    })
    
    // Handle specific error cases
    if (err.response?.status === 400) {
      if (err.response.data?.message === 'Produto já existe') {
        error.value = `Erro: Já existe um produto com o ML Item ID "${ml_item_id.value}".`
      } else if (err.response.data?.message === 'Campos obrigatórios não fornecidos') {
        error.value = `Erro: ${err.response.data.message}. ${JSON.stringify(err.response.data.received)}`
      } else {
        error.value = `Erro de validação: ${JSON.stringify(err.response.data)}`
      }
    } else if (err.response?.data?.error) {
      error.value = `Erro do servidor: ${err.response.data.error}`
    } else if (err.message === 'Network Error') {
      error.value = 'Erro de conexão. Verifique sua internet e tente novamente.'
    } else {
      error.value = `Erro inesperado ao adicionar produto: ${err.message}`
    }
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="container">
    <div class="card">
      <h2>➕ Adicionar Novo Produto</h2>
      
      <div v-if="error" class="error-message">
        {{ error }}
      </div>
      
      <div class="form-group">
        <label for="ml_item_id">ML Item ID *</label>
        <input 
          id="ml_item_id"
          v-model="ml_item_id" 
          placeholder="Ex: MLB1234567890" 
          class="form-control"
          required
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
        />
      </div>
      
      <div class="form-group">
        <label for="sku">SKU (opcional)</label>
        <input 
          id="sku"
          v-model="sku" 
          placeholder="Código SKU" 
          class="form-control"
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
            {{ warehouse.name }} ({{ warehouse.location }})
          </option>
        </select>
        <small v-if="warehouses.length === 0" class="text-muted">
          Você precisa cadastrar pelo menos um armazém antes de adicionar produtos.
          <router-link to="/armazens" class="text-primary">Gerenciar Armazéns</router-link>
        </small>
      </div>
      
      <div class="button-group">
        <button 
          @click="addProduct" 
          :disabled="isLoading"
          class="btn btn-primary"
        >
          {{ isLoading ? 'Salvando...' : 'Salvar Produto' }}
        </button>
        
        <button 
          @click="router.push('/produtos')" 
          class="btn btn-secondary"
        >
          Voltar para a Lista
        </button>
      </div>
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
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 25px;
}

h2 {
  color: #2c3e50;
  margin-bottom: 25px;
  font-size: 1.8rem;
  text-align: center;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #2c3e50;
}

.form-control {
  width: 100%;
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.form-control:focus {
  border-color: #3498db;
  outline: none;
  box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
}

.button-group {
  display: flex;
  gap: 15px;
  margin-top: 30px;
  justify-content: center;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 1rem;
}

.btn-primary {
  background-color: #3498db;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background-color: #2980b9;
}

.btn-primary:disabled {
  background-color: #bdc3c7;
  cursor: not-allowed;
}

select.form-control {
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='%23333' viewBox='0 0 16 16'%3E%3Cpath d='M7.247 11.14L2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 10px center;
  background-size: 16px 12px;
  padding-right: 35px;
}

.btn-secondary {
  background-color: #e74c3c;
  color: white;
}

.btn-secondary:hover {
  background-color: #c0392b;
}

.error-message {
  background-color: #fde8e8;
  color: #c0392b;
  padding: 12px;
  border-radius: 4px;
  margin-bottom: 20px;
  border-left: 4px solid #e74c3c;
  font-size: 0.95rem;
}

@media (max-width: 768px) {
  .button-group {
    flex-direction: column;
  }
  
  .btn {
    width: 100%;
  }
}
</style>
