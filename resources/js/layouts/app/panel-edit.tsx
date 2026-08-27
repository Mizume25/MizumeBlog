function PanelEdit({children} : {children: React.ReactNode}) {
    return (
        <div className="animate-fade-in fixed right-8 bottom-8 z-[9999] text-white">
            <div className="w-80 max-w-md scale-100 transform rounded-xl  p-6 shadow-2xl transition-all bg-gray-800">
                <h3 className="mb-2 text-lg font-bold text-white">Panel de Edición</h3>
                {children}
            </div>
        </div>
    );
}

export default PanelEdit;
