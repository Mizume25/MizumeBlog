<?php

namespace App\Enums;

enum PostFilterType : string
{   
    case All = "all";
    case Publish = "publish";
    case Pendings = "pendings";
    case Drafts = "drafts";
}
