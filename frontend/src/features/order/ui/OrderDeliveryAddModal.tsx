import "./OrderDeliveryModal.css"
import React from "react";
import { IoClose } from "react-icons/io5";

interface ModalProps {
  open: boolean;
  close: () => void;
  header: string;
  // children: React.ReactNode;
}


const OrderDeliveryAddModal: React.FC<ModalProps> = ({open, close, header}) => {
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
          <main className="modalMain">
            <form action="">
              <div className="newAddress">
                <input type="text" 
                  name="address"/>
                <button>주소 찾기</button>
              </div>
              <div className="recipientContainer">
                <div className="recipientTitle"></div>
                <input type="text"
                  className="recipientForm"/>
              </div>
              <div className="contactContainer">
                <div className="contactTitle"></div>
                <input type="text"
                  className="contactForm"/>
              </div>
              <div className="contactContainer">
                <div className="contactTitle"></div>
                <input type="text"
                  className="contactForm"/>
              </div>

            </form>
          </main>
          <footer className="modalFooter">
            <button onClick={close} className="selectAddress">취소</button>
            <button onClick={close} className="footerClose">저장</button>
          </footer>
        </section>
      ):null}
    </div>
  );
}

export default OrderDeliveryAddModal;