import { AUTHOR_LABELS, BlogItems, DATA_ENTITIES } from "@/core/desktop/utils-components";
import { Author } from "@/types/definitions";

/**
 * @fileoverview Archivo de el componente 
 */


interface AuthorCardProps {
    author: Author
    avatarUrl?: string;
    labels: AUTHOR_LABELS
}



export default function AuthorCard({
    author,
    avatarUrl,
    labels
}: AuthorCardProps) {


    const info: Record<string, unknown> = {
        name: author.name,
        last_name: author.last_name,
        birth_year: author.birth_year,
        pseudonym: author.pseudonym,
        description: author.description,
    }

    return (
        <div className="w-full h-auto bg-card text-card-foreground rounded-2xl flex flex-col items-center gap-4 p-6 transition-transform duration-300 ease-in-out hover:scale-105 hover:z-10">
            <div className="shrink-0 w-24 h-24 sm:w-32 sm:h-32 bg-white rounded-full overflow-hidden flex items-center justify-center">
                {avatarUrl && (
                    <img
                        src={avatarUrl}
                        alt={`${author.name} ${author.last_name}`}
                        className="w-full h-full object-cover"
                    />
                )}
            </div>

            <div className="w-full min-w-0">
                <BlogItems
                    data={info}
                    formatKey={(key) => (labels as Record<string, string>)[key] ?? key.replace(/_/g, " ")}
                    formatValue={(value) =>
                        value === null || value === undefined || value === "" ? "—" : String(value)
                    }
                    keyClass="text-sm capitalize lg:text-md bg-card-muted text-card-muted-foreground rounded-lg p-1"
                    labelClass="justify-self-start break-words rounded-lg px-2 py-1 text-sm capitalize lg:px-3 lg:text-md bg-card-muted rounded-lg p-1 text-card-muted-foreground"
                />
            </div>
        </div>
    );
}