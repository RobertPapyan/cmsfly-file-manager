<script setup lang="ts">
import { FolderSearchIcon } from 'lucide-vue-next';
import { content, contentLoading, fmView, isSearch, openFolder } from '../../composables/useFileManagerCore';
import FmTable from './FmTable.vue';
import FmGrid from './FmGrid.vue';
import Directory from '../../components/content/Directory.vue';
import File from '../../components/content/File.vue';
import { selectSingle, selectMultiple, toggleSelect, dropSelection, selectIfNotSelected, selectedItems } from '../../composables/useFileManagerSelect';
import { ContextMenuRoot, ContextMenuTrigger, ContextMenuPortal, ContextMenuContent, ContextMenuItem } from 'reka-ui'
import { cn } from '@matemat-cmsfly/cmsfly-core/lib/utils';
import { contextMenu, contextMenuNoSelect } from '../../composables/useFileManagerActions';
import { Button } from '@matemat-cmsfly/cmsfly-core/components/ui/button';
import { CommonLoading } from '@matemat-cmsfly/cmsfly-core/components/common';
import { ref } from 'vue';


const showMenu = ref(false)


</script>

<template>
  <div class="basis-4/5 shrink-1 min-h-96 max-h-[70vh] overflow-hidden overflow-y-auto" >
    <ContextMenuRoot v-model:open="showMenu" >
      <ContextMenuTrigger class="w-full h-full block" @contextmenu.self="dropSelection" @click.self="dropSelection">
        <div v-if="contentLoading" class="flex size-full items-center justify-center">
          <CommonLoading class="h-20 text-muted-foreground" />
        </div>
        <div class="w-full h-full" v-else-if="content.directories.length || content.files.length">
          <component :is="fmView == 'table' ? FmTable : FmGrid ">
            <Directory
              v-for="dir in content.directories"
              :key="dir.path"
              :dir="dir"
              :view="fmView"
              :data-select-key="'dir.' + dir.path"
              @dblclick="()=>openFolder(dir)"
              @click.ctrl="toggleSelect(dir)"
              @click.shift="selectMultiple(dir,content)"
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
              @click.shift="selectMultiple(file,content)"
              @click.stop="selectSingle(file)"
              @contextmenu="selectIfNotSelected(file)"
            />
          </component>
        </div>
        <div v-else class="flex flex-col gap-2 items-center justify-center h-full text-muted-foreground">
          <FolderSearchIcon class="size-20 stroke-1" />
          <span v-if="isSearch" class="font-semibold">No results found.</span>
          <span v-else class="font-semibold">Directory is empty ...</span>
        </div>
      </ContextMenuTrigger>
      <ContextMenuPortal>
        <ContextMenuContent
        :class="cn(
        'relative p-2 px-4 flex flex-col items-start gap-2 z-50 max-h-96 min-w-32 overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2')"
        >
         <template v-if="selectedItems.length == 0" v-for="section in contextMenuNoSelect">
          <template  v-for="item in section.items">
            <Button
              v-if="item.isActive || ['add-file','add-folder','upload'].includes(item.key)"
              :disabled="!item.isActive"
              variant="ghost"
              size="sm"
              class="w-full  justify-start"
              @click="()=>{item.callback(); showMenu = false }"
            >
              <component :is="item.icon" />
              <span>{{ item.label }}</span>
            </Button>
          </template>
        </template>
        <template v-else v-for="section in contextMenu">
          <template v-for="item in section.items">
            <Button
                v-if="item.isActive"
                :key="item.key"
                :disabled="!item.isActive"
                variant="ghost"
                size="sm"
                class="w-full  justify-start"
                @click="()=>{item.callback(); showMenu = false }"
              >
                <component :is="item.icon" />
                <span>{{ item.label }}</span>
            </Button>
          </template>
        </template>
        </ContextMenuContent>
      </ContextMenuPortal>
    </ContextMenuRoot>
  </div>
</template>
