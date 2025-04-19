<script setup lang="ts">

import { Dialog, DialogScrollContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription, DialogClose} from '@matemat-cmsfly/cmsfly-core/components/ui/dialog';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@matemat-cmsfly/cmsfly-core/components/ui/table';
import { Button } from '@matemat-cmsfly/cmsfly-core/components/ui/button';
import { useAppFetch } from '@matemat-cmsfly/cmsfly-core/composables/useAppFetch';
import {  ref, onMounted, watch, computed } from 'vue';
import { FmBaseResponse, File, Directory, SortOption } from '../../types';
import { currentDisk, currentFolder, refresh, isSearch } from '../../composables/useFileManagerCore';
import { showDialog } from '../../composables/useFileManagerActions';
import { toast } from '@matemat-cmsfly/cmsfly-core/components/ui/toast';
import { dropSelection, selectedItems , selectSingle, toggleSelect } from '../../composables/useFileManagerSelect';
import DirectoryComponent from '../content/Directory.vue';
import FileComponent from '../content/File.vue';
import { SquareMousePointerIcon, TrashIcon } from 'lucide-vue-next';


const processing = ref(false)

const items = ref< (Directory | File)[] >([])



const model = defineModel<boolean | undefined>('open')

watch(model,(v)=>{
  items.value = selectedItems.value.map((i)=>i)
})
onMounted(()=>{
  items.value = selectedItems.value.map((i)=>i)
})

async function handleSubmit(){

  processing.value = true

  const {data,error} = await useAppFetch(route('fm.delete')).post({
    disk:currentDisk.value,
    items: selectedItems.value.map((i) => { return {path:i.path, type: i.type}} )
  }).json<FmBaseResponse>()

  processing.value = false

  if(data.value?.result.status == 'success'){
    showDialog.value = false
    const itemsCount = selectedItems.value.length
    toast({
      title: 'Delete',
      description: `${itemsCount} item(s) deleted successfully.`,
      variant: 'constructive',
    })

    refresh()
    return
  }
   if(data.value?.result.status == 'error'){

    if(data.value?.result.message == 'aclError'){
      toast({
        title: 'Delete',
        description: "You have no permission!",
        variant: 'destructive',
      })
    }
  }
}


function handleSelectAll(){
  if(items.value.length == selectedItems.value.length){
    dropSelection()
  }else{
    selectedItems.value = items.value.map(i => i)
  }
}

</script>

<template>
<Dialog v-model:open="model">
  <DialogScrollContent class="max-w-xl">
    <DialogHeader>
      <DialogTitle> Delete </DialogTitle>
      <DialogDescription>
        Delete <span class="font-semibold">{{ selectedItems.length }}</span> files (directories)
      </DialogDescription>
    </DialogHeader>
    <div>
      <div class="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead width="44">
                  <Button class="px-1.5" size="xs" variant="ghost" @click="handleSelectAll">
                    <SquareMousePointerIcon />
                  </Button>
              </TableHead>

              <TableHead >
                  <span>
                    Name
                  </span>
              </TableHead>
              <TableHead v-if="isSearch">
              <span>
                Path
              </span>
              </TableHead>
              <TableHead >
                <span>
                  Date
                </span>
              </TableHead>
              <TableHead >
                <span  >
                  Type
                </span>
              </TableHead>
              <TableHead >
                <span>
                  Size
                </span>

              </TableHead>

            </TableRow>
          </TableHeader>

          <TableBody>
            <DirectoryComponent
              v-for="dir in items.filter((i)=> i.type == 'dir')"
              :dir="dir"
              view="table"
              @click.stop="toggleSelect(dir)"
            />
            <FileComponent
              v-for="file in items.filter((i)=> i.type == 'file') as File[]"
              :file="file"
              view="table"
              @click.stop="toggleSelect(file)"
            />
          </TableBody>
        </Table>
      </div>
    </div>
    <DialogFooter>
      <DialogClose>
        <Button :variant="'outline'">
            Cancel
        </Button>
      </DialogClose>
      <Button
      :disabled="processing"
      @click="handleSubmit"
      :size="'default'"
      :variant="'destructive'"
      type="submit">
        <TrashIcon />
        Delete Items
      </Button>
    </DialogFooter>
  </DialogScrollContent>
</Dialog>
</template>