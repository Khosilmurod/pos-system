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
        this.state=({
            size:5,
            page:0,
            totalElements:0,
            data:[],
            editExpense:null
        })
    }

    componentDidMount(){
        this.getAllExpenses()
    }

    getAllExpenses=async ()=>{
        const {data}=await axios({
            url:PATH_PREFIX+'/api/expense',
            method:'get',
            params:{
                size:this.state.size,
                page:this.state.page
            }
        })
        console.log(data);
        this.setState({
            totalElements:data.object.totalElements,
            data:data.object.content
        })
    };
    editExpenseOpen=async (id)=>{
        let filtered = this.state.data.filter(item=>item.id=id);
        if(filtered.length==0){
            alert("Tizimda nimadir xatolik yuz berdi")
        }else {
            await this.setState({
                editExpense:filtered[0]
            })
        }
    };
    deleteExpense=(id)=>{
        axios({
            url:PATH_PREFIX+'/api/expense/'+id,
            method:'delete',
        }).then(res=>{
            if(res.data.success){
                this.getAllExpenses();
            }
        })
    };
    addExpense=(event)=>{
        event.preventDefault();

        axios({
            url:PATH_PREFIX+'/api/expense',
            method:'post',
            data:{
                sum:event.target[0].value,
                description:event.target[1].value
            }
        }).then(res=>{
            if(res.data.success){
                this.getAllExpenses();
            }
        })
    };
    editExpense=(event)=>{
        event.preventDefault();

        axios({
            url:PATH_PREFIX+'/api/expense/'+this.state.editExpense.id,
            method:'put',
            data:{
                sum:event.target[0].value,
                description:event.target[1].value
            }
        }).then(res=>{
            if(res.data.success){
                this.getAllExpenses();
                this.setState({
                    editExpense:null
                })
            }

        })
    };

    closeExpense=()=>{
        this.setState({
            editExpense:null
        })
    };
    handleSize=async (event)=>{
        await this.setState({
            size:event.target.value
        })
        this.getAllExpenses();
    };
    handlePage=async (event, page)=>{
        await this.setState({
            page:page
        })
        this.getAllExpenses();
    };

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


        const {data, size, page, totalElements, editExpense}=this.state
        return (
            <div>
                <div style={info}>
                    <div style={blank} onClick={(value)=>this.props.manageVisible(false)}>

                    </div>
                    <div style={infoContent}>
                        <h4 className={'text-center my-3'}>Qo'shimcha Xarajatlar</h4>
                        {
                            editExpense==null?
                                <div>
                                    <p className={'text-center font-weight-bold'}>Xarajat qo'shish</p>
                                    <form className={'px-5'} onSubmit={this.addExpense}>
                                        <input required placeholder={'Narxi'} className={'form-control m-2'} step={0.001} type="number"/>
                                        <input required placeholder={'Sababi'} className={'form-control m-2'} type="text"/>
                                        <button className={'btn m-2 btn-outline-success btn-block'}>Xarajat Qo'shish</button>
                                    </form>
                                </div>
                                :
                                <div>
                                    <p className={'text-center font-weight-bold'}>
                                        Xarajatni tahrirlash
                                        <button onClick={this.closeExpense} className={'btn float-right text-danger'}><span className={'fas fa-times fa-sm'}></span></button>
                                    </p>
                                    <form className={'px-5'} onSubmit={this.editExpense}>

                                        <input required defaultValue={editExpense.sum} placeholder={'Narxi'} className={'form-control m-2'} step={0.001} type="number"/>
                                        <input required defaultValue={editExpense.description} placeholder={'Sababi'} className={'form-control m-2'} type="text"/>
                                        <button className={'btn m-2 btn-outline-primary btn-block'}>Tahrirlash</button>
                                    </form>
                                </div>
                        }

                        <TableContainer >
                            <Table >
                                <TableHead>
                                    <TableRow className={'bg-light'}>
                                        <TableCell style={{fontSize:12}} className={'font-weight-bold'}>№</TableCell>
                                        <TableCell style={{fontSize:12}} className={'font-weight-bold'} >Narxi</TableCell>
                                        <TableCell style={{fontSize:12}} className={'font-weight-bold'} >Sababi</TableCell>
                                        <TableCell style={{fontSize:12}} className={'font-weight-bold'} >Kim tomonidan</TableCell>
                                        <TableCell style={{fontSize:12}} className={'font-weight-bold'} >Sana</TableCell>
                                        <TableCell style={{fontSize:12}} className={'font-weight-bold'} >Amallar</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {data.map((item,index) => (
                                        <TableRow hover key={item.id}>
                                            <TableCell style={{fontSize:12}}>{index+1}</TableCell>
                                            <TableCell style={{fontSize:12}}>{item.sum.toLocaleString()} so'm</TableCell>
                                            <TableCell style={{fontSize:12}}>{item.description}</TableCell>

                                            <TableCell style={{fontSize:12}}>{item.createdBy&&item.createdBy.firstName} {item.createdBy&&item.createdBy.lastName}</TableCell>
                                            <TableCell style={{fontSize:12}}>{item.createdAt.substring(0,10)}</TableCell>
                                            <TableCell style={{fontSize:12}}>
                                                <button onClick={value=>this.editExpenseOpen(item.id)} className={'btn btn-sm btn-outline-primary'}><span className={'fas fa-sm fa-edit'}></span></button>
                                                <button onClick={value=>this.deleteExpense(item.id)} className={'btn btn-sm btn-outline-danger'}><span className={'fas fa-sm fa-trash'}></span></button>
                                            </TableCell>
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
                            count={totalElements}
                            rowsPerPage={size}
                            page={page}
                            onChangePage={this.handlePage}
                            onChangeRowsPerPage={this.handleSize}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

export default InfoModal;