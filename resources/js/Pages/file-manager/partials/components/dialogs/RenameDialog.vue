<script setup lang="ts">
import { ModalForm } from "@matemat-cmsfly/cmsfly-core/components/modal";
import { FormInput } from "@matemat-cmsfly/cmsfly-core/components/form";
import { useAppFetch } from "@matemat-cmsfly/cmsfly-core/composables/useAppFetch";
import { onMounted, watch, computed, ref } from "vue";
import { FmBaseResponse, File, Directory } from "../../types";
import {
  currentDisk,
  currentFolder,
  refresh,
} from "../../composables/useFileManagerCore";
import { toast } from "vue-sonner";
import { dropSelection, selectedItems } from "../../composables/useFileManagerSelect";
import { InertiaFormProps } from "@inertiajs/vue3";

const dialog = ref(false);

const description = computed(() => item.value?.type == 'dir' ? 'Rename folder' : 'Rename file' )

const formData = {
  name:''
}

const item = computed<File | Directory>({
  get() {
    return selectedItems.value[0];
  },
  set() {},
});

watch(dialog, () => {
  formData.name = item.value?.basename;
}, { immediate:true });

async function handleSubmit(form: InertiaFormProps<typeof formData>) {
  if(!currentFolder.value)return
  form.processing = true;

  const { data } = await useAppFetch(route("fm.rename"))
    .post({
      disk: currentDisk.value,
      newName: currentFolder.value
        ? currentFolder.value.path + "/" + form.data().name
        : form.data().name,
      oldName: currentFolder.value
        ? currentFolder.value.path + "/" + item.value.basename
        : item.value.basename,
      type: item.value.type,
    })
    .json<FmBaseResponse>();

  form.processing = false;

  if (data.value?.result.status == "success") {
    form.reset()
    dialog.value = false;

    toast.success("Item renamed");

    dropSelection();
    refresh();
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
    title="Rename"
    :description="description"
    :data="formData"
    @submit-form="handleSubmit"
  >
    <slot />

    <template #form="{ bind }">
      <FormInput
        v-bind="bind.name"
        :label="item?.type == 'file' ? 'File name' : 'Folder name'"
        required
      />
    </template>

  </ModalForm>
</template>
