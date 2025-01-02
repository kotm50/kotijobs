import SearchArea from "../SearchArea";

function Modal(props) {
  return (
    <>
      {props.modalOn ? (
        <>
          <div className="fixed top-1/2 left-1/2 min-w-[200px] min-h-[100px] -translate-x-1/2 -translate-y-1/2 p-2 z-[2000] bg-white rounded-lg">
            {props.modalType === "areaA" ||
            props.modalType === "areaB" ||
            props.modalType === "areaC" ? (
              <>
                <SearchArea
                  modalType={props.modalType}
                  setModalType={props.setModalType}
                  setModalOn={props.setModalOn}
                  areaA={props.areaA}
                  areaB={props.areaB}
                  areaC={props.areaC}
                  setAreaA={props.setAreaA}
                  setAreaB={props.setAreaB}
                  setAreaC={props.setAreaC}
                />
              </>
            ) : null}
          </div>
          <div
            className="fixed top-0 left-0 w-[100vw] h-[100vh] overflow-y-hidden bg-black bg-opacity-50 z-[1000]"
            onClick={() => {
              props.setModalType("");
              props.setModalOn(false);
            }}
          ></div>
        </>
      ) : null}
    </>
  );
}

export default Modal;
