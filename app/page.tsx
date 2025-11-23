'use client'

import dynamic from 'next/dynamic'
import { Suspense } from 'react'

const Scene = dynamic(() => import('./Scene'), { ssr: false })

export default function Home() {
  return (
    <main className="container">
      <h1 className="title">CYBER CONTAINER</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <Scene />
      </Suspense>
    </main>
  )
}
