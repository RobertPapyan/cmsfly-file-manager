<?php

namespace MatematCmsfly\CmsflyFileManager\Controllers;

use Illuminate\Routing\Controller;
use Inertia\Inertia;
use Inertia\Response;

class FileManagerController extends Controller
{


    public function index(): Response
    {
        return Inertia::render('file-manager/Index');
    }
}
