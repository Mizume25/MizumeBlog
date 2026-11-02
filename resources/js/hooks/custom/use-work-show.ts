import { useRef } from "react"


export default function useWorkShow() {

    const mainRef = useRef<HTMLDivElement>(null)
    return {
        mainRef
    }
}