import { useDispatch } from 'react-redux';
import { setItemCount, incrementItemCount, decrementItemCount, resetItemCount } from '../redux/slice/cartSlice';
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
  const rawItems = cartData?.cart?.items || [];
  const cart = rawItems.map(normalizeItem);

  // Keep Redux itemCount badge in sync
  if (cart.length !== undefined) {
    dispatch(setItemCount(cart.reduce((sum, i) => sum + (i.quantity || 1), 0)));
  }

  const addToCart = async (product) => {
    const productId = product._id || product.id;
    if (!productId) return;
    dispatch(incrementItemCount());
    try {
      await addMutation.mutateAsync({ productId, quantity: 1 });
    } catch {
      dispatch(decrementItemCount());
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