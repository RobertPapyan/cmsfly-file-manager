import { ClipboardIcon, DownloadIcon, EyeIcon, FileArchiveIcon,
        FilePenIcon, FilePlus2Icon, FilesIcon, FolderPlusIcon,
        PackageOpenIcon, PlayIcon, ScissorsIcon, Settings2Icon, Trash2Icon, UploadIcon  } from 'lucide-vue-next'
import { Clipboard, FmBaseResponse, MenuSection, File } from "../types";
import { type Component, ref, shallowRef, computed } from "vue";
import { currentDisk, currentFolder, refresh } from "./useFileManagerCore";
import { selectedItems, dropSelection } from "./useFileManagerSelect";
import { useAppFetch } from "@matemat-cmsfly/cmsfly-core/composables/useAppFetch";
import { toast } from "@matemat-cmsfly/cmsfly-core/components/ui/toast";
import NewFileDialog from '../components/dialogs/NewFileDialog.vue';
import NewFolderDialog from '../components/dialogs/NewFolderDialog.vue';
import UploadDialog from '../components/dialogs/UploadDialog.vue';
import RenameDialog from '../components/dialogs/RenameDialog.vue';
import DeleteDialog from '../components/dialogs/DeleteDialog.vue';
import ZipDialog from '../components/dialogs/ZipDialog.vue';
import UnzipDialog from '../components/dialogs/UnzipDialog.vue';
import PropertiesDialog from '../components/dialogs/PropertiesDialog.vue';
import PreviewDialog from '../components/dialogs/PreviewDialog.vue';

const clipboard = ref<Clipboard> ({
    directories:[],
    files:[],
    type:'copy',
    disk:currentDisk.value
  })

const currentDialog = shallowRef<Component>(NewFileDialog) ;
const showDialog = ref(false)

const IMAGE_FORMATS = [
  'jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'tiff', 'tif', 'ico', 'avif'
]

const VIDEO_FORMATS = [
  'mp4', 'webm', 'ogg', 'ogv', 'mov', 'avi', 'mkv'
];

const AUDIO_FORMATS = [
  'mp3', 'wav', 'ogg', 'aac', 'flac', 'm4a'
];


function addItemsToClipboard(type: 'copy' | 'cut' = 'copy'){
  clipboard.value.directories = []
  clipboard.value.files = []
  clipboard.value.type = type
  clipboard.value.disk = currentDisk.value
  selectedItems.value.forEach((item)=>{
      if(item.type == 'file'){
        clipboard.value.files.push(item.path)
        return
      }
      clipboard.value.directories.push(item.path)
  })

  toast({
    title: type.charAt(0).toUpperCase() + type.slice(1),
    description: 'Items copied successfully.',
    variant: 'default',
  })
  dropSelection()
}

async function pasteItems(){
  const {data, error} = await useAppFetch(route('fm.paste'))
                        .post({
                          clipboard: clipboard.value,
                          disk: currentDisk.value,
                          path: currentFolder.value?.path,
                        })
                        .json<FmBaseResponse>()
  if(data.value?.result.status == 'success'){

    toast({
      title: "Paste",
      description: 'Items pasted successfully.',
      variant: 'constructive',
    })

    if(clipboard.value.type == 'cut'){
      clipboard.value.directories = []
      clipboard.value.files = []
    }
    refresh()
    return
  }

  if(data.value?.result.status == 'warning'){
    toast({
      title: "Paste",
      description: 'Something went wrong.',
      variant: 'destructive',
    })
  }
}

function downloadItems(){

  let hasFile = false
  selectedItems.value.forEach((item) => {
    if (item.type != 'dir') {
        hasFile = true
        const a = document.createElement('a');
        a.download = item.path.split('/').pop() ?? '';
        a.href = route('fm.download') + `?disk=${currentDisk.value}` + `&path=${item.path}`;
        a.click();
    }
  })

  if(!hasFile){
    toast({
      title: "Download",
      description: 'Zip folders to download.',
      variant:'default'
    })
  }

}



const canAcl = computed(()=> currentFolder.value?.acl != 1)

const canAclSelection = computed(() => !selectedItems.value.some((i) => i.acl == 1))

const hasSelected = computed(()=> selectedItems.value.length ? true : false)

const oneSelected = computed(() => selectedItems.value.length == 1)

const isImage = computed(() => {
  if(selectedItems.value[0].type == 'dir')return false
  const x = selectedItems.value[0] as File
  return IMAGE_FORMATS.includes(x.extension)
})

const isVideo = computed(() => {
  if(selectedItems.value[0].type == 'dir')return false
  const x = selectedItems.value[0] as File
  return VIDEO_FORMATS.includes(x.extension)
})

const isAudio = computed(() => {
  if(selectedItems.value[0].type == 'dir')return false
  const x = selectedItems.value[0] as File
  return AUDIO_FORMATS.includes(x.extension)
})


interface MenuSections {
  [key:string]:MenuSection
}

const menuSections : MenuSections = {
  addSection: {
    key: 'add-upload',
    type:'section',
    items:[
      {
        label: "Add File",
        key: "add-file",
        icon: FilePlus2Icon,
        isActive: canAcl,
        callback: () => { currentDialog.value = NewFileDialog; showDialog.value = true }
      },
      {
        label: "Add Folder",
        key: "add-folder",
        icon: FolderPlusIcon,
        isActive: canAcl,
        callback: () => { currentDialog.value = NewFolderDialog; showDialog.value = true }
      },
      {
        label: "Upload",
        key: "upload",
        icon: UploadIcon,
        isActive: canAcl,
        callback: () => { currentDialog.value = UploadDialog; showDialog.value = true }
      }
    ]
  },
  copyCutSection: {
    key: 'copy-cut',
    type:'section',
    items: [
    {
        label: "Copy",
        key: "copy",
        icon: FilesIcon,
        isActive: computed(() => hasSelected.value && canAcl.value && canAclSelection.value )  ,
        callback: () => addItemsToClipboard('copy')
      },
      {
        label: "Cut",
        key: "cut",
        icon: ScissorsIcon,
        isActive: computed(()=> hasSelected.value && canAcl.value && canAclSelection.value ),
        callback: () => addItemsToClipboard('cut')
      },
      {
        label: "Paste",
        key: "paste",
        icon: ClipboardIcon,
        isActive: computed (()=>canAcl.value && (Boolean(clipboard.value.directories.length) ||
                                                 Boolean(clipboard.value.files.length)))  ,
        callback: pasteItems
      },
      {
        label: "Rename",
        key: "rename",
        icon: FilePenIcon,
        isActive: computed(()=> oneSelected.value && canAcl.value && canAclSelection.value ),
        callback: () => { currentDialog.value = RenameDialog; showDialog.value = true }
      },
      {
        label: "Download",
        key: "download",
        icon: DownloadIcon,
        isActive: hasSelected,
        callback: downloadItems
      },
      {
        label: "Delete",
        key: "delete",
        icon: Trash2Icon,
        isActive: computed(()=> hasSelected.value && canAcl.value && canAclSelection.value ),
        callback: () => { currentDialog.value = DeleteDialog; showDialog.value = true }
      }
    ]
  },
  zipSection: {
    key: 'zip',
    type:'section',
    items: [
      {
        label: "Zip",
        key: "zip",
        icon: FileArchiveIcon,
        isActive: computed(()=> hasSelected.value && canAcl.value ) ,
        callback: () => { currentDialog.value = ZipDialog; showDialog.value = true }
      },
      {
        label: "Unzip",
        key: "unzip",
        icon: PackageOpenIcon,
        isActive:computed(()=> {
          if(!(oneSelected.value && canAcl.value)){
            return false
          }
          if(selectedItems.value[0].type == 'dir')return false

          const x:File = selectedItems.value[0] as File;

          if(x.extension == 'zip'){
            return true
          }

          return false
        }),
        callback: () => { currentDialog.value = UnzipDialog; showDialog.value = true }
      }
    ]
  },
  properties:{
    key: 'properties',
    type:'singular',
    items:[
      {
        label: "Properties",
        key: "properties",
        icon:Settings2Icon,
        isActive: oneSelected,
        callback: () => { currentDialog.value = PropertiesDialog; showDialog.value = true }
      }
    ]
  },
  previewSection:{
    key: 'preview',
    type:'singular',
    items:[
      {
        label: "Preview",
        key: 'preview',
        icon:EyeIcon,
        isActive: computed(() => oneSelected.value && isImage.value ) ,
        callback: () => { currentDialog.value = PreviewDialog; showDialog.value = true }
      },
      {
        label: "Play",
        key: 'play',
        icon:PlayIcon,
        isActive: computed(() => oneSelected.value && (isAudio.value || isVideo.value) ) ,
        callback: () => { currentDialog.value = PreviewDialog; showDialog.value = true }
      }
    ]
  }
}


const navMenu   = ref<MenuSection[]>([menuSections.addSection, menuSections.copyCutSection, menuSections.zipSection ])
const contextMenu = ref<MenuSection[]>([menuSections.previewSection , menuSections.copyCutSection, menuSections.properties])
const contextMenuNoSelect  = ref<MenuSection[]>([menuSections.copyCutSection, menuSections.addSection])

export {
  currentDialog,
  showDialog,
  clipboard,
  addItemsToClipboard,
  pasteItems,
  downloadItems,
  navMenu,
  contextMenu,
  contextMenuNoSelect,
  IMAGE_FORMATS,
  VIDEO_FORMATS,
  AUDIO_FORMATS,
  isImage,
  isAudio,
  isVideo
}


