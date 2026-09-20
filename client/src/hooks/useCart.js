import { useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { setCartItems, incrementItemCount, decrementItemCount, resetItemCount } from '../redux/slice/cartSlice';
import {
  useGetCart,
  useAddToCart,
  useUpdateCartItem,
  useRemoveFromCart,
  useClearCart,
} from '../api/cartApi';

// Normalize a cart item from server response to a flat object the UI expects
const normalizeItem = (item) => {
  const product = item.productId || {};
  return {
    _id: product._id || item.productId,
    cartItemId: item._id,               // The cart sub-document _id for update/remove
    title: product.title || product.name || 'Unknown Product',
    name: product.name || product.title || 'Unknown Product',
    price: product.price ?? 0,
    pricePerMeter: product.pricePerMeter ?? product.price ?? 0,
    image: product.image || (product.images && product.images[0]) || '',
    imageUrl: product.image || '',
    category: product.category || '',
    quantity: item.quantity || 1,
    stock: product.stock ?? 0,
  };
};

export default function useCart() {
  const dispatch = useDispatch();

  const { data: cartData, isLoading } = useGetCart();
  const addMutation = useAddToCart();
  const updateMutation = useUpdateCartItem();
  const removeMutation = useRemoveFromCart();
  const clearMutation = useClearCart();

  // Derive flat cart array from server response
  const cart = useMemo(() => {
    const rawItems = cartData?.cart?.items || [];
    return rawItems.map(normalizeItem);
  }, [cartData]);

  // Keep Redux state and badge in sync safely inside useEffect
  useEffect(() => {
    if (cart) {
      dispatch(setCartItems(cart));
    }
  }, [cart, dispatch]);

  const addToCart = async (product) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) {
      toast.error('Please sign in to add fabrics to your cart');
      return;
    }

    const productId = product._id || product.id;
    if (!productId || String(productId).startsWith('sample-')) {
      toast('Catalog preview fabric cannot be added to cart', { icon: 'ℹ️' });
      return;
    }

    dispatch(incrementItemCount());
    try {
      await addMutation.mutateAsync({ productId, quantity: 1 });
      toast.success('Added to cart!');
    } catch (err) {
      dispatch(decrementItemCount());
      toast.error(err.response?.data?.message || 'Failed to add item to cart');
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (!productId || quantity < 1) return;
    await updateMutation.mutateAsync({ productId, quantity });
  };

  const removeFromCart = async (productId) => {
    if (!productId) return;
    dispatch(decrementItemCount());
    try {
      await removeMutation.mutateAsync(productId);
    } catch {
      dispatch(incrementItemCount());
    }
  };

  const clearCart = async () => {
    dispatch(resetItemCount());
    await clearMutation.mutateAsync();
  };

  return {
    cart,
    isLoading,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    isAdding: addMutation.isPending,
    isRemoving: removeMutation.isPending,
    isUpdating: updateMutation.isPending,
    isClearing: clearMutation.isPending,
  };
}