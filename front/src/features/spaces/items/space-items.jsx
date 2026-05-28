import { useContext, useState } from "react";
import { useNavigate } from "react-router";
import { SpacesContext } from "../provider/spaces-provider";
import { ToastContext } from "../../../widgets/toast/toast-provider";
import { AuthContext } from "../../auth/provider/auth-provider";
import Loader from "../../../widgets/loader/loader";
import SpacesUpdate from "./form/spaces-update";

function SpaceItems({ space }) {
  const {showToast} = useContext(ToastContext)
    const navigate = useNavigate()
    const {user} = useContext(AuthContext)
    const [show , setShow] = useState(false)
    const roles = user?.role === 'manager'
    const {remove , loader , setLoader} = useContext(SpacesContext)
    const onRemove = async (id) => {
      try{
        const data = await remove(id)
        showToast('удачно удалили', 'success')
        return data
      }catch(error){
        showToast(error?.response?.data?.error , 'error')
        setLoader(false)
      }
    }
    if(loader){
      return <Loader />
    }
  return (
    <div className="items">
      <img src={space?.images[0]} alt="пока не прогрузилось" />
      <h1>Title: {space?.title}</h1>
      <h2>Description: {space?.description}</h2>
      <h2>Zone: {space?.zoneType}</h2>
      <h2>Rating: {space?.rating}</h2>
      <h2>Capacity: {space?.capacity}</h2>
      <h2>Price: {space?.pricePerHour}</h2>
      {roles && (
        <>
        <button onClick={() => onRemove(space.id)}>Remove</button>
        <button onClick={() => setShow(true)}>Update</button>
        <button onClick={()  => navigate(`/reviews/manage/${space.id}`)}>Редактировать отзывы</button>
        {show && (
          <SpacesUpdate space={space} setShow={setShow} />
        )}
        </>
      )}
      <button onClick={() => navigate(`/spaces/${space.id}`)}>подробнее</button>
    </div>
  );
}

export default SpaceItems;
