<!-- filepath: /frontend/src/components/Quiz.vue -->
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import api from '@/services/api'

const quizzes = ref([])

const fetchQuizzes = async () => {
  try {
    const response = await api.get('/api/quizzes')
    quizzes.value = response.data
  } catch (error) {
    console.error('Erreur lors du chargement des quiz:', error)
  }
}

onMounted(() => {
  fetchQuizzes()
})
</script>

<template>
  <div class="quiz-list">
    <div v-for="quiz in quizzes" :key="quiz.id">
      {{ quiz.title }}
    </div>
  </div>
</template>