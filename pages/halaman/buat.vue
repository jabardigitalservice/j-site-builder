<template>
  <div class="h-full w-full bg-[#F3F4F8] pb-24">
    <PageBuilderHeader
      :loading="fetchSettingLoading"
      @back="backToPage"
      @draft="toggleDraftModal"
      @publish="togglePublishModal"
    />
    <div class="flex h-full w-full justify-between gap-4 px-1 py-4">
      <PageBuilderContent :loading="fetchTemplateLoading" />
      <PageBuilderAside />
    </div>
  </div>

  <!-- Confirmation Modal -->
  <BaseModal
    :open="
      modal.status === MODAL_STATE.STATUS_DRAFT ||
      modal.status === MODAL_STATE.STATUS_PUBLISH ||
      modal.status === MODAL_STATE.CANCEL_CONFIRMATION
    "
    button-position="right"
    :with-close-button="true"
    :modal-ui="{
      width: 'sm:max-w-[533px]',
    }"
    @close="onCancel"
  >
    <div class="justify-left flex items-start gap-4 pb-3">
      <div class="h-12 w-12 flex-none">
        <div
          :class="{
            'flex h-12 w-12 items-center justify-center rounded-full': true,
            'bg-green-50': modal.status === MODAL_STATE.STATUS_DRAFT,
            'bg-blue-50': modal.status === MODAL_STATE.STATUS_PUBLISH,
            'bg-[#FFF9E1]': modal.status === MODAL_STATE.CANCEL_CONFIRMATION,
          }"
        >
          <NuxtIcon
            :name="modal.icon"
            :class="{
              'text-2xl': true,
              'text-green-800': modal.status === MODAL_STATE.STATUS_DRAFT,
              'text-blue-800': modal.status === MODAL_STATE.STATUS_PUBLISH,
              'text-[#FFA600]':
                modal.status === MODAL_STATE.CANCEL_CONFIRMATION,
            }"
            aria-hidden="true"
          />
        </div>
      </div>
      <div class="h-full w-full grow flex-col">
        <h1 class="font-roboto text-xl font-medium leading-7 text-gray-900">
          {{ modal.title }}
        </h1>
        <span class="font-lato text-sm leading-6 text-gray-600">
          {{ modal.message }}
        </span>
      </div>
    </div>
    <template #footer>
      <UButton
        v-if="modal.status === MODAL_STATE.CANCEL_CONFIRMATION"
        variant="outline"
        @click="actionDraftPage"
      >
        Kembali dan simpan draft
      </UButton>
      <NuxtLink
        v-if="modal.status === MODAL_STATE.CANCEL_CONFIRMATION"
        to="/halaman"
      >
        <UButton> Ya, saya yakin </UButton>
      </NuxtLink>
      <BaseButton
        v-if="modal.status !== MODAL_STATE.CANCEL_CONFIRMATION"
        variant="secondary"
        @click="onCancel"
      >
        Batalkan
      </BaseButton>
      <BaseButton
        v-if="modal.status === MODAL_STATE.STATUS_DRAFT"
        variant="primary"
        @click="actionDraftPage()"
      >
        Iya, saya yakin
      </BaseButton>
      <BaseButton
        v-if="modal.status === MODAL_STATE.STATUS_PUBLISH"
        variant="primary"
        @click="actionPublishPage()"
      >
        Iya, saya yakin
      </BaseButton>
    </template>
  </BaseModal>

  <!-- Action Progress -->
  <ProgressModal
    :open="modal.status === MODAL_STATE.LOADING"
    :value="loadingProgressValue"
    :title="modal.title"
    :message="modal.message"
  />

  <!-- Error / Success Modal -->
  <BaseModal
    :open="
      modal.status === MODAL_STATE.SUCCESS || modal.status === MODAL_STATE.ERROR
    "
    :header="modal.title"
    button-position="center"
    :with-close-button="true"
    :modal-ui="{
      width: 'sm:max-w-[533px]',
    }"
    @close="onCancel"
  >
    <div class="flex items-center justify-center gap-2">
      <div class="flex h-full w-[18px] items-center justify-center">
        <NuxtIcon
          v-if="modal.status === MODAL_STATE.SUCCESS"
          name="common/check-circle"
          class="text-base text-green-700"
          aria-hidden="true"
        />
        <NuxtIcon
          v-else
          name="common/warning-triangle"
          class="text-base text-red-600"
          aria-hidden="true"
        />
      </div>
      <div class="h-full w-full grow flex-col">
        <p class="font-lato text-sm leading-6 text-gray-600">
          {{ modal.message }}
        </p>
      </div>
    </div>
    <template #footer>
      <BaseButton variant="primary" @click="onSuccessStorePage">
        Saya Mengerti
      </BaseButton>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
  import { MODAL_STATE } from '~/common/constant/modal'

  definePageMeta({
    layout: 'full-bleed',
  })

  const modal = reactive({
    status: '',
    icon: '',
    title: '',
    message: '',
  })

  const loadingProgressValue = ref(0)

  const { $jSiteApi } = useNuxtApp()
  const route = useRoute()
  const siteStore = useSiteStore()
  const pageStore = usePageStore()

  pageStore.setPageTitle(route.query.title?.toString() ?? '')
  pageStore.setPageTemplate(route.query.templateId?.toString() ?? '')

  const { data: setting, pending: fetchSettingLoading } =
    await $jSiteApi.settings.getSettingsById(
      siteStore?.siteId ?? '',
      undefined, // no query params for this request
      { server: false, lazy: true },
    )

  watch(setting, () => {
    pageStore.setPageDomain(toRaw(setting.value?.data?.domain || ''))
  })

  const { data: template, pending: fetchTemplateLoading } =
    await $jSiteApi.templates.getTemplateById(
      pageStore.builderConfig?.templateId ?? '',
      undefined, // no query params for this request
      { server: false, lazy: true },
    )

  watch(template, () => {
    pageStore.setBuilderSections(toRaw(template.value?.data?.sections || []))
  })

  const backToPage = () => {
    modal.status = MODAL_STATE.CANCEL_CONFIRMATION
    modal.icon = 'common/warning-triangle'
    modal.title = 'Keluar Halaman Builder'
    modal.message =
      'Apakah anda yakin untuk kembali ke menu halaman? Jika anda kembali ke menu halaman tanpa menyimpan, maka pengaturan anda lakukan sebelumnya dapat hilang atau dihapus.'
  }

  const toggleDraftModal = () => {
    modal.status = MODAL_STATE.STATUS_DRAFT
    modal.icon = 'navigation/posting-menu-icon'
    modal.title = 'Simpan ke draft'
    modal.message = 'Apakah anda yakin ingin Menyimpan ke Draft ?'
  }

  const togglePublishModal = () => {
    modal.status = MODAL_STATE.STATUS_PUBLISH
    modal.icon = 'common/plane'
    modal.title = 'Terbitkan Halaman'
    modal.message = 'Apakah anda yakin ingin Menerbitkan Halaman ?'
  }

  const onCancel = () => {
    modal.status = MODAL_STATE.NONE
  }

  const onSuccessStorePage = async () => {
    await navigateTo({ path: '/halaman/semua' })
  }

  const setLoadingProgress = (value: number) => {
    loadingProgressValue.value = value
  }

  const actionDraftPage = async () => {
    modal.status = MODAL_STATE.LOADING
    modal.title = 'Menyimpan ke draft'
    modal.message = 'Mohon tunggu, penyimpanan Halaman sedang diproses.'

    const { status } = await $jSiteApi.page.storePage(
      siteStore?.siteId ?? '',
      {
        title: pageStore.builderConfig?.title ?? '',
        status: 'DRAFT',
        sections: toRaw(pageStore.builderConfig?.sections),
      },
      { server: false },
    )

    if (status.value === 'success') {
      setLoadingProgress(25)
      setTimeout(() => {
        setLoadingProgress(100)
        setTimeout(() => {
          modal.status = MODAL_STATE.SUCCESS
          modal.title = 'Berhasil!'
          modal.message = 'Halaman yang Anda buat berhasil disimpan ke draft.'
        }, 250)
      }, 250)
    } else if (status.value === 'error') {
      modal.status = MODAL_STATE.ERROR
      modal.title = 'Gagal!'
      modal.message = 'Halaman yang Anda buat gagal disimpan ke draft.'
    }
  }

  const actionPublishPage = async () => {
    // TODO: update publish page function
    modal.status = MODAL_STATE.NONE
  }
</script>
