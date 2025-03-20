import React, { useState, useEffect } from 'react';
import './styles/TransactionHistory.css';

const TransactionHistory = ({ user, refreshFlag }) => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    if (user?.username) {
      fetchTransactionHistory();
    }
  }, [user, refreshFlag]);

  const fetchTransactionHistory = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/transaction-history/${user.username}/`);
      const data = await response.json();
      setTransactions(data.transactions || []);
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
    }
  };

  const formatLocalTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString(); // Shows local date & time
  };

  return (
    <div className="transaction-history-section">
    <h2>Transaction History</h2>
    {transactions.length === 0 ? (
      <p>No transactions yet.</p>
    ) : (
      <table className="transaction-table">
        <thead>
          <tr>
            <th>Type</th>
            <th>Sent to</th>
            <th>Amount</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((txn, index) => (
            <tr key={index} className={txn.transaction_type === 'Sent' ? 'sent' : 'received'}>
              <td>{txn.transaction_type}</td>
              <td>{txn.counterparty_email}</td>
              <td>
                {txn.transaction_type === 'Sent'
                  ? `- ₹${txn.amount.toFixed(2)}`
                  : `+ ₹${txn.amount.toFixed(2)}`}
              </td>
              <td>{formatLocalTime(txn.timestamp)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    )}
  </div>
  );
};

export default TransactionHistory;
