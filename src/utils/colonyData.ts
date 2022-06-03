import { ColonyRole, ColonyClient } from '@colony/colony-js';
import { getLogs } from '@colony/colony-js'
import { utils } from 'ethers';
import { getBlockTime } from '@colony/colony-js';
import { EVENT_TYPE } from './contants';
import getColonyClient, { provider } from './colonyClient';
import Event from '../types/Event'

let inited: boolean = false;
let count: number = 0;
let colonyClient: ColonyClient;
let events: Event[] = [];
let eventLogs: any[] = [];

const initData = async () => {
  if(inited === true) return;
  inited = true;

  colonyClient = await getColonyClient();
  // Get the filter
  // There's a corresponding filter method for all event types
  let eventFilter = colonyClient.filters.ColonyInitialised(null, null);
  // Get the raw logs array
  eventLogs = await getLogs(colonyClient, eventFilter);

  eventFilter = colonyClient.filters.PayoutClaimed(null, null, null);  
  let newLogs = await getLogs(colonyClient, eventFilter);
  eventLogs = eventLogs.concat(newLogs);
  
  eventFilter = colonyClient.filters.DomainAdded(null);  
  newLogs = await getLogs(colonyClient, eventFilter);
  eventLogs = eventLogs.concat(newLogs);


//  This object includes a mapping of role ids to names
//  console.log(ColonyRole, eventLogs.length);

  count = eventLogs.length;
  eventLogs.sort((a, b) => { return b.blockNumber - a.blockNumber} );

  console.log("count", count, eventLogs);
}

export const getData = async (pageIndex: number, itemCount: number) => {

  console.log("pageIndex, itemCount", pageIndex, itemCount);

  await initData();

  for(let i = pageIndex * itemCount; i < ((pageIndex + 1) * itemCount > count ? count : (pageIndex + 1) * itemCount) ; i++) {
    const eventLog = eventLogs[i];

    const singleLog = colonyClient.interface.parseLog(eventLog);

    // Use the blockHash to look up the actual time of the block that mined the transactions of the current event
    const logTime = await getBlockTime(provider, <string>eventLog.blockHash);

    let singleData: Event = { eventType: singleLog.name, logTime, values: {} };    

    if (singleLog.name === EVENT_TYPE.DOMAIN_ADDED) {
      const humanReadableDomainId = new utils.BigNumber(
        singleLog.values.domainId
      ).toString();

      singleData.values.domainId = humanReadableDomainId;
    } else if (singleLog.name === EVENT_TYPE.PAYOUT_CLAIMED) {
      const humanReadableFundingPotId = new utils.BigNumber(
        singleLog.values.fundingPotId
      ).toString();

      singleData.values.fundingPotId = humanReadableFundingPotId;

      const {
        associatedTypeId,
      } = await colonyClient.getFundingPot(humanReadableFundingPotId);

      const { recipient: userAddress } = await colonyClient.getPayment(associatedTypeId);

      singleData.values.userAddress = userAddress;
  
      // Create a new BigNumber instance from the hex string amount in the parsed log
      const humanReadableAmount = new utils.BigNumber(singleLog.values.amount);

      // Get a base 10 value as a BigNumber instance
      const wei = new utils.BigNumber(10);

      // The converted amount is the human readable amount divided by the wei value raised to the power of 18
      const convertedAmount = humanReadableAmount.div(wei.pow(18));

      // If you are confident that it's a low enough value, you can display it as an integer -- .toNumber()
      // But to be on the safe side, you can also use it as a string
      singleData.values.amount = convertedAmount.toString();
      // console.log(singleData);
    }
    events.push(singleData);
  }

  return { count, events: events.slice(pageIndex * itemCount, (pageIndex + 1) * itemCount) };
}
