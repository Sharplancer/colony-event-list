import React, { useEffect, useRef } from "react";
import styles from './styles.module.css';
import { EVENT_TYPE } from '../../utils/contants';
import blockies from '../../utils/blockies';

const timeStamp2Date = (timeStamp: number) => {
  var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  let date = new Date(timeStamp);
  return `${date.getDate()} ${monthNames[date.getMonth()]}`
}

type Props = {
  eventType: string,
  time: number,
  values: {
    [key: string]: any
  },
};

const ItemComponent: React.FC<Props> = ({ eventType, time, values, ...props }) => {

  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    blockies.render({
      seed: values.userAddress,
      scale: 4.7,
    }, canvas);
  }, [values])

  return (
    <div className={styles.item}>
      <div className={styles.content}>
        <div className={styles.avatar}>
          <canvas ref={canvasRef} {...props}/>
        </div>
        <div className={styles.text}>
          {eventType === EVENT_TYPE.COLONY_INITIALIZED && <p>Congratulations! It's a beautiful baby colony!</p>}
          {eventType === EVENT_TYPE.COLONY_ROLE_SET && <p><strong>{values.role}</strong> role assigned to user <strong>{values.userAddress}</strong> in domain <strong>{values.domainId}</strong>.</p>}
          {eventType === EVENT_TYPE.PAYOUT_CLAIMED && <p>User <strong>{values.userAddress}</strong> claimed <strong>{values.amount}DAI</strong> payout from pot <strong>{values.fundingPotId}</strong>.</p>}
          {eventType === EVENT_TYPE.DOMAIN_ADDED && <p>Domain <strong>{values.domainId}</strong> added.</p>}
          <span>{timeStamp2Date(time)}</span>
        </div>
      </div>
    </div>
  );
}

export default ItemComponent;