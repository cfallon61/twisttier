import React, {Component} from 'react';
import PropTypes from 'prop-types';

  

/**
 * Modal component for opening up dialogs.
 * This class is inspired by this post: https://daveceddia.com/open-modal-in-react/
 */

class Modal extends Component
{
    render()
    {
        console.log(this.props.children);
        if(!this.props.show) 
        {
            return null;
        }

        const modalStyle = {
          backgroundColor: 'black',
          borderRadius: 5,
          top: "25%",
          bottom: "25%",
          left: "25%",
          right: "25%",
          maxWidth: 500,
          minHeight: 300,
          margin: 'auto',
          padding: 30,
          color: "white",
          zIndex : 10
        };
        
        const backdropStyle = {
          position: 'fixed',
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: 'rgba(0,0,0,0.3)',
          padding: 50
        };    
        
        console.log("Rendering modal");
        return (
            <div className="backdrop" style={backdropStyle}>
              <div className="custom-modal" style={modalStyle}>
                {this.props.children}
                <div className="modal-footer">
                  <button onClick={this.props.onClose}>
                    Close
                  </button>
                </div>
              </div>
            </div>
          );
    }
}

//Declaring the types of props for error checking.
Modal.propTypes = {
    onClose: PropTypes.func.isRequired,
    show: PropTypes.bool,
    children: PropTypes.node
}

export default Modal;