'use client'
import React, { useEffect, useState } from 'react'
import { Button, CopyToClipboard, useDocumentInfo } from '@payloadcms/ui'
import './UserApiKeyField.scss'

// Eye Icon component
const EyeIcon: React.FC<{ active?: boolean }> = ({ active = true }) => (
  <svg
    className="icon icon--eye"
    viewBox="0 0 16 12"
    xmlns="http://www.w3.org/2000/svg"
    style={{ width: '16px', height: '12px' }}
  >
    {!active ? (
      <>
        <circle className="stroke" cx="8.5" cy="6" r="2.5" />
        <path
          className="stroke"
          d="M8.5 1C3.83333 1 1.5 6 1.5 6C1.5 6 3.83333 11 8.5 11C13.1667 11 15.5 6 15.5 6C15.5 6 13.1667 1 8.5 1Z"
        />
      </>
    ) : (
      <path
        className="stroke"
        d="M2 11.5L4.35141 9.51035M15 0.5L12.6486 2.48965M10.915 6.64887C10.6493 7.64011 9.78959 8.38832 8.7408 8.48855M10.4085 4.38511C9.94992 3.84369 9.2651 3.5 8.5 3.5C7.11929 3.5 6 4.61929 6 6C6 6.61561 6.22251 7.17926 6.59149 7.61489M10.4085 4.38511L6.59149 7.61489M10.4085 4.38511L12.6486 2.48965M6.59149 7.61489L4.35141 9.51035M14.1292 3.92915C15.0431 5.02085 15.5 6 15.5 6C15.5 6 13.1667 11 8.5 11C7.67995 11 6.93195 10.8456 6.256 10.5911M4.35141 9.51035C2.45047 8.03672 1.5 6 1.5 6C1.5 6 3.83333 1 8.5 1C10.1882 1 11.5711 1.65437 12.6486 2.48965"
      />
    )}
  </svg>
)

const baseClass = 'user-api-key-field'

export const UserApiKeyField: React.FC = () => {
  const [showKey, setShowKey] = useState(false)
  const [apiKey, setApiKey] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  
  // Get the user ID from the document info
  const { id: userId } = useDocumentInfo()

  useEffect(() => {
    const fetchApiKey = async () => {
      if (!userId) {
        setLoading(false)
        return
      }

      try {
        // Fetch the API key for this user from the payload-mcp-api-keys collection
        const response = await fetch(`/api/payload-mcp-api-keys?where[user][equals]=${userId}&depth=0&limit=1`)
        const data = await response.json()
        
        if (data.docs && data.docs.length > 0) {
          setApiKey(data.docs[0].apiKey)
        }
      } catch (error) {
        console.error('Error fetching API key:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchApiKey()
  }, [userId])

  if (loading) {
    return <div className={baseClass}>Loading API key...</div>
  }

  if (!apiKey) {
    return (
      <div className={baseClass}>
        <div className={`${baseClass}__no-key`}>
          <p>No API key found for this user.</p>
          <p style={{ fontSize: '0.875rem', color: 'var(--theme-elevation-500)' }}>
            Create one in the <a href="/admin/collections/payload-mcp-api-keys/create">API Keys collection</a>.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={`${baseClass} field-type read-only`}>
      <label className={`${baseClass}__label field-label`}>
        <span>MCP API Key</span>
        <CopyToClipboard value={apiKey} />
      </label>
      <div className={`${baseClass}__input-wrap`}>
        <input
          disabled
          type={showKey ? 'text' : 'password'}
          value={apiKey}
          className={`${baseClass}__input`}
          aria-label="MCP API Key"
        />
        <div className={`${baseClass}__toggle-button-wrap`}>
          <Button
            buttonStyle="none"
            className={`${baseClass}__toggle-button`}
            icon={<EyeIcon active={showKey} />}
            onClick={() => setShowKey((prev) => !prev)}
          />
        </div>
      </div>
    </div>
  )
}

