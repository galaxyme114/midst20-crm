import React from 'react';
import { Dialog, DialogActionsBar } from '@progress/kendo-react-dialogs';

export default class DeleteDialog extends React.Component {
    
    render() {
        return (
            <Dialog title={"Please confirm"} onClose={this.props.cancel}>
                <p style={{ margin: "25px", textAlign: "center" }}>Are you sure you want to delete?</p>
                <DialogActionsBar>
                    <button className="k-button" onClick={this.props.cancel}>No</button>
                    <button className="k-button k-primary" onClick={this.props.remove}>Yes</button>
                </DialogActionsBar>
            </Dialog>
        );
    }
}