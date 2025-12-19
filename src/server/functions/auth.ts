import { createServerFn } from '@tanstack/react-start'
import z from 'zod'
import { redirect } from '@tanstack/react-router'
import { createAdminClient } from '../lib/appwrite'
import { AppwriteException, ID } from 'node-appwrite'
import { setResponseStatus } from '@tanstack/react-start/server'
import {
  setAppwriteSessionCookiesFn,
  signOutFn,
  getAppwriteSessionFn, // While not defined here anymore, we might re-export it or just import where needed.
} from './session'
import { getCurrentUser } from './access'

// Re-export specific session functions that might be used elsewhere
export { getAppwriteSessionFn, signOutFn, setAppwriteSessionCookiesFn }

const signUpInSchema = z.object({
  email: z.email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  redirect: z.string().optional(),
})

export const signUpFn = createServerFn({ method: 'POST' })
  .inputValidator(signUpInSchema)
  .handler(async ({ data }) => {
    const { email, password, redirect: redirectUrl } = data
    const { account } = createAdminClient()

    try {
      await account.create({ userId: ID.unique(), email, password })
      const session = await account.createEmailPasswordSession({
        email,
        password,
      })
      await setAppwriteSessionCookiesFn({
        data: { id: session.$id, secret: session.secret },
      })
    } catch (_error) {
      const error = _error as AppwriteException
      setResponseStatus(error.code)
      throw {
        message: error.message,
        status: error.code,
      }
    }

    if (redirectUrl) {
      throw redirect({ to: redirectUrl })
    } else {
      throw redirect({ to: '/' })
    }
  })

export const signInFn = createServerFn({ method: 'POST' })
  .inputValidator(signUpInSchema)
  .handler(async ({ data }) => {
    const { email, password, redirect: redirectUrl } = data

    try {
      const { account } = createAdminClient()
      const session = await account.createEmailPasswordSession({
        email,
        password,
      })
      await setAppwriteSessionCookiesFn({
        data: { id: session.$id, secret: session.secret },
      })
    } catch (_error) {
      const error = _error as AppwriteException
      setResponseStatus(error.code)
      throw {
        message: error.message,
        status: error.code,
      }
    }

    if (redirectUrl) {
      throw redirect({ to: redirectUrl })
    } else {
      throw redirect({ to: '/' })
    }
  })

export const authMiddleware = createServerFn({ method: 'GET' }).handler(
  async () => {
    // Now we can standard import getCurrentUser because the cycle is broken
    const currentUser = await getCurrentUser()

    return {
      currentUser,
    }
  },
)
