<?php

namespace MatematCmsfly\CmsflyFileManager\Controllers;

use MatematCmsfly\CmsflyFileManager\FileManager;
use Alexusmai\LaravelFileManager\Controllers\FileManagerController as AlexFileManagerController;
use Alexusmai\LaravelFileManager\Requests\RequestValidator;
use Illuminate\Http\JsonResponse;


class FmController extends AlexFileManagerController
{
    public $fm;

    public function __construct(FileManager $fm)
    {
        $this->fm = $fm;
    }

    public function search(RequestValidator $request): JsonResponse
    {

        return response()->json(
            $this->fm->search(
                $request->input('disk'),
                $request->input('search')
                )
        );
    }

}