<script setup lang="ts">
import FileManagerLayout from "./partials/layout/FileManagerLayout.vue";
import Content from "./partials/structure/content/Content.vue";
import { useSetLayout } from "@matemat-cmsfly/cmsfly-core/composables/useLayout";
import { initFileManager } from "./partials/composables/useFileManagerCore";
import { onMounted } from "vue";
import { currentDialog, showDialog } from "./partials/composables/useFileManagerActions";

useSetLayout([["File Manager"]]);

onMounted(()=>{
  initFileManager()
})
</script>

<template>
  <FileManagerLayout>
    <Content />
    <component :is="currentDialog" v-model:open="showDialog" />
  </FileManagerLayout>
</template>
