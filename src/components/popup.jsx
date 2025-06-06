const { useState, useEffect } = React;

const Popup = () => {
    const [status, setStatus] = useState('idle'); // idle, loading, success, error
    const [message, setMessage] = useState('');

    useEffect(() => {
        // Listen for messages from the background script
        chrome.runtime.onMessage.addListener((message) => {
            if (message.type === 'status') {
                setStatus(message.status);
                setMessage(message.message);
            }
        });
    }, []);

    const handleDownload = async () => {
        setStatus('loading');
        setMessage('Fetching character data...');
        
        try {
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            chrome.runtime.sendMessage({ type: 'download', tabId: tab.id });
        } catch (error) {
            setStatus('error');
            setMessage('Failed to fetch character data. Please try again.');
        }
    };

    return (
        <div className="w-80 p-4 bg-white">
            <div className="flex flex-col items-center space-y-4">
                <h1 className="text-xl font-semibold text-gray-800">Sakura FM Character Tool</h1>
                
                <div className="w-full">
                    {status === 'idle' && (
                        <button
                            onClick={handleDownload}
                            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            aria-label="Download character data"
                        >
                            Download Character Data
                        </button>
                    )}
                    
                    {status === 'loading' && (
                        <div className="flex items-center justify-center space-x-2">
                            <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                            <span className="text-gray-600">{message}</span>
                        </div>
                    )}
                    
                    {status === 'success' && (
                        <div className="p-3 bg-green-50 text-green-700 rounded-lg">
                            <p className="text-sm">{message}</p>
                        </div>
                    )}
                    
                    {status === 'error' && (
                        <div className="p-3 bg-red-50 text-red-700 rounded-lg">
                            <p className="text-sm">{message}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

ReactDOM.render(<Popup />, document.getElementById('root')); 