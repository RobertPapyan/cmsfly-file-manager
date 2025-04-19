<script setup lang="ts">
import { FolderIcon, HardDriveIcon, HomeIcon, LayoutGridIcon, ListIcon, MoveLeftIcon, MoveRightIcon, MoveUpIcon, RefreshCcwIcon } from 'lucide-vue-next';
import { Button } from '@matemat-cmsfly/cmsfly-core/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@matemat-cmsfly/cmsfly-core/components/ui/select';
import { CommonSearch } from '@matemat-cmsfly/cmsfly-core/components/common';
import { currentDisk, disklist, changeDisk, currentFolder, openFolder, openFolderByPath, fmView, isSearch, search, refresh } from '../composables/useFileManagerCore';
import { goBack,goForward,toParent } from '../composables/useFileManagerNavigation';


</script>

<template>
  <div class="flex items-center flex-wrap gap-2 p-2 border-b">
    <Select
        :model-value="currentDisk"
        @update:model-value="changeDisk($event as string)"
      >
        <SelectTrigger class="bg-background h-8 w-auto gap-2">
          <HardDriveIcon class="size-4"/>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem v-for="disk in disklist" :key="disk" :value="disk">
            {{ disk }}
          </SelectItem>
        </SelectContent>
    </Select>
    <Button
      @click="() => (currentFolder && currentFolder?.type != 'disk') || isSearch ? openFolder() : ''"
      size="sm"
      variant="outline"
    >
        <HomeIcon/>
        <span>Home</span>
    </Button>
    <Button
      class="px-2"
      @click="goBack"
      size="sm"
      variant="outline"
    >
        <MoveLeftIcon/>
    </Button>
    <Button
      class="px-2"
      @click="goForward"
      size="sm"
      variant="outline"
    >
        <MoveRightIcon/>
    </Button>
    <Button
      class="px-2"
      @click="toParent"
      size="sm"
      variant="outline"
    >
        <MoveUpIcon/>
    </Button>

    <div class="flex gap-2 justify-between grow items-center p-2 h-8 border rounded-md ">
      <div class="flex gap-2 items-center ">
        <FolderIcon class="w-4 text-sidebar-foreground"/>
        <span class="text-xs cursor-pointer" >
          <span class="hover:underline" @click="() => (currentFolder && currentFolder?.type != 'disk') || isSearch ? openFolder() : ''">
            {{currentDisk}}://</span>
          <template v-if="currentFolder && currentFolder.path" v-for="(part,index) in currentFolder.path.split('/')">
            <span @click="openFolderByPath(currentFolder.path.split('/').slice(0,index+1).join('/'))" class="cursor-pointer hover:underline">{{ part }}</span>
            <span>/</span>
          </template>

        </span>
      </div>

      <Button
        class="p-1 h-6"
        size="sm"
        variant="ghost"
        @click="refresh"
      >
        <RefreshCcwIcon />
      </Button>
    </div>
    <div>
      <CommonSearch  class="sm:max-w-xs w-auto h-8" v-model="search" />
    </div>
    <Button
    class="px-2"

      size="sm"
      variant="outline"
      @click="fmView = fmView == 'table' ? 'grid': 'table'"
    >
        <ListIcon v-if="fmView == 'table'"/>
        <LayoutGridIcon v-else />
    </Button>

  </div>
</template>