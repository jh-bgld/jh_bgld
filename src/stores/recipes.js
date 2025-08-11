import { defineStore } from 'pinia'

import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/firebase/init';


export const useRecipesStore = defineStore('recipes', {
  state: () => ({
    recipes: [],
    state: '',
  }),
  actions: {
    async getRecipes () {
      this.state = 'fetching';
      this.recipes = [];
      try {
        const querySnapshot = await getDocs(collection(db, 'recipes'));
        if (querySnapshot) {
          this.state = 'success';
          querySnapshot.forEach(doc => {
            // doc.data() is never undefined for query doc snapshots
            this.recipes.push(doc.data());
          });
        }
      } catch(error) {
        this.state = 'error';
        console.error(error);
      }
    },
  },
})
