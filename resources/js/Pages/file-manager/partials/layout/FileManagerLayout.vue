<script setup lang="ts">
import { onMounted } from "vue";
import Actions from "../structure/Actions.vue";
import Navigation from "../structure/Navigation.vue";
import { initFileManager, tree } from "../composables/useFileManagerCore";
import { dropSelection } from "../composables/useFileManagerSelect";
import NavItem from "../structure/sidebar/NavItem.vue";
import Content from "../structure/content/Content.vue";
import { File as FileType } from "../types";

defineEmits<{
  select: [file: FileType];
}>();

onMounted(() => {
  initFileManager();
});
</script>

<template>
  <div class="has-[[data-slot=drag-overlay][data-state=true]]:select-none">
    <div>
      <Actions />
      <Navigation />
    </div>
    <div class="flex">
      <div
        @click.self="dropSelection"
        class="min-w-64 shrink-0 border-r p-2 overflow-auto"
      >
        <ul>
          <NavItem v-model="tree" />
        </ul>
      </div>

      <Content @select="$emit('select', $event)" />
    </div>
  </div>
</template>
