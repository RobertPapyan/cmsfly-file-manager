<script setup lang="ts">
import { Table, TableBody, TableHeader, TableHead, TableRow } from '@matemat-cmsfly/cmsfly-core/components/ui/table';
import { Button } from '@matemat-cmsfly/cmsfly-core/components/ui/button';
import { ArrowUpNarrowWideIcon, ArrowDownWideNarrowIcon, ChevronsUpDownIcon, SquareMousePointerIcon } from 'lucide-vue-next';
import { fmSort, sortContent } from '../../composables/useFileManagerSort';
import { SortOption } from '../../types';
import { content, isSearch } from '../../composables/useFileManagerCore';
import { dropSelection, selectAll, selectedItems } from '../../composables/useFileManagerSelect';

const getSortIcon = (column: SortOption) => {

  if(fmSort.value.by != column)   return ChevronsUpDownIcon;

  if (fmSort.value.direction === "asc") return ArrowDownWideNarrowIcon;
  if (fmSort.value.direction === "desc") return ArrowUpNarrowWideIcon;

};

function handleSort(by:SortOption){
  sortContent(content,by)
}

function handleSelectAll(){
  if(selectedItems.value.length == content.value.directories.length + content.value.files.length){
    dropSelection()
    return
  }
  selectAll(content.value)
}

</script>

<template>
  <Table>
      <TableHeader>
        <TableRow>
          <TableHead width="44">
              <Button class="px-1.5" size="xs" variant="ghost" @click="handleSelectAll">
                <SquareMousePointerIcon />
              </Button>
          </TableHead>

          <TableHead >
              <Button
                size="xs"
                class="capitalize"
                variant="ghost"
                @click="handleSort('name')"
              >
                Name
                <component :is="getSortIcon('name')" />
              </Button>

            </TableHead>
            <TableHead v-if="isSearch">
              <Button
                size="xs"
                class="capitalize"
                variant="ghost"
                @click="handleSort('path')"
              >
                Path
                <component :is="getSortIcon('path')" />
              </Button>

            </TableHead>
            <TableHead >
              <Button
                size="xs"
                class="capitalize"
                variant="ghost"
                 @click="handleSort('date')"
              >
                Date
                <component :is="getSortIcon('date')" />
              </Button>

            </TableHead>
            <TableHead >
              <span  >
                Type
              </span>

            </TableHead>
            <TableHead >
              <Button
                size="xs"
                class="capitalize"
                variant="ghost"
                 @click="handleSort('size')"
              >
                Size
                <component :is="getSortIcon('size')" />
              </Button>

            </TableHead>

        </TableRow>
      </TableHeader>

      <TableBody>
        <slot></slot>
      </TableBody>
  </Table>
</template>