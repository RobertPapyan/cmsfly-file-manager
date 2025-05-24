import { ref, watch } from "vue";
import {
  Config,
  Content,
  ContentResponse,
  Directory,
  FmBaseResponse,
  TreeNode,
  TreeResponse,
} from "../types";
import { useAppFetch } from "@matemat-cmsfly/cmsfly-core/composables/useAppFetch";
import { sortContent } from "./useFileManagerSort";
import { watchDebounced } from "@vueuse/core";

const config = ref<Config>({
  acl: false,
  hiddenFiles: false,
  disks: {},
});

const currentDisk = ref("");
const disklist = ref<string[]>([]);
const currentFolder = ref<Directory>();

const content = ref<Content>({
  files: [],
  directories: [],
});
const contentLoading = ref(false);
const fmView = ref<"table" | "grid">("table");

const rootFolderSkeleton: TreeNode = {
  basename: "",
  dirname: "",
  path: "",
  timestamp: 0,
  type: "disk",
  visibility: "public",
  directories: [],
  props: { hasSubdirectories: false },
};

const search = ref("");
const isSearch = ref(false);

watchDebounced(
  search,
  (s) => {
    if (s) {
      getContent(currentDisk.value, "", s);
    } else {
      getContent(currentDisk.value, currentFolder.value?.path);
    }
  },
  { debounce: 500, maxWait: 1000 },
);

const tree = ref(rootFolderSkeleton);

async function initFileManager() {
  const { data } = await useAppFetch(route("fm.initialize")).json();

  if (data.value && data.value.config) {
    config.value.acl = data.value.config.acl;
    config.value.hiddenFiles = data.value.config.hiddenFiles;
    config.value.disks = data.value.config.disks;
  }
  disklist.value = Object.keys(config.value.disks);
  currentDisk.value = disklist.value[0] ?? "";

  if (!currentDisk.value) return;
  currentFolder.value = tree.value;
  getContent(currentDisk.value);
  getTree(currentDisk.value);
}

async function getContent(disk = "public", path = "", search = "") {

    if (!disklist.value.includes(disk)) return;
    contentLoading.value = true;

    let request;
    if (search) {
      isSearch.value = true;
      request = await useAppFetch(
        route("fm.search", { disk: disk, search: search }),
      ).json<ContentResponse>();
    } else {
      isSearch.value = false;
      request = await useAppFetch(
        route("fm.content", { disk: disk, path: path }),
      ).json<ContentResponse>();
    }
    const { data } = request;

    contentLoading.value = false;
    if (data.value) {
      content.value.directories = data.value.directories;
      content.value.files = data.value.files;
      sortContent(content);
      return true
    }
    return false
}

async function getTree(disk = "public", path = "") {
  if (!disklist.value.includes(disk)) return;
  const { data } = await useAppFetch(
    route("fm.tree", { disk: disk, path: path }),
  ).json<TreeResponse>();
  if (data.value) {
    tree.value.basename = disk;
    tree.value.directories = data.value.directories;
    tree.value.props.hasSubdirectories = !!data.value.directories?.length;
  }
}

async function changeDisk(value: string) {
  if (value == currentDisk.value) return;
  const { data } = await useAppFetch(
    route("fm.select-disk", { disk: value }),
  ).json<FmBaseResponse>();

  if (data.value?.result.status == "success") {
    currentDisk.value = value;
    getContent(currentDisk.value);
    getTree(currentDisk.value);
  }
}

function refresh() {
  getContent(currentDisk.value, currentFolder.value?.path);
}

async function openFolder(folder: Directory = rootFolderSkeleton) {
  if (folder.path == currentFolder.value?.path && !isSearch.value) return;
  const contentBackup = content.value;
  const result = await getContent(currentDisk.value, folder.path);
  if (result) {
    currentFolder.value = folder;
    buildTree(tree.value, folder.path);

    return;
  }
  content.value = contentBackup;
}

async function openFolderByPath(path: string) {
  if (path == currentFolder.value?.path && !isSearch.value) return;
  const treeResult = await buildTree(tree.value, path);
  if (!treeResult) return;
  const folder = findFolderInTree(path);
  if (folder) openFolder(folder);
}

function findFolderInTree(
  path: string,
  node: TreeNode = tree.value,
): TreeNode | null {
  if (path == node.path) {
    return node;
  }

  if (!node.directories) {
    return null;
  }

  for (let item of node.directories) {
    if (item.directories) {
      const result = findFolderInTree(path, item);

      if (!(result == null)) {
        return result;
      }
    }
  }

  return null;
}

async function buildTree(node: TreeNode, path: string): Promise<boolean> {
  if (!node.directories || !node.directories.length) {
    const { data } = await useAppFetch(
      route("fm.tree", { disk: currentDisk.value, path: node.path }),
    ).json<TreeResponse>();

    if (data.value) {
      node.directories = data.value.directories;
    } else {
      return false;
    }
  }

  if (node.path === path) {
    return true;
  }

  const item = node.directories.find((i) => path.startsWith(i.path));

  if (!item) {
    return false;
  }

  return await buildTree(item, path);
}

async function updateTreeFolder(path: string) {
  const folder = findFolderInTree(path);
  if (!folder) return;

  const { data } = await useAppFetch(
    route("fm.tree", { disk: currentDisk.value, path: path }),
  ).json<TreeResponse>();

  if (data.value) {
    folder.directories = data.value.directories;

    folder.directories.length
      ? (folder.props.hasSubdirectories = true)
      : (folder.props.hasSubdirectories = false);
  }
}

export {
  tree,
  currentDisk,
  disklist,
  currentFolder,
  content,
  contentLoading,
  search,
  isSearch,
  fmView,
  config,
  initFileManager,
  changeDisk,
  openFolder,
  openFolderByPath,
  refresh,
  findFolderInTree,
  updateTreeFolder,
};
