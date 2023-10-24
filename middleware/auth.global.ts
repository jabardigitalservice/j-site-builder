import { getCookie } from '@/common/helpers/cookie'

export default defineNuxtRouteMiddleware((to) => {
  // disable middleware for `/verify` path
  if (to.path.includes('/verify')) return

  const cookie = getCookie('token')

  if (!cookie) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Error Unauthorized',
    })
  }
})
