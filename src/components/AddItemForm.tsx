import React, { useState } from 'react';
import { TextField, Button, Box, Typography, MenuItem } from '@mui/material';
import { styled } from '@mui/system';
import { motion } from 'framer-motion';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../hooks/useAuth';

const FormContainer = styled(Box)(({ theme }) => ({
  background: theme.palette.background.paper,
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  boxShadow: '0 3px 5px 2px rgba(0, 0, 0, .1)',
}));

const StyledForm = styled('form')({
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
});

const AnimatedButton = styled(motion.div)({
  display: 'inline-block',
  width: '100%',
});

const categories = [
  'Fruits & Vegetables',
  'Dairy & Eggs',
  'Meat & Seafood',
  'Grains & Pasta',
  'Canned Goods',
  'Snacks',
  'Beverages',
  'Condiments & Spices',
  'Baking Supplies',
  'Other',
];

const AddItemForm: React.FC = () => {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [category, setCategory] = useState('');
  const { user } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError("You must be logged in to add items.");
      return;
    }

    try {
      const docRef = await addDoc(collection(db, 'pantryItems'), {
        name,
        quantity: Number(quantity),
        expirationDate,
        category,
        userId: user.uid,
        createdAt: new Date(),
      });

      console.log("Document written with ID: ", docRef.id);
      setName('');
      setQuantity('');
      setExpirationDate('');
      setCategory('');
      setSuccess(true);
    } catch (error) {
      console.error('Error adding document: ', error);
      setError("Failed to add item. Please try again.");
    }
  };

  return (
    <FormContainer>
      <Typography variant="h6" gutterBottom>
        Add New Pantry Item
      </Typography>
      <StyledForm onSubmit={handleSubmit}>
        <TextField
          label="Item Name"
          variant="outlined"
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <TextField
          label="Quantity"
          variant="outlined"
          fullWidth
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          required
        />
        <TextField
          label="Expiration Date"
          variant="outlined"
          fullWidth
          type="date"
          value={expirationDate}
          onChange={(e) => setExpirationDate(e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
          required
        />
        <TextField
          select
          label="Category"
          variant="outlined"
          fullWidth
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        >
          {categories.map((cat) => (
            <MenuItem key={cat} value={cat}>
              {cat}
            </MenuItem>
          ))}
        </TextField>
        {error && <Typography color="error">{error}</Typography>}
        {success && <Typography color="primary">Item added successfully!</Typography>}
        <AnimatedButton
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Add Item
          </Button>
        </AnimatedButton>
      </StyledForm>
    </FormContainer>
  );
};

export default AddItemForm;
