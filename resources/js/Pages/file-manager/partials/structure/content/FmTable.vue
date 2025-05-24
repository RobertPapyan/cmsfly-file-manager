<script setup lang="ts">
import {
  Table,
  TableBody,
  TableHeader,
  TableHead,
  TableRow,
} from "@matemat-cmsfly/cmsfly-core/components/ui/table";
import { Button } from "@matemat-cmsfly/cmsfly-core/components/ui/button";
import {
  ArrowUpNarrowWideIcon,
  ArrowDownWideNarrowIcon,
  ChevronsUpDownIcon,
} from "lucide-vue-next";
import { fmSort, sortContent } from "../../composables/useFileManagerSort";
import { SortOption } from "../../types";
import { content, isSearch } from "../../composables/useFileManagerCore";
import { selectedItems } from "../../composables/useFileManagerSelect";
import { Checkbox } from "@matemat-cmsfly/cmsfly-core/components/ui/checkbox";
import { computed } from "vue";

const getSortIcon = (column: SortOption) => {
  if (fmSort.value.by != column) return ChevronsUpDownIcon;

  if (fmSort.value.direction === "asc") return ArrowDownWideNarrowIcon;
  if (fmSort.value.direction === "desc") return ArrowUpNarrowWideIcon;
};

function handleSort(by: SortOption) {
  sortContent(content, by);
}

const data = computed(() => [
  ...content.value.directories,
  ...content.value.files,
]);
</script>

<template>
  <Table>
    <TableHeader class="before:rounded-none">
      <TableRow>
        <TableHead>
          <Checkbox
            class="block bg-background"
            :model-value="data.every((item) => selectedItems!.includes(item))"
            @update:model-value="selectedItems = $event ? [...data] : []"
          />
        </TableHead>

        <TableHead>
          <Button size="sm" variant="secondary" @click="handleSort('name')">
            Name
            <component
              :is="getSortIcon('name')"
              class="size-3 text-muted-foreground"
            />
          </Button>
        </TableHead>
        <TableHead v-if="isSearch">
          <Button size="sm" variant="secondary" @click="handleSort('path')">
            Path
            <component
              :is="getSortIcon('path')"
              class="size-3 text-muted-foreground"
            />
          </Button>
        </TableHead>
        <TableHead>
          <Button size="sm" variant="secondary" @click="handleSort('date')">
            Date
            <component
              :is="getSortIcon('date')"
              class="size-3 text-muted-foreground"
            />
          </Button>
        </TableHead>
        <TableHead> Type </TableHead>
        <TableHead>
          <Button size="sm" variant="secondary" @click="handleSort('size')">
            Size
            <component
              :is="getSortIcon('size')"
              class="size-3 text-muted-foreground"
            />
          </Button>
        </TableHead>
      </TableRow>
    </TableHeader>

    <TableBody>
      <slot></slot>
    </TableBody>
  </Table>
</template>
