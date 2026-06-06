import React from "react";
import "./PopUpMessageBox.css";
interface IPopUpMessageBoxProps {
    message: string;
    handleClosePopUpCallBackFunction: () => void;
}
export default function PopUpMessageBox({
    message,
    handleClosePopUpCallBackFunction,
}: IPopUpMessageBoxProps) {
    return (
        <div className="pop-up-message-overlay">
            <div className="pop-up-message-box">
                <p>{message}</p>
                <button
                    className="pop-up-message-box-button"
                    type="button"
                    onClick={() => handleClosePopUpCallBackFunction()}
                >
                    Close
                </button>
            </div>
        </div>
    );
}
