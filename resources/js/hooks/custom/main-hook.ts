import { WorkRecord } from "@/types/definitions";
import { useCallback, useState } from "react";
/**
 * Hook de funcio Principal del hook 
 */
export function useMainHook(workSelect: WorkRecord) {


    const [work, SetWork] = useState<WorkRecord>(workSelect);

    const changeWork = useCallback((newWork: WorkRecord) => {
        SetWork(newWork);
    }, []);
    

    return {
        work,
        changeWork
    }

}