import React from "react";
import "./style.scss"
/**
 * Create an message box. 
 * It show the message and the buttons.
 * When a button is clicked, it will call the callback function 'onClick' 
 */
const MessageBox: React.FC<{
  buttons: "yesno" | "ok" | "okcancel" | "yesnocancel";
  message: string;
  onClose: (result: "yes" | "no" | "ok" | "cancel") => void;
  hidden: boolean;
  title: string;
}> = ({ buttons, message, onClose, hidden, title, ...props }) => {
  let button: JSX.Element[] = [];
  if (buttons === "yesno") {
    button = [
      <button key="yes" onClick={() => onClose("yes")}>Yes</button>,
      <button key="no" onClick={() => onClose("no")}>No</button>
    ];
  }
  else if (buttons === "ok") {
    button = [
      <button key="ok" onClick={() => onClose("ok")}>OK</button>
    ];
  }
  else if (buttons === "okcancel") {
    button = [
      <button key="ok" onClick={() => onClose("ok")}>OK</button>,
      <button key="cancel" onClick={() => onClose("cancel")}>Cancel</button>
    ];
  }
  else if (buttons === "yesnocancel") {
    button = [
      <button key="yes" onClick={() => onClose("yes")}>Yes</button>,
      <button key="no" onClick={() => onClose("no")}>No</button>,
      <button key="cancel" onClick={() => onClose("cancel")}>Cancel</button>
    ];
  }
  return (
    <div {...props} className="message-box" style={hidden == true  ? ({display: "none"}) : {}}>
      <div className="message-box-content">
        <h3>{title}</h3>
        <div className="message-box-message">{message}</div>
        <div className="message-box-buttons">
          {button}
        </div>
      </div>
    </div>
  );
}

export default MessageBox;