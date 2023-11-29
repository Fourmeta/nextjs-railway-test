import React, {useEffect, useRef, useState} from 'react';

import {DotLottiePlayer} from '@dotlottie/react-player';
import '@dotlottie/react-player/dist/index.css';
import {PaperPlaneTilt, Sparkle, X} from '@phosphor-icons/react';
import classNames from 'classnames';
import {useSearchParams} from 'next/navigation';
import {io} from 'socket.io-client';
import {v4 as uuidv4} from 'uuid';

import {ThreeDotsLoader, wait} from '@/modules/core';

type MessageType = {
  id: string;
  message: string;
  direction: 'incoming' | 'outgoing';
  products?: ProductType[];
};

type ProductType = {
  id: string;
  title: string;
  imageUrl: string;
  productUrl: string;
  price?: number;
};

type ReplyType = {
  title: string;
};

// TODO: highlight email in the message
// TODO: reset textarea height after message is sent
// TODO: use different styles for different sites?

// NOTE: after Slush
// TODO: refactor
// TODO: divide into components

const ChatPage = () => {
  const chatBox = useRef<HTMLDivElement>(null);
  const chatInput = useRef<HTMLTextAreaElement>(null);

  const searchParams = useSearchParams();
  const assistantId = searchParams.get('assistantId');

  const [chatId, setChatId] = useState<string>('');
  const [isChatOpened, setIsChatOpened] = useState<boolean>(false);
  const [isCTAVisible, setUsCTAVisible] = useState<boolean>(false);
  const [isAITyping, setIsAITyping] = useState<boolean>(false);
  const [currentMessage, setCurrentMessage] = useState<string>('');
  const [quickReplies, setQuickReplies] = useState<ReplyType[]>([]);
  const [messages, setMessages] = useState<MessageType[]>([
    {
      id: '1',
      message:
        'Hello, Iʼm your shopping assistant. How can I help you today? Is there anything you would like me to help you with?',
      direction: 'incoming',
    },
  ]);

  const sendMessage = async (message: string) => {
    if (!message) return;

    const newMessage: MessageType = {
      id: uuidv4(),
      message,
      direction: 'outgoing',
    };

    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setCurrentMessage('');
    setQuickReplies([]);
    setIsAITyping(true);

    // TODO: add file upload

    const response = await fetch('/api/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chatId,
        assistantId,
        ...newMessage,
      }),
    });

    if (!response.ok) {
      setIsAITyping(false);
      console.error('Failed to send message:', response.statusText);
    }
  };

  const openChatModal = () => {
    setIsChatOpened(true);
    wait(1000).then(() => setUsCTAVisible(false));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(currentMessage);
    }
  };

  // const handleImageUpload = (e) => {
  //   e.preventDefault();

  //   const file = e.target.files[0];
  //   const reader = new FileReader();
  //   reader.readAsDataURL(file);
  //   reader.onloadend = () => {
  //     this.setState({
  //       file: file,
  //       base64: reader.result
  //     });
  //     this.handleSubmit()
  //   };
  // }

  useEffect(() => {
    setChatId(uuidv4());
    wait(2000).then(() => setUsCTAVisible(true));
  }, []);

  useEffect(() => {
    const inputInitHeight = chatInput.current?.scrollHeight || 0;

    const handleInput = () => {
      if (chatInput.current) {
        chatInput.current.style.height = `${inputInitHeight}px`;
        chatInput.current.style.height = `${chatInput.current.scrollHeight}px`;
      }
    };

    if (chatInput.current) {
      chatInput.current.addEventListener('input', handleInput);
    }

    return () => {
      if (chatInput.current) {
        chatInput.current.removeEventListener('input', handleInput);
      }
    };
  }, []);

  useEffect(() => {
    if (chatInput.current) {
      const {scrollHeight} = chatInput.current;
      chatInput.current.style.height = '32px';
      chatInput.current.style.height = `${scrollHeight}px`;
    }
  }, [currentMessage]);

  useEffect(() => {
    if (chatBox.current && messages.length) {
      const {scrollHeight} = chatBox.current;
      chatBox.current.scrollTo(0, scrollHeight);
    }
  }, [messages]);

  useEffect(() => {
    console.log('chatId', chatId);

    const URL = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:4000';
    const socket = io(URL);

    socket.emit('joinChatRoom', chatId);
    socket.on('receiveMessage', (data) => {
      const {message, products, buttons} = data;
      if (buttons.length) {
        setQuickReplies(buttons);
      }

      if (products?.length) {
        const dummyMessage: MessageType = {
          id: uuidv4(),
          message: 'I have this recommendation for you',
          direction: 'incoming',
          products,
        };
        setMessages((prevMessages) => [...prevMessages, dummyMessage]);
      }

      setMessages((prevMessages) => [...prevMessages, message]);
      setIsAITyping(false);
    });

    return () => {
      socket.disconnect();
    };
  }, [chatId]);

  return (
    <div
      className={classNames(
        'absolute bottom-0 right-0 h-full w-full sm:bottom-6 sm:right-6',
      )}>
      <div className='absolute bottom-6 right-6 flex flex-col items-end space-y-5'>
        <div
          onClick={openChatModal}
          className={classNames(
            'flex flex-col items-center justify-center rounded-lg bg-white',
            'w-58 p-4 font-medium text-neutrals-800 shadow-lg sm:w-full',
            'cursor-pointer transition-all duration-300 ease-out',
            {'invisible translate-y-12 transform opacity-0': !isCTAVisible},
          )}>
          <p>👋 Hey, struggling to buy? Let’s have a chat! 👇</p>
        </div>
        <button
          type='button'
          onClick={openChatModal}
          className={classNames(
            'flex h-15 w-15 items-center justify-center rounded-full',
            'bg-primary-600 shadow-md transition-all duration-300',
          )}>
          <Sparkle className='h-7 w-7 text-white' weight='fill' />
        </button>
      </div>
      <div
        className={classNames(
          'absolute bottom-0 right-0 h-full w-full sm:h-[calc(100vh-1.5rem)] sm:w-108',
          'flex transform flex-col border border-neutrals-200 bg-white',
          'overflow-hidden shadow-lg transition-all duration-300 sm:rounded-2xl',
          'origin-bottom-right',
          {'-z-10 scale-50 opacity-0': !isChatOpened},
          {'z-10': isChatOpened},
        )}>
        <div className='relative border-b border-neutrals-200 px-5 py-3.5 text-neutrals-800'>
          <h3 className='font-semibold'>Shop Assistant</h3>
          <button
            type='button'
            onClick={() => setIsChatOpened(false)}
            className='absolute right-4 top-1/2 -translate-y-1/2'>
            <X className='h-5 w-5 text-neutrals-500' weight='bold' />
          </button>
        </div>
        <div
          ref={chatBox}
          className='flex h-full flex-col gap-y-5 overflow-y-auto p-5 pb-3'>
          {messages.map((message) => (
            <div
              key={`message-${message.id}`}
              className={classNames('flex w-full gap-2', {
                'justify-end': message.direction === 'outgoing',
              })}>
              {message.direction === 'incoming' && (
                <div
                  className={classNames(
                    'flex h-7 w-7 items-center justify-center bg-primary-100',
                    'shrink-0 basis-7 rounded-full',
                  )}>
                  <Sparkle
                    className='h-3.5 w-3.5 text-primary-600'
                    weight='fill'
                  />
                </div>
              )}
              <div
                className={classNames(
                  'flex max-w-full flex-col px-4 py-3',
                  'overflow-hidden rounded-bl-xl rounded-br-xl',
                  {
                    'rounded-tl-xl rounded-tr bg-primary-100':
                      message.direction === 'outgoing',
                    'rounded-tl rounded-tr-xl bg-neutrals-100':
                      message.direction === 'incoming',
                  },
                )}>
                <p className='font-medium text-neutrals-800'>
                  {message.message}
                </p>
                {(message.products || []).length > 0 && (
                  <div className='mt-2 grid grid-cols-2 gap-1'>
                    {message.products?.map((product) => (
                      <div
                        key={`product-${product.id}`}
                        className={classNames(
                          'flex h-full flex-col overflow-hidden rounded-lg',
                        )}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={product.imageUrl}
                          alt={product.title}
                          className='h-40 object-cover'
                        />
                        <div className='flex h-full flex-col justify-between gap-1 bg-white px-3 py-2'>
                          <p className='text-sm font-semibold text-neutrals-800'>
                            {product.title}
                          </p>
                          {product?.price && (
                            <p className='text-xs text-neutrals-600'>
                              {product.price}
                            </p>
                          )}
                          <a
                            href={product.productUrl}
                            target='_blank'
                            className={classNames(
                              'flex w-full items-center justify-center rounded-md',
                              'bg-primary-600 p-2 text-xs font-medium text-white',
                            )}
                            rel='noreferrer'>
                            Buy now
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          {isAITyping && (
            <div className={classNames('flex w-full gap-2')}>
              <div
                className={classNames(
                  'flex h-7 w-7 items-center justify-center bg-primary-100',
                  'shrink-0 basis-7 rounded-full',
                )}>
                <Sparkle
                  className='h-3.5 w-3.5 text-primary-600'
                  weight='fill'
                />
              </div>
              <div
                className={classNames(
                  'flex max-w-full flex-col px-4 py-3',
                  'overflow-hidden rounded-bl-xl rounded-br-xl',
                  'rounded-tl rounded-tr-xl bg-neutrals-100',
                )}>
                <DotLottiePlayer
                  className='!h-6 !w-7'
                  src={ThreeDotsLoader}
                  autoplay
                  loop
                />
              </div>
            </div>
          )}
        </div>
        <div className='rounded-lg bg-white p-5 pt-2'>
          {quickReplies.length > 0 && (
            <div className='mb-2 flex flex-wrap gap-2'>
              {quickReplies.map((reply) => (
                <button
                  type='button'
                  key={reply.title}
                  className='overflow-hidden whitespace-pre rounded-md bg-primary-100 px-2 py-1.5 text-primary-700'
                  onClick={() => sendMessage(reply.title)}>
                  {reply.title}
                </button>
              ))}
            </div>
          )}
          <div
            className={classNames(
              'flex w-full items-center gap-1 overflow-hidden p-2 py-2.5 pl-4',
              'rounded-md border border-neutrals-200 bg-neutrals-50 ',
            )}>
            <textarea
              ref={chatInput}
              className={classNames(
                'max-h-[74px] w-full flex-1 resize-none bg-transparent',
                'placeholder:text-neutrals-500 focus:outline-none focus:ring-0',
              )}
              placeholder='Send a message'
              onChange={(e) => setCurrentMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              spellCheck={false}
              value={currentMessage}
              rows={1}
              required
            />
            <button
              type='button'
              onClick={() => sendMessage(currentMessage)}
              className='flex h-8 w-8 items-center justify-center rounded-md bg-primary-600'>
              <PaperPlaneTilt className='h-4 w-4 text-white' weight='bold' />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
