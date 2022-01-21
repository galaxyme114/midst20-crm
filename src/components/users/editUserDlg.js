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
export default class EditUserDialog extends React.Component {
    auth_levels = ['User', 'Admin'];
    
    constructor(props) {
        super(props);
        this.state = {
            itemInEdit: this.props.dataItem || null,
            errors: {
                username: '',
                email: '',
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
        console.log(edited);
        let errors = this.state.errors;
        if(edited.username === undefined || edited.username.length === 0){
            errors.username = 'Username is required!';
            valid = false;
        }
        if( edited.id === undefined && (edited.password === undefined || edited.password.length === 0)){
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
        const re = /^\S*$/;
        let errors = this.state.errors;
  
        switch (name) {
            case 'username': 
                errors.username = value.length < 1 || !re.test(value) ? 'Please enter valid username' : '';
                break;
            case 'email': 
                errors.email = emailRegex.test(value) ? '' : 'Email is not valid!';
                break;
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
                title={`${this.state.itemInEdit.id === undefined ? 'Add New' : 'Edit'} User`}
                width={500}
                
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
                        <div className="col-md-6 col-12">
                            <label className="w-100">
                            UserId<br />
                            <Input
                                validityStyles={false}
                                type="text"
                                name="username"
                                value={this.state.itemInEdit.username || ''}
                                onChange={this.onDialogInputChange}
                                required={true}
                                className="w-100"
                            />
                            {errors.username.length > 0 && <Error>{errors.username}</Error>}
                            </label>
                        </div>
                        <div className="col-md-6 col-12">
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
                    <div className="row">
                        <div className="col-md-6 col-12">
                            <label className="w-100">
                            First Name<br />
                            <Input
                                type="text"
                                name="first_name"
                                value={this.state.itemInEdit.first_name || ''}
                                onChange={this.onDialogInputChange}
                                className="w-100"
                            />
                            </label>
                        </div>
                        <div className="col-md-6 col-12">
                            <label className="w-100">
                            Last Name<br />
                            <Input
                                type="text"
                                name="last_name"
                                value={this.state.itemInEdit.last_name || ''}
                                onChange={this.onDialogInputChange}
                                className="w-100"
                            />
                            </label>
                        </div>
                    </div>
                    { this.state.itemInEdit.id === undefined &&
                        <div className="row">
                            <div className="col-md-6 col-12">
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
                            <div className="col-md-6 col-12">
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
                    }
                    <div className="row">
                        <div className="col-md-6 col-12">
                            <label className="w-100">
                            Authority Level<br />
                            <DropDownList
                                data={this.auth_levels}
                                name="auth_val"
                                value={this.state.itemInEdit.auth_val || 'User'}
                                onChange={this.onDialogInputChange}
                                className="w-100"
                            />
                            
                            </label>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12">
                            <label className="w-100">
                            Company<br />
                            <Input
                                type="text"
                                name="company"
                                value={this.state.itemInEdit.company || ''}
                                onChange={this.onDialogInputChange}
                                className="w-100"
                            />
                            </label>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12">
                            <label className="w-100">
                            Buisness Unit<br />
                            <Input
                                type="text"
                                name="bussiness_unit"
                                value={this.state.itemInEdit.bussiness_unit || ''}
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