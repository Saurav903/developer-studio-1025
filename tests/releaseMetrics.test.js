import test from 'node:test'
import assert from 'node:assert/strict'
import { calculateReadiness, releaseTone, relativeTime } from '../src/lib/releaseMetrics.js'

test('calculates weighted release readiness', () => {
  assert.equal(calculateReadiness({ reviewCoverage: 80, checksPassing: 100, riskResolved: 60 }), 83)
})

test('rejects percentages outside the usable range', () => {
  assert.throws(() => calculateReadiness({ reviewCoverage: 120, checksPassing: 90, riskResolved: 90 }), TypeError)
})

test('maps release status and elapsed time into clear labels', () => {
  assert.equal(releaseTone(91), 'ready')
  assert.equal(releaseTone(72), 'watch')
  assert.equal(releaseTone(44), 'blocked')
  assert.equal(relativeTime(0), 'just now')
  assert.equal(relativeTime(74), '1h ago')
})
