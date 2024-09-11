import React, { useState } from 'react';

function App() {
    const [file, setFile] = useState(null);
    const [testMessage, setTestMessage] = useState('');

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const uploadFile = async () => {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('http://localhost:5001/files/upload', {
            method: 'POST',
            body: formData,
        });
        const result = await response.json();
        alert(result.message || result.error);
    };

    const callTestEndpoint = async () => {
        try {
            const response = await fetch('http://localhost:5001/test', {
                method: 'GET',
            });
            const result = await response.json();
            setTestMessage(result.message);
        } catch (error) {
            setTestMessage('Error calling test endpoint');
        }
    };

    return (
        <div className="App">
            <h1>React + Flask + MongoDB + MinIO</h1>
            <input type="file" onChange={handleFileChange} />
            <button onClick={uploadFile}>Upload File</button>

            <br />
            <button onClick={callTestEndpoint}>Call Test Endpoint</button>
            {testMessage && <p>Test Response: {testMessage}</p>}
        </div>
    );
}

export default App;