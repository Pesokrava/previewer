import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  LinearProgress,
  Stack,
} from "@mui/material";
import { useEffect, useState } from "react";

import {
  CeleryTaskStatus,
  checkJoinStatus,
  IJoinDataReq,
  joinData,
} from "../connectors";
import ExtentionSummary from "./summary";

interface IExtendDialogProps {
  reqBody: IJoinDataReq;
  open: boolean;
  closeDialog: () => void;
}

const FAIL_STATUSES = [CeleryTaskStatus.FAILURE, CeleryTaskStatus.UNKNOWN];
const DONE_STATUSES = [CeleryTaskStatus.SUCCESS, ...FAIL_STATUSES];

export default function ExtendDialog({
  reqBody,
  open,
  closeDialog,
}: IExtendDialogProps) {
  // submitting state
  const [submitted, setSubmitted] = useState(false);
  const [doSubmit, setDoSubmit] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // task checking state
  const [taskId, setTaskId] = useState('');
  const [status, setStatus] = useState<CeleryTaskStatus | null>(null);
  const [doCheck, setDoCheck] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [taskError, setTaskError] = useState('');

  // done state
  const [done, setDone] = useState(false);

  useEffect(() => {
    const joinFiles = async () => {
      setDoSubmit(false);
      setIsSubmitting(true);
      try {
        const taskId = await joinData(reqBody);
        setTaskId(taskId);
        setDoCheck(true);
        setSubmitError('');
        setSubmitted(true);
      } catch {
        setSubmitError("Failed to submit join task");
        setSubmitted(false);
      } finally {
        setIsSubmitting(false);
      }
    };

    if (doSubmit) {
      joinFiles();
    }
  }, [reqBody, doSubmit, setDoCheck, setTaskId]);

  useEffect(() => {
    const checkTaskStatus = async () => {
      setIsChecking(true);
      setDoCheck(false);
      try {
        const status = await checkJoinStatus(taskId);
        setStatus(status);
        setTaskError('');
        if (DONE_STATUSES.includes(status)) {
          setDone(true);
        }
      } catch {
        setTaskError("Failed to check the task status");
      } finally {
        setIsChecking(false);
      }
    };

    if (taskId && doCheck) {
      checkTaskStatus();
    }
  }, [doCheck, setDoCheck, setIsChecking, setStatus, setTaskError, taskId]);

  const reset = () => {
    setSubmitted(false);
    setDoSubmit(false);
    setIsSubmitting(false);
    setSubmitError('');

    setStatus(null);
    setTaskId('');
    setDoCheck(false);
    setIsChecking(false);
    setTaskError('');
  };

  return (
    <Dialog open={open}>
      <DialogTitle>{`Extend file "${reqBody.file}.csv"`}</DialogTitle>
      {!submitted ? (
        <>
          {/* first stage submitting */}
          <DialogContent>
            {!submitError && !isSubmitting && (
              <Stack direction="column" spacing={1}>
                <Alert severity="info">Review extention</Alert>
                <ExtentionSummary {...reqBody} />
              </Stack>
            )}

            {isSubmitting && (
              <LinearProgress variant="indeterminate" />
            )}

            {submitError && !isSubmitting && (
              <Alert severity="error">{submitError}</Alert>
            )}
          </DialogContent>
          <DialogActions>
            <Button
              disabled={isSubmitting}
              onClick={() => setDoSubmit(true)}
            >
              {isSubmitting ? "Submitting..." : !submitError ? "Submit": "Retry"}
            </Button>

            {!isSubmitting && (
              <Button
                onClick={() => {
                  reset();
                  closeDialog();
                }}
              >
                Close
              </Button>
            )}
          </DialogActions>
        </>
      ) : (
        <>
          {/* second stage task checking */}
          <DialogContent>
            {!done && !isChecking && (
              <Alert severity="info">{`Task status: ${status ? status.toString(): CeleryTaskStatus.UNKNOWN.toString()}`}</Alert>
            )}

            {isChecking && <LinearProgress variant="indeterminate" />}

            {taskError && !isChecking && (
              <Alert severity="error">{taskError}</Alert>
            )}

            {done && (
              <Alert severity={FAIL_STATUSES.includes(status) ? "error": "success"}>{`Task finished with status: ${status.toString()}`}</Alert>
            )}
          </DialogContent>
          <DialogActions>
            <Button
              disabled={isChecking}
              onClick={() => setDoCheck(true)}
            >
              {isChecking ? "Checking..." : "Check"}
            </Button>
            {done && (
              <Button
                onClick={() => {
                  window.location.reload();
                }}
              >
                Close
              </Button>
            )}
          </DialogActions>
        </>
      )}
    </Dialog>
  );
}
