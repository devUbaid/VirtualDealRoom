const TypingIndicator = ({ user }) => {
  return (
    <div className="typing-indicator">
      <span>{user} is typing</span>
      <div className="typing-dots">
        <div className="typing-dot"></div>
        <div className="typing-dot"></div>
        <div className="typing-dot"></div>
      </div>
    </div>
  )
}

export default TypingIndicator

