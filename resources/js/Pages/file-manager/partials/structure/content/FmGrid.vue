<script setup lang="ts">
import { ref, useTemplateRef } from 'vue';
import { dropSelection, selectedItems, toggleSelect } from '../../composables/useFileManagerSelect';
import DragSelect from '../../components/DragSelect.vue';
import { content } from '../../composables/useFileManagerCore';

const containerRef = useTemplateRef('containerRef')
let dropLock = false

function handleBoxSelect(items:string[]){
  if(!items.length)return
  dropLock = true
  dropSelection()
  items.forEach((item) => {
    if(item.startsWith('file.')){
      const path = item.slice(5)
      const file = content.value.files.find(f => f.path == path)
      if(file)toggleSelect(file)
    }else if(item.startsWith('dir.')){
      const path = item.slice(4)
      const dir = content.value.directories.find(d => d.path == path)
      if(dir)toggleSelect(dir)
    }
  })
  setTimeout(()=>dropLock = false,10)
}

</script>

<template>
  <ul ref="containerRef" @click.self="dropLock ? dropLock = false : dropSelection() " @contextmenu.self="dropSelection" class="flex flex-wrap content-start gap-2 p-2 [&>*]:w-24 [&>*]:h-max h-full  ">
    <slot></slot>
    <template v-if="containerRef">
      <DragSelect
      :container="containerRef!"
      @select="handleBoxSelect"
      />
    </template>
  </ul>
</template>