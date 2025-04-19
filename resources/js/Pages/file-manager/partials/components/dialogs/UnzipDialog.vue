<script setup lang="ts">
import { Dialog, DialogScrollContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription, DialogClose} from '@matemat-cmsfly/cmsfly-core/components/ui/dialog';
import { Button } from '@matemat-cmsfly/cmsfly-core/components/ui/button';
import { FormInput } from '@matemat-cmsfly/cmsfly-core/components/form';
import { useAppFetch } from '@matemat-cmsfly/cmsfly-core/composables/useAppFetch';
import {  ref, computed } from 'vue';
import { FmBaseResponse, File  } from '../../types';
import { currentDisk, currentFolder, refresh } from '../../composables/useFileManagerCore';
import { showDialog } from '../../composables/useFileManagerActions';
import { toast } from '@matemat-cmsfly/cmsfly-core/components/ui/toast';
import { selectedItems } from '../../composables/useFileManagerSelect';


const processing = ref(false)

const item = computed<File>(()=>selectedItems.value[0] as File)

const name = ref('')

const inputError  = ref< string | undefined>(undefined)

async function handleSubmit(){

  processing.value = true

  const {data,error} = await useAppFetch(route('fm.unzip')).post({
    disk:currentDisk.value,
    path: item.value.path,
    folder: name.value ?? null
  }).json<FmBaseResponse>()

  processing.value = false

  if(data.value?.result.status == 'success'){
    showDialog.value = false
    name.value = ''
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
<Dialog >
  <DialogScrollContent class="max-w-xl">
    <DialogHeader>
      <DialogTitle> Unzip </DialogTitle>
      <DialogDescription>
        Unzip Archive
      </DialogDescription>
    </DialogHeader>
    <div v-if="item">
      <FormInput v-model="name" :error="inputError" id="unzip_folder_name" type="text" label="Extract Archive into" required/>
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
