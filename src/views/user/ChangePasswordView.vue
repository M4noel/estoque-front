<template>
  <div class="password-container">
    <div class="password-card">
      <h1 class="password-title">Alterar Senha</h1>
      
      <form @submit.prevent="handleSubmit" class="password-form">
        <div class="form-group">
          <label for="currentPassword" class="form-label">Senha Atual</label>
          <div class="input-with-icon">
            <input
              id="currentPassword"
              v-model="form.currentPassword"
              :type="showCurrentPassword ? 'text' : 'password'"
              class="form-input"
              required
            />
            <button 
              type="button" 
              class="password-toggle"
              @click="togglePasswordVisibility('currentPassword')"
              :aria-label="showCurrentPassword ? 'Ocultar senha' : 'Mostrar senha'"
            >
              {{ showCurrentPassword ? '🙈' : '👁️' }}
            </button>
          </div>
        </div>

        <div class="form-group">
          <label for="newPassword" class="form-label">Nova Senha</label>
          <div class="input-with-icon">
            <input
              id="newPassword"
              v-model="form.newPassword"
              :type="showNewPassword ? 'text' : 'password'"
              class="form-input"
              required
              minlength="8"
            />
            <button 
              type="button" 
              class="password-toggle"
              @click="togglePasswordVisibility('newPassword')"
              :aria-label="showNewPassword ? 'Ocultar senha' : 'Mostrar senha'"
            >
              {{ showNewPassword ? '🙈' : '👁️' }}
            </button>
          </div>
          <div class="password-strength">
            <div 
              class="strength-bar"
              :class="getPasswordStrengthClass"
            ></div>
            <span class="strength-text">{{ passwordStrengthText }}</span>
          </div>
        </div>

        <div class="form-group">
          <label for="confirmPassword" class="form-label">Confirmar Nova Senha</label>
          <div class="input-with-icon">
            <input
              id="confirmPassword"
              v-model="form.confirmPassword"
              :type="showConfirmPassword ? 'text' : 'password'"
              class="form-input"
              required
              minlength="8"
            />
            <button 
              type="button" 
              class="password-toggle"
              @click="togglePasswordVisibility('confirmPassword')"
              :aria-label="showConfirmPassword ? 'Ocultar senha' : 'Mostrar senha'"
            >
              {{ showConfirmPassword ? '🙈' : '👁️' }}
            </button>
          </div>
          <div v-if="!passwordsMatch && form.confirmPassword" class="error-message">
            As senhas não coincidem
          </div>
        </div>

        <div class="form-actions">
          <button 
            type="submit" 
            class="btn btn-primary" 
            :disabled="loading || !isFormValid"
          >
            <span v-if="loading">
              <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Alterando...
            </span>
            <span v-else>Alterar Senha</span>
          </button>
          
          <router-link to="/perfil" class="btn btn-secondary">
            Voltar para o Perfil
          </router-link>
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
  name: 'ChangePasswordView',
  setup() {
    const router = useRouter();
    const authStore = useAuthStore();
    const loading = ref(false);
    
    const form = ref({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });

    const showCurrentPassword = ref(false);
    const showNewPassword = ref(false);
    const showConfirmPassword = ref(false);

    const togglePasswordVisibility = (field) => {
      if (field === 'currentPassword') {
        showCurrentPassword.value = !showCurrentPassword.value;
      } else if (field === 'newPassword') {
        showNewPassword.value = !showNewPassword.value;
      } else if (field === 'confirmPassword') {
        showConfirmPassword.value = !showConfirmPassword.value;
      }
    };

    const passwordsMatch = computed(() => {
      return form.value.newPassword === form.value.confirmPassword;
    });

    const passwordStrength = computed(() => {
      const password = form.value.newPassword;
      if (!password) return 0;
      
      let strength = 0;
      
      // Length check
      if (password.length >= 8) strength += 1;
      
      // Contains lowercase
      if (/[a-z]/.test(password)) strength += 1;
      
      // Contains uppercase
      if (/[A-Z]/.test(password)) strength += 1;
      
      // Contains number
      if (/\d/.test(password)) strength += 1;
      
      // Contains special char
      if (/[^A-Za-z0-9]/.test(password)) strength += 1;
      
      return Math.min(strength, 5); // Cap at 5
    });

    const passwordStrengthText = computed(() => {
      const strength = passwordStrength.value;
      if (strength <= 1) return 'Muito fraca';
      if (strength <= 2) return 'Fraca';
      if (strength <= 3) return 'Média';
      if (strength <= 4) return 'Forte';
      return 'Muito forte';
    });

    const getPasswordStrengthClass = computed(() => {
      const strength = passwordStrength.value;
      if (strength <= 1) return 'strength-weak';
      if (strength <= 2) return 'strength-fair';
      if (strength <= 3) return 'strength-moderate';
      if (strength <= 4) return 'strength-strong';
      return 'strength-very-strong';
    });

    const isFormValid = computed(() => {
      return (
        form.value.currentPassword &&
        form.value.newPassword &&
        form.value.newPassword.length >= 8 &&
        passwordsMatch.value
      );
    });

    const handleSubmit = async () => {
      if (loading.value || !isFormValid.value) return;
      
      try {
        loading.value = true;
        
        // Here you would typically make an API call to change the password
        // await authStore.changePassword({
        //   currentPassword: form.value.currentPassword,
        //   newPassword: form.value.newPassword
        // });
        
        // For now, we'll just simulate a successful password change
        alert('Senha alterada com sucesso!');
        
        // Clear the form
        form.value = {
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        };
        
        // Optionally redirect to profile
        router.push('/perfil');
      } catch (error) {
        console.error('Error changing password:', error);
        alert(error.message || 'Erro ao alterar a senha. Verifique os dados e tente novamente.');
      } finally {
        loading.value = false;
      }
    };

    return {
      form,
      loading,
      showCurrentPassword,
      showNewPassword,
      showConfirmPassword,
      passwordsMatch,
      passwordStrengthText,
      getPasswordStrengthClass,
      isFormValid,
      togglePasswordVisibility,
      handleSubmit
    };
  }
};
</script>

<style scoped>
.password-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
}

.password-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 2rem;
}

.password-title {
  font-size: 1.75rem;
  color: #2d3748;
  margin-bottom: 2rem;
  text-align: center;
}

.password-form {
  max-width: 500px;
  margin: 0 auto;
}

.form-group {
  margin-bottom: 1.5rem;
  position: relative;
}

.form-label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #4a5568;
}

.input-with-icon {
  position: relative;
  display: flex;
  align-items: center;
}

.form-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s ease;
  padding-right: 3rem; /* Space for the toggle button */
}

.form-input:focus {
  outline: none;
  border-color: #4299e1;
  box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.2);
}

.password-toggle {
  position: absolute;
  right: 0.75rem;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.25rem;
  padding: 0.25rem;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.password-toggle:hover {
  background-color: #f7fafc;
}

.password-strength {
  margin-top: 0.5rem;
}

.strength-bar {
  height: 4px;
  border-radius: 2px;
  margin-bottom: 0.25rem;
  transition: width 0.3s ease, background-color 0.3s ease;
  width: 0%;
}

.strength-weak {
  width: 20%;
  background-color: #e53e3e;
}

.strength-fair {
  width: 40%;
  background-color: #ed8936;
}

.strength-moderate {
  width: 60%;
  background-color: #ecc94b;
}

.strength-strong {
  width: 80%;
  background-color: #48bb78;
}

.strength-very-strong {
  width: 100%;
  background-color: #38a169;
}

.strength-text {
  font-size: 0.75rem;
  color: #718096;
  display: block;
  text-align: right;
  margin-top: 0.25rem;
}

.error-message {
  color: #e53e3e;
  font-size: 0.875rem;
  margin-top: 0.25rem;
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
  flex: 1;
}

.btn-primary {
  background-color: #4299e1;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background-color: #3182ce;
}

.btn-primary:disabled {
  background-color: #a0aec0;
  cursor: not-allowed;
  opacity: 0.7;
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
