import Calendar from 'react-calendar';
import { useFinance } from '../context/FinanceContext';
import 'react-calendar/dist/Calendar.css';

export default function TransactionCalendar({ selectedDate, setSelectedDate }) {
  const { transactions } = useFinance();

  const handleDateChange = (date) => {
    // If clicking the already selected date, deselect it (set to null) to show all transactions
    if (selectedDate && date.toDateString() === selectedDate.toDateString()) {
      setSelectedDate(null);
    } else {
      setSelectedDate(date);
    }
  };

  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const dateString = date.toISOString().split('T')[0];
      const dayTransactions = transactions.filter(t => t.date === dateString);
      
      if (dayTransactions.length > 0) {
        const hasExpense = dayTransactions.some(t => t.type === 'expense');
        const hasIncome = dayTransactions.some(t => t.type === 'income');
        
        return (
          <div className={`calendar-dot ${hasExpense && !hasIncome ? 'expense' : hasIncome && !hasExpense ? 'income' : ''}`} />
        );
      }
    }
    return null;
  };

  return (
    <div className="glass-card">
      <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>Calendar</h2>
      <Calendar 
        onChange={handleDateChange} 
        value={selectedDate} 
        tileContent={tileContent}
        next2Label={null}
        prev2Label={null}
      />
      {selectedDate && (
        <div style={{ marginTop: '1rem', textAlign: 'center', fontSize: '0.875rem' }}>
          Showing transactions for: <strong style={{ color: 'var(--accent-primary)' }}>{selectedDate.toLocaleDateString()}</strong>
          <br/>
          <button 
            onClick={() => setSelectedDate(null)} 
            className="btn btn-outline" 
            style={{ marginTop: '0.5rem', padding: '0.25rem 0.75rem', fontSize: '0.75rem' }}
          >
            Clear Filter
          </button>
        </div>
      )}
    </div>
  );
}
