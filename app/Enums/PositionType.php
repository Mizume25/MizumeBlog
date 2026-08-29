<?php

namespace App\Enums;

enum PositionType: string
{
    /** Only Sentence */
    case Top = 'top';
    case Center = 'center';
    case Bottom = 'bottom';
    case Left = 'left';
    case Right = 'right';

    /** Compost Sentence */
    case TopLeft = 'top left';
    case TopRight = 'top right';
    case TopCenter = 'top center';

    case CenterLeft = 'center left';
    case CenterRight = 'center right';
    case CenterCenter = 'center center';

    case BottomLeft = 'bottom left';
    case BottomRight = 'bottom right';
    case BottomCenter = 'bottom center';
}

?>