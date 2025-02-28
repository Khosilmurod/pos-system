import React, {Component} from 'react';
import axios from "axios";
import {Authorization, PATH_PREFIX} from "./utils/path_controller";
import history from "./history";
import Login from "./pages/login/index";
import Sale from "./pages/sale/index";

import Warehouse from "./pages/warehouse/index";
import Report from "./pages/report/index";
import Income from "./pages/income/index";
import Client from "./pages/client/index";
import Dashboard from './pages/dashboard/index'
import Unauthorized from "antd/lib/result/unauthorized";
import {BrowserRouter as Router, Link, Route, Switch, Redirect} from "react-router-dom";
import './components/fontawesomescss/css/all.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import {Popconfirm} from "antd";
import {toast, ToastContainer} from "react-toastify";

class App extends Component {

    constructor(props) {
        super(props);

        this.state = {
            currentUser: "",
            redirect: true,
            scroll: false,
            currentPage: localStorage.getItem("currentPage"),
        }
    }

    async componentDidMount() {
        axios({
            url: PATH_PREFIX + "/api/user/me",
            method: "get",
            headers: {
                'Authorization': localStorage.getItem('token')
            }
        }).then(response => {
            if (!response.data.success) {
                this.setState({
                    redirect: true
                });
            } else {
                if (localStorage.getItem('currentPage') === null) {
                    if (response.data.object.roles.filter(item=>item.roleName==="ROLE_CASHIER").length!=0) {
                        this.setState({
                            currentPage:'/sale'
                        });
                        localStorage.setItem("currentPage","/sale");
                    }
                    if(response.data.object.roles.filter(item=>item.roleName==="ROLE_WAREHOUSE").length!=0){
                        this.setState({
                            currentPage:'/warehouse'
                        });
                        localStorage.setItem("currentPage","/warehouse");
                    }
                    if(response.data.object.roles.filter(item=>item.roleName==="ROLE_DIRECTOR").length!=0){
                        this.setState({
                            currentPage:'/admin'
                        });
                        localStorage.setItem("currentPage","/admin");
                    }
                }
                this.setState({
                    redirect: false,
                    currentUser: response.data.object,
                })
            }
        })
    }

    handlePage = (param) => {
        localStorage.setItem('currentPage', param);
        this.setState({
            currentPage: param
        })
    };
    logout = async () => {
        let logout = await window.confirm("Chiqishni xohlaysizmi");

        if(logout){
            this.setState({
                redirect: true
            });
            localStorage.clear();
            localStorage.removeItem('token');
            window.location.reload(true);
        }
    };

    render() {

        const {redirect, currentUser, currentPage, scroll} = this.state;

        return (

            <div>
                <Router>
                    {redirect ?
                    <Redirect to={localStorage.getItem("/")}/> : <Redirect to={localStorage.getItem("currentPage")}/>
                    }
                    {redirect
                        ? <Switch>
                            <Route path={"/"}>
                                <Login/>
                            </Route>
                        </Switch>
                        : <div>
                            <div className="row">
                                <div className={"col-md"}>
                                    <ul style={{position: 'fixed', boxShadow: '3px 3px 3px 3px #ccc'}}
                                        className="navbar-sticky w-100 rounded-0 list-group list-group-horizontal justify-content-center text-light bg-secondary myNavbar">
                                        {
                                            currentUser.roles.map(item =>
                                                item.roleName === 'ROLE_CASHIER' &&
                                                <Link className='font' to={"/admin"}
                                                      onClick={() => this.handlePage("/admin")}>
                                                    <li style={{backgroundColor: currentPage === '/admin' ? '#5DADE2' : 'transparent'}}
                                                        className={"list-group-item rounded-0 myClass"}>Admin
                                                    </li>
                                                </Link>
                                            )
                                        }
                                        {
                                            currentUser.roles &&
                                            currentUser.roles.map(item =>
                                                (item.roleName === 'ROLE_CASHIER') &&

                                                <Link className='font' to={"/sale"}
                                                      onClick={() => this.handlePage("/sale")}>
                                                    <li style={{backgroundColor: currentPage === '/sale' ? '#5DADE2' : 'transparent'}}
                                                        className={"list-group-item rounded-0 myClass"}>Savdo
                                                    </li>
                                                </Link>
                                            )
                                        }
                                        {
                                            currentUser.roles &&
                                            currentUser.roles.map(item =>
                                                (item.roleName === 'ROLE_CASHIER') &&
                                                <Link className='font' to={"/warehouse"}
                                                      onClick={() => this.handlePage("/warehouse")}>
                                                    <li style={{backgroundColor: currentPage === '/warehouse' ? '#5DADE2' : 'transparent'}}
                                                        className={"list-group-item rounded-0 myClass"}>Ombor
                                                    </li>
                                                </Link>
                                            )
                                        }
                                        {
                                            currentUser.roles &&
                                            currentUser.roles.map(item =>
                                                item.roleName === 'ROLE_CASHIER' &&
                                                <Link className='font' to={"/client"}
                                                      onClick={() => this.handlePage("/client")}>
                                                    <li style={{backgroundColor: currentPage === '/client' ? '#5DADE2' : 'transparent'}}
                                                        className={"list-group-item rounded-0 myClass"}>Mijoz
                                                    </li>
                                                </Link>
                                            )
                                        }
                                        {
                                            currentUser.roles &&
                                            currentUser.roles.map(item =>
                                                item.roleName === 'ROLE_DIRECTOR' &&
                                                <Link className='font' to={"/income"}
                                                      onClick={() => this.handlePage("/income")}>
                                                    <li style={{backgroundColor: currentPage === '/income' ? '#5DADE2' : 'transparent'}}
                                                        className={"list-group-item rounded-0 myClass"}>Foyda
                                                    </li>
                                                </Link>
                                            )
                                        }
                                        {
                                            currentUser.roles &&
                                            currentUser.roles.map(item =>
                                                item.roleName === 'ROLE_CASHIER' &&
                                                <Link className='font' to={"/report"}
                                                      onClick={() => this.handlePage("/report")}>
                                                    <li style={{backgroundColor: currentPage === '/report' ? '#5DADE2' : 'transparent'}}
                                                        className={"list-group-item rounded-0 myClass"}>Hisobot
                                                    </li>
                                                </Link>
                                            )
                                        }
                                            <Link className='font' onClick={this.logout}>
                                                <li style={{backgroundColor: currentPage === '/' ? '#5DADE2' : 'transparent'}}
                                                    className={"list-group-item rounded-0 rounded-0 myClass"}>Chiqish
                                                </li>
                                            </Link>
                                    </ul>
                                </div>
                            </div>
                            <div style={{height: 50}} className="content">
                            </div>
                            <div className="row">
                                <div className="col-md">
                                    <Switch>
                                        {
                                            currentUser.roles &&
                                            currentUser.roles.map(item =>
                                                item.roleName === 'ROLE_CASHIER' &&
                                                    <Route path={"/client"}>
                                                        <Client/>
                                                    </Route>
                                                )
                                        }

                                        {
                                            currentUser.roles &&
                                            currentUser.roles.map(item =>
                                                item.roleName === 'ROLE_CASHIER' &&
                                                <Route path={"/report"}>
                                                    <Report/>
                                                </Route>
                                            )
                                        }
                                        {
                                            currentUser.roles &&
                                            currentUser.roles.map(item =>
                                                item.roleName === 'ROLE_DIRECTOR' &&
                                                <Route path={"/income"}>
                                                    <Income/>
                                                </Route>
                                            )
                                        }
                                        {
                                            currentUser.roles &&
                                            currentUser.roles.map(item =>
                                                item.roleName === 'ROLE_CASHIER' &&
                                                <Route path={"/admin"}>
                                                    <Dashboard currentUser={this.state.currentUser}/>
                                                </Route>
                                            )
                                        }
                                        {
                                            currentUser.roles &&
                                            currentUser.roles.map(item =>
                                                item.roleName === 'ROLE_CASHIER' &&
                                                <Route path={"/sale"}>
                                                    <Sale currentUser={currentUser}/>
                                                </Route>
                                            )
                                        }
                                        {
                                            currentUser.roles &&
                                            currentUser.roles.map(item =>
                                                item.roleName === 'ROLE_CASHIER' &&
                                                <Route path={"/warehouse"}>
                                                    <Warehouse currentUser={this.state.currentUser}/>
                                                </Route>
                                            )
                                        }


                                        <Route path={"/"}>
                                            <div className={'text-center m-5 p-5'}>
                                                <Unauthorized/>
                                            </div>
                                        </Route>
                                    </Switch>
                                </div>
                            </div>
                        </div>
                    }
                </Router>
            </div>
        )
    }
}

export default App;