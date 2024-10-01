import axios, { AxiosProgressEvent } from "axios";

export interface ICSVFiles {
  fileName: string;
}

export interface IJoinDataReq {
  apiEndpoint: string;
  column: string;
  dataKey: string;
  file: string;
  newFileName: string;
}

interface IJoinDataResp {
  taskId: string;
}

interface ITaskStatusResp {
  status: string;
}

export enum CeleryTaskStatus {
  PENDING = 'PENDING',
  RECEIVED = 'RECEIVED',
  STARTED = 'STARTED',
  RETRY = 'RETRY',
  FAILURE = 'FAILURE',
  SUCCESS = 'SUCCESS',
  UNKNOWN = 'UNKNOWN',
}

function getCeleryTaskStatusByString(statusString: string): CeleryTaskStatus {
  const foundStatus = Object.values(CeleryTaskStatus).find(status => status === statusString);
  return foundStatus || CeleryTaskStatus.UNKNOWN;
}

type CSVDataTypes = string | number | boolean | Array<string> | Array<number> | null | undefined;
type Rows = { index: number, [key: string]: CSVDataTypes }[];

export interface IFileResponse {
  totalRows: number;
  rows: Rows;
}

export async function joinData(details: IJoinDataReq) {
  const resp = await axios.post('/api/csv-files/join/', details);
  return (resp.data as IJoinDataResp).taskId;
}

export const KNOWN_STATUSES = ["PENDING", "SUCCESS", "FAILURE", "REVOKED"]

export async function checkJoinStatus(id: string) {
  const resp = await axios.post(`/api/csv-files/task/`, {taskId: id});
  const status= (resp.data as ITaskStatusResp).status;
  return getCeleryTaskStatusByString(status);
}

export async function uploadFile(fileData: FormData, onUploadProgress: (e: AxiosProgressEvent) => void) {
  await axios.post('/api/csv-files/', fileData, {
    onUploadProgress
  })
}

export async function fetchFiles() {
  const resp = await axios.get('/api/csv-files/');
  return resp.data as ICSVFiles[];
}

export async function deleteFile(file: string) {
  await axios.delete(`/api/csv-files/${file}/`);
}

export async function fetchFile(file: string, rowsPerPage: number, offset: number) {
  const resp = await axios.get(`/api/csv-files/${file}/?chunk_size=${rowsPerPage}&offset=${offset}`);
  return resp.data as IFileResponse;
}
