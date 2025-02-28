import React, {Component} from 'react';
import axios from 'axios';
import Expense from '../../components/ExpenseModal'
import {PATH_PREFIX, Authorization} from "../../utils/path_controller";
import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,} from 'recharts';
import {DatePicker} from 'antd';
import moment from 'moment';
import 'antd/dist/antd.css';
import {ModalBody, Modal, ModalFooter, ModalHeader} from 'reactstrap';

const {RangePicker} = DatePicker;

class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            incomeData: null,
            income: null,
            expense: null,
            loan: null,
            data: [],
            stat: [],
            saleHistory: [],
            shoppingHistory: [],

            saleHistoryTotal: null,
            saleHistoryDate: null,
            shoingHistoryId: null,
            start: [moment().startOf('month'), moment().endOf('month')][0],
            end: [moment().startOf('month'), moment().endOf('month')][1],
            table: false,
            expenseVisible: false,

            saleHistoryVisible: false,
            shoppingHistoryVisible: false,

        }
    }

    componentDidMount() {
        this.getIncomeData();
        this.getStat()
    }

    getIncomeData = async () => {
        const {data} = await axios({
            url: PATH_PREFIX + '/api/trade/income',
            headers: {Authorization}
        });
        if (data.success) {
            let incomeData = data.object;

            let income = incomeData.trade - incomeData.discount - incomeData.waste;
            let expense = incomeData.deliver + incomeData.custom_cost + incomeData.fare_cost + incomeData.other_costs + incomeData.cost;
            let loan = incomeData.loan - incomeData.loan_payment;

            this.setState({
                incomeData,
                income,
                expense,
                loan
            })
        }
    };
    getStat = async () => {
        const {data} = await axios({
            url: PATH_PREFIX + '/api/trade/stat',
            headers: {Authorization},
            params: {
                start: this.state.start,
                end: this.state.end
            }
        });

        if (data.success) {
            let object = data.object;
            let stat = [];

            for (let i = 0; i < object.length; i++) {
                let one = {
                    name: object[i].name,
                    income: object[i].income,
                    cash: object[i].cash,
                    card: object[i].card,
                    bank: object[i].bank,
                    dailyMoney: object[i].cash + object[i].card + object[i].bank - object[i].expense - object[i].customCost - object[i].fareCost - object[i].otherCosts - object[i].discount - object[i].waste - object[i].loan + object[i].loanPayment
                }
                stat.push(one)
            }

            this.setState({
                data: data.object,
                stat: data.object
            })
        }
    };

    getSaleHistory = () => {
        axios({
            url: PATH_PREFIX + '/api/tradeAll/saleHistory',
            headers: {Authorization},
            params: {
                date: this.state.saleHistoryDate,
            }
        }).then(res => {
            if (res.data.success) {
                let object = res.data.object;
                let allTotal = 0, discountTotal = 0, loanTotal = 0;
                let saleTotal = {totalSum: null, discount: null, loan: null};
                for (let i = 0; i < object.length; i++) {
                    allTotal += object[i].totalSum;
                    discountTotal = discountTotal + object[i].discountPrice;
                    loanTotal += loanTotal + object[i].loanSum;
                }
                saleTotal.totalSum = allTotal;
                saleTotal.discount = discountTotal;
                saleTotal.loan = loanTotal;

                this.setState({
                    saleHistory: res.data.object,
                    saleHistoryTotal: saleTotal
                })
            }
        })
    };
    getAllShoppingHistory = async () => {
        let {data} = await axios({
            url: PATH_PREFIX + `/api/trade/history`,
            method: 'get',
            headers: {
                Authorization
            },
            params: {
                tradeall: this.state.shoppingHistoryId,
            }
        });
        this.setState({
            shoppingHistory: data.object
        })
    }
    saleHistoryM = async (value, date) => {
        this.setState({
            saleHistoryVisible: value
        })
        if (value) {
            await this.setState({
                saleHistoryDate: date
            });
            this.getSaleHistory();
        }
    }
    shoppingHistoryM = async (value, id) => {
        this.setState({
            shoppingHistoryVisible: value
        });

        if (value) {
            await this.setState({
                shoppingHistoryId:id
            })
            this.getAllShoppingHistory();
        }
    };

    makePretty = (number) => {
        return number.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
    };
    expenseVisible = (value) => {
        this.getIncomeData();
        this.getStat();
        this.setState({
            expenseVisible: value
        })
    };
    onDateSelect = async (dates, dateStrings) => {
        if (dates != null) {
            await this.setState({
                start: dates[0],
                end: dates[1]
            });
            this.getStat()
        }
    };
    table = (value) => {
        this.setState({
            table: value
        })
    };


    render() {
        const {saleHistoryTotal, saleHistory, shoppingHistory, saleHistoryVisible, shoppingHistoryVisible, incomeData, income, expense, loan, data, table, expenseVisible} = this.state;
        return (
            <div className={'container-fluid'}>
                <div className={'my-3'}>
                    <div className={'text-right'}>
                        <button onClick={value => this.expenseVisible(true)} className={'btn btn-success '}>Xarajatlar
                        </button>
                    </div>

                    <Expense visible={expenseVisible} manageVisible={value => this.expenseVisible(value)}/>

                    <div className="bg-light rounded my-4">
                        {
                            incomeData ?
                                <div>
                                    <div style={{width: '100%'}}>
                                        {/*<div className="row">*/}
                                        {/*    <div className="col-12 text-center">*/}
                                        {/*        <h3>{incomeData.real_income.toLocaleString()} so'm</h3>*/}
                                        {/*        <p>Sof foyda</p>*/}
                                        {/*    </div>*/}
                                        {/*</div>*/}
                                    </div>
                                    <div style={{width: '100%'}} className='d-flex'>
                                        <div style={{margin: '1%', width: '34.5%', height: 170}}
                                             className='bg-secondary rounded'>
                                            <div className="text-center mt-3">
                                                <h4 className={'text-light'}>{this.makePretty(Math.round(expense))} so'm</h4>
                                                <p className={'text-light'}>Xarajat</p>
                                                <div className={'mx-4'}>
                                                    <div className="row">
                                                        {/*<div className="col-6 text-light">*/}
                                                        {/*    <p style={{lineHeight: '1px'}}>{this.makePretty(Math.round(incomeData.deliver))}</p>*/}
                                                        {/*    <p style={{fontSize: '10px'}}>Tan narx</p>*/}
                                                        {/*</div>*/}
                                                        {/*<div className="col-3 text-light">*/}
                                                        {/*    <p style={{lineHeight: '1px'}}>{this.makePretty(Math.round(incomeData.custom_cost))}</p>*/}
                                                        {/*    <p style={{fontSize: '10px'}}>Bojxona</p>*/}
                                                        {/*</div>*/}
                                                        {/*<div className="col-3 text-light">*/}
                                                        {/*    <p style={{lineHeight: '1px'}}>{this.makePretty(Math.round(incomeData.fare_cost))}</p>*/}
                                                        {/*    <p style={{fontSize: '10px'}}>Yo'lkira</p>*/}
                                                        {/*</div>*/}
                                                        <div className="col-12 text-light">
                                                            <p style={{lineHeight: '1px'}}>{this.makePretty(Math.round(incomeData.cost))}</p>
                                                            <p style={{fontSize: '10px'}}>Qo'shimcha xarajatlar</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div style={{margin: '1%', width: '25%', height: 170}}
                                             className='bg-secondary rounded'>
                                            <div className="text-center mt-3">
                                                <h4 className={'text-light'}>{this.makePretty(Math.round(loan))} so'm</h4>
                                                <p className={'text-light'}>Qarz</p>
                                                <div className={'mx-4'}>
                                                    <div className="row">
                                                        <div className="col-6 text-light">
                                                            <p style={{lineHeight: '1px'}}>{this.makePretty(Math.round(incomeData.loan))}</p>
                                                            <p style={{fontSize: '10px'}}>Qarz</p>
                                                        </div>
                                                        <div className="col-6 text-light">
                                                            <p style={{lineHeight: '1px'}}>{this.makePretty(Math.round(incomeData.loan_payment))}</p>
                                                            <p style={{fontSize: '10px'}}>To'langan qarz</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div style={{margin: '1%', width: '34.5%', height: 170}}
                                             className='bg-secondary rounded'>
                                            <div className="text-center mt-3">
                                                <h4 className={'text-light'}>{(this.makePretty(Math.round(income)))} so'm</h4>
                                                <p className={'text-light'}>Tushum</p>
                                                <div className={'mx-4'}>
                                                    <div className="row">
                                                        <div className="col-4 text-light">
                                                            <p style={{lineHeight: '1px'}}>{this.makePretty(Math.round(incomeData.trade))}</p>
                                                            <p style={{fontSize: '10px'}}>Tushum</p>
                                                        </div>
                                                        <div className="col-4 text-light">
                                                            <p style={{lineHeight: '1px'}}>{this.makePretty(Math.round(incomeData.discount))}</p>
                                                            <p style={{fontSize: '10px'}}>Chegirma</p>
                                                        </div>
                                                        <div className="col-4 text-light">
                                                            <p style={{lineHeight: '1px'}}>{this.makePretty(Math.round(incomeData.waste))}</p>
                                                            <p style={{fontSize: '10px'}}>Brak</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                :
                                <div className={'text-center p-5'}>
                                    loading...
                                </div>
                        }
                    </div>

                    <div style={{width: '100%'}} className={'text-center'}>
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

                    {
                        table ?
                            <div>
                                <div style={{width: '100%'}} className={'text-center'}>
                                    <a onClick={(value) => this.table(false)} className={'text-primary'}>Jadvalni
                                        yopish</a>
                                </div>
                                <table className={'table table-striped table-hover'}>
                                    <thead>
                                    <tr>
                                        <th className={'text-center'}>№</th>
                                        <th className={'text-center'}>Sana</th>
                                        <th className={'text-center'}>Tushum</th>
                                        <th className={'text-center'}>Naqd</th>
                                        <th className={'text-center'}>Plastik</th>
                                        <th className={'text-center'}>Bank</th>
                                        {/*<th className={'text-center'}>Foyda</th>*/}
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {
                                        data.map((item, index) =>
                                            <tr key={index}
                                                onClick={(value, date) => this.saleHistoryM(true, item.name)}>
                                                <td className={'text-center'}>{index + 1}</td>
                                                <td className={'text-center'}>{item.name}</td>
                                                <td className={'text-center'}>{item.income.toLocaleString()} {item.loans != 0 &&
                                                <span
                                                    className={item.loans > 0 ? 'text-danger' : 'text-success'}> - {item.loans.toLocaleString()}</span>} so'm
                                                </td>
                                                <td className={'text-center'}>{item.cash.toLocaleString()} so'm</td>
                                                <td className={'text-center'}>{item.card.toLocaleString()} so'm</td>
                                                <td className={'text-center'}>{item.bank.toLocaleString()} so'm</td>
                                            </tr>
                                        )
                                    }
                                    </tbody>
                                </table>
                            </div>
                            :
                            <div>
                                <div style={{width: '100%'}} className={'text-center'}>
                                    <a onClick={(value) => this.table(true)} className={'text-primary'}>Jadvalni
                                        ko'rsatish</a>
                                </div>
                                <LineChart className={'float-right'} width={1250} height={300} data={data}>
                                    <CartesianGrid strokeDasharray='4 4'/>
                                    <XAxis dataKey="name"/>
                                    <YAxis/>
                                    <Tooltip/>
                                    <Legend/>
                                    <Line type="monotone" dataKey="income" stroke="green"/>
                                </LineChart>
                            </div>
                    }

                </div>
                <div className="modals">
                    <Modal isOpen={saleHistoryVisible} size={'xl'}>
                        <ModalBody>
                            <div>
                                <button onClick={(value, date) => this.saleHistoryM(false, null)}
                                        className={'btn float-right text-danger'}><span
                                    className={'fas fa-times'}></span></button>
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
                                        <tr key={item.id} onClick={(value, tradeAllId) => this.shoppingHistoryM(true, item.id)}>
                                            <td style={{fontSize: "14px"}}
                                                className={"text-center"}>{index + 1}</td>
                                            <td style={{fontSize: "14px"}}
                                                className={"text-center"}>{item.client}</td>
                                            <td style={{fontSize: "14px"}}
                                                className={"text-center"}>{(Number(item.totalSum)).toLocaleString()} so'm
                                            </td>
                                            <td style={{fontSize: "14px"}}
                                                className={"text-center"}>{Number(item.discountPrice).toLocaleString()} so'm
                                            </td>
                                            <td style={{fontSize: "14px"}}
                                                className={"text-center"}>{(item.totalSum - item.discountPrice).toLocaleString()} so'm
                                            </td>
                                            <td style={{fontSize: "14px"}}
                                                className={"text-center"}>{(item.totalSum - item.discountPrice - item.loanSum).toLocaleString()} so'm
                                            </td>
                                            <td style={{fontSize: "14px"}}
                                                className={"text-center"}>{item.loanSum.toLocaleString()} so'm
                                            </td>
                                            <td style={{fontSize: "14px"}}
                                                className={"text-center"}>{item.createdAt}</td>
                                            <td style={{fontSize: "14px"}}
                                                className={"text-center"}>{item.updatedAt}</td>
                                        </tr>
                                    )
                                }
                                {
                                    saleHistoryTotal &&
                                    <tr className={'bg-light'}>
                                        <td  style={{fontSize: "14px"}} className={'text-center'} ><b>Total</b></td>
                                        <td  style={{fontSize: "14px"}} className={'text-center'} ></td>
                                        <td  style={{fontSize: "14px"}} className={'text-center'} ><b>{saleHistoryTotal.totalSum.toLocaleString()} so'm</b></td>
                                        <td  style={{fontSize: "14px"}} className={'text-center'} ><b>{saleHistoryTotal.discount.toLocaleString()} so'm</b></td>
                                        <td  style={{fontSize: "14px"}} className={'text-center'} ><b>{(saleHistoryTotal.totalSum - saleHistoryTotal.discount).toLocaleString()} so'm</b></td>
                                        <td  style={{fontSize: "14px"}} className={'text-center'} ><b>{(saleHistoryTotal.totalSum - saleHistoryTotal.discount - saleHistoryTotal.loan).toLocaleString()} so'm</b></td>
                                        <td  style={{fontSize: "14px"}} className={'text-center'} ><b>{(saleHistoryTotal.loan).toLocaleString()} so'm</b></td>
                                        <td  style={{fontSize: "14px"}} className={'text-center'} ></td>
                                        <td  style={{fontSize: "14px"}} className={'text-center'} ></td>
                                    </tr>
                                }
                                </tbody>
                            </table>
                        </ModalBody>
                    </Modal>
                    <Modal isOpen={shoppingHistoryVisible} size={'lg'}>
                        <ModalBody>
                            <div className={'text-right text-danger'}
                                 onClick={(value, id) => this.shoppingHistoryM(false, null)}>
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
                                    shoppingHistory.map((item, index) =>
                                        <tr>
                                            <td>{index + 1}</td>
                                            <td>{item.path}</td>
                                            <td>{item.amount} {item.type}</td>
                                            <td>{(item.currencyType === 'USD' ? item.price * item.usd : item.price).toLocaleString()} so'm</td>
                                            <td>{item.discountPrice.toLocaleString()} so'm</td>
                                            <td>{(item.amount * ((item.currencyType === 'USD' ? item.price * item.usd : item.price) + -item.discountPrice)).toLocaleString()} so'm</td>
                                        </tr>
                                    )
                                }
                                </tbody>
                            </table>
                        </ModalBody>
                    </Modal>
                </div>
            </div>
        );
    }
}

export default Index;