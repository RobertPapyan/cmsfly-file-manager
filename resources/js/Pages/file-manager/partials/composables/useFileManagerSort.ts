import { ref, Ref, watch } from "vue"
import { Sort, Content ,File, Directory, SortOption } from "../types"


const fmSort = ref<Sort>({
  by:'date',
  direction:'asc'
})

const sortMap = {
  date : (f1 : File | Directory, f2 : File | Directory)=> fmSort.value.direction == 'asc' ? f2.timestamp - f1.timestamp : f1.timestamp - f2.timestamp ,
  name : (f1 : File | Directory, f2 : File | Directory) => fmSort.value.direction == 'asc' ? f1.basename.localeCompare(f2.basename) : f2.basename.localeCompare(f1.basename) ,
  size : (f1 : File , f2 : File ) => fmSort.value.direction == 'asc' ? f2.size - f1.size : f1.size - f2.size,
  path: (f1 : File | Directory, f2 : File | Directory) => fmSort.value.direction == 'asc' ? f1.path.localeCompare(f2.path) : f2.path.localeCompare(f1.path)

}

function sortContent(content: Ref<Content>, by:SortOption | null = null){
    if(by == null){
      content.value.files.sort(sortMap[fmSort.value.by])
      if(fmSort.value.by != 'size') content.value.directories.sort(sortMap[fmSort.value.by])
      return
    }

    if(by == fmSort.value.by){
      fmSort.value.direction  = fmSort.value.direction == 'asc' ? 'desc' : 'asc'
    }else{
      fmSort.value.direction = 'asc'
    }

    content.value.files.sort(sortMap[by])
    if(by != 'size') content.value.directories.sort(sortMap[by])
    fmSort.value.by = by

}


export {
  fmSort,
  sortContent
}
