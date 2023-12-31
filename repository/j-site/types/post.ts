export interface IPostCategory {
  id: string
  name: string
  is_deletable: boolean
}

export interface IPostData {
  id: string
  title: string
  status: string
  category?: IPostCategory
  updated_at?: string
}

export interface IMetaData {
  page: number
  last_page: number
  limit: number
  from: number
  to: number
  total: number
}

export interface IPostsResponse {
  data?: IPostData[]
  meta?: IMetaData
}
