import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import InfiniteScroll from "react-infinite-scroll-component";
import LoadingSpin from "react-loading-spin";

import { AppDispatch, RootState } from "../../store";
import { getEvents } from "../../store/event-slice";
import styles from './styles.module.css';
import ItemComponent from "../Item";


const ListComponent = () => {
  const dispatch = useDispatch<AppDispatch>();
  const count = useSelector((state: RootState) => state.events.count);
  const events = useSelector((state: RootState) => state.events.events);
  const itemCount = Math.floor((window.innerHeight - 100) / 30 + 2);
  const [pageIndex, setPageIndex] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(true);

  useEffect(() => {
    dispatch(getEvents(pageIndex, itemCount));
    if (count !== 0 && pageIndex * itemCount >= count)
      setHasMore(false);
  }, [dispatch, pageIndex, count, itemCount]);

  const handleInfiniteScroll = () => {
    setPageIndex(pageIndex + 1);
  }

  return (
    <InfiniteScroll
      className={styles.list}
      dataLength={events.length}
      next={handleInfiniteScroll}
      hasMore={hasMore}
      height={window.innerHeight - 100}
      loader={<div className={styles.loader}><LoadingSpin size={"32px"}/></div>}
    >
      {
        events?.map((data, index) => {
          return <ItemComponent key={index} eventType={data.eventType} time={data.logTime} values={data.values}/>
        })
      }
    </InfiniteScroll>
  );
}

export default ListComponent;