import { Content, Directory, File } from "../types"
import { ref, watch } from "vue"
import { currentDisk, currentFolder } from "./useFileManagerCore";

const selectedItems = ref < (Directory | File) [] > ([])
let selectLock = false;

function selectSingle(item : Directory | File){
  if(selectLock){
    selectLock = false
    return
  }
  selectedItems.value = [item]
}

function toggleSelect(item : Directory | File){

  selectLock = true
  const index = selectedItems.value.findIndex((selecteditem)=>{
    return selecteditem.path == item.path && selecteditem.type == item.type
  })

  if(index == -1){
    selectedItems.value.push(item)
    return
  }

  selectedItems.value.splice(index,1)

}

function selectMultiple(item : Directory | File, content : Content){
  selectLock = true
  if(selectedItems.value.length == 0)return

  const firstItem = selectedItems.value[0]

  if(firstItem.path == item.path && firstItem.type == item.type){
    selectedItems.value = [selectedItems.value[0]]
    return
  }

  const mergedArray = content.directories.concat(content.files)

  const startIndex = mergedArray.findIndex((i) => i.path == firstItem.path && i.type == firstItem.type )
  if(startIndex == -1) return

  const endIndex = mergedArray.findIndex((i) => i.path == item.path && i.type == item.type )
  if(endIndex == -1) return

  selectedItems.value = startIndex < endIndex ? mergedArray.slice(startIndex,endIndex+1) : mergedArray.slice(endIndex,startIndex+1)

}

function selectIfNotSelected(item: Directory | File){
  if(selectedItems.value.some((i) => i.type == item.type && i.path == item.path)){
    return
  }
  selectedItems.value = [item]
}

function selectAll(content : Content){
  selectedItems.value = content.directories.concat(content.files)
}

function dropSelection () {
  selectedItems.value = []
  selectLock = false
}


watch(currentDisk,dropSelection)

watch(currentFolder,dropSelection)

export {
  selectedItems,
  selectSingle,
  toggleSelect,
  selectMultiple,
  selectAll,
  dropSelection,
  selectIfNotSelected
}