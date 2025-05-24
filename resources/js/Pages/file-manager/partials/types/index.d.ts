import { LucideIcon } from "lucide-vue-next";
import { Component, Ref } from "vue";

type ContentTypes = 'file' | 'dir' | 'disk'

interface MenuItemDialog {
  label: string
  key: string
  icon: LucideIcon
  isActive: boolean | Ref<boolean>
  dialog: Component
}

interface MenuItemCallback {
  label: string
  key: string
  icon: LucideIcon
  isActive: boolean | Ref<boolean>
  callback: () => void
}

interface MenuSection {
  key: string
  type: "section" | "singular"
  items: (MenuItemCallback | MenuItemDialog)[]
}

interface Config {
  acl: boolean
  hiddenFiles: boolean
  disks: object
}

interface Content {
  directories: Directory[]
  files: File[]
}

interface FmResult {
  status: string
  message: string
}

interface File {
  basename: string
  dirname: string
  extension: string
  filename: string
  path: string
  size: number
  timestamp: number
  type: ContentTypes
  visibility: string
  acl?: number
}

interface Directory {
  basename: string
  dirname: string
  path: string
  timestamp: number
  type: ContentTypes
  visibility: string
  acl?: number
}

interface TreeNode extends Directory {
  props: {
    hasSubdirectories: boolean
  }
  directories?: TreeNode[]
}

interface FmBaseResponse {
  result: {
    status: string
    message: string | null
  };
}

interface ContentResponse extends FmBaseResponse {
  directories: Directory[]
  files: File[]
}

interface TreeResponse extends FmBaseResponse {
  directories: TreeNode[]
}

interface Sort {
  by: SortOption
  direction: "asc" | "desc"
}

type SortOption = "name" | "date" | "size" | "path"

interface Clipboard {
  directories: string[]
  files: string[]
  disk: string
  type: "copy" | "cut"
}
