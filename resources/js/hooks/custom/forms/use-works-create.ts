/**
 * @fileoverview Variables de estado del fomrulario Work Create
 */

import { WorkFormHandler } from "@/core/forms/work-form";
import { useRef } from "react";

export  default function useWorkCreate() {
    const formRef = useRef<WorkFormHandler>(null);

    return {
        formRef
    }
}


