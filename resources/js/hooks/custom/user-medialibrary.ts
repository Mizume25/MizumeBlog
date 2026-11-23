import { MediaFilter, MediaType } from "@/constants/media-constants";
import { useState } from "react";


export function useMediaLibrary(filters: MediaFilter) {


    const [type, setType] = useState<MediaType | null>(null);
    const [search_artist, setSearchArtist] = useState(null);
    const [search_name, setSearchName] = useState(null);
    const [work, setWork] = useState(null);



    return {

    }
}