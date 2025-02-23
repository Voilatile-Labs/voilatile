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
  onSuccess: (data: any, hash: string) => void;
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
      onSuccess(data, txHash as string);
    }
  }, [isReceiptSuccess, onSuccess, data, txHash]);

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
      <DialogContent className="sm:max-w-[425px] rounded-2xl sm:rounded-2xl p-4">
        <DialogHeader>
          <DialogTitle className="text-left text-gray-900">
            {data?.title}
          </DialogTitle>
          <DialogDescription className="text-left text-gray-500">
            {data?.description}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-2 mt-4">
          <Button
            onClick={handleConfirm}
            disabled={isReceiptLoading}
            className="w-full rounded-xl bg-[#efe3ff] text-gray-900 hover:bg-[#e2d1fc]"
          >
            {isReceiptLoading ? (
              <div className="h-4 w-4 animate-spin rounded-full border border-current border-t-transparent" />
            ) : (
              "Confirm"
            )}
          </Button>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isReceiptLoading}
            className="w-full rounded-xl"
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionModal;
