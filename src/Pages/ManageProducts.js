import React, { Component } from 'react';
import { MDBContainer, MDBModal, MDBModalBody, MDBModalHeader} from 'mdbreact';
import AdminNavbar from "./AdminNavbar";
import '../Resources/Styling/ManageProducts.css';
import { Spinner } from "react-bootstrap";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const GLOBAL = require('../global');
let _ = require('lodash');

class ManageProducts extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            groupedProducts: {},
            categories: [],
            products: [],
            catList: [],
            modal: false,
            addProductModal: false,
            editId: '',
            editName: '',
            editImage: '',
            editCategory: '',
            editDescription: '',
            editPrice: '',
            editPriceOthers: '',
            editPricePerUnit: 0,
            editAvailability: '',
            addName: '',
            addImage: '',
            addCategory: '',
            addCategoryOthers: '',
            addDescription: '',
            addPrice: 'Kg',
            addPriceOthers: '',
            addPricePerUnit: 0,
            addAvailability: 'in-stock',
            productsEmpty: true,
        };
    };

    // Redering Methods
    // Render Products
    products = () => {
        if(this.state.loading) {
            return(
                <div className='mp-spinner-div'>
                    <Spinner
                        animation="border"
                        variant="success"
                    />
                </div>
            );
        } else {
            return(
                Object.keys(this.state.groupedProducts).map((key) => {
                    return(
                        <div className='product-section'>
                                    <span className='category-title-text' style={{color:'#000'}}>
                                        { key }:
                                    </span>
                            <table className='products-table'>
                                <tr>
                                    <th >Name</th>
                                    <th >Price Unit</th>
                                    <th >Price Per Unit</th>
                                    <th>Options</th>
                                </tr>
                                {
                                    this.state.groupedProducts[key].map((product) => {
                                        return(
                                            <tr>
                                                <td className='t-name-column'>{ product.name }</td>
                                                <td className='t-priceUnit-column'> { (product.price === 'others') ?  product.priceOthers  : product.price}</td>
                                                <td className='t-pricePerUnit-column'>{ product.pricePerUnit}</td>
                                                <td
                                                    className='t-options-column-edit'
                                                    onClick={() => this.toggleModalEdit(product)}
                                                >
                                                    Edit
                                                </td>
                                            </tr>
                                        )
                                    })
                                }
                            </table>
                        </div>
                    )
                })
            );
        }
    };

    // Non-Rendering Methods
    // Edit Product Method
    editProduct = () => {
        if(this.state.editName === '' ||
            this.state.editName === '' ||
            this.state.editName === '' ||
            this.state.editName === '' ||
            this.state.editName === ''
        ) {
            toast.error(' Please Fill All the details', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        } else if(isNaN(this.state.editPricePerUnit)) {
            toast.error('Price Per Unit must be a Number', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        } else {
            if(this.state.editPrice === 'others' && this.state.editPriceOthers === '') {
                toast.error(' Please Fill All the details', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
            } else if(this.state.editCategory === 'Others' && this.state.editCategoryOthers === '') {
                toast.error(' Please Fill All the details', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
            } else {
                fetch(GLOBAL.BASE_URL+'products/editProduct', {
                    method: 'PATCH',
                    mode: 'cors',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        id: this.state.editId,
                        name: this.state.editName,
                        category: (this.state.editCategory === 'Others') ? this.state.editCategoryOthers : this.state.editCategory,
                        // categoryOthers: this.state.editCategoryOthers,
                        description: this.state.editDescription,
                        image: this.state.editImage,
                        price: this.state.editPrice,
                        priceOthers: this.state.editPriceOthers,
                        pricePerUnit: this.state.editPricePerUnit,
                        availability: this.state.editAvailability,
                    })
                })
                    .then(res => res.json())
                    .then(
                        (result) => {
                            if(result.status === 200) {
                                this.setState({
                                    editName: '',
                                    editCategory: '',
                                    editCategoryOthers  : '',
                                    editPrice: '',
                                    editPriceOthers: '',
                                    editPricePerUnit: 0,
                                    editDescription: '',
                                    editAvailability: '',
                                });
                                this.toggleModal();
                                this.componentDidMount();
                            }
                            toast.success(' Product Details Updated', {
                                position: "top-right",
                                autoClose: 5000,
                                hideProgressBar: false,
                                closeOnClick: true,
                                pauseOnHover: true,
                                draggable: true,
                            });
                        },
                        function (error) {
                            toast.error('Error Editing Product! Please try again later', {
                                position: "top-right",
                                autoClose: 5000,
                                hideProgressBar: false,
                                closeOnClick: true,
                                pauseOnHover: true,
                                draggable: true,
                            });
                        }
                    );
            }

        }
    };

    // Delete Product Method
    deleteProduct = () => {
        fetch(GLOBAL.BASE_URL+'products/deleteProduct', {
            method: 'DELETE',
            mode: 'cors',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                id: this.state.editId,
            })
        })
            .then(res => res.json())
            .then(
                (result) => {
                    if(result.status === 200) {
                        this.toggleModal();
                        this.componentDidMount();
                    }
                    toast.error(' Product Deleted', {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                    });
                },
                (error) => {
                    toast.error('Error Deleting Product! Please try again later', {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                    });
                }
            );
    };

    // Add Product Method
    addProduct = () => {
        if(this.state.addName === '' ||
            this.state.addCategory === '' ||
            this.state.addPrice === '' ||
            this.state.addPricePerUnit === '' ||
            this.state.addImage === ''
        ) {
            toast.error(' Please Fill All the details', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        } else if(isNaN(this.state.addPricePerUnit)) {
            toast.error('Price Per Unit must be a Number', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        } else {
            if(this.state.addPrice === 'others' && this.state.addPriceOthers === '') {
                toast.error(' Please Fill All the details', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
            } else if(this.state.addCategory === 'others' && this.state.addCategoryOthers === '') {
                toast.error(' Please Fill All the details', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
            } else {
                fetch(GLOBAL.BASE_URL+'products/createProduct', {
                    method: 'POST',
                    mode: 'cors',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        name: this.state.addName,
                        category: (this.state.addCategory === 'Others') ? this.state.addCategoryOthers : this.state.addCategory,
                        description: this.state.addDescription,
                        image: this.state.addImage,
                        price: this.state.addPrice,
                        priceOthers: this.state.addPriceOthers,
                        pricePerUnit: this.state.addPricePerUnit,
                        availability: this.state.addAvailability,
                        sellers: []
                    })
                })
                    .then(res => res.json())
                    .then(
                        (result) => {
                            this.setState({
                                addName: '',
                                addImage: '',
                                addCategory: 'Breads',
                                addCategoryOthers: '',
                                addDescription: '',
                                addPrice: 'Kilogram',
                                addPriceOthers: '',
                                addPricePerUnit: 0,
                                addAvailability: 'in-stock',
                            });
                            if(result.status === 200) {
                                this.toggleAddModal();
                                this.componentDidMount();
                            }
                            toast.success('Product Added', {
                                position: "top-right",
                                autoClose: 5000,
                                hideProgressBar: false,
                                closeOnClick: true,
                                pauseOnHover: true,
                                draggable: true,
                            });
                        },
                        (error) => {
                            toast.error('Error adding Product! Please try again later', {
                                position: "top-right",
                                autoClose: 5000,
                                hideProgressBar: false,
                                closeOnClick: true,
                                pauseOnHover: true,
                                draggable: true,
                            });
                            this.setState({
                                addName: '',
                                addImage: '',
                                addCategory: '',
                                addDescription: '',
                                addPrice: 'Kilogram',
                                addPriceOthers: '',
                                addPricePerUnit: 0,
                                addAvailability: 'in-stock',

                            });
                        }
                    );
            }
        }
    };

    // Toggling the Bootstrap modal - Add Product Modal
    toggleAddModal = () => {
        this.setState({
            addProductModal: !this.state.addProductModal,
        });
    };

    // Toggling the Bootstrap modal - Edit Product Modal
    toggleModal = () => {
        this.setState({
            modal: !this.state.modal,
            editName: '',
            editCategory: '',
            editImage: '',
            editPrice: '',
            editPricePerUnit: 0,
        });
    };

    // Toggling the Bootstrap modal - When Edit is pressed
    toggleModalEdit = (product) => {
        this.setState({
            editId: product.id,
            editName: product.name,
            editCategory: product.category,
            editDescription: product.description,
            editImage: product.image,
            editPrice: product.price,
            editPriceOthers: product.priceOthers,
            editPricePerUnit: product.pricePerUnit,
            editAvailability: product.availability,
            modal: !this.state.modal,
        });
    };

    // Component Lifecycle Methods
    // Component-Did-Mount method
    componentDidMount() {
        fetch(GLOBAL.BASE_URL+'products/getAllProducts',{
            method: 'POST',
            mode: 'cors',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                token: localStorage.getItem('token')
            })
        })
            .then(res => res.json())
            .then(
                (result) => {
                    if(result.status === 200) {
                        if(result.allProducts.length !== 0) {
                            let groupedProducts = _.groupBy(result.allProducts, 'category');
                            let categories = Object.keys(groupedProducts);
                            this.setState({
                                addCategory: categories[0],
                                productsEmpty: false,
                                groupedProducts: groupedProducts,
                                categories: categories,
                                loading:false,
                            });
                        } else {
                            this.setState({
                                addCategory: 'Others',
                                productsEmpty: true,
                                groupedProducts: result,
                                loading: false,
                            });
                        }
                    } else if(result.status === 401) {
                        alert('Invalid User, Please login again');
                        this.props.history.push("/");
                    }
                },
                (error) => {
                }
            )
    }

    // render() method
    render() {
        return(
            <div className='mp-primary-section'>
                <ToastContainer />
                <AdminNavbar />
                {/* Edit Product Modal */}
                <MDBContainer>
                    <MDBModal isOpen={ this.state.modal } toggle={() => this.toggleModal()}>
                        <MDBModalHeader
                            toggle={() =>this.toggleModal()}

                        >
                            <span className='modal-header-text'>Edit Product</span>
                        </MDBModalHeader>
                        <MDBModalBody>
                            <div className='d-flex flex-column align-items-center justify-content-center'>
                                <div className='field-section'>
                                    <span className='field-text'>Name:</span>
                                </div>
                                <input
                                    type='text'
                                    value={ this.state.editName }
                                    placeholder='Product Name'
                                    className='modal-text-input'
                                    onChange={(event) => this.setState({ editName: event.target.value })}
                                />
                                <div className='field-section'>
                                    <span className='field-text'>Category:</span>
                                </div>
                                <select
                                    value={ this.state.editCategory }
                                    className='mp-dropDown'
                                    onChange={(event) => this.setState({ editCategory: event.target.value })}
                                >
                                    {
                                        this.state.categories.map((category) => {
                                            return (
                                                <option value={category}>{category}</option>
                                            );
                                        })
                                    }
                                    <option value="Others">Others</option>
                                </select>
                                {
                                    this.state.editCategory === 'Others' &&
                                    <div style={{ width: '100%' }}>
                                        <div className='field-section'>
                                            <span className='field-text'>Category - Others:</span>
                                        </div>
                                        <input
                                            type='text'
                                            value={ this.state.editCategoryOthers }
                                            placeholder='Product Category - Others'
                                            className='modal-text-input'
                                            onChange={(event) => this.setState({ editCategoryOthers: event.target.value })}
                                        />
                                    </div>
                                }
                                <div className='field-section'>
                                    <span className='field-text'>Description:</span>
                                </div>
                                <input
                                    type='text'
                                    value={ this.state.editDescription }
                                    placeholder='Product Description'
                                    className='modal-text-input'
                                    onChange={(event) => this.setState({ editDescription: event.target.value })}
                                />
                                <div className='field-section'>
                                    <span className='field-text'>Image:</span>
                                </div>
                                <input
                                    type='text'
                                    value={ this.state.editImage }
                                    placeholder='Product Image URL'
                                    className='modal-text-input'
                                    onChange={(event) => this.setState({ editImage: event.target.value })}
                                />
                                <div className='field-section'>
                                    <span className='field-text'>Price Unit:</span>
                                </div>
                                <select
                                    value={this.state.editPrice}
                                    className='mp-dropDown'
                                    onChange={(event) => this.setState({ editPrice: event.target.value })}
                                >
                                    <option value="Kg">Kilogram</option>
                                    <option value="g">Grams</option>
                                    <option value="pc">Pc</option>
                                    <option value="others">Others</option>
                                </select>
                                {
                                    this.state.editPrice === 'others' &&
                                    <div style={{ width: '100%' }}>
                                        <div className='field-section'>
                                            <span className='field-text'>Price Unit - Others:</span>
                                        </div>
                                        <input
                                            type='text'
                                            disabled={ this.state.editPrice !== 'others' }
                                            value={ this.state.editPriceOthers }
                                            placeholder='Price Unit Others - Eg:liters'
                                            className='modal-text-input'
                                            onChange={(event) => this.setState({ editPriceOthers: event.target.value })}
                                        />
                                    </div>
                                }
                                <div className='field-section'>
                                    <span className='field-text'>Price per Unit:</span>
                                </div>
                                <input
                                    type='text'
                                    value={ this.state.editPricePerUnit }
                                    placeholder='Product Price per Unit'
                                    className='modal-text-input'
                                    onChange={(event) => this.setState({ editPricePerUnit: event.target.value})}
                                />
                                <div className='field-section'>
                                    <span className='field-text'>Availability:</span>
                                </div>
                                <select
                                    value={this.state.editAvailability}
                                    className='mp-dropDown'
                                    onChange={(event) => this.setState({ editAvailability: event.target.value })}
                                >
                                    <option value="in-stock">In Stock</option>
                                    <option value="out-of-stock">Out of Stock</option>
                                </select>
                                <button
                                    className='modal-edit-btn'
                                    onClick={() => this.editProduct()}
                                >
                                    Edit Product
                                </button>
                                <button
                                    className='modal-delete-btn'
                                    onClick={() => this.deleteProduct()}
                                >
                                    Delete Product
                                </button>
                            </div>
                        </MDBModalBody>
                    </MDBModal>
                </MDBContainer>
                {/* Add Product Modal */}
                <MDBContainer>
                    <MDBModal isOpen={ this.state.addProductModal } toggle={() => this.toggleAddModal()}>
                        <MDBModalHeader
                            toggle={() =>this.toggleAddModal()}
                            className='modal-header-text'
                        >
                            Add Product
                        </MDBModalHeader>
                        <MDBModalBody>
                            <div className='d-flex flex-column align-items-center justify-content-center'>
                                <div className='field-section'>
                                    <span className='field-text'>Name:</span>
                                </div>
                                <input
                                    type='text'
                                    value={ this.state.addName }
                                    placeholder='Product Name'
                                    className='modal-text-input'
                                    onChange={(event) => this.setState({ addName : event.target.value})}
                                />
                                <div className='field-section'>
                                    <span className='field-text'>Category:</span>
                                </div>
                                <select
                                    value={ this.state.addCategory }
                                    className='mp-dropDown'
                                    onChange={(event) => this.setState({ addCategory: event.target.value })}
                                >
                                    {
                                        this.state.categories.map((category) => {
                                            return (
                                                <option value={category}>{category}</option>
                                            );
                                        })
                                    }
                                    <option value="Others">Others</option>
                                </select>
                                {
                                    this.state.addCategory === 'Others' &&
                                    <div style={{ width: '100%' }}>
                                        <div className='field-section'>
                                            <span className='field-text'>Category - Others:</span>
                                        </div>
                                        <input
                                            type='text'
                                            value={ this.state.addCategoryOthers }
                                            placeholder='Product Category - Others'
                                            className='modal-text-input'
                                            onChange={(event) => this.setState({ addCategoryOthers: event.target.value })}
                                        />
                                    </div>
                                }
                                <div className='field-section'>
                                    <span className='field-text'>Description:</span>
                                </div>
                                <input
                                    type='text'
                                    value={ this.state.addDescription }
                                    placeholder='Product Description'
                                    className='modal-text-input'
                                    onChange={(event) => this.setState({ addDescription: event.target.value })}
                                />
                                <div className='field-section'>
                                    <span className='field-text'>Image:</span>
                                </div>
                                <input
                                    type='text'
                                    value={ this.state.addImage }
                                    placeholder='Product Image URL'
                                    className='modal-text-input'
                                    onChange={(event) => this.setState({ addImage: event.target.value})}
                                />
                                <div className='field-section'>
                                    <span className='field-text'>Price Unit:</span>
                                </div>
                                <select
                                    value={this.state.addPrice}
                                    className='mp-dropDown'
                                    onChange={(event) => this.setState({ addPrice: event.target.value})}
                                >
                                    <option value="Kg">Kilogram</option>
                                    <option value="g">Grams</option>
                                    <option value="pc">Pc</option>
                                    <option value="others">Others</option>
                                </select>
                                {
                                    this.state.addPrice === 'others' &&
                                    <div style={{ width: '100%' }}>
                                        <div className='field-section'>
                                            <span className='field-text'>Price Unit - Others:</span>
                                        </div>
                                        <input
                                            type='text'
                                            disabled={ this.state.addPrice !== 'others' }
                                            value={ this.state.addPriceOthers }
                                            placeholder='Price Unit Others - Eg:liters'
                                            className='modal-text-input'
                                            onChange={(event) => this.setState({ addPriceOthers: event.target.value })}
                                        />
                                    </div>
                                }
                                <div className='field-section'>
                                    <span className='field-text'>Price per Unit:</span>
                                </div>
                                <input
                                    type='text'
                                    value={ this.state.addPricePerUnit }
                                    placeholder='Product Price per Unit'
                                    className='modal-text-input'
                                    onChange={(event) => this.setState({ addPricePerUnit: event.target.value})}
                                />
                                <div className='field-section'>
                                    <span className='field-text'>Availability:</span>
                                </div>
                                <select
                                    value={this.state.addAvailability}
                                    className='mp-dropDown'
                                    onChange={(event) => this.setState({ addAvailability: event.target.value })}
                                >
                                    <option value="in-stock">In Stock</option>
                                    <option value="out-of-stock">Out of Stock</option>
                                </select>
                                <button
                                    className='modal-edit-btn'
                                    onClick={() => this.addProduct()}
                                >
                                    Add Product
                                </button>
                            </div>
                        </MDBModalBody>
                    </MDBModal>
                </MDBContainer>
                <div className='d-flex flex-column align-items-center justify-content-center primary-area'>
                    <button
                        className='add-product-btn'
                        style={{padding: '5px 20px', marginTop: '20px', borderRadius: '8px'}}
                        onClick={() => this.toggleAddModal()}>
                        Add Product
                    </button>
                    {
                        this.state.productsEmpty && !this.state.loading &&
                        <div className='no-products-msg'>
                            No Products Available
                        </div>
                    }
                    {
                        !this.state.productsEmpty &&
                        this.products()

                    }
                </div>
            </div>
        );
    }
}

export default ManageProducts;
