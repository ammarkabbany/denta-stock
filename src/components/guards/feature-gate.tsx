'use client'

import { useAccess } from '@/contexts/team-provider'
import { useLanguageContext } from '@/contexts/language-context'
import { IconLock, IconAlertTriangle } from '@tabler/icons-react'

const FEATURE_KEY = 'denta_stock'

/**
 * Full-screen blocking component when the denta_stock feature is not available.
 * Wraps the entire app - if the feature is missing or inactive, shows a blocking overlay.
 */
export function FeatureGate({ children }: { children: React.ReactNode }) {
  const {
    hasFeature,
    isFeatureInactive,
    isPlanExpired,
    isTrialExpired,
    isLoading,
  } = useAccess()
  const { t } = useLanguageContext()

  // While loading, show nothing (or could show a loading spinner)
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground">
          {t.common?.loading || 'Loading...'}
        </div>
      </div>
    )
  }

  // Check if subscription expired
  const subscriptionExpired = isPlanExpired() || isTrialExpired()

  // Check if feature is available and active
  const featureAvailable = hasFeature(FEATURE_KEY)
  const featureInactive = isFeatureInactive(FEATURE_KEY)

  // If subscription expired, show expiry message
  if (subscriptionExpired) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-destructive/5 p-6">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center">
              <IconAlertTriangle className="w-10 h-10 text-destructive" />
            </div>
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-foreground">
              {t.billing?.subscriptionExpired || 'Subscription Expired'}
            </h1>
            <p className="text-muted-foreground">
              {t.billing?.subscriptionExpiredMessage ||
                'Your subscription has expired. Please renew to continue using the application.'}
            </p>
          </div>
          <div className="pt-4">
            <p className="text-sm text-muted-foreground">
              {t.billing?.contactAdmin ||
                'Please contact your administrator to renew the subscription.'}
            </p>
          </div>
        </div>
      </div>
    )
  }

  // If feature is inactive (disabled by admin) - CHECK THIS FIRST
  if (featureInactive) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/5 p-6">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-full bg-muted/20 flex items-center justify-center">
              <IconLock className="w-10 h-10 text-muted-foreground" />
            </div>
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-foreground">
              {t.billing?.featureDisabled || 'Feature Disabled'}
            </h1>
            <p className="text-muted-foreground">
              {t.billing?.featureDisabledMessage ||
                'The inventory management feature has been temporarily disabled.'}
            </p>
          </div>
          <div className="pt-4">
            <p className="text-sm text-muted-foreground">
              {t.billing?.contactAdmin ||
                'Please contact your administrator for more information.'}
            </p>
          </div>
        </div>
      </div>
    )
  }

  // If feature not available (not in plan)
  if (!featureAvailable) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-warning/5 p-6">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-full bg-warning/10 flex items-center justify-center">
              <IconLock className="w-10 h-10 text-warning" />
            </div>
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-foreground">
              {t.billing?.featureNotAvailable || 'Feature Not Available'}
            </h1>
            <p className="text-muted-foreground">
              {t.billing?.featureNotAvailableMessage ||
                'The inventory management feature is not included in your current plan.'}
            </p>
          </div>
          <div className="pt-4">
            <p className="text-sm text-muted-foreground">
              {t.billing?.upgradePlan ||
                'Please upgrade your plan to access this feature.'}
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Feature is available and active - render children
  return <>{children}</>
}
