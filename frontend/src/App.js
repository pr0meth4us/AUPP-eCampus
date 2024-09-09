import React, { useState } from 'react';

function App() {
  const [file, setFile] = useState(null);

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

  return (
      <div className="App">
        <h1>React + Flask + MongoDB + MinIO</h1>
        <input type="file" onChange={handleFileChange} />
        <button onClick={uploadFile}>Upload File</button>
      </div>
  );
}

export default App;
