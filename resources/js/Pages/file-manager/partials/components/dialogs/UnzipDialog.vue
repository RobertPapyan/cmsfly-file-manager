<script setup lang="ts">
import { FormInput } from "@matemat-cmsfly/cmsfly-core/components/form";
import { useAppFetch } from "@matemat-cmsfly/cmsfly-core/composables/useAppFetch";
import { ref, computed } from "vue";
import { FmBaseResponse, File } from "../../types";
import {
  currentDisk,
  currentFolder,
  refresh,
  updateTreeFolder,
} from "../../composables/useFileManagerCore";
import { toast } from "vue-sonner";
import { selectedItems } from "../../composables/useFileManagerSelect";
import { InertiaFormProps } from "@inertiajs/vue3";
import { ModalForm } from "@matemat-cmsfly/cmsfly-core/components/modal";

const dialog = ref(false);

const formData = {
  name: "",
};

const item = computed(() => selectedItems.value[0] as File);

async function handleSubmit(form: InertiaFormProps<typeof formData>) {
  form.processing = true;

  const { data } = await useAppFetch(route("fm.unzip"))
    .post({
      disk: currentDisk.value,
      path: item.value.path,
      folder: form.data().name ?? null,
    })
    .json<FmBaseResponse>();

  form.processing = false;

  if (data.value?.result.status == "success") {
    dialog.value = false;
    form.reset();
    toast.success("Archive extracted");

    refresh();
    updateTreeFolder(currentFolder.value?.path!);
    return;
  }

  if (data.value?.result.status == "warning") {
    toast.error("Something went wrong");
  }
}
</script>

<template>
  <ModalForm
    v-model:open="dialog"
    title="Unzip"
    description="Unzip Archive"
    :data="formData"
    @submit-form="handleSubmit"
  >
    <slot />
    <template #form="{ bind }">
      <FormInput v-bind="bind.name" label="Extract Archive into" />
    </template>
  </ModalForm>
</template>
