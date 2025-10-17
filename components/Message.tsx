import React, { useState, useRef, useEffect } from 'react';
import { Conversation } from '../types';
import { CONVERSATIONS } from '../constants';
import { SearchIcon } from './icons';

const Message: React.FC = () => {
    const [conversations, setConversations] = useState<Conversation[]>(CONVERSATIONS);
    const [selectedConversation, setSelectedConversation] = useState<Conversation>(conversations[0]);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [selectedConversation.messages]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        const updatedMessages = [...selectedConversation.messages, {
            id: `m${Date.now()}`,
            text: newMessage,
            sender: 'me' as const,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }];

        const updatedConversation = { ...selectedConversation, messages: updatedMessages };

        setSelectedConversation(updatedConversation);
        setConversations(prev => prev.map(c => c.id === updatedConversation.id ? updatedConversation : c));
        setNewMessage('');
    };

    return (
        <div className="flex h-[calc(100vh-10rem)] bg-white rounded-xl shadow-md overflow-hidden">
            {/* Sidebar */}
            <div className="w-1/3 border-r border-neutral-200 flex flex-col">
                <div className="p-4 border-b">
                    <h1 className="text-xl font-bold text-neutral-800">Messages</h1>
                     <div className="relative mt-2">
                        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                        <input type="text" placeholder="Search conversations..." className="pl-10 pr-4 py-2 w-full border border-neutral-300 rounded-lg text-sm"/>
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {conversations.map(convo => (
                        <button key={convo.id} onClick={() => setSelectedConversation(convo)} className={`w-full text-left p-4 flex items-center gap-4 hover:bg-neutral-100 ${selectedConversation.id === convo.id ? 'bg-primary-light' : ''}`}>
                            <img src={convo.participant.avatar} alt={convo.participant.name} className="w-12 h-12 rounded-full"/>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-baseline">
                                    <p className="font-semibold text-neutral-800 truncate">{convo.participant.name}</p>
                                    <p className="text-xs text-neutral-500">{convo.timestamp}</p>
                                </div>
                                <div className="flex justify-between items-center">
                                    <p className="text-sm text-neutral-500 truncate">{convo.lastMessage}</p>
                                    {convo.unreadCount > 0 && <span className="bg-primary text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">{convo.unreadCount}</span>}
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Chat Area */}
            <div className="w-2/3 flex flex-col">
                <div className="p-4 border-b flex items-center gap-4">
                    <img src={selectedConversation.participant.avatar} alt={selectedConversation.participant.name} className="w-12 h-12 rounded-full"/>
                    <div>
                        <h2 className="text-lg font-bold text-neutral-900">{selectedConversation.participant.name}</h2>
                        <p className="text-sm text-green-600">Online</p>
                    </div>
                </div>
                <div className="flex-1 p-6 overflow-y-auto bg-neutral-50">
                     <div className="space-y-4">
                        {selectedConversation.messages.map(msg => (
                            <div key={msg.id} className={`flex items-end gap-3 ${msg.sender === 'me' ? 'justify-end' : ''}`}>
                                {msg.sender === 'other' && <img src={selectedConversation.participant.avatar} alt="" className="w-8 h-8 rounded-full"/>}
                                <div className={`max-w-md p-3 rounded-lg ${msg.sender === 'me' ? 'bg-primary text-white rounded-br-none' : 'bg-white text-neutral-800 rounded-bl-none'}`}>
                                    <p>{msg.text}</p>
                                    <p className={`text-xs mt-1 ${msg.sender === 'me' ? 'text-primary-light/70' : 'text-neutral-400'}`}>{msg.timestamp}</p>
                                </div>
                                 {msg.sender === 'me' && <img src="https://i.pravatar.cc/150?img=5" alt="My Avatar" className="w-8 h-8 rounded-full"/>}
                            </div>
                        ))}
                         <div ref={messagesEndRef} />
                    </div>
                </div>
                 <div className="p-4 bg-white border-t">
                    <form onSubmit={handleSendMessage} className="flex items-center gap-4">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={e => setNewMessage(e.target.value)}
                            placeholder="Type a message..."
                            className="flex-1 px-4 py-2 border border-neutral-300 rounded-full bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        <button type="submit" className="bg-primary text-white rounded-full p-3 hover:bg-primary-dark">
                             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Message;
