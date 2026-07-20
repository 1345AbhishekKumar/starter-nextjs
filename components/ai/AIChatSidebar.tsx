'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  X,
  Send,
  Bot,
  User,
  Sparkles,
  Loader2,
  Trash2,
  AlertCircle,
} from 'lucide-react';
import { useUIStore } from '@/store/ui';
import { useAIModels } from '@/hooks/use-drafts';
import { sendAIChatMessage } from '@/actions/ai-chat';
import { type ChatMessage } from '@/lib/validations/ai-chat';

export function AIChatSidebar() {
  const { isAIChatOpen, aiInitialPrompt, closeAIChat } = useUIStore();
  const { data: models, isLoading: isLoadingModels } = useAIModels();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [selectedModel, setSelectedModel] = useState(
    'nvidia/moonshotai/kimi-k2.6',
  );
  const [isSending, setIsSending] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const initialProcessedRef = useRef<string | null>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages, scrollToBottom]);

  // Handle ESC key to close sidebar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isAIChatOpen) {
        closeAIChat();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAIChatOpen, closeAIChat]);

  // Send message handler
  const handleSendMessage = useCallback(
    async (textToSend: string) => {
      const trimmed = textToSend.trim();
      if (!trimmed || isSending) return;

      setErrorMsg(null);
      const userMsg: ChatMessage = {
        id: `user-${Date.now()}`,
        role: 'user',
        content: trimmed,
        createdAt: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
      };

      const newHistory = [...messages, userMsg];
      setMessages(newHistory);
      setInput('');
      setIsSending(true);

      const res = await sendAIChatMessage({
        message: trimmed,
        modelId: selectedModel,
        history: messages,
      });

      setIsSending(false);

      if (res.success && res.message) {
        const assistantMsg: ChatMessage = {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: res.message,
          createdAt: new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
        };
        setMessages((prev) => [...prev, assistantMsg]);
      } else {
        setErrorMsg(res.error || 'Failed to get response from AI assistant.');
      }
    },
    [isSending, messages, selectedModel],
  );

  // Auto-send initial prompt if passed from search modal
  useEffect(() => {
    if (
      isAIChatOpen &&
      aiInitialPrompt &&
      initialProcessedRef.current !== aiInitialPrompt
    ) {
      initialProcessedRef.current = aiInitialPrompt;
      handleSendMessage(aiInitialPrompt);
    }
  }, [isAIChatOpen, aiInitialPrompt, handleSendMessage]);

  // Focus input when opened
  useEffect(() => {
    if (isAIChatOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      initialProcessedRef.current = null;
    }
  }, [isAIChatOpen]);

  if (!isAIChatOpen) return null;

  return (
    <div className='fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-xs'>
      <div className='fixed inset-y-0 right-0 flex max-w-full pl-10'>
        <div className='flex w-screen max-w-md flex-col border-l border-[#111111]/20 bg-white shadow-2xl transition-all duration-300'>
          {/* Header */}
          <div className='flex items-center justify-between border-b border-[#111111]/10 bg-[#111111]/[0.02] px-5 py-4'>
            <div className='flex items-center gap-2'>
              <div className='flex size-8 items-center justify-center rounded-full bg-[#111111] text-white'>
                <Sparkles size={16} />
              </div>
              <div>
                <h3 className='text-sm font-semibold text-[#111111]'>
                  AI Assistant
                </h3>
                <p className='font-mono-custom text-[10px] tracking-wider text-[#111111]/50 uppercase'>
                  Meadow Intelligence
                </p>
              </div>
            </div>

            <div className='flex items-center gap-1'>
              {messages.length > 0 && (
                <button
                  onClick={() => setMessages([])}
                  title='Clear conversation'
                  className='rounded p-1.5 text-[#111111]/50 transition-colors hover:bg-[#111111]/5 hover:text-[#111111]'
                >
                  <Trash2 size={16} />
                </button>
              )}
              <button
                onClick={closeAIChat}
                className='rounded p-1.5 text-[#111111]/50 transition-colors hover:bg-[#111111]/5 hover:text-[#111111]'
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Model Selection Bar */}
          <div className='flex items-center justify-between border-b border-[#111111]/10 bg-[#111111]/[0.01] px-5 py-2.5'>
            <label className='font-mono-custom text-[10px] tracking-wider text-[#111111]/60 uppercase'>
              Model:
            </label>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              disabled={isLoadingModels || isSending}
              className='font-mono-custom rounded border border-[#111111]/20 bg-white px-2 py-1 text-xs text-[#111111] focus:border-[#111111] focus:outline-hidden'
            >
              {isLoadingModels ? (
                <option>Loading models...</option>
              ) : (
                models?.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))
              )}
            </select>
          </div>

          {/* Message List */}
          <div className='flex-1 space-y-4 overflow-y-auto p-5'>
            {messages.length === 0 ? (
              <div className='flex h-full flex-col items-center justify-center px-4 py-12 text-center'>
                <div className='mb-3 rounded-full bg-[#111111]/5 p-4 text-[#111111]/60'>
                  <Bot size={28} />
                </div>
                <h4 className='mb-1 text-sm font-semibold text-[#111111]'>
                  How can I help you today?
                </h4>
                <p className='max-w-xs font-sans text-xs text-[#111111]/60'>
                  Ask me questions, draft reflections, request summaries, or
                  explore Meadow app capabilities.
                </p>
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${
                    msg.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {msg.role === 'assistant' && (
                    <div className='mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-[#111111] text-white'>
                      <Bot size={14} />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] rounded-lg p-3 text-xs leading-relaxed ${
                      msg.role === 'user'
                        ? 'rounded-br-none bg-[#111111] text-white'
                        : 'rounded-bl-none border border-[#111111]/10 bg-[#111111]/5 text-[#111111]'
                    }`}
                  >
                    <div className='whitespace-pre-wrap'>{msg.content}</div>
                    {msg.createdAt && (
                      <div
                        className={`font-mono-custom mt-1 text-right text-[9px] ${
                          msg.role === 'user'
                            ? 'text-white/60'
                            : 'text-[#111111]/40'
                        }`}
                      >
                        {msg.createdAt}
                      </div>
                    )}
                  </div>

                  {msg.role === 'user' && (
                    <div className='mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full border border-[#111111]/20 bg-[#111111]/10 text-[#111111]'>
                      <User size={14} />
                    </div>
                  )}
                </div>
              ))
            )}

            {isSending && (
              <div className='flex items-center justify-start gap-3'>
                <div className='flex size-7 shrink-0 items-center justify-center rounded-full bg-[#111111] text-white'>
                  <Bot size={14} />
                </div>
                <div className='flex items-center gap-2 rounded-lg border border-[#111111]/10 bg-[#111111]/5 p-3 text-xs text-[#111111]/60'>
                  <Loader2 size={14} className='animate-spin' />
                  Thinking...
                </div>
              </div>
            )}

            {errorMsg && (
              <div className='flex items-center gap-2 rounded-md border border-red-200 bg-red-50 p-3 text-xs text-red-700'>
                <AlertCircle size={14} className='shrink-0' />
                <span>{errorMsg}</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Footer Input */}
          <div className='border-t border-[#111111]/10 bg-white p-4'>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(input);
              }}
              className='flex items-center gap-2'
            >
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage(input);
                  }
                }}
                placeholder='Ask AI Assistant anything...'
                rows={1}
                disabled={isSending}
                className='flex-1 resize-none rounded-md border border-[#111111]/20 bg-[#111111]/[0.02] p-2.5 font-sans text-xs text-[#111111] placeholder-[#111111]/40 transition-all focus:border-[#111111] focus:outline-hidden'
              />
              <button
                type='submit'
                disabled={!input.trim() || isSending}
                className='flex size-9 shrink-0 items-center justify-center rounded-md bg-[#111111] text-white transition-colors hover:bg-[#111111]/90 disabled:opacity-40 disabled:hover:bg-[#111111]'
              >
                {isSending ? (
                  <Loader2 size={14} className='animate-spin' />
                ) : (
                  <Send size={14} />
                )}
              </button>
            </form>
            <div className='font-mono-custom mt-2 text-center text-[10px] text-[#111111]/40'>
              Press Enter to send, Shift + Enter for new line
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
