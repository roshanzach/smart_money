import { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { PlusCircle } from 'lucide-react';

const EXPENSE_CATEGORIES = ['Food', 'Transport', 'Utilities', 'Entertainment', 'Health', 'Shopping', 'Other'];
const INCOME_CATEGORIES = ['Salary', 'Freelance', 'Investments', 'Gift', 'Other'];

export default function TransactionForm() {
  const { addTransaction } = useFinance();
  const [type, setType] = useState('expense');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [category, setCategory] = useState(EXPENSE_CATEGORIES[0]);
  const [description, setDescription] = useState('');

  const handleTypeChange = (newType) => {
    setType(newType);
    setCategory(newType === 'expense' ? EXPENSE_CATEGORIES[0] : INCOME_CATEGORIES[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || isNaN(amount) || Number(amount) <= 0) return;

    addTransaction({
      type,
      amount: Number(amount),
      date,
      category,
      description
    });

    setAmount('');
    setDescription('');
  };

  const categories = type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

  return (
    <div className="glass-card">
      <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>Add Transaction</h2>
      
      <div className="tabs">
        <div 
          className={`tab ${type === 'expense' ? 'active' : 'inactive'}`}
          onClick={() => handleTypeChange('expense')}
        >
          Expense
        </div>
        <div 
          className={`tab ${type === 'income' ? 'active' : 'inactive'}`}
          onClick={() => handleTypeChange('income')}
        >
          Income
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Amount ($)</label>
          <input 
            type="number" 
            step="0.01"
            className="form-control" 
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            required 
          />
        </div>

        <div className="form-group">
          <label>Date</label>
          <input 
            type="date" 
            className="form-control" 
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required 
          />
        </div>

        <div className="form-group">
          <label>Category</label>
          <select 
            className="form-control"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div className="form-group">
          <label>Description</label>
          <input 
            type="text" 
            className="form-control" 
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. Grocery shopping"
          />
        </div>

        <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
          <PlusCircle size={18} />
          Add {type === 'expense' ? 'Expense' : 'Income'}
        </button>
      </form>
    </div>
  );
}
