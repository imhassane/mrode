<template>
  <div class="fixed top-0 left-0 w-full h-full z-50 overflow-auto bg-gray-200 flex">
    <div class="relative p-8 bg-white w-full max-w-md m-auto flex-col flex">
      <slot></slot>
    </div>
    <span class="absolute pin-t pin-b pin-r p-4" @click="onClose">
      <svg class="h-12 w-12 fill-current text-grey hover:text-grey-darkest"
           role="button" xmlns="http://www.w3.org/2000/svg"
           viewBox="0 0 20 20"
      >
        <title>Close</title>
        <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/>
      </svg>
    </span>
  </div>
</template>

<script>
export default {
  name: "mlm-modal",
  props: ["onClose"]
}
</script>
