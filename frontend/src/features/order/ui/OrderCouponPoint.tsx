import { useEffect, useState } from "react";
import "./OrderCouponPint.css"
import { fetchUserPoints } from "../api/Order";
import { OrderCouponPointProps, UserPoint } from "../model/OrderModel";

const OrderCouponPoint: React.FC<OrderCouponPointProps> = ({userId, points, onPointsChange}) => {

  const [userPoint, setUserPoint] = useState<UserPoint>( {point: 0} );
  
  useEffect(() => {
    const getUserPoints = async() => {
      try{
        const data = await fetchUserPoints(userId);
        if (data && data.length > 0) {
          setUserPoint({ point: data[0].point });
        }
        console.log("포인트 가져오기 setPoint: ", data);
      } catch(err){
        console.error('사용자의 포인트를 가져오지 못했습니다.', err);
      }
    };
    getUserPoints();
  },[]);

  const [usedPoint, setUsedPoint] = useState<string>(points.toString());
  const [error, setError] = useState<string>("");
  
  useEffect(() => {
    setUsedPoint(points.toString());
  },[points]);

  const handlePointChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
  
    // 입력값을 숫자로 변환
    const newPoints = parseInt(value, 10);

   // 사용자가 입력을 지우면 빈 문자열 유지
    if (value === "") {
    setUsedPoint("");
    setError("");
    onPointsChange(0);
    return;
    }
    
    // 숫자가 아니면 변경하지 않음
    if (isNaN(newPoints)) return;
  
    // 입력값이 보유 포인트를 초과하면 최대 포인트로 설정
    if (newPoints > userPoint.point) {
      setError("보유한 포인트보다 많은 값을 입력할 수 없습니다.");
      setUsedPoint(value);
      onPointsChange(newPoints);

      setTimeout(() => {
        setUsedPoint(userPoint.point.toString());
        onPointsChange(userPoint.point);
      },500);
    } else {
      setError("");
      setUsedPoint(value);
      onPointsChange(newPoints);
    }
  };


  return (
    <div className="orderCouponPointContainer">
      <form className="couponContainer">
        <div className="selectCouponTitle">쿠폰 적용</div>
        <div className="selectCoupon">
            {/* <select name="status" value={formData.status} onChange={handleChange}>
              {status.map((status) => (
                <option key={status.status_code} value={status.description}>
                  {status.common_detail}
                </option>
              ))}
            </select> */}
            <select name="requestMessage" className="requestMessage">
              <option value="1" className="optionText">신규가입 할인 쿠폰</option>
            </select>
            <div className="couponText">신규 가입 10% 할인 쿠폰이 적용되었습니다.(-8,900원)</div>
        </div>
      </form>
      <form className="pointContainer">
        <div className="pointTitle">포인트 사용</div>
        <div className="pointBody">
          <div className="pointBodyTop">
            <input 
                  type="text" 
                  name='user_point'
                  placeholder='사용할 포인트'
                  value={usedPoint}
                  onChange={handlePointChange}
                  />
            <div className="remainPoint">보유: {userPoint.point} point</div>
          </div>
          {error && <div className="errorMessage">{error}</div>}
        </div>
      </form>
    </div>
  )
}

export default OrderCouponPoint;