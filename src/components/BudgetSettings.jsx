import { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { Save } from 'lucide-react';

export default function BudgetSettings() {
  const { budgetLimit, updateBudget } = useFinance();
  const [amount, setAmount] = useState(budgetLimit > 0 ? budgetLimit : '');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (amount !== '' && !isNaN(amount) && Number(amount) >= 0) {
      updateBudget(Number(amount));
    }
  };

  return (
    <div className="glass-card">
      <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>Monthly Budget</h2>
      <p className="text-muted" style={{ marginBottom: '1rem' }}>
        Set a spending limit to receive warnings when you exceed it.
      </p>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
        <div className="form-group" style={{ margin: 0, flex: 1 }}>
          <label>Budget Limit ($)</label>
          <input 
            type="number" 
            step="0.01"
            className="form-control" 
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
          />
        </div>
        <button type="submit" className="btn btn-outline">
          <Save size={18} />
          Save
        </button>
      </form>
    </div>
  );
}
