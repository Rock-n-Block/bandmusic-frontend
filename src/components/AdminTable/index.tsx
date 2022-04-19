import { useCallback, useEffect, useState, VFC } from 'react';

import { ReactComponent as WarningSVG } from '@/assets/img/icons/warning.svg';
import { TFileLine } from '@/store/Models/Owner';
import { formatNumber } from '@/utils';

import s from './styles.module.scss';


interface ITable {
  data: TFileLine[];
  baseData: TFileLine[];
  onDelete: (key: string) => void;
}

const countOnPage = 6;
const maxPagin = 8;

const Table: VFC<ITable> = ({ data, baseData, onDelete }) => {
  const [mergedData, setMergedData] = useState([
    ...data.map((l) => ({ ...l, withButton: true })),
    ...baseData.map((l) => ({ ...l, withButton: false })),
  ]);
  const [currentPage, setCurrentPage] = useState(0);
  const [paginData, setPaginData] = useState(
    mergedData?.slice(currentPage, (currentPage + 1) * countOnPage),
  );

  useEffect(() => {
    if (data.length || baseData.length) {
      setMergedData([
        ...data.map((v) => ({ ...v, withButton: true })),
        ...baseData.map((l) => ({ ...l, withButton: false })),
      ]);
    }
  }, [data.length, baseData.length, data, baseData, baseData.length]);

  const onNextClick = useCallback(() => {
    if (mergedData) {
      if (currentPage + 1 < mergedData.length / countOnPage) {
        setCurrentPage(currentPage + 1);
      }
    }
  }, [currentPage, mergedData]);

  const onBtnClick = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const onPrevClick = useCallback(() => {
    if (currentPage - 1 >= 0) {
      setCurrentPage(currentPage - 1);
    }
  }, [currentPage]);

  useEffect(() => {
    setPaginData(mergedData?.slice(currentPage * countOnPage, (currentPage + 1) * countOnPage));
  }, [currentPage, mergedData]);
  return (
    <div className={`${s.wrapper} ${s.tableWrap}`}>
      <div className={s.scrollableTable}>
        <table className={s.table}>
          <thead>
            <tr>
              <td>Address</td>
              <td className={s.type}>Sale Type</td>
              <td>Date</td>
              <td>Amount</td>
              <td />
            </tr>
          </thead>
          <tbody>
            {paginData?.map((line) => (
              <tr key={line.idx}>
                <td className={s.address}>{line.address}</td>
                <td>{line.saleType}</td>
                <td>{new Date(new Date(line.timestamp).getTime() * 1000).toLocaleDateString()}</td>
                <td className={s.amount}>
                  {Number.isNaN(+formatNumber(line.amount.toString())) ? (
                    <WarningSVG />
                  ) : (
                    formatNumber(line.amount.toString())
                  )}
                </td>
                <td className={s.removeCell}>
                  {line.withButton && (
                    <button className={s.remove} type="button" onClick={() => onDelete(line.idx)}>
                      remove
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className={s.pagination}>
        <div className={s.paginator}>
          <button className={s.pagin} type="button" onClick={onPrevClick}>
            {' '}
            {'<'}{' '}
          </button>
          {mergedData &&
            Array(Math.ceil(mergedData.length / countOnPage))
              .fill(0)
              .map((page, key) => key)
              .splice(Math.floor(currentPage / (maxPagin - 1)) * (maxPagin - 1), maxPagin)
              .map((page) => (
                <button
                  key={page}
                  className={`${s.pagin} ${page === currentPage && s.active}`}
                  type="button"
                  onClick={() => onBtnClick(page)}
                >
                  {page + 1}
                </button>
              ))}
          {}
          <button className={s.pagin} type="button" onClick={onNextClick}>
            {' '}
            {'>'}{' '}
          </button>
        </div>
      </div>
      {baseData.length > 0 && (
        <div className={s.baseData}>
          <span className={s.baseDataWarning}>
            <WarningSVG />
          </span>
          Please note that this table also includes previously uploaded schedules
        </div>
      )}
    </div>
  );
};

export default Table;
