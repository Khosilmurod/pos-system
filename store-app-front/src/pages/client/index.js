import React, {Component} from 'react';
import "react-bootstrap";
import {PATH_PREFIX, Authorization} from "../../utils/path_controller";
import axios from 'axios';
import {Modal, ModalFooter, ModalHeader, ModalBody} from 'reactstrap'
import InfoModal from "../../components/InfoModal";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faEdit, faTrashAlt, faUserPlus, faUserMinus, faInfoCircle,} from '@fortawesome/free-solid-svg-icons';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import InputMask from 'react-input-mask';
import {toast, ToastContainer} from "react-toastify";

class Index extends Component {

    constructor(props) {
        super(props);
        this.state= {
            clients:[],
            shoppingHistory:[],
            debtHistory:[],
            //clients
            activePage:1,
            isDebt:false,
            search:'',
            totalElements:0,
            size: 5,
            page: 1,
            sortBy:"loan",
            //shopping history
            shoppingHistoryTotalElements:0,
            shoppingHistoryPage:0,
            shoppingHistorySize:5,

            debtHistoryTotalElements:0,
            debtHistoryPage:0,
            debtHistorySize:5,
            //debt history

            currentClient:null,


            addModal:false,
            infoModal:false,
            editModal:false,
            addPaymentModal:false,


        }
    }

    myTrim=(x)=> {
        return x.split(/[ ]+/).join('');
    };
    componentDidMount() {
        this.getAllClients()
    }
    //get functions
    getAllClients=()=>{
        axios({
            url:PATH_PREFIX+`/api/client`,
            method:'get',
            params:{
                search:this.state.search,
                debt:this.state.isDebt,
                sort:this.state.sortBy,
                page:this.state.page,
                size:this.state.size
            },
            headers: {
                Authorization
            }
        }).then(res=>{
            if(res.data.success){
                this.setState({
                    totalElements:res.data.object.totalElements,
                    clients:res.data.object.content
                })
            }
        })
    };

    getAllShoppingHistory= async ()=>{
        let {data} = await axios({
            url:PATH_PREFIX+`/api/tradeAll/history`,
            method:'get',
            headers:{
                Authorization
            },
            params:{
                client:this.state.currentClient.id,
                page:this.state.shoppingHistoryPage,
                size:this.state.shoppingHistorySize
            }
        });
        this.setState({
            shoppingHistory:data.object.content,
            shoppingHistoryTotalElements:data.object.totalElements
        })
    };

    getAllDebtHistory=async ()=>{
        let {data} = await axios({
            url:PATH_PREFIX+`/api/loanPayment/debt`,
            method:'get',
            headers:{
                Authorization
            },
            params:{
                client:this.state.currentClient.id,
                page:this.state.debtHistoryPage,
                size:this.state.debtHistorySize
            }
        });
        this.setState({
            debtHistory:data.object.content,
            debtHistoryTotalElements:data.object.totalElements,

        })
    };
    //functions
    addClient= async (event)=>{
        event.preventDefault();
        await axios({
            url:PATH_PREFIX+'/api/client',
            method:'post',
            headers:{
                Authorization
            },
            data:{
                name:event.target[0].value,
                surname:event.target[1].value,
                number:this.myTrim(event.target[2].value),
                description:event.target[3].value
            }
        }).then(res=>{
            if(res.data.success){
                this.notifySuccess("Mijoz qo'shildi");
                this.getAllClients();
                this.addModal(false);
            }else{
                this.notifyError("Tizimda xatolik yuz berdi")
            }
        })
    };

    editClient=async (event)=>{
        event.preventDefault();
        await axios({
            url:PATH_PREFIX+`/api/client/${this.state.currentClient.id}`,
            method:'put',
            headers:{
                Authorization
            },
            data:{
                name:event.target[0].value,
                surname:event.target[1].value,
                number:this.myTrim(event.target[2].value),
                description:event.target[3].value
            }
        });
        this.getAllClients();
        this.editModal(false);
        this.infoModal(false);
    };

    deleteClient=async ()=>{
        const {data}=await axios({
            url:PATH_PREFIX+`/api/client/${this.state.currentClient.id}`,
            method:'delete',
            headers:{
                Authorization
            },
        });
        this.getAllClients();
        if(data.message==='success'){
            this.notifySuccess("Mijoz o'chirildi");
            this.infoModal(false)
        }
        if(data.message==='failed'){
            this.notifyWarn("Bu mijozni o'chiirb bo'lmaydi");
        }
    };

    addPayment=async (event)=>{
        event.preventDefault();
        await axios({
            url:PATH_PREFIX+`/api/loanPayment`,
            method:'post',
            headers:{
                Authorization
            },
            data:{
                amount:event.target[0].value,
                type:event.target[1].value,
                client:this.state.currentClient.id,
            }
        });
        this.getAllClients();
        this.addPaymentModal(false);
        this.infoModal(false);
    };
    //choose (by changing state) functions
    chooseClient=async (client)=>{
        await this.setState({
            currentClient:client
        });
        this.infoModal(true)
    };

    chooseShoppingHistoryPage=async (event, page)=>{
        await this.setState({
            shoppingHistoryPage:page
        });
        this.getAllShoppingHistory()
    };
    chooseShoppingHistorySize=async (event)=>{
        await this.setState({
            shoppingHistorySize:event.target.value
        });
        this.getAllShoppingHistory()
    };


    chooseDebtHistoryPage=async (event, page)=>{
        await this.setState({
            debtHistoryPage:page
        });
        this.getAllDebtHistory()
    };
    chooseDebtHistorySize=async (event)=>{
        await this.setState({
            debtHistorySize:event.target.value
        });
        this.getAllDebtHistory()
    };

    search=async (event)=>{
        await this.setState({
            search:event.target.value
        });
        this.getAllClients()
    };

    isDebt=async ()=>{
        await this.setState(prevState=>({
            isDebt:!prevState.isDebt
        }));
        this.getAllClients()
    };

    sortBy=async (event)=>{
        let value=event.target.value;
        await this.setState({
            sortBy:value
        });
        this.getAllClients()
    };

    addModal=(value)=>{
        this.setState({
            addModal:value
        })
    };

    editModal=(value)=>{
        this.setState({
            editModal:value
        })
    };

    addPaymentModal=(value)=>{
        this.setState({
            addPaymentModal:value
        })
    };

    infoModal=async (value)=>{
        if(value){
            this.getAllShoppingHistory();
            this.getAllDebtHistory()
        }
        await this.setState({
            infoModal:value
        })
    };

    handleThisPageChange = async (event, page) => {
        // const {page, totalElements} = this.state;
        await this.setState({
            page: page+1
        })
        this.getAllClients()
    };

    handleChangeRowsPerPage = async (event) => {
        const {page} = this.state
       await this.setState({
            size:(+event.target.value),
            page:page
        })
        this.getAllClients()
    };
    downloadExcel=async (id)=>{
        axios({
            url:PATH_PREFIX+'/api/download/sale.xlsx',
            headers: {
                Authorization
            },
            params:{
                clientId:id
            },
            responseType: 'blob',
        }).then(({ data }) => {
            const downloadUrl = window.URL.createObjectURL(new Blob([data]));
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.setAttribute('download', "Sotuv_Tarixi.xlsx"); //any other extension
            document.body.appendChild(link);
            link.click();
            link.remove();
        });
        axios({
            url:PATH_PREFIX+'/api/download/loan.xlsx',
            headers: {
                Authorization
            },
            params:{
                clientId:id
            },
            responseType: 'blob',
        }).then(({ data }) => {
            const downloadUrl = window.URL.createObjectURL(new Blob([data]));
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.setAttribute('download', "Qarz_Tarixi.xlsx"); //any other extension
            document.body.appendChild(link);
            link.click();
            link.remove();
        });
    };


    notifySuccess = (text) => toast.success(text);
    notifyError = (text) => toast.error(text);
    notifyWarn = (text) => toast.warn(text);


    render() {
        const {clients, activePage,debtHistory, size, page, totalElements, addModal, infoModal, currentClient, editModal, addPaymentModal, shoppingHistory}=this.state;
        return (
            <div className='container-fluid my-4'>

                <div className="visible">
                    <div className="form-group">
                        <div className="row">
                            <div className="col-md-6 d-flex">
                                <input className={"mr-3 form-control"} style={{width:'300px'}} onChange={this.search} placeholder={'Qidirish'} type="text"/>
                                <select  onChange={this.sortBy} className={"mr-3 form-control"} style={{width:'100px'}}>
                                    <option value="loan">Qarz</option>
                                    <option value="name">Ism</option>
                                    <option value="surname">Familiya</option>
                                    <option value="phoneNumber">Nomer</option>
                                </select>
                                <div className="form-check pt-2" style={{alignContent:'center'}}>
                                    <input className="form-check-input" type="checkbox" onChange={this.isDebt} id="defaultCheck1"/>
                                    <label className="form-check-label" htmlFor="defaultCheck1">
                                        Qarzdorlik
                                    </label>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <button onClick={value=>this.addModal(true)} className='btn btn-outline-success float-right'>
                                    <FontAwesomeIcon icon={faUserPlus}/>
                                </button>
                            </div>
                        </div>
                    </div>
                    <Paper >
                        <TableContainer >
                            <Table >
                                <TableHead>
                                        <TableRow className={'bg-light'}>
                                            <TableCell>№</TableCell>
                                            <TableCell >Ism/Familiya</TableCell>
                                            <TableCell >Telefon</TableCell>
                                            <TableCell >Hisob</TableCell>
                                            <TableCell >Ammallar</TableCell>
                                        </TableRow>
                                </TableHead>
                                <TableBody>
                                    {clients.map((client,index) => (
                                        <TableRow hover key={client.id}>
                                            <TableCell  onClick={id=>this.chooseClient(client)} style={{width:'50px'}}>{index+1}</TableCell>
                                            <TableCell  onClick={id=>this.chooseClient(client)}>{client.surname} {client.name}</TableCell>
                                            <TableCell onClick={id=>this.chooseClient(client)}>{client.number}</TableCell>
                                            <TableCell  onClick={id=>this.chooseClient(client)}>{client.loan.toLocaleString()} so'm</TableCell>
                                            <TableCell>
                                                <button onClick={(id)=>this.downloadExcel(client.id)} className={'btn btn-white'}><span className={'fas fa-download text-dark'}></span></button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <TablePagination

                            labelRowsPerPage={'Qatorlar soni'}
                            rowsPerPageOptions={[5, 10, 15, 20]}
                            component="div"
                            count={totalElements}
                            rowsPerPage={size}
                            page={page-1}
                            onChangePage={this.handleThisPageChange}
                            onChangeRowsPerPage={this.handleChangeRowsPerPage}
                        />
                    </Paper>
                </div>
                <div className="notVisible">
                    <Modal isOpen={addModal}>
                        <ModalHeader>
                            Client qo'shish
                        </ModalHeader>
                        <ModalBody>
                            <form id='addClient' onSubmit={(event)=>this.addClient(event)} className={'form-group mx-2'}>
                                <input placeholder={'ism'} type="text" className='form-control my-2'/>
                                <input placeholder={'familiya'} type="text" className='form-control my-2'/>
                                <InputMask placeholder={'telefon raqam'} className={'form-control my-2'} mask="+\9\9\8 99 999 99 99" maskChar=" " />
                                <textarea placeholder={'izoh'} className='form-control my-2'/>
                            </form>
                        </ModalBody>
                        <ModalFooter>
                            <button onClick={value=>this.addModal(false)} className={'btn btn-outline-danger'}>bekor qilish</button>
                            <button form='addClient' className={'btn btn-outline-success'}>qo'shish</button>
                        </ModalFooter>
                    </Modal>
                    <Modal isOpen={editModal}>
                        <ModalHeader>
                            Mijozni tahrirlash
                        </ModalHeader>
                        <ModalBody>
                            {
                                currentClient!=null?
                                    <form id='editClient' onSubmit={this.editClient} className={'mx-2'}>
                                        <input defaultValue={currentClient.name} placeholder={'name'} type="text" className='form-control my-2'/>
                                        <input defaultValue={currentClient.surname} placeholder={'last name'} type="text" className='form-control my-2'/>
                                        <InputMask defaultValue={currentClient.number} placeholder={'telefon raqam'} className={'form-control my-2'} mask="+\9\9\8 99 999 99 99" maskChar=" " />
                                        <textarea defaultValue={currentClient.description} placeholder={'description'} className='form-control my-2'/>
                                    </form>
                                    :"Tizimda nimadir xatolik yuz berdi!?"
                            }
                        </ModalBody>
                        <ModalFooter>
                            <button onClick={value=>this.editModal(false)} className={'btn btn-outline-danger'}>bekor qilish</button>
                            <button form='editClient' className={'btn btn-outline-info'}>tahrirlash</button>
                        </ModalFooter>
                    </Modal>
                    <Modal isOpen={addPaymentModal}>
                        <ModalHeader>
                            To'lov qilish
                        </ModalHeader>
                        <ModalBody>
                            <form id='addPayment' onSubmit={this.addPayment} className={'mx-2'}>
                                <input placeholder={'amount'} type={"number"} className='form-control my-2'/>
                                <select className={'form-control'}>
                                    <option value="CASH">naqd</option>
                                    <option value="CARD">card</option>
                                    <option value="BANK">bank</option>
                                </select>
                            </form>
                        </ModalBody>
                        <ModalFooter>
                            <button onClick={value=>this.addPaymentModal(false)} className={'btn btn-outline-danger'}>bekor qilish</button>
                            <button form='addPayment' className={'btn btn-outline-info'}>qo'shish</button>
                        </ModalFooter>
                    </Modal>

                    <InfoModal
                        client={currentClient}
                        shoppingHistory={shoppingHistory}
                        debtHistory={debtHistory}
                        deleteClient={this.deleteClient}
                        editClient={(value=>this.editModal(value))}
                        addPayment={(value)=>this.addPaymentModal(value)}
                        visible={infoModal}

                        manageDebtHistoryPage={this.chooseDebtHistoryPage}
                        debtHistorySize={this.state.debtHistorySize}
                        debtHistoryPage={this.state.debtHistoryPage}
                        debtHistoryTotalElements={this.state.debtHistoryTotalElements}
                        manageDebtHistorySize={this.chooseDebtHistorySize}

                        manageShoppingHistoryPage={this.chooseShoppingHistoryPage}
                        shoppingHistorySize={this.state.shoppingHistorySize}
                        shoppingHistoryPage={this.state.shoppingHistoryPage}
                        shoppingHistoryTotalElements={this.state.shoppingHistoryTotalElements}
                        manageShoppingHistorySize={this.chooseShoppingHistorySize}

                        manageVisible={(value)=>this.infoModal(value)}/>
                </div>

                <div>
                    <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false}
                                    newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable
                                    pauseOnHover/>
                </div>
            </div>
        );
    }
}

export default Index;