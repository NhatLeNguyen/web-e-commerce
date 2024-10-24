import React, { useState } from "react";
import AppAppBar from "./appBar/AppBar";
import "./HomePage.scss";
import Banner from "./banner/Banner";
import ProductCategory from "./product-category/productCategory";
import axios from "axios";

const HomePage: React.FC = () => {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleSendMessage = async () => {
    try {
      const res = await axios.post(
        "https://web-e-commerce-xi.vercel.app/api/chat",
        { message }
      );
      const data = res.data as { choices: { message: { content: string } }[] };
      setResponse(data.choices[0].message.content);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="home-page">
      <AppAppBar />
      <Banner />
      <ProductCategory />
      <div className="chatbot-container">
        <button className="chatbot-button" onClick={() => setIsOpen(!isOpen)}>
          <img src="/chat-icon.png" alt="Chat" />
        </button>
        {isOpen && (
          <div className="chatbot-window">
            <div className="chatbot-header">
              <h3>Chatbot</h3>
              <button onClick={() => setIsOpen(false)}>X</button>
            </div>
            <div className="chatbot-body">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message here..."
              />
              <button onClick={handleSendMessage}>Send</button>
              <div className="chatbot-response">{response}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default HomePage;
