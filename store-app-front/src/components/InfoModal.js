import React, {Component} from 'react';
import { ModalBody, Modal} from "reactstrap";
import axios from "axios";
import {Authorization, PATH_PREFIX} from "../utils/path_controller";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {library} from '@fortawesome/fontawesome-svg-core';
import {
    faEdit,
    faTrashAlt,
    faUserPlus,
    faUserMinus,
    faInfoCircle,
    faUserEdit,
} from '@fortawesome/free-solid-svg-icons';
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import TablePagination from "@material-ui/core/TablePagination";
import Paper from "@material-ui/core/Paper";


class InfoModal extends Component {
    constructor(props) {
        super(props);
        this.state={
            historyModal:false,
            historyId:'',
            historyContent:[]
        }
    }

    componentDidMount() {
    }

    getAllShoppingHistory= async ()=>{
        let {data} = await axios({
            url:PATH_PREFIX+`/api/trade/history`,
            method:'get',
            headers:{
                Authorization
            },
            params:{
                tradeall:this.state.historyId,
            }
        });
        this.setState({
            historyContent:data.object
        })
    }

    historyModal=async (value, id)=>{
        if(value){
            await this.setState({
                historyId:id
            })
            this.getAllShoppingHistory()
        }
        this.setState({
            historyModal:value
        })
    }

    render() {
        const info = {
            position:"fixed",
            zIndex:100,
            right:0,
            top:0,
            overflowY: "auto",
            height:"100%",
            width:"100%",
            backgroundColor:"rgba(110,110,110,0.4)",
            borderLeft: "1px solid #888",
            display:this.props.visible?"block":"none"
        };
        const infoContent = {
            display:"block",
            float:"right",
            width:"45%",
            minHeight:"100%",
            padding:"20px",
            backgroundColor:"white"
        };
        const blank = {
            display:"block",
            float:"left",
            width:"55%",
            minHeight:"100%",
        };

        const {client, editClient, addPayment, deleteClient, shoppingHistory, manageDebtHistory, debtHistory}=this.props
        const {historyModal, historyContent}=this.state;

        const {shoppingHistorySize, shoppingHistoryPage, shoppingHistoryTotalElements,  manageShoppingHistorySize, manageShoppingHistoryPage}=this.props;
        const {debtHistorySize, debtHistoryPage, debtHistoryTotalElements, manageDebtHistorySize, manageDebtHistoryPage}=this.props;

        return (
            <div>
                <div style={info}>
                    <div style={blank} onClick={(value)=>this.props.manageVisible(false)}>

                    </div>
                    <div style={infoContent}>
                        <div className="visible">
                            {
                                (client!=null)?
                                    <div className="userDetails">
                                        <div className="row">
                                            <div className="col-md-6">
                                                <h5 className={"ml-2"}>{client.name} {client.surname}</h5>
                                                <p className={"ml-2"}>{client.description}</p>
                                                <div className="btn btn-group btn-block">
                                                    <button onClick={(value)=>editClient(true)} className={'btn btn-outline-primary'}>
                                                        <FontAwesomeIcon icon={faUserEdit}/>
                                                    </button>
                                                    <button  className={'btn btn-outline-danger'} onClick={deleteClient}>
                                                        <FontAwesomeIcon icon={faUserMinus}/>
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="col-6 text-center">
                                                <h6 className={"mt-1 mb-2"}>{client.number}</h6>
                                                <button onClick={(value)=>addPayment(true)} className={'btn btn-outline-primary'}>To'lov qo'shish</button>
                                                <div className={'btn mb-2 mt-2 bg-primary form-control'}><b className={'text-light'}>{client.loan.toLocaleString()} so'm</b></div>
                                                <p><i>{client.registered&&client.registered.substr(0 ,10)} da ro'yxatdan o'tgan</i></p>
                                            </div>
                                        </div>
                                    </div>
                                    :'Loading...'
                            }
                            {
                                (shoppingHistory!=null)?
                                    <div className="shoppingHistory my-3">
                                            <h5 style={{color:"green"}}>Harid tarixi</h5>
                                            <Paper >
                                            <TableContainer >
                                                <Table >
                                                    <TableHead>
                                                        <TableRow className={'bg-light'}>
                                                            <TableCell style={{fontSize:12}} className={'font-weight-bold'}>№</TableCell>
                                                            <TableCell style={{fontSize:12}} className={'font-weight-bold'} >Jami</TableCell>
                                                            <TableCell style={{fontSize:12}} className={'font-weight-bold'} >Qarz</TableCell>
                                                            <TableCell style={{fontSize:12}} className={'font-weight-bold'} >Chegirma</TableCell>
                                                            <TableCell style={{fontSize:12}} className={'font-weight-bold'} >Kassir</TableCell>
                                                            <TableCell style={{fontSize:12}} className={'font-weight-bold'} >Sana</TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {shoppingHistory.map((item,index) => (
                                                            <TableRow hover key={item.id} onClick={(value, tradeAllId)=>this.historyModal(true, item.id)}>
                                                                <TableCell style={{fontSize:12}}>{index+1}</TableCell>
                                                                <TableCell style={{fontSize:12}}>{(item.total).toLocaleString()} so'm</TableCell>
                                                                <TableCell style={{fontSize:12}}>{Number(item.loan).toLocaleString()} so'm</TableCell>
                                                                <TableCell style={{fontSize:12}}>{Number(item.discount).toLocaleString()} so'm</TableCell>
                                                                <TableCell style={{fontSize:12}}>{item.salesman}</TableCell>
                                                                <TableCell style={{fontSize:12}}>{item.created.substring(0,10)}</TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            </TableContainer>
                                            <TablePagination
                                                className={'bg-light'}
                                                rowsPerPageOptions={[1, 5, 10, 15, 20, 100]}
                                                component="div"
                                                labelRowsPerPage={'Qatorlar soni'}
                                                count={shoppingHistoryTotalElements}
                                                rowsPerPage={shoppingHistorySize}
                                                page={shoppingHistoryPage}
                                                onChangePage={manageShoppingHistoryPage}
                                                onChangeRowsPerPage={manageShoppingHistorySize}
                                            />
                                        </Paper>
                                        </div>

                                    :'Loading...'
                            }
                            <hr className={"mt-4"}/>
                            <hr className={"mb-3"}/>
                            {
                                (debtHistory!=null)?
                                    <div className="debtHistory my-3">
                                        <h5 style={{color:'red'}}>Qarz tarixi</h5>
                                        <Paper >
                                            <TableContainer >
                                                <Table >
                                                    <TableHead>
                                                        <TableRow className={'bg-light'}>
                                                            <TableCell style={{fontSize:12}} className={'font-weight-bold'}>№</TableCell>
                                                            <TableCell style={{fontSize:12}} className={'font-weight-bold'} >To'lov summasi</TableCell>
                                                            <TableCell style={{fontSize:12}} className={'font-weight-bold'} >Qarz summasi</TableCell>
                                                            <TableCell style={{fontSize:12}} className={'font-weight-bold'} >Qarz farq</TableCell>
                                                            <TableCell style={{fontSize:12}} className={'font-weight-bold'} >Turi</TableCell>
                                                            <TableCell style={{fontSize:12}} className={'font-weight-bold'} >Sana</TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {debtHistory.map((item,index) => (
                                                            <TableRow hover key={item.id}>
                                                                <TableCell style={{fontSize:12}}>{index+1}</TableCell>
                                                                <TableCell style={{fontSize:12}}>{!item.loan?item.amount.toLocaleString():0} so'm</TableCell>
                                                                <TableCell style={{fontSize:12}}>{item.loan?item.amount.toLocaleString():0} so'm</TableCell>
                                                                <TableCell style={{fontSize:12}}>{item.sum.toLocaleString()} so'm</TableCell>
                                                                <TableCell style={{fontSize:12}}>{item.loan?`qarz`:`to'lo'v`}</TableCell>
                                                                <TableCell style={{fontSize:12}}>{item.created.substring(0,10)}</TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            </TableContainer>
                                            <TablePagination
                                                className={'bg-light'}
                                                rowsPerPageOptions={[1, 5, 10, 15, 20, 100]}
                                                component="div"
                                                labelRowsPerPage={'Qatorlar soni'}
                                                count={debtHistoryTotalElements}
                                                rowsPerPage={debtHistorySize}
                                                page={debtHistoryPage}
                                                onChangePage={manageDebtHistoryPage}
                                                onChangeRowsPerPage={manageDebtHistorySize}
                                            />
                                        </Paper>
                                    </div>
                                    :'Loading...'
                            }

                        </div>

                        <div className="not-visible">
                            <Modal isOpen={historyModal} size={'lg'}>
                                <ModalBody>
                                    <div className={'text-right text-danger'} onClick={(value, id)=>this.historyModal(false, null)} ><button className={'btn text-danger'}><span className={'fas fa-times'}></span></button></div>
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
                                            historyContent.map((item, index)=>
                                                <tr>
                                                    <td>{index+1}</td>
                                                    <td>{item.path}</td>
                                                    <td>{item.amount} {item.type}</td>
                                                    <td>{(item.currencyType==='USD'?item.price*item.usd:item.price).toLocaleString()} so'm</td>
                                                    <td>{item.discountPrice.toLocaleString()} so'm</td>
                                                    <td>{(item.amount*((item.currencyType==='USD'?item.price*item.usd:item.price)+-item.discountPrice)).toLocaleString()} so'm</td>
                                                </tr>
                                            )
                                        }
                                        </tbody>
                                    </table>
                                </ModalBody>
                            </Modal>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default InfoModal;