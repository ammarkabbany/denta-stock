import { createServerFn } from '@tanstack/react-start'
import z from 'zod'
import {
  deleteCookie,
  getCookie,
  setCookie,
} from '@tanstack/react-start/server'

export const getAppwriteSessionFn = createServerFn({ method: 'GET' }).handler(
  async () => {
    const session = getCookie(`a_session_${process.env.APPWRITE_PROJECT_ID}`)

    if (!session) {
      return null
    }

    return session
  },
)

export const setAppwriteSessionCookiesFn = createServerFn({ method: 'POST' })
  .inputValidator(z.object({ id: z.string(), secret: z.string() }))
  .handler(async ({ data }) => {
    const { id, secret } = data
    setCookie(`a_session_${process.env.APPWRITE_PROJECT_ID}`, secret, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      path: '/',
    })

    setCookie(`appwrite-session-id`, id, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      path: '/',
    })
  })

export const signOutFn = createServerFn({ method: 'POST' }).handler(
  async () => {
    deleteCookie(`a_session_${process.env.APPWRITE_PROJECT_ID}`)
    deleteCookie(`appwrite-session-id`)
  },
)
