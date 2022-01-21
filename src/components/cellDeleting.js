import React from 'react';
import { GridCell } from '@progress/kendo-react-grid';

export default function cellWithDeleting(removeConfirm) {
    return class extends GridCell {
        render() {
            return (
                <td>
                    <button
                        className="k-button k-grid-remove-command"
                        onClick={() => {
                            removeConfirm(this.props.dataItem);
                        }}
                    >
                        <i className="fas fa-trash-alt mr-2"></i>Remove
                    </button>
                    
                </td>
            );
        }
    };
}