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
import { currentDisk } from "../../composables/useFileManagerCore";
import { selectedItems } from "../../composables/useFileManagerSelect";
import { isAudio, isImage } from "../../composables/useFileManagerActions";
import { computed } from "vue";
import { CommonOverlayWrapper } from "@matemat-cmsfly/cmsfly-core/components/common";

const item = computed(() => selectedItems.value[0]);
</script>

<template>
  <Dialog>
    <DialogTrigger as-child>
      <slot />
    </DialogTrigger>
    <DialogScrollContent>
      <CommonOverlayWrapper>
        <DialogHeader>
          <DialogTitle> Preview </DialogTitle>
          <DialogDescription> Preview media content. </DialogDescription>
        </DialogHeader>
        <div>
          <img
            v-if="isImage"
            :src="route('fm.preview', { disk: currentDisk, path: item.path })"
            class="w-full"
            alt="preview"
          />
          <audio
            v-else-if="isAudio"
            controls
            :src="
              route('fm.stream-file', { disk: currentDisk, path: item.path })
            "
            class="w-full"
          />
          <video
            v-else
            controls
            :src="
              route('fm.stream-file', { disk: currentDisk, path: item.path })
            "
          ></video>
        </div>
        <DialogFooter>
          <DialogClose as-child>
            <Button variant="secondary"> Cancel </Button>
          </DialogClose>
        </DialogFooter>
      </CommonOverlayWrapper>
    </DialogScrollContent>
  </Dialog>
</template>
