import "./OrderDeliveryModal.css"
import React from "react";
import { IoClose } from "react-icons/io5";

interface ModalProps {
  open: boolean;
  close: () => void;
  header: string;
}


const OrderDeliveryUpdateModal: React.FC<ModalProps> = ({open, close, header}) => {
  return (
    <div className={open ? "openModal modal" : "modal"}>
      {open ? (
        <section className="modalSection">
          <header className="modalHeader">
            {header}
            <button onClick={close} className="close">
              <IoClose className="closeIcon"/>
            </button>
          </header>
          <main className="modalMain"></main>
          <footer className="modalFooter">
            <button onClick={close} className="selectAddress">저장하기</button>
            <button onClick={close} className="footerClose">취소</button>
          </footer>
        </section>
      ):null}
    </div>
  );
}

export default OrderDeliveryUpdateModal;