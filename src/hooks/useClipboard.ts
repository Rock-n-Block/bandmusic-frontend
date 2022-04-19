import { useCallback, useEffect, useState } from 'react';

export enum ClipStatus {
  'inactive',
  'copied',
  'failed',
}

const useClipboard = (text: string, notifyTimeout = 5000): [ClipStatus, () => void] => {
  const [copyStatus, setCopyStatus] = useState(ClipStatus.inactive);
  const copy = useCallback(() => {
    navigator.clipboard.writeText(text).then(
      () => setCopyStatus(ClipStatus.copied),
      () => setCopyStatus(ClipStatus.failed),
    );
  }, [text]);

  useEffect(() => {
    switch (copyStatus) {
      case ClipStatus.copied: {
        console.log('success');
        break;
      }
      case ClipStatus.failed: {
        console.log('error');
        break;
      }
      default: {
        break;
      }
    }
  }, [copyStatus]);

  useEffect(() => {
    if (copyStatus === ClipStatus.inactive) {
      return;
    }

    const timeoutId = setTimeout(() => setCopyStatus(ClipStatus.inactive), notifyTimeout);

    // eslint-disable-next-line consistent-return
    return () => {
      clearTimeout(timeoutId);
    };
  }, [copyStatus, notifyTimeout]);

  return [copyStatus, copy];
};

export default useClipboard;