import React from "react";
import {Modal, ModalHeader, ModalFooter, ModalBody, Button, Label} from "reactstrap";
import InputMask from "react-input-mask";
export const ClientModal=({
                              clientModalVisible,
                              closeClientModal,
                              saveClient
})=>{
    return(
        <Modal isOpen={clientModalVisible}>
            <ModalHeader toggle={closeClientModal}>
                Yangi Mijoz
            </ModalHeader>
            <ModalBody>
                <form id={"client-form"} onSubmit={(event)=>saveClient(event)}>
                    <div className={"pt-0"}>
                        <div className={"row"}>
                            <div className={"col"}>
                                <label for={"firstName"}>Ism:</label>
                                <input type="text" className={"form-control"} id={"firstName"} name={"firstName"}/>
                                <br/>
                                <label for={"lastName"}>Familiya:</label>
                                <input type="text" className={"form-control"} id={"lastName"} name={"lastName"}/>
                                <br/>
                                <label for={"phone"}>Telefon:</label>
                                <InputMask className={'form-control'} id={"phone"} name={"phone"} mask="+\9\9\8 99 999 99 99" maskChar=" " />
                                <br/>
                                <label for={"description"}>Izox:</label>
                                <textarea type="text" className={"form-control"} id={"description"} name={"phone"}/>
                            </div>
                        </div>
                    </div>
                </form>
            </ModalBody>
            <ModalFooter>
                <button className={"btn btn-danger"} onClick={closeClientModal}>Bekor qilish</button>
                <button className={"btn btn-success"} form={"client-form"}>Tasdiqlash</button>
            </ModalFooter>
        </Modal>
    )
}
export default ClientModal;