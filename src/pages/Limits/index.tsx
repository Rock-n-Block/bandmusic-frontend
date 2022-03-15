import { useCallback, useEffect, useMemo, useState, VFC } from 'react';
import BigNumber from 'bignumber.js';

import { vesting } from '@/api';
import { Button, CircleProgress, DefaultInput, Selector } from '@/components';
import { useContractContext, useWalletContext } from '@/context';
import { useMst } from '@/store';
import { TListOfSingleLimits } from '@/store/Models/Limits';
import { TSaleType, TSelectorOption } from '@/types';
import { formatNumber, normalizedValue } from '@/utils';

import s from './styles.module.scss';

const mintedDates = {
  'Public sale': new Date(2023, 11, 31).getTime(),
  'Airdrop': new Date(2023, 11, 31).getTime(),
  'Team': new Date(2024, 11, 31).getTime(),
  'Promotes': new Date(2024, 11, 31).getTime(),
  'Advisor': new Date(2024, 11, 31).getTime(),
};

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
  return normalizedValue(obj?.sum || '0').toString();
};

const Limits: VFC = () => {
  const { limits, user } = useMst();
  const [currentType, setCurrentType] = useState<TSelectorOption>({ name: 'Public sale', id: 1 });
  const [isSending, setIsSending] = useState<boolean>(false);
  const { fetchUserData } = useWalletContext();
  const { mintRest } = useContractContext();
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

  const leftToMint = useMemo(
    () =>
      new BigNumber(newLimit)
        .minus(getRequiredTypeValue(limits.claimedByTypes, currentType.name))
        .toString(),
    [currentType.name, limits.claimedByTypes, newLimit],
  );

  const onMintTheRestClick = useCallback(async () => {
    try {
      await mintRest(
        new BigNumber(user.balance).gte(leftToMint) ? leftToMint : user.balance,
        user.address,
      );
      openModal('success', 'Minted successfully');
    } catch (e) {
      openModal('error', 'Internal error');
    }
  }, [leftToMint, mintRest, openModal, user.address, user.balance]);

  return (
    <section className={s.limits}>
      <Selector options={selectorOptions} value={currentType} setValue={onOptionClick} />
      <div className={s.left}>
        <p className={s.leftTitle}>Tokens left to mint in RYLT</p>
        <p className={s.leftAmount}>{formatNumber(leftToMint, 'compact')}</p>
        <Button
          color="filled"
          disabled={mintedDates[currentType.name] >= Date.now() || +leftToMint === 0}
          className={s.leftMint}
          onClick={onMintTheRestClick}
        >
          Mint the rest
        </Button>
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
              isSending ||
              newLimit.length === 0
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
