// src/stores/auth.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { api } from '@/services/api'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(JSON.parse(localStorage.getItem('user')))
  const token = ref(localStorage.getItem('token'))

  const isAuthenticated = computed(() => !!token.value)

  async function login(credentials) {
    const { data } = await api.post('/api/auth/login', credentials)

    token.value = data.token
    user.value = data.user

    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data.user))
  }

  function logout() {
    token.value = null
    user.value = null

    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  return {
    user,
    token,
    isAuthenticated,
    login,
    logout
  }
})
