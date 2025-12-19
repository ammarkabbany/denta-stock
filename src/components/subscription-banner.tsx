'use client'

import { AlertTriangle } from 'lucide-react'
import { useAccess } from '@/contexts/team-provider'
import { useLanguageContext } from '@/contexts/language-context'
import { formatDate } from '@/lib/i18n'

/**
 * Displays a banner when the trial or subscription is expired or about to expire.
 */
export default function SubscriptionBanner() {
  const {
    isTrialExpired,
    isTrialAboutToExpire,
    isPlanExpired,
    isPlanAboutToExpire,
    currentTeam,
    isOnTrial,
  } = useAccess()
  const { t, language } = useLanguageContext()

  const trialExpired = isTrialExpired()
  const trialEnding = isTrialAboutToExpire()
  const planExpired = isPlanExpired()
  const planEnding = isPlanAboutToExpire()
  const isTrial = isOnTrial()

  // Show nothing if no issues
  if (!trialExpired && !trialEnding && !planExpired && !planEnding) {
    return null
  }

  // Determine which status to show (trial takes precedence)
  const isExpired = isTrial ? trialExpired : planExpired
  const isEnding = isTrial ? trialEnding : planEnding

  if (!isExpired && !isEnding) return null

  const expireDate = isTrial
    ? currentTeam?.trialStatus?.expireDate
    : currentTeam?.planStatus?.expireDate

  const formattedDate = expireDate
    ? formatDate(expireDate, language, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : null

  // Determine colors based on state
  const bgClass = isExpired
    ? isTrial
      ? 'bg-amber-100 border-y border-amber-300 text-amber-900'
      : 'bg-red-100 border-y border-red-300 text-red-900'
    : 'bg-yellow-100 border-y border-yellow-300 text-yellow-900'

  // Get translation keys
  const titleKey = isExpired
    ? isTrial
      ? 'trialExpiredTitle'
      : 'planExpiredTitle'
    : isTrial
      ? 'trialEndingTitle'
      : 'planEndingTitle'

  const dateKey = isExpired
    ? isTrial
      ? 'trialExpiredOn'
      : 'planExpiredOn'
    : isTrial
      ? 'trialEndingOn'
      : 'planEndingOn'

  const genericKey = isExpired
    ? isTrial
      ? 'trialExpiredGeneric'
      : 'planExpiredGeneric'
    : isTrial
      ? 'trialEndingGeneric'
      : 'planEndingGeneric'

  const billing = t.billing as Record<string, string>
  const title = billing[titleKey]
  const dateText = formattedDate
    ? billing[dateKey].replace('{{date}}', formattedDate)
    : billing[genericKey]

  return (
    <div className={bgClass}>
      <div className="container mx-auto px-4 py-2 flex items-center gap-2 max-w-7xl">
        <AlertTriangle className="w-4 h-4 shrink-0" />
        <div className="text-sm">
          <span className="font-medium">{title}</span> <span>{dateText}</span>
        </div>
      </div>
    </div>
  )
}
