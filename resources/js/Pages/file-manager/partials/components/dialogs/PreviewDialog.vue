<script setup lang="ts">
import { Dialog, DialogScrollContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription, DialogClose} from '@matemat-cmsfly/cmsfly-core/components/ui/dialog';
import { Button } from '@matemat-cmsfly/cmsfly-core/components/ui/button';
import { currentDisk, currentFolder } from '../../composables/useFileManagerCore';
import { selectedItems } from '../../composables/useFileManagerSelect';
import { isAudio, isImage, isVideo } from '../../composables/useFileManagerActions';
import { computed } from 'vue';


const item = computed(() => selectedItems.value[0])

</script>

<template>
<Dialog>
  <DialogScrollContent class="max-w-xl">
    <DialogHeader>
      <DialogTitle> Preview </DialogTitle>
      <DialogDescription>
        Preview media content.
      </DialogDescription>
    </DialogHeader>
    <div>

      <img v-if="isImage"  :src="route('fm.preview',{disk:currentDisk,path:item.path})" class="w-full ">
      <audio v-else-if="isAudio" controls :src="route('fm.stream-file',{disk:currentDisk, path:item.path})" class="w-full" />
      <video v-else controls :src="route('fm.stream-file',{disk:currentDisk, path:item.path})"></video>
    </div>
    <DialogFooter>
      <DialogClose>
        <Button :variant="'outline'">
            Cancel
        </Button>
      </DialogClose>
    </DialogFooter>
  </DialogScrollContent>
</Dialog>
</template>
