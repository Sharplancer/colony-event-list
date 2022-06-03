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
  console.log(count);
  const events = useSelector((state: RootState) => state.events.events);
  const [pageIndex, setPageIndex] = useState<number>(0);
  const [itemCount, setItemCount] = useState<number>(Math.floor((window.innerHeight - 100) / 90 + 2));


  useEffect(() => {
    dispatch(getEvents(pageIndex, itemCount));
  }, [dispatch, pageIndex]);

  const handleInfiniteScroll = () => {
    setPageIndex(pageIndex + 1);
    console.log("pageIndex", pageIndex);
    }

  return (
    <InfiniteScroll
      className={styles.list}
      dataLength={events.length}
      next={handleInfiniteScroll}
      hasMore={true}
      loader={<LoadingSpin size={"32px"}/>}
      height={window.innerHeight - 100}
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