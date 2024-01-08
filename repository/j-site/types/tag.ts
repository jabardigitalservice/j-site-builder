export interface ITagRequestBody {
  name: string
}

export interface ITagResponse {
  message: string
}

export interface ITag {
  _id: string
  name: string
  id: string
}

export interface IMetaData {
  page: number
  last_page: number
  limit: number
  from: number
  to: number
  total: number
}

export interface ITagsResponse {
  data: ITag[]
  meta: IMetaData
}
