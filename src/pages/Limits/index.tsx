import { useCallback, useEffect, useState, VFC } from 'react';
import BigNumber from 'bignumber.js';

import { vesting } from '@/api';
import { Button, CircleProgress, DefaultInput, Selector } from '@/components';
import { useWalletContext } from '@/context';
import { useMst } from '@/store';
import { TListOfSingleLimits } from '@/store/Models/Limits';
import { TSaleType, TSelectorOption } from '@/types';
import { formatNumber } from '@/utils';

import s from './styles.module.scss';

const selectorOptions: TSelectorOption[] = [
  {
    name: 'Public sale',
    id: 1,
  },
  {
    name: 'Team',
    id: 2,
  },
  {
    name: 'Promotes',
    id: 3,
  },
  {
    name: 'Advisor',
    id: 4,
  },
  {
    name: 'Airdrop',
    id: 5,
  },
];

const getRequiredTypeValue = (section: TListOfSingleLimits, field: TSaleType) => {
  const obj = section.find((o) => o.saleType === field);
  return obj?.sum || '';
};

const Limits: VFC = () => {
  const { limits, user } = useMst();
  const [currentType, setCurrentType] = useState<TSelectorOption>({ name: 'Public sale', id: 1 });
  const [isSending, setIsSending] = useState<boolean>(false);
  const { fetchUserData } = useWalletContext();
  const { openModal } = useMst().modal;
  const [newLimit, setNewLimit] = useState<string>(
    getRequiredTypeValue(limits.limitsByTypes, currentType.name),
  );

  const setLimitHandler = useCallback((val: string) => {
    setNewLimit(val);
  }, []);

  const onOptionClick = useCallback((type: TSelectorOption) => {
    setCurrentType(type);
  }, []);

  useEffect(() => {
    setNewLimit(getRequiredTypeValue(limits.limitsByTypes, currentType.name));
  }, [currentType, limits.limitsByTypes]);

  const onSaveClick = useCallback(async () => {
    setIsSending(true);
    const prevLimit = getRequiredTypeValue(limits.limitsByTypes, currentType.name);
    const newLimitObj = { sale_type: currentType.name, limit: newLimit };
    const res = await vesting[+prevLimit ? 'editLimits' : 'initLimits'](newLimitObj);
    if (res.status === 201 || res.status === 200) {
      openModal('success', `Limit for ${currentType.name} has been set successfully`);
      fetchUserData(user.address, user.isOwner);
    } else {
      openModal('error', `Server error`);
    }
    setIsSending(false);
  }, [
    currentType.name,
    fetchUserData,
    limits.limitsByTypes,
    newLimit,
    openModal,
    user.address,
    user.isOwner,
  ]);

  return (
    <section className={s.limits}>
      <Selector options={selectorOptions} value={currentType} setValue={onOptionClick} />
      <div className={s.left}>
        <p className={s.leftTitle}>Tokens left to mint in RYLT</p>
        <p className={s.leftAmount}>
          {formatNumber(
            new BigNumber(newLimit)
              .minus(getRequiredTypeValue(limits.claimedByTypes, currentType.name))
              .toString(),
            'compact',
          )}
        </p>
      </div>
      <section className={s.limitsMain}>
        <div className={s.pie}>
          <span>Minted/Reserved</span>
          <CircleProgress
            percentage={
              +getRequiredTypeValue(limits.claimedByTypes, currentType.name) /
              +getRequiredTypeValue(limits.reservedByTypes, currentType.name)
            }
            color="#DB0382"
          />
        </div>
        <div className={s.inputs}>
          <DefaultInput
            value={formatNumber(
              new BigNumber(
                getRequiredTypeValue(limits.claimedByTypes, currentType.name),
              ).toString(),
              'compact',
            )}
            setValue={() => {}}
            name="minted"
            label="Minted"
            className={s.input}
          />
          <DefaultInput
            value={formatNumber(
              new BigNumber(
                getRequiredTypeValue(limits.reservedByTypes, currentType.name),
              ).toString(),
              'compact',
            )}
            setValue={() => {}}
            name="reserved"
            label="Reserved"
            className={s.input}
          />
          <DefaultInput
            value={newLimit}
            setValue={setLimitHandler}
            name="limits"
            label="Limits"
            editable
            numeric
            className={s.input}
          />
          <Button
            disabled={
              new BigNumber(getRequiredTypeValue(limits.reservedByTypes, currentType.name)).gte(
                new BigNumber(newLimit),
              ) ||
              newLimit === getRequiredTypeValue(limits.limitsByTypes, currentType.name) ||
              isSending
            }
            className={s.save}
            color="filled"
            onClick={onSaveClick}
            isLoading={isSending}
          >
            Save
          </Button>
        </div>
      </section>
    </section>
  );
};
export default Limits;
