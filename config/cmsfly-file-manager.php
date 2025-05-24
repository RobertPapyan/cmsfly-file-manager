<?php

use MatematCmsfly\CmsflyCore\Middleware\AuthorizeRouteName;

return [
    'routes' => [
        'web' => [
            'fm' => ['auth', 'auth.session', AuthorizeRouteName::class],
        ],
    ],
];
