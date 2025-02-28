import React, {Component} from "react";
import {Select} from 'antd';
import {Modal, ModalHeader, ModalFooter, ModalBody, Button, Label} from "reactstrap";
import divWithClassName from "react-bootstrap/cjs/divWithClassName";

const Option = Select.Option;

class PaymentModal extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {paymentModalVisible,
            closePaymentModal,
            savePayment,
            openClientModal,
            clients,
            paymentSum,
            changeInput,
            handleCash,
            handleCard,
            handleDiscount,
            handleBank,
            bank,
            cash,
            card,
            change,
            debt,
            discount,
            payment,
            onSelectInput,
            onSearch,
            totalDiscountSum,
            currentClient,
            lastSaveClient}=this.props;
        return (
            <div>
                <Modal isOpen={paymentModalVisible}>
                    <ModalHeader toggle={closePaymentModal}>
                        <div>Jami: {paymentSum.toLocaleString()}
                            <div>Chegirmalar: {(discount + totalDiscountSum).toLocaleString()}<br/></div></div>
                        <div>To'lov: <span style={{color: "green"}}>{payment > 0 ? payment.toLocaleString() : paymentSum.toLocaleString()}</span></div>
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
                                                onClick={openClientModal}>Mijoz qo'shish
                                        </button>
                                    </div>
                                </div>
                                <div className={"row"}>
                                    <div className="col-md-4 mt-1">
                                        {
                                            cash > 0 && cash >= paymentSum ?
                                                <div>
                                                    <label htmlFor={"cash"}>Naqd:</label>
                                                    <input type="number" className={"form-control"} id={"cash"}
                                                           name={"cash"}
                                                           defaultValue={cash} onChange={handleCash}/>
                                                </div> :
                                                ""
                                        }
                                        {payment > 0 && payment < paymentSum || bank > 0 || card > 0 ?
                                            <div>
                                                <label htmlFor={"card"}>Plastik:</label>
                                                <input type="number" className={"form-control"} id={"card"}
                                                       name={"card"}
                                                       defaultValue={card} onChange={handleCard}/>
                                                <label htmlFor={"bank"}>Bank:</label>
                                                <input type="number" className={"form-control"} id={"bank"}
                                                       name={"bank"}
                                                       defaultValue={bank} onChange={handleBank}/>
                                            </div> : ''
                                        }
                                        {
                                            paymentSum>=payment?
                                                <div>
                                                    <label htmlFor={"discount"}>Chegirma:</label>
                                                    <input type="number" className={"form-control"} id={"discount"}
                                                           name={"discount"}
                                                           defaultValue={discount} onChange={handleDiscount}/>
                                                </div>:''
                                        }
                                    </div>
                                    <div className="col-md-8 mt-1">
                                        <label htmlFor={"client"}>Mijoz:</label>
                                        <Select
                                            allowClear={true}
                                            showSearch
                                            style={{width: '100%'}}
                                            placeholder="Mijozni tanlang"
                                            optionFilterProp="children"
                                            onChange={onSelectInput}
                                            value={currentClient}
                                            onSearch={onSearch}
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
                        <button className={"btn btn-danger"} onClick={closePaymentModal}>Bekor qilish</button>
                        {
                            !   (debt>0||discount>0)||currentClient ?
                                <button className={"btn btn-success"} type={"button"} form={"my-form"} onClick={savePayment}>Tasdiqlash</button>
                                :
                                <button className={"btn btn-success"} disabled={true} type={"submit"} form={"my-form"}
                                >Tasdiqlash</button>

                        }
                    </ModalFooter>
                </Modal>
            </div>
        );
    }
}

export default PaymentModal;