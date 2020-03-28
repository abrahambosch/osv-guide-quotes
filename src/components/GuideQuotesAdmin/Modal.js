import React from 'react';
import './modal.scss';

export default class Modal extends React.Component {
    onClose = e => {
        this.props.onClose && this.props.onClose(e);
    };
    onModalSave = e => {
        this.props.onSave && this.props.onSave(e);
    };
    render() {
        if (!this.props.isOpen) {
            return null;
        }
        // return (
        //     <div class="mymodal" id="modal">
        //         <h2>Modal Window</h2>
        //         <div class="content">{this.props.children}</div>
        //         <div class="actions">
        //             <button class="toggle-button" onClick={this.onClose}>
        //                 close
        //             </button>
        //         </div>
        //     </div>
        //
        //
        // );
        return (
            <div className="modal-wrapper-visible">
                <div className="modal" tabIndex="-1" role="dialog">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">{this.props.title}</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={this.onClose}>
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                {this.props.children}
                            </div>
                            {this.props.showFooter !== false && (<div className="modal-footer">
                                <button type="button" className="btn btn-primary" onClick={this.onModalSave}>Save changes</button>
                                <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={this.onClose}>Close</button>
                            </div>)}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}