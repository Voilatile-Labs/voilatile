"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { data as Tokens, Token } from "@/constants/token";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import Image from "next/image";
import Fuse from "fuse.js";
import { useState } from "react";

interface SelectTokenModalProps {
  isOpen: boolean;
  onOpenModal: (open: boolean) => void;
  onConfirm?: (token: Token) => void;
}

const SelectTokenModal = ({
  isOpen,
  onOpenModal,
  onConfirm,
}: SelectTokenModalProps) => {
  const fuse = new Fuse(Tokens, {
    keys: ["name", "symbol", "address"],
    threshold: 0.3,
  });

  const [search, setSearch] = useState("");

  const filteredTokens = search
    ? fuse.search(search).map((result) => result.item)
    : Tokens;

  const onSelectToken = (token: Token) => {
    if (onConfirm) {
      onConfirm(token);
    }
    onOpenModal(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenModal}>
      {isOpen && (
        <DialogContent
          className={cn(
            "w-[96%] sm:max-w-[400px] rounded-2xl sm:rounded-2xl p-0 py-4 bg-white"
          )}
        >
          <DialogHeader>
            <DialogTitle className="text-base font-normal px-4 text-gray-900">
              Select a token
            </DialogTitle>
          </DialogHeader>

          <div className="relative flex-1 w-full px-4">
            <div className="absolute inset-y-0 left-0 pl-7 flex items-center pointer-events-none">
              <Search className="h-4 w-4" />
            </div>
            <Input
              type="text"
              placeholder="Search tokens"
              className="pl-10 w-full rounded-full placeholder:text-gray-300 bg-white "
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex flex-col overflow-y-auto max-h-[500px] h-fit">
            {filteredTokens.length > 0 ? (
              filteredTokens.map((token, index) => (
                <div
                  key={"token:" + index}
                  className="flex items-center gap-3 py-3 px-4 hover:bg-[#efe3ff] cursor-pointer"
                  onClick={() => {
                    onSelectToken(token);
                  }}
                >
                  <Image
                    src={token.image}
                    alt={token.name}
                    width={36}
                    height={36}
                    className="rounded-full"
                  />
                  <div>
                    <div className="font-medium text-gray-900">
                      {token.name}
                    </div>
                    <div className="text-sm text-gray-500">{token.symbol}</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-gray-500 py-5">No tokens found</div>
              </div>
            )}
          </div>
        </DialogContent>
      )}
    </Dialog>
  );
};

SelectTokenModal.displayName = "SelectTokenModal";

export default SelectTokenModal;
