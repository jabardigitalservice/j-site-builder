import { AsyncDataOptions } from '#app'

import FetchFactory from '../../factory'
import { ITagResponse, ITagsResponse, ITagRequestBody } from '../types/tag'
import { FetchOptions } from 'ofetch'

class TagModules extends FetchFactory {
  private RESOURCE = '/v1/tags'

  async getTags(
    settingId: string,
    fetchOptions?: FetchOptions<'json'>,
    options?: AsyncDataOptions<ITagsResponse>,
  ) {
    return useAsyncData(() => {
      return this.call<ITagsResponse>(
        'GET',
        `${this.RESOURCE}/${settingId}`,
        undefined,
        fetchOptions,
      )
    }, options)
  }

  async createTag(
    settingId: string,
    body: ITagRequestBody,
    options?: AsyncDataOptions<ITagResponse>,
  ) {
    return useAsyncData(() => {
      return this.call<ITagResponse>(
        'POST',
        `${this.RESOURCE}/${settingId}`,
        body,
      )
    }, options)
  }
}

export default TagModules
