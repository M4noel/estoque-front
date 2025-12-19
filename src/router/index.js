import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

import Products from '../views/Products.vue';
import AddProduct from '../views/AddProduct.vue';
import EditProduct from '../views/EditProduct.vue';
import Alerts from '../views/Alerts.vue';
import Sales from '../views/Sales.vue';
import WarehousesView from '../views/WarehousesView.vue';
import Login from '../views/Login.vue';
import Register from '../views/Register.vue';
import ProfileView from '../views/user/ProfileView.vue';
import ChangePasswordView from '../views/user/ChangePasswordView.vue';
import ForgotPassword from '../views/ForgotPassword.vue';

const routes = [
  { 
    path: '/', 
    redirect: '/produtos' // Redireciona para a lista de produtos
  },
  { 
    path: '/login', 
    name: 'login',
    component: Login,
    meta: { requiresAuth: false } // Página de login não requer autenticação
  },
  { 
    path: '/register', 
    name: 'register',
    component: Register,
    meta: { requiresAuth: false } // Página de registro não requer autenticação
  },
  { 
    path: '/esqueci-senha', 
    name: 'forgot-password',
    component: ForgotPassword,
    meta: { requiresAuth: false } // Página de recuperação não requer autenticação
  },
  { 
    path: '/produtos', 
    name: 'products',
    component: Products,
    meta: { requiresAuth: true } // Requer autenticação
  },
  { 
    path: '/adicionar-produto', 
    name: 'add-product',
    component: AddProduct,
    meta: { requiresAuth: true }
  },
  { 
    path: '/editar-produto/:id', 
    name: 'edit-product',
    component: EditProduct,
    props: true,
    meta: { requiresAuth: true }
  },
  { 
    path: '/alertas', 
    name: 'alerts',
    component: Alerts,
    meta: { requiresAuth: true }
  },
  { 
    path: '/vendas', 
    name: 'sales',
    component: Sales,
    meta: { requiresAuth: true }
  },
  {
    path: '/armazens',
    name: 'warehouses',
    component: WarehousesView,
    meta: { requiresAuth: true }
  },
  {
    path: '/perfil',
    name: 'profile',
    component: ProfileView,
    meta: { requiresAuth: true }
  },
  {
    path: '/alterar-senha',
    name: 'change-password',
    component: ChangePasswordView,
    meta: { requiresAuth: true }
  },
  
  // Redireciona rotas antigas para as novas
  { path: '/alerts', redirect: '/alertas' },
  { path: '/sales', redirect: '/vendas' },
  { path: '/warehouses', redirect: '/armazens' },
  { path: '/profile', redirect: '/perfil' },
  { path: '/change-password', redirect: '/alterar-senha' }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { top: 0 };
  }
});

// Navigation guard para verificar autenticação
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    // Se a rota requer autenticação e o usuário não está autenticado
    next({ name: 'login', query: { redirect: to.fullPath } });
  } else if ((to.name === 'login' || to.name === 'register' || to.name === 'forgot-password') && authStore.isAuthenticated) {
    // Se o usuário está autenticado e tenta acessar login/registro, redireciona para a página de produtos
    next({ name: 'products' });
  } else {
    // Caso contrário, permite a navegação
    next();
  }
});

export default router;