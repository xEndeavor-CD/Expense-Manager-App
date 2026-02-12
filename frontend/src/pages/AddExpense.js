import React, { useState } from 'react';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { expenseAPI } from '../services/api';

const AddExpense = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    amount: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
    description: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const categories = [
    'Bills & Utilities',
    'Shopping',
    'Education',
    'Food & Dining',
    'Entertainment',
    'Healthcare',
    'Transportation'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await expenseAPI.create({
        ...formData,
        amount: parseFloat(formData.amount)
      });

      if (response.data.success) {
        setSuccess('Expense added successfully!');
        setTimeout(() => {
          navigate('/expense-list');
        }, 1500);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add expense');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      amount: '',
      category: '',
      date: new Date().toISOString().split('T')[0],
      description: ''
    });
    setError('');
    setSuccess('');
  };

  return (
    <Container fluid className="py-4">
      <div className="page-header mb-4">
        <h2>Add Expense</h2>
        <p className="text-muted">Record a new expense transaction</p>
      </div>

      <Card className="expense-form-card" style={{ maxWidth: '800px' }}>
        <Card.Body className="p-4">
          {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}
          {success && <Alert variant="success" dismissible onClose={() => setSuccess('')}>{success}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-4">
              <Form.Label>Amount <span className="text-danger">*</span></Form.Label>
              <Form.Control
                type="number"
                name="amount"
                step="0.01"
                placeholder="0.00"
                value={formData.amount}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Category <span className="text-danger">*</span></Form.Label>
              <Form.Select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="">Select a category</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Date <span className="text-danger">*</span></Form.Label>
              <Form.Control
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Description <span className="text-danger">*</span></Form.Label>
              <Form.Control
                as="textarea"
                name="description"
                rows={4}
                placeholder="Enter expense details..."
                value={formData.description}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <div className="d-flex gap-2">
              <Button 
                variant="primary" 
                type="submit" 
                disabled={loading}
                className="d-flex align-items-center gap-2"
              >
                <i className="bi bi-save"></i>
                {loading ? 'Saving...' : 'Save Expense'}
              </Button>
              <Button 
                variant="outline-secondary" 
                type="button"
                onClick={handleReset}
                className="d-flex align-items-center gap-2"
              >
                <i className="bi bi-x-circle"></i>
                Reset
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AddExpense;