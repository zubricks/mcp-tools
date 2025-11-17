'use client'

import { useConfig } from '@payloadcms/ui'
import Link from 'next/link'
import React from 'react'

export const LinkToContentHealth: React.FC = () => {
  const {
    config: {
      routes: { admin: adminRoute },
    },
  } = useConfig()

  return (
    <h4 className="nav__link">
      <Link href={`${adminRoute}/content-health`}>Content Health Audit</Link>
    </h4>
  )
}
