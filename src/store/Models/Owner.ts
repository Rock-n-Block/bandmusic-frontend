import { types } from 'mobx-state-tree';
import { Instance } from 'mobx-state-tree/dist/internal';

const FileLine = types.model({
  address: types.string,
  timestamp: types.number,
  amount: types.string,
  saleType: types.string,
  idx: types.string,
});

export type TFileLine = Instance<typeof FileLine>;

const FileType = types.model({
  name: types.string,
  content: types.array(FileLine),
});

export type TCurrentFile = Instance<typeof FileType>;

const LoadedType = types.array(FileLine);
export type TLoaded = Instance<typeof LoadedType>;

const OwnerInfo = types
  .model({
    currentFiles: FileType,
    loadedFiles: LoadedType,
  })
  .actions((self) => ({
    setCurrentFiles: (currentFiles: TCurrentFile) => {
      self.currentFiles = currentFiles;
    },
    setLoadedFiles: (loadedFiles: TLoaded) => {
      self.loadedFiles = loadedFiles;
    },
  }));

export default OwnerInfo;
