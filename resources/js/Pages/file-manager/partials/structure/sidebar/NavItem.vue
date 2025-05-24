<script setup lang="ts">
import { FolderIcon, HardDriveIcon } from "lucide-vue-next";
import { TreeNode, TreeResponse } from "../../types";
import { ref, watch } from "vue";
import { useAppFetch } from "@matemat-cmsfly/cmsfly-core/composables/useAppFetch";
import {
  currentDisk,
  currentFolder,
  openFolder,
} from "../../composables/useFileManagerCore";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@matemat-cmsfly/cmsfly-core/components/ui/accordion";

const open = ref<string | undefined>();

const model = defineModel<TreeNode>({
  required: true,
});

const divRef = ref<HTMLElement>();

async function handleExpand(e: string | string[] | undefined) {
  if (!model.value) return;

  const overflowHiddenDiv = divRef.value?.parentNode?.parentNode
    ?.nextSibling as HTMLElement;
  if (overflowHiddenDiv) {
    if (e) {
      setTimeout(
        () => overflowHiddenDiv.classList.add("overflow-visible"),
        500,
      );
    } else {
      overflowHiddenDiv.classList.remove("overflow-visible");
    }
  }

  if (!model.value?.directories) {
    const { data } = await useAppFetch(
      route("fm.tree", { disk: currentDisk.value, path: model.value?.path }),
    ).json<TreeResponse>();
    if (data.value) {
      model.value.directories = data.value.directories;
    }
  }

  open.value = model.value.basename;
}

watch(
  currentFolder,
  (newVal) => {
    if (newVal?.path.startsWith(model.value.path)) {
      open.value = model.value.basename;
    }
  },
  { immediate: true },
);
</script>

<template>
  <Accordion v-model="open" collapsible @update:model-value="handleExpand">
    <AccordionItem :value="model.basename">
      <AccordionTrigger
        :class="[
          !model.props.hasSubdirectories && '[&>svg]:hidden',
          'rounded-md items-center px-2 py-1 overflow-hidden',
          currentFolder?.path == model.path && 'bg-accent',
        ]"
      >
        <div ref="divRef" class="text-sm flex items-center gap-2 truncate">
          <FolderIcon v-if="model.type == 'dir'" class="size-4 shrink-0" />
          <HardDriveIcon v-else class="size-4 shrink-0" />
          <span
            @click.stop="() => openFolder(model)"
            class="cursor-pointer truncate"
            >{{ model.basename }}</span
          >
        </div>
      </AccordionTrigger>
      <AccordionContent class="p-0">
        <template v-if="model.directories">
          <NavItem
            v-for="(_, index) in model.directories"
            class="ml-2"
            v-model="model.directories[index]"
          />
        </template>
      </AccordionContent>
    </AccordionItem>
  </Accordion>
</template>
