<script setup lang="ts">
import { TableRow, TableCell } from '@matemat-cmsfly/cmsfly-core/components/ui/table';
import { Checkbox } from '@matemat-cmsfly/cmsfly-core/components/ui/checkbox';
import { fmView, isSearch, openFolderByPath } from '../../composables/useFileManagerCore';
import { Directory } from '../../types';
import { FolderIcon } from 'lucide-vue-next';
import { getFileDate } from '../../helper/date';
import { selectedItems, toggleSelect } from '../../composables/useFileManagerSelect';
import { computed } from 'vue';
import { clipboard } from '../../composables/useFileManagerActions';


const props = defineProps<{dir:Directory, view:'table' | 'grid'}>()

const isSelected = computed<boolean>({
  get(){
   return selectedItems.value.some((item) => item.path == props.dir.path && item.type == props.dir.type)
  },
  set(){
    toggleSelect(props.dir)
  }
})

</script>

<template>
  <TableRow v-if="view == 'table'" class="relative select-none" :class="{'bg-muted' : isSelected}">
    <TableCell>
      <div @click.stop="" class="flex justify-center">
        <Checkbox
          class="block"
          v-model="isSelected"
        />
      </div>
    </TableCell>

    <TableCell class="flex items-center gap-2">
      <FolderIcon class="w-6 "/>
        <span class="select-none">{{ dir.basename}}</span>
    </TableCell>

    <TableCell v-if="isSearch">
        <span @click="openFolderByPath(dir.dirname)" class="select-none hover:underline cursor-pointer">{{ dir.dirname}}</span>
    </TableCell>

    <TableCell>
      {{ getFileDate(dir.timestamp)}}
    </TableCell>

    <TableCell>
      Folder
    </TableCell>

    <TableCell>

    </TableCell>
    <div v-if="clipboard.type == 'cut' && clipboard.directories.some(d => d == dir.path)" class="absolute left-0 bg-accent/50 size-full"></div>
  </TableRow>
  <li v-else
    class="flex flex-col gap-2 items-center justify-center relative p-2 rounded-md select-none hover:bg-muted/75 focus:bg-muted/75"
    :class="{'bg-muted' : isSelected}"
    >
    <FolderIcon class=" stroke-1 size-12"/>
    <div v-if="clipboard.type == 'cut' && clipboard.directories.some(d => d == dir.path)" class="absolute left-0 bg-accent/50 size-full"></div>
    <div class="w-full flex overflow-hidden justify-center items-center gap-2 text-sm">
      <span class="select-none truncate w-full text-center">{{ dir.basename}}</span>
    </div>
  </li>
</template>