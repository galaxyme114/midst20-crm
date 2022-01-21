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
export default class ResetDialog extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            itemInEdit: this.props.dataItem || null,
            errors: {
                password: '',
                password1: '',
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
        let errors = this.state.errors;
        
        if( edited.password === undefined || edited.password.length === 0){
            errors.password = 'Password is required!';
            valid = false;
        }
        this.setState({
            errors
        })
        return valid
    }
    onDialogInputChange = (event) => {
        let target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.props ? target.props.name : target.name;

        const edited = this.state.itemInEdit;
        edited[name] = value;
        let errors = this.state.errors;
  
        switch (name) {
            case 'password': 
                errors.password = value.length < 8 ? 'Password must be 8 characters long!' : '';
                break;
            case 'password1': 
                errors.password1 = value.length < 8 ? 'ConfirmPassword must be 8 characters long!' : value !== edited.password ? "Password is not matched!" : "";
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
                title={`Reset Password`}
                width='320px'
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
                        <div className="col-md-12">
                            <label className="w-100">
                            New Password<br />
                            <Input
                                type="password"
                                name="password"
                                value={this.state.itemInEdit.password || ''}
                                onChange={this.onDialogInputChange}
                                className="w-100"
                            />
                            {errors.password.length > 0 && <Error>{errors.password}</Error>}
                            </label>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12">
                            <label className="w-100">
                            Confirm Password<br />
                            <Input
                                type="password"
                                name="password1"
                                value={this.state.itemInEdit.password1 || ''}
                                onChange={this.onDialogInputChange}
                                className="w-100"
                            />
                            {errors.password1.length > 0 && <Error>{errors.password1}</Error>}
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