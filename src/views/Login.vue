<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
        <div class="login-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
          </svg>
        </div>
        <h1>Bem-vindo de volta</h1>
        <p>Faça login para acessar sua conta</p>
      </div>

      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="username">Nome de Usuário</label>
          <div class="input-wrapper">
            <svg class="input-icon" viewBox="0 0 24 24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
            <input
              id="username"
              v-model="form.username"
              type="text"
              required
              placeholder="Digite seu usuário"
            />
          </div>
        </div>

        <div class="form-group">
          <div class="form-header">
            <label for="password">Senha</label>
            <router-link to="/esqueci-senha" class="forgot-password">Esqueceu a senha?</router-link>
          </div>
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

        <button type="submit" :disabled="loading" class="login-button">
          {{ loading ? 'Entrando...' : 'Entrar' }}
        </button>

        <div class="register-link">
          Não tem uma conta? 
          <router-link to="/register">Cadastre-se</router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

export default {
  name: 'Login',
  setup() {
    const authStore = useAuthStore()
    const router = useRouter()

    const loading = ref(false)
    const form = ref({
      username: '',
      password: ''
    })

    const handleLogin = async () => {
      if (loading.value) return

      try {
        loading.value = true

        // 🔐 Faz login
        await authStore.login(form.value)

        // ✅ Redireciona
        router.push('/')

        // 🔄 Recarrega a página inteira
        window.location.reload()

      } catch (error) {
        console.error('Login failed:', error)
        alert(error.message || 'Falha no login. Verifique suas credenciais.')
      } finally {
        loading.value = false
      }
    }

    return {
      form,
      loading,
      handleLogin
    }
  }
}
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
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%);
  padding: 20px;
}

/* Card de login */
.login-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
  width: 100%;
  max-width: 400px;
  padding: 40px;
  position: relative;
  overflow: hidden;
  animation: fadeIn 0.5s ease-out;
}

/* Cabeçalho do card */
.login-header {
  text-align: center;
  margin-bottom: 30px;
}

.login-icon {
  width: 70px;
  height: 70px;
  background: linear-gradient(135deg, #4f46e5, #7c3aed);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
}

.login-icon svg {
  width: 32px;
  height: 32px;
  color: white;
}

.login-header h1 {
  font-size: 24px;
  color: #1f2937;
  margin-bottom: 8px;
  font-weight: 600;
}

.login-header p {
  color: #6b7280;
  font-size: 14px;
}

/* Formulário */
.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  margin-bottom: 5px;
}

.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

label {
  display: block;
  font-size: 14px;
  color: #374151;
  font-weight: 500;
  margin-bottom: 6px;
}

.forgot-password {
  font-size: 13px;
  color: #4f46e5;
  text-decoration: none;
  transition: color 0.2s;
}

.forgot-password:hover {
  color: #4338ca;
  text-decoration: underline;
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

/* Botão de login */
.login-button {
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #4f46e5, #7c3aed);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 10px;
  transition: all 0.2s;
}

.login-button:hover {
  background: linear-gradient(135deg, #4338ca, #6d28d9);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(79, 70, 229, 0.2);
}

.login-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

/* Link de cadastro */
.register-link {
  text-align: center;
  margin-top: 20px;
  font-size: 14px;
  color: #6b7280;
}

.register-link a {
  color: #4f46e5;
  text-decoration: none;
  font-weight: 500;
  margin-left: 4px;
  transition: color 0.2s;
}

.register-link a:hover {
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
  .login-card {
    padding: 30px 20px;
  }
  
  .login-header h1 {
    font-size: 22px;
  }
  
  input, .login-button {
    padding: 12px 12px 12px 40px;
  }
}
</style>
