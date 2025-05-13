import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { api } from '../api';

const Editshop = () => {
    const {id} = useParams();
    const navigate = useNavigate();
    const [updateMessage, setUpdateMessage] = useState('');
      const [form, setForm] = useState({
            name: '',
            shop_address: '',
            product_category: '',
            product_price: ''   
        });

        useEffect(() => {
            api.get(`/shop/${id}`)
            .then((res) => setForm({
                name: res.data.name,
                shop_address: res.data.shop_address,
                product_category: res.data.product_category,
                product_price: res.data.product_price   
            }))
            .catch((err) => console.log(err));
        }, [id])

        const handleChange = (e) => {
            setForm({
                ...form,
                [e.target.name]: e.target.value
            })
        }

        const handleSubmit = () => {
            api.put(`/shop/${id}`, form)
            .then(() => {
                setTimeout(() => {
                    setUpdateMessage('');
                }, 3000)
                navigate('/', {state: {message: 'Shop updated successfully'}});
            })
            .catch((err) => {
                setUpdateMessage("Something went wrong.")
                console.log(err)
            });
        }


  return (
    <div>
        <div className="container">
            <div className="row">
                <div className="col-sm-6 offset-3">
                    <h1 className='text-center my-2 text-primary'>Edit Your Shop here</h1>
                    {updateMessage && <div className='alert alert-success'>{updateMessage}</div>}
                    <input name='name' value={form.name} placeholder='Name' onChange={handleChange} className='form-control' />
                    <input name='shop_address' value={form.shop_address} placeholder='Address'onChange={handleChange} className='form-control' />
                    <input name='product_category' value={form.product_category} placeholder='Category' onChange={handleChange} className='form-control' />
                    <input name='product_price' value={form.product_price} placeholder='Price' onChange={handleChange} className='form-control' />
                    <button onClick={handleSubmit} className='btn btn-primary'>Submit</button>
                    <Link to={'/'} className='btn btn-danger'>Cancel</Link>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Editshop
