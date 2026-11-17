/**
 * @fileoverview Comandos propios de la barra de MDEditor.
 *
 * Fórmulas para remarkMath + rehypeMathjax (los usa MarkdownRenderer):
 *  - en línea: $...$
 *  - en bloque: $$ ... $$ (líneas propias)
 */

import { commands, ICommand, TextAreaTextApi, TextState } from '@uiw/react-md-editor';
import { Sigma, SquareSigma } from 'lucide-react';

/**
 * Envuelve la selección entre `before` y `after`.
 * Sin selección deja el cursor entre los delimitadores para escribir directamente.
 */
const wrap = (state: TextState, api: TextAreaTextApi, before: string, after: string) => {
    const selected = state.selectedText;

    api.replaceSelection(`${before}${selected}${after}`);

    const start = state.selection.start + before.length;
    api.setSelectionRange({ start, end: start + selected.length });
};

/** Fórmula en línea: $x^2$ */
export const mathInline: ICommand = {
    name: 'math-inline',
    keyCommand: 'math-inline',
    buttonProps: { 'aria-label': 'Inline formula ($...$)', title: 'Inline formula ($...$)' },
    icon: <Sigma size={12} />,
    execute: (state, api) => wrap(state, api, '$', '$'),
};

/** Fórmula en bloque: $$ en líneas propias (remarkMath lo exige para el modo display) */
export const mathBlock: ICommand = {
    name: 'math-block',
    keyCommand: 'math-block',
    buttonProps: { 'aria-label': 'Block formula ($$...$$)', title: 'Block formula ($$...$$)' },
    icon: <SquareSigma size={12} />,
    execute: (state, api) => wrap(state, api, '\n$$\n', '\n$$\n'),
};

/** Barra por defecto + separador + fórmulas */
export const EDITOR_COMMANDS: ICommand[] = [
    ...commands.getCommands(),
    commands.divider,
    mathInline,
    mathBlock,
];
