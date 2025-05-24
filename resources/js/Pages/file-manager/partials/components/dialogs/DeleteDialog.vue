<script setup lang="ts">
import { useAppFetch } from "@matemat-cmsfly/cmsfly-core/composables/useAppFetch";
import { ref, onMounted, watch, computed } from "vue";
import { FmBaseResponse, File, Directory } from "../../types";
import {
  currentDisk,
  currentFolder,
  refresh,
  updateTreeFolder,
} from "../../composables/useFileManagerCore";

import { toast } from "vue-sonner";
import {
  dropSelection,
  selectedItems,
} from "../../composables/useFileManagerSelect";
import { ModalForm } from "@matemat-cmsfly/cmsfly-core/components/modal";
import FmBasicTable from "../../structure/content/FmBasicTable.vue";
import { InertiaFormProps } from "@inertiajs/vue3";
import { Button } from "@matemat-cmsfly/cmsfly-core/components/ui/button";
import { Trash2Icon } from "lucide-vue-next";


const items = ref<(Directory | File)[]>([]);

const dialog = ref(false);

const description = computed(() => 'Delete ' + selectedItems.value.length + ' items')

const formData = {}

watch(dialog, () => {
  items.value = selectedItems.value.map((i) => i);
});
onMounted(() => {
  items.value = selectedItems.value.map((i) => i);
});

async function handleSubmit(form: InertiaFormProps<typeof formData>) {
  form.processing = true;

  if(!selectedItems.value.length){
    dialog.value = false
    return
  }

  const { data } = await useAppFetch(route("fm.delete"))
    .post({
      disk: currentDisk.value,
      items: selectedItems.value.map((i) => {
        return { path: i.path, type: i.type };
      }),
    })
    .json<FmBaseResponse>();

  form.processing = false;

  if (data.value?.result.status == "success") {
    dialog.value = false;
    const itemsCount = selectedItems.value.length;
    toast.success(`${itemsCount} item(s) deleted.`);

    dropSelection()
    refresh();
    updateTreeFolder(currentFolder.value?.path!)
    return;
  }

  if (data.value?.result.status == "error") {
    toast.error(data.value.result.message == "aclError" ? "You have no permission!" : "Something went wrong")
  }
}

</script>

<template>
 <ModalForm
    v-model:open="dialog"
    title="Delete"
    :description="description"
    :data="formData"
    @submit-form="handleSubmit"
  >
    <slot />

    <template #form>
      <FmBasicTable
        :items="items"
      />
    </template>

    <template #confirm>
      <Button variant="destructive">
        <Trash2Icon />
        Delete
      </Button>
    </template>
  </ModalForm>
</template>
