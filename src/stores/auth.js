// frontend/src/stores/auth.js
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

export const useAuthStore = defineStore('auth', () => {
  const router = useRouter();
  const user = ref(JSON.parse(localStorage.getItem('user')));
  const token = ref(localStorage.getItem('token'));
  
  const isAuthenticated = computed(() => !!token.value);
  
  async function login(credentials) {
    try {
      const response = await axios.post('http://localhost:3000/api/auth/login', credentials);
      const { token: authToken, user: userData } = response.data;
      
      // Salva os dados no localStorage
      localStorage.setItem('token', authToken);
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Atualiza o estado
      token.value = authToken;
      user.value = userData;
      
      // Redireciona para a página inicial
      router.push({ name: 'products' });
    } catch (error) {
      console.error('Login error:', error);
      throw new Error(error.response?.data?.message || 'Falha no login');
    }
  }
  
  async function register(userData) {
    try {
      const response = await axios.post('http://localhost:3000/api/auth/register', userData);
      
      // Save user data to localStorage
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      // Update the store state
      token.value = token;
      user.value = user;
      
      // Redirect to home page
      router.push('/');
      
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      throw new Error(error.response?.data?.message || 'Falha no registro');
    }
  }
  
  function logout() {
    // Remove os dados do localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Limpa o estado
    token.value = null;
    user.value = null;
    
    // Redireciona para a página de login
    router.push({ name: 'login' });
  }
  
  return {
    user,
    token,
    isAuthenticated,
    login,
    register,
    logout
  };
});