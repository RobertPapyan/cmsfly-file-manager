<script setup lang="ts">
import { FolderIcon, HardDriveIcon } from 'lucide-vue-next';
import { TreeNode, TreeResponse } from '../../types';
import { onMounted, ref, watch } from 'vue';
import { useAppFetch } from '@matemat-cmsfly/cmsfly-core/composables/useAppFetch';
import { currentDisk, currentFolder, openFolder  } from '../../composables/useFileManagerCore';
import { Accordion, AccordionContent , AccordionItem , AccordionTrigger } from '@matemat-cmsfly/cmsfly-core/components/ui/accordion';

const open = ref<string | undefined>(undefined)

const model = defineModel<TreeNode>({
  required: true
})

const divRef = ref<HTMLElement>()


async function handleExpand(e:string | string[] | undefined){

  if(!model.value)return

  const overflowHiddenDiv = divRef.value?.parentNode?.parentNode?.nextSibling as HTMLElement;
  if(overflowHiddenDiv){
    if(e){
      setTimeout(() => overflowHiddenDiv.classList.add('overflow-visible'), 500)
    }else{
      overflowHiddenDiv.classList.remove('overflow-visible')
    }
  }


  if(!model.value?.directories){
    const {data} = await useAppFetch(route('fm.tree',{disk:currentDisk.value, path:model.value?.path})).json<TreeResponse>()
    if(data.value){
      model.value.directories = data.value.directories
    }

  }

  open.value = model.value.basename

}

watch(currentFolder,(newVal)=>{
  if(newVal?.path.startsWith(model.value.path)){
    open.value = model.value.basename
  }
})
onMounted(()=>{
  if(currentFolder.value?.path.startsWith(model.value.path)){
    open.value = model.value.basename
  }
})

</script>

<template>
  <Accordion v-model:model-value="open" collapsible :disabled="!model.props.hasSubdirectories" @update:model-value="handleExpand">
    <AccordionItem class="border-none" :value="model.basename">
      <AccordionTrigger :class="[!model.props.hasSubdirectories && '[&>svg]:hidden', 'p-0 w-fit rounded-md px-1', currentFolder?.path == model.path && 'bg-accent'  ]">
        <div ref="divRef" class="text-sm flex items-center gap-2" >
          <FolderIcon v-if="model.type == 'dir'" class=" inline-block w-4"/>
          <HardDriveIcon v-else class="inline-block w-4"/>
          <span @click.stop="() => openFolder(model)" class="cursor-pointer hover:text-muted-foreground">{{ model.basename }}</span>
         </div>
      </AccordionTrigger>
      <AccordionContent class="p-0">
        <template v-if="model.directories" >
          <NavItem
            v-for="(item, index) in model.directories"
            class="ml-2 w-auto"
            v-model="model.directories[index]"
          />
        </template>
      </AccordionContent>
    </AccordionItem>
  </Accordion>
</template>