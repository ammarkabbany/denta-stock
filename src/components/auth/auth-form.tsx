import * as React from 'react'
import { UseFormReturn, FieldValues, DefaultValues } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { Loader2 } from 'lucide-react'
import { useLanguageContext } from '@/contexts/language-context'

interface AuthFormProps<T extends FieldValues> {
  schema: z.ZodSchema<T>
  defaultValues: DefaultValues<T>
  onSubmit: (data: T, form: UseFormReturn<T>) => void
  children: (form: UseFormReturn<T>) => React.ReactNode
  submitText: string
  loadingText: string
  isLoading?: boolean
  className?: string
  form: UseFormReturn<T>
}

export function AuthForm<T extends FieldValues>({
  onSubmit,
  children,
  submitText,
  loadingText,
  isLoading = false,
  className = 'space-y-4',
  form,
}: AuthFormProps<T>) {
  const { t } = useLanguageContext()

  const handleSubmit = (data: T) => {
    onSubmit(data, form)
  }

  // Map English text to translated text
  const getSubmitText = () => {
    if (submitText === 'Sign in' || submitText === 'تسجيل الدخول') {
      return t.auth.signIn
    }
    if (submitText === 'Sign up' || submitText === 'إنشاء حساب') {
      return t.auth.signUp || 'إنشاء حساب'
    }
    return submitText
  }

  const getLoadingText = () => {
    if (loadingText === 'Signing in...' || loadingText.includes('Signing in')) {
      return t.auth.signingIn || 'جاري تسجيل الدخول...'
    }
    if (loadingText === 'Signing up...' || loadingText.includes('Signing up')) {
      return t.auth.signingUp || 'جاري إنشاء الحساب...'
    }
    return loadingText
  }

  // Map English error messages to Arabic
  const getErrorMessage = (message: string | undefined) => {
    if (!message) return message
    if (message.includes('Failed to sign in') || message.includes('sign in')) {
      return t.auth.invalidCredentials
    }
    return message
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className={className}>
        {children(form)}

        {form.formState.errors.root && (
          <div className="text-sm font-medium text-destructive">
            {getErrorMessage(form.formState.errors.root.message)}
          </div>
        )}

        <Button type="submit" size="sm" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              {getLoadingText()}
            </div>
          ) : (
            getSubmitText()
          )}
        </Button>
      </form>
    </Form>
  )
}
