/**
 * @fileoverview Componentes de Blog Show
 */

import * as React from 'react';
import { PanelRightClose, PanelRightOpen } from 'lucide-react';
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarHeader,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from '@/components/animate-ui/components/radix/sidebar';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from '@/components/animate-ui/components/radix/sheet';
import { Button } from '@/components/animate-ui/components/buttons/button';
import { cn } from '@/lib/utils';

import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { ArrowRight } from 'lucide-react';
import useBlogShow, { BlogShowContext, useBlogShowContext } from '@/hooks/custom/use-blog-show';
import type { BlogShowProps, Nodo } from '@/types/custom/blog-show-types';

const Leaf = ({ n }: { n: Nodo }) => (
    <SidebarMenuSubItem>
        <SidebarMenuSubButton asChild>
            <a href={`#${n.id}`}>
                <span>{n.title}</span>
            </a>
        </SidebarMenuSubButton>
    </SidebarMenuSubItem>
);


const Header = ({ n }: { n: Nodo }) => (
    <CollapsibleTrigger >
        <SidebarMenuSubButton>
            <span>{n.title}</span>
        </SidebarMenuSubButton>
    </CollapsibleTrigger>
);


const have = (n: Nodo) => !!n.children && n.children.length > 0;

export const BlogShowSidebarContent = ({ data }: { data: Nodo[] }) => {
    return (
        <SidebarGroup>
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <SidebarMenu>

                {/* NIVEL 1 (##) */}
                {data.map((n1) => (
                    <Collapsible key={n1.id} defaultOpen className="group/collapsible">
                        <SidebarMenuItem>
                            <CollapsibleTrigger >
                                <SidebarMenuButton tooltip={n1.title}>
                                    <span>{n1.title}</span>
                                </SidebarMenuButton>
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
    );
};




