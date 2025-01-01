"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { useEffect } from "react";
import { toast } from "@/hooks/use-toast";

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

  const {
    isLoading: isReceiptLoading,
    isSuccess: isReceiptSuccess,
    isError: isReceiptError,
  } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  useEffect(() => {
    if (isReceiptSuccess) {
      onSuccess();
    }
  }, [isReceiptSuccess, onSuccess]);

  useEffect(() => {
    if (isReceiptError) {
      toast({
        title: "Transaction Failed",
      });
      onClose();
    }
  }, [isReceiptError, onClose]);

  const handleConfirm = () => {
    writeContract(data.contract);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-left">{data?.title}</DialogTitle>
          <DialogDescription className="text-left">
            {data?.description}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3 mt-4">
          <Button
            onClick={handleConfirm}
            disabled={isReceiptLoading}
            className="w-full"
          >
            {isReceiptLoading ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            ) : (
              "Confirm"
            )}
          </Button>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isReceiptLoading}
            className="w-full"
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionModal;
