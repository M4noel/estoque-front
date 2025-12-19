<template>
  <div class="max-w-2xl mx-auto p-6">
    <h1 class="text-2xl font-bold mb-6">Meu Perfil</h1>
    
    <div class="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 class="text-xl font-semibold mb-4">Informações do Usuário</h2>
      
      <form @submit.prevent="updateProfile" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Nome</label>
          <input
            v-model="profileForm.name"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Nome de Usuário</label>
          <input
            v-model="profileForm.username"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
          <input
            v-model="profileForm.email"
            type="email"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
        </div>

        <div class="pt-4">
          <button
            type="submit"
            :disabled="loading"
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {{ loading ? 'Salvando...' : 'Salvar Alterações' }}
          </button>
        </div>
      </form>
    </div>

    <div class="bg-white rounded-lg shadow-md p-6">
      <h2 class="text-xl font-semibold mb-4">Alterar Senha</h2>
      
      <form @submit.prevent="updatePassword" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Senha Atual</label>
          <input
            v-model="passwordForm.currentPassword"
            type="password"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Nova Senha</label>
          <input
            v-model="passwordForm.newPassword"
            type="password"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            minlength="6"
          >
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Confirmar Nova Senha</label>
          <input
            v-model="passwordForm.confirmPassword"
            type="password"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            :class="{ 'border-red-500': passwordForm.newPassword && passwordForm.newPassword !== passwordForm.confirmPassword }"
          >
          <p v-if="passwordForm.newPassword && passwordForm.newPassword !== passwordForm.confirmPassword" class="text-red-500 text-sm mt-1">
            As senhas não coincidem
          </p>
        </div>

        <div class="pt-2">
          <button
            type="submit"
            :disabled="loading || passwordForm.newPassword !== passwordForm.confirmPassword"
            class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {{ loading ? 'Salvando...' : 'Alterar Senha' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import axios from 'axios';

export default {
  setup() {
    const authStore = useAuthStore();
    const loading = ref(false);
    const successMessage = ref('');
    const errorMessage = ref('');

    const profileForm = ref({
      name: '',
      username: '',
      email: ''
    });

    const passwordForm = ref({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });

    // Load user data when component mounts
    onMounted(() => {
      if (authStore.user) {
        profileForm.value = {
          name: authStore.user.name || '',
          username: authStore.user.username || '',
          email: authStore.user.email || ''
        };
      }
    });

    const updateProfile = async () => {
      if (loading.value) return;
      
      try {
        loading.value = true;
        errorMessage.value = '';
        
        const response = await axios.put('/api/auth/profile', profileForm.value, {
          headers: {
            'Authorization': `Bearer ${authStore.token}`
          }
        });
        
        // Update user data in the store
        authStore.user = { ...authStore.user, ...response.data.user };
        successMessage.value = 'Perfil atualizado com sucesso!';
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          successMessage.value = '';
        }, 3000);
        
      } catch (error) {
        console.error('Error updating profile:', error);
        errorMessage.value = error.response?.data?.message || 'Erro ao atualizar perfil';
      } finally {
        loading.value = false;
      }
    };

    const updatePassword = async () => {
      if (loading.value || passwordForm.value.newPassword !== passwordForm.value.confirmPassword) return;
      
      try {
        loading.value = true;
        errorMessage.value = '';
        
        await axios.put('/api/auth/password', {
          currentPassword: passwordForm.value.currentPassword,
          newPassword: passwordForm.value.newPassword
        }, {
          headers: {
            'Authorization': `Bearer ${authStore.token}`
          }
        });
        
        // Clear password form
        passwordForm.value = {
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        };
        
        successMessage.value = 'Senha alterada com sucesso!';
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          successMessage.value = '';
        }, 3000);
        
      } catch (error) {
        console.error('Error updating password:', error);
        errorMessage.value = error.response?.data?.message || 'Erro ao alterar senha';
      } finally {
        loading.value = false;
      }
    };

    return {
      profileForm,
      passwordForm,
      loading,
      successMessage,
      errorMessage,
      updateProfile,
      updatePassword
    };
  }
};
</script>
