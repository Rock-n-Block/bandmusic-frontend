import { FormEvent, useCallback, useEffect, useRef, useState, VFC } from 'react';
import cn from 'classnames';
import { observer } from 'mobx-react-lite';
import { cast } from 'mobx-state-tree';

import vesting from '@/api/vesting';
import { ReactComponent as DeleteSVG } from '@/assets/img/icons/closeLight.svg';
import { ReactComponent as UploadSVG } from '@/assets/img/icons/upload.svg';
import { AdminTable, Button } from '@/components';
import { useWalletContext } from '@/context';
import { useMst } from '@/store';
import { TCurrentFile, TLoaded } from '@/store/Models/Owner';
import { generateCSV, parseCSV } from '@/utils';

import s from './styles.module.scss';

const getState = (file: File | null, currentFiles: TCurrentFile, loadedFiles: TLoaded) => {
  if (file && !currentFiles.content.length) {
    return 2;
  }
  if ((file && currentFiles.content.length > 0) || loadedFiles.length > 0) {
    return 3;
  }
  return 1;
};

const getTitle = (state: number) => {
  switch (state) {
    case 3: {
      return 'LIST OF VESTED WALLETS';
    }
    case 2: {
      return 'PLEASE UPLOAD THE LIST OF VESTED WALLETS';
    }
    default: {
      return 'PLEASE UPLOAD THE LIST OF VESTED WALLETS';
    }
  }
};

const getBottomButtonText = (state: number) => {
  switch (state) {
    case 3: {
      return 'Send';
    }
    case 2: {
      return 'Proceed';
    }
    default: {
      return 'Sample file';
    }
  }
};

const Admin: VFC = observer(() => {
  const { currentFiles, loadedFiles, setCurrentFiles } = useMst().ownerInfo;
  const { address, isOwner } = useMst().user;
  const { openModal } = useMst().modal;
  const { fetchUserData } = useWalletContext();
  const [csvFile, setCSVFile] = useState<File | null>(null);
  const [state, setState] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const FileInputRef = useRef<HTMLInputElement | null>(null);

  const onProceed = useCallback(async () => {
    setIsLoading(true);
    const fileReader = new FileReader();
    fileReader.onload = async function () {
      const readResult = fileReader.result as string;
      const csvData = readResult.split('\n');
      const { data, errs } = parseCSV(csvData);
      if (!data.length) {
        openModal(
          'error',
          `Uploaded file is incorrect. Please make sure it corresponds with the Sample file.`,
        );
      } else {
        if (errs.length) {
          openModal(
            'warning',
            `Some rows have been removed because of the incorrect data in one or several fields`,
          );
        }
        setCurrentFiles({ name: csvFile?.name || 'file', content: cast(data) });
      }
      setIsLoading(false);
    };
    if (csvFile) {
      fileReader.readAsText(csvFile);
    }
  }, [csvFile, openModal, setCurrentFiles]);

  const onSample = useCallback(() => {
    setCSVFile(generateCSV());
  }, []);

  const onFileLoad = useCallback((e: FormEvent<HTMLInputElement>) => {
    const file = e.currentTarget.files?.[0];
    if (file) {
      setCSVFile(file);
    }
  }, []);

  const onUploadClick = useCallback((e: FormEvent<HTMLInputElement | HTMLButtonElement>) => {
    if (FileInputRef.current) {
      FileInputRef.current.click();
    }
    e.stopPropagation();
  }, []);

  const onDelete = useCallback(
    (id: string) => {
      const newData = currentFiles && [...currentFiles.content];
      if (newData) {
        newData.splice(
          newData.findIndex((val) => val.idx === id),
          1,
        );
        if (!newData.length) {
          setState(1);
          setCSVFile(null);
          setCurrentFiles({ name: '', content: cast([]) });
        } else {
          setCurrentFiles({ name: currentFiles.name, content: cast(newData) });
        }
      }
    },
    [currentFiles, setCurrentFiles],
  );

  const onFileDelete = useCallback(
    (e: FormEvent<HTMLInputElement | HTMLButtonElement>) => {
      if (FileInputRef.current) {
        FileInputRef.current.value = '';
        setCurrentFiles({ name: '', content: cast([]) });
        setCSVFile(null);
      }
      e.stopPropagation();
    },
    [setCurrentFiles],
  );

  const onServerUpload = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await vesting.sendData(currentFiles.content);
      if (response.status === 201 || response.status === 200) {
        openModal('success', 'Your tokens have been successfully distributed');
        await fetchUserData(address, isOwner);
        setCurrentFiles({ name: '', content: cast([]) });
        setCSVFile(null);
      }
      setIsLoading(false);
    } catch (e) {
      openModal('error', 'Server error');
      setIsLoading(false);
    }
  }, [address, currentFiles.content, fetchUserData, isOwner, openModal, setCurrentFiles]);

  useEffect(() => {
    setState(getState(csvFile, currentFiles, loadedFiles));
  }, [csvFile, currentFiles, currentFiles.content.length, loadedFiles, loadedFiles.length]);

  const getBottomButtonHandler = useCallback(
    (currentState: number) => {
      switch (currentState) {
        case 3: {
          return onServerUpload;
        }
        case 2: {
          return onProceed;
        }
        default: {
          return onSample;
        }
      }
    },
    [onProceed, onSample, onServerUpload],
  );
  return (
    <section className={s.wrapper}>
      <h1 className={s.title}>{getTitle(state)}</h1>
      <input
        type="file"
        accept=".csv"
        ref={FileInputRef}
        className={s.hiddenInput}
        onChange={onFileLoad}
      />
      <Button
        className={cn(s.uploadBtn, { [s.uploaded]: csvFile?.name })}
        onClick={onUploadClick}
        disabled={isLoading}
      >
        <span className={s.uploadBtnText}>{csvFile?.name || 'Upload CSV file'}</span>
        <button
          className={s.uploadBtnIcon}
          type="button"
          onClick={!csvFile?.name ? onUploadClick : onFileDelete}
        >
          {!csvFile?.name ? <UploadSVG /> : <DeleteSVG />}
        </button>
      </Button>
      <div
        className={cn(s.tableContent, {
          [s.showTable]: (currentFiles.content.length > 0 || loadedFiles.length > 0) && s.showTable,
        })}
      >
        <AdminTable data={currentFiles.content} baseData={loadedFiles} onDelete={onDelete} />
      </div>
      <Button
        className={cn(s.eventBtn, { [s.enlarged]: state !== 1 })}
        onClick={getBottomButtonHandler(state)}
        color={state === 1 ? 'underline' : 'filled'}
        disabled={isLoading || (state === 3 && !currentFiles.content.length)}
        isLoading={isLoading}
      >
        {getBottomButtonText(state)}
      </Button>
    </section>
  );
});

export default Admin;
