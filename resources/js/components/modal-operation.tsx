import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';

interface ModalOperation {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    title: string;
}

function ModalOperation({ isOpen, onClose, title, children }: ModalOperation) {
    return (
        <Dialog open={isOpen} onClose={onClose} className="relative z-50">
            <div className="fixed inset-0 bg-black/50" aria-hidden="true" />

            <div className="fixed inset-0 flex items-center justify-center overflow-y-auto p-4">
                <DialogPanel className="max-h-[90vh] w-full max-w-4xl rounded-2xl bg-white p-6">
                    <DialogTitle className="text-lg font-bold">{title}</DialogTitle>
                    {children}
                </DialogPanel>
            </div>
        </Dialog>
    );
}

export default ModalOperation;
