import React from 'react'
// import { useAuthStore } from '../store/useAuthStore'
import BorderAnimatedContainer from '../components/BorderAnimatedContainer'
import ContactList from '../components/ContactList'
import ChatList from '../components/ChatList'
import AcitveTabSwitch from '../components/ActiveTabSwitch.jsx'
import ProfileHeader from '../components/ProfileHeader'
import ChatContainer from '../components/ChatContainer'
import NoConversationPlaceholder from '../components/NoConversationPlaceholder'
import { useChatStore } from '../store/useChatStore.js'

function ChatPage() {
  // const {logout} = useAuthStore()
  const {activeTab, selectedUser} = useChatStore()

  return (
    <div className="relative w-full max-w-6xl h-[800px]">
      <BorderAnimatedContainer>
        {/* Left Side */}
          <div className="w-80 bg-slate-800/50 backdrop-blur-sm flex flex-col">
            <ProfileHeader />
            <AcitveTabSwitch />
            <div className="flex-1 overflow-y-auto space-y-2 p-4">
              {activeTab === "chats" ? <ChatList /> : <ContactList />}
            </div>
          </div>
        {/* Right Side */}
          <div className="flex-1 flex flex-col bg-slate-900/50 backdrop-blur-sm">
            {selectedUser ? <ChatContainer /> : <NoConversationPlaceholder />}
          </div>
        </BorderAnimatedContainer>
    </div>
  )
}

export default ChatPage