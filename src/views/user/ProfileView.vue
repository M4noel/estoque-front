<template>
  <div class="profile-container">
    <div class="profile-card">
      <h1 class="profile-title">Meu Perfil</h1>
      
      <form @submit.prevent="handleSubmit" class="profile-form">
        <div class="form-group">
          <label for="name" class="form-label">Nome Completo</label>
          <input
            id="name"
            v-model="form.name"
            type="text"
            class="form-input"
            required
          />
        </div>

        <div class="form-group">
          <label for="email" class="form-label">E-mail</label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            class="form-input"
            required
          />
        </div>

        <div class="form-group">
          <label for="username" class="form-label">Nome de Usuário</label>
          <input
            id="username"
            v-model="form.username"
            type="text"
            class="form-input"
            required
          />
        </div>

        <div class="form-actions">
          <button type="submit" class="btn btn-primary" :disabled="loading">
            <span v-if="loading">
              <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Salvando...
            </span>
            <span v-else>Salvar Alterações</span>
          </button>
          
          <router-link to="/alterar-senha" class="btn btn-secondary">
            Alterar Senha
          </router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';

export default {
  name: 'ProfileView',
  setup() {
    const authStore = useAuthStore();
    const loading = ref(false);
    
    const form = ref({
      name: '',
      email: '',
      username: ''
    });

    // Load user data when component mounts
    onMounted(() => {
      if (authStore.user) {
        form.value = {
          name: authStore.user.name || '',
          email: authStore.user.email || '',
          username: authStore.user.username || ''
        };
      }
    });

    const handleSubmit = async () => {
      if (loading.value) return;
      
      try {
        loading.value = true;
        // Here you would typically make an API call to update the user's profile
        // await authStore.updateProfile(form.value);
        
        // For now, we'll just update the local user data
        if (authStore.user) {
          authStore.user = { ...authStore.user, ...form.value };
        }
        
        // Show success message
        alert('Perfil atualizado com sucesso!');
      } catch (error) {
        console.error('Error updating profile:', error);
        alert(error.message || 'Erro ao atualizar o perfil. Tente novamente.');
      } finally {
        loading.value = false;
      }
    };

    return {
      form,
      loading,
      handleSubmit
    };
  }
};
</script>

<style scoped>
.profile-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.profile-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 2rem;
}

.profile-title {
  font-size: 1.75rem;
  color: #2d3748;
  margin-bottom: 2rem;
  text-align: center;
}

.profile-form {
  max-width: 500px;
  margin: 0 auto;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #4a5568;
}

.form-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s ease;
}

.form-input:focus {
  outline: none;
  border-color: #4299e1;
  box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.2);
}

.form-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
  gap: 1rem;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  text-decoration: none;
}

.btn-primary {
  background-color: #4299e1;
  color: white;
}

.btn-primary:hover {
  background-color: #3182ce;
}

.btn-primary:disabled {
  background-color: #a0aec0;
  cursor: not-allowed;
}

.btn-secondary {
  background-color: #e2e8f0;
  color: #4a5568;
}

.btn-secondary:hover {
  background-color: #cbd5e0;
}

@media (max-width: 640px) {
  .form-actions {
    flex-direction: column;
  }
  
  .btn {
    width: 100%;
  }
}
</style>
