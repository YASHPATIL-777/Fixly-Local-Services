import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import ChatView from '../components/chat/ChatView';

export default function ChatPage() {
  const { id, requestId } = useParams();
  const navigate = useNavigate();
  const targetRequestId = id || requestId;

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <Navbar />
      <main className="container max-w-6xl mx-auto px-4 py-2 flex-1">
        <ChatView requestId={targetRequestId} onBack={handleBack} />
      </main>
      <Footer />
    </div>
  );
}
