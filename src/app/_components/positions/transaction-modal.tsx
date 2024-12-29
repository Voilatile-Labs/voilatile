"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { useEffect } from "react";

interface TransactionModalProps {
  isOpen: boolean;
  data: any;
  onSuccess: () => void;
  onClose: (error?: any) => void;
}

const TransactionModal = ({
  isOpen,
  data,
  onSuccess,
  onClose,
}: TransactionModalProps) => {
  const { writeContract, data: txHash } = useWriteContract();

  const { isLoading: isReceiptLoading, isSuccess: isReceiptSuccess } =
    useWaitForTransactionReceipt({
      hash: txHash,
    });

  useEffect(() => {
    if (isReceiptSuccess) {
      onSuccess();
    }
  }, [isReceiptSuccess, onSuccess]);

  const handleConfirm = () => {
    writeContract(data.contract);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{data?.title}</DialogTitle>
          <DialogDescription>{data?.description}</DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex gap-3">
          <Button onClick={handleConfirm} disabled={isReceiptLoading}>
            {isReceiptLoading ? "Confirming..." : "Confirm"}
          </Button>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isReceiptLoading}
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionModal;
