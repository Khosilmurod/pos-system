import React, {Component} from 'react';
import 'reactstrap';
import 'react-bootstrap';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import {Authorization, PATH_PREFIX} from "../../utils/path_controller";
import PaymentModal from "../../components/PaymentModal";
import ClientModal from "../../components/ClientModal";
import SearchTree from "../../components/SearchTree";
import {Card, CardImg, Label, Modal, ModalBody, ModalFooter, ModalHeader} from 'reactstrap';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {library} from '@fortawesome/fontawesome-svg-core';
import {faEdit, faTrashAlt} from '@fortawesome/free-solid-svg-icons';
import {fab} from '@fortawesome/free-brands-svg-icons';
import {Popconfirm, Select} from "antd";
import {AvForm, AvGroup, AvInput,} from 'availity-reactstrap-validation';
import {toast, ToastContainer} from "react-toastify";
import productImage from '../../assets/product.png'
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import TablePagination from "@material-ui/core/TablePagination";
import Paper from "@material-ui/core/Paper";
const Option = Select.Option;


class Index extends Component {

    constructor(props) {
        super(props);
        this.state = {
            usd: 0,
            data: [],
            clients: [],
            paymentModalVisible: false,
            editModalVisible: false,
            clientModalVisible: false,
            currentClient: '',
            lastSaveClient: '',
            currentProduct: '',
            amountType: '',
            paymentList: [],
            productAmount: '',
            retailPrice: '',
            amount: '',
            totalSum: '',
            totalDiscountSum: '',
            totalAmountPrice: 0,
            inputValue: '',
            bank: 0,
            cash: 0,
            card: 0,
            debt: 0,
            change: 0,
            paymentSum: 0,
            discount: 0,
            discountPrice: 0,
            allDiscountSum: 0,
            payment: 0,
            searchedClient: '',
            tradeAll: '',
            isDiscount: false,
            editProductAmountModalVisible: false,
            editableProduct: [],
            editedAmount: '',
            selectedItem: '',
            lastSavedClient: '',
            isDebt: false,
            search: '',
            totalElements: 0,
            sortBy: "loan",
            history: [],
            historyId: null,
            historyTotal: null,
            historyModal: false,
            historyContent: []
        };
    };


    componentDidMount() {
        document.addEventListener('keydown', this.keydownHandler);
        axios({
            url: PATH_PREFIX + "/api/settings",
            headers: {Authorization},
        }).then((res) => {
            if (res.data.success) {
                this.setState({
                    usd: res.data.object.usd,
                });
            }
        });
        this.getAllClients();
        this.getSaleHistory();
    }

    keydownHandler = (event) => {
            if (
            (event.ctrlKey && event.keyCode === 13) &&
            (localStorage.getItem("currentPage") === '/sale' && this.state.currentProduct && this.state.data.length != 0)) {
            this.openPaymentModal();
        }
    };

    getAllClients = () => {
        axios({
            url: PATH_PREFIX + `/api/client`,
            method: 'get',
            params: {
                search: this.state.search,
                debt: this.state.isDebt,
                sort: this.state.sortBy,
                page: 1,
                size: 5
            },
            headers: {
                Authorization
            }
        }).then(res => {
            if (res.data.success) {
                this.setState({
                    clients: res.data.object.content
                })
            }
        })
    };
    getSaleHistory = () => {
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();

        axios({
            url: PATH_PREFIX + '/api/tradeAll/saleHistory',
            headers: {Authorization},
            params: {
                date: yyyy + '-' + mm + '-' + dd,
            }
        }).then(res => {
            if (res.data.success) {
                let object = res.data.object;
                let allTotal = 0, discountTotal = 0, loanTotal = 0;
                let saleTotal = {totalSum: null, discount: null, loan: null};
                for (let i = 0; i < object.length; i++) {
                    allTotal += object[i].totalSum;
                    discountTotal += object[i].discountPrice;
                    loanTotal +=object[i].loanSum;
                }
                saleTotal.totalSum = allTotal;
                saleTotal.discount = discountTotal;
                saleTotal.loan = loanTotal;

                this.setState({
                    history: object,
                    historyTotal: saleTotal
                })
            }
        })
    };
    openPaymentModal = () => {
        this.getAllClients();
        this.setState({
            paymentModalVisible: true,
            cash: this.state.totalSum
        })
    };
    closePaymentModal = () => {
        this.setState({
            paymentModalVisible: false,
            saleId: 0,
            cash: 0,
            card: 0,
            bank: 0,
            debt: 0,
            change: 0,
            discount: 0,
            payment: 0
        })
    };
    savePayment = () => {
        if (this.state.change === 0) {
            this.setState({
                paymentModalVisible: false,
                saleId: 0,
                cash: 0,
                card: 0,
                bank: 0,
                debt: 0,
                change: 0,
                discount: 0,
                payment: 0,
                data: []
            });
            axios({
                url: PATH_PREFIX + '/api/tradeAll',
                method: 'post',
                data: {
                    totalSum: this.state.totalSum,
                    clientId: this.state.currentClient,
                    discount: this.state.discount,
                    card: this.state.card,
                    cash: this.state.cash,
                    bank: this.state.bank,
                    debt: this.state.debt,
                    receivedSum: this.state.payment,
                    data: this.state.data
                },
                headers: {Authorization}
            }).then((response) => {
                if (response.data.success) {
                    this.setState({
                        currentClient:null,
                        lastSaveClient:null
                    })
                    this.getSaleHistory();
                    this.setState({
                        discount: 0
                    });
                    this.getAllClients();
                    axios({
                        url: PATH_PREFIX + '/api/product/store/' + this.state.currentProduct.id,
                        method: 'get',
                        headers: {Authorization}
                    }).then((response) => {
                        if (response.data.success) {
                            let leftAmount = response.data.object.ending_amount;
                            this.setState({
                                currentProduct: null,
                                lastSelectedProduct: response.data.object,
                                productAmount: leftAmount,
                                productSalePrice: response.data.object.retail_price,
                                discountPrice: response.data.object.discountPrice
                            });
                        }
                    });
                }
            });
        } else {
            this.notifyWarn("Qaytimni bering");
        }
    }
    handleChangeInput = (event) => {
        this.setState({inputValue: event.target.value});
    };
    handleRowDel = (index) => {
        const {data} = this.state;
        data.splice(index, 1);
        this.setState({data});
    };
    handlePress = (event) => {
        const {data, inputValue, currentProduct} = this.state;
        let filter = data.filter(item => item.name === currentProduct.name);

        if (inputValue > 0) {
            let leftAmount = currentProduct.ending_amount;
            if (event.keyCode === 13) {
                document.getElementById("searchTree").focus();
                if (filter.length === 0) {
                    if (leftAmount >= inputValue) {
                        let retailPrice = 0;
                        if (this.state.currentProduct.currency === 'UZS') {
                            retailPrice = this.state.currentProduct.retail_price;
                        }
                        if (this.state.currentProduct.currency === 'USD') {
                            retailPrice = this.state.currentProduct.retail_price * this.state.usd;
                        }

                        let newInput = {
                            name: this.state.currentProduct.name,
                            retailPrice: retailPrice,
                            amount: parseFloat(inputValue),
                            amountType: this.state.currentProduct.type,
                            totalAmountPrice: retailPrice * parseFloat(inputValue),
                            productId: this.state.currentProduct.id,
                            discountPrice: retailPrice
                        };
                        data.length === 0 ? data.push(newInput) : data.unshift(newInput);
                        let total = 0;
                        data.map(item => total += item.retailPrice * item.amount);
                        this.setState({
                            data,
                            totalSum: total,
                            inputValue: '',
                        })
                    } else {
                        this.notifyWarn("Bizda bor miqdordan ortiq kiritdingiz!")
                    }
                } else {
                    this.notifyWarn("Bu mahsulotni sotib oldingiz");
                }
            }
        }
    };
    openEditProductAmountModal = (id, index) => {
        console.log(id)
        const {data} = this.state;
        this.setState({
            editProductAmountModalVisible: true,
            editableProduct: data[index],
            selectedItem: id
        })
    };
    closeEditProductAmountModal = () => {
        this.setState({
            editProductAmountModalVisible: false
        })
    }
    handleEdit = async (event) => {
        const {editableProduct, currentProduct} = this.state;
        if (event.target.value <= currentProduct.ending_amount) {
            editableProduct.amount = event.target.value;
            await this.setState({
                editableProduct
            });
        } else {
            this.notifyWarn("Omborda buncha mahsulot yo'q")
        }
    };
    handleDiscountPrice = (event) => {
        const {editableProduct} = this.state;
        editableProduct.discountPrice = event.target.value;
        this.setState({
            editableProduct
        });

    };
    saveChanges = (event, errors, values) => {
        const {data, selectedItem, discountPrice} = this.state;
        let total = 0;
        let totalDiscounts = 0;
        data.map((item) => {
            if (item.id === selectedItem) {
                item.amount = values.amount;
                item.totalAmountPrice = values.totalAmountPrice;
                item.discountPrice = values.discountPrice;
            }
            if (item.discountPrice > 0) {
                total += item.amount * item.discountPrice;
                totalDiscounts += item.amount * item.retailPrice - item.amount * item.discountPrice;
            } else {
                total += item.amount * item.retailPrice;
            }
        });
        this.setState({
            data,
            totalSum: total,
            totalDiscountSum: totalDiscounts,
            lastSaveClient: ""
        });
        this.closeEditProductAmountModal();
    };
    handleSelect = (data) => {
        if (data.isLeaf) {
            axios({
                url: PATH_PREFIX + '/api/product/sale/' + data.key,
                method: 'get',
                headers: {Authorization}
            }).then((response) => {
                if (response.data.success) {
                    let leftAmount = response.data.object.ending_amount;
                    this.setState({
                        currentProduct: response.data.object,
                        lastSelectedProduct: response.data.object,
                        productAmount: leftAmount,
                        productSalePrice: response.data.object.retail_price,
                        discountPrice: response.data.object.discountPrice
                    });
                    document.getElementById("amountInput").focus();
                }
            });
        }
    };
    onCancel = () => {
        this.setState({
            data: [],
        })
    };
    handleCash = async (event) => {
        const {cash, debt, change, card, bank, discount, payment, totalSum} = this.state;
        let abs = event.target.value;
        if (event.keyCode === 8) {
            abs = abs.substring(0, abs.length - 1)
        }
        if (Number(abs) >= 0) {
            let sum = Number(event.target.value) + Number(card) + Number(bank) + Number(discount)
            await this.setState({
                cash: Number(event.target.value),
            });
            if (sum >= totalSum) {
                this.setState({
                    change: sum - totalSum,
                    debt: 0,
                    payment: totalSum - discount,
                })
            } else {
                this.setState({
                    debt: totalSum - sum,
                    change: 0,
                    payment: sum - discount,
                })
            }
        }

    }
    handleCard = async (event) => {
        const {cash, debt, change, card, bank, discount, payment, totalSum} = this.state;
        let abs = event.target.value
        if (event.keyCode === 8) {
            abs = abs.substring(0, abs.length - 1)
        }
        if (Number(abs) >= 0) {
            let sum = Number(this.state.card) + Number(this.state.cash) + Number(this.state.bank) + Number(this.state.discount)
            await this.setState({
                card: Number(event.target.value),
                cash:totalSum-Number(event.target.value)-Number(this.state.bank)-Number(this.state.discount)
            });
            sum = Number(this.state.card) + Number(this.state.cash) + Number(this.state.bank) + Number(this.state.discount)
            if (sum >= totalSum) {
                this.setState({
                    change: sum - totalSum,
                    debt: 0,
                    payment: totalSum - discount
                })
            } else {
                this.setState({
                    debt: totalSum - sum,
                    change: 0,
                    payment: sum - discount
                })
            }
        }

    }
    handleBank = async (event) => {
        const {cash, debt, change, card, bank, discount, payment, totalSum} = this.state;
        let abs = event.target.value
        if (event.keyCode === 8) {
            abs = abs.substring(0, abs.length - 1)
        }
        if (Number(abs) >= 0) {
            let sum = Number(this.state.card) + Number(this.state.cash) + Number(this.state.bank) + Number(this.state.discount)
            await this.setState({
                bank: Number(event.target.value),
                cash:totalSum-Number(event.target.value)-Number(this.state.card)-Number(this.state.discount)
            });
            sum = Number(this.state.card) + Number(this.state.cash) + Number(this.state.bank) + Number(this.state.discount)
            if (sum >= totalSum) {
                this.setState({
                    change: sum - totalSum,
                    debt: 0,
                    payment: totalSum - discount
                })
            } else {
                this.setState({
                    debt: totalSum - sum,
                    change: 0,
                    payment: sum - discount
                })
            }
        }
    }
    getAllShoppingHistory = async () => {
        let {data} = await axios({
            url: PATH_PREFIX + `/api/trade/history`,
            method: 'get',
            headers: {
                Authorization
            },
            params: {
                tradeall: this.state.historyId,
            }
        });
        this.setState({
            historyContent: data.object
        })
    }
    historyModal = async (value, id) => {
        if (value) {
            await this.setState({
                historyId: id
            })
            this.getAllShoppingHistory()
        }
        this.setState({
            historyModal: value
        })
    }
    handleDiscount =async (event) => {
        const {cash, debt, change, card, bank, discount, payment, totalSum} = this.state;
        let abs = event.target.value
        if (event.keyCode === 8) {
            abs = abs.substring(0, abs.length - 1)
        }
        if (Number(abs) >= 0) {
            await this.setState({
                discount: Number(event.target.value)
            });
            let sum = Number(this.state.card) + Number(this.state.cash) + Number(this.state.bank);

            if (sum >= totalSum) {
                this.setState({
                    // change: sum - totalSum,
                    cash:totalSum-Number(this.state.card)-Number(this.state.bank)-this.state.discount,
                    debt: 0,
                    payment: sum - this.state.discount
                })
            } else {
                if (cash > 0 || card > 0 || bank > 0) {
                    this.setState({
                        cash:totalSum-Number(this.state.card)-Number(this.state.bank)-this.state.discount,
                        // debt: totalSum - sum,
                        change: 0,
                        payment: totalSum- this.state.discount
                    })
                } else {
                    this.setState({
                        cash:totalSum-Number(this.state.card)-Number(this.state.bank)-this.state.discount,
                        // debt: totalSum - Number(event.target.value),
                        change: 0,
                        payment: 0
                    })
                }

            }
        }
    }
    handleChange = (event) => {
        const {cash, debt, change, card, bank, discount, payment, totalSum} = this.state;
        let sum = Number(cash) + Number(card) + Number(discount) + Number(bank)
        if (sum === 0) {
            this.setState({
                debt: totalSum,
                change: 0,
                payment: 0,
                discount: 0
            })
        } else if (totalSum > sum) {
            this.setState({
                debt: totalSum - sum,
                payment: Number(cash) + Number(card) + Number(bank),
                change: 0
            })
        } else {
            this.setState({
                change: sum - totalSum,
                payment: Number(cash) + Number(card) + Number(bank),
                debt: 0
            })
        }


    };
    reload = () => {
        this.setState({
            currentProduct: null
        });
    };

    openClientModal = (event) => {
        event.preventDefault()
        this.setState({
            clientModalVisible: true

        })
    };
    closeClientModal = () => {
        this.setState({
            clientModalVisible: false,
        })
    };
    saveClient = async (event) => {
        event.preventDefault();
        await axios({
            url: PATH_PREFIX + '/api/client',
            method: 'post',
            headers: {
                Authorization
            },
            data: {
                name: event.target[0].value,
                surname: event.target[1].value,
                number: this.myTrim(event.target[2].value),
                description: event.target[3].value
            }
        }).then((response) => {
            if (response.data.success) {
                this.getAllClients();
                this.setState({
                    currentClient: response.data.object
                })
            }
        });
        this.closeClientModal();
    };
    myTrim = (x) => {
        return x.split(/[ ]+/).join('');
    };

    onSelectInput = (value) => {
        this.setState({
            currentClient: value
        })
    };
    onSearch = async (value) => {
        await this.setState({
            search: value
        });
        this.getAllClients()

    };
    notifySuccess = (text) => toast.success(text);
    notifyError = (text) => toast.error(text);
    notifyWarn = (text) => toast.warn(text);

    render() {
        const {
            usd, historyModal, historyContent, historyTotal,
            paymentModalVisible, clientModalVisible, editProductAmountModalVisible,
            payment, discount, currentClient, data, totalDiscountSum,
            currentProduct, productAmount, retailPrice, card, bank, debt,
            change, cash, totalSum, allDiscountSum, inputValue, lastSaveClient, clients, lastSavedClient, editedAmount, editableProduct, history
        } = this.state;
        library.add(fab, faTrashAlt, faEdit);
        return (

            <div className={"container-fluid my-4"}>
                <div>
                    <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false}
                                    newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable
                                    pauseOnHover/>
                </div>
                <Modal isOpen={historyModal} size={'lg'}>
                    <ModalBody>
                        <div className={'text-right text-danger'}
                             onClick={(value, id) => this.historyModal(false, null)}>
                            <button className={'btn text-danger'}><span className={'fas fa-times'}></span></button>
                        </div>
                        <table className={"table table-striped table-hover"}>
                            <thead>
                            <tr>
                                <th>№</th>
                                <th>Mahsulot</th>
                                <th>Miqdori</th>
                                <th>Narxi</th>
                                <th>Chegirma</th>
                                <th>Jami</th>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                historyContent.map((item, index) =>
                                    <tr>
                                        <td>{index + 1}</td>
                                        <td>{item.path}</td>
                                        <td>{item.amount} {item.type}</td>
                                        <td>{(item.currencyType === 'USD' ? item.price * item.usd : item.price).toLocaleString()} so'm</td>
                                        <td>{item.discountPrice.toLocaleString()} so'm</td>
                                        <td>{(item.amount * (item.currencyType === 'USD' ? item.price * item.usd : item.price)).toLocaleString()} so'm</td>
                                    </tr>
                                )
                            }
                            </tbody>
                        </table>
                    </ModalBody>
                </Modal>
                <Modal isOpen={paymentModalVisible}>
                    <ModalHeader toggle={this.closePaymentModal}>
                        <div>Jami: {totalSum.toLocaleString()}
                            <div>Chegirmalar: {(discount + totalDiscountSum).toLocaleString()}<br/></div></div>
                        <div>To'lov: <span style={{color: "green"}}>{payment > 0 ? payment.toLocaleString() : totalSum.toLocaleString()}</span></div>
                        {
                            change>0?
                                <div>Qaytim: <span style={{color: "red"}}>{change.toLocaleString()}</span></div>
                                :<div>Qarz: <span style={{color: "red"}}>{debt.toLocaleString()}</span></div>
                        }

                    </ModalHeader>
                    <ModalBody>
                        <form action="" id={"my-form"}>
                            <div className={"pt-0"}>
                                <div className="row">
                                    <div className="offset-4 col-8">
                                        <button className={"float-right btn bg-none btn-outline-success"}
                                                onClick={this.openClientModal}>Mijoz qo'shish
                                        </button>
                                    </div>
                                </div>
                                <div className={"row"}>
                                    <div className="col-md-4 mt-1">
                                        {/*{*/}
                                        {/*    totalSum > 0 && totalSum >= totalSum ?*/}
                                                <div>
                                                    <label htmlFor={"cash"}>Naqd:</label>
                                                    <input type="number" className={"form-control"} id={"cash"}
                                                           name={"cash"}
                                                           value={cash} onChange={this.handleCash}/>
                                                </div>
                                        {/*:*/}
                                        {/*        ""*/}
                                        {/*}*/}
                                        {/*{payment > 0 && payment < totalSum || bank > 0 || card > 0 ?*/}
                                            <div>
                                                <label htmlFor={"card"}>Plastik:</label>
                                                <input type="number" className={"form-control"} id={"card"}
                                                       name={"card"}
                                                       value={card} onChange={this.handleCard}/>
                                                <label htmlFor={"bank"}>Bank:</label>
                                                <input type="number" className={"form-control"} id={"bank"}
                                                       name={"bank"}
                                                       value={bank} onChange={this.handleBank}/>
                                            </div>
                                        {/*: ''*/}
                                        {/*}*/}
                                        {/*{*/}
                                        {/*    totalSum>=payment?*/}
                                                <div>
                                                    <label htmlFor={"discount"}>Chegirma:</label>
                                                    <input type="number" className={"form-control"} id={"discount"}
                                                           name={"discount"}
                                                           value={discount} onChange={this.handleDiscount}/>
                                                </div>
                                        {/*:''*/}
                                        {/*}*/}
                                    </div>
                                    <div className="col-md-8 mt-1">
                                        <label htmlFor={"client"}>Mijoz:</label>
                                        <Select
                                            allowClear={true}
                                            showSearch
                                            style={{width: '100%'}}
                                            placeholder="Mijozni tanlang"
                                            optionFilterProp="children"
                                            onChange={this.onSelectInput}
                                            value={currentClient}
                                            onSearch={this.onSearch}
                                            filterOption={(input, option) =>
                                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                            }
                                        >
                                            {
                                                clients.map(client =>
                                                    <Option style={{}}
                                                            value={client.id}>{client.name + ' ' + client.surname + ' : ' + client.number}</Option>
                                                )
                                            }
                                        </Select>
                                        {
                                            debt > 0 && !currentClient ?
                                                <div className={"mt-5"}>
                                                    <h4 className={"text-center"} style={{color: 'red'}}>Qarz
                                                        bor!!!</h4>
                                                    <h4 className={"text-center"} style={{color: 'red'}}>Iltimos mijozni
                                                        tanlang!!!</h4>
                                                </div>
                                                : ""
                                        }
                                    </div>
                                </div>
                            </div>
                        </form>
                    </ModalBody>
                    <ModalFooter>
                        <button className={"btn btn-danger"} onClick={this.closePaymentModal}>Bekor qilish</button>
                        {
                            !   (debt>0)||currentClient ?
                                <button className={"btn btn-success"} type={"button"} form={"my-form"} onClick={this.savePayment}>Tasdiqlash</button>
                                :
                                <button className={"btn btn-success"} disabled={true} type={"submit"} form={"my-form"}
                                >Tasdiqlash</button>

                        }
                    </ModalFooter>
                </Modal>

                {/*/>*/}
                <ClientModal clientModalVisible={clientModalVisible}
                    // openClientModal={this.openClientModal}
                             closeClientModal={this.closeClientModal}
                             saveClient={this.saveClient}
                />
                <Modal isOpen={editProductAmountModalVisible}>
                    <ModalHeader> Maxsulot miqdorini taxrirlash</ModalHeader>
                    <ModalBody>
                        {
                            editableProduct &&
                            <AvForm id={"editProductAmount"} onSubmit={this.saveChanges}>
                                <AvGroup>
                                    <Label for="editableProductName"><b>Mahsulot nomi:</b></Label>
                                    <AvInput name="name" id="editableProductName" value={editableProduct.name}
                                             disabled={true}/>
                                </AvGroup>
                                <AvGroup>
                                    <Label for="editableProductAmount"><b>Mahsulot miqdori:</b></Label>
                                    <input className={'form-control'} name="amount" id="editableProductAmount"
                                           value={editableProduct.amount}
                                           required onChange={this.handleEdit}/>
                                </AvGroup>
                                <AvGroup>
                                    <Label for="editableProductretailPrice"><b>Mahsulot narxi:</b></Label>
                                    <AvInput name="retailPrice" id="editableProductretailPrice"
                                             value={Number(editableProduct.retailPrice).toLocaleString()} disabled={true}/>
                                </AvGroup>
                                <AvGroup>
                                    <Label for="editableProductretailPrice"><b>Chegirma narxi:</b></Label>
                                    <AvInput name="discountPrice" id="editableProductretailPrice"
                                             value={editableProduct.discountPrice} onChange={this.handleDiscountPrice}/>
                                </AvGroup>
                                <AvGroup>
                                    <Label for="editableProductSum"><b>Jami:</b></Label>
                                    <AvInput name="totalAmountPrice" id="editableProductSum"
                                             value={editableProduct.discountPrice ? Number(editableProduct.discountPrice * editableProduct.amount).toLocaleString()
                                                 : Number(editableProduct.retailPrice * editableProduct.amount).toLocaleString()}
                                             disabled={true}/>
                                </AvGroup>
                            </AvForm>
                        }

                    </ModalBody>
                    <ModalFooter>
                        <button className={'btn btn-outline-danger'} onClick={this.closeEditProductAmountModal}>Bekor
                            qilish
                        </button>
                        <button form='editProductAmount' className={'btn btn-outline-info'}>Saqlash</button>
                    </ModalFooter>
                </Modal>

                <div className="row mt-3">
                    <div className="col-md-4 ">
                        <div>
                            <SearchTree reload={this.reload} onSelect={(data) => this.handleSelect(data)}/>
                        </div>

                    </div>
                    <div className="col-md-8 ">
                        {
                            currentProduct ?
                                <div className="row">
                                    <div className="col-md-5 text-left">
                                        {
                                            currentProduct.attachment_id ?
                                                <img style={{maxWidth: '100%', macHeight: '100%'}}
                                                     className='border product_image '
                                                     src={currentProduct.attachment_id
                                                     && PATH_PREFIX + "/api/file/get/" + currentProduct.attachment_id}
                                                     alt={'mahsulot'}
                                                />
                                                :
                                                <img style={{width: '100%', height: '250px'}}
                                                     className='border product_image'
                                                     src={productImage}
                                                     alt={'mahsulot'}
                                                />
                                        }
                                    </div>
                                    <div className="col-md-7">
                                        <h3
                                            className={'text-center text-info'}>{currentProduct.path}</h3>
                                        <div className={'py-3'}>
                                            <h3 style={{lineHeight: 0}}
                                                className={'text-right'}>{currentProduct.currency == 'UZS' ? currentProduct.retail_price.toLocaleString() : (currentProduct.retail_price * usd).toLocaleString()} so'm</h3>
                                            <p style={{lineHeight: 1.5}} className='text-right'>Chakana narxi</p>

                                            <h3 style={{lineHeight: 0}}
                                                className={'text-right'}>{currentProduct.currency == 'UZS' ? currentProduct.full_sale_price.toLocaleString() : (currentProduct.full_sale_price * usd).toLocaleString()} so'm</h3>
                                            <p style={{lineHeight: 1.5}} className='text-right'>Ulgurji narxi</p>

                                            <h3 style={{lineHeight: 0}}
                                                className={'text-right'}>{Math.round(productAmount * 100) / 100} {currentProduct.type}</h3>
                                            <p style={{lineHeight: 1.5}} className='text-right'>Soni</p>

                                            {currentProduct && productAmount > 0 ?
                                                <input placeholder={"necha " + currentProduct.type + "?"}
                                                       id={"amountInput"} type="number" className={"form-control"}
                                                       name={"myFocus"}
                                                       aria-describedby="inputGroup-sizing-sm" value={inputValue}
                                                       onChange={this.handleChangeInput} onKeyDown={this.handlePress}/>
                                                :
                                                <input id={"amountInput"} type="number" className={"form-control"}
                                                       disabled={true}
                                                       aria-describedby="inputGroup-sizing-sm" value={inputValue}/>
                                            }
                                        </div>
                                    </div>
                                </div> :
                                <div>
                                    {
                                        <div className={'m-1'}>
                                            {
                                                history.length == 0 ?
                                                    <div>
                                                        <h4 className={'text-center'}>{this.props.currentUser.firstName} {this.props.currentUser.lastName}</h4>
                                                        <div className="table table-borderless m-2">
                                                            <tr>
                                                                <td>
                                                                    <div className={'button text-light'}>Ctrl+Q</div>
                                                                </td>
                                                                <td>
                                                                    <div className={''}>Fayllarni qidiruv</div>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td>
                                                                    <div className={'button text-light'}>Ctrl+Enter
                                                                    </div>
                                                                </td>
                                                                <td>
                                                                    <div className={''}>Davom etish</div>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td>
                                                                    <div className={'button text-light'}>Ctrl+Alt+R
                                                                    </div>
                                                                </td>
                                                                <td>
                                                                    <div className={''}>Fayllar meyusini yanglilash
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        </div>
                                                    </div>
                                                    :
                                                    <div>
                                                        <h3 className={'text-center'}>Kunlik sotuv</h3>
                                                        <TableContainer>
                                                            <Table>
                                                                <TableHead>
                                                                    <TableRow className={'bg-light'}>
                                                                        <TableCell>№</TableCell>
                                                                        <TableCell>Mijoz</TableCell>
                                                                        <TableCell>Umumiy Narx</TableCell>
                                                                        <TableCell>Chegirma</TableCell>
                                                                        <TableCell>Hisoblandi</TableCell>
                                                                        <TableCell>To'landi</TableCell>
                                                                        <TableCell>Qarz</TableCell>
                                                                        <TableCell>Berilgan vaqt</TableCell>
                                                                    </TableRow>
                                                                </TableHead>
                                                                <TableBody>
                                                                    {
                                                                        history.map((item, index) =>
                                                                            <TableRow key={item.id} hover
                                                                                      onClick={(value, tradeAllId) => this.historyModal(true, item.id)}>
                                                                                <TableCell>{history.length-index}</TableCell>
                                                                                <TableCell>{item.client}</TableCell>
                                                                                <TableCell>{(Number(item.totalSum).toLocaleString())} so'm</TableCell>
                                                                                <TableCell>{Number(item.discountPrice).toLocaleString()} so'm</TableCell>
                                                                                <TableCell>{(item.totalSum - item.discountPrice).toLocaleString()} so'm</TableCell>
                                                                                <TableCell>{(item.totalSum - item.discountPrice - item.loanSum).toLocaleString()} so'm</TableCell>
                                                                                <TableCell>{item.loanSum.toLocaleString()} so'm</TableCell>
                                                                                <TableCell>{item.createdAt}</TableCell>
                                                                            </TableRow>
                                                                        )
                                                                    }
                                                                    {
                                                                        historyTotal &&
                                                                        <TableRow className={'bg-light'}>
                                                                            <TableCell><b>Total</b></TableCell>
                                                                            <TableCell></TableCell>
                                                                            <TableCell><b>{historyTotal.totalSum.toLocaleString()} so'm</b></TableCell>
                                                                            <TableCell><b>{historyTotal.discount.toLocaleString()} so'm</b></TableCell>
                                                                            <TableCell><b>{(historyTotal.totalSum - historyTotal.discount).toLocaleString()} so'm</b></TableCell>
                                                                            <TableCell><b>{(historyTotal.totalSum - historyTotal.discount - historyTotal.loan).toLocaleString()} so'm</b></TableCell>
                                                                            <TableCell><b>{(historyTotal.loan).toLocaleString()} so'm</b></TableCell>
                                                                            <TableCell></TableCell>
                                                                        </TableRow>
                                                                    }
                                                                </TableBody>
                                                            </Table>
                                                        </TableContainer>
                                                    </div>
                                            }
                                        </div>
                                    }
                                </div>
                        }

                        {
                            data.length !== 0 ?
                                <div className="row my-2">
                                    <div className="col-12">
                                        <table className={'table'}>
                                            <tbody>
                                            <tr>
                                                <th style={{fontSize: 14}}>#</th>
                                                <th style={{fontSize: 14}}>Mahsulot</th>
                                                <th style={{fontSize: 14}}>Miqdori</th>
                                                <th style={{fontSize: 14}}>Narxi</th>
                                                <th style={{fontSize: 14}}>Umumiy narxi</th>
                                                <th style={{fontSize: 14}}>Chegirma narxi</th>
                                                <th style={{fontSize: 14}}>Chegirma umumiy</th>
                                                <th style={{fontSize: 14}}>Amallar</th>
                                            </tr>
                                            {
                                                data.map((item, index) => {
                                                    return (
                                                        <tr key={index}>
                                                            <td style={{fontSize: 14}}>{index + 1}</td>
                                                            <td style={{fontSize: 14}}>{item.name}</td>
                                                            <td style={{fontSize: 14}}>{item.amount.toLocaleString()} {item.amountType}</td>
                                                            <td style={{fontSize: 14}}>{item.retailPrice.toLocaleString()} so'm</td>
                                                            <td style={{fontSize: 14}}>{(item.amount * item.retailPrice).toLocaleString()} so'm</td>
                                                            <td style={{fontSize: 14}}>{item.discountPrice > 0 ? (item.retailPrice-item.discountPrice).toLocaleString() : 0} so'm</td>
                                                            <td style={{fontSize: 14}}>{item.discountPrice > 0 ? (item.amount * (item.retailPrice-item.discountPrice)).toLocaleString() : 0} so'm</td>
                                                            <td style={{fontSize: 14}}>
                                                                <button className="btn btn-sm btn-outline-info mx-2"
                                                                        form={"inputAmount"}
                                                                        onClick={() => this.openEditProductAmountModal(item.productId, index)}>
                                                                    <FontAwesomeIcon icon={faEdit}/>
                                                                </button>
                                                                <Popconfirm onConfirm={() => this.handleRowDel(index)}
                                                                            title='O`chirmoqchimisiz?'
                                                                            okText="Ha" cancelText="Yoq">
                                                                    <button
                                                                        className="btn btn-sm btn-outline-danger mx-2">
                                                                        <FontAwesomeIcon icon={faTrashAlt}/>
                                                                    </button>
                                                                </Popconfirm>
                                                            </td>
                                                        </tr>
                                                    )
                                                })
                                            }
                                            {
                                                data.length !== 0 ?
                                                    <tr>
                                                        <td></td>
                                                        <td style={{font: 'bold', color: 'blue'}}>Jami</td>
                                                        <td></td>
                                                        <td></td>
                                                        <td></td>
                                                        <td></td>
                                                        <td></td>
                                                        <td className={"text-center"}
                                                            style={{font: 'bold', color: 'blue'}}>{
                                                            totalSum.toLocaleString()
                                                        } so'm
                                                        </td>
                                                    </tr> : ''
                                            }
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                : <div></div>
                        }
                        <div className={"float-right"}>
                            {
                                data.length !== 0 ?
                                    <div>
                                        <button className={"btn btn-outline-primary mx-3"}
                                                onClick={this.openPaymentModal}>
                                            Davom etish
                                        </button>
                                        <button className={"btn btn-outline-danger"}
                                                onClick={this.onCancel}>Bekor qilish
                                        </button>
                                    </div> : ''
                            }
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Index;