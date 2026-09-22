import React from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from './Modal';
import { Badge } from './Badge';

export const ApprovalQueueModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose
}) => {
  const { approvals, resolveApproval } = useApp();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Inson Tasdiqlash Navbati (Human Approval Queue)"
      subtitle="Tashqi tizimlar va Telegram kanallariga chiqadigan harakatlarni nazorat qilish"
      maxWidth="lg"
    >
      <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar pr-1">
        {approvals.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-6">Kutilayotgan tasdiqlar yo‘q.</p>
        ) : (
          approvals.map(req => (
            <div key={req.id} className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-sm">{req.title}</span>
                <Badge variant={req.status === 'pending' ? 'amber' : req.status === 'approved' ? 'green' : 'red'} size="sm">
                  {req.status === 'pending' ? 'Kutilmoqda' : req.status}
                </Badge>
              </div>

              <p className="text-slate-400">{req.description}</p>

              <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
                <span>So‘rovchi: <strong className="text-slate-300">{req.requesterAgentName}</strong></span>
                <span>Manzil: <strong className="text-sky-400">{req.destination || 'Telegram'}</strong></span>
              </div>

              {req.status === 'pending' && (
                <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-800">
                  <button
                    onClick={() => resolveApproval(req.id, 'rejected')}
                    className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-rose-300 rounded font-medium transition"
                  >
                    Rad etish
                  </button>
                  <button
                    onClick={() => resolveApproval(req.id, 'approved')}
                    className="px-3.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded shadow transition"
                  >
                    Tasdiqlash & Yuborish
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </Modal>
  );
};
