/**
 * @fileoverview Componentes de Blog Show
 */

import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from '@/components/animate-ui/components/radix/sidebar';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Nodo } from '@/services/MarkdownService';
import { createContext, useContext } from 'react';

/** Callback al pulsar un nodo del índice (evita pasarlo por los 6 niveles) */
const SelectContext = createContext<((n: Nodo) => void) | undefined>(undefined);

const Leaf = ({ n }: { n: Nodo }) => {
    const onSelect = useContext(SelectContext);

    return (
        <SidebarMenuSubItem>
            <SidebarMenuSubButton asChild>
                <a
                    href={`#${n.id}`}
                    onClick={(e) => {
                        if (!onSelect) return;
                        e.preventDefault();
                        onSelect(n);
                    }}
                >
                    <span>{n.title}</span>
                </a>
            </SidebarMenuSubButton>
        </SidebarMenuSubItem>
    );
};


const Header = ({ n }: { n: Nodo }) => {
    const onSelect = useContext(SelectContext);

    return (
        <CollapsibleTrigger nativeButton={false} render={<SidebarMenuSubButton />} onClick={() => onSelect?.(n)}>
            <span>{n.title}</span>
        </CollapsibleTrigger>
    );
};


const have = (n: Nodo) => !!n.children && n.children.length > 0;

interface BlogShowSidebarContentProps {
    data: Nodo[];
    /** Se llama al pulsar cualquier nodo (también los que abren/cierran grupo) */
    onSelect?: (n: Nodo) => void;
}

export const BlogShowSidebarContent = ({ data, onSelect }: BlogShowSidebarContentProps) => {
    return (
        <SelectContext.Provider value={onSelect}>
        <SidebarGroup>
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <SidebarMenu>

                {/* NIVEL 1 (##) */}
                {data.map((n1) => (
                    <Collapsible key={n1.id} defaultOpen className="group/collapsible">
                        <SidebarMenuItem>
                            <CollapsibleTrigger render={<SidebarMenuButton tooltip={n1.title} />} onClick={() => onSelect?.(n1)}>
                                <span>{n1.title}</span>
                            </CollapsibleTrigger>

                            {have(n1) && (
                                <CollapsibleContent>
                                    <SidebarMenuSub>

                                        {/* NIVEL 2 (###) */}
                                        {n1.children!.map((n2) =>
                                            !have(n2) ? (
                                              <Leaf key={n2.id} n={n2} />
                                            ) : (
                                                <Collapsible key={n2.id}>
                                                    <SidebarMenuSubItem>
                                                        <Header n={n2} />
                                                        <CollapsibleContent>
                                                            <SidebarMenuSub>

                                                                {/* NIVEL 3 (####) */}
                                                                {n2.children!.map((n3) =>
                                                                    !have(n3) ? (
                                                                      <Leaf key={n3.id} n={n3} />
                                                                    ) : (
                                                                        <Collapsible key={n3.id}>
                                                                            <SidebarMenuSubItem>
                                                                                <Header n={n3} />
                                                                                <CollapsibleContent>
                                                                                    <SidebarMenuSub>

                                                                                        {/* NIVEL 4 (#####) */}
                                                                                        {n3.children!.map((n4) =>
                                                                                            !have(n4) ? (
                                                                                              <Leaf key={n4.id} n={n4} />
                                                                                            ) : (
                                                                                                <Collapsible key={n4.id}>
                                                                                                    <SidebarMenuSubItem>
                                                                                                        <Header n={n4} />
                                                                                                        <CollapsibleContent>
                                                                                                            <SidebarMenuSub>

                                                                                                                {/* NIVEL 5 (######) */}
                                                                                                                {n4.children!.map((n5) =>
                                                                                                                    !have(n5) ? (
                                                                                                                      <Leaf key={n5.id} n={n5} />
                                                                                                                    ) : (
                                                                                                                        <Collapsible key={n5.id}>
                                                                                                                            <SidebarMenuSubItem>
                                                                                                                                <Header n={n5} />
                                                                                                                                <CollapsibleContent>
                                                                                                                                    <SidebarMenuSub>

                                                                                                                                        {/* NIVEL 6 (hojas finales) */}
                                                                                                                                        {n5.children!.map((n6) => (
                                                                                                                                          <Leaf key={n6.id} n={n6} />
                                                                                                                                        ))}

                                                                                                                                    </SidebarMenuSub>
                                                                                                                                </CollapsibleContent>
                                                                                                                            </SidebarMenuSubItem>
                                                                                                                        </Collapsible>
                                                                                                                    )
                                                                                                                )}

                                                                                                            </SidebarMenuSub>
                                                                                                        </CollapsibleContent>
                                                                                                    </SidebarMenuSubItem>
                                                                                                </Collapsible>
                                                                                            )
                                                                                        )}

                                                                                    </SidebarMenuSub>
                                                                                </CollapsibleContent>
                                                                            </SidebarMenuSubItem>
                                                                        </Collapsible>
                                                                    )
                                                                )}

                                                            </SidebarMenuSub>
                                                        </CollapsibleContent>
                                                    </SidebarMenuSubItem>
                                                </Collapsible>
                                            )
                                        )}

                                    </SidebarMenuSub>
                                </CollapsibleContent>
                            )}
                        </SidebarMenuItem>
                    </Collapsible>
                ))}

            </SidebarMenu>
        </SidebarGroup>
        </SelectContext.Provider>
    );
};




