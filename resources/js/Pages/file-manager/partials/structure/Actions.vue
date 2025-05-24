<script setup lang="ts">
import { Button } from "@matemat-cmsfly/cmsfly-core/components/ui/button";
import { navMenu } from "../composables/useFileManagerActions";
import { Separator } from "@matemat-cmsfly/cmsfly-core/components/ui/separator";
import {
  Tooltip,
  TooltipProvider,
  TooltipContent,
  TooltipTrigger,
} from "@matemat-cmsfly/cmsfly-core/components/ui/tooltip";
</script>

<template>
  <div class="flex flex-wrap gap-0.5 px-2 pt-2">
    <TooltipProvider disable-hoverable-content>
      <template v-for="(section, index) in navMenu">
        <Tooltip v-for="item in section.items" :key="item.key" :disabled="!item.isActive">
          <TooltipTrigger as="div">
            <component v-if="'dialog' in item" :is="item.dialog">
              <Button
                :disabled="!item.isActive"
                variant="ghost"
                size="icon"
              >
                <component :is="item.icon" />
              </Button>
            </component>
            <Button
              v-else
              :disabled="!item.isActive"
              variant="ghost"
              size="icon"
              @click="item.callback"
            >
              <component :is="item.icon" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {{ item.label }}
          </TooltipContent>
        </Tooltip>
        <div v-if="index !== navMenu.length - 1" class="px-0.5 py-1.5">
          <Separator orientation="vertical" />
        </div>
      </template>
    </TooltipProvider>
  </div>
</template>
