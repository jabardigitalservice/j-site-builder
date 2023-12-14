import { AsyncDataOptions } from '#app'
import { FetchOptions } from 'ofetch'

import FetchFactory from '../../factory'
import { IPostsResponse } from '../types/post'

class PostModules extends FetchFactory {
  private RESOURCE = '/v1/posts'

  async getPostList(
    id: string,
    fetchOptions?: FetchOptions<'json'>,
    options?: AsyncDataOptions<IPostsResponse>,
  ) {
    return useAsyncData(() => {
      return this.call<IPostsResponse>(
        'GET',
        `${this.RESOURCE}/${id}`,
        undefined, // body
        fetchOptions,
      )
    }, options)
  }
}

export default PostModules