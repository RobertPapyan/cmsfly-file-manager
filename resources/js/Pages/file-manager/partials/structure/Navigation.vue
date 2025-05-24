<script setup lang="ts">
import {
  FolderIcon,
  HardDriveIcon,
  HomeIcon,
  LayoutGridIcon,
  ListIcon,
  MoveLeftIcon,
  MoveRightIcon,
  MoveUpIcon,
  RefreshCcwIcon,
} from "lucide-vue-next";
import { Button } from "@matemat-cmsfly/cmsfly-core/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@matemat-cmsfly/cmsfly-core/components/ui/select";
import { CommonSearch } from "@matemat-cmsfly/cmsfly-core/components/common";
import {
  currentDisk,
  disklist,
  changeDisk,
  currentFolder,
  openFolder,
  openFolderByPath,
  fmView,
  isSearch,
  search,
  refresh,
} from "../composables/useFileManagerCore";
import {
  goBack,
  goForward,
  toParent,
} from "../composables/useFileManagerNavigation";
</script>

<template>
  <div class="flex items-center flex-wrap gap-2 p-2 border-b">
    <Select
      :model-value="currentDisk"
      @update:model-value="changeDisk($event as string)"
    >
      <SelectTrigger class="w-auto" size="sm">
        <HardDriveIcon />
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem v-for="disk in disklist" :key="disk" :value="disk">
          {{ disk }}
        </SelectItem>
      </SelectContent>
    </Select>
    <Button
      @click="
        () =>
          (currentFolder && currentFolder?.type != 'disk') || isSearch
            ? openFolder()
            : ''
      "
      size="sm"
      variant="outline"
    >
      <HomeIcon />
      Home
    </Button>
    <Button size="icon" variant="outline" @click="goBack">
      <MoveLeftIcon />
    </Button>
    <Button size="icon" variant="outline" @click="goForward">
      <MoveRightIcon />
    </Button>
    <Button size="icon" variant="outline" @click="toParent">
      <MoveUpIcon />
    </Button>

    <Button class="flex-1 justify-start" as="div" variant="outline" size="sm">
      <FolderIcon />
      <div class="cursor-pointer">
        <span
          class="hover:underline"
          @click="
            () =>
              (currentFolder && currentFolder?.type != 'disk') || isSearch
                ? openFolder()
                : ''
          "
        >
          {{ currentDisk }}://</span
        >
        <template
          v-if="currentFolder && currentFolder.path"
          v-for="(part, index) in currentFolder.path.split('/')"
        >
          <span
            @click="
              openFolderByPath(
                currentFolder.path
                  .split('/')
                  .slice(0, index + 1)
                  .join('/'),
              )
            "
            class="cursor-pointer hover:underline"
            >{{ part }}</span
          >
          <span>/</span>
        </template>
      </div>
      <Button
        class="size-6 ms-auto"
        size="icon"
        variant="secondary"
        @click="refresh"
      >
        <RefreshCcwIcon />
      </Button>
    </Button>
    <div>
      <CommonSearch input-class="h-9 rounded-md" v-model="search" />
    </div>
    <Button
      size="icon"
      variant="outline"
      @click="fmView = fmView == 'table' ? 'grid' : 'table'"
    >
      <component :is="fmView == 'table' ? ListIcon : LayoutGridIcon" />
    </Button>
  </div>
</template>
