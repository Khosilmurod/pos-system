import React from 'react';
import 'antd/dist/antd.css';
import {Tree, Input, Select} from 'antd';
import axios from "axios";
import {Authorization, PATH_PREFIX} from "../utils/path_controller";
import {RedoOutlined} from "@ant-design/icons";


const {DirectoryTree} = Tree;
const {Search} = Input;
const {Option} = Select;

class SearchTree extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            lastExpanded: null,
            lastChildren: [],
            data: [],
            searchData: [],
            //selected
            selectedKeys: [],
            selectedKeysData: {title: null, key: null, children: null, isLeaf: null},
            //expanded
            expandedKeys: [],
            autoExpandParent: false,
            //search
            searchValue: '',
        }
    }

    async componentDidMount() {
        this.categories();
        await document.addEventListener('keydown', this.keydownHandler);
        document.getElementById("searchTree").focus();
    }

    keydownHandler = (event) => {
        if (
            (event.ctrlKey && event.keyCode === 81) &&
            (localStorage.getItem("currentPage") === '/sale' || localStorage.getItem("currentPage") === '/warehouse')) {
            document.getElementById("searchTree").focus();
        }
        if (
            (event.ctrlKey && event.altKey && event.keyCode === 82) &&
            (localStorage.getItem("currentPage") === '/sale' || localStorage.getItem("currentPage") === '/warehouse')) {
            this.reDrawAll();
        }
    };

    reDrawTree = () => {
        this.categories();
    };
    reDrawAll = () => {
        this.setState({
            lastExpanded: null,
            lastChildren: [],
            data: [],
            searchData: [],
            //selected
            selectedKeys: [],
            selectedKeysData: {title: null, key: null, children: null, isLeaf: null},
            //expanded
            expandedKeys: [],
            autoExpandParent: false,
            //search
            searchValue: '',
        });
        this.categories();
        this.props.reload();
    };
    deleteOne = (id) => {
        let data = this.state.data;
        let result = this.reoccur(data, id, []);
        this.setState({
            data: result
        })
    }

    reoccur = (data, id, result) => {
        for (let i = 0; i < data.length; i++) {
            if (data[i].key === id) {
            } else {
                let children=[];

                let push = result.push(data[i]);

                if (data[i].children&&data[i].children.length>0) {
                    children = this.reoccur(data[i].children, id, []);
                }
                result[push-1].children=children;
            }
        }
        return result;
    }

    categories = async () => {
        let {data} = await axios({
            url: PATH_PREFIX + '/api/category/tree',
            params: {
                id: ''
            },
            method: 'get',
            headers: {Authorization}
        });
        if (data.success) {
            await this.setState({
                data: data.object
            });
        }
    };
    categorySearch = async () => {
        if (this.state.searchValue !== "") {
            await axios({
                url: PATH_PREFIX + '/api/category/tree/search',
                method: 'get',
                headers: {
                    Authorization
                },
                params: {
                    search: this.state.searchValue
                }
            }).then((response) => {
                if (response.data.success) {
                    this.setState({
                        searchData: response.data.object
                    });
                }
            })
        }
        if (this.state.searchValue === "") {
            this.setState({
                searchData: []
            })
        }
    };

    onSelect = async (keys, event) => {
        await this.setState({
            selectedKeys: keys,
            selectedKeysData: event.selectedNodes[0],
        });

        this.props.onSelect(event.selectedNodes[0])
    };
    onExpand = async (expandedKeys) => {
        if (expandedKeys.length != 0) {
            let expanded = expandedKeys[expandedKeys.length - 1];
            let foo = this.state.data;
            let {data} = await axios({
                url: PATH_PREFIX + '/api/category/tree',
                params: {
                    id: expanded
                },
                method: 'get',
                headers: {Authorization}
            });
            await this.setState({
                lastExpanded: expanded,
                lastChildren: data.object
            });
            await this.recursion(foo);
        }
        this.setState({
            expandedKeys,
            autoExpandParent: false,
        });
    };

    recursion = (data) => {
        for (let i = 0; i < data.length; i++) {
            if (data[i].key == this.state.lastExpanded) {
                if (!data[i].children) {
                    data[i].children = this.state.lastChildren;
                }
            }
            if (data[i].children) {
                this.recursion(data[i].children);
            }
        }
        this.setState({
            data: data
        });
    };

    onSelectFromInput = async (value) => {
        let {data} = await axios({
            url: PATH_PREFIX + '/api/category/searchedTree',
            params: {
                id: value
            },
            method: 'get',
            headers: {Authorization}
        });

        await this.setState({
            selectedKeys: [value],
            data: data.object,
            expandedKeys: [],
            searchValue: '',
            searchData: [],
        });

        await this.setState({
            autoExpandParent: true,
            searchData: []
        });

        let toKnow = this.state.data;
        let map = toKnow.filter(item => item.key === value)[0];
        this.props.onSelect(map);
    };
    onSearch = async (val) => {
        await this.setState({
            searchValue: val
        });
        this.categorySearch();
    };

    render() {

        const {searchData, selectedKeys, expandedKeys, selectedKeysData, autoExpandParent} = this.state;
        return (

            <div>
                <Select
                    // dropdownStyle={{color:'blue', border:'1px'}}
                    id={'searchTree'}
                    className='border-secondary text-secondary'
                    showSearch
                    allowClear={true}
                    focus={true}
                    style={{width: '100%'}}
                    placeholder="Mahsulotni qidiring"
                    optionFilterProp="children"
                    onChange={this.onSelectFromInput}
                    onSearch={this.onSearch}
                    filterOption={(input, option) =>
                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                >
                    {
                        searchData.map(item =>
                            <Option key={item.id} style={{}} value={item.id}>{item.path}</Option>
                        )
                    }
                </Select>
                {
                    this.state.data.length === 0 ?
                        <div className={'text-center'}>
                            Ma'lumot yo'q (
                        </div> :
                        <div>
                            {
                                this.state.data.length != 0 ?
                                    this.state.data[0].parent != null ?
                                        <div onClick={(value) => this.onSelectFromInput(this.state.data[0].parent)}
                                             style={{fontSize: 12}} className={'btn rounded-0 btn-block'}><span
                                            className={'fas fa-backward'}></span> Orqaga qaytish</div>
                                        : <button disabled={true} style={{fontSize: 12}}
                                                  className={'btn rounded-0 btn-block'}><span
                                            className={'fas fa-backward'}></span> Orqaga qaytish</button>
                                    : <button disabled={true} style={{fontSize: 12}}
                                              className={'btn rounded-0 btn-block'}><span
                                        className={'fas fa-backward'}></span> Orqaga qaytish</button>
                            }
                            <div style={{overflowY: 'scroll', minHeight: '0px', maxHeight: '480px'}}>
                                <DirectoryTree
                                    autoFocus={true}
                                    autoClearSearchValue={true}
                                    mode={'tags'}
                                    expandedKeys={expandedKeys}
                                    selectedKeys={selectedKeys}
                                    onSelect={this.onSelect}
                                    autoExpandParent={autoExpandParent}
                                    onExpand={this.onExpand}
                                    treeData={this.state.data}
                                />
                            </div>
                            <div className={'text-center'}>
                                <button onClick={this.reDrawAll} className={'btn text-dark'}><span
                                    className={'fas fa-redo-alt'}></span></button>
                            </div>
                        </div>
                }
            </div>
        );
    }
}

export default SearchTree;