import * as React from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useLanguageContext } from '@/contexts/language-context'

interface AuthCardProps {
  title: string
  description: string
  children: React.ReactNode
}

export function AuthCard({ title, description, children }: AuthCardProps) {
  const { t } = useLanguageContext()

  // Map English titles to translated titles
  const getTitle = () => {
    if (title === 'Sign in' || title === 'تسجيل الدخول') {
      return t.auth.signIn
    }
    return title
  }

  // Map English descriptions to translated descriptions
  const getDescription = () => {
    if (
      description === 'Enter your email and password to access your account' ||
      description.includes('email and password')
    ) {
      return (
        t.auth.signInDescription ||
        'أدخل بريدك الإلكتروني وكلمة المرور للوصول إلى حسابك'
      )
    }
    return description
  }

  // Filter out sign-up link from children
  const filterChildren = (children: React.ReactNode): React.ReactNode => {
    return React.Children.map(children, (child) => {
      if (!React.isValidElement(child)) return child

      // Check if this is the sign-up link container div
      const childProps = child.props as {
        className?: string
        children?: React.ReactNode
      }
      if (
        child.type === 'div' &&
        childProps.className?.includes('text-center') &&
        childProps.className?.includes('mt-4')
      ) {
        // Check children for sign-up link patterns
        const hasSignUpContent = React.Children.toArray(
          childProps.children,
        ).some((grandChild) => {
          if (typeof grandChild === 'string') {
            return (
              grandChild.includes('sign-up') ||
              grandChild.includes('Sign up') ||
              grandChild.includes("Don't have an account")
            )
          }
          if (React.isValidElement(grandChild)) {
            const gcProps = grandChild.props as { href?: string }
            return gcProps.href?.includes('sign-up')
          }
          return false
        })
        if (hasSignUpContent) {
          return null
        }
      }

      return child
    })
  }

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-6">
      <div className="w-full max-w-md space-y-6">
        {/* Logo and Branding */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center">
            <img
              src="/logo-only-no-bg.png"
              alt="DentaStock"
              className="w-16 h-16 object-contain"
            />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{t.appName}</h1>
            <p className="text-sm text-muted-foreground">{t.appTagline}</p>
          </div>
        </div>

        {/* Auth Card */}
        <Card className="border-0 shadow-xl">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-lg md:text-xl">{getTitle()}</CardTitle>
            <CardDescription className="text-sm">
              {getDescription()}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">{filterChildren(children)}</CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} {t.appName}. جميع الحقوق محفوظة.
        </p>
      </div>
    </div>
  )
}
