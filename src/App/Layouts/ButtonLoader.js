import React from "react";
import ButtonLoaderImage from "../../assets/images/loader2.gif"

function ButtonLoader() {
  return (
    <div className="">
      <img src={ButtonLoaderImage} alt="" width={18} height={18} style={{marginLeft:"10px"}} />
    </div>
  );
}

export default ButtonLoader;