<script setup lang="ts">
import { Dialog, DialogScrollContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription, DialogClose} from '@matemat-cmsfly/cmsfly-core/components/ui/dialog';
import { Button } from '@matemat-cmsfly/cmsfly-core/components/ui/button';
import { FormDropzone, FormCheckbox } from '@matemat-cmsfly/cmsfly-core/components/form';
import { useAppFetch } from '@matemat-cmsfly/cmsfly-core/composables/useAppFetch';
import { ref } from 'vue';
import { FmBaseResponse } from '../../types';
import { currentDisk, currentFolder, refresh } from '../../composables/useFileManagerCore';
import { showDialog } from '../../composables/useFileManagerActions';

import { toast } from '@matemat-cmsfly/cmsfly-core/components/ui/toast';

const model  = ref<File[]>([])
const inputError  = ref< string | undefined>(undefined)
const overwrite = ref<boolean>(false)

const processing = ref(false)

async function handleSubmit(){
  if(!model.value.length)return
  processing.value = true
  let formData = new FormData();
  model.value.map((file)=>formData.append("files[]", file))
  formData.append('disk', currentDisk.value)
  formData.append('path', currentFolder.value?.path ?? '')
  formData.append('overwrite', overwrite.value ? '1' : '0' )

  const {data,error} = await useAppFetch(route('fm.upload')).post(formData).json<FmBaseResponse>()

  processing.value = false

  if(data.value?.result.status == 'success'){
    showDialog.value = false
    model.value = []

    toast({
      title: 'Upload',
      description: 'Files uploaded successfully.',
      variant: 'constructive',
    })

    refresh()
    return
  }

  if(data.value?.result.status == 'warning'){

    if(data.value?.result.message == 'notAllUploaded'){
      inputError.value = 'Could not upload all selected files.'
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
      <DialogTitle> Upload </DialogTitle>
      <DialogDescription>
        Upload files into current directory
      </DialogDescription>
    </DialogHeader>
    <div>
      <FormDropzone
          v-model="model"
          accept="*"
          class="col-span-full"
          id="file_upload_input"
          :error="inputError"
          placeholder="Upload files"
        />
      <FormCheckbox
        v-model="overwrite"
        id="overwrite"
        label="Overwrite existing files"
        class="mt-4"
      />
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
