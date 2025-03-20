// TransferMoney.js
import React, { useState } from 'react';

const TransferMoney = ({ user, onTransferSuccess }) => {
  const [recipientEmail, setRecipientEmail] = useState('');
  const [amount, setAmount] = useState('');

  const handleTransfer = async () => {
    if (!recipientEmail || !amount) {
      alert('Please enter recipient and amount.');
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/api/transfer-money/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender_email: user.email,
          recipient_email: recipientEmail,
          amount,
        }),
      });

      const data = await response.json();
      console.log('Transaction Response:', data);

      if (response.ok) {
        alert('Transaction Successful!');
        setRecipientEmail('');
        setAmount('');

        // Notify parent to update user and transactions
        onTransferSuccess(amount);

      } else {
        alert(data.error || 'Transaction failed.');
      }
    } catch (error) {
      console.error('Transaction Error:', error);
      alert('Transaction failed!');
    }
  };

  return (
    <div style={styles.section}>
      <h2>Make a Transaction</h2>
      <input
        type="text"
        placeholder="Recipient's Email"
        value={recipientEmail}
        onChange={(e) => setRecipientEmail(e.target.value)}
        style={styles.input}
      />
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        style={styles.input}
      />
      <button onClick={handleTransfer} style={styles.button}>Send Money</button>
    </div>
  );
};

const styles = {
  section: {
    marginTop: '30px',
  },
  input: {
    margin: '10px',
    padding: '8px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    width: '200px',
  },
  button: {
    margin: '10px',
    padding: '10px 20px',
    backgroundColor: '#28a745',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

export default TransferMoney;
