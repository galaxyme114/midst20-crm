import React from 'react';
import { GridCell } from '@progress/kendo-react-grid';

export default function cellWithEditing(edit, removeConfirm, reset) {
    return class extends GridCell {
        render() {
            return (
                <td>
                    <button
                        className="k-button k-grid-edit-command"
                        onClick={() => { edit(this.props.dataItem); }}
                    >
                        <i className="fas fa-pencil-alt mr-2"></i>Edit
                    </button>
                    &nbsp;
                    <button
                        className="k-button k-grid-remove-command"
                        onClick={() => {
                            removeConfirm(this.props.dataItem);
                        }}
                    >
                        <i className="fas fa-trash-alt mr-2"></i>Remove
                    </button>
                    &nbsp;
                    <button
                        className="k-button k-grid-edit-command"
                        onClick={() => {
                            reset(this.props.dataItem);
                        }}
                    >
                        <i className="fas fa-key mr-2"></i>Reset
                    </button>
                </td>
            );
        }
    };
}