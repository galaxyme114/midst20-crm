import React, {Component} from 'react';
import {
    Card,
    CardBody,
    CardTitle
} from 'reactstrap';

import { Grid, GridColumn as Column, GridToolbar } from '@progress/kendo-react-grid';

import cellWithEditing from '../../components/users/cellEditing.js'
import EditUserDialog from '../../components/users/editUserDlg.js';
import DeleteDialog from '../../components/deleteDlg.js'
import ResetDialog from '../../components/users/resetDlg.js'
import axiosInstance from '../../api'

class Users extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            items: [],
            itemInEdit: undefined,
            errorResponse: undefined,
            delDlgVisible: false,
            delItem: undefined,
            resetDlgVisible: false,
            resetItem: undefined,
            skip: 0, 
            take: 10
        };
    }
    
    componentDidMount() {
        axiosInstance.get(`users/`)
        .then(res => {
            console.log(res)
            this.setState({
                items:res.data
            })
        })
    }
    save = () => {
        
        const dataItem = this.state.itemInEdit;
        const items = this.state.items.slice();
        const isNewItem = dataItem.id === undefined;

        if (isNewItem) {
            let postData = {
                username: dataItem.username,
                password: dataItem.password,
                first_name: dataItem.first_name,
                last_name: dataItem.last_name,
                email: dataItem.email,
                company: dataItem.company,
                bussiness_unit: dataItem.bussiness_unit,
                authoity_level: dataItem.auth_val !== undefined && dataItem.auth_val === "Admin" ? "1" : "2",
            }
            axiosInstance.post(`users/`, postData)
            .then(res => {
                if (res.statusText === "Created"){
                    items.push(res.data);
                    this.setState({
                        items: items,
                        itemInEdit: undefined,
                    });
                }
            }).catch((error) => {
                this.setState({
                    errorResponse: error.response.data
                })
            })
            
        } else {
            
            let postData = {
                username: dataItem.username,
                first_name: dataItem.first_name,
                last_name: dataItem.last_name,
                email: dataItem.email,
                company: dataItem.company,
                bussiness_unit: dataItem.bussiness_unit,
                authoity_level: dataItem.auth_val === "User" ? "2" : "1",
            }
            axiosInstance.patch(`users/` + dataItem.id +'/', postData)
            .then(res => {
                if (res.statusText === "OK"){
                    const index = items.findIndex(p => p.id === res.data.id);
                    items.splice(index, 1, res.data);
                    this.setState({
                        items: items,
                        itemInEdit: undefined,
                    });
                }
            }).catch((error) => {
                this.setState({
                    errorResponse: error.response.data
                })
            })
        }

        
    }
    edit = (dataItem) => {
        this.setState({ itemInEdit: Object.assign({}, dataItem) });
    }
    removeConfirm = (dataItem) => {
        this.setState({
            delDlgVisible: true,
            delItem: dataItem
        })
    }
    remove = () => {
        axiosInstance.delete(`users/` + this.state.delItem.id +'/')
        .then(res => {
            console.log(res)
            if (res.status === 204){
                this.setState({
                    items: this.state.items.filter(p => p.id !== this.state.delItem.id),
                    delItem: undefined,
                    delDlgVisible: false
                });
            }
        }).catch((error) => {
            this.setState({
                errorResponse: error.response.data
            })
        })
        
    }
    
    insert = () => {
        this.setState({ itemInEdit: { } });
    }
    cancel = () => {
        this.setState({ 
            itemInEdit: undefined,
            delDlgVisible: false,
            delItem: undefined,
            resetDlgVisible: false,
            resetItem: undefined 
        });
    }
    resetConfirm = (dataItem) => {
        this.setState({ resetItem: Object.assign({}, dataItem), resetDlgVisible: true });
    }
    reset = () => {
        const dataItem = this.state.resetItem;
        let postData = {
            password: dataItem.password
        }
        axiosInstance.patch(`users/` + dataItem.id +'/', postData)
        .then(res => {
            this.setState({ 
                resetDlgVisible: false,
                resetItem: undefined 
            });
        }).catch((error) => {
            this.setState({
                errorResponse: error.response.data
            })
        })
    }
    pageChange = (event) => {
        this.setState({
            skip: event.page.skip,
            take: event.page.take
        });
    }
    render(){
        
        return (
            <div>
                <Card>
                    <CardTitle className="bg-light border-bottom p-3 mb-0 font-24">
                        <i className="fas fa-users mr-2"> </i>
                        User Management
                    </CardTitle>
                    <CardBody className="">
                        <div className="">
                            <Grid
                                data={this.state.items.slice(this.state.skip, this.state.take + this.state.skip)}
                                style={{ height: '630px' }}
                                pageable={{ buttonCount: 4, pageSizes: true }}
                                total={this.state.items.length}
                                skip={this.state.skip}
                                take={this.state.take}
                                onPageChange={this.pageChange}
                            >
                                <GridToolbar>
                                    <button
                                        onClick={this.insert}
                                        className="k-button k-primary"
                                    >
                                        Add New User
                                    </button>
                                </GridToolbar>
                                
                                <Column field="username" title="UserId" width="150px"/>
                                <Column field="full_name" title="User Name" width="250px"/>
                                <Column field="email" title="Email" width="200px"/>
                                <Column field="company" title="Company" width="250px"/>
                                <Column field="bussiness_unit" title="Business Unit" width="300px"/>
                                <Column field="auth_val" title="Authoity Level" width="135px"/>
                                <Column
                                    title="Manage"
                                    cell={cellWithEditing(this.edit, this.removeConfirm, this.resetConfirm)}
                                    width="265px"
                                />
                            </Grid>
                        </div>
                    </CardBody>
                </Card>
                {this.state.itemInEdit && <EditUserDialog dataItem={this.state.itemInEdit} error={this.state.errorResponse} save={this.save} cancel={this.cancel}/>}
                {this.state.delDlgVisible && <DeleteDialog cancel={this.cancel} remove={this.remove}/>} 
                {this.state.resetDlgVisible && <ResetDialog dataItem={this.state.resetItem} cancel={this.cancel} save={this.reset}/>} 
            </div>
        );
    }
}
export default Users;