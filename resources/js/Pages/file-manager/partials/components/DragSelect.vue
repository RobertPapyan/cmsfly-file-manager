<script setup lang="ts">
import { computed, ref } from 'vue';

const props = defineProps<{
  container: HTMLElement
}>()

const container  = props.container

interface Position {
  x:number,
  y:number
}

const isDraging = ref<boolean>(false)
const startPos = ref<Position>({x:0,y:0})
const endPos = ref<Position>({x:0,y:0})

const emit = defineEmits<{
  select:[string[]]
}>()


const boxStyles = computed(()=>{
  const left = Math.min(startPos.value.x,endPos.value.x)
  const top = Math.min(startPos.value.y,endPos.value.y)
  const height = Math.abs(startPos.value.y-endPos.value.y)
  const width = Math.abs(startPos.value.x-endPos.value.x)

  return `left:${left}px; top:${top}px; height:${height}px; width:${width}px`
})


function computeSelection(){
  if(startPos.value.x == endPos.value.x && startPos.value.y == endPos.value.y)return
  const elements = container.children
  const selected: string[] = []
  for(let elem of elements){
    const rect = elem.getBoundingClientRect()
    if(checkCross({c1:startPos.value,c2:endPos.value},{c1:{x:rect.x,y:rect.y},c2:{x:rect.x + rect.width, y:rect.y + rect.height}})){
      const x = elem as HTMLElement
      if(x.dataset.selectKey)selected.push(x.dataset.selectKey)
    }
  }
  emit('select',selected)
}

function checkCross (rec1:{c1:Position, c2:Position}, rec2:{c1:Position, c2:Position} ) : boolean{
  const [left1, right1] = [Math.min(rec1.c1.x, rec1.c2.x), Math.max(rec1.c1.x, rec1.c2.x)];
  const [top1, bottom1] = [Math.min(rec1.c1.y, rec1.c2.y), Math.max(rec1.c1.y, rec1.c2.y)];

  const [left2, right2] = [Math.min(rec2.c1.x, rec2.c2.x), Math.max(rec2.c1.x, rec2.c2.x)];
  const [top2, bottom2] = [Math.min(rec2.c1.y, rec2.c2.y), Math.max(rec2.c1.y, rec2.c2.y)];

  return !(top1 > bottom2 || bottom1 < top2 || right1 < left2 || left1 > right2);
}

container.addEventListener('mousedown',(e)=>{
  if(e.target == container){
    endPos.value = startPos.value = {x:e.clientX, y:e.clientY}
    isDraging.value = true
  }
})

document.addEventListener('mousemove',(e)=>{
  if(!isDraging.value) return
  endPos.value = {x:e.clientX, y:e.clientY}
})

document.addEventListener('mouseup',()=>{
  if(!isDraging.value)return
  isDraging.value = false
  computeSelection()
})



</script>

<template>
<div v-show="isDraging" class="fixed bg-accent/75 border-2 z-50 rounded-md" :style="boxStyles" ></div>

</template>