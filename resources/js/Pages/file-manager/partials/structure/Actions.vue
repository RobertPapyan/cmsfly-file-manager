<script setup lang="ts">
import { Button } from '@matemat-cmsfly/cmsfly-core/components/ui/button';
import { navMenu } from '../composables/useFileManagerActions';
import { Separator } from '@matemat-cmsfly/cmsfly-core/components/ui/separator';
import { Tooltip, TooltipProvider, TooltipContent, TooltipTrigger } from '@matemat-cmsfly/cmsfly-core/components/ui/tooltip';
</script>

<template>
  <div class="flex flex-wrap gap-0.5 px-1 pt-1">
    <template v-for="(section, index) in navMenu">
      <template v-for="item in section.items">
        <TooltipProvider>
          <Tooltip  >
              <TooltipTrigger as-child>
                  <Button
                    :disabled="!item.isActive"
                    variant="ghost"
                    size="sm"
                    class="px-2"
                    @click="item.callback"
                  >
                    <component :is="item.icon" />
                    <span class="sm:hidden">{{ item.label }}</span>
                  </Button>
              </TooltipTrigger>
              <TooltipContent class="hidden sm:block">
                  <span>{{ item.label }}</span>
              </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </template>
      <div v-if="index !== navMenu.length - 1" class="px-0.5 py-1.5">
                  <Separator orientation="vertical" />
      </div>
    </template>
  </div>
</template>
