import { createContext, useContext, useState, useEffect, useMemo } from 'react';

const FinanceContext = createContext();

const API_URL = import.meta.env.PROD ? 'https://smart-money-rbdu.onrender.com' : '';

// eslint-disable-next-line react-refresh/only-export-components
export const useFinance = () => useContext(FinanceContext);

export const FinanceProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);
  const [budgetLimit, setBudgetLimit] = useState(0);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const token = localStorage.getItem('smartMoney_token');
    if (!token) return;

    try {
      const headers = { 'Authorization': `Bearer ${token}` };
      
      const [txRes, budgetRes] = await Promise.all([
        fetch(`${API_URL}/api/finance/transactions`, { headers }),
        fetch(`${API_URL}/api/finance/budget`, { headers })
      ]);

      if (txRes.ok && budgetRes.ok) {
        const txData = await txRes.json();
        const bData = await budgetRes.json();
        
        // Map _id to id for frontend compatibility
        setTransactions(txData.map(t => ({ ...t, id: t._id })));
        setBudgetLimit(bData.limit || 0);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const addTransaction = async (transaction) => {
    const token = localStorage.getItem('smartMoney_token');
    if (!token) return;

    try {
      const res = await fetch(`${API_URL}/api/finance/transactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(transaction)
      });
      if (res.ok) {
        const newTx = await res.json();
        setTransactions(prev => [{ ...newTx, id: newTx._id }, ...prev]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deleteTransaction = async (id) => {
    const token = localStorage.getItem('smartMoney_token');
    if (!token) return;

    try {
      const res = await fetch(`${API_URL}/api/finance/transactions/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setTransactions(prev => prev.filter(t => t.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const updateBudget = async (amount) => {
    const token = localStorage.getItem('smartMoney_token');
    if (!token) return;

    try {
      const res = await fetch(`${API_URL}/api/finance/budget`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ limit: amount })
      });
      if (res.ok) {
        setBudgetLimit(amount);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const totals = useMemo(() => {
    let income = 0;
    let expenses = 0;
    
    transactions.forEach(t => {
      if (t.type === 'income') {
        income += t.amount;
      } else if (t.type === 'expense') {
        expenses += t.amount;
      }
    });

    return { totalIncome: income, totalExpenses: expenses };
  }, [transactions]);

  const value = {
    transactions,
    budgetLimit,
    addTransaction,
    deleteTransaction,
    updateBudget,
    totalIncome: totals.totalIncome,
    totalExpenses: totals.totalExpenses,
    remainingBalance: totals.totalIncome - totals.totalExpenses,
    fetchData
  };

  return (
    <FinanceContext.Provider value={value}>
      {children}
    </FinanceContext.Provider>
  );
};
