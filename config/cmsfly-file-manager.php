<?php

use MatematCmsfly\CmsflyCore\Middleware\AuthorizeRouteName;

return [
    'routes' => [
        'web' => [
            'file-manager' => ['web', 'auth', AuthorizeRouteName::class],
        ],
        'api' => [

        ],
    ],
];
