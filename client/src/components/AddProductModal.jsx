import React, { useState } from 'react';
import { useAddProduct } from '../api/productApi';

const AddProductModal = ({ isOpen, onClose, onProductAdded }) => {
  const addProductMutation = useAddProduct();
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    category: '',
    fabricType: '',
    stock: '',
    description: '',
    imageUrl: ''
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await addProductMutation.mutateAsync(formData);
      alert('Product successfully add ho gaya!');
      if (onProductAdded) onProductAdded(response?.product || response);
      onClose();
    } catch (error) {
      console.error('Error adding product:', error);
      alert(error.response?.data?.message || 'Product add karne me issue aaya');
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <h2>Add New Product</h2>
          <button style={styles.closeBtn} onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            name="title"
            placeholder="Product Name / Title"
            value={formData.title}
            onChange={handleChange}
            required
            style={styles.input}
          />

          <div style={styles.row}>
            <input
              type="number"
              name="price"
              placeholder="Price (₹)"
              value={formData.price}
              onChange={handleChange}
              required
              style={styles.input}
            />
            <input
              type="number"
              name="stock"
              placeholder="Stock Quantity"
              value={formData.stock}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.row}>
            <input
              type="text"
              name="category"
              placeholder="Category (e.g. Cotton, Silk)"
              value={formData.category}
              onChange={handleChange}
              required
              style={styles.input}
            />
            <input
              type="text"
              name="fabricType"
              placeholder="Fabric Type"
              value={formData.fabricType}
              onChange={handleChange}
              style={styles.input}
            />
          </div>

          <input
            type="url"
            name="imageUrl"
            placeholder="Image URL"
            value={formData.imageUrl}
            onChange={handleChange}
            style={styles.input}
          />

          <textarea
            name="description"
            placeholder="Product Description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
            style={styles.textarea}
          />

          <div style={styles.actions}>
            <button type="button" onClick={onClose} style={styles.cancelBtn}>
              Cancel
            </button>
            <button type="submit" disabled={addProductMutation.isPending} style={styles.submitBtn}>
              {addProductMutation.isPending ? 'Adding...' : 'Add Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000
  },
  modal: {
    backgroundColor: '#fff',
    padding: '24px',
    borderRadius: '8px',
    width: '90%',
    maxWidth: '500px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px'
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  row: {
    display: 'flex',
    gap: '12px'
  },
  input: {
    width: '100%',
    padding: '10px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    boxSizing: 'border-box'
  },
  textarea: {
    width: '100%',
    padding: '10px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    boxSizing: 'border-box'
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    marginTop: '12px'
  },
  cancelBtn: {
    padding: '10px 16px',
    backgroundColor: '#6c757d',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  submitBtn: {
    padding: '10px 16px',
    backgroundColor: '#0d6efd',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  }
};

export default AddProductModal;