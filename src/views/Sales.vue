<script setup>
import { ref, onMounted } from 'vue';
import { api } from '../services/api';

const sales = ref([]);

async function loadSales() {
  try {
    const { data } = await api.get('/api/sales');
    sales.value = data;
  } catch (error) {
    console.error('Erro ao carregar vendas:', error);
  }
}

onMounted(loadSales);
</script>

<template>
  <div>
    <h1>💰 Vendas</h1>

    <ul>
      <li v-for="s in sales" :key="s._id">
        {{ s.product?.name }} — Quantidade: {{ s.quantity }}
      </li>
    </ul>
  </div>
</template>
