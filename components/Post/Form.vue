<template>
  <section class="grid grid-cols-[1fr,364px] gap-2.5">
    <div class="grid grid-cols-1 gap-y-2.5">
      <div class="rounded-lg bg-white p-[14px]">
        <p
          class="mb-[14px] font-roboto text-base font-medium leading-6 text-green-700"
        >
          Judul
        </p>
        <UFormGroup>
          <UTextarea
            v-model="title"
            :rows="2"
            placeholder="Masukkan judul berita"
            maxlength="255"
          />
          <template #help>
            <span class="font-lato text-xs text-gray-600">
              Tersisa {{ 255 - title.length }} Karakter
            </span>
          </template>
        </UFormGroup>
      </div>

      <div class="rounded-lg bg-white p-[14px]">
        <p class="font-roboto text-base font-medium leading-6 text-green-700">
          Gambar Utama
        </p>
        <p class="mb-[14px] font-lato text-sm text-gray-800">
          Ukuran maksimal file adalah 1 MB dengan resolusi 1080 x 720 . File
          yang didukung adalah .jpg dan .png
        </p>

        <!-- Image Dropzone -->
        <UFormGroup :error="dropzoneErrorMessages.length > 0">
          <BaseDropzone
            accept="image/jpeg, image/jpg, image/png, image/webp"
            :disabled="!!image.id || isDropzoneUploading"
            @change="handleImageChange"
            @clear="handleDeleteImage"
          >
            <template
              v-if="!!image.id && !isDropzoneUploading"
              #preview="{ clear }"
            >
              <div
                class="mt-4 flex h-10 w-full max-w-[400px] items-center justify-between rounded-lg border border-gray-400 px-4"
              >
                <span
                  class="truncate pr-4 font-lato text-sm leading-6 text-gray-800"
                >
                  {{ image?.filename }}
                </span>
                <div class="flex flex-shrink-0">
                  <UButton
                    title="Pratinjau gambar"
                    variant="ghost"
                    square
                    size="sm"
                    @click="togglePreviewImage"
                  >
                    <NuxtIcon name="common/eye" class="text-2xl" />
                  </UButton>
                  <UButton
                    title="Hapus gambar"
                    variant="ghost"
                    square
                    size="sm"
                    class="ml-2"
                    @click="clear"
                  >
                    <NuxtIcon name="common/close" class="text-2xl" />
                  </UButton>
                </div>
              </div>
            </template>
          </BaseDropzone>

          <template #error>
            <p
              v-for="error in dropzoneErrorMessages"
              :key="error"
              class="font-lato text-xs leading-6 text-red-500"
            >
              {{ error }}
            </p>
          </template>

          <p
            v-show="
              !image.id &&
              !isDropzoneUploading &&
              dropzoneErrorMessages.length === 0
            "
            class="mt-4 font-lato text-sm leading-6 text-gray-800"
          >
            Belum ada file terpilih
          </p>

          <p
            v-show="isDropzoneUploading && !image.id"
            class="mt-4 font-lato text-sm leading-6 text-gray-800"
          >
            Mengupload gambar...
          </p>
        </UFormGroup>
      </div>

      <div class="rounded-lg bg-white p-[14px]">
        <Editor v-model="content" v-bind="tinyMCEConfig" />
      </div>
    </div>

    <div class="rounded-lg bg-white p-[14px]">
      <p
        class="mb-[14px] font-roboto text-base font-medium leading-6 text-green-700"
      >
        Nama, Kategori dan Tag
      </p>

      <!-- Author Input Field -->
      <UFormGroup label="Nama Penulis" class="mb-[14px]">
        <UInput
          v-model="author"
          placeholder="Masukkan Nama Penulis"
          maxlength="150"
        />
      </UFormGroup>

      <!-- Category Radio Buttons -->
      <UFormGroup label="Kategori" class="py-5">
        <!-- Skeletons -->
        <div
          v-if="isCategoryLoading"
          class="flex h-[200px] flex-col gap-2 py-5"
        >
          <div
            v-for="index in 3"
            :key="index"
            class="h-[42px] w-full animate-pulse bg-gray-100"
          />
        </div>

        <!-- Options -->
        <RadioGroup
          v-else
          v-model="category"
          class="max-h-[200px] overflow-y-auto"
        >
          <RadioGroupOption
            v-for="option in categories"
            :key="option.id"
            v-slot="{ checked }"
            :value="option.id"
          >
            <li
              class="group grid w-full cursor-pointer list-none grid-cols-[20px,1fr,auto] items-center gap-3 bg-white p-2 hover:bg-gray-50"
            >
              <!-- Radio Button -->
              <div
                :class="{
                  'flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2 border-gray-500': true,
                  'border-green-700': checked,
                }"
              >
                <div
                  v-show="checked"
                  class="h-2.5 w-2.5 rounded-full bg-green-700"
                />
              </div>

              <span
                class="line-clamp-2 font-lato text-sm leading-6 text-gray-800"
              >
                {{ option.name }}
              </span>

              <div
                class="flex gap-3 opacity-0 transition-opacity duration-150 ease-in group-hover:opacity-100"
              >
                <UButton
                  square
                  color="gray"
                  variant="ghost"
                  @click.stop="handleEditCategory(option.id)"
                >
                  <NuxtIcon
                    name="common/pencil"
                    class="text-lg"
                    filled
                    aria-hidden="true"
                  />
                </UButton>
                <UButton
                  color="gray"
                  square
                  variant="ghost"
                  :disabled="!option.is_deletable"
                  @click.stop="handleDeleteCategory(option.id)"
                >
                  <NuxtIcon
                    name="common/trash"
                    class="text-lg"
                    filled
                    aria-hidden="true"
                  />
                </UButton>
              </div>
            </li>
          </RadioGroupOption>
        </RadioGroup>
      </UFormGroup>

      <!-- Add Category Input Field -->
      <div
        :class="{
          'grid w-full grid-rows-[0] overflow-clip px-3 transition-all duration-150 ease-in': true,
          'grid-rows-[125px]': isAddCategory,
        }"
      >
        <UFormGroup>
          <template #description>
            <span class="font-lato text-xs leading-6 text-gray-600">
              Tekan enter untuk menambahkan.
            </span>
          </template>

          <UInput
            v-model="newCategoryForm.name"
            :loading="isCategoryLoading"
            autofocus
            maxlength="125"
            @keyup.enter="handleAddCategory"
          />

          <template #help>
            <span class="font-lato text-xs leading-none text-gray-400">
              Sisa karakter: {{ 125 - newCategoryForm.name.length }} dari 125
            </span>
          </template>
        </UFormGroup>
      </div>

      <UDivider class="mb-[14px]" />

      <!-- Add Category Button -->
      <div class="mb-[14px] flex w-full justify-end">
        <UButton
          v-if="isAddCategory"
          color="gray"
          variant="ghost"
          @click="toggleAddCategory"
        >
          <template #leading>
            <NuxtIcon name="common/close" aria-hidden="true" class="text-xl" />
          </template>
          Batalkan
        </UButton>

        <UButton v-else variant="ghost" @click="toggleAddCategory">
          <template #leading>
            <NuxtIcon
              name="common/plus"
              class="text-md text-green-600"
              aria-hidden="true"
            />
          </template>
          Tambah Kategori
        </UButton>
      </div>

      <!-- Tags Input Field -->
      <!-- eslint-disable-next-line vue/max-attributes-per-line -->
      <div class="mb-2.5 mt-5">
        <UFormGroup label="Tag" name="tag" hint="(Opsional)">
          <UInput
            ref="tagInput"
            v-model.trim="newTagForm.tag"
            :loading="isTagLoading"
            autocomplete="off"
            autofill="off"
            name="tag"
            placeholder="Masukkan Tag"
            @keyup.enter="handleAddTag"
          />
        </UFormGroup>

        <!-- Tag Suggestions -->
        <UPopover
          :open="!!newTagForm.tag && tagSuggestions.length > 0"
          :popper="{
            offsetDistance: -8,
            adaptive: true,
            scroll: true,
          }"
          :ui="{
            wrapper: 'h-0',
          }"
        >
          <div />
          <template #panel>
            <ul class="max-h-[150px] w-[336px] overflow-y-auto p-2">
              <li v-for="suggestion in tagSuggestions" :key="suggestion">
                <button
                  class="w-full rounded-sm px-2 text-start font-lato text-sm leading-6 text-gray-800 hover:bg-gray-100"
                  @click="selectTagSuggestion(suggestion)"
                >
                  {{ suggestion }}
                </button>
              </li>
            </ul>
          </template>
        </UPopover>
      </div>

      <ul
        class="flex min-h-[34px] w-full flex-wrap gap-1 rounded-lg border p-2"
      >
        <li
          v-for="tag in tags"
          :key="tag"
          class="min-h-5 flex items-center justify-center rounded-full bg-gray-200 py-1 pl-2.5 pr-1"
        >
          <span class="font-lato text-sm leading-none text-gray-600">
            {{ tag }}
          </span>
          <button class="relative top-[1px] ml-2" @click="handleDeleteTag(tag)">
            <NuxtIcon
              name="common/close"
              aria-hidden="true"
              class="text-xl text-gray-600"
            />
          </button>
        </li>
      </ul>
    </div>
  </section>

  <!-- Edit Category Modal -->
  <BaseModal
    :modal-ui="{
      width: 'w-[400px]',
    }"
    header="Ubah Kategori"
    :open="isEditCategory"
  >
    <p class="text-md mb-3 font-lato leading-6 text-gray-800">
      Masukkan nama baru untuk kategori
      <strong>
        {{ getCategoryLabel(editCategoryForm.id) }}
      </strong>
    </p>

    <UFormGroup>
      <UInput v-model="editCategoryForm.name" />
    </UFormGroup>

    <template #footer>
      <UButton type="button" variant="outline" @click="closeEditCategory">
        Batal
      </UButton>
      <UButton type="button" @click="editCategory"> Ubah Kategori </UButton>
    </template>
  </BaseModal>

  <!-- Delete Category Modal -->
  <BaseModal
    :modal-ui="{
      width: 'w-[400px]',
    }"
    header="Hapus Kategori"
    :open="isDeleteCategory"
  >
    <p class="text-md mb-3 font-lato leading-6 text-gray-800">
      Apakah anda yakin ingin menghapus kategori
      <strong>
        {{ deleteCategoryForm.name }}
      </strong>
      ?
    </p>

    <template #footer>
      <UButton type="button" variant="outline" @click="closeDeleteCategory">
        Batal
      </UButton>
      <UButton type="button" @click="deleteCategory"> Hapus Kategori </UButton>
    </template>
  </BaseModal>

  <!-- Image Preview -->
  <BaseModal
    :open="isPreviewImage"
    with-close-button
    @close="togglePreviewImage"
  >
    <NuxtImg
      :src="postStore.form.image.uri"
      :alt="postStore.form.image.filename"
      class="h-full w-full"
    />

    <template #footer>
      <UButton type="button" @click="togglePreviewImage"> Tutup </UButton>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
  import Editor from '@tinymce/tinymce-vue'
  import { RadioGroup, RadioGroupOption } from '@headlessui/vue'
  import { usePostStore } from '~/stores/post'
  import { validateImage } from '~/common/helpers/validation'
  import z from 'zod'
  import debounce from 'lodash.debounce'
  import { ICategory } from '~/repository/j-site/types/category'
  import { ITagRequestBody } from '~/repository/j-site/types/tag'

  const config = useRuntimeConfig()
  const siteStore = useSiteStore()
  const postStore = usePostStore()
  const { $jSiteApi } = useNuxtApp()

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
      toolbar_mode: 'sliding',
      image_caption: true,
      paste_block_drop: true,
      invalid_elements: 'div',
      images_upload_handler: handleContentImageUpload,
    },
  })

  onMounted(() => {
    fetchCategories()
  })

  /* ------------------------- Post Store Data Binding ------------------------ */
  const title = computed({
    get() {
      return postStore.form.title
    },
    set(value) {
      postStore.setTitle(value)
    },
  })

  const content = computed({
    get() {
      return postStore.form.content
    },
    set(value) {
      postStore.setContent(value)
    },
  })

  const author = computed({
    get() {
      return postStore.form.author
    },
    set(value) {
      postStore.setAuthor(value)
    },
  })

  const category = computed({
    get() {
      return postStore.form.category
    },
    set(value) {
      postStore.setCategory(value)
    },
  })

  const image = computed(() => {
    return postStore.form.image
  })

  const tags = computed(() => {
    return postStore.form.tags
  })

  /* ------------------------- Image Handler, Upload and Delete ------------------------ */

  const dropzoneErrorMessages = ref<string[]>([])
  const isDropzoneUploading = ref(false)

  async function handleImageChange(image: File) {
    if (!image) return

    try {
      isDropzoneUploading.value = true
      dropzoneErrorMessages.value = []

      await validateImage(image, {
        maxSize: 1048576, // 1MB
        maxWidth: 1080, // 1080 pixel
        maxHeight: 720, // 720 pixel
      })

      const formData = new FormData()

      formData.append('file', image)
      formData.append('caption', 'post')
      formData.append('setting_id', siteStore.siteId ?? '')

      const response = await uploadImage(formData)
      const { file, id } = response?.value?.data ?? {}

      if (file && id) {
        postStore.setImage({
          id,
          uri: file.uri,
          filename: file.filename,
        })
      }
    } catch (error) {
      resetDropzone()
      if (error instanceof z.ZodError) {
        dropzoneErrorMessages.value = error.issues.map((err) => err.message)
      } else {
        console.error(error)
      }
    } finally {
      isDropzoneUploading.value = false
    }
  }

  async function uploadImage(formData: FormData) {
    const {
      data: uploadResponse,
      status,
      error,
    } = await $jSiteApi.media.uploadMedia(formData, undefined, {
      server: false,
    })

    if (status.value === 'success') {
      return uploadResponse
    } else if (status.value === 'error') {
      throw error
    }
  }

  async function handleDeleteImage() {
    try {
      await deleteUploadedImage(postStore.form.image.id)
      resetDropzone()
    } catch (error) {
      console.error(error)
    }
  }

  async function deleteUploadedImage(id: string) {
    const { status, error } = await $jSiteApi.media.deleteMedia(id, undefined, {
      server: false,
    })

    if (status.value === 'error') {
      throw error
    }
  }

  function resetDropzone() {
    postStore.setImage({ id: '', uri: '', filename: '' })
  }

  const isPreviewImage = ref(false)

  function togglePreviewImage() {
    isPreviewImage.value = !isPreviewImage.value
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async function handleContentImageUpload(blobInfo: any) {
    try {
      await validateImage(blobInfo.blob(), {
        maxSize: 1048576, // 1MB
        maxWidth: 1080, // 1080 pixel
        maxHeight: 720, // 720 pixel
      })

      const formData = new FormData()

      formData.append('file', blobInfo.blob())
      formData.append('caption', 'post')
      formData.append('setting_id', siteStore.siteId ?? '')

      const response = await uploadImage(formData)
      const { file } = response?.value?.data ?? {}

      return new Promise((resolve) => resolve(file?.uri))
    } catch (error) {
      return new Promise((_, reject) => {
        // Validation error
        if (error instanceof z.ZodError) {
          reject({
            message: error.issues[0].message,
            remove: true,
          })
        } else {
          reject({
            message: `Mohon maaf upload gagal, silakan coba beberapa saat lagi.`,
            remove: true,
          })
        }
      })
    }
  }

  /* ---------------------------- Category --------------------------- */

  const isEditCategory = ref(false)

  const isAddCategory = ref(false)

  const isDeleteCategory = ref(false)

  const isCategoryLoading = ref(true)

  const categories = ref<ICategory[]>([])

  async function fetchCategories() {
    isCategoryLoading.value = true

    const {
      data: categoriesResponse,
      status,
      error,
    } = await $jSiteApi.category.getCategories(
      siteStore.siteId ?? '',
      undefined,
      { server: false },
    )

    if (status.value === 'success') {
      categories.value = categoriesResponse?.value?.data ?? []
    }

    if (status.value === 'error') {
      console.error(error)
    }

    setTimeout(() => {
      isCategoryLoading.value = false
    }, 300)
  }

  const editCategoryForm = reactive({
    id: '',
    name: '',
  })

  function handleEditCategory(categoryId: string) {
    isEditCategory.value = true

    const category = getCategoryById(categoryId)

    editCategoryForm.name = category?.name ?? ''
    editCategoryForm.id = category?.id ?? ''
  }

  function closeEditCategory() {
    isEditCategory.value = false
    editCategoryForm.name = ''
    editCategoryForm.id = ''
  }

  async function editCategory() {
    isCategoryLoading.value = true

    const body = {
      name: editCategoryForm.name,
    }

    const { status, error } = await $jSiteApi.category.updateCategory(
      siteStore.siteId ?? '',
      editCategoryForm?.id ?? '',
      body,
      { server: false },
    )

    if (status.value === 'success') {
      // TODO: add success toast
    }

    if (status.value === 'error') {
      console.error(error)
    }

    closeEditCategory()
    fetchCategories()
  }

  function getCategoryById(categoryId: string) {
    return categories.value.find((category) => category.id === categoryId)
  }

  function getCategoryLabel(categoryId: string) {
    const category = getCategoryById(categoryId)
    return category?.name
  }

  const newCategoryForm = reactive({
    name: '',
  })

  function toggleAddCategory() {
    isAddCategory.value = !isAddCategory.value
  }

  async function handleAddCategory() {
    const { status, error } = await $jSiteApi.category.createCategory(
      siteStore.siteId ?? '',
      newCategoryForm,
      { server: false },
    )

    if (status.value === 'success') {
      // TODO: add success toast
      newCategoryForm.name = ''
    }

    if (status.value === 'error') {
      console.error(error)
    }

    fetchCategories()
  }

  const deleteCategoryForm = reactive({
    id: '',
    name: '',
  })

  function handleDeleteCategory(categoryId: string) {
    isDeleteCategory.value = true

    const category = getCategoryById(categoryId)

    deleteCategoryForm.id = category?.id ?? ''
    deleteCategoryForm.name = category?.name ?? ''
  }

  function closeDeleteCategory() {
    isDeleteCategory.value = false

    deleteCategoryForm.id = ''
    deleteCategoryForm.name = ''
  }

  async function deleteCategory() {
    const { status, error } = await $jSiteApi.category.deleteCategory(
      siteStore?.siteId ?? '',
      deleteCategoryForm.id,
      { server: false },
    )

    if (status.value === 'success') {
      if (postStore.form.category === deleteCategoryForm.id) {
        postStore.setCategory('')
      }
      // TODO: add success toast
    }

    if (status.value === 'error') {
      console.error(error)
    }

    closeDeleteCategory()
    fetchCategories()
  }

  /* ---------------------------------- Tags ---------------------------------- */
  const isTagLoading = ref(false)

  const newTagForm = reactive({
    tag: '',
  })

  const tagInput = ref()

  const tagSuggestions = ref<string[]>([])

  async function handleAddTag() {
    if (newTagForm.tag === '') return

    isTagLoading.value = true

    const formattedTag = newTagForm.tag.replaceAll(' ', '').toLowerCase()

    const body: ITagRequestBody = {
      name: formattedTag,
    }

    const { status, error } = await $jSiteApi.tag.createTag(
      siteStore.siteId ?? '',
      body,
      { server: false },
    )

    if (status.value === 'success' && !tags.value?.includes(formattedTag)) {
      postStore.pushTag(formattedTag)
    }

    if (status.value === 'error') {
      console.error(error)
    }

    resetTagForm()
    await nextTick()
    focusTagInput()
  }

  function resetTagForm() {
    newTagForm.tag = ''
    isTagLoading.value = false
    tagSuggestions.value = []
  }

  function focusTagInput() {
    const element = document.querySelector(
      `input[name="tag"]`,
    ) as HTMLInputElement

    element && element.focus()
  }

  function handleDeleteTag(tag: string) {
    postStore.removeTag(tag)
  }

  const getSuggestions = debounce(async (tag: string) => {
    const { data, status, error } = await $jSiteApi.tag.getTags(
      siteStore.siteId ?? '',
      { params: { q: tag } },
      { server: false },
    )

    if (status.value === 'success') {
      tagSuggestions.value = data.value?.data.map((item) => item.name) ?? []
    }

    if (status.value === 'error') {
      console.error(error)
      tagSuggestions.value = []
    }
  }, 500)

  function selectTagSuggestion(tag: string) {
    if (!tags.value?.includes(tag)) {
      postStore.pushTag(tag)
    }

    resetTagForm()
  }

  watch(
    () => newTagForm.tag,
    (value) => {
      if (value !== '') {
        const formattedTag = newTagForm.tag.replaceAll(' ', '').toLowerCase()
        getSuggestions(formattedTag)
      } else {
        tagSuggestions.value = []
      }
    },
  )
</script>
