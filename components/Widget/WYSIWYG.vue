<template>
  <UModal
    :model-value="props.open"
    prevent-close
    :ui="{ base: 'md:max-w-[750px]' }"
  >
    <UCard
      :ui="{
        header: {
          padding: 'sm:py-4',
        },
      }"
    >
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="font-roboto text-xl font-medium leading-8 text-green-800">
            Buat Konten
          </h3>
          <UButton
            color="gray"
            variant="ghost"
            icon="i-heroicons-x-mark-20-solid"
            class="-my-1"
            @click="handleClose"
          />
        </div>
      </template>

      <section class="min-h-[500px]">
        <Editor v-bind="tinyMCEConfig" v-model="editorContent" />
      </section>

      <template #footer>
        <section class="flex justify-between">
          <UButton
            variant="ghost"
            color="gray"
            type="button"
            @click="handleClose"
          >
            Batalkan
          </UButton>
          <UButton type="button" @click="onSave"> Simpan </UButton>
        </section>
      </template>
    </UCard>
  </UModal>
</template>

<script setup lang="ts">
  import Editor from '@tinymce/tinymce-vue'
  import { validateImage } from '~/common/helpers/validation'
  import { z } from 'zod'

  const config = useRuntimeConfig()
  const siteStore = useSiteStore()
  const pageStore = usePageStore()
  const { $jSiteApi } = useNuxtApp()

  const props = defineProps({
    open: {
      type: Boolean,
      default: false,
    },
    sectionIndex: {
      type: Number,
      default: null,
    },
    widgetIndex: {
      type: Number,
      default: null,
    },
  })

  const tinyMCEConfig = Object.freeze({
    'api-key': config.public.tinyMceApiKey,
    init: {
      height: 500,
      placeholder: 'Tulis isi post di sini',
      language_url: '/tinymce/langs/id.js',
      language: 'id',
      skin_url: '/tinymce/skins',
      menubar: 'false',
      plugins: 'preview fullscreen lists link image media',
      toolbar: `
      undo redo | blocks | bold italic bullist numlist blockquote |
      alignleft aligncenter alignright alignjustify |
      link strikethrough indent outdent image media |
      preview fullscreen`,
      images_upload_handler: onImageUpload,
      toolbar_mode: 'sliding',
      image_caption: true,
      paste_block_drop: true,
      invalid_elements: 'div',
    },
  })

  const editorContent = ref(null)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function onImageUpload(blobInfo: any) {
    return new Promise(async (resolve, reject) => {
      try {
        await validateImage(blobInfo.blob(), {
          maxSize: 2097152, // 2MB
          maxWidth: 1024, // 1024 pixel
          maxHeight: 576, // 576 pixel
        })

        const formData = new FormData()

        formData.append('file', blobInfo.blob())
        formData.append('caption', 'wysiwyg')
        formData.append('setting_id', siteStore.siteId ?? '')

        const { data: uploadResponse, status } =
          await $jSiteApi.media.uploadMedia(formData, undefined, {
            server: false,
          })

        if (status.value === 'success') {
          const fileURL = toRaw(uploadResponse.value?.data.file.uri)
          resolve(fileURL)
        }

        if (status.value === 'error') {
          reject({
            message: `Mohon maaf, terjadi kesalahan saat proses upload gambar.
            Silakan coba beberapa saat lagi.`,
            remove: true,
          })
        }
      } catch (error) {
        // Validation error throw by Zod
        if (error instanceof z.ZodError) {
          reject({
            message: error.issues[0].message,
            remove: true,
          })
        }
      }
    })
  }

  function onSave() {
    pageStore.setWidgetPayload({
      sectionIndex: props.sectionIndex,
      widgetIndex: props.widgetIndex,
      payload: {
        content: editorContent.value,
      },
    })

    emit('close')
  }

  function handleClose() {
    const payload = pageStore.getWidgetPayload({
      sectionIndex: props.sectionIndex,
      widgetIndex: props.widgetIndex,
    })

    if (!!payload?.content) {
      editorContent.value = payload.content
    }

    emit('close')
  }

  const emit = defineEmits(['close'])
</script>
