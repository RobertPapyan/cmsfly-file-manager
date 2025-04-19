<script setup lang="ts">
import { onMounted } from 'vue';
import Actions from "../structure/Actions.vue"
import Navigation from '../structure/Navigation.vue';
import { tree, search } from '../composables/useFileManagerCore';
import { dropSelection } from '../composables/useFileManagerSelect';
import NavItem from '../structure/sidebar/NavItem.vue';

onMounted(()=>{
  const main = document.querySelector('main')
  if(main){
      main.addEventListener('click', (event) => {
        if (event.target === main) {
          dropSelection()
        }
    });

  }

})

</script>

<template>
  <div>
    <div class="rounded-md border">
        <div>
          <Actions />
          <Navigation />
        </div>
        <div class="flex">

          <div @click.self="dropSelection" class="basis-1/5 shrink-0 border-r p-2 overflow-auto">
            <ul>
              <NavItem v-model="tree" />
            </ul>
          </div>

            <slot></slot>
        </div>

    </div>


  </div>
</template>
