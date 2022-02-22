import { FC, useCallback, useEffect, useRef, useState } from 'react';
import BigNumber from 'bignumber.js';
import { observer } from 'mobx-react-lite';

import vesting, { TUpdateStatusData } from '@/api/vesting';
import { Button } from '@/components';
import { Timer } from '@/containers';
import { useContractContext, useWalletContext } from '@/context';
import { useMst } from '@/store';
import { SingleClaim } from '@/store/Models/Claimer';
import { formatNumber } from '@/utils';

import s from './Vesting.module.scss';

const Vesting: FC = observer(() => {
  const { waiting, confirmed, pending } = useMst().claimerInfo;
  const { balance, address, isOwner } = useMst().user;
  const { openModal } = useMst().modal;
  const { claimTokens, getBalance } = useContractContext();
  const { fetchUserData } = useWalletContext();
  const [canClaim, setCanClaim] = useState<SingleClaim[]>([]);
  const [inProcess, setInProcess] = useState<string[]>([]);
  const [isClaimAllActive, setIsClaimAllActive] = useState(canClaim.length !== 0);
  const timer = useRef<NodeJS.Timer | null>(null);

  useEffect(() => {
    setIsClaimAllActive(canClaim.length >= 2);
  }, [canClaim.length]);

  const reFetch = useCallback(async () => {
    await fetchUserData(address, isOwner);
  }, [address, fetchUserData, isOwner]);

  useEffect(() => {
    if (!timer.current) {
      timer.current = setInterval(() => {
        reFetch();
      }, 15000);
    }
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [reFetch]);

  const claimEvent = useCallback(
    async (amount: string[], timestamp: string[], signature: string[], idx: string[]) => {
      const newProcesses = [...inProcess, ...idx];
      setInProcess(newProcesses);
      const removedProcesses = newProcesses.filter((p) => !idx.includes(p));
      const canClaimUpdated = canClaim.filter(
        (c) => newProcesses.findIndex((p) => c.idx === p) === -1,
      );
      try {
        const transaction = await claimTokens(amount, timestamp, signature, address);
        if (transaction.events) {
          const data = amount.map<TUpdateStatusData>((a, key) => ({
            wallet_address: address,
            token_amount: new BigNumber(a).toNumber(),
            claimed_at: new BigNumber(timestamp[key]).toNumber(),
            tx_hash: transaction.transactionHash,
          }));
          openModal('success', 'RYLT is credited to your wallet');
          await vesting.update_status(data);
          await getBalance(address, isOwner);
          await fetchUserData(address, isOwner);
        }
        setInProcess(removedProcesses);
        setCanClaim(canClaimUpdated);
        return true;
      } catch (e) {
        openModal('error', 'Claiming error');
        setInProcess(removedProcesses);
        return false;
      }
    },
    [address, canClaim, claimTokens, fetchUserData, getBalance, inProcess, isOwner, openModal],
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

  const onTimerEnd = useCallback(
    (claim: SingleClaim) => {
      return () => {
        if (waiting.findIndex((w) => w.idx === claim.idx) !== -1) {
          setCanClaim((prev) => [...prev, claim]);
        }
      };
    },
    [waiting],
  );

  return (
    <div className={s.vesting_wrapper}>
      <div className={s.balance}>Your current balance:</div>

      <div className={s.count}>
        {formatNumber(new BigNumber(balance).toString(), 'compact')}
        <span>RYLT</span>
      </div>

      <div className={s.timer_tracking}>Timer Tracking</div>

      {isClaimAllActive && (
        <div className={s.claim}>
          <Button
            className={s.claim_all}
            onClick={onClaimAllClick}
            color="filled"
            isLoading={inProcess.length >= 2}
            disabled={inProcess.length !== 0}
          >
            Claim all
          </Button>
        </div>
      )}

      <div className={s.stages}>
        {confirmed.map((stage) => (
          <div key={stage.idx} className={s.stage}>
            <div className={s.stage_number}>{stage.stage} stage</div>
            <Timer deadline={stage.timestamp * 1000} onTimerEnd={onTimerEnd(stage)} />
            <Button size="sm" className={s.stage_btn} color="filled" disabled>
              Claimed
            </Button>
          </div>
        ))}
        {pending.map((stage) => (
          <div key={stage.idx} className={s.stage}>
            <div className={s.stage_number}>{stage.stage} stage</div>
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
        {waiting.map((stage) => (
          <div key={stage.idx} className={s.stage}>
            <div className={s.stage_number}>{stage.stage} stage</div>
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
