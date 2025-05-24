<script setup lang="ts">
import {
  Dialog,
  DialogScrollContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
  DialogTrigger,
} from "@matemat-cmsfly/cmsfly-core/components/ui/dialog";
import { Button } from "@matemat-cmsfly/cmsfly-core/components/ui/button";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "@matemat-cmsfly/cmsfly-core/components/ui/table";
import { computed, onMounted, watch, ref } from "vue";
import { selectedItems } from "../../composables/useFileManagerSelect";
import { currentDisk } from "../../composables/useFileManagerCore";
import { Directory, File, FmBaseResponse } from "../../types";
import { getFileDate } from "../../helper/date";
import { getFileSize } from "../../helper/fileSize";
import { CheckIcon, CopyIcon } from "lucide-vue-next";
import { useAppFetch } from "@matemat-cmsfly/cmsfly-core/composables/useAppFetch";
import { useClipboard } from "@vueuse/core";
import { CommonOverlayWrapper } from "@matemat-cmsfly/cmsfly-core/components/common";

const dialog = ref(false);

interface Property {
  name: string;
  value: string;
}

const item = computed<File | Directory>(() => selectedItems.value[0]);
const url = ref("");

const properties = computed<Property[]>(() => {
  if (item.value.type == "dir") {
    const x = item.value as Directory;
    return [
      { name: "Disk", value: currentDisk.value },
      { name: "Name", value: x.basename },
      { name: "Path", value: x.path },
      { name: "Modified", value: getFileDate(x.timestamp) },
      {
        name: "Access",
        value: x.acl
          ? x.acl == 1
            ? "Read"
            : "Read and Write"
          : "Read and Write",
      },
    ];
  }
  const x = item.value as File;
  return [
    { name: "Disk", value: currentDisk.value },
    { name: "Name", value: x.basename },
    { name: "Path", value: x.path },
    { name: "Size", value: getFileSize(x.size) },
    { name: "Url", value: url.value },
    { name: "Modified", value: getFileDate(x.timestamp) },
    {
      name: "Access",
      value: x.acl
        ? x.acl == 1
          ? "Read"
          : "Read and Write"
        : "Read and Write",
    },
  ];
});

const { copy, copied } = useClipboard();

interface UrlResponse extends FmBaseResponse {
  url: string;
}

async function getUrl() {
  if (item.value.type == "dir") return;

  const { data } = await useAppFetch(
    route("fm.url", { disk: currentDisk.value, path: item.value.path }),
  ).json<UrlResponse>();

  if (data.value && data.value.url) {
    url.value = data.value.url;
  }
}

onMounted(getUrl);

watch(dialog, (v) => {
  if (v) {
    getUrl();
  }
});
</script>

<template>
  <Dialog v-model:open="dialog">
    <DialogTrigger as-child>
      <slot />
    </DialogTrigger>
    <DialogScrollContent>
      <CommonOverlayWrapper class="overflow-auto">
        <DialogHeader>
          <DialogTitle> Properties </DialogTitle>
          <DialogDescription> Item properties </DialogDescription>
        </DialogHeader>
        <div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead> Property name </TableHead>

                <TableHead> Value </TableHead>

                <TableHead> </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              <TableRow class="group" v-for="prop in properties">
                <TableCell>
                  {{ prop.name }}
                </TableCell>
                <TableCell>
                  {{ prop.value }}
                </TableCell>
                <TableCell>
                  <Button
                    class="opacity-0 group-hover:opacity-100"
                    size="icon"
                    variant="ghost"
                    @click="copy(prop.value)"
                  >
                    <component :is="copied ? CheckIcon : CopyIcon" />
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
        <DialogFooter>
          <DialogClose as-child>
            <Button variant="secondary"> Close </Button>
          </DialogClose>
        </DialogFooter>
      </CommonOverlayWrapper>
    </DialogScrollContent>
  </Dialog>
</template>
