import { AsyncDataOptions } from '#app'
import { FetchOptions } from 'ofetch'

import FetchFactory from '../../factory'
import { IPageResponse, IPageData, IPagesResponse } from '../types/page'

class PageModules extends FetchFactory {
  private RESOURCE = '/v1/pages'

  async getPages(
    id: string,
    fetchOptions?: FetchOptions<'json'>,
    options?: AsyncDataOptions<IPagesResponse>,
  ) {
    return useAsyncData(() => {
      return this.call<IPagesResponse>(
        'GET',
        `${this.RESOURCE}/${id}`,
        undefined, // body
        fetchOptions,
      )
    }, options)
  }

  async storePage(
    id: string,
    body?: IPageData,
    options?: AsyncDataOptions<IPageResponse>,
  ) {
    return useAsyncData(() => {
      return this.call<IPageResponse>('POST', `${this.RESOURCE}/${id}`, body)
    }, options)
  }
}

export default PageModules
