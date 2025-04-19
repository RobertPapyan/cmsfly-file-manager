<script setup lang="ts">
import { Dialog, DialogScrollContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription, DialogClose} from '@matemat-cmsfly/cmsfly-core/components/ui/dialog';
import { Button } from '@matemat-cmsfly/cmsfly-core/components/ui/button';
import { FormInput } from '@matemat-cmsfly/cmsfly-core/components/form';
import { useAppFetch } from '@matemat-cmsfly/cmsfly-core/composables/useAppFetch';
import {  ref, onMounted, watch, computed } from 'vue';
import { FmBaseResponse, File , Directory } from '../../types';
import { currentDisk, currentFolder, refresh } from '../../composables/useFileManagerCore';
import { showDialog } from '../../composables/useFileManagerActions';
import { toast } from '@matemat-cmsfly/cmsfly-core/components/ui/toast';
import { selectedItems } from '../../composables/useFileManagerSelect';


const processing = ref(false)

const item = computed<File | Directory>({
  get(){
    return selectedItems.value[0]
  },
  set(){}
})

const name = ref('')

const inputError  = ref< string | undefined>(undefined)

const model = defineModel<boolean | undefined>('open')

watch(model,(v)=>{
  name.value = item.value.basename
})
onMounted(()=>{
  name.value = item.value.basename
})

async function handleSubmit(){

  processing.value = true

  const {data,error} = await useAppFetch(route('fm.rename')).post({
    disk:currentDisk.value,
    newName: currentFolder.value ? currentFolder.value?.path + '/' + name.value : name.value,
    oldName: currentFolder.value ? currentFolder.value?.path + '/' + item.value.basename : item.value.basename,
    type: item.value.type
  }).json<FmBaseResponse>()

  processing.value = false

  if(data.value?.result.status == 'success'){
    showDialog.value = false

    toast({
      title: 'Rename',
      description: 'Item renamed successfully.',
      variant: 'constructive',
    })

    refresh()
    return
  }

  if(data.value?.result.status == 'warning'){
      inputError.value = 'Something went wrong.'

  }

}

</script>

<template>
<Dialog v-model:open="model">
  <DialogScrollContent class="max-w-xl">
    <DialogHeader>
      <DialogTitle> Rename </DialogTitle>
      <DialogDescription>
        Rename file(directory)
      </DialogDescription>
    </DialogHeader>
    <div v-if="item">
      <FormInput v-model="name" :error="inputError" id="new_file_name" type="text" label="File name" required/>
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
      type="submit">
        Submit
      </Button>
    </DialogFooter>
  </DialogScrollContent>
</Dialog>
</template>
