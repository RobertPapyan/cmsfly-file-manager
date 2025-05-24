<script setup lang="ts">
import { FormInput } from "@matemat-cmsfly/cmsfly-core/components/form";
import { useAppFetch } from "@matemat-cmsfly/cmsfly-core/composables/useAppFetch";
import { ref } from "vue";
import { FmBaseResponse } from "../../types";
import {
  currentDisk,
  currentFolder,
  refresh,
  updateTreeFolder,
} from "../../composables/useFileManagerCore";
import { toast } from "vue-sonner";
import { ModalForm } from "@matemat-cmsfly/cmsfly-core/components/modal";
import { InertiaFormProps } from "@inertiajs/vue3";

const dialog = ref(false);

const formData = {
  name: "",
};

async function handleSubmit(form: InertiaFormProps<typeof formData>) {
  if (!currentFolder.value) return;
  form.processing = true;

  const { data } = await useAppFetch(route("fm.create-directory"))
    .post({
      disk: currentDisk.value,
      path: currentFolder.value.path,
      name: form.data().name,
    })
    .json<FmBaseResponse>();

  form.processing = false;

  if (data.value?.result.status == "success") {
    form.reset();
    dialog.value = false;
    toast.success("Folder created");

    refresh();
    updateTreeFolder(currentFolder.value.path);
    return;
  }

  if (data.value?.result.status == "warning") {
    toast.error(
      data.value.result.message == "dirExist"
        ? "Folder with this name already exists"
        : "Something went wrong",
    );
  }
}
</script>

<template>
  <ModalForm
    v-model:open="dialog"
    title="Create New Folder"
    description="Create new folder in current directory"
    :data="formData"
    @submit-form="handleSubmit"
  >
    <slot />

    <template #form="{ bind }">
      <FormInput v-bind="bind.name" label="Folder name" required />
    </template>
  </ModalForm>
</template>
