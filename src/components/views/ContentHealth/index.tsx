import type { AdminViewServerProps } from 'payload'
import React from 'react'
import { ContentHealthClient } from './client'

export function ContentHealthView({ initPageResult }: AdminViewServerProps) {
  const {
    req: {
      payload: {
        config: {
          routes: { admin: adminRoute },
        },
      },
    },
  } = initPageResult

  return <ContentHealthClient adminRoute={adminRoute} />
}
