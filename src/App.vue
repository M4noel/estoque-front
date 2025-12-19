<template>
  <div class="app-container">
    <nav v-if="showNav && $route.name !== 'forgot-password'" class="main-nav">
      <div class="nav-content">
        <h1 class="logo">Estoque ML</h1>
        <div class="nav-links">
          <router-link to="/produtos" class="nav-link" active-class="active">
            <span class="icon">📦</span>
            <span class="text">Produtos</span>
          </router-link>
          <router-link to="/armazens" class="nav-link" active-class="active">
            <span class="icon">🏭</span>
            <span class="text">Armazéns</span>
          </router-link>
          <router-link to="/alertas" class="nav-link" active-class="active">
            <span class="icon">🔔</span>
            <span class="text">Alertas</span>
          </router-link>
          <router-link to="/vendas" class="nav-link" active-class="active">
            <span class="icon">💰</span>
            <span class="text">Vendas</span>
          </router-link>
          <div class="user-menu">
            <button 
              class="user-button" 
              @click="toggleUserMenu"
              :aria-expanded="showUserMenu"
            >
              <!-- <span class="icon">👤</span> -->
              <span class="text">{{ userInitials }}</span>
              <span class="dropdown-arrow">▼</span>
            </button>
            <div v-if="showUserMenu" class="dropdown-menu">
              <button class="dropdown-item" @click="navigateTo('/perfil')">
                <span class="icon">✏️</span>
                <span>Editar Perfil</span>
              </button>
              <button class="dropdown-item" @click="navigateTo('/alterar-senha')">
                <span class="icon">🔒</span>
                <span>Alterar Senha</span>
              </button>
              <div class="dropdown-divider"></div>
              <button class="dropdown-item logout" @click="handleLogout">
                <span class="icon">🚪</span>
                <span>Sair</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <main :class="['main-content', { 'auth-page': !showNav }]">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
  </div>
</template>

<script>
import { computed, ref, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

export default {
  setup() {
    const route = useRoute();
    const router = useRouter();
    const authStore = useAuthStore();
    const showUserMenu = ref(false);
    
    const userInitials = computed(() => {
      const user = authStore.user;
      if (!user || !user.name) return '👤';
      return user.name.split(' ').map(n => n[0]).join('').toUpperCase();
    });
    
    const handleLogout = () => {
      authStore.logout();
      router.push('/login');
    };
    
    const toggleUserMenu = () => {
      showUserMenu.value = !showUserMenu.value;
    };
    
    const navigateTo = (path) => {
      router.push(path);
      showUserMenu.value = false;
    };
    
    const showNav = computed(() => {
      // Hide nav for login and register pages
      return !['login', 'register'].includes(route.name);
    });
    
    // Close dropdown when clicking outside
    const handleClickOutside = (event) => {
      const userMenu = document.querySelector('.user-menu');
      if (userMenu && !userMenu.contains(event.target)) {
        showUserMenu.value = false;
      }
    };
    
    // Add click outside listener
    onMounted(() => {
      document.addEventListener('click', handleClickOutside);
    });
    
    // Cleanup event listener
    onUnmounted(() => {
      document.removeEventListener('click', handleClickOutside);
    });

    return {
      showNav,
      showUserMenu,
      userInitials,
      handleLogout,
      toggleUserMenu,
      navigateTo
    };
  }
};
</script>

<style>
:root {
  --primary-color: #3498db;
  --primary-hover: #2980b9;
  --danger-color: #e74c3c;
  --danger-hover: #c0392b;
  --success-color: #27ae60;
  --warning-color: #f39c12;
  --text-color: #2c3e50;
  --text-light: #7f8c8d;
  --border-color: #e0e0e0;
  --bg-light: #f8f9fa;
  --shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
  --radius-sm: 6px;
  --radius-md: 8px;
  --transition: all 0.3s ease;
  --dropdown-bg: #ffffff;
  --dropdown-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  --dropdown-hover: #f5f5f5;
  --dropdown-divider: #e9ecef;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  line-height: 1.6;
  color: var(--text-color);
  background-color: #f5f7fa;
  margin: 0;
  padding: 0;
}

.app-container {
  display: flex;
  min-height: 100vh;
  flex-direction: column;
}

.main-nav {
  background: white;
  box-shadow: var(--shadow-sm);
  position: sticky;
  top: 0;
  z-index: 100;
  border-bottom: 1px solid var(--border-color);
}

.nav-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 70px;
}

.logo {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary-color);
  margin: 0;
  display: flex;
  align-items: center;
  gap: 10px;
}

.nav-links {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.nav-link {
  display: flex;
  align-items: center;
  padding: 0 20px;
  color: var(--text-light);
  text-decoration: none;
  font-weight: 500;
  transition: var(--transition);
  border-bottom: 3px solid transparent;
  height: 100%;
}

.nav-link:hover {
  color: var(--primary-color);
  background-color: var(--bg-light);
}

.nav-link.active {
  color: var(--primary-color);
  border-bottom-color: var(--primary-color);
  font-weight: 600;
}

.nav-link .icon {
  margin-right: 8px;
  font-size: 1.1em;
}

.main-content {
  flex: 1;
  padding: 30px 20px;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
}

/* Transições */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Responsividade */
@media (max-width: 768px) {
  .nav-content {
    flex-direction: column;
    height: auto;
    padding: 15px;
  }
  
  .logo {
    margin-bottom: 15px;
  }
  
  .nav-links {
    width: 100%;
    justify-content: space-around;
  }
  
  .nav-link {
    padding: 10px;
    font-size: 0.9rem;
  }
  
  .nav-link .text {
    display: none;
  }
  
  .nav-link .icon {
    margin: 0;
    font-size: 1.3em;
  }
}

/* Estilos do menu de usuário */
.user-menu {
  position: relative;
  margin-left: 15px;
}

.user-button {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 20px;
  padding: 6px 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.user-button:hover {
  background: #e9ecef;
  border-color: #ced4da;
}

.user-button .icon {
  font-size: 18px;
}

.user-button .dropdown-arrow {
  font-size: 10px;
  margin-left: 4px;
  transition: transform 0.2s ease;
}

.user-button[aria-expanded="true"] .dropdown-arrow {
  transform: rotate(180deg);
}

/* Estilos do dropdown */
.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  width: 200px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  margin-top: 8px;
  z-index: 1000;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  padding: 8px 0;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 16px;
  background: none;
  border: none;
  text-align: left;
  width: 100%;
  font-size: 14px;
  color: #333;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.dropdown-item:hover {
  background-color: #f8f9fa;
}

.dropdown-item .icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  background-color: #f1f3f5;
  border-radius: 6px;
  font-size: 14px;
  color: #495057;
}

.dropdown-divider {
  height: 1px;
  background-color: #e9ecef;
  margin: 8px 0;
}

.dropdown-item.logout {
  color: #dc3545;
}

.dropdown-item.logout .icon {
  background-color: #fff5f5;
  color: #dc3545;
}

.dropdown-item.logout:hover {
  background-color: #fff5f5;
}
</style>
