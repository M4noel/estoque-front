<template>
  <div class="register-container">
    <div class="register-card">
      <div class="register-header">
        <div class="register-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <h1>Criar uma conta</h1>
        <p>Preencha os campos abaixo para se cadastrar</p>
      </div>

      <form @submit.prevent="handleRegister" class="register-form">
        <div class="form-group">
          <label for="name">Nome Completo</label>
          <div class="input-wrapper">
            <svg class="input-icon" viewBox="0 0 24 24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
            <input
              id="name"
              v-model="form.name"
              type="text"
              required
              placeholder="Digite seu nome completo"
            />
          </div>
        </div>

        <div class="form-group">
          <label for="username">Nome de Usuário</label>
          <div class="input-wrapper">
            <svg class="input-icon" viewBox="0 0 24 24">
              <path d="M12 4a4 4 0 014 4 4 4 0 01-4 4 4 4 0 01-4-4 4 4 0 014-4m0 10c4.42 0 8 1.79 8 4v2H4v-2c0-2.21 3.58-4 8-4z"/>
            </svg>
            <input
              id="username"
              v-model="form.username"
              type="text"
              required
              placeholder="Escolha um nome de usuário"
            />
          </div>
        </div>

        <div class="form-group">
          <label for="email">E-mail</label>
          <div class="input-wrapper">
            <svg class="input-icon" viewBox="0 0 24 24">
              <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
            </svg>
            <input
              id="email"
              v-model="form.email"
              type="email"
              required
              placeholder="seu@email.com"
            />
          </div>
        </div>

        <div class="form-group">
          <label for="password">Senha</label>
          <div class="input-wrapper">
            <svg class="input-icon" viewBox="0 0 24 24">
              <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
            </svg>
            <input
              id="password"
              v-model="form.password"
              type="password"
              required
              placeholder="••••••••"
            />
          </div>
        </div>

        <div class="form-group">
          <label for="confirmPassword">Confirmar Senha</label>
          <div class="input-wrapper">
            <svg class="input-icon" viewBox="0 0 24 24">
              <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
            </svg>
            <input
              id="confirmPassword"
              v-model="form.confirmPassword"
              type="password"
              required
              placeholder="Confirme sua senha"
            />
          </div>
          <div v-if="!passwordsMatch && form.confirmPassword" class="error-message">
            As senhas não conferem
          </div>
        </div>

        <button type="submit" :disabled="loading || !passwordsMatch" class="register-button">
          {{ loading ? 'Criando conta...' : 'Criar conta' }}
        </button>

        <div class="login-link">
          Já tem uma conta? 
          <router-link to="/login">Faça login</router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

export default {
  setup() {
    const authStore = useAuthStore();
    const router = useRouter();
    const loading = ref(false);
    const form = ref({
      name: '',
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
    });

    const passwordsMatch = computed(() => {
      return form.value.password === form.value.confirmPassword;
    });

    const handleRegister = async () => {
      if (loading.value || !passwordsMatch.value) return;
      
      try {
        loading.value = true;
        const userData = {
          name: form.value.name,
          username: form.value.username,
          email: form.value.email,
          password: form.value.password
        };
        
        await authStore.register(userData);
        
        // Clear the form
        form.value = {
          name: '',
          username: '',
          email: '',
          password: '',
          confirmPassword: ''
        };
        
        // Show success message
        alert('Cadastro realizado com sucesso!');
        
      } catch (error) {
        console.error('Registration failed:', error);
        alert(error.message || 'Falha no cadastro. Por favor, tente novamente.');
      } finally {
        loading.value = false;
      }
    };

    return {
      form,
      loading,
      passwordsMatch,
      handleRegister
    };
  }
};
</script>

<style scoped>
/* Estilos base */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

/* Container principal */
.register-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%);
  padding: 20px;
}

/* Card de registro */
.register-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
  width: 100%;
  max-width: 450px;
  padding: 40px;
  position: relative;
  overflow: hidden;
  animation: fadeIn 0.5s ease-out;
}

/* Cabeçalho do card */
.register-header {
  text-align: center;
  margin-bottom: 30px;
}

.register-icon {
  width: 70px;
  height: 70px;
  background: linear-gradient(135deg, #4f46e5, #7c3aed);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
}

.register-icon svg {
  width: 32px;
  height: 32px;
  color: white;
}

.register-header h1 {
  font-size: 24px;
  color: #1f2937;
  margin-bottom: 8px;
  font-weight: 600;
}

.register-header p {
  color: #6b7280;
  font-size: 14px;
}

/* Formulário */
.register-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  margin-bottom: 5px;
}

label {
  display: block;
  font-size: 14px;
  color: #374151;
  font-weight: 500;
  margin-bottom: 8px;
}

.input-wrapper {
  position: relative;
}

.input-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  color: #9ca3af;
}

input {
  width: 100%;
  padding: 12px 12px 12px 40px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.2s;
}

input:focus {
  outline: none;
  border-color: #4f46e5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

.error-message {
  color: #dc2626;
  font-size: 12px;
  margin-top: 4px;
  height: 16px;
}

/* Botão de registro */
.register-button {
  width: 100%;
  padding: 14px;
  background: #4f46e5;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 10px;
  transition: all 0.2s;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
}

.register-button:hover:not(:disabled) {
  background-color: #4338ca;
  transform: translateY(-1px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.register-button:active:not(:disabled) {
  transform: translateY(0);
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

.register-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

/* Link de login */
.login-link {
  text-align: center;
  margin-top: 20px;
  font-size: 14px;
  color: #6b7280;
}

.login-link a {
  color: #4f46e5;
  text-decoration: none;
  font-weight: 500;
  margin-left: 4px;
  transition: color 0.2s;
}

.login-link a:hover {
  color: #4338ca;
  text-decoration: underline;
}

/* Animações */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(15px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsividade */
@media (max-width: 480px) {
  .register-card {
    padding: 30px 20px;
  }
  
  .register-header h1 {
    font-size: 22px;
  }
  
  input, .register-button {
    padding: 12px 12px 12px 40px;
  }
}
</style>