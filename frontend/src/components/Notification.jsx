const Notification = ({ message, type }) => {
    if (!message) return null;

    return (
        <div style={{
            padding: '10px',
            margin: '10px 0',
            backgroundColor: type === 'success' ? 'green' : 'red',
            color: 'white',
            borderRadius: '5px'
        }}>
            {message}
        </div>
    );
};

export default Notification