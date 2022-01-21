import React, {Component} from 'react';
import {
    Card,
    CardBody,
    CardTitle
} from 'reactstrap';

import { Grid, GridColumn as Column, GridToolbar } from '@progress/kendo-react-grid';

import cellWithEditing from '../../components/cellEditing.js'

import DeleteDialog from '../../components/deleteDlg.js'
import EditAgentDialog from '../../components/shipagent/editAgentDlg.js'
import axiosInstance from '../../api'

class ShipperAgents extends Component {
    minGridWidth = 600
    constructor(props) {
        super(props);
        this.state = {
            items: [],
            itemInEdit: undefined,
            errorResponse: undefined,
            delDlgVisible: false,
            delItem: undefined,
            skip: 0, 
            take: 10,
            gridWidth : this.minGridWidth,
            shippers: undefined,
        };
    }
    
    componentDidMount() {
        axiosInstance.get(`shippers/`).then(res => {
            var shipsData = res.data;
            axiosInstance.get(`shipper-agents/`)
                .then(res => {
                    console.log(res)
                    this.setState({
                        items:res.data,
                        shippers: shipsData
                    })
                })
        })
        
        this.grid = document.querySelector('.k-grid');
        this.handleResize();
        window.addEventListener('resize', this.handleResize);
    }
    handleResize = () => {
        if ( this.grid.offsetWidth > this.minGridWidth ){
            this.setState({
                gridWidth: this.grid.offsetWidth
            })
        }else{
            this.setState({
                gridWidth: this.minGridWidth
            })
        }
        console.log(this.grid.offsetWidth);
    }
    save = () => {
        
        const dataItem = this.state.itemInEdit;
        const items = this.state.items.slice();
        const isNewItem = dataItem.id === undefined;

        if (isNewItem) {
            let postData = {
                name: dataItem.name,
                email: dataItem.email,
                shipper_id: dataItem.shipper.id
            }
            axiosInstance.post(`shipper-agents/`, postData)
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
                name: dataItem.name,
                email: dataItem.email,
                shipper_id: dataItem.shipper.id
            }
            axiosInstance.patch(`shipper-agents/` + dataItem.id +'/', postData)
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
        axiosInstance.delete(`shipper-agents/` + this.state.delItem.id +'/')
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
            
        });
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
                        <i className="fas fa-warehouse mr-2"> </i>
                        ShipperAgents Management
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
                                        Add New ShipperAgent
                                    </button>
                                </GridToolbar>
                                
                                <Column field="name" title="Name" width={this.state.gridWidth * 0.3}/>
                                <Column field="email" title="Email" width={this.state.gridWidth * 0.2}/>
                                <Column field="shipper.name_shrt" title="Shipper" width={this.state.gridWidth * 0.3}/>
                                
                                <Column
                                    title="Manage"
                                    cell={cellWithEditing(this.edit, this.removeConfirm)}
                                    width={this.state.gridWidth * 0.2 - 19}
                                />
                            </Grid>
                        </div>
                    </CardBody>
                </Card>
                {this.state.itemInEdit && 
                    <EditAgentDialog 
                        dataItem={this.state.itemInEdit} 
                        error={this.state.errorResponse} 
                        save={this.save} 
                        cancel={this.cancel}
                        title="Shipper Agent"
                        shippersData = {this.state.shippers}
                    />}
                {this.state.delDlgVisible && <DeleteDialog cancel={this.cancel} remove={this.remove}/>} 
                
            </div>
        );
    }
}
export default ShipperAgents;