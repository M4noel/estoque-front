<template>
  <div class="warehouses-container">
    <div class="page-header">
      <h1>Gerenciar Armazéns</h1>
      <button class="btn btn-primary" @click="openCreateModal">
        <span class="icon">+</span> Novo Armazém
      </button>
    </div>

    <div v-if="isLoading" class="loading">Carregando armazéns...</div>
    
    <div v-else-if="warehouses.length === 0" class="empty-state">
      <p>Nenhum armazém cadastrado. Clique em "Novo Armazém" para começar.</p>
    </div>

    <div v-else class="warehouses-grid">
      <div v-for="warehouse in warehouses" :key="warehouse._id" class="warehouse-card">
        <div class="warehouse-header">
          <h3>{{ warehouse.name }}</h3>
          <span :class="['status-badge', warehouse.isActive ? 'active' : 'inactive']">
            {{ warehouse.isActive ? 'Ativo' : 'Inativo' }}
          </span>
        </div>
        <p class="location">📍 {{ warehouse.location || 'Localização não informada' }}</p>
        <div class="warehouse-actions">
          <button class="btn btn-sm btn-edit" @click="editWarehouse(warehouse)" title="Editar">
            <span class="icon">✏️</span> Editar
          </button>
          <button 
            class="btn btn-sm" 
            :class="warehouse.isActive ? 'btn-danger' : 'btn-success'"
            @click="confirmToggleStatus(warehouse)"
            :title="warehouse.isActive ? 'Desativar armazém' : 'Ativar armazém'"
          >
            {{ warehouse.isActive ? 'Desativar' : 'Ativar' }}
          </button>
          <button 
            class="btn btn-sm btn-danger" 
            @click="confirmDelete(warehouse)"
            title="Excluir"
            :disabled="isDeleting"
          >
            <span v-if="isDeleting">Excluindo...</span>
            <span v-else>🗑️ Excluir</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <div v-if="showCreateModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <h2>{{ editingWarehouse ? 'Editar Armazém' : 'Novo Armazém' }}</h2>
        <form @submit.prevent="saveWarehouse">
          <div class="form-group">
            <label for="name">Nome do Armazém *</label>
            <input 
              type="text" 
              id="name" 
              v-model="warehouseForm.name" 
              required 
              placeholder="Ex: Armazém Principal"
              :disabled="isSaving"
            >
          </div>
          <div class="form-group">
            <label for="location">Localização *</label>
            <input 
              type="text" 
              id="location" 
              v-model="warehouseForm.location" 
              required
              placeholder="Ex: São Paulo - SP"
              :disabled="isSaving"
            >
          </div>
          <div class="form-actions">
            <button 
              type="button" 
              class="btn btn-outline" 
              @click="closeModal"
              :disabled="isSaving"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              class="btn btn-primary"
              :disabled="isSaving"
            >
              <span v-if="isSaving">Salvando...</span>
              <span v-else>{{ editingWarehouse ? 'Atualizar' : 'Salvar' }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
    
    <!-- Confirmation Modal -->
    <div v-if="showConfirmModal" class="modal-overlay">
      <div class="modal-content">
        <h3>{{ confirmTitle }}</h3>
        <p>{{ confirmMessage }}</p>
        <div class="form-actions">
          <button 
            class="btn btn-outline" 
            @click="showConfirmModal = false"
            :disabled="isProcessing"
          >
            Cancelar
          </button>
          <button 
            class="btn" 
            :class="confirmButtonClass"
            @click="confirmAction"
            :disabled="isProcessing"
          >
            <span v-if="isProcessing">Processando...</span>
            <span v-else>{{ confirmButtonText }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useToast } from 'vue-toastification';
import warehouseService from '../services/warehouseService';

export default {
  name: 'WarehousesView',
  setup() {
    const toast = useToast();
    const warehouses = ref([]);
    const showCreateModal = ref(false);
    const showConfirmModal = ref(false);
    const isSaving = ref(false);
    const isDeleting = ref(false);
    const isLoading = ref(true);
    const isProcessing = ref(false);
    const currentAction = ref(null);
    const currentWarehouse = ref(null);
    
    const editingWarehouse = ref(null);
    const warehouseForm = ref({
      name: '',
      location: ''
    });
    
    const confirmTitle = ref('');
    const confirmMessage = ref('');
    const confirmButtonText = ref('');
    const confirmButtonClass = ref('btn-danger');

    const fetchWarehouses = async () => {
      try {
        isLoading.value = true;
        const response = await warehouseService.getAllWarehouses();
        warehouses.value = response;
      } catch (error) {
        console.error('Erro ao carregar armazéns:', error);
        toast.error('Erro ao carregar a lista de armazéns');
      } finally {
        isLoading.value = false;
      }
    };

    const saveWarehouse = async () => {
      if (isSaving.value) return;
      
      isSaving.value = true;
      try {
        if (editingWarehouse.value) {
          await warehouseService.updateWarehouse(editingWarehouse.value._id, warehouseForm.value);
          toast.success('Armazém atualizado com sucesso!');
        } else {
          await warehouseService.createWarehouse(warehouseForm.value);
          toast.success('Armazém criado com sucesso!');
        }
        closeModal();
        await fetchWarehouses();
      } catch (error) {
        console.error('Erro ao salvar armazém:', error);
        const errorMessage = error.response?.data?.message || error.message;
        toast.error(`Erro ao ${editingWarehouse.value ? 'atualizar' : 'criar'} armazém: ${errorMessage}`);
      } finally {
        isSaving.value = false;
      }
    };

    const openCreateModal = () => {
      editingWarehouse.value = null;
      warehouseForm.value = { name: '', location: '' };
      showCreateModal.value = true;
    };

    const editWarehouse = (warehouse) => {
      editingWarehouse.value = { ...warehouse };
      warehouseForm.value = {
        name: warehouse.name,
        location: warehouse.location || ''
      };
      showCreateModal.value = true;
    };

    const confirmToggleStatus = (warehouse) => {
      currentWarehouse.value = warehouse;
      currentAction.value = 'toggleStatus';
      confirmTitle.value = warehouse.isActive ? 'Desativar Armazém' : 'Ativar Armazém';
      confirmMessage.value = `Tem certeza que deseja ${warehouse.isActive ? 'desativar' : 'ativar'} o armazém ${warehouse.name}?`;
      confirmButtonText.value = warehouse.isActive ? 'Desativar' : 'Ativar';
      confirmButtonClass.value = warehouse.isActive ? 'btn-danger' : 'btn-success';
      showConfirmModal.value = true;
    };

    const confirmDelete = (warehouse) => {
      currentWarehouse.value = warehouse;
      currentAction.value = 'delete';
      confirmTitle.value = 'Excluir Armazém';
      confirmMessage.value = `Tem certeza que deseja excluir o armazém ${warehouse.name}? Esta ação não pode ser desfeita.`;
      confirmButtonText.value = 'Excluir';
      confirmButtonClass.value = 'btn-danger';
      showConfirmModal.value = true;
    };

    const executeAction = async () => {
      if (!currentWarehouse.value) return;
      
      isProcessing.value = true;
      try {
        switch (currentAction.value) {
          case 'toggleStatus':
            await toggleWarehouseStatus(currentWarehouse.value);
            break;
          case 'delete':
            await deleteWarehouse(currentWarehouse.value._id);
            break;
        }
      } catch (error) {
        console.error('Erro ao executar ação:', error);
        toast.error(`Erro ao processar a ação: ${error.message}`);
      } finally {
        isProcessing.value = false;
        showConfirmModal.value = false;
        currentWarehouse.value = null;
        currentAction.value = null;
      }
    };

    const toggleWarehouseStatus = async (warehouse) => {
      try {
        await warehouseService.updateWarehouse(warehouse._id, {
          isActive: !warehouse.isActive
        });
        toast.success(`Armazém ${!warehouse.isActive ? 'ativado' : 'desativado'} com sucesso!`);
        await fetchWarehouses();
      } catch (error) {
        console.error('Erro ao atualizar status do armazém:', error);
        throw error;
      }
    };

    const deleteWarehouse = async (warehouseId) => {
      isDeleting.value = true;
      try {
        await warehouseService.deleteWarehouse(warehouseId);
        toast.success('Armazém excluído com sucesso!');
        await fetchWarehouses();
      } catch (error) {
        console.error('Erro ao excluir armazém:', error);
        throw error;
      } finally {
        isDeleting.value = false;
      }
    };

    const closeModal = () => {
      showCreateModal.value = false;
      editingWarehouse.value = null;
      warehouseForm.value = { name: '', location: '' };
    };

    const confirmAction = () => {
      executeAction();
    };

    onMounted(() => {
      fetchWarehouses();
    });

    return {
      warehouses,
      showCreateModal,
      showConfirmModal,
      editingWarehouse,
      warehouseForm,
      isSaving,
      isDeleting,
      isLoading,
      isProcessing,
      confirmTitle,
      confirmMessage,
      confirmButtonText,
      confirmButtonClass,
      saveWarehouse,
      editWarehouse,
      openCreateModal,
      confirmToggleStatus,
      toggleWarehouseStatus,
      deleteWarehouse,
      confirmDelete,
      closeModal,
      confirmAction
    };
  }
};
</script>

<style scoped>
.warehouses-container {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.warehouses-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.warehouse-card {
  background: white;
  border-radius: var(--radius-md);
  padding: 20px;
  box-shadow: var(--shadow-sm);
  transition: var(--transition);
  border: 1px solid var(--border-color);
}

.warehouse-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.warehouse-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.warehouse-header h3 {
  margin: 0;
  color: var(--text-color);
}

.status-badge {
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 12px;
  font-weight: 500;
}

.status-badge.active {
  background-color: #e3f7ee;
  color: #10b981;
}

.status-badge.inactive {
  background-color: #fee2e2;
  color: #ef4444;
}

.location {
  color: var(--text-light);
  margin: 8px 0 16px;
  font-size: 14px;
}

.warehouse-actions {
  display: flex;
  gap: 8px;
  margin-top: 16px;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 24px;
  border-radius: var(--radius-md);
  width: 100%;
  max-width: 500px;
  box-shadow: var(--shadow-md);
}

.modal-content h2 {
  margin-top: 0;
  margin-bottom: 20px;
  color: var(--text-color);
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: var(--text-color);
}

.form-group input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  font-size: 14px;
  transition: border-color 0.2s;
}

.form-group input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 8px 16px;
  border-radius: var(--radius-sm);
  font-weight: 500;
  font-size: 14px;
  cursor: pointer;
  transition: var(--transition);
  border: 1px solid transparent;
}

.btn-sm {
  padding: 6px 12px;
  font-size: 13px;
}

.btn-primary {
  background-color: var(--primary-color);
  color: white;
  border: none;
}

.btn-primary:hover {
  background-color: var(--primary-hover);
}

.btn-outline {
  background: white;
  border: 1px solid var(--border-color);
  color: var(--text-color);
}

.btn-outline:hover {
  background-color: #f8f9fa;
}

.btn-danger {
  background-color: var(--danger-color);
  color: white;
  border: none;
}

.btn-danger:hover {
  background-color: var(--danger-hover);
}

.btn-success {
  background-color: var(--success-color);
  color: white;
  border: none;
}

.btn-success:hover {
  background-color: #219653;
}

.btn-edit {
  background-color: #f39c12;
  color: white;
  border: none;
}

.btn-edit:hover {
  background-color: #d68910;
}

.icon {
  margin-right: 6px;
  display: inline-flex;
  align-items: center;
}
</style>
