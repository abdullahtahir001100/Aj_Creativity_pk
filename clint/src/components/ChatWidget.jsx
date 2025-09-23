import React, { useState, useEffect, useRef } from 'react';
import '../styles/chat.scss';

// SVG Icons as React Components for easier use
const SendIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
);
const ChatIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 21 1.65-3.8a9 9 0 1 1 3.4 2.9l-5.05.9_z_M9 10h.01M15 10h.01M12 10h.01"/></svg>
);
const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
);
const FullscreenIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>
);


const ChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    useEffect(() => {
        setMessages([{
            role: 'bot',
            text: 'Hello! How can I assist you with our jewelry collection today?'
        }]);
    }, []);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        const msgText = inputValue.trim();
        if (!msgText) return;

        const newMessages = [...messages, { role: 'user', text: msgText }];
        setMessages(newMessages);
        setInputValue('');
        setIsLoading(true);

        const sessionId = sessionStorage.getItem('chatSessionId');
        //lol
        try {
            const serverUrl = "https://aj-creativity-pk-8j7b.vercel.app/chat";     //uuu
            const res = await fetch(serverUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: msgText, sessionId: sessionId })
            });

            if (!res.ok) throw new Error(`Server error: ${res.status}`);
            
            const data = await res.json();
            
            if (data.sessionId && !sessionId) {
                sessionStorage.setItem('chatSessionId', data.sessionId);
            }

            if (data.reply) {
                setMessages([...newMessages, { role: 'bot', text: data.reply }]);
            } else {
                 setMessages([...newMessages, { role: 'bot', text: "⚠️ Sorry, I received an empty response." }]);
            }
        } catch (err) {
            setMessages([...newMessages, { role: 'bot', text: "⚠️ Network or Server Error. Please try again." }]);
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const renderMessageContent = (text) => {
        const imageUrlRegex = /(https?:\/\/[^\s]*\.(?:jpg|jpeg|png|gif|webp|svg))/gi;
        const imageUrl = text.match(imageUrlRegex);

        if (imageUrl) {
            const textPart = text.replace(imageUrlRegex, '').trim();
            return (
                <>
                    {textPart && <span dangerouslySetInnerHTML={{ __html: textPart }} />}
                    <img src={imageUrl[0]} alt="Product" className="chat-image" />
                </>
            );
        }
        
        return <span dangerouslySetInnerHTML={{ __html: text }} />;
    };

    return (
        <div className="chat-widget-container">
            <div className={`chat-window ${isOpen ? 'open' : ''} ${isFullScreen ? 'fullscreen' : ''}`}>
                <div className="chat-header">
                    <h3>Jave HandMade Assistant</h3>
                    <div className="header-icons">
                        <button onClick={() => setIsFullScreen(!isFullScreen)} className="header-icon-btn">
                           <FullscreenIcon />
                        </button>
                        <button onClick={() => setIsOpen(false)} className="header-icon-btn">
                            <CloseIcon />
                        </button>
                    </div>
                </div>

                <div className="messages-list">
                    {messages.map((msg, index) => (
                        <div key={index} className={`message ${msg.role}-message`}>
                            <div className="avatar">{msg.role === 'bot' ? '🤖' : '👤'}</div>
                            <div className="message-content">
                                {renderMessageContent(msg.text)}
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                            <div className="message bot-message">
                                <div className="avatar">🤖</div>
                                <div className="typing-indicator">
                                    <span></span><span></span><span></span>
                                </div>
                            </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <form className="chat-input-form" onSubmit={handleSendMessage}>
                    <input
                        type="text"
                        placeholder="Ask about our jewelry..."
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                    />
                    <button type="submit"><SendIcon /></button>
                </form>
            </div>

            <button className={`chat-toggle-button ${isOpen ? 'hidden' : ''}`} onClick={() => setIsOpen(true)}>
                <ChatIcon />
            </button>
        </div>
    );
};

export default ChatWidget;