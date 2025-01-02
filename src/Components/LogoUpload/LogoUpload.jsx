import UploadImg from "../UploadImg";

function LogoUpload(props) {
  return (
    <>
      <UploadImg file={props.logoImg} setFile={props.setLogoImg} />
    </>
  );
}

export default LogoUpload;
