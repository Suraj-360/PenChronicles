import React from 'react'
import '../Styles/PopUpOverlay.css'
import { MdFileDownloadDone } from "react-icons/md";
import { MdCancel } from "react-icons/md";

function PopUpOverlay({popupAction, confirmAction, cancelAction}) {
    return (
        <div className='super-popup-overlay-main-container'>
            <div className='super-popup-container'>
                <p>Are you sure you want to {popupAction} this?</p>
                <div className='super-popup-buttons'>
                    <span className='super-popup-button super-pop-up-button-one' onClick={confirmAction}><MdFileDownloadDone className='super-popup-icon'/>Yes</span>
                    <span className='super-popup-button super-pop-up-button-two' onClick={cancelAction}><MdCancel className='super-popup-icon'/>No</span>
                </div>
            </div>
        </div>
    )
}

export default PopUpOverlay