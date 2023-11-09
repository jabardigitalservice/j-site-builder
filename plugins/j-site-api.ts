import { $fetch, FetchOptions } from 'ofetch'
import TemplateModule from '~/repository/j-site/modules/template'
import SettingsModule from '~/repository/j-site/modules/settings'

interface IApiInstance {
  templates: TemplateModule
  settings: SettingsModule
  // ...add another modules here
}

export default defineNuxtPlugin(async () => {
  const config = useRuntimeConfig()
  const token = useCookie('token')

  const fetchOptions: FetchOptions = {
    baseURL: config.public.jSiteApiURL as string,
    async onRequest({ options }) {
      options.headers = {
        Authorization: `Bearer ${token.value}`,
      }
    },
  }
  const apiFecther = $fetch.create(fetchOptions)

  const modules: IApiInstance = {
    templates: new TemplateModule(apiFecther),
    settings: new SettingsModule(apiFecther),
    // ...add other modules here
  }

  return {
    provide: {
      jSiteApi: modules,
    },
  }
})
