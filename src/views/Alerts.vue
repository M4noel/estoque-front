<script setup>
import { ref, onMounted } from 'vue';
import { api } from '../services/api';

const alerts = ref([]);

async function loadAlerts() {
  const { data } = await api.get('/alerts');
  alerts.value = data;
}

onMounted(loadAlerts);
</script>

<template>
  <div>
    <h1>🚨 Alertas</h1>

    <ul>
      <li v-for="a in alerts" :key="a._id">
        {{ a.message }}
      </li>
    </ul>
  </div>
</template>
