import { FC, useCallback, useEffect, useState } from 'react';
import BigNumber from 'bignumber.js';
import { toJS } from 'mobx';
import { observer } from 'mobx-react-lite';

import vesting, { TUpdateStatusData } from '@/api/vesting';
import { Button } from '@/components';
import { Timer } from '@/containers';
import { useContractContext, useWalletContext } from '@/context';
import { useMst } from '@/store';
import { SingleClaim } from '@/store/Models/Claimer';

import s from './Vesting.module.scss';

const Vesting: FC = observer(() => {
  const { waiting, confirmed, pending } = useMst().claimerInfo;
  const { balance, address, isOwner } = useMst().user;
  const { openModal } = useMst().modal;
  const { claimTokens } = useContractContext();
  const { fetchUserData } = useWalletContext();
  const [canClaim, setCanClaim] = useState<SingleClaim[]>([]);
  const [inProcess, setInProcess] = useState<string[]>([]);
  const [isClaimAllActive, setIsClaimAllActive] = useState(canClaim.length !== 0);

  useEffect(() => {
    setIsClaimAllActive(waiting.length !== 0);
  }, [waiting.length]);

  const claimEvent = useCallback(
    async (amount: string[], timestamp: string[], signature: string[], idx: string[]) => {
      setInProcess((prev) => [...prev, ...idx]);
      const removedProcesses = inProcess.filter((p) => !idx.includes(p));
      try {
        const transaction = await claimTokens(amount, timestamp, signature, address);
        if ('TokensClaimed' in transaction.events) {
          const data = amount.map<TUpdateStatusData>((a, key) => ({
            wallet_address: address,
            token_amount: new BigNumber(a).toNumber(),
            claimed_at: new BigNumber(timestamp[key]).toNumber(),
            tx_hash: transaction.transactionHash,
          }));
          openModal('success', 'RYLT is credited to your wallet');
          await fetchUserData(address, isOwner);
          await vesting.update_status(data);
        }
        setInProcess(removedProcesses);
        return true;
      } catch (e) {
        openModal('error', 'Claiming error');
        setInProcess(removedProcesses);
        return false;
      }
    },
    [address, claimTokens, fetchUserData, inProcess, isOwner, openModal],
  );

  const isDisabled = useCallback(
    (stage: SingleClaim) => {
      return canClaim.findIndex((can) => can.idx === stage.idx) === -1;
    },
    [canClaim],
  );

  const checkProcess = useCallback(
    (idx: string) => {
      return inProcess.includes(idx);
    },
    [inProcess],
  );

  const onClaimClick = useCallback(
    (amount: string, timestamp: string, signature: string, idx: string) => {
      return async () => {
        await claimEvent([amount], [timestamp], [signature], [idx]);
      };
    },
    [claimEvent],
  );

  const onClaimAllClick = useCallback(async () => {
    const amounts = canClaim.map((claim) => claim.amount);
    const timestamps = canClaim.map((claim) => String(claim.timestamp));
    const signatures = canClaim.map((claim) => claim.signature);
    const idxs = canClaim.map((claim) => claim.idx);

    await claimEvent(amounts, timestamps, signatures, idxs);
  }, [canClaim, claimEvent]);

  const onTimerEnd = useCallback((claim: SingleClaim) => {
    return () => {
      setCanClaim((prev) => [...prev, claim]);
    };
  }, []);

  return (
    <div className={s.vesting_wrapper}>
      <div className={s.count}>
        {new BigNumber(balance).toFixed(4)}
        <span>RYLT</span>
      </div>

      <div className={s.timer_tracking}>Timer Tracking</div>

      {isClaimAllActive && (
        <div className={s.claim}>
          <Button className={s.claim_all} onClick={onClaimAllClick} color="filled">
            Claim all
          </Button>
        </div>
      )}

      <div className={s.stages}>
        {confirmed.map((stage, key) => (
          <div key={stage.idx} className={s.stage}>
            <div className={s.stage_number}>{key + 1} stage</div>
            <Timer deadline={stage.timestamp * 1000} onTimerEnd={onTimerEnd(stage)} />
            <Button size="sm" className={s.stage_btn} color="filled" disabled>
              Claimed
            </Button>
          </div>
        ))}
        {pending.map((stage, key) => (
          <div key={stage.idx} className={s.stage}>
            <div className={s.stage_number}>{key + confirmed.length + 1} stage</div>
            <Timer
              className={s.stage_timer}
              deadline={stage.timestamp * 1000}
              onTimerEnd={onTimerEnd(stage)}
            />
            <Button size="sm" className={s.stage_btn} color="filled" disabled isLoading>
              Claimed
            </Button>
          </div>
        ))}
        {waiting.map((stage, key) => (
          <div key={stage.idx} className={s.stage}>
            <div className={s.stage_number}>
              {key + confirmed.length + pending.length + 1} stage
            </div>
            <Timer deadline={stage.timestamp * 1000} onTimerEnd={onTimerEnd(stage)} />
            <Button
              size="sm"
              className={s.stage_btn}
              color="filled"
              isLoading={checkProcess(stage.idx)}
              disabled={isDisabled(stage) || checkProcess(stage.idx)}
              onClick={onClaimClick(
                stage.amount,
                String(stage.timestamp),
                stage.signature,
                stage.idx,
              )}
            >
              Claim
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
});

export default Vesting;
