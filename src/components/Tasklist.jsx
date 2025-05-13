import { useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api'
function Tasklist() {
    const [shop, setShop] = useState([])
    const [errors, setErrors] = useState({});
    const [deleteMessage, setDeleteMessage] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const itemsPerPage = 5;
    
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    const [successMessage, setSuccessMessage] = useState(location.state?.message || '');


    const [form, setForm] = useState({
        name: '',
        shop_address: '',
        product_category: '',
        product_price: ''
    })

    useEffect(() => {
        fetchShop()
        if (successMessage) {
            const timer = setTimeout(() => {
                setSuccessMessage('');
            }, 5000)
            return () => clearTimeout(timer);
        }
        if (location.state?.message) {
        window.history.replaceState({}, document.title);
    }
    }, [currentPage, successMessage]);

    const fetchShop = async (page = currentPage) => {
        try {
            setLoading(true);
            const response = await api.get(`/shop/?page=${page}&limit=${itemsPerPage}`);
            const data = response.data?.data;
            setShop(Array.isArray(data) ? data : []); // ⬅ ensures it's always an array
            setTotalPages(response.data?.totalPages || 1);

            setTimeout(() => {
                setLoading(false);
            }, 300);
        } catch (error) {
            console.error(error);
            setShop([])
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        const newErrors = {};
        if (!form.name || form.name.trim().length < 3) {
            newErrors.name = 'Name must be at least 3 characters';
        }
        if (!form.shop_address) {
            newErrors.shop_address = 'Shop address is required';
        }
        if (!form.product_category) {
            newErrors.product_category = 'Product category is required';
        }
        if (!form.product_price || isNaN(form.product_price) || parseFloat(form.product_price) < 500) {
            newErrors.product_price = 'product price must be atleast 500';
        }
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
            return
        }

        if (!form.name || !form.shop_address || !form.product_category || !form.product_price) {
            setSuccessMessage('All fields are required')
            return
        }

        api.post(`/shop`, form)
            .then((res) => {
                setSuccessMessage('Shop added successfully');
                setForm({
                    name: '',
                    shop_address: '',
                    product_category: '',
                    product_price: ''
                })
                //  Get latest total pages from updated backend
                api.get(`/shop?limit=${itemsPerPage}`)
                .then((response)=>{
                    const lastPage =response.data?.totalPages || 1;
                    setCurrentPage(lastPage); // Move to the last page
                    fetchShop(lastPage); // Fetch data for last page
                })
            })
            .catch((err) => {
                console.log(err);
                setSuccessMessage("Something went wrong.")
            });
    }
    const handleDelete = (id) => {
        api.delete(`/shop/${id}`)
            .then(() => {
                setDeleteMessage('Shop deleted successfully');
                setCurrentPage(1);
                fetchShop();
                setTimeout(() => {
                    setDeleteMessage('');
                }, 3000)
            })
            .catch((err) => {
                console.log(err);
                setDeleteMessage("Something went wrong.")
            });
    }


    return (
        <div className="container-fluid">
            {loading ? (
                <div className="d-flex justify-content-center align-items-center bg-dark" style={{ height: '100vh' }}>
                    <div className="spinner-border text-light" role="status" style={{ width: '3rem', height: '3rem' }}>
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            ) : (
                <div className="row bg-dark">
                    <div className="col-sm-6">
                        <h1 className='text-white'>Add New Shop Here</h1>
                        {successMessage && <div className='alert alert-success'>{successMessage}</div>}
                        {deleteMessage && <div className='alert alert-danger'>{deleteMessage}</div>}
                        <input name='name' value={form.name} placeholder='Name' className='form-control' onChange={handleChange} />
                        {errors.name && <small className="text-danger">{errors.name}</small>}
                        <input name='shop_address' value={form.shop_address} placeholder='Address' className='form-control' onChange={handleChange} />
                        {errors.shop_address && <small className="text-danger">{errors.shop_address}</small>}
                        <input name='product_category' value={form.product_category} placeholder='Category' className='form-control' onChange={handleChange} />
                        {errors.product_category && <small className="text-danger">{errors.product_category}</small>}
                        <input name='product_price' value={form.product_price} placeholder='Price' className='form-control' onChange={handleChange} />
                        {errors.product_price && <small className="text-danger">{errors.product_price}</small>}
                        <button onClick={handleSubmit} className='btn btn-primary'>Add Shop</button>
                    </div>

                    <div className='col-sm-6'>
                        <h1 className='text-white'>All shops will display here</h1>
                        <div style={{ width: '100%', height: '400px', overflowY: 'auto' }}>
                            <table className='table table-bordered'>
                                <thead>
                                    <tr>
                                        <th>Id</th>
                                        <th>name</th>
                                        <th>shop address</th>
                                        <th>product category</th>
                                        <th>product price</th>
                                        <th>action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {shop.length === 0 && <tr><td colSpan={6}>No data found</td></tr>}
                                    {Array.isArray(shop) && shop.map((shop, id) => (
                                        <tr key={id}>
                                            <td>{id + 1}</td>
                                            <td>{shop.name}</td>
                                            <td>{shop.shop_address}</td>
                                            <td>{shop.product_category}</td>
                                            <td>
                                                {typeof shop.product_price === 'object' && shop.product_price?.$numberDecimal
                                                    ? `₹${parseFloat(shop.product_price.$numberDecimal).toFixed(2)}`
                                                    : `₹${shop.product_price}`}
                                            </td>
                                            <td style={{ display: 'flex', gap: '2px' }}>
                                                <button className='btn btn-danger' onClick={() => handleDelete(shop._id)}>Delete</button>
                                                <Link to={`/edit/${shop._id}`} className='btn btn-info'>Edit</Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div className="pagination-controls mt-3">
                                <button
                                    className="btn btn-secondary me-2"
                                    disabled={currentPage === 1}
                                    onClick={() => setCurrentPage(currentPage - 1)}
                                >
                                    Previous
                                </button>
                                <span className="text-white">Page {currentPage} of {totalPages}</span>
                                <button
                                    className="btn btn-secondary ms-2"
                                    disabled={currentPage === totalPages}
                                    onClick={() => setCurrentPage(currentPage + 1)}
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Tasklist
