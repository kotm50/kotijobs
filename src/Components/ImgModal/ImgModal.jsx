function ImgModal(props) {
  return (
    <>
      <div
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-fit h-fit max-w-[1000px] max-h-[95vh] p-2 pt-0 bg-white border overflow-auto z-[2000] hover:cursor-pointer"
        onClick={() => {
          props.setIsModal(false);
        }}
      >
        <div className="sticky top-0 left-0 w-full h-[48px] bg-white z-40 overflow-hidden">
          <h4 className="text-center py-3 text-lg font-bold">
            원본 이미지 미리보기(누르면 닫힙니다)
          </h4>
        </div>
        <img src={props.img} className="max-w-full" alt="원본 미리보기" />
      </div>
      <div
        className="fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-35 z-[1000] overflow-hidden"
        onClick={() => {
          props.setIsModal(false);
        }}
      />
    </>
  );
}

export default ImgModal;
