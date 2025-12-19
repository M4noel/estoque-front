<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
        <div class="login-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h1>Recuperação de Senha</h1>
        <p>Jão não tem como alterar a senha zé pagão</p>
      </div>

      <div class="text-center mt-6">
        <router-link to="/login" class="back-to-login">
          Voltar para o login
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ForgotPassword',
}
</script>

<style scoped>
/* Reutiliza os estilos do Login.vue */
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%);
  padding: 20px;
}

.login-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
  width: 100%;
  max-width: 400px;
  padding: 40px;
  text-align: center;
}

.login-header {
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

h1 {
  font-size: 24px;
  color: #1f2937;
  margin-bottom: 8px;
  font-weight: 600;
}

p {
  color: #6b7280;
  font-size: 16px;
  line-height: 1.5;
}

.back-to-login {
  display: inline-block;
  margin-top: 20px;
  color: #4f46e5;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
}

.back-to-login:hover {
  color: #4338ca;
  text-decoration: underline;
}
.nav-content{
    display: none;
} 

/* Responsividade */
@media (max-width: 480px) {
  .login-card {
    padding: 30px 20px;
  }
  
  h1 {
    font-size: 22px;
  }
}
</style>
