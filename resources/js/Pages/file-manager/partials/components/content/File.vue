<script setup lang="ts">
import { TableRow, TableCell } from '@matemat-cmsfly/cmsfly-core/components/ui/table';
import { Checkbox } from '@matemat-cmsfly/cmsfly-core/components/ui/checkbox';
import { Avatar, AvatarImage, AvatarFallback } from '@matemat-cmsfly/cmsfly-core/components/ui/avatar';
import { currentDisk, openFolderByPath, isSearch } from '../../composables/useFileManagerCore';
import { File } from '../../types';
import { getFileDate } from '../../helper/date';
import { getFileIcon } from '../../helper/fileIcon';
import { getFileSize } from '../../helper/fileSize';
import { getFileType } from '../../helper/fileType';
import { computed } from 'vue';
import { selectedItems, toggleSelect } from '../../composables/useFileManagerSelect';
import { clipboard, IMAGE_FORMATS } from '../../composables/useFileManagerActions';

const props = defineProps<{file:File , view:'table' | 'grid'}>()



const isImage = computed <boolean> (()=>{
  return IMAGE_FORMATS.includes(props.file.extension)
})

const isSelected = computed<boolean>({
  get() {
    return selectedItems.value.some(
      (item) => item.path === props.file.path && item.type === props.file.type
    );
  },
  set() {
    toggleSelect(props.file)
  }
});

</script>

<template>
  <TableRow v-if="view == 'table'" class="select-none relative" :class="{'bg-muted' : isSelected}">
    <TableCell>
      <div @click.stop="" class="flex justify-center">
        <Checkbox
          class="block"
          v-model="isSelected"
        />
      </div>
    </TableCell>

    <TableCell class="flex items-center gap-2">
      <component :is="getFileIcon(file.extension)" class="w-6"/>
      <span>{{ file.basename }}</span>
    </TableCell>

    <TableCell v-if="isSearch">
        <span @click="openFolderByPath(file.dirname)" class="select-none hover:underline cursor-pointer">{{ file.dirname}}</span>
    </TableCell>

    <TableCell>
      {{ getFileDate(file.timestamp)}}
    </TableCell>

    <TableCell>
      {{ getFileType(file.extension) }}
    </TableCell>

    <TableCell>
      {{ getFileSize(file.size) }}
    </TableCell>
    <div v-if="clipboard.type == 'cut' && clipboard.files.some(f => f == file.path)" class="absolute left-0 bg-accent/50 size-full"></div>
  </TableRow>
  <li v-else
    class="flex flex-col gap-2 items-center justify-center relative p-2 rounded-md select-none hover:bg-muted/75 focus:bg-muted/75"
    :class="{'bg-muted' : isSelected}"
    >
    <div v-if="isImage">
      <Avatar class="w-12" shape="square">
        <AvatarImage :src="route('fm.thumbnails',{disk:currentDisk, path:file.path})" />
        <AvatarFallback>
          <component :is="getFileIcon(file.extension)" class="stroke-1 size-12" />
        </AvatarFallback>
      </Avatar>

    </div>
    <component v-else :is="getFileIcon(file.extension)" class="stroke-1 size-12" />
    <div v-if="clipboard.type == 'cut' && clipboard.files.some(f => f == file.path)" class="absolute bg-accent/50 size-full"></div>
    <div class="w-full flex overflow-hidden justify-center items-center gap-2 text-sm">
      <span class="select-none truncate w-full text-center">{{ file.basename}}</span>
    </div>
  </li>
</template>