import { User } from "@/types/definitions"
import { useRef, useState } from "react"


export default function useWorkShow() {

    const mainRef = useRef<HTMLDivElement>(null)




    return {
        mainRef
    }
}