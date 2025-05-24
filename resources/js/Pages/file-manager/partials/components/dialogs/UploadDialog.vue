<script setup lang="ts">
import { ModalForm } from "@matemat-cmsfly/cmsfly-core/components/modal";
import {
  FormDropzone,
  FormCheckbox,
} from "@matemat-cmsfly/cmsfly-core/components/form";
import { useAppFetch } from "@matemat-cmsfly/cmsfly-core/composables/useAppFetch";
import { ref } from "vue";
import { FmBaseResponse } from "../../types";
import {
  currentDisk,
  currentFolder,
  refresh,
} from "../../composables/useFileManagerCore";

import { toast } from "vue-sonner";
import { InertiaFormProps } from "@inertiajs/vue3";

const dialog = ref(false);

const data = {
  files: [],
  overwrite: false,
};

async function handleSubmit(form: InertiaFormProps<typeof data>) {
  if (!form.data().files.length || !currentFolder.value) return;
  form.processing = true;

  let formData = new FormData();
  form.data().files.map((file) => formData.append("files[]", file));
  formData.append("disk", currentDisk.value);
  formData.append("path", currentFolder.value.path ?? "");
  formData.append("overwrite", form.data().overwrite ? "1" : "0");

  const { data } = await useAppFetch(route("fm.upload"))
    .post(formData)
    .json<FmBaseResponse>();

  form.processing = false;

  if (data.value?.result.status == "success") {
    form.reset();
    dialog.value = false;
    toast.success("Files uploaded");

    refresh();
    return;
  }

  if (data.value?.result.status == "warning") {
    toast.error(
      data.value.result.message == "notAllUploaded"
        ? "Could not upload all selected files"
        : "Something went wrong",
    );
  }
}
</script>

<template>
  <ModalForm
    v-model:open="dialog"
    title="Upload"
    description="Upload files into current directory"
    :data="data"
    @submit-form="handleSubmit"
  >
    <slot />

    <template #form="{ bind }">
      <FormDropzone v-bind="bind.files" accept="*" placeholder="Upload files" />
      <FormCheckbox
        v-bind="bind.overwrite"
        label="Overwrite existing files"
        class="mt-4"
      />
    </template>
  </ModalForm>
</template>
