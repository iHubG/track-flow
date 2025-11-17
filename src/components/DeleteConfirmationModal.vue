<script setup lang="ts">
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const props = defineProps<{
    modelValue: boolean;
    description?: string;
}>();

const emits = defineEmits<{
    (e: "update:modelValue", value: boolean): void;
    (e: "confirm"): void;
}>();

const closeDialog = () => emits("update:modelValue", false);
const confirm = () => {
    emits("confirm");
    closeDialog();
};
</script>

<template>
    <AlertDialog :open="props.modelValue" @update:open="emits('update:modelValue', $event)">
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>

                <AlertDialogDescription>
                    This action cannot be undone.
                    {{ props.description }}
                </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
                <AlertDialogCancel @click="closeDialog">Cancel</AlertDialogCancel>
                <AlertDialogAction @click="confirm" class="bg-red-600 hover:bg-red-700">
                    Delete
                </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
</template>
