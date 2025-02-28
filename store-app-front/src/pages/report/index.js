import React, {Component, PureComponent} from 'react';
import axios from 'axios';
import {PATH_PREFIX, Authorization} from "../../utils/path_controller";
import productImage from '../../assets/product.png'
import Pagination from "react-js-pagination";
import {DatePicker, Popconfirm} from "antd";
import {Tab, TabList, TabPanel, Tabs} from "react-web-tabs";
import Avatar from "../../assets/avatar.png";
import moment from "moment";
import {Modal, ModalBody} from "reactstrap";

const {RangePicker} = DatePicker;

class Index extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            loading:false,
            data: [],
            search: '',
            sort: 'no',
            page: 0,
            tradeAllPage: 0,
            totalElements: 0,
            excel: null,
            historyModal:false,
            historyId:false,
            deliverPage: 1,
            historyContent:[],
            delivers: [],
            tradeAll: [],
            deliverTotal: 0,
            tradeAllTotal: 0,
            deliverSearch: '',
            start: [moment().startOf('month'), moment().endOf('month')][0],
            end: [moment().startOf('month'), moment().endOf('month')][1],
            startTradeAll: [moment().startOf('month'), moment().endOf('month')][0],
            endTradeAll: [moment().startOf('month'), moment().endOf('month')][1],
        };
    }

    getData = () => {
        axios({
            url: PATH_PREFIX + '/api/product/remain',
            headers: {Authorization},
            params: {
                search: this.state.search,
                sort: this.state.sort,
                page: this.state.page,
                size: 10
            }
        }).then(res => {
            if (res.data.success) {
                console.log(res.data.object.content)
                this.setState({
                    data: res.data.object.content,
                    totalElements: res.data.object.totalElements
                });
            }
        })
    };
    handlePageChange = async (pageNumber) => {
        await this.setState({
            data: []
        });
        await this.setState({
            page: pageNumber - 1
        });
        this.getData();
    };
    handleTradeAllPageChange = async (pageNumber) => {
        await this.setState({
            tradeAll: []
        });
        await this.setState({
            tradeAllPage: pageNumber - 1
        });
        this.getTradeAll();
    };
    getDelivers = async () => {
        const {data} = await axios({
            url: PATH_PREFIX + "/api/deliver/history",
            headers: {Authorization},
            params: {
                size: 10,
                page: this.state.deliverPage - 1,
                start: this.state.start,
                end: this.state.end,
                // start:'08-10-2020',
                // end:'08-29-2020',
                search: this.state.deliverSearch
            }
        });

        if (data.success) {
            this.setState({
                delivers: data.object.content,
                deliverTotal: data.object.totalElements
            });
        }
    };

    getTradeAll = async () => {
        const {data} = await axios({
            url: PATH_PREFIX + "/api/tradeAll/allhistory",
            headers: {Authorization},
            params: {
                size: 10,
                page: this.state.deliverPage - 1,
                start: this.state.startTradeAll,
                end: this.state.endTradeAll,
                // start:'08-10-2020',
                // end:'08-29-2020',
                // search:this.state.deliverSearch
            }
        });
        console.log(data);

        if (data.success) {
            this.setState({
                tradeAll: data.object.content,
                tradeAllTotal: data.object.totalElements
            });
        }
    };
    searchChange = async (event) => {
        await this.setState({
            search: event.target.value
        });
        this.getData();
    };
    deliverSearchChange = async (event) => {
        await this.setState({
            deliverSearch: event.target.value,
            page: 0
        });
        this.getDelivers();
    };
    sort = async (value) => {
        await this.setState({
            sort: value
        });
        this.getData();
    };

    componentDidMount() {
        this.getData();
        this.getDelivers();
        this.getTradeAll();
    }

    downloadExcel = async () => {
        this.setState({
            loading:true
        })
        await axios({
            url: PATH_PREFIX + '/api/download/product.xlsx',
            headers: {
                Authorization
            },
            responseType: 'blob',
        }).then(({data}) => {
            const downloadUrl = window.URL.createObjectURL(new Blob([data]));
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.setAttribute('download', "Mahsulotlar_qoldig'i.xlsx"); //any other extension
            document.body.appendChild(link);
            link.click();
            link.remove();
            this.setState({
                loading:false
            })
        });
    };
    downloadDeliverExcel = async () => {
        await axios({
            url: PATH_PREFIX + '/api/download/deliver.xlsx',
            headers: {
                Authorization
            },
            responseType: 'blob',
        }).then(({data}) => {
            const downloadUrl = window.URL.createObjectURL(new Blob([data]));
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.setAttribute('download', "Kirimlar_Hisoboti.xlsx"); //any other extension
            document.body.appendChild(link);
            link.click();
            link.remove();
        });
    };
    handleDeliverPage = async (value) => {
        await this.setState({
            deliverPage: value
        });
        this.getDelivers();
    };
    onDateSelect = async (dates, dateStrings) => {

        if (dates != null) {
            await this.setState({
                start: dates[0],
                end: dates[1]
            });
            this.getDelivers()
        }
    };
    onDateSelectTradeAll = async (dates, dateStrings) => {
        if (dates != null) {
            await this.setState({
                startTradeAll: dates[0],
                endTradeAll: dates[1]
            });
            this.getTradeAll()
        }
    };
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


    render() {
        const {delivers} = this.state;
        return (
            <div className={"container-fluid"}>
                <Tabs defaultTab="tab-one">
                    <TabList>
                        <Tab tabFor="tab-one">Ombordagi Qoldiq</Tab>
                        <Tab tabFor="tab-two">Kirimlar Hisoboti</Tab>
                        <Tab tabFor="tab-three">Sotuv Hisoboti</Tab>
                        {/*<Tab tabFor="tab-four">TradeAll Hisoboti</Tab>*/}
                    </TabList>
                    <TabPanel className={'w-100 my-2'} tabId="tab-one">
                        <div className="row">
                            <div className="col-8">
                                <button onClick={this.downloadExcel} className={'btn btn-white'}><span
                                    className={'fas fa-download text-dark'}></span></button>
                            </div>
                            <div className="col-4">
                                <input placeholder={'Qidirish'} onChange={this.searchChange} className={'form-control'}
                                       type="text"/>
                            </div>
                        </div>
                        <div className="row my-1">
                            <div className="col-12">
                                <div style={{display: "table"}} className={'table'}>
                                    <thead className={'w-100'}>
                                    <tr className={'w-100'}>
                                        <td className={'text-center'}><b className='font-weight-bold'>№</b></td>
                                        <td className={'text-center'}><b className='font-weight-bold'>Rasm</b></td>
                                        <td className={'text-center'}><b className='font-weight-bold'>Mahsulot nomi</b>
                                        </td>
                                        <td className={'text-center'}><b className='font-weight-bold'>Mahsulot
                                            nomiEn</b></td>
                                        <td className={'text-center'}><b className='font-weight-bold'>Kod</b></td>
                                        <td className={'text-center'}><b
                                            className='font-weight-bold'>Miqdori {this.state.sort === 'up' ?
                                            <button onClick={value => this.sort('down')}
                                                    className='btn btn-sm btn-white'><span
                                                className={'fas fa-sort-up'}></span></button> :
                                            this.state.sort === 'down' ?
                                                <button onClick={value => this.sort('no')}
                                                        className='btn btn-sm btn-white'><span
                                                    className={'fas fa-sort-down'}></span></button> :
                                                <button onClick={value => this.sort('up')}
                                                        className='btn btn-sm btn-white'><span
                                                    className={'fas fa-sort'}></span></button>}</b></td>
                                        {/*<td className={'text-center'}><b className='font-weight-bold'>Kelib tushish narxi</b></td>*/}
                                        {/*<td className={'text-center'}><b className='font-weight-bold'>Kelib tushish narxi bo'yicha summa</b></td>*/}
                                        {/*<td className={'text-center'}><b className='font-weight-bold'>Tan narxi</b></td>*/}
                                        <td className={'text-center'}><b className='font-weight-bold'>Chakana narxi</b>
                                        </td>
                                        <td className={'text-center'}><b className='font-weight-bold'>Ulgurji narxi</b>
                                        </td>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {
                                        this.state.data.map((item, index) =>
                                            <tr>
                                                <td className='text-center px-1'>{index + 1}</td>
                                                <td className='text-center px-1'><img style={{width: 40, height: 30}}
                                                                                      src={item.content === null ? productImage : 'data:image/jpg;base64,' + item.content}
                                                                                      alt={'mahsulot'}/></td>
                                                <td className='text-center px-1'>{item.uz_name}</td>
                                                <td className='text-center px-1'>{item.en_name}</td>
                                                <td className='text-center px-0'>{item.code}</td>
                                                <td className='text-center px-1'>{item.amount.toLocaleString()}</td>
                                                {/*<td className='myFont text-center px-1'>{item.ending_price.toLocaleString()} {item.currency=='UZS'?"so'm":"$"}</td>*/}
                                                {/*<td className='myFont text-center px-1'>{item.amount_ending_price.toLocaleString()} {item.currency=='UZS'?"so'm":"$"}</td>*/}
                                                {/*<td className='myFont text-center px-1'>{item.price.toLocaleString()} {item.currency=='UZS'?"so'm":"$"}</td>*/}
                                                <td className='text-center px-1'>{item.retail_price.toLocaleString()} {item.currency == 'UZS' ? "so'm" : "$"}</td>
                                                <td className='text-center px-1'>{item.full_sale_price.toLocaleString()} {item.currency == 'UZS' ? "so'm" : "$"}</td>
                                            </tr>
                                        )
                                    }
                                    </tbody>
                                </div>
                                <Pagination
                                    itemClass="page-item"
                                    linkClass="page-link"
                                    itemsCountPerPage={10}
                                    activePage={this.state.page + 1}
                                    totalItemsCount={this.state.totalElements}
                                    pageRangeDisplayed={5}
                                    onChange={this.handlePageChange}
                                />
                            </div>
                        </div>
                    </TabPanel>
                    <TabPanel className={'w-100 my-2'} tabId="tab-two">
                        <div className="row mb-1">
                            <div className={"col-1"}>
                                <button onClick={this.downloadDeliverExcel} className={'btn btn-white'}><span
                                    className={'fas fa-download text-dark'}></span></button>
                            </div>
                            <div className="col-7">
                                <div style={{width: '100%'}}>
                                    <RangePicker
                                        defaultValue={[moment().startOf('month'), moment().endOf('month')]}
                                        ranges={{
                                            'Bu xafta': [moment().startOf('week'), moment().endOf('week')],
                                            'Bu oy': [moment().startOf('month'), moment().endOf('month')],
                                            'Bu yil': [moment().startOf('year'), moment().endOf('year')],
                                        }}
                                        onChange={this.onDateSelect}
                                    />
                                </div>
                            </div>
                            <div className="col-4">
                                <input placeholder={'Qidirish'} onChange={this.deliverSearchChange}
                                       className={'form-control'} type="text"/>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col">
                                <table className="table">
                                    <thead>
                                    <tr>
                                        <td className={"text-center"}>
                                  <span
                                      className={"fas fa-sort-amount-down"}
                                  ></span>
                                        </td>
                                        <td className={"text-center"}>
                                            <span className={"fas fa-file"}></span>
                                            <b> Mahsulot</b>
                                        </td>
                                        <td className={"text-center"}>
                                            <b>Soni</b>
                                        </td>
                                        {/*<td className={"text-center"}>*/}
                                        {/*    <b>Narxi</b>*/}
                                        {/*</td>*/}
                                        <td className={"text-center"}>
                                  <span
                                      className={"fas fa-hand-holding-usd"}
                                  ></span>
                                            <b> $ narxi</b>
                                        </td>
                                        <td className={"text-center"}>
                                  <span
                                      className={"fas fa-calendar-day"}
                                  ></span>
                                            <b> Yaratilgan sana</b>
                                        </td>
                                        <td className={"text-center"}>
                                  <span
                                      className={"fas fa-calendar-day"}
                                  ></span>
                                            <b> O'zgartirilgan sana</b>
                                        </td>
                                        {/*<td style={{fontSize: "12px"}} className={"text-center"}>*/}
                                        {/*      <span*/}
                                        {/*          className={"fas fa-tools bg-white border-0"}*/}
                                        {/*      ></span>*/}
                                        {/*    <b> Amallar</b>*/}
                                        {/*</td>*/}
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {delivers ? (
                                        delivers.map((item, index) => (
                                            <tr>
                                                <td
                                                    className={"text-center"}
                                                >
                                                    {index + 1}
                                                </td>
                                                <td
                                                    className={"text-center"}
                                                >
                                                    {item.parents}
                                                </td>
                                                <td
                                                    className={"text-center"}
                                                >
                                                    {item.amount.toLocaleString()}
                                                </td>
                                                {/*<td*/}
                                                {/*    className={"text-center"}*/}
                                                {/*>*/}
                                                {/*    {Math.round(item.price).toLocaleString()} {item.currencyType}*/}
                                                {/*</td>*/}
                                                <td
                                                    className={"text-center"}
                                                >
                                                    {Math.round(item.usd).toLocaleString()} USD
                                                </td>
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
                                                    className={"text-center"}
                                                >
                                                    {item.createdAt.substring(0, 10)}
                                                </td>
                                                <td
                                                    className={"text-center"}
                                                >
                                                    {item.updatedAt.substring(0, 10)}
                                                </td>
                                                {/*<td*/}
                                                {/*    style={{fontSize: "12px"}}*/}
                                                {/*    className={"text-center"}*/}
                                                {/*>*/}
                                                {/*    <div className="btn-group">*/}
                                                {/*        {this.props.currentUser.roles.map(*/}
                                                {/*            (role) =>*/}
                                                {/*                role.roleName ===*/}
                                                {/*                "ROLE_DIRECTOR" && (*/}
                                                {/*                    <Popconfirm onConfirm={(id) =>*/}
                                                {/*                        this.deleteDeliver(item.id)*/}
                                                {/*                    }*/}
                                                {/*                                title="O'chirmoqchimisiz?"*/}
                                                {/*                                okText="Ha"*/}
                                                {/*                                cancelText="Yoq">*/}
                                                {/*                        <button*/}
                                                {/*                            className={*/}
                                                {/*                                "btn btn-sm rounded-0 btn-outline-dark fas fa-trash-alt fa-sm"*/}
                                                {/*                            }*/}
                                                {/*                        ></button>*/}
                                                {/*                    </Popconfirm>*/}

                                                {/*                )*/}
                                                {/*        )}*/}
                                                {/*        <button*/}
                                                {/*            onClick={(id) =>*/}
                                                {/*                this.editDeliverM(true, item.id)*/}
                                                {/*            }*/}
                                                {/*            className={*/}
                                                {/*                "btn btn-sm rounded-0 btn-outline-dark fas fa-edit fa-sm"*/}
                                                {/*            }*/}
                                                {/*        ></button>*/}
                                                {/*        {*/}
                                                {/*            this.state.showWaste &&*/}
                                                {/*            <button*/}
                                                {/*                onClick={(value, waste) =>*/}
                                                {/*                    this.addWasteM(true, item)*/}
                                                {/*                }*/}
                                                {/*                className={*/}
                                                {/*                    "btn btn-sm rounded-0 btn-outline-dark"*/}
                                                {/*                }*/}
                                                {/*            >*/}
                                                {/*                {" "}*/}
                                                {/*                brak*/}
                                                {/*            </button>*/}
                                                {/*        }*/}
                                                {/*    </div>*/}
                                                {/*</td>*/}
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
                        </div>
                    </TabPanel>
                    <TabPanel className={'w-100 my-2'} tabId="tab-three">
                        <div className={"row mb-1"}>
                            <div className={"col-12 text-center"}>
                                <RangePicker
                                    defaultValue={[moment().startOf('month'), moment().endOf('month')]}
                                    ranges={{
                                        'Bu xafta': [moment().startOf('week'), moment().endOf('week')],
                                        'Bu oy': [moment().startOf('month'), moment().endOf('month')],
                                        'Bu yil': [moment().startOf('year'), moment().endOf('year')],
                                    }}
                                    onChange={this.onDateSelectTradeAll}
                                />
                            </div>
                        </div>
                        <table className={"table"}>
                            <thead>
                            <tr>
                                <th className={"text-center"}>№</th>
                                <th className={"text-center"}>mijoz</th>
                                <th className={"text-center"}>chegirma</th>
                                <th className={"text-center"}>qarz</th>
                                <th className={"text-center"}>kassir</th>
                                <th className={"text-center"}>umumiy</th>
                                <th className={"text-center"}>yaratilgan vaqt</th>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                this.state.tradeAll.map(((item, index) =>
                                        <tr onClick={(value, tradeAllId) => this.historyModal(true, item.id)}>
                                            <td className={"text-center"}> {index}</td>
                                            <td className={"text-center"}>{item.client}</td>
                                            <td className={"text-center"}>{item.discount.toLocaleString()} so'm</td>
                                            <td className={"text-center"}>{item.loan.toLocaleString()} so'm</td>
                                            <td className={"text-center"}>{item.salesman}</td>
                                            <td className={"text-center"}>{item.total.toLocaleString()} so'm</td>
                                            <td className={"text-center"}>{item.created.substring(0,10)}</td>
                                        </tr>
                                ))
                            }
                            </tbody>
                        </table>

                        <Pagination
                            itemClass="page-item"
                            linkClass="page-link"
                            itemsCountPerPage={10}
                            activePage={this.state.tradeAllPage + 1}
                            totalItemsCount={this.state.tradeAllTotal}
                            pageRangeDisplayed={5}
                            onChange={this.handleTradeAllPageChange}
                        />
                        <div className={"row"}>

                        </div>
                        <div></div>
                    </TabPanel>
                </Tabs>

                <Modal isOpen={this.state.historyModal} size={'lg'}>
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
                                this.state.historyContent.map((item, index) =>
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
                <Modal isOpen={this.state.loading}>
                    <div className={'text-center m-2'}>LOADING...</div>
                </Modal>
            </div>
        );
    }
}

export default Index;