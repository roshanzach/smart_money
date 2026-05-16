import { useMemo } from 'react';
import { useFinance } from '../context/FinanceContext';
import { ArrowUpRight, ArrowDownRight, Trash2 } from 'lucide-react';

export default function TransactionList({ selectedDate }) {
  const { transactions, deleteTransaction } = useFinance();

  const filteredTransactions = useMemo(() => {
    let sorted = [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date));
    
    if (selectedDate) {
      const dateString = selectedDate.toISOString().split('T')[0];
      sorted = sorted.filter(t => t.date === dateString);
    }
    
    return sorted;
  }, [transactions, selectedDate]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div className="glass-card">
      <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>
        {selectedDate ? `Transactions on ${selectedDate.toLocaleDateString()}` : 'Recent Transactions'}
      </h2>

      {filteredTransactions.length === 0 ? (
        <p className="text-muted" style={{ textAlign: 'center', padding: '2rem 0' }}>
          No transactions found.
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', maxHeight: '400px', overflowY: 'auto' }}>
          {filteredTransactions.map((transaction) => (
            <div key={transaction.id} className="transaction-item">
              <div 
                className="transaction-icon"
                style={{ 
                  background: transaction.type === 'income' ? 'var(--success-bg)' : 'var(--danger-bg)',
                  color: transaction.type === 'income' ? 'var(--success)' : 'var(--danger)'
                }}
              >
                {transaction.type === 'income' ? <ArrowUpRight size={20} /> : <ArrowDownRight size={20} />}
              </div>
              
              <div className="transaction-info">
                <div className="transaction-title">{transaction.category}</div>
                <div className="transaction-meta">
                  {transaction.date} {transaction.description ? `• ${transaction.description}` : ''}
                </div>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div 
                  className="transaction-amount"
                  style={{ color: transaction.type === 'income' ? 'var(--success)' : 'var(--text-primary)' }}
                >
                  {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                </div>
                <button 
                  onClick={() => deleteTransaction(transaction.id)}
                  style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
                  title="Delete transaction"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
