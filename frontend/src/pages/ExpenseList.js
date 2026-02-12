import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Table, Button, Badge, InputGroup } from 'react-bootstrap';
import { expenseAPI } from '../services/api';
import { format } from 'date-fns';

const COLORS = {
  'Bills & Utilities': 'primary',
  'Shopping': 'secondary',
  'Education': 'danger',
  'Food & Dining': 'warning',
  'Entertainment': 'success',
  'Healthcare': 'info',
  'Transportation': 'dark'
};

const ExpenseList = () => {
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All Categories');
  const [loading, setLoading] = useState(true);

  const categories = [
    'All Categories',
    'Bills & Utilities',
    'Shopping',
    'Education',
    'Food & Dining',
    'Entertainment',
    'Healthcare',
    'Transportation'
  ];

  useEffect(() => {
    fetchExpenses();
  }, []);

  useEffect(() => {
    filterExpenses();
  }, [searchTerm, filterCategory, expenses]);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const response = await expenseAPI.getAll();
      if (response.data.success) {
        setExpenses(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching expenses:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterExpenses = () => {
    let filtered = [...expenses];

    if (searchTerm) {
      filtered = filtered.filter(expense =>
        expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        expense.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterCategory !== 'All Categories') {
      filtered = filtered.filter(expense => expense.category === filterCategory);
    }

    setFilteredExpenses(filtered);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        await expenseAPI.delete(id);
        fetchExpenses();
      } catch (error) {
        console.error('Error deleting expense:', error);
      }
    }
  };

  const totalExpenses = filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0);

  return (
    <Container fluid className="py-4">
      <div className="page-header mb-4">
        <h2>Expense List</h2>
        <p className="text-muted">View and manage all your expenses</p>
        <h4 className="mt-2">Total Expenses: <span className="text-primary">${totalExpenses.toFixed(2)}</span></h4>
      </div>

      {/* Search and Filter */}
      <div className="d-flex gap-3 mb-4">
        <InputGroup style={{ maxWidth: '400px' }}>
          <InputGroup.Text>
            <i className="bi bi-search"></i>
          </InputGroup.Text>
          <Form.Control
            type="text"
            placeholder="Search expenses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </InputGroup>

        <Form.Select
          style={{ maxWidth: '250px' }}
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </Form.Select>
      </div>

      {/* Expense Table */}
      <Card>
        <Card.Body className="p-0">
          <Table responsive hover className="mb-0">
            <thead className="bg-light">
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Category</th>
                <th>Amount</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="text-center py-4">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredExpenses.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-muted">
                    No expenses found
                  </td>
                </tr>
              ) : (
                filteredExpenses.map((expense) => (
                  <tr key={expense._id}>
                    <td>{format(new Date(expense.date), 'MMM dd, yyyy')}</td>
                    <td>{expense.description}</td>
                    <td>
                      <Badge bg={COLORS[expense.category] || 'secondary'}>
                        {expense.category}
                      </Badge>
                    </td>
                    <td className="text-danger fw-bold">${expense.amount.toFixed(2)}</td>
                    <td>
                      <div className="d-flex gap-2">
                        <Button variant="outline-primary" size="sm">
                          <i className="bi bi-pencil"></i>
                        </Button>
                        <Button 
                          variant="outline-danger" 
                          size="sm"
                          onClick={() => handleDelete(expense._id)}
                        >
                          <i className="bi bi-trash"></i>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </Card.Body>
        <Card.Footer className="d-flex justify-content-between align-items-center">
          <span className="text-muted">
            Showing {filteredExpenses.length} of {filteredExpenses.length} expenses
          </span>
          <div className="d-flex gap-2">
            <Button variant="outline-secondary" size="sm">Previous</Button>
            <Button variant="outline-secondary" size="sm">Next</Button>
          </div>
        </Card.Footer>
      </Card>
    </Container>
  );
};

export default ExpenseList;