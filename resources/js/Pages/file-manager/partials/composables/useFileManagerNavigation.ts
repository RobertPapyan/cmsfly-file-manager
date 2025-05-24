import { Directory } from "../types";
import {
  tree,
  currentFolder,
  openFolder,
  findFolderInTree,
} from "./useFileManagerCore";
import { ref, watch } from "vue";

interface ListNode {
  directory: Directory;
  next: ListNode | null;
  prev: ListNode | null;
}

const tail: ListNode = {
  directory: tree.value,
  next: null,
  prev: null,
};

let head = tail;

let dontTrack = false;

const fmView = ref<"table" | "grid">("table");

watch(currentFolder, (newValue) => {
  if (dontTrack) {
    dontTrack = false;
    return;
  }

  if (!newValue) return;
  if (newValue.path == head.directory.path) return;
  head.next = {
    directory: newValue,
    next: null,
    prev: head,
  };
  head = head.next;
});

watch(
  () => tree.value.basename,
  (newVal) => {
    if (newVal != tail.directory.basename) {
      tail.directory = tree.value;
      tail.next = null;
      head = tail;
    }
  },
);

function goBack() {
  if (!head.prev) return;
  head = head.prev;
  dontTrack = true;
  openFolder(head.directory);
}
function goForward() {
  if (!head.next) return;
  head = head.next;
  dontTrack = true;
  openFolder(head.directory);
}
function toParent() {
  if (!currentFolder.value) return;
  let parentPath = currentFolder.value.path.split("/");
  parentPath.pop();

  const parentFolder = findFolderInTree(parentPath.join("/"), tree.value);
  if (parentFolder) {
    openFolder(parentFolder);
  }
}

export { goBack, goForward, toParent, fmView };
