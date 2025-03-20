import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import TransactionHistory from './TransactionHistory';
import './styles/Dashboard.css';
import dummyProfile from './assets/dummy-profile.jpg';
import { getAuth, signOut } from "firebase/auth";


const Dashboard = () => {
  const location = useLocation();
  const initialUser = location.state?.user;

  const [user, setUser] = useState(initialUser);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    age: user?.age || '',
    contact_number: user?.contact_number || '',
    employer_details: user?.employer_details || '',
  });

  const [recipientEmail, setRecipientEmail] = useState('');
  const [amount, setAmount] = useState('');
  const [refreshTransactions, setRefreshTransactions] = useState(false);

  if (!user) {
    return <h1>No user data found.</h1>;
  }

  const handleEditToggle = () => {
    setEditMode(!editMode);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/update-profile/', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uid: user.username,
          ...formData,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const data = await response.json();
      console.log('Profile updated:', data);

      setUser(data.user);
      console.log('Updated User:', user);

      setEditMode(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile!');
    }
  };

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

        // Update user balance locally
        setUser(prev => ({
          ...prev,
          account: {
            ...prev.account,
            current_balance: parseFloat(prev.account.current_balance) - parseFloat(amount),
          },
        }));

        setRefreshTransactions(prev => !prev);
      } else {
        alert(data.error || 'Transaction failed.');
      }
    } catch (error) {
      console.error('Transaction Error:', error);
      alert('Transaction failed!');
    }
  };

  const handleLogout = () => {
    const auth = getAuth();
  
    signOut(auth)
      .then(() => {
        // Clear user state
        // setUser(null);
  
        // Redirect to login page
        window.location.href = "/"; 
      })
      .catch((error) => {
        console.error("Error signing out:", error);
      });
  };

  return (
    <div style={styles.container}>
      <div className="profile">
        <h1>Welcome, {user.name}!</h1>

        <img
          src={dummyProfile}
          alt="Profile"
          className="profile-image"
        />

        <div className="profile-card">
          <div className="profile-info">
            <p><strong>Email:</strong> {user.email}</p>
            {editMode ? (
              <div className="edit-section">
                <div>
                  <label>Age:</label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label>Contact Number:</label>
                  <input
                    type="text"
                    name="contact_number"
                    value={formData.contact_number}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label>Employer Details:</label>
                  <input
                    type="text"
                    name="employer_details"
                    value={formData.employer_details}
                    onChange={handleChange}
                  />
                </div>
                <button onClick={handleSave} className="button">Save</button>
                <button onClick={handleEditToggle} className="cancel-button">Cancel</button>
              </div>
            ) : (
              <>
                <p><strong>Age:</strong> {user.age || 'Not set'}</p>
                <p><strong>Contact:</strong> {user.contact_number || 'Not set'}</p>
                <p><strong>Employer:</strong> {user.employer_details || 'Not set'}</p>
                <button onClick={handleEditToggle} className="button">Edit Profile</button>
              </>
            )}
          </div>
        </div>
      </div>


      <div className="dashboard-sections">
        {/* Account Details */}
        <div className="account-details-box">
          <h2>Account Details</h2>
          <p><strong>Account Type:</strong> {user.account.account_type}</p>
          <p><strong>Current Balance:</strong> ₹ {user.account.current_balance}</p>
        </div>
        {/* Transfer Money Right */}
        <div className="transfer-money-box">
          <h2>Make a Transaction</h2>
          <input
            type="text"
            placeholder="Recipient's Email"
            value={recipientEmail}
            onChange={(e) => setRecipientEmail(e.target.value)}
          />
          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <button onClick={handleTransfer}>Send Money</button>
        </div>
      </div>
      {/* Transaction History */}
      <TransactionHistory user={user} refreshFlag={refreshTransactions} />

      <button onClick={handleLogout} className="logout-button">
        Logout
      </button>

    </div>
  );
};

const styles = {
  container: {
    textAlign: 'center',
    marginTop: '50px',
    fontFamily: 'Arial, sans-serif',
  },
  profileImage: {
    borderRadius: '50%',
    width: '150px',
    height: '150px',
    marginBottom: '20px',
  },
  section: {
    marginTop: '30px',
  },
  editSection: {
    marginBottom: '20px',
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
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  cancelButton: {
    margin: '10px',
    padding: '10px 20px',
    backgroundColor: '#ccc',
    color: '#000',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

export default Dashboard;
