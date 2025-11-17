'use client'

import React from 'react'
import { Button } from '@payloadcms/ui'
import './styles.scss'

type Props = {
  adminRoute: string
}

export const ContentHealthClient: React.FC<Props> = ({ adminRoute }) => {
  return (
    <div className="content-health-audit">
      <div className="content-health-audit__header">
        <h1>Content Health Audit</h1>
        <p className="content-health-audit__description">
          Use the MCP <code>analyzeContentHealth</code> tool to analyze all published posts and get
          insights on content quality, SEO optimization, and editorial recommendations.
        </p>
      </div>

      <div className="content-health-audit__info">
        <h3>What This Audit Analyzes</h3>
        <div className="content-health-audit__info-grid">
          <div className="content-health-audit__info-card">
            <h4>🚨 Critical Issues</h4>
            <ul>
              <li>Missing meta descriptions</li>
              <li>Poor title lengths (too long/short)</li>
              <li>Thin content (&lt;300 words)</li>
            </ul>
          </div>

          <div className="content-health-audit__info-card">
            <h4>⚠️ High Priority</h4>
            <ul>
              <li>Outdated posts (365+ days old)</li>
              <li>Poor readability scores</li>
              <li>Missing featured images</li>
              <li>Broken internal structure</li>
            </ul>
          </div>

          <div className="content-health-audit__info-card">
            <h4>📊 Medium Priority</h4>
            <ul>
              <li>Content needing refresh (180-365 days)</li>
              <li>Suboptimal keyword usage</li>
              <li>Low engagement potential</li>
            </ul>
          </div>

          <div className="content-health-audit__info-card">
            <h4>💡 Content Strategy</h4>
            <ul>
              <li>Topic overlap analysis</li>
              <li>Content gaps identification</li>
              <li>Performance patterns</li>
              <li>Seasonal content updates</li>
            </ul>
          </div>
        </div>

        <div className="content-health-audit__mcp-info">
          <h4>How to Use This Tool</h4>
          <p>
            This tool integrates with the <strong>MCP (Model Context Protocol) plugin</strong>. To
            run a comprehensive content health audit:
          </p>
          <ol>
            <li>
              <strong>In Cursor or Claude Desktop:</strong> Open your AI assistant and ask:
              <div className="content-health-audit__code-block">
                <code>&quot;Use the analyzeContentHealth tool to audit my content&quot;</code>
              </div>
            </li>
            <li>
              <strong>With custom parameters:</strong> You can specify options:
              <div className="content-health-audit__code-block">
                <code>
                  &quot;Run analyzeContentHealth with limit 100 and includeUnpublished true&quot;
                </code>
              </div>
            </li>
            <li>
              The AI will analyze all your posts and provide a comprehensive report with:
              <ul>
                <li>Overall health score (0-100)</li>
                <li>Categorized issues by priority</li>
                <li>Specific action items for each post</li>
                <li>Content strategy recommendations</li>
              </ul>
            </li>
          </ol>

          <div className="content-health-audit__recommendation">
            <strong>💡 Pro Tip:</strong> Run this audit monthly to maintain high content quality and
            SEO performance. The AI will identify trends and provide strategic recommendations based
            on your entire content library.
          </div>
        </div>

        <div className="content-health-audit__other-tools">
          <h4>Other Available MCP Tools</h4>
          <div className="content-health-audit__tools-list">
            <div className="content-health-audit__tool-card">
              <h5>
                <code>draftReleaseNotes</code>
              </h5>
              <p>Summarize the latest posts into bullet points for release notes</p>
            </div>
            <div className="content-health-audit__tool-card">
              <h5>
                <code>summarizePostBySlug</code>
              </h5>
              <p>Analyze and summarize a single post by its slug</p>
            </div>
            <div className="content-health-audit__tool-card">
              <h5>
                <code>suggestSEOMetadata</code>
              </h5>
              <p>Get SEO-friendly meta title and description suggestions for a post</p>
            </div>
          </div>
        </div>

        <div className="content-health-audit__actions">
          <Button el="link" to={`${adminRoute}`}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    </div>
  )
}
