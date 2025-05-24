<script setup lang="ts">
import { FolderSearchIcon } from "lucide-vue-next";
import {
  content,
  contentLoading,
  fmView,
  isSearch,
  openFolder,
} from "../../composables/useFileManagerCore";
import FmTable from "./FmTable.vue";
import FmGrid from "./FmGrid.vue";
import Directory from "../../components/content/Directory.vue";
import File from "../../components/content/File.vue";
import {
  selectSingle,
  selectMultiple,
  toggleSelect,
  dropSelection,
  selectIfNotSelected,
  selectedItems,
} from "../../composables/useFileManagerSelect";
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
} from "@matemat-cmsfly/cmsfly-core/components/ui/context-menu";
import {
  contextMenu,
  contextMenuNoSelect,
} from "../../composables/useFileManagerActions";
import { CommonLoading } from "@matemat-cmsfly/cmsfly-core/components/common";
import { ref } from "vue";
import { File as FileType } from "../../types";

defineEmits<{
  select: [file: FileType];
}>();

const showMenu = ref(false);
</script>

<template>
  <div
    class="basis-4/5 shrink-1 min-h-96 max-h-[70vh] overflow-hidden overflow-y-auto"
  >
    <ContextMenu v-model:open="showMenu">
      <ContextMenuTrigger
        as="div"
        class="h-full"
        @contextmenu.self="dropSelection"
        @click.self="dropSelection"
      >
        <div
          v-if="contentLoading"
          class="flex size-full items-center justify-center"
        >
          <CommonLoading class="h-20 text-muted-foreground" />
        </div>
        <div
          class="w-full h-full"
          v-else-if="content.directories.length || content.files.length"
        >
          <component :is="fmView == 'table' ? FmTable : FmGrid">
            <Directory
              v-for="dir in content.directories"
              :key="dir.path"
              :dir="dir"
              :view="fmView"
              :data-select-key="'dir.' + dir.path"
              @dblclick="() => openFolder(dir)"
              @click.ctrl="toggleSelect(dir)"
              @click.shift="selectMultiple(dir, content)"
              @click.stop="selectSingle(dir)"
              @contextmenu="selectIfNotSelected(dir)"
            />
            <File
              v-for="file in content.files"
              :key="file.path"
              :file="file"
              :view="fmView"
              :data-select-key="'file.' + file.path"
              @click.ctrl="toggleSelect(file)"
              @click.shift="selectMultiple(file, content)"
              @click.stop="selectSingle(file)"
              @dblclick="$emit('select', file)"
              @contextmenu="selectIfNotSelected(file)"
            />
          </component>
        </div>
        <div
          v-else
          class="flex flex-col gap-2 items-center justify-center h-full text-muted-foreground"
        >
          <FolderSearchIcon class="size-20 stroke-1" />
          <span v-if="isSearch" class="font-semibold">No results found.</span>
          <span v-else class="font-semibold">Directory is empty ...</span>
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <template
          v-if="selectedItems.length == 0"
          v-for="section in contextMenuNoSelect"
        >
          <template v-for="item in section.items">
            <component
              v-if="
                ['add-file', 'add-folder', 'upload'].includes(item.key) &&
                'dialog' in item
              "
              :is="item.dialog"
            >
              <ContextMenuItem :disabled="!item.isActive" @select.prevent>
                <component :is="item.icon" />
                {{ item.label }}
              </ContextMenuItem>
            </component>

            <ContextMenuItem
              v-else-if="item.isActive && 'callback' in item"
              @select="item.callback()"
            >
              <component :is="item.icon" />
              {{ item.label }}
            </ContextMenuItem>
          </template>
        </template>
        <template v-else v-for="section in contextMenu">
          <template v-for="item in section.items" :key="item.key">
            <component v-if="'dialog' in item" :is="item.dialog">
              <ContextMenuItem :disabled="!item.isActive" @select.prevent>
                <component :is="item.icon" />
                {{ item.label }}
              </ContextMenuItem>
            </component>

            <ContextMenuItem
              v-else
              :disabled="!item.isActive"
              @select="item.callback()"
            >
              <component :is="item.icon" />
              {{ item.label }}
            </ContextMenuItem>
          </template>
        </template>
      </ContextMenuContent>
    </ContextMenu>
  </div>
</template>
