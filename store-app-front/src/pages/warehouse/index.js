import React, {Component} from "react";
import SearchTree from "../../components/SearchTree";
import {Modal, ModalBody, ModalFooter, ModalHeader} from "reactstrap";
import {Popconfirm, Select, Upload, DatePicker} from "antd";
import axios from "axios";
import {Authorization, PATH_PREFIX} from "../../utils/path_controller";
import {PlusOutlined} from "@ant-design/icons";
import {toast, ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import productImage from '../../assets/product.png'
import Pagination from "react-js-pagination";
import moment from 'moment'
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";


const {Option} = Select;
const {RangePicker} = DatePicker;


class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            //one
            deliverPage: 1,
            deliverTotal: 1,
            deliverOutPage: 0,
            deliverOutTotal: 0,
            productTab: "product-remain",
            searchToFindParentSelected: "",
            searchValue: "",
            deliverAllDescription: "",
            usd: 0,
            showWaste: false,

            //object
            selected: {id: null, name: null, type: "not-selected"},
            product: null,
            category: null,
            oneDeliver: null,
            oneEditDeliver: null,
            waste: {amount: 0},
            oneEditTrade: null,
            oneEditTradeAll: null,

            // modals
            addProduct: false,
            addDeliver: false,
            editDeliver: false,
            editProduct: false,
            addCategory: false,
            editCategory: false,
            productType: false,
            addWaste: false,
            addDeiverOut: false,
            history: false,
            editTrade: false,
            editTradeAll: false,

            //data
            searchToFindParent: [],
            productDelivers: [],
            productTypes: [],
            stores: [],
            saleHistory: [],
            saleHistoryStart: moment().startOf('month'),
            saleHistoryEnd: moment().endOf('month'),
                // new Date().toISOString().slice(0, 10),
            historyContent: [],

            //id
            parentCategory: null,
            attachmentId: null,
            searchToFindParentId: null,
            historyId: null
        };
    }

    async componentDidMount() {
        axios({
            url: PATH_PREFIX + "/api/settings",
            headers: {Authorization},
        }).then((res) => {
            if (res.data.success) {
                this.setState({
                    usd: res.data.object.usd,
                    showWaste: res.data.object.showWaste
                });
            }
        });
    }


    //modals
    historyM = async (value, id) => {
        if (value) {
            await this.setState({
                historyId: id
            });
            this.getAllShoppingHistory()
        }
        this.setState({
            history: value
        })
    };
    addCategoryM = async (value) => {
        let {selected, product} = this.state;

        if (value) {
            await this.setState({
                searchToFindParentId:
                    selected.type === "product" ? product.category_id : selected.id,
            });
            await this.getParentCategory();

            this.setState({
                addCategory: true,
            });
        }
        if (!value) {
            this.setState({
                addCategory: false,
                searchToFindParentId: null,
            });
        }
    };
    addProductM = async (value) => {
        let {selected, product} = this.state;
        if (value) {
            await this.getProductType();
            await this.setState({
                searchToFindParentId:
                    selected.type === "product" ? product.category_id : selected.id,
            });
            await this.getParentCategory();
            this.setState({
                addProduct: true,
            });
        }
        if (!value) {
            this.setState({
                addProduct: false,
                searchToFindParentSelected: "",
                parentCategory: null,
                attachmentId: null,
            });
        }
    };
    editProductM = async (value) => {
        if (value) {
            await this.getProductType();
            await this.setState({
                searchToFindParentId: this.state.product.category_id,
                attachmentId: this.state.product.attachment_id,
            });
            await this.getParentCategory();
            this.setState({
                editProduct: true,
            });
        }
        if (!value) {
            this.setState({
                editProduct: false,
                searchToFindParentSelected: "",
                parentCategory: null,
                attachmentId: null,
            });
        }
    };
    editCategoryM = async (value) => {
        let {category} = this.state;
        if (value) {
            await this.setState({
                searchToFindParentId: category.parent ? category.parent.id : null,
            });
            await this.getParentCategory();
            this.setState({
                editCategory: true,
            });
        }
        if (!value) {
            this.setState({
                editCategory: false,
                searchToFindParentId: null,
            });
        }
    };
    addDeliverM = async (value) => {
        const {product} = this.state;
        if (value) {
            await this.setState({
                oneDeliver: {
                    endingExpense: 0,
                    retailPricePercentage: 0,
                    retailPrice: product.retail_price,
                    fullSalePricePercentage: 0,
                    fullSalePrice: product.full_sale_price,
                    amount: 0,
                    price: product.price,
                    currency: product.currency,
                    customCost: product.custom_cost,
                    fareCost: product.fare_cost,
                    otherCosts: product.other_costs,
                    juan: product.juan
                },
            });
            this.oneDelivers("fake", "fake");
            await this.setState({
                addDeliver: true,
            });
        }
        if (!value) {
            await this.setState({
                addDeliver: false,
                oneDeliver: null,
            });
        }
    };
    editDeliverM = (value, id) => {
        this.setState({
            editDeliver: value
        });
        if (value) {
            let one = this.state.productDelivers.filter(item => item.id == id);
            if (one.length != 0) {
                let price = parseFloat(one[0].price);
                let customCost = parseFloat(one[0].customCost);
                let fareCost = parseFloat(one[0].fareCost);

                one[0].endingExpense = price + customCost + fareCost;
                one[0].id = id;
                one[0].realAmount = one[0].amount;
                one[0].retailPrice = this.state.product.retail_price;
                one[0].fullSalePrice = this.state.product.full_sale_price;
                one[0].retailPricePercentage = (100 - Math.round((this.state.product.price + this.state.product.custom_cost + this.state.product.fare_cost) / this.state.product.retail_price * 100)).toLocaleString();
                one[0].fullSalePricePercentage = (100 - Math.round((this.state.product.price + this.state.product.custom_cost + this.state.product.fare_cost) / this.state.product.full_sale_price * 100)).toLocaleString();

                this.setState({
                    oneEditDeliver: one[0]
                })
            }
        }
        if (!value) {
            this.setState({
                oneEditDeliver: null
            })
        }
    };
    productTypeM = async (value) => {
        this.setState({
            productType: value,
        });
    };
    addWasteM = async (value, waste) => {
        if (value) {
            this.setState({
                waste,
                addWaste: true,
            });
        }
        if (!value) {
            this.setState({
                waste: {amount: 0},
                addWaste: false,
            });
        }
    };
    editTradeM = async (value, id) => {
        if (value) {
            let historyContent = this.state.historyContent;
            let ts = historyContent.filter(item => item.id == id);


            if (ts.length != 0) {
                this.setState({
                    oneEditTrade: ts[0]
                })
            }
        } else {
            this.setState({
                oneEditTrade: null
            })
        }
        this.setState({
            editTrade: value,
        });
    };
    editTradeAllM = async (value, id) => {
        this.setState({
            editTradeAll: value
        });
        if (value) {
            const {data} = await axios({
                url: PATH_PREFIX + '/api/tradeAll/one/' + id,
                method: 'get',
                Authorization: {Authorization}
            });
            data.object.cash=data.object.cash-data.object.discount;
            data.object.discount=0;
            data.object.loan=0;
            let change = data.object.trade-data.object.cash-data.object.card-data.object.bank-data.object.discount;
            data.object.cash=data.object.cash+change;

            if (data.success) {
                this.setState({
                    oneEditTradeAll: data.object
                })
            }
        } else {
            this.setState({
                oneEditTradeAll: null
            })
        }
    }


    // controls
    productTab = (tab) => {
        this.setState({
            productTab: tab,
        });
        if (tab === "deliver-history") {
            this.getProductDelivers();
        }
        if (tab === 'shopping-history') {
            this.getSaleHistory();
        }
    };
    onSelectFromTree = async (data) => {
        if (data.isLeaf) {
            await this.setState({
                selected: {id: data.key, name: data.title, type: "product"},
                productTab: 'product-remain'
            });
            await this.getProduct();
        }
        if (!data.isLeaf) {
            this.setState({
                selected: {id: data.key, name: data.title, type: "category"},
            });
            await this.getCategory();
        }
    };
    onSearch = async (value) => {
        await this.setState({
            searchValue: value
        });
        this.getParentSearch();
    };

    onSelectFromInput = (value) => {
        this.setState({
            parentCategory: value,
        })
    };

    reload = () => {
        this.setState({
            //one
            deliverPage: 1,
            deliverTotal: 1,
            deliverOutPage: 0,
            deliverOutTotal: 0,
            productTab: "product-remain",
            searchToFindParentSelected: "",
            searchValue: "",
            deliverAllDescription: "",
            usd: 0,
            showWaste: false,

            //object
            selected: {id: null, name: null, type: "not-selected"},
            product: null,
            category: null,
            oneDeliver: null,
            oneEditDeliver: null,
            waste: {amount: 0},
            oneEditTrade: null,
            oneEditTradeAll: null,

            // modals
            addProduct: false,
            addDeliver: false,
            editDeliver: false,
            editProduct: false,
            addCategory: false,
            editCategory: false,
            productType: false,
            addWaste: false,
            addDeiverOut: false,
            history: false,
            editTrade: false,
            editTradeAll: false,

            //data
            searchToFindParent: [],
            productDelivers: [],
            productTypes: [],
            stores: [],
            saleHistory: [],
            saleHistoryStart: moment().startOf('month'),
            saleHistoryEnd: moment().endOf('month'),
            // new Date().toISOString().slice(0, 10),
            historyContent: [],

            //id
            parentCategory: null,
            attachmentId: null,
            searchToFindParentId: null,
            historyId: null
        });
    };
    beforeUpload = (file) => {
        const isJPG = file.type == "image/jpeg";
        const isPNG = file.type == "image/png";
        if (!isJPG && !isPNG) {
            this.notifyWarn(
                "Faqatgina jpg yoki png turdagi fayllarni yuklash mumkin"
            );
        }
        return isJPG || isPNG;
    };
    customRequest = (options) => {
        const data = new FormData();
        data.append("attachment", options.file);
        axios({
            url: PATH_PREFIX + "/api/file/save",
            method: "post",
            data: data,
            headers: {
                "Content-Type":
                    "multipart/form-data; boundary=----WebKitFormBoundaryqTqJIxvkWFYqvP5s",
                "X-Requested-With": "XMLHttpRequest",
            },
        }).then((response) => {
            this.setState({
                attachmentId: response.data.id,
            });
        });
    };

    addDeliver = async () => {
        let {product, usd, oneDeliver} = this.state;
        let {data} = await axios({
            url: PATH_PREFIX + "/api/deliver",
            method: "post",
            headers: {Authorization},
            data: {
                reqDelivers: [{
                    productId: product.id,
                    currency: oneDeliver.currency,
                    customCost: Number(oneDeliver.customCost),
                    fareCost: Number(oneDeliver.fareCost),
                    otherCosts: Number(oneDeliver.otherCosts),
                    amount: Number(oneDeliver.amount),
                    price: Number(oneDeliver.price),
                    juan: Number(oneDeliver.juan),
                    retailPrice: Number(oneDeliver.retailPrice),
                    fullSalePrice: Number(oneDeliver.fullSalePrice),
                    name: product.name,
                }],
                description: '',
            },
        });
        if (data.success) {
            this.notifySuccess("Mahsulotlar omborga qo'shildi");
            this.setState({
                deliverAllDescription: "",
            });
            this.getProduct();
            this.addDeliverM(false);
        }
    };
    editDeliver = async () => {
        if (this.state.product.ending_amount - (this.state.oneEditDeliver.realAmount - this.state.oneEditDeliver.amount) >= 0) {
            let {data} = await axios({
                url: PATH_PREFIX + "/api/deliver/" + this.state.oneEditDeliver.id,
                method: "put",
                headers: {Authorization},
                data: {
                    productId: this.state.product.id,
                    currency: this.state.oneEditDeliver.currencyType,
                    customCost: Number(this.state.oneEditDeliver.customCost),
                    fareCost: Number(this.state.oneEditDeliver.fareCost),
                    otherCosts: Number(this.state.oneEditDeliver.otherCosts),
                    amount: Number(this.state.oneEditDeliver.amount),
                    price: Number(this.state.oneEditDeliver.price),
                    juan: Number(this.state.oneEditDeliver.juan),
                    retailPrice: Number(this.state.oneEditDeliver.retailPrice),
                    fullSalePrice: Number(this.state.oneEditDeliver.fullSalePrice)
                },
            });
            if (data.message === 'failed') {
                this.notifyWarn("Noto'g'ri ma'lumot kiritilgan. Bu mashulotlar sotilib ketgan bo'lishi mumkin")
            }
            if (data.success) {
                this.getProductDelivers();
                this.getProduct();
                this.editDeliverM(false)
            }
        } else {
            this.notifyWarn("Kiritgan soningizdan ko'p mahsulot sotilgan")
        }
    };
    oneDelivers = async (event, type) => {
        const {oneDeliver, usd} = this.state;
        if (type === "amount") {
            oneDeliver.amount = event.target.value;
            await this.setState({
                oneDeliver,
            });
        }
        if (type === "price") {
            oneDeliver.price = event.target.value;
            await this.setState({
                oneDeliver,
            });
        }
        if (type === "currency") {
            if (event.target.value === 'UZS') {
                oneDeliver.currency = 'UZS';
            } else if (event.target.value === 'USD') {
                oneDeliver.currency = 'USD';
            }
            await this.setState({
                oneDeliver,
            });
        }
        if (type === "customCost") {
            oneDeliver.customCost = event.target.value;
            await this.setState({
                oneDeliver,
            });
        }
        if (type === "fareCost") {
            oneDeliver.fareCost = event.target.value;
            await this.setState({
                oneDeliver,
            });
        }
        if (type === "otherCosts") {
            oneDeliver.otherCosts = event.target.value;
            await this.setState({
                oneDeliver,
            });
        }
        if (type === "juan") {
            oneDeliver.juan = event.target.value;
            await this.setState({
                oneDeliver,
            });
        }
        if (type === "retailPrice") {
            oneDeliver.retailPrice = event.target.value;
            await this.setState({
                oneDeliver,
            });
        }
        if (type === "fullSalePrice") {
            oneDeliver.fullSalePrice = event.target.value;
            await this.setState({
                oneDeliver,
            });
        }

        let price = parseFloat(oneDeliver.price);
        let customCost = parseFloat(oneDeliver.customCost);
        let fareCost = parseFloat(oneDeliver.fareCost);
        let otherCosts = parseFloat(oneDeliver.otherCosts);
        let retailPricePercentage = 0, fullSalePricePercentage = 0,
            endingExpense = price + customCost + fareCost + otherCosts;


        retailPricePercentage = Math.round(100 - ((price + customCost + fareCost + otherCosts) / oneDeliver.retailPrice / 100) * 100 * 100);
        fullSalePricePercentage = Math.round(100 - ((price + customCost + fareCost + otherCosts) / oneDeliver.fullSalePrice / 100) * 100 * 100);

        oneDeliver.retailPricePercentage = retailPricePercentage;
        oneDeliver.fullSalePricePercentage = fullSalePricePercentage;
        oneDeliver.endingExpense = endingExpense;

        this.setState({
            oneDeliver,
        });
    };
    onSaleChange = async (dates, dateString) => {

        if (dates != null) {
            await this.setState({
                saleHistoryStart: dates[0],
                saleHistoryEnd: dates[1]
            });
            this.getSaleHistory();
        }

        // await this.setState({
        //     saleHistoryDate: dateString
        // })
    };

    oneEditDelivers = async (event, type) => {
        const {oneEditDeliver, usd} = this.state;
        if (type === "amount") {
            oneEditDeliver.amount = event.target.value;
            await this.setState({
                oneEditDeliver,
            });
        }
        if (type === "retailPrice") {
            oneEditDeliver.retailPrice = event.target.value;
            await this.setState({
                oneEditDeliver,
            });
        }
        if (type === "fullSalePrice") {
            oneEditDeliver.fullSalePrice = event.target.value;
            await this.setState({
                oneEditDeliver,
            });
        }
        if (type === "price") {
            oneEditDeliver.price = event.target.value;
            await this.setState({
                oneEditDeliver,
            });
        }
        if (type === "currency") {
            if (event.target.value === 'UZS') {
                oneEditDeliver.currencyType = 'UZS';
            } else if (event.target.value === 'USD') {
                oneEditDeliver.currencyType = 'USD';
            }
            await this.setState({
                oneEditDeliver,
            });
        }
        if (type === "customCost") {
            oneEditDeliver.customCost = event.target.value;
            await this.setState({
                oneEditDeliver,
            });
        }
        if (type === "fareCost") {
            oneEditDeliver.fareCost = event.target.value;
            await this.setState({
                oneEditDeliver,
            });
        }
        if (type === "juan") {
            oneEditDeliver.juan = event.target.value;
            await this.setState({
                oneEditDeliver,
            });
        }

        let price = parseFloat(oneEditDeliver.price);
        let customCost = parseFloat(oneEditDeliver.customCost);
        let fareCost = parseFloat(oneEditDeliver.fareCost);
        let otherCosts=0;

        let retailPricePercentage = 0, fullSalePricePercentage = 0,
            endingExpense = price + customCost + fareCost + otherCosts;


        retailPricePercentage = Math.round(100 - ((price + customCost + fareCost + otherCosts) / oneEditDeliver.retailPrice / 100) * 100 * 100);
        fullSalePricePercentage = Math.round(100 - ((price + customCost + fareCost + otherCosts) / oneEditDeliver.fullSalePrice / 100) * 100 * 100);

        oneEditDeliver.endingExpense = price + customCost + fareCost;
        oneEditDeliver.retailPricePercentage = retailPricePercentage;
        oneEditDeliver.fullSalePricePercentage = fullSalePricePercentage;


        this.setState({
            oneEditDeliver,
        });
    };
    oneEditTradeAll = async (event, type) => {
        let one = this.state.oneEditTradeAll;
        if (type === 'cash') {
            one.cash = event.target.value;
        } else if (type === 'card') {
            one.card = event.target.value;
        } else if (type === 'bank') {
            one.bank =event.target.value;
        } else if (type === 'discount') {
            one.discount = event.target.value;
        }
        one.loan=-Number(one.trade)+Number(one.cash)+Number(one.card)+Number(one.bank)+Number(one.discount);
        this.setState({
            oneEditTradeAll: one
        })
    };

    //query
    //post
    addCategory = async (event) => {
        event.preventDefault();
        const {data} = await axios({
            url: PATH_PREFIX + "/api/category",
            method: "post",
            headers: {
                Authorization,
            },
            data: {
                name: event.target[1].value,
                enName: event.target[2].value,
                parentId: this.state.parentCategory,
            },
        });
        this.addCategoryM(false);
        // this.refs.tree.reDrawAll();
        this.refs.tree.onSelectFromInput(data.object.id);
    };

    addProduct = async (event) => {
        event.preventDefault();
        const {data} = await axios({
            url: PATH_PREFIX + "/api/product",
            method: "post",
            headers: {Authorization},
            data: {
                name: event.target[1].value,
                code: event.target[2].value,
                enName: event.target[3].value,
                productTypeId: event.target[4].value,
                attachmentId: this.state.attachmentId,
                categoryId: this.state.parentCategory,
            },
        });
        this.addProductM(false);
        // this.refs.tree.reDrawAll();
        this.refs.tree.onSelectFromInput(data.object.id);
    };
    addProductType = (event) => {
        event.preventDefault();
        axios({
            url: PATH_PREFIX + "/api/productType",
            method: "post",
            headers: {Authorization},
            params: {
                name: event.target[0].value,
            },
        }).then((res) => {
            if (res.data.success) {
                this.getProductType();
            }
        });
    };
    addWaste = (event) => {
        event.preventDefault();
        axios({
            url: PATH_PREFIX + "/api/waste",
            method: "post",
            headers: {Authorization},
            data: {
                deliverId: this.state.waste.id,
                amount: event.target[0].value,
                desc: event.target[1].value,
            },
        }).then((res) => {
            if (res.data.message === "success") {
                this.notifySuccess(
                    "Brak qo'shilishi uchun direktorga so'ro'v jo'natildi"
                );
            }
            if (res.data.message === "faild") {
                this.notifyWarn(
                    "Bu mahsulotga avval ham brak qo'shilgan! Uni tahrilashingiz mumkin"
                );
            }
            this.addWasteM(false);
        });
    };
    addDeliverToBackend = (event) => {
        event.preventDefault();
        let {product, usd} = this.state;
        axios({
            url: PATH_PREFIX + "/api/deliver",
            method: "post",
            headers: {Authorization},
            data: {
                reqDelivers: [{
                    price: product.price,
                    retailPrice: product.retail_price,
                    fullSalePrice: product.full_sale_price,
                    juan: product.juan,
                    usd: usd,
                    amount: event.target[0].value,
                    currency: product.currency,
                    productId: product.id,
                    otherCosts: product.other_costs,
                    customCost: product.custom_cost,
                    fareCost: product.fare_cost
                }],
                description: ''
            }
        }).then(res => {
            if (res.data.success) {
                this.notifySuccess('Tezkor kirim qilindi');
                this.getProduct();
            }
        });
        document.getElementById("addDeliverToBackend").value = '';
    };
    //get
    getSaleHistory = async () => {
        var start = this.state.saleHistoryStart;
        await axios({
            url: PATH_PREFIX + '/api/tradeAll/saleHistory/'+this.state.product.id,
            headers: {Authorization},
            params: {
                start: start.add(1, 'day'),
                end:this.state.saleHistoryEnd
            }
        }).then(res => {
            if (res.data.success) {
                let object = res.data.object;
                let allTotal=0, discountTotal=0, loanTotal=0;
                let saleTotal={totalSum:null, discount:null, loan:null};
                for(let i=0; i<object.length; i++){
                    allTotal+=object[i].totalSum;
                    discountTotal+=object[i].discountPrice;
                    loanTotal+=object[i].loanSum;
                }
                saleTotal.totalSum=allTotal;
                saleTotal.discount=discountTotal;
                saleTotal.loan=loanTotal;

                this.setState({
                    saleHistory: res.data.object,
                    saleHistoryTotal:saleTotal
                })
            }
        })
        start.add(-1,'day')
    };
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
    getCategory = () => {
        let {selected, isSelectedProduct} = this.state;
        axios({
            url: PATH_PREFIX + "/api/category/one/" + selected.id,
            method: "get",
            headers: {Authorization},
        }).then((response) => {
            this.setState({
                category: response.data.object,
                isSelectedProduct: false,
            });
        });
    };
    getProduct = () => {
        let {isSelectedProduct, selected, productTab} = this.state;
        axios({
            url: PATH_PREFIX + `/api/product/store/${selected.id}`,
            method: "get",
            headers: {
                Authorization,
            },
        }).then((response) => {
            this.setState({
                product: response.data.object,
                isSelectedProduct: true,
            });
        });
    };
    getParentCategory = async () => {
        let {searchToFindParentId} = this.state;
        const {data} = await axios({
            url: PATH_PREFIX + "/api/category/parent",
            headers: {Authorization},
            params: {
                id: searchToFindParentId,
            },
        });
        if (data.success) {
            this.setState({
                searchToFindParentSelected: data.object.path,
                parentCategory: data.object.id,
            });
        }
    };
    getParentSearch = async () => {
        let {searchValue} = this.state;
        if (this.state.searchValue !== "") {
            const {data} = await axios({
                url: PATH_PREFIX + "/api/category/tree/search",
                method: "get",
                headers: {
                    Authorization,
                },
                params: {
                    search: searchValue,
                },
            });
            if (data.success) {
                let searchToFindParent = data.object.filter((item) => !item.isProduct);
                this.setState({
                    searchToFindParent,
                });
            }
        }
        if (this.state.searchValue === "") {
            this.setState({
                searchData: [],
            });
        }
    };
    getProductDelivers = async () => {
        const {data} = await axios({
            url: PATH_PREFIX + "/api/deliver/history/" + this.state.product.id,
            headers: {Authorization},
            params: {
                size: 10,
                page: this.state.deliverPage - 1
            }
        });

        if (data.success) {
            this.setState({
                productDelivers: data.object.content,
                deliverTotal: data.object.totalElements
            });
        }
    };
    handleDeliverPage = async (value) => {
        await this.setState({
            deliverPage: value
        });
        this.getProductDelivers();
    };

    getProductType = () => {
        axios({
            url: PATH_PREFIX + "/api/productType/all",
            headers: {Authorization},
            method: "get",
        }).then((res) => {
            this.setState({
                productTypes: res.data.object,
            });
        });
    };
    //put
    editProductTypeMain = (id) => {
        axios({
            url: PATH_PREFIX + '/api/productType/main/' + id,
            method: 'put',
            headers: {Authorization}
        }).then(res => {
            if (res.data.success) {
                this.setState({
                    productTypes: res.data.object
                })
            }
        })
    };
    editProduct = async (event) => {
        event.preventDefault();
        let realId = this.state.selected.id;
        const {data} = await axios({
            url: PATH_PREFIX + "/api/product/" + this.state.selected.id,
            method: "patch",
            headers: {Authorization},
            data: {
                name: event.target[1].value,
                code: event.target[2].value,
                enName: event.target[3].value,
                productTypeId: event.target[4].value,
                attachmentId: this.state.attachmentId,
                categoryId: this.state.parentCategory,
            },
        });
        this.getProduct();
        this.editProductM(false);
        // this.refs.tree.reDrawAll();
        this.refs.tree.onSelectFromInput(realId);
    };
    editCategory = async (event) => {
        event.preventDefault();
        let id = this.state.selected.id;
        const {data} = await axios({
            url: PATH_PREFIX + "/api/category/" + this.state.selected.id,
            method: "patch",
            headers: {
                Authorization,
            },
            data: {
                name: event.target[1].value,
                enName: event.target[2].value,
                parentId: this.state.parentCategory,
            },
        });
        // this.refs.tree.reDrawAll();
        this.refs.tree.onSelectFromInput(id);
        this.getCategory();
        this.editCategoryM(false);
    };
    editTrade = (event) => {
        event.preventDefault();
        axios({
            url: PATH_PREFIX + '/api/trade/edit/' + this.state.oneEditTrade.id,
            method: 'put',
            data: {
                amount: event.target[0].value,
                discount: event.target[1].value
            },
            Authorization: {Authorization}
        }).then(res => {
            if (res.data.success) {
                this.editTradeAllM(true, this.state.oneEditTrade.trade_all);
                this.setState({
                    editTrade: false
                })
            }
            if(res.data.message=='failed'){
                this.notifyWarn("Omorda buncha mahsulot yo'q");
            }
        })
    };lect
    editTradeAll = () => {
        let tradeAll=this.state.oneEditTradeAll;
        if(tradeAll.loan>=0){
            axios({
                url:PATH_PREFIX+'/api/tradeAll/edit/'+tradeAll.id,
                method:'put',
                data: this.state.oneEditTradeAll,
                Authorization:{Authorization}
            }).then(res=>{
                if(res.data.success){
                    this.editTradeAllM(false, null);
                    this.getAllShoppingHistory();
                    this.getSaleHistory();
                    this.getProduct();
                }
            })
        }else{
            this.notifyWarn("Qaytimni bering")
        }
    };
    //delete
    deleteTrade = async (id) => {
        let confirm = await window.confirm("O'chirishni xohlaysizmi");

        if(confirm){
            axios({
                url: PATH_PREFIX + '/api/trade/delete/' + id,
                Authorization: {Authorization},
                method: 'delete'
            }).then(res => {
                if (res.data.success) {
                    this.getAllShoppingHistory();
                    this.getSaleHistory();
                }
            })
        }
    };
    deleteProduct = async () => {
        let realId=this.state.selected.id;
        const {data} = await axios({
            url: PATH_PREFIX + "/api/product/" + this.state.selected.id,
            method: "delete",
            headers: {Authorization},
        });
        if (data.success) {
            this.notifySuccess("Mahsulot o'chirildi");
            this.setState({
                selected: {id: null, name: null, type: "not-selected"},
                isSelectedProduct: null,
            });
            // this.refs.tree.reDrawTree();
            this.refs.tree.deleteOne(realId);
        }
        if (!data.success) {
            this.notifyError("Bu mahsulotni o'chirib bo'lmaydi");
        }
    };
    deleteCategory = async () => {
        let realId=this.state.selected.id;
        const {data} = await axios({
            url: PATH_PREFIX + "/api/category/" + this.state.selected.id,
            method: "delete",
            headers: {Authorization},
        });
        if (data.success) {
            this.notifySuccess("Kategoriya o'chirildi");
            this.setState({
                selected: {id: null, name: null, type: "not-selected"},
                isSelectedProduct: null,
            });
            this.refs.tree.deleteOne(realId);
            // this.refs.tree.reDrawTree();
        }
        if (!data.success) {
            this.notifyError("Bu kategoriyani o'chirib bo'lmaydi");
        }
    };
    deleteProductType = (uuid) => {
        axios({
            url: PATH_PREFIX + "/api/productType/delete/" + uuid,
            method: "delete",
            headers: {Authorization},
        }).then((res) => {
            if (res.data.success) {
                this.notifySuccess("Mahsulot turi o'chirildi");
                this.getProductType();
            }
            if (!res.data.success) {
                this.notifyWarn("Bu mahsulot turni o'chira olmaysiz");
            }
        });
    };
    deleteDeliver = async (id) => {
        let accept = window.confirm(
            "Omborga kelgan mahsulotlarni o'chirishni xohlaysizmi"
        );
        if (accept) {
            await axios({
                url: PATH_PREFIX + "/api/deliver/" + id,
                headers: {Authorization},
                method: "delete",
            }).then((res) => {
                if (res.data.message === "success") {
                    this.notifySuccess("Omborga kelgan mahsulotlar o'chirildi");
                    this.getProduct();
                }
                if (res.data.message === "failed") {
                    this.notifyWarn("Omborda buncha mahsulot yo'q");
                }
                if (res.data.message === "error") {
                    this.notifyError("Tizimda xatolik yuz berdi");
                }
            });
            this.getProductDelivers();
        }
    };

    notifySuccess = (text) => toast.success(text);
    notifyError = (text) => toast.error(text);
    notifyWarn = (text) => toast.warn(text);

    render() {


        const {
            saleHistoryTotal,
            oneEditTradeAll,
            editTradeAll,
            oneEditTrade,
            editTrade,
            historyContent,
            history,
            saleHistory,
            productTab,
            searchToFindParentSelected,
            attachmentId,
            searchToFindParent,
            usd
        } = this.state;
        const {product, category, selected, oneDeliver} = this.state;
        const {
            addCategory,
            editCategory,
            addProduct,
            addDeliverOut,
            editProduct,
            productType,
            addDeliver,
            addWaste,
            editDeliver,
            oneEditDeliver
        } = this.state;
        const {productTypes, productDelivers, stores} = this.state;
        return (
            <div className={"container-fluid"}>
                <div className="codes my-4">
                    <div className="row">
                        <div className="col-4">
                            <div className="btn-group btn-block">
                                <button
                                    onClick={(value) => this.addCategoryM(true)}
                                    className={
                                        "btn rounded-0 btn-outline-dark btn-light fas fa-folder-open p-2"
                                    }
                                >
                                    {" "}
                                    Kategoriya qo'shish
                                </button>
                                <button
                                    onClick={(value) => this.addProductM(true)}
                                    className={
                                        "btn rounded-0 btn-outline-dark btn-light fas fa-file p-2"
                                    }
                                >
                                    {" "}
                                    Mahsulot qo'shish
                                </button>
                            </div>
                        </div>
                        <div className="col-8 text-center">
                            {selected.type === "product" ? (
                                <div>
                                    <b className={"text-primary"}>Mahsulot</b>
                                </div>
                            ) : selected.type === "category" ? (
                                <div>
                                    <b className={"text-info"}>Kategoriya</b>
                                </div>
                            ) : selected.type === "not-selected" ? (
                                <div>
                                    <b className={"text-danger"}>Tanlanmagan</b>
                                </div>
                            ) : (
                                <div>
                                    Tizimda nimadir xatolik yuz berdi. Iltimos qaytadan urinib
                                    ko'ring
                                </div>
                            )}
                        </div>
                    </div>
                    <hr className={"my-1"}/>
                    <div className="row">
                        <div className="col-4">
                            <SearchTree
                                ref="tree"
                                onSelect={(data) => this.onSelectFromTree(data)}
                                reload={this.reload}
                            />
                        </div>
                        <div className="col-8">
                            {selected.type === "product" ? (
                                <div className={"product"}>
                                    {product ? (
                                        <div>
                                            <div className="row">
                                                <div className="col">
                                                    <h2 className={'d-inline'}>{product.path}</h2> <b>{<product
                                                    className="code">{product.code}</product>}</b>asd
                                                </div>
                                                <div className="col">
                                                    <div className={"float-right"}>
                                                        <button onClick={(value) => this.editProductM(true)}
                                                                className={"fas fa-edit fa-md btn text-primary"}>
                                                            Tahrirlash
                                                        </button>
                                                        <button onClick={this.deleteProduct}
                                                                className={"fas fa-trash-alt fa-md btn text-danger"}>
                                                            O'chirish
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row my-1">
                                                <div className="col">
                                                    <button onClick={(tab) => this.productTab("product-remain")}
                                                            className="rounded-0 btn-sm btn btn-outline-dark">
                                                        Ombordagi qoldiq
                                                    </button>
                                                    <button onClick={(tab) => this.productTab("deliver-history")}
                                                            className={
                                                                "rounded-0 btn-sm btn btn-outline-dark"
                                                            }
                                                    >
                                                        Kirimlar tarixi
                                                    </button>
                                                    <button onClick={(tab) => this.productTab("shopping-history")}
                                                            className={
                                                                "rounded-0 btn-sm btn btn-outline-dark"
                                                            }
                                                    >
                                                        Sotuv tarixi
                                                    </button>

                                                    <button
                                                        onClick={(value) => this.addDeliverM(true)}
                                                        className={"btn btn-sm btn-outline-dark btn-light float-right rounded-0"}
                                                    >
                                                        Mahsulot kirim qilish
                                                    </button>

                                                </div>
                                            </div>
                                            {productTab === "product-remain" ? (
                                                <div>
                                                    <div className="row">
                                                        <div className="col-7">
                                                            {
                                                                product.deliver_amount !== 0 ?
                                                                    <div className={"border p-3"}>
                                                                        <p style={{lineHeight: 1}}>
                                                                            <span
                                                                                className={"btn-outline-dark font-weight-bold"}>Ombor: </span>{(Math.round(product.ending_amount * 100) / 100).toLocaleString()} {product.type} +
                                                                            <form className={'d-inline'}
                                                                                  onSubmit={this.addDeliverToBackend}>
                                                                                <input min={0}
                                                                                       step={0.001}
                                                                                       id={'addDeliverToBackend'}
                                                                                       placeholder={'necha ' + product.type + '?'}
                                                                                       className={'border rounded w-25'}
                                                                                       type="number"/>
                                                                            </form>
                                                                        </p>

                                                                        <p>
                                                                            <span
                                                                                className={"btn-outline-dark font-weight-bold"}>Pul birligi: </span>{product.currency == 'UZS' ? "so'm" : "$"}
                                                                        </p>

                                                                        {/*<p style={{lineHeight: 1}}>*/}
                                                                        {/*    <span*/}
                                                                        {/*        className={"btn-outline-dark font-weight-bold"}>Yuan: </span>{product.juan}*/}

                                                                        {/*</p>*/}
                                                                        <hr/>

                                                                        {/*<p style={{lineHeight: 1}}>*/}
                                                                        {/*    <span*/}
                                                                        {/*        className={"btn-outline-dark font-weight-bold"}>Tannarx: </span>{product.price.toLocaleString()} {product.currency == 'UZS' ? "so'm" : "$"}*/}
                                                                        {/*</p>*/}
                                                                        {/*<p style={{lineHeight: 1}}>*/}
                                                                        {/*    <span*/}
                                                                        {/*        className={"btn-outline-dark font-weight-bold"}>Bojxona: </span>{product.custom_cost.toLocaleString()} {product.currency == 'UZS' ? "so'm" : "$"}*/}
                                                                        {/*</p>*/}
                                                                        {/*<p style={{lineHeight: 1}}>*/}
                                                                        {/*    <span*/}
                                                                        {/*        className={"btn-outline-dark font-weight-bold"}>Yo'lkira: </span>{product.fare_cost.toLocaleString()} {product.currency == 'UZS' ? "so'm" : "$"}*/}
                                                                        {/*</p>*/}
                                                                        {/*<p style={{lineHeight: 1}}>*/}
                                                                        {/*    <span*/}
                                                                        {/*        className={"btn-outline-dark font-weight-bold"}>Kelib tushish: </span>{(product.price + product.custom_cost + product.fare_cost).toLocaleString()} {product.currency == 'UZS' ? "so'm" : "$"}*/}
                                                                        {/*</p>*/}
                                                                        {/*<hr/>*/}

                                                                        <p style={{lineHeight: 1}}>
                                                                            <span
                                                                                className={"btn-outline-dark font-weight-bold"}>Chakana savdo: </span>{product.retail_price.toLocaleString()} {product.currency == 'UZS' ? "so'm" : "$"}
                                                                            {/*<h6 style={{lineHeight: 0}}*/}
                                                                            {/*    className={'d-inline'}> {(100 - Math.round((product.price + product.custom_cost + product.fare_cost) / product.retail_price * 100)).toLocaleString()} %</h6>*/}
                                                                        </p>
                                                                        <p style={{lineHeight: 1}}>
                                                                            <span
                                                                                className={"btn-outline-dark font-weight-bold"}>Ulgurji savdo: </span>{product.full_sale_price.toLocaleString()} {product.currency == 'UZS' ? "so'm" : "$"}
                                                                            {/*<h6 style={{lineHeight: 0}}*/}
                                                                            {/*    className={'d-inline'}> {(100 - Math.round((product.price + product.custom_cost + product.fare_cost) / product.full_sale_price * 100)).toLocaleString()} %</h6>*/}
                                                                        </p>
                                                                    </div>
                                                                    : <div className={'text-center'}>
                                                                        <b className={'text-center'}>To'liq ma'lumotni
                                                                            ko'rish uchun kirim qiling</b>
                                                                        <br/>
                                                                        <button
                                                                            onClick={(value) => this.addDeliverM(true)}
                                                                            className={"btn btn-sm btn-outline-primary btn-light rounded-0"}
                                                                        >
                                                                            Mahsulot kirim qilish
                                                                        </button>
                                                                    </div>
                                                            }
                                                        </div>
                                                        <div className="col-5 text-right">
                                                            {
                                                                product.attachment_id ?
                                                                    <img
                                                                        className={"border font"}
                                                                        style={{maxWidth: '100%', maxHeight: '100%'}}
                                                                        src={
                                                                            PATH_PREFIX + "/api/file/get/" + product.attachment_id
                                                                        }
                                                                        alt="product picture"
                                                                    />
                                                                    :
                                                                    <img
                                                                        className={"border font"}
                                                                        style={{width: '100%', height: 300}}
                                                                        src={
                                                                            productImage
                                                                        }
                                                                        alt="product picture"
                                                                    />
                                                            }
                                                            <div className={"text-right"}>
                                                                {product.created_at.substring(0, 10)}
                                                                <br/>{Math.round((product.size / 1024 / 1024) * 100) / 100} mb
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : productTab === "deliver-history" ? (
                                                <div className={"row"}>
                                                    <div className="col">
                                                        <h5 className={"text-center"}>Kirimlar tarixi</h5>
                                                    </div>
                                                    <table className="table">
                                                        <thead>
                                                        <tr>
                                                            <td style={{fontSize: "12px"}} className={"text-center"}>
                                  <span
                                      className={"fas fa-sort-amount-down"}
                                  ></span>
                                                            </td>
                                                            <td style={{fontSize: "12px"}} className={"text-center"}>
                                                                <span className={"fas fa-file"}></span>
                                                                <b> Mahsulot</b>
                                                            </td>
                                                            <td style={{fontSize: "12px"}} className={"text-center"}>
                                                                <b>Soni</b>
                                                            </td>
                                                            {/*<td style={{fontSize: "12px"}} className={"text-center"}>*/}
                                                            {/*    <b>Yuan</b>*/}
                                                            {/*</td>*/}
                                                            <td style={{fontSize: "12px"}} className={"text-center"}>
                                                                <b>Narxi</b>
                                                            </td>
                                  {/*                          <td style={{fontSize: "12px"}} className={"text-center"}>*/}
                                  {/*<span*/}
                                  {/*    className={"fas fa-hand-holding-usd"}*/}
                                  {/*></span>*/}
                                  {/*                              <b> $ narxi</b>*/}
                                  {/*                          </td>*/}
                                  {/*                          <td style={{fontSize: "12px"}} className={"text-center"}>*/}
                                  {/*                              <b>Xarajatlar</b>*/}
                                  {/*                          </td>*/}
                                                            <td style={{fontSize: "12px"}} className={"text-center"}>
                                  <span
                                      className={"fas fa-calendar-day"}
                                  ></span>
                                                                <b> Yaratilgan sana</b>
                                                            </td>
                                                            <td style={{fontSize: "12px"}} className={"text-center"}>
                                  <span
                                      className={"fas fa-calendar-day"}
                                  ></span>
                                                                <b> O'zgartirilgan sana</b>
                                                            </td>
                                                            <td style={{fontSize: "12px"}} className={"text-center"}>
                                  <span
                                      className={"fas fa-tools bg-white border-0"}
                                  ></span>
                                                                <b> Amallar</b>
                                                            </td>
                                                        </tr>
                                                        </thead>
                                                        <tbody>
                                                        {productDelivers ? (
                                                                productDelivers.map((item, index) => (
                                                                <tr>
                                                                    <td
                                                                        style={{fontSize: "12px"}}
                                                                        className={"text-center"}
                                                                    >
                                                                        {index + 1}
                                                                    </td>
                                                                    <td
                                                                        style={{fontSize: "12px"}}
                                                                        className={"text-center"}
                                                                    >
                                                                        {item.product.name}
                                                                    </td>
                                                                    <td
                                                                        style={{fontSize: "12px"}}
                                                                        className={"text-center"}
                                                                    >
                                                                        {item.amount.toLocaleString()}
                                                                    </td>
                                                                    {/*<td*/}
                                                                    {/*    style={{fontSize: "12px"}}*/}
                                                                    {/*    className={"text-center"}*/}
                                                                    {/*>*/}
                                                                    {/*    {item.juan.toLocaleString()}*/}
                                                                    {/*</td>*/}
                                                                    <td
                                                                        style={{fontSize: "12px"}}
                                                                        className={"text-center"}
                                                                    >
                                                                        {Math.round(item.price).toLocaleString()} {item.currencyType}
                                                                    </td>
                                                                    {/*<td*/}
                                                                    {/*    style={{fontSize: "12px"}}*/}
                                                                    {/*    className={"text-center"}*/}
                                                                    {/*>*/}
                                                                    {/*    {Math.round(item.usd).toLocaleString()} USD*/}
                                                                    {/*</td>*/}
                                                                    {/*<td*/}
                                                                    {/*    style={{fontSize: "12px"}}*/}
                                                                    {/*    className={"text-center"}*/}
                                                                    {/*>*/}
                                                                    {/*    {Math.round(*/}
                                                                    {/*        item.otherCosts +*/}
                                                                    {/*        item.fareCost +*/}
                                                                    {/*        item.customCost*/}
                                                                    {/*    ).toLocaleString()}{" "}*/}
                                                                    {/*    {item.currencyType}*/}
                                                                    {/*</td>*/}
                                                                    <td
                                                                        style={{fontSize: "12px"}}
                                                                        className={"text-center"}
                                                                    >
                                                                        {item.createdAt.substring(0, 10)}
                                                                    </td>
                                                                    <td
                                                                        style={{fontSize: "12px"}}
                                                                        className={"text-center"}
                                                                    >
                                                                        {item.updatedAt.substring(0, 10)}
                                                                    </td>
                                                                    <td
                                                                        style={{fontSize: "12px"}}
                                                                        className={"text-center"}
                                                                    >
                                                                        <div className="btn-group">
                                                                            {this.props.currentUser.roles.map(
                                                                                (role) =>
                                                                                    role.roleName ===
                                                                                    "ROLE_DIRECTOR" && (
                                                                                        <Popconfirm onConfirm={(id) =>
                                                                                            this.deleteDeliver(item.id)
                                                                                        }
                                                                                                    title="O'chirmoqchimisiz?"
                                                                                                    okText="Ha"
                                                                                                    cancelText="Yoq">
                                                                                            <button
                                                                                                className={
                                                                                                    "btn btn-sm rounded-0 btn-outline-dark fas fa-trash-alt fa-sm"
                                                                                                }
                                                                                            ></button>
                                                                                        </Popconfirm>

                                                                                    )
                                                                            )}
                                                                            <button
                                                                                onClick={(id) =>
                                                                                    this.editDeliverM(true, item.id)
                                                                                }
                                                                                className={
                                                                                    "btn btn-sm rounded-0 btn-outline-dark fas fa-edit fa-sm"
                                                                                }
                                                                            ></button>
                                                                            {
                                                                                this.state.showWaste &&
                                                                                <button
                                                                                    onClick={(value, waste) =>
                                                                                        this.addWasteM(true, item)
                                                                                    }
                                                                                    className={
                                                                                        "btn btn-sm rounded-0 btn-outline-dark"
                                                                                    }
                                                                                >
                                                                                    {" "}
                                                                                    brak
                                                                                </button>
                                                                            }
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            ))
                                                        ) : (
                                                            <div>sth weird has happened</div>
                                                        )}
                                                        </tbody>
                                                    </table>
                                                    <Pagination
                                                        activePage={this.state.deliverPage}
                                                        itemClass="page-item"
                                                        linkClass="page-link"
                                                        itemsCountPerPage={10}
                                                        totalItemsCount={this.state.deliverTotal}
                                                        pageRangeDisplayed={5}
                                                        onChange={this.handleDeliverPage}
                                                    />
                                                </div>
                                            ) : productTab === "shopping-history" ? (
                                                <div className={"row"}>
                                                    <div className="col">
                                                        <h5 className={"text-center"}>Sotuv tarixi</h5>
                                                        <div className={'text-center w-100'}>
                                                            {/*<DatePicker*/}
                                                            {/*    defaultValue={moment(this.state.saleHistoryDate)}*/}
                                                            {/*    className={'text-center'} onChange={this.onSaleChange}/>*/}
                                                            <RangePicker
                                                                defaultValue={[moment().startOf('month'), moment().endOf('month')]}
                                                                ranges={{
                                                                    'Bu xafta': [moment().startOf('week'), moment().endOf('week')],
                                                                    'Bu oy': [moment().startOf('month'), moment().endOf('month')],
                                                                }}
                                                                onChange={this.onSaleChange}
                                                            />
                                                        </div>

                                                        <table className={'table w-100'}>
                                                            <thead>
                                                            <tr>
                                                                <td style={{fontSize: "12px"}}
                                                                    className={"text-center font-weight-bold"}>№
                                                                </td>
                                                                <td style={{fontSize: "12px"}}
                                                                    className={"text-center font-weight-bold"}>Mijoz
                                                                </td>
                                                                <td style={{fontSize: "12px"}}
                                                                    className={"text-center font-weight-bold"}>Umumiy
                                                                    Narx
                                                                </td>
                                                                <td style={{fontSize: "12px"}}
                                                                    className={"text-center font-weight-bold"}>Chegirma
                                                                </td>
                                                                <td style={{fontSize: "12px"}}
                                                                    className={"text-center font-weight-bold"}>Hisoblandi
                                                                </td>
                                                                <td style={{fontSize: "12px"}}
                                                                    className={"text-center font-weight-bold"}>To'landi
                                                                </td>
                                                                <td style={{fontSize: "12px"}}
                                                                    className={"text-center font-weight-bold"}>Qarz
                                                                </td>
                                                                <td style={{fontSize: "12px"}}
                                                                    className={"text-center font-weight-bold"}>Berilgan
                                                                    vaqt
                                                                </td>
                                                                <td style={{fontSize: "12px"}}
                                                                    className={"text-center font-weight-bold"}>O'zgartirilgan
                                                                    sana
                                                                </td>
                                                            </tr>
                                                            </thead>
                                                            <tbody>
                                                            {
                                                                saleHistory.map((item, index) =>
                                                                    <tr key={item.id} onClick={(value, tradeAllId) => this.historyM(true, item.id)}>
                                                                        <td style={{fontSize: "12px"}}
                                                                            className={"text-center"}>{index + 1}</td>
                                                                        <td style={{fontSize: "12px"}}
                                                                            className={"text-center"}>{item.client}</td>
                                                                        <td style={{fontSize: "12px"}}
                                                                            className={"text-center"}>{(Number(item.totalSum)).toLocaleString()} so'm
                                                                        </td>
                                                                        <td style={{fontSize: "12px"}}
                                                                            className={"text-center"}>{Number(item.discountPrice).toLocaleString()} so'm
                                                                        </td>
                                                                        <td style={{fontSize: "12px"}}
                                                                            className={"text-center"}>{(item.totalSum - item.discountPrice).toLocaleString()} so'm
                                                                        </td>
                                                                        <td style={{fontSize: "12px"}}
                                                                            className={"text-center"}>{(item.totalSum - item.discountPrice - item.loanSum).toLocaleString()} so'm
                                                                        </td>
                                                                        <td style={{fontSize: "12px"}}
                                                                            className={"text-center"}>{item.loanSum.toLocaleString()} so'm
                                                                        </td>
                                                                        <td style={{fontSize: "12px"}}
                                                                            className={"text-center"}>{item.createdAt}</td>
                                                                        <td style={{fontSize: "12px"}}
                                                                            className={"text-center"}>{item.updatedAt}</td>
                                                                    </tr>
                                                                )
                                                            }
                                                            {
                                                                saleHistoryTotal&&
                                                                <TableRow className={'bg-light'}>
                                                                    <TableCell className={'text-center'}><b>Total</b></TableCell>
                                                                    <TableCell className={'text-center'} ></TableCell>
                                                                    <TableCell className={'text-center'} ><b>{saleHistoryTotal.totalSum.toLocaleString()} so'm</b></TableCell>
                                                                    <TableCell className={'text-center'} ><b>{saleHistoryTotal.discount.toLocaleString()} so'm</b></TableCell>
                                                                    <TableCell className={'text-center'} ><b>{(saleHistoryTotal.totalSum-saleHistoryTotal.discount).toLocaleString()} so'm</b></TableCell>
                                                                    <TableCell className={'text-center'} ><b>{(saleHistoryTotal.totalSum-saleHistoryTotal.discount-saleHistoryTotal.loan).toLocaleString()} so'm</b></TableCell>
                                                                    <TableCell className={'text-center'} ><b>{(saleHistoryTotal.loan).toLocaleString()} so'm</b></TableCell>
                                                                    <TableCell className={'text-center'} ></TableCell>
                                                                    <TableCell className={'text-center'} ></TableCell>
                                                                </TableRow>
                                                            }
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className={"row"}>
                                                    <div className="col text-center">
                                                        tizimda nimadir xatolik yuz berdi. Iltimos qaytadan
                                                        urinib ko'ring
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className={"text-center"}>
                                            tizimda nimadir xatolik yuz berdi. Iltimos qaytadan urinib
                                            ko'ring
                                        </div>
                                    )}
                                </div>
                            ) : selected.type === "category" ? (
                                <div className={"category"}>
                                    {category ? (
                                        <div>
                                            <div className="row">
                                                <div className="col">
                                                    <h2 className={"text-center"}>{category.name} </h2>
                                                    <b className={""}>{category.enName} </b>
                                                    <b className={""}>
                                                        - {category.createdAt.substring(0, 10)}
                                                    </b>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col text-center">
                                                    <div>
                                                        <button
                                                            onClick={(value) => this.editCategoryM(true)}
                                                            className={"fas fa-edit fa-md btn text-primary"}
                                                        >
                                                            Tahrirlash
                                                        </button>
                                                        <button
                                                            onClick={this.deleteCategory}
                                                            className={
                                                                "fas fa-trash-alt fa-md btn text-danger"
                                                            }
                                                        >
                                                            O'chirish
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className={"text-center"}>
                                            tizimda nimadir xatolik yuz berdi. Iltimos qaytadan urinib
                                            ko'ring
                                        </div>
                                    )}
                                </div>
                            ) : selected.type === "not-selected" ? (
                                <div className={"not-selected"}>
                                    <div className="row">
                                        <div className="col text-center">
                                            <button
                                                onClick={(value) => this.addCategoryM(true)}
                                                className={"btn fas fa-folder-open fa-lg p-3"}
                                            >
                                                {" "}
                                                Kategoriya qo'shish
                                            </button>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col text-center">
                                            Mahsulot yoki kategoriya tanlangani yo'q.
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className={"text-center"}>
                                    tizimda nimadir xatolik yuz berdi. Iltimos qaytadan urinib
                                    ko'ring
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className="modals">
                    <Modal isOpen={addProduct}>
                        <ModalHeader>Mahsulot qo'shish</ModalHeader>
                        <ModalBody>
                            <form id={"addProduct"} onSubmit={this.addProduct}>
                                {/*search*/}
                                <Select
                                    showSearch
                                    defaultValue={searchToFindParentSelected}
                                    style={{width: "100%"}}
                                    placeholder="Kategoriyani tanlang"
                                    optionFilterProp="children"
                                    onChange={this.onSelectFromInput}
                                    onSearch={this.onSearch}
                                    filterOption={(input, option) =>
                                        option.children
                                            .toLowerCase()
                                            .indexOf(input.toLowerCase()) >= 0
                                    }
                                >
                                    {searchToFindParent.map((item) => (
                                        <Option style={{}} value={item.id}>
                                            {item.path}
                                        </Option>
                                    ))}
                                </Select>
                                {/*inputs*/}
                                <input
                                    placeholder={"nomi"}
                                    className={"form-control float-right my-2"}
                                    type="text"
                                    required
                                />
                                <input
                                    placeholder={"kod"}
                                    className={"form-control float-left w-25 my-2"}
                                    type="text"
                                />
                                <input
                                    placeholder={"en nomi"}
                                    className={"form-control float-left w-75 my-2"}
                                    type="text"
                                />
                                <select
                                    name="productType"
                                    className={"btn border w-75"}
                                    required
                                >
                                    {productTypes.map((item) => (
                                        <option value={item.id}>{item.name}</option>
                                    ))}
                                </select>
                                <button
                                    onClick={(value) => this.productTypeM(true)}
                                    className={"btn w-25 border"}
                                    type={"button"}
                                >
                                    o'zgartirish
                                </button>
                                <Upload
                                    name="attachment"
                                    showUploadList={false}
                                    beforeUpload={this.beforeUpload}
                                    customRequest={this.customRequest}
                                    className="btn btn-block"
                                >
                                    {attachmentId ?
                                        <img src={PATH_PREFIX + "/api/file/get/" + attachmentId} alt="product"
                                             style={{width: '40%'}}/>
                                        :
                                        <div>
                                            <PlusOutlined/>
                                            <div className="mt-2">rasm yuklash</div>
                                        </div>
                                    }
                                </Upload>
                            </form>
                        </ModalBody>
                        <ModalFooter>
                            <button
                                onClick={(value) => this.addProductM(false)}
                                className={"btn btn-outline-danger"}
                            >
                                bekor qilish
                            </button>
                            <button form={"addProduct"} className={"btn btn-outline-primary"}>
                                qo'shish
                            </button>
                        </ModalFooter>
                    </Modal>

                    <Modal isOpen={addCategory}>
                        <ModalHeader>Kategoriya qo'shish</ModalHeader>
                        <ModalBody>
                            <form id={"addCategory"} onSubmit={this.addCategory}>
                                {/*search*/}
                                joylashgan joyi
                                <Select
                                    showSearch
                                    defaultValue={searchToFindParentSelected}
                                    style={{width: "100%"}}
                                    placeholder="Select parent"
                                    optionFilterProp="children"
                                    onChange={this.onSelectFromInput}
                                    onSearch={this.onSearch}
                                    filterOption={(input, option) =>
                                        option.children
                                            .toLowerCase()
                                            .indexOf(input.toLowerCase()) >= 0
                                    }
                                >
                                    {searchToFindParent.map((item) => (
                                        <Option style={{}} value={item.id}>
                                            {item.path}
                                        </Option>
                                    ))}
                                </Select>
                                {/*inputs*/}
                                nomi
                                <input
                                    placeholder={"nomi"}
                                    className={"form-control my-2"}
                                    type="text"
                                    required
                                />
                                inglizchada nomi
                                <input
                                    placeholder={"inglizcha nomi"}
                                    className={"form-control my-2"}
                                    type="text"
                                />
                            </form>
                        </ModalBody>
                        <ModalFooter>
                            <button
                                onClick={(value) => this.addCategoryM(false)}
                                className={"btn btn-outline-danger"}
                            >
                                bekor qilish
                            </button>
                            <button
                                form={"addCategory"}
                                className={"btn btn-outline-primary"}
                            >
                                qo'shish
                            </button>
                        </ModalFooter>
                    </Modal>
                    <Modal isOpen={editCategory}>
                        <ModalHeader>Edit Category</ModalHeader>
                        <ModalBody>
                            {category ? (
                                <form id={"editCategory"} onSubmit={this.editCategory}>
                                    {/*search*/}
                                    joylashgan joyi
                                    <Select
                                        showSearch
                                        defaultValue={searchToFindParentSelected}
                                        style={{width: "100%"}}
                                        placeholder="Select parent"
                                        optionFilterProp="children"
                                        onChange={this.onSelectFromInput}
                                        onSearch={this.onSearch}
                                        filterOption={(input, option) =>
                                            option.children
                                                .toLowerCase()
                                                .indexOf(input.toLowerCase()) >= 0
                                        }
                                    >
                                        {searchToFindParent.map((item) => (
                                            <Option style={{}} value={item.id}>
                                                {item.path}
                                            </Option>
                                        ))}
                                    </Select>
                                    {/*inputs*/}
                                    nomi
                                    <input
                                        defaultValue={category.name}
                                        placeholder={"nomi"}
                                        className={"form-control my-2"}
                                        type="text"
                                        required
                                    />
                                    inglizchada nomi
                                    <input
                                        defaultValue={category.enName}
                                        placeholder={"inglizcha nomi"}
                                        className={"form-control my-2"}
                                        type="text"
                                    />
                                </form>
                            ) : (
                                <div>sth weird has happened</div>
                            )}
                        </ModalBody>
                        <ModalFooter>
                            <button
                                onClick={(value) => this.editCategoryM(false)}
                                className={"btn btn-outline-danger"}
                            >
                                bekor qilish
                            </button>
                            <button
                                form={"editCategory"}
                                className={"btn btn-outline-primary"}
                            >
                                tahrirlash
                            </button>
                        </ModalFooter>
                    </Modal>

                    <Modal isOpen={editProduct}>
                        <ModalHeader>Mahsulotni tahrirlash</ModalHeader>
                        <ModalBody>
                            {product ? (
                                <form id={"editProduct"} onSubmit={this.editProduct}>
                                    <Select
                                        showSearch
                                        defaultValue={searchToFindParentSelected}
                                        style={{width: "100%"}}
                                        placeholder="Kategoriyani tanlang"
                                        optionFilterProp="children"
                                        onChange={this.onSelectFromInput}
                                        onSearch={this.onSearch}
                                        filterOption={(input, option) =>
                                            option.children
                                                .toLowerCase()
                                                .indexOf(input.toLowerCase()) >= 0
                                        }
                                    >
                                        {searchToFindParent.map((item) => (
                                            <Option style={{}} value={item.id}>
                                                {item.path}
                                            </Option>
                                        ))}
                                    </Select>
                                    {/*inputs*/}
                                    <input
                                        defaultValue={product.name}
                                        placeholder={"nomi"}
                                        className={"form-control float-right my-2"}
                                        type="text"
                                        required
                                    />
                                    <input
                                        defaultValue={product.code}
                                        placeholder={"kod"}
                                        className={"form-control float-left w-25 my-2"}
                                        type="text"
                                    />
                                    <input
                                        defaultValue={product.en_name}
                                        placeholder={"en nomi"}
                                        className={"form-control float-left w-75 my-2"}
                                        type="text"
                                    />
                                    <select
                                        defaultValue={product.type_id}
                                        name="productType"
                                        className={"btn border w-75"}
                                        required
                                    >
                                        {productTypes.map((item) => (
                                            <option value={item.id}>{item.name}</option>
                                        ))}
                                    </select>
                                    <button
                                        onClick={(value) => this.productTypeM(true)}
                                        className={"btn w-25 border"}
                                        type={"button"}
                                    >
                                        o'zgartirish
                                    </button>
                                    <Upload
                                        name="attachment"
                                        showUploadList={false}
                                        beforeUpload={this.beforeUpload}
                                        customRequest={this.customRequest}
                                        className="btn btn-block"
                                    >
                                        {attachmentId ? (
                                            <img
                                                src={PATH_PREFIX + "/api/file/get/" + attachmentId}
                                                alt="product"
                                                style={{width: "150px", height: "150px"}}
                                            />
                                        ) : (
                                            <div>
                                                <PlusOutlined/>
                                                <div className="mt-2">rasm yuklash</div>
                                            </div>
                                        )}
                                    </Upload>
                                </form>
                            ) : (
                                <div>sth weird has happened</div>
                            )}
                        </ModalBody>
                        <ModalFooter>
                            <button
                                onClick={(value) => this.editProductM(false)}
                                className={"btn btn-outline-danger"}
                            >
                                bekor qilish
                            </button>
                            <button
                                form={"editProduct"}
                                className={"btn btn-outline-primary"}
                            >
                                tahrirlash
                            </button>
                        </ModalFooter>
                    </Modal>

                    <Modal isOpen={productType} size={"lg"}>
                        <ModalBody>
                            <div className={"row"}>
                                {productTypes.map((item, index) => (
                                    <div className="col-6 my-2">
                                        <div className="card">
                                            <div className="card-body">
                                                {item.name}

                                                <button
                                                    onClick={(uuid) => this.deleteProductType(item.id)}
                                                    className={"text-danger float-right btn"}
                                                >
                                                    <span className={'fas fa-times fa-sm'}></span>
                                                </button>
                                                {
                                                    item.main ?
                                                        <button
                                                            disabled
                                                            className={"text-success float-right btn"}
                                                        >
                                                            <span className={'fas fa-check fa-sm'}></span>
                                                        </button>
                                                        :
                                                        <button
                                                            onClick={(uuid) => this.editProductTypeMain(item.id)}
                                                            className={"text-secondary float-right btn"}
                                                        >
                                                            <span className={'fas fa-circle-notch fa-sm'}></span>
                                                        </button>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="row">
                                <form className={'w-100'} onSubmit={this.addProductType}>
                                    <input
                                        placeholder={"mahsulot turi"}
                                        required
                                        type="text"
                                        className={"btn border w-75"}
                                    />
                                    <button className={"btn border w-25"}>Qo'shish</button>
                                </form>
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <button
                                className={"btn btn-outline-danger"}
                                onClick={(value) => this.productTypeM(false)}
                            >
                                chiqish
                            </button>
                        </ModalFooter>
                    </Modal>
                    <Modal isOpen={addDeliver} size={"md"}>
                        <ModalHeader>Omborga mahsulot qo'shish</ModalHeader>
                        <ModalBody>
                            {oneDeliver ? (
                                <div className={'text-right'}>
                                    <div className={'my-1'}>
                                        <b className={'d-inline'}>Pul birligi: </b>
                                        <select
                                            onChange={(event, type) => this.oneDelivers(event, "currency")}
                                            value={oneDeliver.currency} className={'border btn d-inline'} required>
                                            <option value="USD">$</option>
                                            <option value="UZS">So'm</option>
                                        </select> <br/>
                                    </div>
                                    <div className={'my-1'}>
                                        <b className={'d-inline'}>Buyurtmadagi mahsulotlar soni: </b>
                                        <input onChange={(event, type) => this.oneDelivers(event, "amount")}
                                               value={oneDeliver.amount} className={'border btn d-inline'}
                                               type="number"/> <br/>
                                    </div>
                                    {/*<div className={'my-1'}>*/}
                                    {/*    <b className={'d-inline'}>Tannarx: </b>*/}
                                    {/*    <input onChange={(event, type) => this.oneDelivers(event, "price")}*/}
                                    {/*           value={oneDeliver.price} className={'border btn d-inline'}*/}
                                    {/*           type="number"/> <br/>*/}
                                    {/*</div>*/}

                                    {/*<div className="row border m-1 my-2">*/}
                                    {/*    <div className="col-6">*/}
                                    {/*        <div className={'my-1'}>*/}
                                    {/*            <b className={'d-inline'}>Tannarx:</b>*/}
                                    {/*            <input onChange={(event, type) => this.oneDelivers(event, "price")}*/}
                                    {/*                   value={oneDeliver.price} className={'border btn d-inline'}*/}
                                    {/*                   type="number"/> <br/>*/}
                                    {/*        </div>*/}
                                    {/*        <div className={'my-1'}>*/}
                                    {/*            <b className={'d-inline'}>Yo'lkira:</b>*/}
                                    {/*            <input step={0.001}*/}
                                    {/*                   onChange={(event, type) => this.oneDelivers(event, "fareCost")}*/}
                                    {/*                   value={oneDeliver.fareCost} className={'border btn d-inline'}*/}
                                    {/*                   type="number"/> <br/>*/}
                                    {/*        </div>*/}
                                    {/*        <div className={'my-1'}>*/}
                                    {/*            <b className={'d-inline'}>Bojxona:</b>*/}
                                    {/*            <input onChange={(event, type) => this.oneDelivers(event, "customCost")}*/}
                                    {/*                   value={oneDeliver.customCost.toLocaleString()}*/}
                                    {/*                   className={'border btn d-inline'}*/}
                                    {/*                   type="number"/> <br/>*/}
                                    {/*        </div>*/}

                                    {/*        <div className={'my-1'}>*/}
                                    {/*            <b className={'d-inline'}>Yuan:</b>*/}
                                    {/*            <input onChange={(event, type) => this.oneDelivers(event, "juan")}*/}
                                    {/*                   value={oneDeliver.juan.toLocaleString()}*/}
                                    {/*                   className={'border btn d-inline'}*/}
                                    {/*                   type="number"/> <br/>*/}
                                    {/*        </div>*/}
                                    {/*    </div>*/}
                                    {/*    <div className="col-6 h-100 my-auto">*/}
                                    {/*        <h6>Xarajatlar yig'indisi</h6>*/}
                                    {/*        <hr/>*/}
                                    {/*        <h4 className={'d-inline bg-white'}>{(Math.round(oneDeliver.endingExpense * 100) / 100).toLocaleString()}</h4> {oneDeliver.currency === 'UZS' ?*/}
                                    {/*        <div className={'d-inline'}>so'm</div> :*/}
                                    {/*        <div className={'d-inline'}>$</div>}*/}
                                    {/*    </div>*/}
                                    {/*</div>*/}

                                    <div className="row border my-2">
                                        <div className="col-12">
                                            <div className={'my-1'}>
                                                <b className={'d-inline'}>Chakana savdo: </b>

                                                <input
                                                    onChange={(event, type) => this.oneDelivers(event, "retailPrice")}
                                                    value={oneDeliver.retailPrice} className={'border btn d-inline'}
                                                    type="number"/> <br/>
                                            </div>
                                            <div className={'my-1'}>
                                                <b className={'d-inline'}>Ulgurji savdo: </b>
                                                <input
                                                    onChange={(event, type) => this.oneDelivers(event, "fullSalePrice")}
                                                    value={oneDeliver.fullSalePrice} className={'border btn d-inline'}
                                                    type="number"/> <br/>
                                            </div>
                                        </div>
                                        {/*<div className="col-6 my-1">*/}
                                        {/*    <div>*/}
                                        {/*        Chakana savdo foyda*/}
                                        {/*        <br/>*/}
                                        {/*        <h5 className={'d-inline'}>{oneDeliver.retailPricePercentage}</h5> %*/}
                                        {/*    </div>*/}
                                        {/*    <hr/>*/}
                                        {/*    <div>*/}
                                        {/*        Ulgurji savdo foyda*/}
                                        {/*        <br/>*/}
                                        {/*        <h5 className={'d-inline'}>{oneDeliver.fullSalePricePercentage}</h5> %*/}
                                        {/*    </div>*/}
                                        {/*</div>*/}
                                    </div>
                                </div>
                            ) : (
                                <div>sth weird has happened</div>
                            )}
                        </ModalBody>
                        <ModalFooter>
                            <button
                                className={"btn btn-outline-danger"}
                                onClick={(value) => this.addDeliverM(false)}
                            >
                                bekor qilish
                            </button>
                            <button onClick={this.addDeliver} className={"btn btn-outline-primary"}>
                                qo'shish
                            </button>
                        </ModalFooter>
                    </Modal>
                    <Modal isOpen={editDeliver} size={"md"}>
                        <ModalHeader>Kelgan mahsulotni o'zgartirish</ModalHeader>
                        <ModalBody>
                            {oneEditDeliver ? (
                                <div className={'text-right'}>
                                    <div className={'my-1'}>
                                        <b className={'d-inline'}>Pul birligi: </b>
                                        <select
                                            onChange={(event, type) => this.oneEditDelivers(event, "currency")}
                                            value={oneEditDeliver.currencyType} className={'border btn d-inline'}
                                            required>
                                            <option value="USD">$</option>
                                            <option value="UZS">So'm</option>
                                        </select> <br/>
                                    </div>
                                    <div className={'my-1'}>
                                        <b className={'d-inline'}>Buyurtmadagi mahsulotlar soni: </b>
                                        <input onChange={(event, type) => this.oneEditDelivers(event, "amount")}
                                               value={oneEditDeliver.amount} className={'border btn d-inline'}
                                               type="number"/> <br/>
                                    </div>
                                    {/*<div className={'my-1'}>*/}
                                    {/*    <b className={'d-inline'}>Tannarx: </b>*/}
                                    {/*    <input onChange={(event, type) => this.oneEditDelivers(event, "price")}*/}
                                    {/*           value={oneEditDeliver.price} className={'border btn d-inline'}*/}
                                    {/*           type="number"/> <br/>*/}
                                    {/*</div>*/}
                                    {/*<div className="row border m-1 my-2">*/}
                                    {/*    <div className="col-6">*/}
                                    {/*        <div className={'my-1'}>*/}
                                    {/*            <b className={'d-inline'}>Tannarx:</b>*/}
                                    {/*            <input onChange={(event, type) => this.oneEditDelivers(event, "price")}*/}
                                    {/*                   value={oneEditDeliver.price} className={'border btn d-inline'}*/}
                                    {/*                   type="number"/> <br/>*/}
                                    {/*        </div>*/}
                                    {/*        <div className={'my-1'}>*/}
                                    {/*            <b className={'d-inline'}>Yo'lkira:</b>*/}
                                    {/*            <input step={0.001}*/}
                                    {/*                   onChange={(event, type) => this.oneEditDelivers(event, "fareCost")}*/}
                                    {/*                   value={oneEditDeliver.fareCost} className={'border btn d-inline'}*/}
                                    {/*                   type="number"/> <br/>*/}
                                    {/*        </div>*/}
                                    {/*        <div className={'my-1'}>*/}
                                    {/*            <b className={'d-inline'}>Bojxona:</b>*/}
                                    {/*            <input*/}
                                    {/*                onChange={(event, type) => this.oneEditDelivers(event, "customCost")}*/}
                                    {/*                value={oneEditDeliver.customCost} className={'border btn d-inline'}*/}
                                    {/*                type="number"/> <br/>*/}
                                    {/*        </div>*/}

                                    {/*        <div className={'my-1'}>*/}
                                    {/*            <b className={'d-inline'}>Yuan:</b>*/}
                                    {/*            <input onChange={(event, type) => this.oneEditDelivers(event, "juan")}*/}
                                    {/*                   value={oneEditDeliver.juan} className={'border btn d-inline'}*/}
                                    {/*                   type="number"/> <br/>*/}
                                    {/*        </div>*/}
                                    {/*    </div>*/}
                                    {/*    <div className="col-6 h-100 my-auto">*/}
                                    {/*        <h6>Xarajatlar yig'indisi</h6>*/}
                                    {/*        <hr/>*/}
                                    {/*        <h4 className={'d-inline bg-white'}>{(Math.round(oneEditDeliver.endingExpense * 100) / 100).toLocaleString()}</h4> {oneEditDeliver.currency === 'UZS' ?*/}
                                    {/*        <div className={'d-inline'}>so'm</div> :*/}
                                    {/*        <div className={'d-inline'}>$</div>}*/}
                                    {/*    </div>*/}
                                    {/*</div>*/}

                                    {
                                        oneEditDeliver.isLast &&
                                        <div className="row border my-2">
                                            <div className="col-12">
                                                <div className={'my-1'}>
                                                    <b className={'d-inline'}>Chakana savdo: </b>

                                                    <input
                                                        onChange={(event, type) => this.oneEditDelivers(event, "retailPrice")}
                                                        value={oneEditDeliver.retailPrice}
                                                        className={'border btn d-inline'}
                                                        type="number"/> <br/>
                                                </div>
                                                <div className={'my-1'}>
                                                    <b className={'d-inline'}>Ulgurji savdo: </b>
                                                    <input
                                                        onChange={(event, type) => this.oneEditDelivers(event, "fullSalePrice")}
                                                        value={oneEditDeliver.fullSalePrice}
                                                        className={'border btn d-inline'}
                                                        type="number"/> <br/>
                                                </div>
                                            </div>
                                            {/*<div className="col-6 my-1">*/}
                                            {/*    <div>*/}
                                            {/*        Chakana savdo foyda*/}
                                            {/*        <br/>*/}
                                            {/*        <h5 className={'d-inline'}>{oneEditDeliver.retailPricePercentage}</h5> %*/}
                                            {/*    </div>*/}
                                            {/*    <hr/>*/}
                                            {/*    <div>*/}
                                            {/*        Ulgurji savdo foyda*/}
                                            {/*        <br/>*/}
                                            {/*        <h5 className={'d-inline'}>{oneEditDeliver.fullSalePricePercentage}</h5> %*/}
                                            {/*    </div>*/}
                                            {/*</div>*/}
                                        </div>
                                    }

                                </div>
                            ) : (
                                <div>sth weird has happened</div>
                            )}
                        </ModalBody>
                        <ModalFooter>
                            <button
                                className={"btn btn-outline-danger"}
                                onClick={(value) => this.editDeliverM(false)}
                            >
                                bekor qilish
                            </button>
                            <button onClick={this.editDeliver} className={"btn btn-outline-primary"}>
                                tahrirlash
                            </button>
                        </ModalFooter>
                    </Modal>

                    <Modal isOpen={addWaste}>
                        <ModalHeader>Brak qo'shish</ModalHeader>
                        <ModalBody>
                            <form id={"addWaste"} onSubmit={this.addWaste}>
                                <input type="number" placeholder={"brak mahsulotlar soni"}
                                       className={"form-control my-2"}
                                       max={this.state.waste.amount && product.ending_amount} min={0} required/>
                                <input type="text" placeholder={"qo'shimcha izoh"} className={"form-control my-2"}
                                       required/>
                            </form>
                        </ModalBody>
                        <ModalFooter>
                            <button className={"btn btn-outline-danger"}
                                    onClick={(value) => this.addWasteM(false)}>bekor qilish
                            </button>
                            <button form={"addWaste"} className={"btn btn-outline-primary"}>qo'shish</button>
                        </ModalFooter>
                    </Modal>
                    <Modal isOpen={history} size={'lg'}>
                        <ModalBody>
                            <div className={'text-right text-danger'}
                                 onClick={(value, id) => this.historyM(false, null)}>
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
                                    <th>Ammallar</th>
                                </tr>
                                </thead>
                                <tbody>
                                {
                                    historyContent.map((item, index) =>
                                        <tr>
                                            <td>{index + 1}</td>
                                            <td>{item.product}</td>
                                            <td>{item.amount} {item.type}</td>
                                            <td>{(item.currencyType === 'USD' ? item.price * item.usd : item.price).toLocaleString()} so'm</td>
                                            <td>{item.discountPrice.toLocaleString()} so'm</td>
                                            <td>{(item.amount * (item.currencyType === 'USD' ? item.price * item.usd : item.price)).toLocaleString()} so'm</td>
                                            <td style={{fontSize: "14px"}} className={"text-center"}>
                                                <button onClick={(value, id) => this.editTradeM(true, item.id)}
                                                        className={'btn '}><span
                                                    className={'fas fa-edit fa-sm text-primary'}></span></button>


                                                <button className={'btn '} onClick={id => this.deleteTrade(item.id)}>
                                                    <span className={'fas fa-trash fa-sm text-danger'}></span></button>

                                            </td>
                                        </tr>
                                    )
                                }
                                </tbody>
                            </table>
                        </ModalBody>
                    </Modal>
                    <Modal isOpen={editTrade}>
                        <ModalHeader>Sotilgan Mahsulotni Tahrirlash</ModalHeader>
                        <ModalBody>
                            {
                                oneEditTrade &&
                                <form id={"editTrade"} onSubmit={this.editTrade}>
                                    soni
                                    <input defaultValue={oneEditTrade.amount} className={'form-control'} type="number"/>
                                    chegirma
                                    <input defaultValue={oneEditTrade.discountPrice} className={'form-control'}
                                           type="number"/>
                                </form>
                            }
                        </ModalBody>
                        <ModalFooter>
                            <button onClick={(value, id) => this.editTradeM(false, null)}
                                    className={'btn btn-outline-danger'}>Bekor qilish
                            </button>
                            <button form={"editTrade"} className={'btn btn-outline-primary'}>Tahrirlash</button>
                        </ModalFooter>
                    </Modal>

                        <Modal isOpen={editTradeAll}>

                            <ModalHeader>Hisoblandi: {oneEditTradeAll&&oneEditTradeAll.trade.toLocaleString()} so'm</ModalHeader>
                            <ModalBody>
                                {
                                    oneEditTradeAll &&
                                <form>
                                    Naqd
                                    <input onChange={(event, value) => this.oneEditTradeAll(event, 'cash')}
                                           value={oneEditTradeAll.cash} className={'form-control'} placeholder={'Naqd'}
                                           type="number"/>
                                    Plastik
                                    <input onChange={(event, value) => this.oneEditTradeAll(event, 'card')}
                                           value={oneEditTradeAll.card} className={'form-control'}
                                           placeholder={'Plastik'} type="number"/>
                                    Bank
                                    <input onChange={(event, value) => this.oneEditTradeAll(event, 'bank')}
                                           value={oneEditTradeAll.bank} className={'form-control'} placeholder={'Bank'}
                                           type="number"/>
                                    Umumiy Chegirma
                                    <input onChange={(event, value) => this.oneEditTradeAll(event, 'discount')}
                                           value={oneEditTradeAll.discount} className={'form-control'}
                                           placeholder={'Umumiy Chegirma'} type="number"/>
                                    {oneEditTradeAll.trade-oneEditTradeAll.cash-oneEditTradeAll.card-oneEditTradeAll.bank-oneEditTradeAll.discount >= 0 ? 'Qarz' : 'Qaytim'}
                                    <input disabled value={Math.abs(oneEditTradeAll.trade-oneEditTradeAll.cash-oneEditTradeAll.card-oneEditTradeAll.bank-oneEditTradeAll.discount).toLocaleString()} className={'form-control'}
                                           type="text"/>
                                </form>
                                }
                            </ModalBody>
                            <ModalFooter>
                                <button onClick={this.editTradeAll} className={'btn btn-outline-primary'}>Tahrirlash</button>
                            </ModalFooter>

                        </Modal>
                    <div>
                        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false}
                                        newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable
                                        pauseOnHover/>
                    </div>
                </div>
            </div>
        );
    }
}

export default Index;