import "./ChatBotModal.scss";

export default function ChatbotPage() {
  return (
    <div className="chatbot-page">
      <header className="hero">
        <h1>Chatbot</h1>
        <p>
          Interact with our intelligent assistant to get personalized
          recommendations and support.
        </p>
      </header>
      <section className="chatbot-content">
        <div className="chat-container">
          <div className="chat-placeholder">
            <p>
              This is where your chatbot will live! Integrate your Google Colab
              logic here.
            </p>
            <div className="message-bubble">
              Hello! How can I assist you today?
            </div>
          </div>
          <div className="input-area">
            <input type="text" placeholder="Type your message..." disabled />
            <button disabled>Send</button>
          </div>
        </div>
      </section>
    </div>
  );
}
