export function calculateReadiness({ reviewCoverage, checksPassing, riskResolved }) {
  const values = [reviewCoverage, checksPassing, riskResolved]
  if (values.some((value) => !Number.isFinite(value) || value < 0 || value > 100)) {
    throw new TypeError('Release metrics must be finite percentages between 0 and 100.')
  }
  return Math.round(reviewCoverage * 0.35 + checksPassing * 0.4 + riskResolved * 0.25)
}

export function releaseTone(score) {
  if (score >= 90) return 'ready'
  if (score >= 70) return 'watch'
  return 'blocked'
}

export function relativeTime(minutes) {
  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  return `${hours}h ago`
}
