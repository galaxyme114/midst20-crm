import React, {Component} from 'react';
import {
    Card,
    CardBody,
    CardTitle
} from 'reactstrap';

import { Grid, GridColumn as Column } from '@progress/kendo-react-grid';

import cellWithDeleting from '../../components/cellDeleting.js'
import DeleteDialog from '../../components/deleteDlg.js'

import axiosInstance from '../../api'

class Nomes extends Component {
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
        };
    }
    
    componentDidMount() {
        axiosInstance.get(`nome/`)
        .then(res => {
            res.data.map(item => {
                item.ship_date= new Date(item.ship_date)
                item.exp_del_date= new Date(item.exp_del_date)
                item.est_del_date= new Date(item.est_del_date)
                
                return item
            }) 
            this.setState({
                items:res.data
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
    }
    
    removeConfirm = (dataItem) => {
        this.setState({
            delDlgVisible: true,
            delItem: dataItem
        })
    }
    remove = () => {
        axiosInstance.delete(`nome/` + this.state.delItem.id +'/')
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
                        <i className="fas fa-plane mr-2"></i>
                        Nom Management
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
                                <Column field="ship_date" title="Date" filter="date" width={this.state.gridWidth * 0.11} format="{0:g}"/>
                                <Column field="product.name_shrt" title="Product" width={this.state.gridWidth * 0.07}/>
                                <Column field="org_faci.name_shrt" title="Origin Facility" width={this.state.gridWidth * 0.09}/>
                                <Column field="dest_faci.name_shrt" title="Receipt Facility" width={this.state.gridWidth * 0.09}/>
                                <Column field="volume" title="Volumn" width={this.state.gridWidth * 0.05}/>
                                <Column field="shipper.name_shrt" title="Shipper" width={this.state.gridWidth * 0.06}/>
                                <Column field="shipper.id" title="ShipperID" width={this.state.gridWidth * 0.06}/>
                                <Column field="service" title="Service" width={this.state.gridWidth * 0.06}/>
                                <Column field="exp_del_date" title="Expected Delivery Date" width={this.state.gridWidth * 0.11} format="{0:g}"/>
                                <Column field="est_del_date" title="Estimated Delivery Date Time" width={this.state.gridWidth * 0.11} format="{0:g}"/>
                                <Column field="user.username" title="MSCO Scheduler" width={this.state.gridWidth * 0.08}/>
                                 
                                <Column
                                    title="Manage"
                                    cell={cellWithDeleting(this.removeConfirm)}
                                    width={this.state.gridWidth * 0.1 - 17}
                                />
                            </Grid>
                        </div>
                    </CardBody>
                </Card>
                {this.state.delDlgVisible && <DeleteDialog cancel={this.cancel} remove={this.remove}/>} 
                
            </div>
        );
    }
}
export default Nomes;