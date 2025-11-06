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
          <v-card-text v-if="recipe.sourceTitle">
            <v-row align="center">
              <span>{{ recipe.sourceTitle }}</span>
              <v-spacer />
              <!-- Button rechts vom Text -->
              <v-btn
                v-if="recipe.sourceInstagram"
                aria-label="Quelle öffnen"
                icon
                rel="noopener"
                title="Quelle öffnen"
                @click="trackClick(recipe.sourceInstagram)"
              >
                <v-icon color="#E1306C">mdi-instagram</v-icon>
              </v-btn>
              <v-btn
                v-if="recipe.sourceWeb"
                aria-label="Quelle öffnen"
                icon
                rel="noopener"
                title="Quelle öffnen"
                @click="trackClick(recipe.sourceWeb)"
              >
                <v-icon color="#E1306C">mdi-open-in-new</v-icon>
              </v-btn>
            </v-row>
          </v-card-text>
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
  import { analytics,logEvent } from '@/firebase/init.js';
  const recipesStore = useRecipesStore();

  onMounted(async () => {
    await recipesStore.getRecipes();
  })
  const trackClick = source => {
    logEvent(analytics, 'source-Link-clicked', {
      site: source,
    })

    // Then open the external link
    window.open(source, '_blank')
  }
</script>
