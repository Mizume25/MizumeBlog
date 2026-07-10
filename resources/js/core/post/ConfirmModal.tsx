import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { useState } from 'react';


function ConfirmModal() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <button onClick={() => setIsOpen(true)}>Abrir modal</button>

            <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
                {/* Fondo oscuro */}
                <div className="fixed inset-0 bg-black/50" aria-hidden="true" />

                {/* Contenedor centrado */}
                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <DialogPanel className="w-full max-w-md rounded-lg bg-white p-6">
                        <DialogTitle className="text-lg font-bold">
                            Título del modal
                        </DialogTitle>

                        <p className="mt-2 text-sm text-gray-600">
                            Contenido del modal aquí.
                        </p>

                        <div className="mt-4 flex justify-end gap-2">
                            <button onClick={() => setIsOpen(false)}>Cancelar</button>
                            <button onClick={() => setIsOpen(false)}>Confirmar</button>
                        </div>
                    </DialogPanel>
                </div>
            </Dialog>
        </>
    );
}

export default ConfirmModal