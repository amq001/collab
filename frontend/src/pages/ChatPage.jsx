import React from 'react'
import { useAuthStore } from '../store/useAuthStore'

function ChatPage() {
  const {logout} = useAuthStore()

  return (
    <div className="text-white z-10">
      {/* ChatPage */}
      <button onClick={logout} className="z-10 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded">
        Logout
      </button>
    </div>
  )
}

export default ChatPage