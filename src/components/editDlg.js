import React from 'react';
import { Dialog, DialogActionsBar } from '@progress/kendo-react-dialogs';
import { Input } from '@progress/kendo-react-inputs';
import { Error } from '@progress/kendo-react-labels';

const validateForm = (errors) => {
  let valid = true;
  Object.values(errors).forEach(
    (val) => val.length > 0 && (valid = false)
  );
  return valid;
}
export default class EditDialog extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            itemInEdit: this.props.dataItem || null,
            errors: {
                name_shrt: '',
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
        if(edited.name_shrt === undefined || edited.name_shrt.length === 0){
            errors.name_shrt = 'Short Name is required!';
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
            case 'name_shrt': 
                errors.name_shrt = value.length < 1 ? 'Please enter Short Name' : '';
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
                            Short Name<br />
                            <Input
                                validityStyles={false}
                                type="text"
                                name="name_shrt"
                                value={this.state.itemInEdit.name_shrt || ''}
                                onChange={this.onDialogInputChange}
                                required={true}
                                className="w-100"
                            />
                            {errors.name_shrt.length > 0 && <Error>{errors.name_shrt}</Error>}
                            </label>
                        </div>
                    </div>
                    <div className="row mt-4">
                        <div className="col-12">
                            <label className="w-100">
                            Description<br />
                            <Input
                                type="text"
                                name="name_lng"
                                value={this.state.itemInEdit.name_lng || ''}
                                onChange={this.onDialogInputChange}
                                className="w-100"
                            />
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