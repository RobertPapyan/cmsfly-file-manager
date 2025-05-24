<script setup lang="ts">
import { DatatableBasic } from "@matemat-cmsfly/cmsfly-core/components/datatable";
import { FolderIcon } from "lucide-vue-next";
import { selectedItems } from "../../composables/useFileManagerSelect";
import { getFileIcon } from "../../helper/fileIcon";
import { getFileSize } from "../../helper/fileSize";
import { getFileDate } from "../../helper/date";
import { getFileType } from "../../helper/fileType";
import { Directory, File as FmFile } from "../../types";

defineProps<{
  items: (Directory | FmFile)[];
}>();
</script>

<template>
  <DatatableBasic
    v-model="selectedItems"
    :columns="['name', 'date', 'type', 'size']"
    :data="items"
    class="[&>:first-child]:min-h-fit"
  >
    <template #name="{ row }">
      <div v-if="row.type == 'file'" class="flex items-center gap-2">
        <component
          :is="getFileIcon((row as FmFile).extension)"
          class="size-6 text-accent-foreground"
        />
        {{ row.basename }}
      </div>
      <div v-else class="flex items-center gap-2">
        <FolderIcon class="size-6 text-accent-foreground" />
        {{ row.basename }}
      </div>
    </template>
    <template #date="{ row }">
      {{ getFileDate(row.timestamp) }}
    </template>
    <template #type="{ row }">
      {{
        row.type == "file" ? getFileType((row as FmFile).extension) : "Folder"
      }}
    </template>
    <template #size="{ row }">
      {{ row.type == "file" ? getFileSize((row as FmFile).size) : "" }}
    </template>
  </DatatableBasic>
</template>
