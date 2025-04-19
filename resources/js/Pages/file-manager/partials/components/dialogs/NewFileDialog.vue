<script setup lang="ts">
import { Dialog, DialogScrollContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription, DialogClose} from '@matemat-cmsfly/cmsfly-core/components/ui/dialog';
import { Button } from '@matemat-cmsfly/cmsfly-core/components/ui/button';
import { FormInput } from '@matemat-cmsfly/cmsfly-core/components/form';
import { useAppFetch } from '@matemat-cmsfly/cmsfly-core/composables/useAppFetch';
import { ref } from 'vue';
import { FmBaseResponse } from '../../types';
import { currentDisk, currentFolder, refresh } from '../../composables/useFileManagerCore';
import { showDialog } from '../../composables/useFileManagerActions';
import { toast } from '@matemat-cmsfly/cmsfly-core/components/ui/toast';

const processing = ref(false)

const name = ref('')

const inputError  = ref< string | undefined>(undefined)


async function handleSubmit(){
  processing.value = true

  const {data,error} = await useAppFetch(route('fm.create-file')).post({
    disk:currentDisk.value,
    path:currentFolder.value?.path,
    name:name.value
  }).json<FmBaseResponse>()

  processing.value = false

  if(data.value?.result.status == 'success'){
    showDialog.value = false

    toast({
      title: 'File',
      description: 'File created successfully.',
      variant: 'constructive',
    })

    refresh()
    return
  }

  if(data.value?.result.status == 'warning'){

    if(data.value?.result.message == 'fileExist'){
      inputError.value = 'File with this name already exists.'
    }else{
      inputError.value = 'Something went wrong.'
    }
  }

}

</script>

<template>
<Dialog>
  <DialogScrollContent class="max-w-xl">
    <DialogHeader>
      <DialogTitle> Create New File </DialogTitle>
      <DialogDescription>
        Create new file in current directory
      </DialogDescription>
    </DialogHeader>
    <div>

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
