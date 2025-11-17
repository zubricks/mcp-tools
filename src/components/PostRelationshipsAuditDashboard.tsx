'use client'

import React, { useState } from 'react'
import { Button } from '@payloadcms/ui'

type AuditResult = {
  success: boolean
  summary: {
    totalAudited: number
    totalIssues: number
    healthScore: number
    autoFixApplied: boolean
  }
  breakdown: {
    missingBoth: number
    missingCategories: number
    missingRelatedPosts: number
    complete: number
  }
  details: {
    missingBoth: Array<{ id: string; slug: string; title: string }>
    missingCategories: Array<{ id: string; slug: string; title: string; relatedPostsCount: number }>
    missingRelatedPosts: Array<{ id: string; slug: string; title: string; categoriesCount: number }>
    complete: Array<{
      id: string
      slug: string
      title: string
      categoriesCount: number
      relatedPostsCount: number
    }>
  }
}

export const PostRelationshipsAuditDashboard: React.FC = () => {
  const [auditResult, setAuditResult] = useState<AuditResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const runAudit = async (autoFix: boolean = false) => {
    setLoading(true)
    setError(null)

    try {
      // Call our custom API route that runs the job immediately
      const response = await fetch('/api/audit-posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          limit: 50,
          includeUnpublished: false,
          autoFix,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to run audit job')
      }

      const result = await response.json()

      if (result.success && result.output) {
        setAuditResult(result.output)
      } else {
        throw new Error(result.error || 'Unknown error occurred')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred')
    } finally {
      setLoading(false)
    }
  }

  const getHealthColor = (score: number) => {
    if (score >= 80) return '#10b981' // green
    if (score >= 50) return '#f59e0b' // orange
    return '#ef4444' // red
  }

  return (
    <div
      style={{
        padding: '24px',
        backgroundColor: '#f9fafb',
        borderRadius: '8px',
        marginBottom: '24px',
        border: '1px solid #e5e7eb',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
        }}
      >
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '4px' }}>
            📊 Post Relationships Health
          </h2>
          <p style={{ fontSize: '14px', color: '#6b7280' }}>
            Check if posts have categories and related posts assigned
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Button onClick={() => runAudit(false)} disabled={loading} buttonStyle="secondary">
            {loading ? 'Running...' : 'Run Audit'}
          </Button>
          <Button onClick={() => runAudit(true)} disabled={loading} buttonStyle="primary">
            {loading ? 'Running...' : 'Run & Auto-Fix'}
          </Button>
        </div>
      </div>

      {error && (
        <div
          style={{
            padding: '12px',
            backgroundColor: '#fee2e2',
            border: '1px solid #fecaca',
            borderRadius: '6px',
            marginBottom: '16px',
            color: '#991b1b',
          }}
        >
          <strong>Error:</strong> {error}
        </div>
      )}

      {auditResult && (
        <div>
          {/* Health Score */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '16px',
              marginBottom: '24px',
            }}
          >
            <div
              style={{
                padding: '16px',
                backgroundColor: 'white',
                borderRadius: '8px',
                border: '1px solid #e5e7eb',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  fontSize: '32px',
                  fontWeight: '700',
                  color: getHealthColor(auditResult.summary.healthScore),
                }}
              >
                {auditResult.summary.healthScore}%
              </div>
              <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                Health Score
              </div>
            </div>

            <div
              style={{
                padding: '16px',
                backgroundColor: 'white',
                borderRadius: '8px',
                border: '1px solid #e5e7eb',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '32px', fontWeight: '700' }}>
                {auditResult.summary.totalAudited}
              </div>
              <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                Posts Audited
              </div>
            </div>

            <div
              style={{
                padding: '16px',
                backgroundColor: 'white',
                borderRadius: '8px',
                border: '1px solid #e5e7eb',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '32px', fontWeight: '700', color: '#ef4444' }}>
                {auditResult.summary.totalIssues}
              </div>
              <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                Issues Found
              </div>
            </div>

            <div
              style={{
                padding: '16px',
                backgroundColor: 'white',
                borderRadius: '8px',
                border: '1px solid #e5e7eb',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '32px', fontWeight: '700', color: '#10b981' }}>
                {auditResult.breakdown.complete}
              </div>
              <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>Complete</div>
            </div>
          </div>

          {/* Breakdown */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '16px',
              marginBottom: '16px',
            }}
          >
            <div
              style={{
                padding: '16px',
                backgroundColor: 'white',
                borderRadius: '8px',
                border: '2px solid #fecaca',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '20px', marginRight: '8px' }}>🔴</span>
                <span style={{ fontWeight: '600', fontSize: '14px' }}>Missing Both</span>
              </div>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#dc2626' }}>
                {auditResult.breakdown.missingBoth}
              </div>
              <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                No categories & no related posts
              </div>
            </div>

            <div
              style={{
                padding: '16px',
                backgroundColor: 'white',
                borderRadius: '8px',
                border: '2px solid #fde68a',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '20px', marginRight: '8px' }}>🟡</span>
                <span style={{ fontWeight: '600', fontSize: '14px' }}>Missing Categories</span>
              </div>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#d97706' }}>
                {auditResult.breakdown.missingCategories}
              </div>
              <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                Has related posts but no categories
              </div>
            </div>

            <div
              style={{
                padding: '16px',
                backgroundColor: 'white',
                borderRadius: '8px',
                border: '2px solid #fed7aa',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '20px', marginRight: '8px' }}>🟠</span>
                <span style={{ fontWeight: '600', fontSize: '14px' }}>Missing Related Posts</span>
              </div>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#ea580c' }}>
                {auditResult.breakdown.missingRelatedPosts}
              </div>
              <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                Has categories but no related posts
              </div>
            </div>
          </div>

          {/* Auto-fix indicator */}
          {auditResult.summary.autoFixApplied && (
            <div
              style={{
                padding: '12px',
                backgroundColor: '#dbeafe',
                border: '1px solid #93c5fd',
                borderRadius: '6px',
                fontSize: '14px',
                color: '#1e40af',
              }}
            >
              ✅ <strong>Auto-fix applied!</strong> Posts with issues have been automatically
              updated with suggested categories and related posts.
            </div>
          )}
        </div>
      )}

      {!auditResult && !loading && (
        <div
          style={{
            textAlign: 'center',
            padding: '40px',
            color: '#6b7280',
            fontSize: '14px',
          }}
        >
          Click "Run Audit" to check your posts' relationship health
        </div>
      )}
    </div>
  )
}
