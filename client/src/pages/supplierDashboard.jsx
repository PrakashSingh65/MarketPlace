import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { useGetProducts, useAddProduct, useDeleteProduct } from '../api/productApi';
import { toggleAddProductModal } from '../redux/slice/productSlice';

const CATEGORY_MAP = {
  cotton: ["Combed Cotton", "Poplin", "Cambric", "Slub Cotton", "Organic Cotton"],
  denim: ["Indigo Twill", "Ring Spun Denim", "Chambray", "Stretch Denim"],
  silk: ["Mulberry Silk", "Crepe Silk", "Banarasi Brocade", "Raw Silk"],
  linen: ["European Flax", "Organic Slub", "Cotton Linen Blend"],
  knits: ["French Terry", "Single Jersey", "Rib Knit", "Interlock"],
  polyester: ["Microfiber", "Recycled Poly", "Poly-Spandex"],
  fashion: ["Men's Wear", "Women's Wear", "Kids Wear", "Footwear"],
  mobiles: ["iPhone", "Vivo", "OPPO", "POCO", "Redmi", "Samsung", "realme", "Nothing", "Google", "Motorola"],
  electronics: ["Laptops", "Headphones", "Smartwatches", "Monitors"],
  beauty: ["Skincare", "Makeup", "Haircare"],
  home: ["Furniture", "Decor", "Kitchen"],
  appliances: ["TVs", "Refrigerators", "Washing Machines"],
  toys: ["Action Figures", "Board Games"],
  food: ["Snacks", "Beverages"],
  auto: ["Car Accessories", "Bike Accessories"],
  sports: ["Fitness Gear", "Outdoor Sports"],
  furniture: ["Living Room", "Bedroom"],
  books: ["Fiction", "Non-Fiction"],
  "2wheelers": ["Electric Scooters", "Bikes"]
};

export default function SupplierDashboard() {
  const dispatch = useDispatch();
  
  const isModalOpen = useSelector((state) => state.productUI?.isAddProductModalOpen ?? false);

  const { data: fetchedData, isLoading, isError, refetch } = useGetProducts();
  const products = Array.isArray(fetchedData) ? fetchedData : fetchedData?.products || [];

  const addProductMutation = useAddProduct();
  const deleteProductMutation = useDeleteProduct();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('cotton');
  const [subCategory, setSubCategory] = useState(CATEGORY_MAP['cotton'][0] || '');
  const [price, setPrice] = useState('');
  const [moq, setMoq] = useState('50');
  const [stock, setStock] = useState('50');
  const [gsm, setGsm] = useState('');
  const [composition, setComposition] = useState('');
  const [colors, setColors] = useState('');
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  useEffect(() => {
    return () => {
      imagePreviews.forEach((url) => {
        if (url && url.startsWith('blob:')) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [imagePreviews]);

  const handleCategoryChange = (e) => {
    const selectedCat = e.target.value;
    setCategory(selectedCat);
    const subList = CATEGORY_MAP[selectedCat] || [];
    setSubCategory(subList.length > 0 ? subList[0] : '');
  };

  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length === 0) return;

    const validFiles = selectedFiles.filter((f) => f.type.startsWith('image/'));
    if (validFiles.length === 0) {
      toast.error('Please select valid image files');
      return;
    }

    const newPreviews = validFiles.map((file) => URL.createObjectURL(file));

    setImageFiles((prev) => [...prev, ...validFiles]);
    setImagePreviews((prev) => [...prev, ...newPreviews]);
    e.target.value = '';
  };

  const handleRemoveImage = (indexToRemove) => {
    setImagePreviews((prev) => {
      const urlToRemove = prev[indexToRemove];
      if (urlToRemove && urlToRemove.startsWith('blob:')) {
        URL.revokeObjectURL(urlToRemove);
      }
      return prev.filter((_, idx) => idx !== indexToRemove);
    });
    setImageFiles((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setCategory('cotton');
    setSubCategory(CATEGORY_MAP['cotton'][0] || '');
    setPrice('');
    setMoq('50');
    setStock('50');
    setGsm('');
    setComposition('');
    setColors('');
    imagePreviews.forEach((url) => {
      if (url && url.startsWith('blob:')) {
        URL.revokeObjectURL(url);
      }
    });
    setImageFiles([]);
    setImagePreviews([]);
  };

  const handleOpenModal = () => {
    dispatch(toggleAddProductModal());
  };

  const handleCloseModal = () => {
    if (isModalOpen) {
      dispatch(toggleAddProductModal());
    }
    resetForm();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const cleanTitle = (title || '').trim();
    if (!cleanTitle) {
      toast.error('Please enter a product title');
      return;
    }

    const cleanPrice = Number(price);
    if (isNaN(cleanPrice) || cleanPrice <= 0) {
      toast.error('Please enter a valid price per meter');
      return;
    }

    if (imageFiles.length === 0) {
      toast.error('Please select at least one product image');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('title', cleanTitle);
      formData.append('description', (description || '').trim());
      formData.append('category', category || 'cotton');
      formData.append('subCategory', subCategory || '');
      formData.append('price', cleanPrice);
      formData.append('pricePerMeter', cleanPrice);
      formData.append('moq', Number(moq) || 50);
      formData.append('stock', Number(stock) || 50);
      formData.append('stockMeters', Number(stock) || 50);

      if (gsm) formData.append('gsm', gsm);
      if (composition) formData.append('composition', composition);
      
      if (colors) {
        colors
          .split(',')
          .map((c) => c.trim())
          .filter(Boolean)
          .forEach((c) => formData.append('colors', c));
      }

      // Append all image files for multi-image storage
      imageFiles.forEach((file) => {
        formData.append('images', file);
      });
      // Also append first image under 'image' for backwards compatibility
      if (imageFiles[0]) {
        formData.append('image', imageFiles[0]);
      }

      await addProductMutation.mutateAsync(formData);

      toast.success('Product uploaded successfully!');
      handleCloseModal();
    } catch (err) {
      console.error("Submit error:", err);
      const msg = err.response?.data?.message || err?.message || 'Failed to upload product';
      toast.error(msg);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      await deleteProductMutation.mutateAsync(id);
      toast.success("Product deleted successfully");
    } catch (err) {
      console.error("Delete error:", err);
      const msg = err.response?.data?.message || err?.message || "Failed to delete product";
      toast.error(msg);
    }
  };

  const labelStyle = { fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '4px' };
  const inputStyle = { width: '100%', padding: '8px 12px', borderRadius: '8px', background: '#020617', border: '1px solid #334155', color: '#fff', boxSizing: 'border-box', outline: 'none' };

  return (
    <div style={{ padding: '24px', backgroundColor: '#020617', color: '#fff', minHeight: '100vh' }}>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>Supplier Dashboard</h1>
          <p style={{ color: '#94a3b8', fontSize: '12px' }}>Manage your catalog and uploads</p>
        </div>

        <button
          onClick={handleOpenModal}
          style={{
            backgroundColor: '#4f46e5',
            color: '#fff',
            padding: '10px 18px',
            borderRadius: '12px',
            border: 'none',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          + Add New Product
        </button>
      </div>

      <div style={{ backgroundColor: '#0f172a', padding: '20px', borderRadius: '16px', border: '1px solid #1e293b' }}>
        <h3 style={{ marginBottom: '16px', fontSize: '14px', fontWeight: 'bold' }}>
          Active Products ({products.length})
        </h3>

        {isLoading && (
          <p style={{ color: '#94a3b8', fontSize: '13px', textAlign: 'center', padding: '20px' }}>
            Loading catalog products...
          </p>
        )}

        {isError && (
          <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', color: '#f87171', padding: '12px', borderRadius: '8px', marginBottom: '16px', textAlign: 'center' }}>
            <p style={{ fontSize: '13px' }}>Backend connection failed.</p>
            <button onClick={() => refetch()} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '4px 12px', borderRadius: '4px', cursor: 'pointer', marginTop: '8px', fontSize: '11px' }}>
              Retry
            </button>
          </div>
        )}

        {!isLoading && !isError && products.length === 0 && (
          <p style={{ color: '#64748b', fontSize: '12px', textAlign: 'center', padding: '20px' }}>
            No products added yet. Click "+ Add New Product" button above.
          </p>
        )}

        {!isLoading && products.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
            {products.map((p) => {
              const productId = p._id || p.id;
              return (
                <div key={productId} style={{ backgroundColor: '#020617', padding: '12px', borderRadius: '12px', border: '1px solid #1e293b', position: 'relative' }}>
                  
                  <button
                    onClick={() => handleDeleteProduct(productId)}
                    title="Delete Product"
                    style={{
                      position: 'absolute',
                      top: '18px',
                      right: '18px',
                      background: 'rgba(239, 68, 68, 0.8)',
                      border: 'none',
                      color: '#fff',
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    ✕
                  </button>

                  {p.images && p.images.length > 1 && (
                    <span style={{
                      position: 'absolute',
                      top: '18px',
                      left: '18px',
                      background: 'rgba(15, 23, 42, 0.85)',
                      backdropFilter: 'blur(4px)',
                      border: '1px solid rgba(148, 163, 184, 0.2)',
                      color: '#c7d2fe',
                      padding: '2px 6px',
                      borderRadius: '6px',
                      fontSize: '10px',
                      fontWeight: 'bold'
                    }}>
                      📷 {p.images.length}
                    </span>
                  )}

                  <img
                    src={(p.images && p.images[0]) || p.image || 'https://via.placeholder.com/150?text=No+Image'}
                    alt={p.title || 'Product Image'}
                    style={{ width: '100%', height: '130px', objectFit: 'cover', borderRadius: '8px' }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/150?text=Image+Error';
                    }}
                  />
                  <p style={{ fontWeight: 'bold', fontSize: '13px', marginTop: '8px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {p.title || 'Untitled Product'}
                  </p>
                  
                  <div style={{ display: 'flex', gap: '4px', margin: '4px 0', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '9px', backgroundColor: '#312e81', color: '#c7d2fe', padding: '2px 6px', borderRadius: '4px' }}>
                      {p.category || 'General'}
                    </span>
                    {p.subCategory && (
                      <span style={{ fontSize: '9px', backgroundColor: '#1e293b', color: '#94a3b8', padding: '2px 6px', borderRadius: '4px' }}>
                        {p.subCategory}
                      </span>
                    )}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                    <p style={{ color: '#818cf8', fontSize: '13px', fontWeight: 'bold' }}>
                      ₹{p.pricePerMeter ?? p.price ?? 0}
                    </p>
                    {p.stock !== undefined && (
                      <span style={{ fontSize: '10px', color: '#64748b' }}>Stock: {p.stock}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {isModalOpen && (
        <div style={{
          position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)',
          display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{ backgroundColor: '#0f172a', padding: '24px', borderRadius: '16px', width: '100%', maxWidth: '440px', border: '1px solid #334155', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h3 style={{ fontWeight: 'bold', fontSize: '16px' }}>Upload Product</h3>
                <p style={{ fontSize: '11px', color: '#94a3b8', margin: 0 }}>Add catalog listing with multi-image gallery</p>
              </div>
              <button onClick={handleCloseModal} style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '18px', cursor: 'pointer' }}>✕</button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

              {/* Multi-Image File Upload Zone */}
              <div style={{ border: '2px dashed #475569', padding: '16px', borderRadius: '12px', textAlign: 'center', backgroundColor: '#020617' }}>
                <label style={{ display: 'block', cursor: 'pointer' }}>
                  <div style={{ color: '#818cf8', fontSize: '13px', fontWeight: 'bold', marginBottom: '4px' }}>
                    📸 Click to Upload Photos
                  </div>
                  <div style={{ color: '#64748b', fontSize: '11px', marginBottom: '10px' }}>
                    Select single or multiple images (PNG, JPG, WEBP up to 10MB)
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    required={imageFiles.length === 0}
                    onChange={handleImageChange}
                    style={{ display: 'none' }}
                  />
                  <span style={{
                    display: 'inline-block',
                    padding: '6px 14px',
                    borderRadius: '8px',
                    backgroundColor: '#1e293b',
                    border: '1px solid #334155',
                    color: '#e2e8f0',
                    fontSize: '12px',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}>
                    + Browse Files
                  </span>
                </label>

                {/* Grid of thumbnail previews for all uploaded images */}
                {imagePreviews.length > 0 && (
                  <div style={{ marginTop: '14px', borderTop: '1px solid #1e293b', paddingTop: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', padding: '0 4px' }}>
                      <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '600' }}>
                        Selected Images ({imagePreviews.length})
                      </span>
                      <span style={{ fontSize: '10px', color: '#64748b' }}>
                        ★ First image is Cover
                      </span>
                    </div>

                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fill, minmax(70px, 1fr))',
                      gap: '8px',
                      maxHeight: '160px',
                      overflowY: 'auto',
                      padding: '2px'
                    }}>
                      {imagePreviews.map((previewUrl, idx) => (
                        <div
                          key={idx}
                          style={{
                            position: 'relative',
                            borderRadius: '8px',
                            overflow: 'hidden',
                            border: idx === 0 ? '2px solid #6366f1' : '1px solid #334155',
                            backgroundColor: '#0f172a',
                            aspectRatio: '1',
                          }}
                        >
                          <img
                            src={previewUrl}
                            alt={`Preview ${idx + 1}`}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                          {idx === 0 && (
                            <span style={{
                              position: 'absolute',
                              bottom: '2px',
                              left: '2px',
                              backgroundColor: 'rgba(79, 70, 229, 0.9)',
                              color: '#fff',
                              fontSize: '8px',
                              fontWeight: 'bold',
                              padding: '1px 4px',
                              borderRadius: '4px',
                              letterSpacing: '0.5px'
                            }}>
                              COVER
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveImage(idx);
                            }}
                            title="Remove image"
                            style={{
                              position: 'absolute',
                              top: '2px',
                              right: '2px',
                              backgroundColor: 'rgba(239, 68, 68, 0.9)',
                              color: '#fff',
                              border: 'none',
                              borderRadius: '50%',
                              width: '18px',
                              height: '18px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '10px',
                              fontWeight: 'bold',
                              lineHeight: 1,
                            }}
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label style={labelStyle}>Product Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Denim Fabric / Cotton Shirts"
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Short description of the product"
                  rows={2}
                  style={{ ...inputStyle, resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>Category</label>
                  <select value={category} onChange={handleCategoryChange} style={inputStyle}>
                    {Object.keys(CATEGORY_MAP).map((cat) => (
                      <option key={cat} value={cat}>
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>Sub-Category</label>
                  <select value={subCategory} onChange={(e) => setSubCategory(e.target.value)} style={inputStyle}>
                    {(CATEGORY_MAP[category] || []).map((sub) => (
                      <option key={sub} value={sub}>{sub}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>Price (₹)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="499"
                    style={inputStyle}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>Stock</label>
                  <input
                    type="number"
                    min="0"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    placeholder="50"
                    style={inputStyle}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>MOQ</label>
                  <input
                    type="number"
                    min="1"
                    value={moq}
                    onChange={(e) => setMoq(e.target.value)}
                    placeholder="50"
                    style={inputStyle}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>GSM (Optional)</label>
                  <input
                    type="text"
                    value={gsm}
                    onChange={(e) => setGsm(e.target.value)}
                    placeholder="e.g. 220"
                    style={inputStyle}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>Composition (Optional)</label>
                  <input
                    type="text"
                    value={composition}
                    onChange={(e) => setComposition(e.target.value)}
                    placeholder="100% Cotton"
                    style={inputStyle}
                  />
                </div>
              </div>

              <div>
                <label style={labelStyle}>Colors (comma-separated)</label>
                <input
                  type="text"
                  value={colors}
                  onChange={(e) => setColors(e.target.value)}
                  placeholder="Red, Blue, Black"
                  style={inputStyle}
                />
              </div>

              <button
                type="submit"
                disabled={addProductMutation?.isPending || addProductMutation?.isLoading}
                style={{
                  backgroundColor: (addProductMutation?.isPending || addProductMutation?.isLoading) ? '#312e81' : '#4f46e5',
                  color: '#fff',
                  padding: '10px',
                  borderRadius: '8px',
                  border: 'none',
                  fontWeight: 'bold',
                  cursor: (addProductMutation?.isPending || addProductMutation?.isLoading) ? 'not-allowed' : 'pointer',
                  marginTop: '8px'
                }}
              >
                {(addProductMutation?.isPending || addProductMutation?.isLoading) ? 'Uploading Product...' : 'Upload Product'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}