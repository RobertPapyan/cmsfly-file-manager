<script setup lang="ts">
import { useAppFetch } from "@matemat-cmsfly/cmsfly-core/composables/useAppFetch";
import { ref, onMounted, watch, computed } from "vue";
import { FmBaseResponse, File, Directory } from "../../types";
import {
  currentDisk,
  currentFolder,
  refresh,
} from "../../composables/useFileManagerCore";
import { toast } from "vue-sonner";
import {
  dropSelection,
  selectedItems,
} from "../../composables/useFileManagerSelect";
import { FormInput } from "@matemat-cmsfly/cmsfly-core/components/form";
import { ModalForm } from "@matemat-cmsfly/cmsfly-core/components/modal";
import { InertiaFormProps } from "@inertiajs/vue3";
import FmBasicTable from "../../structure/content/FmBasicTable.vue";

const dialog = ref(false);
const items = ref<(Directory | File)[]>([]);
const description = computed(
  () => "Archive " + selectedItems.value.length + " items",
);

const formData = {
  name: "",
};

watch(dialog, () => {
  items.value = selectedItems.value.map((i) => i);
});
onMounted(() => {
  items.value = selectedItems.value.map((i) => i);
});

async function handleSubmit(form: InertiaFormProps<typeof formData>) {
  if(!currentFolder.value)return
  form.processing = true;
  const { data } = await useAppFetch(route("fm.zip"))
    .post({
      name: form.data().name.endsWith(".zip")
        ? form.data().name
        : form.data().name + ".zip",
      path: currentFolder.value?.path ?? "",
      disk: currentDisk.value,
      elements: {
        directories: selectedItems.value
          .filter((i) => i.type == "dir")
          .map((i) => i.path),
        files: selectedItems.value
          .filter((i) => i.type == "file")
          .map((i) => i.path),
      },
    })
    .json<FmBaseResponse>();

  form.processing = false;

  if (data.value?.result.status == "success") {
    dialog.value = false;

    toast.success("Archive created");

    dropSelection();
    refresh();
    return;
  }

  if (data.value?.result.status == "warning") {
    toast.error(
      data.value.result.message == "zipError"
        ? "Could not zip selected items"
        : "Something went wrong",
    );
  }
}
</script>

<template>
  <ModalForm
    v-model:open="dialog"
    title="Rename"
    :description="description"
    :data="formData"
    @submit-form="handleSubmit"
  >
    <slot />

    <template #form="{ bind }">
      <FormInput v-bind="bind.name" label="Archive name" required />
      <FmBasicTable :items="items" />
    </template>
  </ModalForm>
</template>
