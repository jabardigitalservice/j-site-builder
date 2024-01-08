type IForm = {
  title: string
  image: {
    id: string
    uri: string
    filename: string
  }
  content: string
  author: string
  category: string
  tags: null | string[]
  status: null | IFormStatus
}

type IFormStatus = 'DRAFT' | 'PUBLISHED'

export const usePostStore = defineStore('post', {
  state: () => ({
    form: {
      title: '',
      image: {
        id: '',
        uri: '',
        filename: '',
      },
      content: '',
      author: '',
      category: '',
      tags: [],
      status: null,
    } as IForm,
  }),
  actions: {
    setTitle(title: string) {
      this.form.title = title
    },
    setContent(content: string) {
      this.form.content = content
    },
    setAuthor(author: string) {
      this.form.author = author
    },
    setCategory(category: string) {
      this.form.category = category
    },
    setImage({
      id,
      uri,
      filename,
    }: {
      id: string
      uri: string
      filename: string
    }) {
      this.form.image.id = id
      this.form.image.uri = uri
      this.form.image.filename = filename
    },
    pushTag(tag: string) {
      this.form.tags?.push(tag)
    },
    removeTag(tag: string) {
      if (this.form.tags?.includes(tag)) {
        this.form.tags = this.form.tags?.filter((item) => item !== tag)
      }
    },
  },
})
