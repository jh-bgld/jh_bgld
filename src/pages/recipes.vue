<template>
  <v-container>
    <v-card-title class="text-h5 font-weight-bold">Wilde Rezepte</v-card-title>

    <v-expansion-panels variant="accordion">
      <v-expansion-panel
        v-for="(recipe, index) in recipesStore.recipes"
        :key="'recipe-' + index"
      >
        <v-expansion-panel-title>
          {{ recipe.title }}
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-card-subtitle>{{ recipe.ingredientheader }}</v-card-subtitle>
          <v-card-text class="mb-4" v-html="recipe.ingredients" />
          <v-card-subtitle>Zubereitung:</v-card-subtitle>
          <v-card-text>{{ recipe.instructions }}</v-card-text>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-container>
</template>

<script setup>
  import { useRecipesStore } from '@/stores/recipes';
  const recipesStore = useRecipesStore();

  onMounted(async () => {
    await recipesStore.getRecipes();
  })
</script>
