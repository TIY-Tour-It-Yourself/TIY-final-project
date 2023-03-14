import React, { useState } from "react";
import ReactModal from "react-modal";

// This line is needed to ensure accessibility for screen readers and other assistive technologies
ReactModal.setAppElement("#root");

const ExampleApp = (props) => {
  const [showModal, setShowModal] = useState(false);

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div>
      <button onClick={handleOpenModal}>Trigger Modal</button>
      <ReactModal
        isOpen={showModal}
        onRequestClose={handleCloseModal}
        contentLabel="Minimal Modal Example"
      >
        <button onClick={handleCloseModal}>Close Modal</button>
      </ReactModal>
    </div>
  );
};

export default ExampleApp;
