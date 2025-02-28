import React from "react";
import {Modal, ModalHeader, ModalFooter, ModalBody, Button, Label} from "reactstrap";
 export const EditProductAmountModal=({
     editProductAmountModalVisible,
     closeEditProductAmountModal,
     saveChanges,
     handleEdit,
     editableProduct,
     editableAmount
 })=>{
     return(

         <Modal isOpen={editProductAmountModalVisible}>
             <ModalHeader> Maxsulot miqdorini taxrirlash</ModalHeader>
             <ModalBody>
                 {
                    editableProduct &&
                         <form  id={"editProductAmount"} onSubmit={saveChanges} >
                             <label for={'editableProductName'}><b>Mahsulot nomi:</b></label>
                             <input id={'editableProductName'} className={"mb-2 form-control"} type="text" value={editableProduct.name} disabled={true}/>
                             <label for={'editableProductAmount'}><b>Mahsulot miqdori:</b></label>
                             <input id={'editableProductAmount'} className={"mb-2 form-control"} type="number" defaultValue={editableAmount} placeholder={editableProduct.amount} onChange={handleEdit}/>
                             <label for={'editableProductSalePrice'}><b>Mahsulot narxi:</b></label>
                             <input id={'editableProductSalePrice'} className={"mb-2 form-control"} type="number" value={editableProduct.salePrice} disabled={true}/>
                             <label htmlFor={'editableProductSum'}><b>Mahsulot narxi:</b></label>
                             <input id={'editableProductSaleSum'} className={"mb-2 form-control"} type="number"
                                    value={editableProduct.salePrice*editableProduct.amount} disabled={true}/>
                         </form>
                 }

             </ModalBody>
             <ModalFooter>
                 <button  className={'btn btn-outline-danger'} onClick={closeEditProductAmountModal}>Bekor qilish</button>
                 <button form='editProductAmount' className={'btn btn-outline-info'}>Saqlash</button>
             </ModalFooter>
         </Modal>
     )
 } ;
 export default EditProductAmountModal;