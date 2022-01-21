import React from 'react';
import { Dialog, DialogActionsBar } from '@progress/kendo-react-dialogs';
import { Input } from '@progress/kendo-react-inputs';
import { Error } from '@progress/kendo-react-labels';
import { DropDownList } from '@progress/kendo-react-dropdowns';

const emailRegex = new RegExp(/\S+@\S+\.\S+/);
const validateForm = (errors) => {
  let valid = true;
  Object.values(errors).forEach(
    (val) => val.length > 0 && (valid = false)
  );
  return valid;
}
export default class EditAgentDialog extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            itemInEdit: this.props.dataItem || null,
            errors: {
                name: '',
                email: '',
                shipper: ''
            }
        };
    }
    handleSubmit(event) {
      event.preventDefault();
    }
    onSaveClicked = ()=>{
        
        if(validateForm(this.state.errors)) {
            if(this.isCheckEmpty()){
                this.props.save();
            }
        }
    }
    isCheckEmpty(){
        let valid = true;
        const edited = this.state.itemInEdit;
        console.log(edited);
        let errors = this.state.errors;
        if(edited.name === undefined || edited.name.length === 0){
            errors.name = 'Name is required!';
            valid = false;
        }
        if(edited.email === undefined || edited.email.length === 0){
            errors.email = 'Email is required!';
            valid = false;
        }
        if(edited.shipper === undefined || edited.shipper.length === 0){
            errors.shipper = 'Shipper is required!';
            valid = false;
        }
        this.setState({
            errors
        })
        return valid
    }
    onDialogInputChange = (event) => {
        let target = event.target;
        const value = target.value;
        const name = target.props ? target.props.name : target.name;

        const edited = this.state.itemInEdit;
        edited[name] = value;
        let errors = this.state.errors;
  
        switch (name) {
            case 'name': 
                errors.name = value.length < 1 ? 'Please enter Name' : '';
                break;
            case 'email': 
                errors.email = emailRegex.test(value) ? '' : 'Email is not valid!';
                break;
            case 'shipper': 
                errors.shipper = value.id !== '' ? '' : 'Shipper is required';
                break;
            default:
                break;
        }
        this.setState({
            itemInEdit: edited,
            errors, [name]: value
        });
    }
  
    render() {
        const {errors} = this.state;
        
        return (
            <Dialog
                onClose={this.props.cancel}
                title={`${this.state.itemInEdit.id === undefined ? 'Add New' : 'Edit'} ` + this.props.title}
                width={400}
                
            >
            
                <form className="k-form" onSubmit={this.handleSubmit}>
                    <div className="row">
                        <div className="col-md-12">
                            { this.props.error !== undefined && 
                                Object.keys(this.props.error).map((key, index) => {
                                    return <Error style={{fontSize:'14px'}} key={key}> { key } : { this.props.error[key].join(',') } </Error>
                                    
                                })
                            }
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12">
                            <label className="w-100">
                            Name<br />
                            <Input
                                validityStyles={false}
                                type="text"
                                name="name"
                                value={this.state.itemInEdit.name || ''}
                                onChange={this.onDialogInputChange}
                                required={true}
                                className="w-100"
                            />
                            {errors.name.length > 0 && <Error>{errors.name}</Error>}
                            </label>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12">
                            <label className="w-100">
                            Email<br />
                            <Input
                                validityStyles={false}
                                type="email"
                                name="email"
                                value={this.state.itemInEdit.email || ''}
                                onChange={this.onDialogInputChange}
                                className="w-100"
                            />
                            {errors.email.length > 0 && <Error>{errors.email}</Error>}
                            </label>
                        </div>
                    </div>
                    <div className="row mt-4">
                        <div className="col-12">
                            <label className="w-100">
                            Shipper<br />
                            <DropDownList
                                validityStyles={false}
                                data={this.props.shippersData}
                                name="shipper"
                                textField="name_shrt"
                                dataItemKey="id"
                                value={this.state.itemInEdit.shipper || ''}
                                onChange={this.onDialogInputChange}
                                className="w-100"
                            />
                            {errors.shipper.length > 0 && <Error>{errors.shipper}</Error>}
                            </label>
                        </div>
                        
                    </div>
                </form>
                <DialogActionsBar>
                    <button
                        className="k-button"
                        onClick={this.props.cancel}
                    >
                        Cancel
                    </button>
                    <button
                        className="k-button k-primary"
                        onClick={this.onSaveClicked}
                    >
                        Save
                    </button>
                </DialogActionsBar>
            </Dialog>
        );
    }
}