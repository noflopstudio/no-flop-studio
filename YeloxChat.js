import React, { useState } from 'react';

function YeloxChat() {
  const [message, setMessage] = useState(''); // Changé de prompt à message
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    setLoading(true);

    try {
      // 1. Pointage vers ton nouveau backend sur Render
      const res = await fetch('https://yelox-core-backend.onrender.com/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }), // On envoie "message" au lieu de "prompt"
      });

      const data = await res.json();

      // 2. On récupère la réponse générée par OpenAI
      setResponse(data.response || "Aucune réponse retournée.");
    } catch (error) {
      console.error('Erreur de communication avec YELOX CORE:', error);
      setResponse("Une erreur est survenue lors de la connexion au serveur Render.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial', maxWidth: '600px', margin: 'auto' }}>
      <h2 style={{ color: '#333' }}>Interface YELOX CORE - No Flop Studio</h2>

      <form onSubmit={handleGenerate} style={{ display: 'flex', gap: '10px' }}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Demandez n'importe quoi à YELOX..."
          style={{ flex: 1, padding: '12px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
        <button
          type="submit"
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
          disabled={loading}
        >
          {loading ? 'YELOX réfléchit...' : 'Envoyer'}
        </button>
      </form>

      <div style={{
        marginTop: '25px',
        padding: '15px',
        background: '#f9f9f9',
        borderLeft: '4px solid #007bff',
        borderRadius: '4px',
        minHeight: '100px'
      }}>
        <strong style={{ display: 'block', marginBottom: '10px' }}>Réponse de YELOX :</strong>
        <p style={{ whiteSpace: 'pre-wrap', lineHeight: '1.5' }}>
          {response || "En attente de votre message..."}
        </p>
      </div>
    </div>
  );
}

export default YeloxChat;