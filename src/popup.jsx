import React, { useState, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

const Popup = () => {
    const [status, setStatus] = useState('idle'); // idle, loading, success, error
    const [message, setMessage] = useState('');
    const [currentTab, setCurrentTab] = useState(null);

    const resetState = useCallback(() => {
        console.log('Resetting state to idle');
        setStatus('idle');
        setMessage('');
    }, []);

    const handleDownload = useCallback(async () => {
        console.log('Download button clicked');
        console.log('Current tab:', currentTab);
        
        if (!currentTab) {
            console.log('No current tab found');
            setStatus('error');
            setMessage(chrome.i18n.getMessage('errorMessage'));
            return;
        }

        console.log('Setting status to loading');
        setStatus('loading');
        setMessage(chrome.i18n.getMessage('loadingMessage'));
        
        try {
            console.log('Sending download message to background');
            chrome.runtime.sendMessage({ 
                type: 'download', 
                tabId: currentTab.id,
                url: currentTab.url 
            });
        } catch (error) {
            console.error('Error sending message:', error);
            setStatus('error');
            setMessage(chrome.i18n.getMessage('errorMessage'));
        }
    }, [currentTab]);

    useEffect(() => {
        console.log('Popup mounted/updated, current status:', status);
        
        // Reset state when popup opens
        resetState();

        // Get the current tab when popup opens
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            console.log('Current tab:', tabs[0]);
            if (tabs[0]) {
                setCurrentTab(tabs[0]);
            }
        });

        // Create a message listener function
        const messageListener = (message) => {
            console.log('Received message:', message);
            console.log('Current status:', status);
            
            if (message.type === 'status') {
                console.log('Processing status message:', message.status);
                setStatus(message.status);
                setMessage(message.message);
            }
        };

        // Add the message listener
        console.log('Adding message listener');
        chrome.runtime.onMessage.addListener(messageListener);

        // Clean up the message listener when the popup closes
        return () => {
            console.log('Cleaning up message listener');
            chrome.runtime.onMessage.removeListener(messageListener);
        };
    }, [resetState]); // Only depend on resetState

    console.log('Rendering popup with status:', status);

    return (
        <div className="w-80 p-4 bg-white">
            <div className="flex flex-col items-center space-y-4">
                <h1 className="text-xl font-semibold text-gray-800">
                    {chrome.i18n.getMessage('extensionName')}
                </h1>
                
                <div className="w-full">
                    {status === 'idle' && (
                        <button
                            onClick={handleDownload}
                            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            aria-label={chrome.i18n.getMessage('downloadButton')}
                        >
                            {chrome.i18n.getMessage('downloadButton')}
                        </button>
                    )}
                    
                    {status === 'loading' && (
                        <div className="flex items-center justify-center space-x-2">
                            <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                            <span className="text-gray-600">{message}</span>
                        </div>
                    )}
                    
                    {status === 'success' && (
                        <div className="space-y-3">
                            <div className="p-3 bg-green-50 text-green-700 rounded-lg">
                                <p className="text-sm">{message}</p>
                            </div>
                            <button
                                onClick={handleDownload}
                                className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                                aria-label={chrome.i18n.getMessage('downloadButton')}
                            >
                                Download Again
                            </button>
                        </div>
                    )}
                    
                    {status === 'error' && (
                        <div className="space-y-3">
                            <div className="p-3 bg-red-50 text-red-700 rounded-lg">
                                <p className="text-sm">{message}</p>
                            </div>
                            <button
                                onClick={handleDownload}
                                className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                                aria-label={chrome.i18n.getMessage('downloadButton')}
                            >
                                Try Again
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <Popup />
    </React.StrictMode>
); 