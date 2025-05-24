<?php

namespace MatematCmsfly\CmsflyFileManager;

use Alexusmai\LaravelFileManager\FileManager as AlexFileManagerFileManager;
use Alexusmai\LaravelFileManager\Services\ConfigService\ConfigRepository;
use MatematCmsfly\CmsflyFileManager\Traits\SearchTrait;

class FileManager extends AlexFileManagerFileManager
{
    use SearchTrait;

    public function __construct(ConfigRepository $configRepository)
    {
        $this->configRepository = $configRepository;
    }

    public function search($disk, $search): array
    {
        $content = $this->getSearchContent($disk, $search);

        return [
            'result' => [
                'status' => 'success',
                'message' => null,
            ],
            'directories' => $content['directories'],
            'files' => $content['files'],
        ];
    }
}
