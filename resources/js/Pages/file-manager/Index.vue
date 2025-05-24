<script setup lang="ts">
import FileManagerLayout from "./partials/layout/FileManagerLayout.vue";
import { useSetLayout } from "@matemat-cmsfly/cmsfly-core/composables/useLayout";
import { LayoutLg } from "@matemat-cmsfly/cmsfly-core/components/layout";

useSetLayout([["File Manager"]]);
</script>

<template>
  <LayoutLg>
    <FileManagerLayout class="rounded-xl border" />
  </LayoutLg>
</template>
