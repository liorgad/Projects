import { useEffect } from 'react'
import dynamic from 'next/dynamic'

// Dynamically import the App component to avoid SSR issues with React Router
const App = dynamic(() => import('../src/App'), {
  ssr: false,
  loading: () => <div>Loading...</div>
})

export default function CatchAll() {
  useEffect(() => {
    // This ensures any React Router navigation works properly
    if (typeof window !== 'undefined') {
      // Force React Router to handle routing
      window.history.replaceState(null, '', window.location.pathname)
    }
  }, [])

  return <App />
} 