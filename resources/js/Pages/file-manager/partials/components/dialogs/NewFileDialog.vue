<script setup lang="ts">
import { FormInput } from "@matemat-cmsfly/cmsfly-core/components/form";
import { useAppFetch } from "@matemat-cmsfly/cmsfly-core/composables/useAppFetch";
import { ref } from "vue";
import { FmBaseResponse } from "../../types";
import {
  currentDisk,
  currentFolder,
  refresh,
} from "../../composables/useFileManagerCore";
import { toast } from "vue-sonner";
import { ModalForm } from "@matemat-cmsfly/cmsfly-core/components/modal";
import { InertiaFormProps } from "@inertiajs/vue3";

const dialog = ref(false)

const formData = {
  name:''
}

async function handleSubmit(form: InertiaFormProps<typeof formData>) {
  if(!currentFolder.value)return
  form.processing = true

  const { data } = await useAppFetch(route("fm.create-file"))
    .post({
      disk: currentDisk.value,
      path: currentFolder.value.path,
      name: form.data().name,
    })
    .json<FmBaseResponse>();

  form.processing = false;

  if (data.value?.result.status == "success") {
    form.reset()
    dialog.value = false;
    toast.success("File created");

    refresh();
    return;
  }

  if (data.value?.result.status == "warning") {
    toast.error(data.value.result.message == "fileExist" ? "File with this name already exists" : "Something went wrong")
  }
}
</script>

<template>
  <ModalForm
    v-model:open="dialog"
    title="Create New File"
    description="Create new file in current directory"
    :data="formData"
    @submit-form="handleSubmit"
    >
      <slot />
      <template #form="{ bind }">
        <FormInput
            v-bind="bind.name"
            label="File name"
            required
          />
      </template>
  </ModalForm>
</template>
