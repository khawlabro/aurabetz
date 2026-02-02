import { Button } from "@/components/ui/button";
import { X, Copy, Check } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface MembershipUnlockModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MembershipUnlockModal({ isOpen, onClose }: MembershipUnlockModalProps) {
  const [copiedCashApp, setCopiedCashApp] = useState(false);
  const [copiedVenmo, setCopiedVenmo] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  const handleCopyCashApp = () => {
    navigator.clipboard.writeText("$aurabetz");
    setCopiedCashApp(true);
    setTimeout(() => setCopiedCashApp(false), 2000);
  };

  const handleCopyVenmo = () => {
    navigator.clipboard.writeText("@aurabetz");
    setCopiedVenmo(true);
    setTimeout(() => setCopiedVenmo(false), 2000);
  };

  // Handle click outside modal to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div
        ref={modalRef}
        className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-xl border border-gray-800 max-w-md w-full shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
      >
        {/* Header - Sticky */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800 flex-shrink-0">
          <h2 className="text-2xl font-bold text-white">Unlock Premium Picks</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-800 rounded-lg transition-colors flex-shrink-0"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1 p-6 space-y-6">
          {/* Pricing Info */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-white">Membership Plans</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                <div>
                  <p className="text-white font-medium">First Week</p>
                  <p className="text-sm text-gray-400">Full access to all picks</p>
                </div>
                <p className="text-orange-500 font-bold text-lg">$5</p>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                <div>
                  <p className="text-white font-medium">Monthly</p>
                  <p className="text-sm text-gray-400">Renews after first week</p>
                </div>
                <p className="text-orange-500 font-bold text-lg">$30</p>
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-white">Send Payment To:</h3>

            {/* CashApp */}
            <div className="p-4 bg-gradient-to-r from-gray-800/50 to-gray-900/50 rounded-lg border border-gray-700 hover:border-orange-600/50 transition-colors">
              <p className="text-sm text-gray-400 mb-2">CashApp</p>
              <div className="flex items-center justify-between gap-2">
                <code className="text-white font-mono font-bold text-lg">$aurabetz</code>
                <button
                  onClick={handleCopyCashApp}
                  className="p-2 hover:bg-gray-700 rounded-lg transition-colors flex-shrink-0"
                >
                  {copiedCashApp ? (
                    <Check className="w-5 h-5 text-green-500" />
                  ) : (
                    <Copy className="w-5 h-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            {/* Venmo */}
            <div className="p-4 bg-gradient-to-r from-gray-800/50 to-gray-900/50 rounded-lg border border-gray-700 hover:border-orange-600/50 transition-colors">
              <p className="text-sm text-gray-400 mb-2">Venmo</p>
              <div className="flex items-center justify-between gap-2">
                <code className="text-white font-mono font-bold text-lg">@aurabetz</code>
                <button
                  onClick={handleCopyVenmo}
                  className="p-2 hover:bg-gray-700 rounded-lg transition-colors flex-shrink-0"
                >
                  {copiedVenmo ? (
                    <Check className="w-5 h-5 text-green-500" />
                  ) : (
                    <Copy className="w-5 h-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            {/* Crypto */}
            <div className="p-4 bg-gradient-to-r from-gray-800/50 to-gray-900/50 rounded-lg border border-gray-700">
              <p className="text-sm text-gray-400 mb-2">Crypto</p>
              <p className="text-white font-mono text-sm">Contact support for crypto payments</p>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-blue-900/20 border border-blue-800/50 rounded-lg p-4">
            <p className="text-sm text-blue-200">
              💡 After sending $5 USD, you'll have access to all premium picks for 7 days. Membership renews at $30/month. Message us on CashApp/Venmo with your email to activate.
            </p>
          </div>
        </div>

        {/* Footer - Sticky */}
        <div className="border-t border-gray-800 p-6 flex-shrink-0 bg-gradient-to-b from-transparent to-gray-950">
          <Button
            onClick={onClose}
            className="w-full bg-orange-600 hover:bg-orange-500 text-white font-bold h-12 rounded-lg transition-colors"
          >
            Got It
          </Button>
        </div>
      </div>
    </div>
  );
}
